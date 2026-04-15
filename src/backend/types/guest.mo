import Common "common";

module {
  public type Guest = {
    id : Common.GuestId;
    name : Text;
    email : Text;
    phone : ?Text;
    tags : [Text]; // VIP, allergy, birthday, etc.
    reservationIds : [Common.ReservationId];
    createdAt : Common.Timestamp;
  };
};
