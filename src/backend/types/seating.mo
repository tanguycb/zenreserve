import Common "common";

module {
  public type TableId = Text;

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
