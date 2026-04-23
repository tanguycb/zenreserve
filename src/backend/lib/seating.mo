import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import SeatingTypes "../types/seating";
import CommonTypes "../types/common";
import ReservationTypes "../types/reservation";
import ValidateLib "validate";
import SettingsTypes "../types/settings";

module {
  // Generate next table ID using a mutable List<Nat> as a reference counter
  func nextTableId(counter : List.List<Nat>) : SeatingTypes.TableId {
    let id = counter.at(0);
    counter.put(0, id + 1);
    "table-" # id.toText();
  };

  public func createTable(
    tables : Map.Map<SeatingTypes.TableId, SeatingTypes.Table>,
    counter : List.List<Nat>,
    name : Text,
    capacity : Nat,
    x : Int,
    y : Int,
    zone : ?Text,
  ) : SeatingTypes.Table {
    let id = nextTableId(counter);
    let table : SeatingTypes.Table = {
      id;
      name;
      capacity;
      x;
      y;
      status = #empty;
      reservationId = null;
      guestName = null;
      seatCount = null;
      groupId = null;
      zone;
    };
    tables.add(id, table);
    table;
  };

  public func getTables(
    tables : Map.Map<SeatingTypes.TableId, SeatingTypes.Table>,
  ) : [SeatingTypes.Table] {
    tables.values().toArray();
  };

  public func getFloorState(
    tables : Map.Map<SeatingTypes.TableId, SeatingTypes.Table>,
  ) : SeatingTypes.FloorState {
    {
      tables = getTables(tables);
      updatedAt = Time.now();
    };
  };

  public func updateTablePosition(
    tables : Map.Map<SeatingTypes.TableId, SeatingTypes.Table>,
    id : SeatingTypes.TableId,
    x : Int,
    y : Int,
  ) : { #ok : SeatingTypes.Table; #err : Text } {
    switch (tables.get(id)) {
      case null { #err("Table not found") };
      case (?t) {
        let updated = { t with x; y };
        tables.add(id, updated);
        #ok(updated);
      };
    };
  };

  public func assignReservationToTable(
    tables : Map.Map<SeatingTypes.TableId, SeatingTypes.Table>,
    tableId : SeatingTypes.TableId,
    reservationId : CommonTypes.ReservationId,
    guestName : Text,
    seatCount : Nat,
  ) : { #ok : SeatingTypes.TableAssignment; #err : Text } {
    if (seatCount == 0) {
      return #err("Seat count must be greater than zero");
    };
    switch (tables.get(tableId)) {
      case null { #err("Table not found") };
      case (?t) {
        if (seatCount > t.capacity) {
          return #err("Seat count exceeds table capacity of " # t.capacity.toText());
        };
        let updated = {
          t with
          status = #reserved;
          reservationId = ?reservationId;
          guestName = ?guestName;
          seatCount = ?seatCount;
        };
        tables.add(tableId, updated);
        let assignment : SeatingTypes.TableAssignment = {
          tableId;
          reservationId;
          guestName;
          seatCount;
          assignedAt = Time.now();
        };
        #ok(assignment);
      };
    };
  };

  public func unassignTable(
    tables : Map.Map<SeatingTypes.TableId, SeatingTypes.Table>,
    tableId : SeatingTypes.TableId,
  ) : { #ok : (); #err : Text } {
    switch (tables.get(tableId)) {
      case null { #err("Table not found") };
      case (?t) {
        let updated = {
          t with
          status = #empty;
          reservationId = null;
          guestName = null;
          seatCount = null;
        };
        tables.add(tableId, updated);
        #ok(());
      };
    };
  };

  public func deleteTable(
    tables : Map.Map<SeatingTypes.TableId, SeatingTypes.Table>,
    tableId : SeatingTypes.TableId,
  ) : { #ok : (); #err : Text } {
    switch (tables.get(tableId)) {
      case null { #err("Table not found") };
      case (?_) {
        tables.remove(tableId);
        #ok(());
      };
    };
  };

  public func setTableStatus(
    tables : Map.Map<SeatingTypes.TableId, SeatingTypes.Table>,
    tableId : SeatingTypes.TableId,
    status : SeatingTypes.TableStatus,
  ) : { #ok : SeatingTypes.Table; #err : Text } {
    switch (tables.get(tableId)) {
      case null { #err("Table not found") };
      case (?t) {
        let updated = { t with status };
        tables.add(tableId, updated);
        #ok(updated);
      };
    };
  };

  /// Returns true if a table has a conflicting reservation for the given date+time.
  /// Conflicting = a confirmed or seated reservation on the same date+time.
  func tableHasConflict(
    reservations : Map.Map<CommonTypes.ReservationId, ReservationTypes.Reservation>,
    tableId      : SeatingTypes.TableId,
    date         : Text,
    time         : Text,
  ) : Bool {
    reservations.values().any(func(r : ReservationTypes.Reservation) : Bool {
      r.date == date
        and r.time == time
        and (r.status == #confirmed or r.status == #seated)
        and (switch (r.tableId) { case (?tid) tid == tableId; case null false })
    });
  };

  /// Find the best available single table for a given party size, date, and time.
  /// A table is available if:
  ///   - capacity >= partySize
  ///   - no conflicting confirmed/seated reservation on that exact date+time
  ///   - not in a group (ungrouped tables only)
  /// Sorted by capacity ascending (smallest-fit first).
  public func findBestTable(
    tables       : Map.Map<SeatingTypes.TableId, SeatingTypes.Table>,
    reservations : Map.Map<CommonTypes.ReservationId, ReservationTypes.Reservation>,
    partySize    : Nat,
    date         : Text,
    time         : Text,
    excludeTableIds : [Text],
  ) : ?SeatingTypes.Table {
    // SEC-003: defence-in-depth guard
    switch (ValidateLib.validatePartySize(partySize)) {
      case (#err(_)) { return null };
      case (#ok(_)) {};
    };
    let candidates = tables.values()
      .filter(func(t : SeatingTypes.Table) : Bool {
        t.groupId == null
          and t.capacity >= partySize
          and excludeTableIds.find(func(eid : Text) : Bool { eid == t.id }) == null
          and not tableHasConflict(reservations, t.id, date, time)
      })
      .toArray()
      .sort(func(a : SeatingTypes.Table, b : SeatingTypes.Table) : { #less; #equal; #greater } {
        if (a.capacity < b.capacity) #less
        else if (a.capacity > b.capacity) #greater
        else #equal
      });
    if (candidates.size() == 0) null else ?candidates[0];
  };

  /// Find the best available implicit table group (via groupId field) for a given
  /// party size, date, and time. All member tables must be conflict-free.
  public func findBestTableGroup(
    tables       : Map.Map<SeatingTypes.TableId, SeatingTypes.Table>,
    reservations : Map.Map<CommonTypes.ReservationId, ReservationTypes.Reservation>,
    partySize    : Nat,
    date         : Text,
    time         : Text,
  ) : ?(Text, [SeatingTypes.Table]) {
    // SEC-003: defence-in-depth guard
    switch (ValidateLib.validatePartySize(partySize)) {
      case (#err(_)) { return null };
      case (#ok(_)) {};
    };
    // Collect all grouped tables, keyed by groupId
    let groupMap = Map.empty<Text, List.List<SeatingTypes.Table>>();
    for ((_, t) in tables.entries()) {
      switch (t.groupId) {
        case null {};
        case (?gid) {
          switch (groupMap.get(gid)) {
            case null {
              let l = List.singleton<SeatingTypes.Table>(t);
              groupMap.add(gid, l);
            };
            case (?l) { l.add(t) };
          };
        };
      };
    };

    // Find groups where all tables have no conflict and combined capacity >= partySize
    var bestGroupId : ?Text = null;
    var bestTables : [SeatingTypes.Table] = [];
    var bestCapacity : Nat = 0;

    for ((gid, memberList) in groupMap.entries()) {
      let members = memberList.toArray();
      let allAvailable = members.all(func(t : SeatingTypes.Table) : Bool {
        not tableHasConflict(reservations, t.id, date, time)
      });
      if (allAvailable) {
        let totalCap = members.foldLeft(0, func(acc : Nat, t : SeatingTypes.Table) : Nat { acc + t.capacity });
        if (totalCap >= partySize) {
          if (bestGroupId == null or totalCap < bestCapacity) {
            bestGroupId := ?gid;
            bestTables := members;
            bestCapacity := totalCap;
          };
        };
      };
    };

    switch (bestGroupId) {
      case null null;
      case (?gid) ?(gid, bestTables);
    };
  };

  // ── TableGroupDefinition CRUD ──────────────────────────────────────────────

  func nextGroupDefId(counter : List.List<Nat>) : Text {
    let id = counter.at(0);
    counter.put(0, id + 1);
    "grpdef-" # id.toText();
  };

  /// Create a named table group definition. Validates tableIds.size() >= 2 and
  /// calculates totalCapacity from referenced tables.
  public func createTableGroupDefinition(
    tables             : Map.Map<SeatingTypes.TableId, SeatingTypes.Table>,
    groupDefinitions   : List.List<SeatingTypes.TableGroupDefinition>,
    counter            : List.List<Nat>,
    name               : Text,
    tableIds           : [Text],
    description        : Text,
  ) : { #ok : SeatingTypes.TableGroupDefinition; #err : Text } {
    if (tableIds.size() < 2) {
      return #err("A group definition requires at least 2 tables");
    };
    if (name == "") {
      return #err("Name cannot be empty");
    };
    // Calculate total capacity
    var totalCap : Nat = 0;
    for (tid in tableIds.values()) {
      switch (tables.get(tid)) {
        case null { return #err("Table not found: " # tid) };
        case (?t) { totalCap += t.capacity };
      };
    };
    let id = nextGroupDefId(counter);
    let def : SeatingTypes.TableGroupDefinition = {
      id;
      name;
      tableIds;
      totalCapacity = totalCap;
      description;
    };
    groupDefinitions.add(def);
    #ok(def);
  };

  public func getTableGroupDefinitions(
    groupDefinitions : List.List<SeatingTypes.TableGroupDefinition>,
  ) : [SeatingTypes.TableGroupDefinition] {
    groupDefinitions.toArray();
  };

  public func updateTableGroupDefinition(
    tables           : Map.Map<SeatingTypes.TableId, SeatingTypes.Table>,
    groupDefinitions : List.List<SeatingTypes.TableGroupDefinition>,
    id               : Text,
    name             : Text,
    tableIds         : [Text],
    description      : Text,
  ) : { #ok : SeatingTypes.TableGroupDefinition; #err : Text } {
    if (tableIds.size() < 2) {
      return #err("A group definition requires at least 2 tables");
    };
    if (name == "") {
      return #err("Name cannot be empty");
    };
    var totalCap : Nat = 0;
    for (tid in tableIds.values()) {
      switch (tables.get(tid)) {
        case null { return #err("Table not found: " # tid) };
        case (?t) { totalCap += t.capacity };
      };
    };
    switch (groupDefinitions.findIndex(func(d : SeatingTypes.TableGroupDefinition) : Bool { d.id == id })) {
      case null { #err("Group definition not found: " # id) };
      case (?idx) {
        let updated : SeatingTypes.TableGroupDefinition = {
          id;
          name;
          tableIds;
          totalCapacity = totalCap;
          description;
        };
        groupDefinitions.put(idx, updated);
        #ok(updated);
      };
    };
  };

  public func deleteTableGroupDefinition(
    groupDefinitions : List.List<SeatingTypes.TableGroupDefinition>,
    id               : Text,
  ) : { #ok : (); #err : Text } {
    switch (groupDefinitions.findIndex(func(d : SeatingTypes.TableGroupDefinition) : Bool { d.id == id })) {
      case null { #err("Group definition not found: " # id) };
      case (?idx) {
        // Remove by rebuilding without the target index
        let arr = groupDefinitions.toArray();
        groupDefinitions.clear();
        for ((i, item) in arr.enumerate()) {
          if (i != idx) groupDefinitions.add(item);
        };
        #ok(());
      };
    };
  };

  /// Find the best available named TableGroupDefinition for a party size+date+time.
  /// All tableIds in the definition must be conflict-free. Sorted by totalCapacity ascending.
  public func findBestGroupDefinition(
    tables           : Map.Map<SeatingTypes.TableId, SeatingTypes.Table>,
    reservations     : Map.Map<CommonTypes.ReservationId, ReservationTypes.Reservation>,
    groupDefinitions : List.List<SeatingTypes.TableGroupDefinition>,
    partySize        : Nat,
    date             : Text,
    time             : Text,
  ) : ?(SeatingTypes.TableGroupDefinition, [SeatingTypes.Table]) {
    switch (ValidateLib.validatePartySize(partySize)) {
      case (#err(_)) { return null };
      case (#ok(_)) {};
    };
    // Filter eligible definitions sorted by totalCapacity ascending (smallest-fit first)
    let eligible = groupDefinitions.filter(func(def : SeatingTypes.TableGroupDefinition) : Bool {
      if (def.totalCapacity < partySize) return false;
      // All tables must exist and be conflict-free
      def.tableIds.all(func(tid : Text) : Bool {
        switch (tables.get(tid)) {
          case null false;
          case (?_) not tableHasConflict(reservations, tid, date, time);
        }
      })
    });
    let sorted = eligible.sort(func(a : SeatingTypes.TableGroupDefinition, b : SeatingTypes.TableGroupDefinition) : { #less; #equal; #greater } {
      if (a.totalCapacity < b.totalCapacity) #less
      else if (a.totalCapacity > b.totalCapacity) #greater
      else #equal
    });
    switch (sorted.first()) {
      case null null;
      case (?def) {
        let memberTables = def.tableIds.filterMap(func(tid : Text) : ?SeatingTypes.Table {
          tables.get(tid)
        });
        ?(def, memberTables);
      };
    };
  };

  /// Assign a reservation to all tables in a group.
  public func assignReservationToGroup(
    tables : Map.Map<SeatingTypes.TableId, SeatingTypes.Table>,
    groupTables : [SeatingTypes.Table],
    reservationId : CommonTypes.ReservationId,
    guestName : Text,
    seatCount : Nat,
  ) {
    // SEC-003: validate seatCount (same bound as party size)
    switch (ValidateLib.validatePartySize(seatCount)) {
      case (#err(_)) { Runtime.trap("Seat count out of bounds") };
      case (#ok(_)) {};
    };
    for (t in groupTables.values()) {
      let updated = {
        t with
        status = #reserved;
        reservationId = ?reservationId;
        guestName = ?guestName;
        seatCount = ?seatCount;
      };
      tables.add(t.id, updated);
    };
  };

  /// Assign shared groupId to a set of tables, enabling them to be booked together.
  public func groupTables(
    tables : Map.Map<SeatingTypes.TableId, SeatingTypes.Table>,
    tableIds : [Text],
    groupId : Text,
  ) : { #ok : [SeatingTypes.Table]; #err : Text } {
    for (tid in tableIds.values()) {
      switch (tables.get(tid)) {
        case null { return #err("Table not found: " # tid) };
        case (?t) {
          switch (t.groupId) {
            case (?existing) {
              if (existing != groupId) {
                return #err("Table " # tid # " is already in group " # existing);
              };
            };
            case null {};
          };
        };
      };
    };
    let result = List.empty<SeatingTypes.Table>();
    for (tid in tableIds.values()) {
      switch (tables.get(tid)) {
        case null {};
        case (?t) {
          let updated = { t with groupId = ?groupId };
          tables.add(tid, updated);
          result.add(updated);
        };
      };
    };
    #ok(result.toArray());
  };

  /// Update a table's capacity in place.
  public func updateTableCapacity(
    tables : Map.Map<SeatingTypes.TableId, SeatingTypes.Table>,
    tableId : SeatingTypes.TableId,
    newCapacity : Nat,
  ) : { #ok : SeatingTypes.Table; #err : Text } {
    if (newCapacity == 0) {
      return #err("Capacity must be at least 1");
    };
    switch (tables.get(tableId)) {
      case null { #err("Table not found") };
      case (?t) {
        let updated = { t with capacity = newCapacity };
        tables.add(tableId, updated);
        #ok(updated);
      };
    };
  };

  /// Update a table's zone in place.
  public func updateTableZone(
    tables : Map.Map<SeatingTypes.TableId, SeatingTypes.Table>,
    tableId : SeatingTypes.TableId,
    zone : ?Text,
  ) : { #ok : SeatingTypes.Table; #err : Text } {
    switch (tables.get(tableId)) {
      case null { #err("Table not found") };
      case (?t) {
        let updated = { t with zone };
        tables.add(tableId, updated);
        #ok(updated);
      };
    };
  };

  /// Sync tables from settings tableTypes into the tables Map.
  public func syncTablesFromSettings(
    tables : Map.Map<SeatingTypes.TableId, SeatingTypes.Table>,
    counter : List.List<Nat>,
    extendedConfig : List.List<SettingsTypes.RestaurantExtendedConfig>,
  ) : Nat {
    let cfg = extendedConfig.at(0);
    var created : Nat = 0;
    var gridIndex : Nat = 0;

    let defaultZone : ?Text = if (cfg.zones.size() > 0) {
      ?cfg.zones[0].zoneName;
    } else {
      null;
    };

    for (tt in cfg.tableTypes.values()) {
      let existingCount = tables.values()
        .filter(func(t : SeatingTypes.Table) : Bool {
          t.name.startsWith(#text (tt.typeName # " #"))
        })
        .foldLeft(0, func(acc : Nat, _ : SeatingTypes.Table) : Nat { acc + 1 });

      var i : Nat = existingCount;
      while (i < tt.count) {
        let col : Nat = gridIndex % 6;
        let row : Nat = gridIndex / 6;
        let x : Int = col.toInt() * 120 + 60;
        let y : Int = row.toInt() * 120 + 60;
        let name = tt.typeName # " #" # (i + 1).toText();
        let id = nextTableId(counter);
        let table : SeatingTypes.Table = {
          id;
          name;
          capacity = tt.capacity;
          x;
          y;
          status = #empty;
          reservationId = null;
          guestName = null;
          seatCount = null;
          groupId = null;
          zone = defaultZone;
        };
        tables.add(id, table);
        created += 1;
        gridIndex += 1;
        i += 1;
      };
      gridIndex += existingCount;
    };
    created;
  };

  /// Remove groupId from all tables that share the given groupId.
  public func ungroupTables(
    tables : Map.Map<SeatingTypes.TableId, SeatingTypes.Table>,
    groupId : Text,
  ) : { #ok : [SeatingTypes.Table]; #err : Text } {
    let affected = tables.values()
      .filter(func(t : SeatingTypes.Table) : Bool {
        switch (t.groupId) {
          case (?gid) gid == groupId;
          case null false;
        }
      })
      .toArray();
    if (affected.size() == 0) {
      return #err("Group not found: " # groupId);
    };
    let result = List.empty<SeatingTypes.Table>();
    for (t in affected.values()) {
      let updated = { t with groupId = null };
      tables.add(t.id, updated);
      result.add(updated);
    };
    #ok(result.toArray());
  };
};
