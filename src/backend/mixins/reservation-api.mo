import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import ReservationLib "../lib/reservation";
import SeatingLib "../lib/seating";
import ReservationTypes "../types/reservation";
import ExperienceTypes "../types/experience";
import SeatingTypes "../types/seating";
import CommonTypes "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  reservations : Map.Map<CommonTypes.ReservationId, ReservationTypes.Reservation>,
  reservationCounter : List.List<Nat>,
  experiences : Map.Map<CommonTypes.ExperienceId, ExperienceTypes.Experience>,
  restaurantConfig : List.List<{ restaurantName : Text; totalSeatsPerSlot : Nat; openingHour : Nat; closingHour : Nat; slotIntervalMinutes : Nat }>,
  tables : Map.Map<SeatingTypes.TableId, SeatingTypes.Table>,
) {
  func getConfig() : { totalSeatsPerSlot : Nat; openingHour : Nat; closingHour : Nat; slotIntervalMinutes : Nat } {
    let c = restaurantConfig.at(0);
    { totalSeatsPerSlot = c.totalSeatsPerSlot; openingHour = c.openingHour; closingHour = c.closingHour; slotIntervalMinutes = c.slotIntervalMinutes };
  };

  // Convert nanosecond epoch to YYYY-MM-DD string
  func epochNsToDateString(ns : Int) : Text {
    let seconds = Int.abs(ns) / 1_000_000_000;
    var days = seconds / 86400;
    var year : Nat = 1970;
    label yearLoop while (true) {
      let daysInYear : Nat = if ((year % 4 == 0 and year % 100 != 0) or year % 400 == 0) 366 else 365;
      if (days < daysInYear) break yearLoop;
      days -= daysInYear;
      year += 1;
    };
    let isLeap = (year % 4 == 0 and year % 100 != 0) or year % 400 == 0;
    let monthDays : [Nat] = if (isLeap)
      [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    else
      [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var month : Nat = 0;
    label monthLoop while (month < 12) {
      if (days < monthDays[month]) break monthLoop;
      days -= monthDays[month];
      month += 1;
    };
    let day = days + 1;
    let m = month + 1;
    let yStr = year.toText();
    let mStr = if (m < 10) "0" # m.toText() else m.toText();
    let dStr = if (day < 10) "0" # day.toText() else day.toText();
    yStr # "-" # mStr # "-" # dStr;
  };

  func todayString() : Text {
    epochNsToDateString(Time.now());
  };

  func thisMonthString() : Text {
    let today = todayString();
    // YYYY-MM-DD → take first 7 chars = YYYY-MM
    let chars = today.toArray();
    if (chars.size() >= 7) {
      Text.fromArray(chars.sliceToArray(0, 7));
    } else {
      today;
    };
  };

  public shared ({ caller }) func createReservation(
    guestId : CommonTypes.GuestId,
    date : Text,
    time : Text,
    partySize : Nat,
    experienceId : ?CommonTypes.ExperienceId,
    stripePaymentIntentId : ?Text,
    specialRequests : ?Text,
  ) : async ReservationTypes.Reservation {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let config = getConfig();
    let reservation = ReservationLib.create(
      reservations,
      reservationCounter,
      guestId,
      date,
      time,
      partySize,
      experienceId,
      stripePaymentIntentId,
      specialRequests,
      Time.now(),
      config.totalSeatsPerSlot,
    );
    // Auto-assign best available table (best-effort, non-fatal if none available)
    switch (SeatingLib.findBestTable(tables, partySize, [])) {
      case null {};
      case (?t) {
        ignore SeatingLib.assignReservationToTable(tables, t.id, reservation.id, guestId, partySize);
      };
    };
    reservation;
  };

  /// Create a reservation with full guest details — for use from the dashboard.
  /// Accepts a guestName, phone, email directly (no pre-existing guest record required).
  /// Automatically assigns the best available table to the new reservation.
  /// Returns #ok with the created Reservation, or #err with a message.
  public shared ({ caller }) func createReservationWithDetails(
    guestName : Text,
    phone : Text,
    email : Text,
    partySize : Nat,
    date : Text,
    timeSlot : Text,
    tableId : ?Text,
    notes : ?Text,
  ) : async { #ok : ReservationTypes.Reservation; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };
    if (guestName == "") {
      return #err("Guest name cannot be empty");
    };
    if (phone == "") {
      return #err("Phone number cannot be empty");
    };
    if (partySize < 1) {
      return #err("Party size must be at least 1");
    };
    let today = todayString();
    if (date < today) {
      return #err("Reservation date cannot be in the past");
    };

    let config = getConfig();
    // Use guestName as guestId placeholder (dashboard flow — guest record lookup is separate)
    let guestId : CommonTypes.GuestId = guestName # "|" # phone;
    let reservation = ReservationLib.create(
      reservations,
      reservationCounter,
      guestId,
      date,
      timeSlot,
      partySize,
      null,
      null,
      notes,
      Time.now(),
      config.totalSeatsPerSlot,
    );

    // Auto-assign table: prefer explicitly requested tableId, else find best available
    switch (tableId) {
      case (?tid) {
        // Assign to explicitly specified table (best-effort)
        ignore SeatingLib.assignReservationToTable(tables, tid, reservation.id, guestName, partySize);
      };
      case null {
        // Smart auto-assignment: smallest table >= partySize, or a group if no single table fits
        switch (SeatingLib.findBestTable(tables, partySize, [])) {
          case (?t) {
            ignore SeatingLib.assignReservationToTable(tables, t.id, reservation.id, guestName, partySize);
          };
          case null {
            // Try group assignment
            switch (SeatingLib.findBestTableGroup(tables, partySize)) {
              case null {};
              case (?(_, groupTables)) {
                SeatingLib.assignReservationToGroup(tables, groupTables, reservation.id, guestName, partySize);
              };
            };
          };
        };
      };
    };

    #ok(reservation);
  };

  /// Update mutable fields of an existing reservation (date, time, partySize, specialRequests).
  /// Staff and admins may update. Returns #ok or #err.
  public shared ({ caller }) func updateReservation(
    id : CommonTypes.ReservationId,
    date : Text,
    time : Text,
    partySize : Nat,
    specialRequests : ?Text,
  ) : async { #ok : ReservationTypes.Reservation; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };
    if (partySize < 1) {
      return #err("Party size must be at least 1");
    };
    switch (reservations.get(id)) {
      case null { #err("Reservation not found") };
      case (?r) {
        let updated : ReservationTypes.Reservation = {
          r with
          date;
          time;
          partySize;
          specialRequests;
        };
        reservations.add(id, updated);
        #ok(updated);
      };
    };
  };

  public query func getReservation(id : CommonTypes.ReservationId) : async ?ReservationTypes.Reservation {
    ReservationLib.get(reservations, id);
  };

  public query func listReservations(filter : ReservationTypes.ReservationFilter) : async [ReservationTypes.Reservation] {
    ReservationLib.list(reservations, filter);
  };

  public shared ({ caller }) func updateReservationStatus(
    id : CommonTypes.ReservationId,
    status : ReservationTypes.ReservationStatus,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ReservationLib.updateStatus(reservations, id, status);
  };

  public shared ({ caller }) func cancelReservation(id : CommonTypes.ReservationId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ReservationLib.cancel(reservations, id);
  };

  public query func getAvailableSlots(date : Text) : async [ReservationTypes.TimeSlot] {
    let config = getConfig();
    ReservationLib.getAvailableSlots(
      reservations,
      date,
      config.totalSeatsPerSlot,
      config.openingHour,
      config.closingHour,
      config.slotIntervalMinutes,
    );
  };

  public query func getKPIs() : async ReservationTypes.KPIs {
    let config = getConfig();
    let today = todayString();
    let thisMonth = thisMonthString();
    ReservationLib.getKPIs(
      reservations,
      experiences,
      today,
      thisMonth,
      config.totalSeatsPerSlot,
      config.openingHour,
      config.closingHour,
      config.slotIntervalMinutes,
    );
  };
};
