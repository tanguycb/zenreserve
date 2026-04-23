import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import SeatingLib "../lib/seating";
import SeatingTypes "../types/seating";
import CommonTypes "../types/common";
import ReservationTypes "../types/reservation";
import SettingsTypes "../types/settings";

mixin (
  accessControlState   : AccessControl.AccessControlState,
  tables               : Map.Map<SeatingTypes.TableId, SeatingTypes.Table>,
  tableCounter         : List.List<Nat>,
  tableGroupDefinitions : List.List<SeatingTypes.TableGroupDefinition>,
  tableGroupDefCounter : List.List<Nat>,
  reservations         : Map.Map<CommonTypes.ReservationId, ReservationTypes.Reservation>,
  extendedConfig       : List.List<SettingsTypes.RestaurantExtendedConfig>,
) {
  public query func getTables() : async [SeatingTypes.Table] {
    SeatingLib.getTables(tables);
  };

  public query func getFloorState() : async SeatingTypes.FloorState {
    SeatingLib.getFloorState(tables);
  };

  public shared ({ caller }) func createTable(
    name : Text,
    capacity : Nat,
    x : Int,
    y : Int,
    zone : ?Text,
  ) : async { #ok : SeatingTypes.Table; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };
    let table = SeatingLib.createTable(tables, tableCounter, name, capacity, x, y, zone);
    #ok(table);
  };

  public shared ({ caller }) func updateTablePosition(
    id : SeatingTypes.TableId,
    x : Int,
    y : Int,
  ) : async { #ok : SeatingTypes.Table; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };
    SeatingLib.updateTablePosition(tables, id, x, y);
  };

  public shared ({ caller }) func assignReservationToTable(
    tableId : SeatingTypes.TableId,
    reservationId : CommonTypes.ReservationId,
  ) : async { #ok : SeatingTypes.TableAssignment; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };
    SeatingLib.assignReservationToTable(tables, tableId, reservationId, reservationId, 1);
  };

  public shared ({ caller }) func assignReservationToTableWithDetails(
    tableId : SeatingTypes.TableId,
    reservationId : CommonTypes.ReservationId,
    guestName : Text,
    seatCount : Nat,
  ) : async { #ok : SeatingTypes.TableAssignment; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };
    SeatingLib.assignReservationToTable(tables, tableId, reservationId, guestName, seatCount);
  };

  public shared ({ caller }) func unassignTable(
    tableId : SeatingTypes.TableId,
  ) : async { #ok : (); #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };
    SeatingLib.unassignTable(tables, tableId);
  };

  public shared ({ caller }) func deleteTable(
    id : SeatingTypes.TableId,
  ) : async { #ok : (); #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };
    SeatingLib.deleteTable(tables, id);
  };

  public shared ({ caller }) func setTableStatus(
    tableId : SeatingTypes.TableId,
    status : SeatingTypes.TableStatus,
  ) : async { #ok : SeatingTypes.Table; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };
    SeatingLib.setTableStatus(tables, tableId, status);
  };

  /// Find the best available single table for the given party size, date, and time.
  /// Uses date-scoped availability — only tables with no conflicting reservation are returned.
  public query func findBestTable(
    partySize : Nat,
    date      : Text,
    time      : Text,
    excludeTableIds : [Text],
  ) : async ?SeatingTypes.Table {
    SeatingLib.findBestTable(tables, reservations, partySize, date, time, excludeTableIds);
  };

  /// Convenience: find best table without exclude list.
  public query func findBestTableForReservation(
    partySize : Nat,
    date      : Text,
    time      : Text,
  ) : async ?SeatingTypes.Table {
    SeatingLib.findBestTable(tables, reservations, partySize, date, time, []);
  };

  /// Auto-assign the best available table (or group) to a reservation.
  /// Requires date and time for date-scoped conflict detection.
  public shared ({ caller }) func autoAssignTable(
    reservationId : CommonTypes.ReservationId,
    partySize : Nat,
    date : Text,
    time : Text,
  ) : async { #ok : SeatingTypes.Table; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };
    // Try single table first
    switch (SeatingLib.findBestTable(tables, reservations, partySize, date, time, [])) {
      case (?t) {
        switch (SeatingLib.assignReservationToTable(tables, t.id, reservationId, reservationId, partySize)) {
          case (#ok(_)) {
            switch (tables.get(t.id)) {
              case (?updated) { #ok(updated) };
              case null { #err("Table assignment failed unexpectedly") };
            };
          };
          case (#err(msg)) { #err(msg) };
        };
      };
      case null {
        // Try named group definitions
        switch (SeatingLib.findBestGroupDefinition(tables, reservations, tableGroupDefinitions, partySize, date, time)) {
          case (?(_, groupTables)) {
            if (groupTables.size() == 0) {
              return #err("No available table found for party size " # partySize.toText());
            };
            SeatingLib.assignReservationToGroup(tables, groupTables, reservationId, reservationId, partySize);
            let firstId = groupTables[0].id;
            switch (tables.get(firstId)) {
              case (?updated) { #ok(updated) };
              case null { #err("Group definition assignment failed unexpectedly") };
            };
          };
          case null {
            // Fallback: implicit groupId groups
            switch (SeatingLib.findBestTableGroup(tables, reservations, partySize, date, time)) {
              case null { #err("No available table found for party size " # partySize.toText()) };
              case (?(_, groupTables)) {
                if (groupTables.size() == 0) {
                  return #err("No available table found for party size " # partySize.toText());
                };
                SeatingLib.assignReservationToGroup(tables, groupTables, reservationId, reservationId, partySize);
                let firstId = groupTables[0].id;
                switch (tables.get(firstId)) {
                  case (?updated) { #ok(updated) };
                  case null { #err("Group assignment failed unexpectedly") };
                };
              };
            };
          };
        };
      };
    };
  };

  /// Group a set of tables by assigning them a shared groupId (floor-plan visual grouping).
  public shared ({ caller }) func groupTables(
    tableIds : [Text],
    groupId : Text,
  ) : async { #ok : [SeatingTypes.Table]; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };
    if (tableIds.size() < 2) {
      return #err("A group must contain at least 2 tables");
    };
    if (groupId == "") {
      return #err("Group ID cannot be empty");
    };
    SeatingLib.groupTables(tables, tableIds, groupId);
  };

  /// Dissolve a table group by removing the groupId from all member tables.
  public shared ({ caller }) func ungroupTables(
    groupId : Text,
  ) : async { #ok : [SeatingTypes.Table]; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };
    SeatingLib.ungroupTables(tables, groupId);
  };

  /// Update the capacity of a single table in place.
  public shared ({ caller }) func updateTableCapacity(
    tableId : SeatingTypes.TableId,
    newCapacity : Nat,
  ) : async { #ok : SeatingTypes.Table; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };
    SeatingLib.updateTableCapacity(tables, tableId, newCapacity);
  };

  /// Update the zone of a single table in place.
  public shared ({ caller }) func updateTableZone(
    tableId : SeatingTypes.TableId,
    zone : ?Text,
  ) : async { #ok : SeatingTypes.Table; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };
    SeatingLib.updateTableZone(tables, tableId, zone);
  };

  /// Sync tables from settings into the floor plan. Admin only.
  public shared ({ caller }) func syncTablesFromSettings() : async { #ok : Nat; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: admin only");
    };
    let count = SeatingLib.syncTablesFromSettings(tables, tableCounter, extendedConfig);
    #ok(count);
  };

  // ── Named TableGroupDefinition API ───────────────────────────────────────

  /// List all named table group definitions. Admin only.
  public query ({ caller }) func getTableGroupDefinitions() : async { #ok : [SeatingTypes.TableGroupDefinition]; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };
    #ok(SeatingLib.getTableGroupDefinitions(tableGroupDefinitions));
  };

  /// Create a named table group definition. Admin only.
  /// tableIds must have at least 2 entries. totalCapacity is auto-calculated.
  public shared ({ caller }) func createTableGroupDefinition(
    name        : Text,
    tableIds    : [Text],
    description : Text,
  ) : async { #ok : SeatingTypes.TableGroupDefinition; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: admin only");
    };
    SeatingLib.createTableGroupDefinition(tables, tableGroupDefinitions, tableGroupDefCounter, name, tableIds, description);
  };

  /// Update an existing table group definition. Recalculates totalCapacity. Admin only.
  public shared ({ caller }) func updateTableGroupDefinition(
    id          : Text,
    name        : Text,
    tableIds    : [Text],
    description : Text,
  ) : async { #ok : SeatingTypes.TableGroupDefinition; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: admin only");
    };
    SeatingLib.updateTableGroupDefinition(tables, tableGroupDefinitions, id, name, tableIds, description);
  };

  /// Delete a named table group definition. Admin only.
  public shared ({ caller }) func deleteTableGroupDefinition(
    id : Text,
  ) : async { #ok : (); #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: admin only");
    };
    SeatingLib.deleteTableGroupDefinition(tableGroupDefinitions, id);
  };
};
