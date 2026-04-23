import Common "common";

module {
  public type TableId = Text;

  /// A named, permanent table group definition stored in settings.
  /// Used to pre-configure which tables can be combined for large parties.
  public type TableGroupDefinition = {
    id            : Text;
    name          : Text;
    tableIds      : [Text];
    totalCapacity : Nat;
    description   : Text;
  };

  public type TableStatus = {
    #empty;
    #occupied;
    #reserved;
    #unavailable;
  };

  public type Table = {
    id : TableId;
    name : Text;
    capacity : Nat;
    x : Int;
    y : Int;
    status : TableStatus;
    reservationId : ?Common.ReservationId;
    guestName : ?Text;
    seatCount : ?Nat;
    groupId : ?Text; // Phase 6: table grouping identifier
    zone : ?Text;    // zone name for analytics zone-backfill (BUG-029)
  };

  public type TableAssignment = {
    tableId : TableId;
    reservationId : Common.ReservationId;
    guestName : Text;
    seatCount : Nat;
    assignedAt : Common.Timestamp;
  };

  public type FloorState = {
    tables : [Table];
    updatedAt : Common.Timestamp;
  };
};
