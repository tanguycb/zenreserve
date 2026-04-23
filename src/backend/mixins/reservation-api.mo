import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import ReservationLib "../lib/reservation";
import SeatingLib "../lib/seating";
import ValidateLib "../lib/validate";
import ReservationTypes "../types/reservation";
import ExperienceTypes "../types/experience";
import SeatingTypes "../types/seating";
import CommonTypes "../types/common";
import WaitlistTypes "../types/waitlist";
import SettingsTypes "../types/settings";
import TeamTypes "../types/team";
import AuditLogTypes "../types/audit-log";

mixin (
  accessControlState     : AccessControl.AccessControlState,
  reservations           : Map.Map<CommonTypes.ReservationId, ReservationTypes.Reservation>,
  reservationCounter     : List.List<Nat>,
  reservationChangeCounter : List.List<Nat>,
  experiences            : Map.Map<CommonTypes.ExperienceId, ExperienceTypes.Experience>,
  restaurantConfig       : List.List<{ restaurantName : Text; totalSeatsPerSlot : Nat; openingHour : Nat; closingHour : Nat; slotIntervalMinutes : Nat }>,
  tables                 : Map.Map<SeatingTypes.TableId, SeatingTypes.Table>,
  tableCounter           : List.List<Nat>,
  tableGroupDefinitions  : List.List<SeatingTypes.TableGroupDefinition>,
  extendedConfig         : List.List<SettingsTypes.RestaurantExtendedConfig>,
  waitlist               : Map.Map<CommonTypes.WaitlistId, WaitlistTypes.WaitlistEntry>,
  teamStore              : List.List<TeamTypes.TeamMember>,
  auditLog               : List.List<AuditLogTypes.AuditLogEntry>,
  auditLogCounter        : List.List<Nat>,
  widgetRateLimitMap     : Map.Map<Text, List.List<Int>>,
  dashboardRateLimitMap  : Map.Map<Text, List.List<Int>>,
) {
  // ── Rate limit constants ──────────────────────────────────────────────────
  let WIDGET_RATE_LIMIT_MAX          : Nat = 3;
  let WIDGET_RATE_LIMIT_WINDOW_NS    : Int = 3_600_000_000_000; // 1 hour
  let DASHBOARD_RATE_LIMIT_MAX       : Nat = 2;
  let DASHBOARD_RATE_LIMIT_WINDOW_NS : Int = 60_000_000_000;    // 1 minute

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
    let chars = today.toArray();
    if (chars.size() >= 7) {
      Text.fromArray(chars.sliceToArray(0, 7));
    } else {
      today;
    };
  };

  // Helper: backfill the zone + tableId fields on a reservation from an assigned table.
  func backfillTableInfo(reservationId : CommonTypes.ReservationId, tableId : SeatingTypes.TableId) {
    switch (tables.get(tableId)) {
      case null {};
      case (?t) {
        switch (reservations.get(reservationId)) {
          case null {};
          case (?r) {
            let updated = { r with
              tableId = ?tableId;
              zone = t.zone;
            };
            reservations.add(reservationId, updated);
          };
        };
      };
    };
  };

  // ── Audit log helper ──────────────────────────────────────────────────────
  func resolveCallerInfoReservation(callerText : Text) : (Text, Text) {
    switch (teamStore.find(func(m : TeamTypes.TeamMember) : Bool { m.principalId == callerText })) {
      case (?member) { (member.name, member.role) };
      case null      { ("Owner", "owner") };
    };
  };

  func appendAuditEntry(
    callerText : Text,
    page       : Text,
    action     : Text,
    summary    : Text,
    oldValue   : ?Text,
    newValue   : ?Text,
  ) {
    let (callerName, callerRole) = resolveCallerInfoReservation(callerText);
    let currentId = auditLogCounter.at(0);
    auditLogCounter.put(0, currentId + 1);
    let entry : AuditLogTypes.AuditLogEntry = {
      id              = currentId.toText();
      timestamp       = Time.now();
      callerPrincipal = callerText;
      callerName;
      callerRole;
      action;
      page;
      summary;
      oldValue;
      newValue;
    };
    auditLog.add(entry);
    if (auditLog.size() > 10_000) {
      let arr = auditLog.toArray();
      auditLog.clear();
      var i = 1;
      while (i < arr.size()) {
        auditLog.add(arr[i]);
        i += 1;
      };
    };
  };

  // ── Rate limit helpers ────────────────────────────────────────────────────
  func checkRateLimit(
    rateLimitMap : Map.Map<Text, List.List<Int>>,
    key          : Text,
    windowNs     : Int,
    maxCalls     : Nat,
  ) : { #ok; #err : Text } {
    let now = Time.now();
    let cutoff = now - windowNs;
    let timestamps : List.List<Int> = switch (rateLimitMap.get(key)) {
      case (?existing) existing;
      case null {
        let fresh = List.empty<Int>();
        rateLimitMap.add(key, fresh);
        fresh;
      };
    };
    let recent = timestamps.filter(func(ts : Int) : Bool { ts > cutoff });
    timestamps.clear();
    timestamps.addAll(recent.values());
    let count = timestamps.size();
    if (count >= maxCalls) {
      return #err("RATE_LIMIT");
    };
    timestamps.add(now);
    #ok;
  };

  // ── Auto-assign helper (date-scoped) ─────────────────────────────────────
  /// Try to find and assign the best available table for a reservation.
  /// Order: single table → named group definition → implicit groupId group.
  func autoAssignBestTable(
    reservationId : CommonTypes.ReservationId,
    partySize     : Nat,
    date          : Text,
    time          : Text,
    guestLabel    : Text,
  ) {
    // 1. Try single (ungrouped) table
    switch (SeatingLib.findBestTable(tables, reservations, partySize, date, time, [])) {
      case (?t) {
        switch (SeatingLib.assignReservationToTable(tables, t.id, reservationId, guestLabel, partySize)) {
          case (#ok(_)) { backfillTableInfo(reservationId, t.id) };
          case (#err(_)) {};
        };
        return;
      };
      case null {};
    };
    // 2. Try named group definitions
    switch (SeatingLib.findBestGroupDefinition(tables, reservations, tableGroupDefinitions, partySize, date, time)) {
      case (?(_, groupTables)) {
        SeatingLib.assignReservationToGroup(tables, groupTables, reservationId, guestLabel, partySize);
        if (groupTables.size() > 0) {
          backfillTableInfo(reservationId, groupTables[0].id);
        };
        return;
      };
      case null {};
    };
    // 3. Fallback: implicit groupId groups
    switch (SeatingLib.findBestTableGroup(tables, reservations, partySize, date, time)) {
      case (?(_, groupTables)) {
        SeatingLib.assignReservationToGroup(tables, groupTables, reservationId, guestLabel, partySize);
        if (groupTables.size() > 0) {
          backfillTableInfo(reservationId, groupTables[0].id);
        };
      };
      case null {};
    };
  };

  // ── Public API ────────────────────────────────────────────────────────────

  public shared ({ caller }) func createReservation(
    guestId              : CommonTypes.GuestId,
    date                 : Text,
    time                 : Text,
    partySize            : Nat,
    experienceId         : ?CommonTypes.ExperienceId,
    stripePaymentIntentId : ?Text,
    specialRequests      : ?Text,
  ) : async ReservationTypes.Reservation {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };

    let callerKey = caller.toText();
    switch (checkRateLimit(widgetRateLimitMap, callerKey, WIDGET_RATE_LIMIT_WINDOW_NS, WIDGET_RATE_LIMIT_MAX)) {
      case (#err(_)) { Runtime.trap("RATE_LIMIT_WIDGET") };
      case (#ok) {};
    };

    switch (ValidateLib.validatePartySize(partySize)) {
      case (#err(msg)) { Runtime.trap(msg) };
      case (#ok(_)) {};
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
      null,
      Time.now(),
      config.totalSeatsPerSlot,
    );
    if (tables.size() == 0) {
      ignore SeatingLib.syncTablesFromSettings(tables, tableCounter, extendedConfig);
    };
    autoAssignBestTable(reservation.id, partySize, date, time, guestId);
    switch (reservations.get(reservation.id)) {
      case (?r) r;
      case null reservation;
    };
  };

  /// Create a reservation with full guest details — for use from the dashboard.
  public shared ({ caller }) func createReservationWithDetails(
    guestName    : Text,
    phone        : Text,
    email        : Text,
    partySize    : Nat,
    date         : Text,
    timeSlot     : Text,
    tableId      : ?Text,
    notes        : ?Text,
    experienceId : ?CommonTypes.ExperienceId,
  ) : async { #ok : ReservationTypes.Reservation; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };

    let callerKey = caller.toText();
    switch (checkRateLimit(dashboardRateLimitMap, callerKey, DASHBOARD_RATE_LIMIT_WINDOW_NS, DASHBOARD_RATE_LIMIT_MAX)) {
      case (#err(_)) { return #err("RATE_LIMIT_DASHBOARD") };
      case (#ok) {};
    };

    switch (ValidateLib.validatePartySize(partySize)) {
      case (#err(msg)) { return #err(msg) };
      case (#ok(_)) {};
    };
    let validatedName = switch (ValidateLib.validateGuestName(guestName)) {
      case (#ok(n)) n;
      case (#err(msg)) { return #err(msg) };
    };
    let validatedPhone = switch (ValidateLib.validatePhone(phone)) {
      case (#ok(p)) p;
      case (#err(msg)) { return #err(msg) };
    };
    let today = todayString();
    if (date < today) {
      return #err("Reservation date cannot be in the past");
    };

    let config = getConfig();
    let guestId : CommonTypes.GuestId = validatedName # "|" # validatedPhone;
    let reservation = ReservationLib.create(
      reservations,
      reservationCounter,
      guestId,
      date,
      timeSlot,
      partySize,
      experienceId,
      null,
      null,
      notes,
      Time.now(),
      config.totalSeatsPerSlot,
    );

    if (tables.size() == 0) {
      ignore SeatingLib.syncTablesFromSettings(tables, tableCounter, extendedConfig);
    };

    switch (tableId) {
      case (?tid) {
        switch (SeatingLib.assignReservationToTable(tables, tid, reservation.id, guestName, partySize)) {
          case (#ok(_)) { backfillTableInfo(reservation.id, tid) };
          case (#err(_)) {};
        };
      };
      case null {
        autoAssignBestTable(reservation.id, partySize, date, timeSlot, guestName);
      };
    };

    let finalReservation = switch (reservations.get(reservation.id)) {
      case (?r) r;
      case null reservation;
    };
    #ok(finalReservation);
  };

  /// Full update of an existing reservation with change tracking.
  /// Logs each changed field to the reservation's changes list and to the global audit log.
  public shared ({ caller }) func updateReservation(
    id                 : CommonTypes.ReservationId,
    newDate            : Text,
    newTime            : Text,
    newPartySize       : Nat,
    newSpecialRequests : ?Text,
    newStatus          : ?ReservationTypes.ReservationStatus,
    newExperienceId    : ?CommonTypes.ExperienceId,
    newNotes           : ?Text,
    newTableId         : ?Text,
  ) : async { #ok : ReservationTypes.Reservation; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };

    // Snapshot old value for audit log
    let oldSummary : ?Text = switch (reservations.get(id)) {
      case null null;
      case (?r) ?("date=" # r.date # " time=" # r.time # " partySize=" # r.partySize.toText());
    };

    let result = ReservationLib.updateFull(
      reservations,
      reservationChangeCounter,
      teamStore,
      id,
      caller.toText(),
      newDate,
      newTime,
      newPartySize,
      newSpecialRequests,
      newStatus,
      newExperienceId,
      newNotes,
      newTableId,
    );

    switch (result) {
      case (#ok(updated)) {
        let newSummary = "date=" # updated.date # " time=" # updated.time # " partySize=" # updated.partySize.toText();
        appendAuditEntry(
          caller.toText(),
          "reservations",
          "edit",
          "Updated reservation " # id,
          oldSummary,
          ?newSummary,
        );
        #ok(updated);
      };
      case (#err(msg)) { #err(msg) };
    };
  };

  /// Returns all change log entries for a specific reservation. Admin only.
  public query ({ caller }) func getReservationChanges(
    id : CommonTypes.ReservationId,
  ) : async { #ok : [ReservationTypes.ReservationChange]; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };
    ReservationLib.getChanges(reservations, id);
  };

  public query func getReservation(id : CommonTypes.ReservationId) : async ?ReservationTypes.Reservation {
    ReservationLib.get(reservations, id);
  };

  public query func listReservations(filter : ReservationTypes.ReservationFilter) : async { #ok : [ReservationTypes.Reservation]; #err : Text } {
    ReservationLib.list(reservations, filter);
  };

  public shared ({ caller }) func updateReservationStatus(
    id     : CommonTypes.ReservationId,
    status : ReservationTypes.ReservationStatus,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    // Log the status change to reservation.changes before updating
    switch (reservations.get(id)) {
      case null {};
      case (?r) {
        ReservationLib.logChange(
          reservations,
          reservationChangeCounter,
          teamStore,
          id,
          caller.toText(),
          "status",
          debug_show(r.status),
          debug_show(status),
        );
      };
    };
    ReservationLib.updateStatus(reservations, id, status);
  };

  public shared ({ caller }) func cancelReservation(id : CommonTypes.ReservationId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ReservationLib.cancel(reservations, id);
  };

  public query func getAvailableSlots(date : Text) : async ReservationTypes.AvailableSlotsResponse {
    let config = getConfig();
    let cfg = extendedConfig.at(0);
    ReservationLib.getAvailableSlots(
      reservations,
      date,
      config.totalSeatsPerSlot,
      config.openingHour,
      config.closingHour,
      config.slotIntervalMinutes,
      cfg.fixedClosingDays,
      cfg.services,
    );
  };

  public query func getKPIs() : async ReservationTypes.KPIs {
    let config = getConfig();
    let today = todayString();
    let thisMonth = thisMonthString();
    ReservationLib.getKPIs(
      reservations,
      experiences,
      waitlist,
      today,
      thisMonth,
      config.totalSeatsPerSlot,
      config.openingHour,
      config.closingHour,
      config.slotIntervalMinutes,
    );
  };
};
