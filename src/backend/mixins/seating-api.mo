import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import SeatingLib "../lib/seating";
import SeatingTypes "../types/seating";
import CommonTypes "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  tables : Map.Map<SeatingTypes.TableId, SeatingTypes.Table>,
  tableCounter : List.List<Nat>,
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
  ) : async { #ok : SeatingTypes.Table; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };
    let table = SeatingLib.createTable(tables, tableCounter, name, capacity, x, y);
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

  /// Find the best available table for the given party size.
  /// Returns the smallest single table with capacity >= partySize and status == #empty.
  /// If no single table fits, falls back to finding a matching table group.
  /// Excludes any table IDs in excludeTableIds.
  public query func findBestTable(
    partySize : Nat,
    excludeTableIds : [Text],
  ) : async ?SeatingTypes.Table {
    SeatingLib.findBestTable(tables, partySize, excludeTableIds);
  };

  /// Query alias: find best table for a reservation without excludeList (convenience).
  public query func findBestTableForReservation(partySize : Nat) : async ?SeatingTypes.Table {
    SeatingLib.findBestTable(tables, partySize, []);
  };

  /// Auto-assign the best available table (or table group) to a reservation.
  /// Prefers smallest single table; falls back to a group if partySize exceeds all singles.
  /// Returns the first assigned table or an error message.
  public shared ({ caller }) func autoAssignTable(
    reservationId : CommonTypes.ReservationId,
    partySize : Nat,
  ) : async { #ok : SeatingTypes.Table; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };
    // Try single table first
    switch (SeatingLib.findBestTable(tables, partySize, [])) {
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
        // Fall back to group
        switch (SeatingLib.findBestTableGroup(tables, partySize)) {
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

  /// Group a set of tables by assigning them a shared groupId.
  /// Tables in a group can be booked together for larger parties.
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
};
