import Common "common";

module {
  public type WaitlistStatus = {
    #waiting;
    #offered;
    #confirmed;
    #expired;
    #removed_by_staff;
  };

  public type WaitlistEntry = {
    id : Common.WaitlistId;
    guestId : Common.GuestId;
    date : Text; // YYYY-MM-DD
    partySize : Nat;
    requestedTime : ?Text; // HH:MM
    notes : ?Text;
    joinedAt : Common.Timestamp;
    notifiedAt : ?Common.Timestamp; // set when spot is offered/re-offered
    status : WaitlistStatus;
  };
};
