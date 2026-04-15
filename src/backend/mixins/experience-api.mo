import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import ExperienceLib "../lib/experience";
import ExperienceTypes "../types/experience";
import CommonTypes "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  experiences : Map.Map<CommonTypes.ExperienceId, ExperienceTypes.Experience>,
  experienceCounter : List.List<Nat>,
) {
  public shared ({ caller }) func createExperience(
    name : Text,
    description : Text,
    pricePerPerson : Nat,
    maxCapacity : Nat,
  ) : async ExperienceTypes.Experience {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ExperienceLib.create(experiences, experienceCounter, name, description, pricePerPerson, maxCapacity);
  };

  public shared ({ caller }) func updateExperience(experience : ExperienceTypes.Experience) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ExperienceLib.update(experiences, experience);
  };

  public query func listExperiences() : async [ExperienceTypes.Experience] {
    ExperienceLib.list(experiences, false);
  };

  public query func listActiveExperiences() : async [ExperienceTypes.Experience] {
    ExperienceLib.list(experiences, true);
  };
};
