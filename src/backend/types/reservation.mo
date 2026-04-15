import Common "common";

module {
  public type ReservationStatus = {
    #confirmed;
    #waitlist;
    #cancelled;
    #not_arrived;
    #late;
    #seated;
    #departed;
  };

  public type Reservation = {
    id : Common.ReservationId;
    guestId : Common.GuestId;
    date : Text; // YYYY-MM-DD
    time : Text; // HH:MM
    partySize : Nat;
    experienceId : ?Common.ExperienceId;
    status : ReservationStatus;
    stripePaymentIntentId : ?Text;
    specialRequests : ?Text;
    createdAt : Common.Timestamp;
  };

  public type ReservationFilter = {
    date : ?Text;
    status : ?ReservationStatus;
    guestId : ?Common.GuestId;
  };

  public type TimeSlotStatus = {
    #available;
    #limited;
    #full;
  };

  public type TimeSlot = {
    time : Text; // HH:MM
    availableSeats : Nat;
    totalSeats : Nat;
    status : TimeSlotStatus;
  };

  public type KPIs = {
    todayReservationCount : Nat;
    todayCoversPerService : [(Text, Nat)]; // service name -> covers count
    avgPartySize : Nat;
    occupancyPct : Nat; // 0-100
    noShowCount : Nat;
  };
};
