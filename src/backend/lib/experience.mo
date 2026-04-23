import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import ExperienceTypes "../types/experience";
import CommonTypes "../types/common";

module {
  func nextId(counter : List.List<Nat>) : Text {
    let id = counter.at(0);
    counter.put(0, id + 1);
    "exp" # id.toText();
  };

  public func create(
    experiences : Map.Map<CommonTypes.ExperienceId, ExperienceTypes.Experience>,
    counter : List.List<Nat>,
    name : Text,
    description : Text,
    pricePerPerson : Nat,
    maxCapacity : Nat,
    required : Bool,
    serviceIds : ?[Text],
    dayOfWeek : ?[Nat],
  ) : ExperienceTypes.Experience {
    let id = nextId(counter);
    let experience : ExperienceTypes.Experience = {
      id;
      name;
      description;
      pricePerPerson;
      maxCapacity;
      isActive = true;
      required;
      serviceIds;
      dayOfWeek;
    };
    experiences.add(id, experience);
    experience;
  };

  public func update(
    experiences : Map.Map<CommonTypes.ExperienceId, ExperienceTypes.Experience>,
    experience : ExperienceTypes.Experience,
  ) {
    switch (experiences.get(experience.id)) {
      case null { Runtime.trap("Experience not found") };
      case (?_) {
        experiences.add(experience.id, experience);
      };
    };
  };

  public func list(
    experiences : Map.Map<CommonTypes.ExperienceId, ExperienceTypes.Experience>,
    activeOnly : Bool,
    serviceFilter : ?Text,
    dayFilter : ?Nat,
  ) : [ExperienceTypes.Experience] {
    experiences.values().filter(func(e : ExperienceTypes.Experience) : Bool {
      if (activeOnly and not e.isActive) { return false };
      // service filter: if experience has serviceIds set, caller service must be in the list
      switch (serviceFilter, e.serviceIds) {
        case (?svc, ?ids) {
          if (not ids.any(func(s : Text) : Bool { s == svc })) { return false };
        };
        case _ {};
      };
      // day filter: if experience has dayOfWeek set, caller day must be in the list
      switch (dayFilter, e.dayOfWeek) {
        case (?day, ?days) {
          if (not days.any(func(d : Nat) : Bool { d == day })) { return false };
        };
        case _ {};
      };
      true;
    }).toArray();
  };
};
