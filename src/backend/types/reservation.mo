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

  /// A single entry in a reservation's change log.
  public type ReservationChange = {
    id          : Text;
    timestamp   : Int;
    changedBy   : Text;  // principal as text
    changedByName : Text;
    changedByRole : Text;
    field       : Text;
    oldValue    : Text;
    newValue    : Text;
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
    notes : ?Text;
    tableId : ?Text;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
    zone : ?Text; // zone name populated when a table is assigned (BUG-029)
    changes : [ReservationChange];
  };

  public type ReservationFilter = {
    date : ?Text;
    time : ?Text;
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
    waitlistCount : Nat; // active entries (#waiting or #offered)
  };

  public type AvailableSlotsResponse = {
    slots : [TimeSlot];
    fixedClosingDays : [Nat]; // day-of-week numbers that are always closed (0=Sun..6=Sat)
  };
};
