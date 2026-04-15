import Common "common";

module {
  public type Experience = {
    id : Common.ExperienceId;
    name : Text;
    description : Text;
    pricePerPerson : Nat; // in cents
    maxCapacity : Nat;
    isActive : Bool;
  };
};
