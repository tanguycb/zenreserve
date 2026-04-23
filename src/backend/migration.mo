import Map "mo:core/Map";
import NewTypes "types/experience";
import CommonTypes "types/common";

module {
  // ── Old types (copied from .old/src/backend/types/experience.mo) ──────────
  type OldExperience = {
    id : CommonTypes.ExperienceId;
    name : Text;
    description : Text;
    pricePerPerson : Nat;
    maxCapacity : Nat;
    isActive : Bool;
    required : Bool;
  };

  // ── Actor state shapes ─────────────────────────────────────────────────────
  type OldActor = {
    experiences : Map.Map<CommonTypes.ExperienceId, OldExperience>;
  };

  type NewActor = {
    experiences : Map.Map<CommonTypes.ExperienceId, NewTypes.Experience>;
  };

  // ── Migration function ─────────────────────────────────────────────────────
  public func run(old : OldActor) : NewActor {
    let experiences = old.experiences.map<CommonTypes.ExperienceId, OldExperience, NewTypes.Experience>(
      func(_id, e) {
        {
          e with
          serviceIds = null : ?[Text];
          dayOfWeek  = null : ?[Nat];
        }
      }
    );
    { experiences };
  };
};
