import Common "common";

module {
  public type Experience = {
    id : Common.ExperienceId;
    name : Text;
    description : Text;
    pricePerPerson : Nat; // in cents
    maxCapacity : Nat;
    isActive : Bool;
    required : Bool; // whether guests must select this experience when booking
    serviceIds : ?[Text]; // null = applies to all services; e.g. ["lunch", "diner"]
    dayOfWeek : ?[Nat];   // null = applies to all days; 0=Sunday … 6=Saturday
  };
};
