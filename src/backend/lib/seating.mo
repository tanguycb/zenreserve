import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import SeatingTypes "../types/seating";
import CommonTypes "../types/common";

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
    switch (tables.get(tableId)) {
      case null { #err("Table not found") };
      case (?t) {
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

  /// Find the best available single table for a given party size.
  /// Selects tables with status == #empty and capacity >= partySize,
  /// sorted by capacity ascending (smallest-fit first).
  /// Excludes table IDs in excludeTableIds and grouped tables.
  public func findBestTable(
    tables : Map.Map<SeatingTypes.TableId, SeatingTypes.Table>,
    partySize : Nat,
    excludeTableIds : [Text],
  ) : ?SeatingTypes.Table {
    let candidates = tables.values()
      .filter(func(t : SeatingTypes.Table) : Bool {
        t.status == #empty
          and t.groupId == null
          and t.capacity >= partySize
          and excludeTableIds.find(func(eid : Text) : Bool { eid == t.id }) == null
      })
      .toArray()
      .sort(func(a : SeatingTypes.Table, b : SeatingTypes.Table) : { #less; #equal; #greater } {
        if (a.capacity < b.capacity) #less
        else if (a.capacity > b.capacity) #greater
        else #equal
      });
    if (candidates.size() == 0) null else ?candidates[0];
  };

  /// Find the best available table group for a given party size.
  /// Returns the group ID and total combined capacity if a group can fit the party.
  /// Only considers groups where all member tables have status == #empty.
  public func findBestTableGroup(
    tables : Map.Map<SeatingTypes.TableId, SeatingTypes.Table>,
    partySize : Nat,
  ) : ?(Text, [SeatingTypes.Table]) {
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

    // Find groups where all tables are empty and combined capacity >= partySize
    var bestGroupId : ?Text = null;
    var bestTables : [SeatingTypes.Table] = [];
    var bestCapacity : Nat = 0;

    for ((gid, memberList) in groupMap.entries()) {
      let members = memberList.toArray();
      let allEmpty = members.all(func(t : SeatingTypes.Table) : Bool { t.status == #empty });
      if (allEmpty) {
        let totalCap = members.foldLeft(0, func(acc : Nat, t : SeatingTypes.Table) : Nat { acc + t.capacity });
        if (totalCap >= partySize) {
          // Pick the smallest-capacity group that fits
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

  /// Assign a reservation to all tables in a group.
  public func assignReservationToGroup(
    tables : Map.Map<SeatingTypes.TableId, SeatingTypes.Table>,
    groupTables : [SeatingTypes.Table],
    reservationId : CommonTypes.ReservationId,
    guestName : Text,
    seatCount : Nat,
  ) {
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
    // Validate all tables exist and are not already in a different group
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
    // Apply groupId to all tables
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
