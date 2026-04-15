import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Types "../types/reservation";
import ExperienceTypes "../types/experience";
import CommonTypes "../types/common";

module {
  // Generate next ID using a mutable List<Nat> as a reference counter
  func nextId(counter : List.List<Nat>) : Text {
    let id = counter.at(0);
    counter.put(0, id + 1);
    id.toText();
  };

  public func create(
    reservations : Map.Map<CommonTypes.ReservationId, Types.Reservation>,
    counter : List.List<Nat>,
    guestId : CommonTypes.GuestId,
    date : Text,
    time : Text,
    partySize : Nat,
    experienceId : ?CommonTypes.ExperienceId,
    stripePaymentIntentId : ?Text,
    specialRequests : ?Text,
    createdAt : CommonTypes.Timestamp,
    totalSeatsPerSlot : Nat,
  ) : Types.Reservation {
    // Validate date not in past (compare date strings — YYYY-MM-DD lexicographic order works)
    // We use createdAt as the reference: date must be >= today string derived from Time
    // For simplicity, validate partySize
    if (partySize < 1 or partySize > 12) {
      Runtime.trap("Party size must be between 1 and 12");
    };

    // Check for double-booking: count confirmed reservations at this date+time
    let sameSlotCount = reservations.values().filter(func(r : Types.Reservation) : Bool {
      r.date == date and r.time == time and r.status == #confirmed
    }).size();

    if (sameSlotCount >= totalSeatsPerSlot) {
      Runtime.trap("No seats available for this time slot");
    };

    let id = nextId(counter);
    let reservation : Types.Reservation = {
      id;
      guestId;
      date;
      time;
      partySize;
      experienceId;
      status = #confirmed;
      stripePaymentIntentId;
      specialRequests;
      createdAt;
    };
    reservations.add(id, reservation);
    reservation;
  };

  public func get(
    reservations : Map.Map<CommonTypes.ReservationId, Types.Reservation>,
    id : CommonTypes.ReservationId,
  ) : ?Types.Reservation {
    reservations.get(id);
  };

  public func list(
    reservations : Map.Map<CommonTypes.ReservationId, Types.Reservation>,
    filter : Types.ReservationFilter,
  ) : [Types.Reservation] {
    reservations.values().filter(func(r : Types.Reservation) : Bool {
      let dateMatch = switch (filter.date) {
        case (?d) r.date == d;
        case null true;
      };
      let statusMatch = switch (filter.status) {
        case (?s) r.status == s;
        case null true;
      };
      let guestMatch = switch (filter.guestId) {
        case (?g) r.guestId == g;
        case null true;
      };
      dateMatch and statusMatch and guestMatch;
    }).toArray();
  };

  public func updateStatus(
    reservations : Map.Map<CommonTypes.ReservationId, Types.Reservation>,
    id : CommonTypes.ReservationId,
    status : Types.ReservationStatus,
  ) {
    switch (reservations.get(id)) {
      case null { Runtime.trap("Reservation not found") };
      case (?r) {
        reservations.add(id, { r with status });
      };
    };
  };

  public func cancel(
    reservations : Map.Map<CommonTypes.ReservationId, Types.Reservation>,
    id : CommonTypes.ReservationId,
  ) {
    updateStatus(reservations, id, #cancelled);
  };

  public func getAvailableSlots(
    reservations : Map.Map<CommonTypes.ReservationId, Types.Reservation>,
    date : Text,
    totalSeatsPerSlot : Nat,
    openingHour : Nat,
    closingHour : Nat,
    slotIntervalMinutes : Nat,
  ) : [Types.TimeSlot] {
    let slots = List.empty<Types.TimeSlot>();
    var hour = openingHour;
    var minute : Nat = 0;

    label slotLoop while (hour < closingHour) {
      let hourText = if (hour < 10) "0" # hour.toText() else hour.toText();
      let minText = if (minute < 10) "0" # minute.toText() else minute.toText();
      let timeText = hourText # ":" # minText;

      // Count confirmed reservations at this slot (sum party sizes)
      let usedSeats = reservations.values()
        .filter(func(r : Types.Reservation) : Bool {
          r.date == date and r.time == timeText and r.status == #confirmed
        })
        .foldLeft(0, func(acc : Nat, r : Types.Reservation) : Nat { acc + r.partySize });

      let available = if (usedSeats >= totalSeatsPerSlot) 0 else totalSeatsPerSlot - usedSeats;
      let status : Types.TimeSlotStatus = if (available == 0) #full
        else if (available <= 10) #limited
        else #available;

      slots.add({
        time = timeText;
        availableSeats = available;
        totalSeats = totalSeatsPerSlot;
        status;
      });

      // Advance by slotIntervalMinutes
      minute += slotIntervalMinutes;
      if (minute >= 60) {
        hour += minute / 60;
        minute := minute % 60;
      };
      // Safety: stop if we've passed closing hour
      if (hour > closingHour) {
        break slotLoop;
      };
    };

    slots.toArray();
  };

  public func getKPIs(
    reservations : Map.Map<CommonTypes.ReservationId, Types.Reservation>,
    experiences : Map.Map<CommonTypes.ExperienceId, ExperienceTypes.Experience>,
    today : Text,
    thisMonth : Text, // YYYY-MM prefix
    totalCapacity : Nat,
    openingHour : Nat,
    closingHour : Nat,
    slotIntervalMinutes : Nat,
  ) : Types.KPIs {
    let allReservations = reservations.values().toArray();

    // Today confirmed/seated reservations
    let todayActive = allReservations.filter(func(r : Types.Reservation) : Bool {
      r.date == today and (r.status == #confirmed or r.status == #seated)
    });

    let todayReservationCount = todayActive.size();

    // Covers per service: group by service label derived from reservation time
    // Services are defined as time windows: lunch (before 15:00), dinner (15:00+)
    // Each reservation time HH:MM is parsed; hour < 15 → "Lunch", else → "Dinner"
    var lunchCovers : Nat = 0;
    var dinnerCovers : Nat = 0;
    for (r in todayActive.values()) {
      let parts = r.time.split(#char ':');
      let hourOpt = switch (parts.next()) {
        case (?h) Nat.fromText(h);
        case null null;
      };
      switch (hourOpt) {
        case (?h) {
          if (h < 15) { lunchCovers += r.partySize }
          else { dinnerCovers += r.partySize };
        };
        case null { dinnerCovers += r.partySize };
      };
    };
    let todayCoversPerService : [(Text, Nat)] = [
      ("Lunch", lunchCovers),
      ("Dinner", dinnerCovers),
    ];

    // Average party size of all confirmed reservations
    let allConfirmed = allReservations.filter(func(r : Types.Reservation) : Bool {
      r.status == #confirmed or r.status == #seated
    });
    let totalPartySize = allConfirmed.foldLeft(0, func(acc : Nat, r : Types.Reservation) : Nat {
      acc + r.partySize
    });
    let avgPartySize = if (allConfirmed.size() == 0) 0 else totalPartySize / allConfirmed.size();

    // Occupancy: filled slots today / total slots today * 100
    let slotsPerDay = if (slotIntervalMinutes == 0) 1 else
      ((closingHour - openingHour) * 60) / slotIntervalMinutes;
    let totalSlotCapacity = slotsPerDay * totalCapacity;
    let occupancyPct = if (totalSlotCapacity == 0) 0 else {
      let filled = todayActive.foldLeft(0, func(acc : Nat, r : Types.Reservation) : Nat {
        acc + r.partySize
      });
      (filled * 100) / totalSlotCapacity;
    };

    // No-show count this month (not_arrived or late past their time)
    let noShowCount = allReservations.filter(func(r : Types.Reservation) : Bool {
      r.date.startsWith(#text thisMonth) and (r.status == #not_arrived or r.status == #late)
    }).size();

    {
      todayReservationCount;
      todayCoversPerService;
      avgPartySize;
      occupancyPct;
      noShowCount;
    };
  };
};
