import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Types "../types/reservation";
import ExperienceTypes "../types/experience";
import CommonTypes "../types/common";
import WaitlistTypes "../types/waitlist";
import SettingsTypes "../types/settings";
import TeamTypes "../types/team";
import ValidateLib "validate";

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
    notes : ?Text,
    createdAt : CommonTypes.Timestamp,
    totalSeatsPerSlot : Nat,
  ) : Types.Reservation {
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
      notes;
      tableId = null;
      createdAt;
      updatedAt = createdAt;
      zone = null;
      changes = [];
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
  ) : { #ok : [Types.Reservation]; #err : Text } {
    // SEC-011: validate date and time filter fields before using them
    switch (filter.date) {
      case (?d) {
        switch (ValidateLib.validateDate(d)) {
          case (#err(msg)) { return #err(msg) };
          case (#ok(_)) {};
        };
      };
      case null {};
    };
    switch (filter.time) {
      case (?t) {
        switch (ValidateLib.validateTime(t)) {
          case (#err(msg)) { return #err(msg) };
          case (#ok(_)) {};
        };
      };
      case null {};
    };
    let results = reservations.values().filter(func(r : Types.Reservation) : Bool {
      let dateMatch = switch (filter.date) {
        case (?d) r.date == d;
        case null true;
      };
      let timeMatch = switch (filter.time) {
        case (?t) r.time == t;
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
      dateMatch and timeMatch and statusMatch and guestMatch;
    }).toArray();
    #ok(results);
  };

  public func updateStatus(
    reservations : Map.Map<CommonTypes.ReservationId, Types.Reservation>,
    id : CommonTypes.ReservationId,
    status : Types.ReservationStatus,
  ) {
    switch (reservations.get(id)) {
      case null { Runtime.trap("Reservation not found") };
      case (?r) {
        reservations.add(id, { r with status; updatedAt = Time.now() });
      };
    };
  };

  public func cancel(
    reservations : Map.Map<CommonTypes.ReservationId, Types.Reservation>,
    id : CommonTypes.ReservationId,
  ) {
    updateStatus(reservations, id, #cancelled);
  };

  /// Resolve caller to (name, role) from team store.
  func resolveCallerInfo(callerText : Text, teamStore : List.List<TeamTypes.TeamMember>) : (Text, Text) {
    switch (teamStore.find(func(m : TeamTypes.TeamMember) : Bool { m.principalId == callerText })) {
      case (?member) { (member.name, member.role) };
      case null      { ("Owner", "owner") };
    };
  };

  /// Append a ReservationChange to an existing reservation.
  /// If the reservation is not found, this is a no-op.
  public func logChange(
    reservations  : Map.Map<CommonTypes.ReservationId, Types.Reservation>,
    changeCounter : List.List<Nat>,
    teamStore     : List.List<TeamTypes.TeamMember>,
    reservationId : CommonTypes.ReservationId,
    callerText    : Text,
    fieldName     : Text,
    oldValue      : Text,
    newValue      : Text,
  ) {
    switch (reservations.get(reservationId)) {
      case null {};
      case (?r) {
        let (callerName, callerRole) = resolveCallerInfo(callerText, teamStore);
        let changeId = nextId(changeCounter);
        let change : Types.ReservationChange = {
          id            = changeId;
          timestamp     = Time.now();
          changedBy     = callerText;
          changedByName = callerName;
          changedByRole = callerRole;
          field         = fieldName;
          oldValue;
          newValue;
        };
        let updatedChanges = r.changes.concat([change]);
        reservations.add(reservationId, { r with changes = updatedChanges; updatedAt = Time.now() });
      };
    };
  };

  /// Full update of a reservation. Logs a change entry for each field that changed.
  /// Returns the updated reservation or an error.
  public func updateFull(
    reservations  : Map.Map<CommonTypes.ReservationId, Types.Reservation>,
    changeCounter : List.List<Nat>,
    teamStore     : List.List<TeamTypes.TeamMember>,
    id            : CommonTypes.ReservationId,
    callerText    : Text,
    newDate       : Text,
    newTime       : Text,
    newPartySize  : Nat,
    newSpecialRequests : ?Text,
    newStatus     : ?Types.ReservationStatus,
    newExperienceId    : ?CommonTypes.ExperienceId,
    newNotes      : ?Text,
    newTableId    : ?Text,
  ) : { #ok : Types.Reservation; #err : Text } {
    switch (ValidateLib.validatePartySize(newPartySize)) {
      case (#err(msg)) { return #err(msg) };
      case (#ok(_)) {};
    };
    switch (reservations.get(id)) {
      case null { #err("Reservation not found") };
      case (?r) {
        let (callerName, callerRole) = resolveCallerInfo(callerText, teamStore);
        let now = Time.now();
        let changeId = changeCounter.at(0);

        // Build list of changes for each modified field
        var newChanges : [Types.ReservationChange] = r.changes;

        func addChange(fieldName : Text, oldVal : Text, newVal : Text) {
          if (oldVal != newVal) {
            let c : Types.ReservationChange = {
              id            = (changeId + newChanges.size()).toText();
              timestamp     = now;
              changedBy     = callerText;
              changedByName = callerName;
              changedByRole = callerRole;
              field         = fieldName;
              oldValue      = oldVal;
              newValue      = newVal;
            };
            newChanges := newChanges.concat([c]);
          };
        };

        addChange("date", r.date, newDate);
        addChange("time", r.time, newTime);
        addChange("partySize", r.partySize.toText(), newPartySize.toText());

        let oldSpecial = switch (r.specialRequests) { case (?v) v; case null "" };
        let nwSpecial  = switch (newSpecialRequests) { case (?v) v; case null "" };
        addChange("specialRequests", oldSpecial, nwSpecial);

        let oldNotes = switch (r.notes) { case (?v) v; case null "" };
        let nwNotes  = switch (newNotes)  { case (?v) v; case null "" };
        addChange("notes", oldNotes, nwNotes);

        let oldTableId = switch (r.tableId) { case (?v) v; case null "" };
        let nwTableId  = switch (newTableId) { case (?v) v; case null "" };
        addChange("tableId", oldTableId, nwTableId);

        let oldExpId = switch (r.experienceId) { case (?v) v; case null "" };
        let nwExpId  = switch (newExperienceId) { case (?v) v; case null "" };
        addChange("experienceId", oldExpId, nwExpId);

        let resolvedStatus = switch (newStatus) { case (?s) s; case null r.status };
        let oldStatusText = debug_show(r.status);
        let nwStatusText  = debug_show(resolvedStatus);
        addChange("status", oldStatusText, nwStatusText);

        // Advance the change counter by how many new entries were appended
        let addedCount = newChanges.size() - r.changes.size();
        changeCounter.put(0, changeId + addedCount);

        let updated : Types.Reservation = {
          r with
          date             = newDate;
          time             = newTime;
          partySize        = newPartySize;
          specialRequests  = newSpecialRequests;
          notes            = newNotes;
          tableId          = newTableId;
          experienceId     = newExperienceId;
          status           = resolvedStatus;
          updatedAt        = now;
          changes          = newChanges;
        };
        reservations.add(id, updated);
        #ok(updated);
      };
    };
  };

  /// Returns all change log entries for a reservation.
  public func getChanges(
    reservations : Map.Map<CommonTypes.ReservationId, Types.Reservation>,
    id           : CommonTypes.ReservationId,
  ) : { #ok : [Types.ReservationChange]; #err : Text } {
    switch (reservations.get(id)) {
      case null { #err("Reservation not found") };
      case (?r) { #ok(r.changes) };
    };
  };

  // Parse "HH:MM" into total minutes since midnight. Returns 0 on parse failure.
  func parseTimeToMinutes(t : Text) : Nat {
    let parts = t.split(#char ':').toArray();
    if (parts.size() == 2) {
      switch (Nat.fromText(parts[0]), Nat.fromText(parts[1])) {
        case (?h, ?m) { h * 60 + m };
        case _ { 0 };
      };
    } else { 0 };
  };

  // Format total minutes since midnight as "HH:MM".
  func minutesToTimeText(totalMin : Nat) : Text {
    let h = totalMin / 60;
    let m = totalMin % 60;
    let hStr = if (h < 10) "0" # h.toText() else h.toText();
    let mStr = if (m < 10) "0" # m.toText() else m.toText();
    hStr # ":" # mStr;
  };

  public func getAvailableSlots(
    reservations : Map.Map<CommonTypes.ReservationId, Types.Reservation>,
    date : Text,
    totalSeatsPerSlot : Nat,
    openingHour : Nat,
    closingHour : Nat,
    slotIntervalMinutes : Nat,
    fixedClosingDays : [Nat],
    services : [SettingsTypes.ServiceHours],
  ) : Types.AvailableSlotsResponse {
    // Compute the day-of-week for `date` (YYYY-MM-DD) using epoch math.
    // Returns 0=Sunday, 1=Monday, ..., 6=Saturday — matching JS Date.getDay().
    let dayOfWeek : Nat = do {
      let parts = date.split(#char '-').toArray();
      if (parts.size() == 3) {
        let yOpt = Nat.fromText(parts[0]);
        let mOpt = Nat.fromText(parts[1]);
        let dOpt = Nat.fromText(parts[2]);
        switch (yOpt, mOpt, dOpt) {
          case (?y, ?m, ?day) {
            var totalDays : Nat = 0;
            var yr : Nat = 1970;
            while (yr < y) {
              let leap = (yr % 4 == 0 and yr % 100 != 0) or yr % 400 == 0;
              totalDays += if (leap) 366 else 365;
              yr += 1;
            };
            let isLeap = (y % 4 == 0 and y % 100 != 0) or y % 400 == 0;
            let monthLengths : [Nat] = if (isLeap)
              [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            else
              [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            var mo : Nat = 0;
            while (m > 0 and mo < m - 1) {
              totalDays += monthLengths[mo];
              mo += 1;
            };
            totalDays += day - 1;
            (totalDays + 4) % 7;
          };
          case _ { 0 };
        };
      } else { 0 };
    };

    // If this weekday is a fixed closing day, return empty slots immediately.
    let isClosed = fixedClosingDays.find(func(d : Nat) : Bool { d == dayOfWeek }) != null;
    if (isClosed) {
      return { slots = []; fixedClosingDays };
    };

    // Helper: generate slots within a single [windowOpenMin, windowCloseMin) window.
    func slotsForWindow(
      windowOpenMin : Nat,
      windowCloseMin : Nat,
      seatsPerSlot : Nat,
      interval : Nat,
      result : List.List<Types.TimeSlot>,
    ) {
      var cursor = windowOpenMin;
      let step = if (interval == 0) 30 else interval;
      label windowLoop while (cursor < windowCloseMin) {
        let timeText = minutesToTimeText(cursor);

        let usedSeats = reservations.values()
          .filter(func(r : Types.Reservation) : Bool {
            r.date == date and r.time == timeText and r.status == #confirmed
          })
          .foldLeft(0, func(acc : Nat, r : Types.Reservation) : Nat { acc + r.partySize });

        let available = if (usedSeats >= seatsPerSlot) 0 else seatsPerSlot - usedSeats;
        let status : Types.TimeSlotStatus = if (available == 0) #full
          else if (available <= 10) #limited
          else #available;

        result.add({
          time = timeText;
          availableSeats = available;
          totalSeats = seatsPerSlot;
          status;
        });

        cursor += step;
        if (cursor > windowCloseMin + step) {
          // Safety guard: prevent infinite loop on bad interval
          break windowLoop;
        };
      };
    };

    let slots = List.empty<Types.TimeSlot>();
    let interval = if (slotIntervalMinutes == 0) 30 else slotIntervalMinutes;

    // Use service windows if configured; otherwise fall back to global opening/closing hours.
    let activeServices = services.filter(func(s : SettingsTypes.ServiceHours) : Bool {
      // Service must run on this day-of-week (empty enabledDays = always active)
      s.enabledDays.size() == 0 or s.enabledDays.find(func(d : Nat) : Bool { d == dayOfWeek }) != null
    });

    if (activeServices.size() > 0) {
      // Sort services by openTime so slots appear in chronological order
      let sorted = activeServices.sort(func(a : SettingsTypes.ServiceHours, b : SettingsTypes.ServiceHours) : { #less; #equal; #greater } {
        let aMin = parseTimeToMinutes(a.openTime);
        let bMin = parseTimeToMinutes(b.openTime);
        if (aMin < bMin) #less else if (aMin > bMin) #greater else #equal
      });
      for (svc in sorted.values()) {
        let openMin = parseTimeToMinutes(svc.openTime);
        let closeMin = parseTimeToMinutes(svc.closeTime);
        // Use service-specific maxCapacity if set, else fall back to global totalSeatsPerSlot
        let capacity = if (svc.maxCapacity > 0) svc.maxCapacity else totalSeatsPerSlot;
        if (closeMin > openMin) {
          slotsForWindow(openMin, closeMin, capacity, interval, slots);
        };
      };
    } else {
      // Legacy fallback: generate from global openingHour/closingHour
      let openMin = openingHour * 60;
      let closeMin = closingHour * 60;
      slotsForWindow(openMin, closeMin, totalSeatsPerSlot, interval, slots);
    };

    { slots = slots.toArray(); fixedClosingDays };
  };

  public func getKPIs(
    reservations : Map.Map<CommonTypes.ReservationId, Types.Reservation>,
    _experiences : Map.Map<CommonTypes.ExperienceId, ExperienceTypes.Experience>,
    waitlist : Map.Map<CommonTypes.WaitlistId, WaitlistTypes.WaitlistEntry>,
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

    // No-show count this month
    let noShowCount = allReservations.filter(func(r : Types.Reservation) : Bool {
      r.date.startsWith(#text thisMonth) and (r.status == #not_arrived or r.status == #late)
    }).size();

    // Count active waitlist entries
    let waitlistCount = waitlist.values()
      .filter(func(e : WaitlistTypes.WaitlistEntry) : Bool {
        e.status == #waiting or e.status == #offered
      })
      .size();

    {
      todayReservationCount;
      todayCoversPerService;
      avgPartySize;
      occupancyPct;
      noShowCount;
      waitlistCount;
    };
  };
};
