import List "mo:core/List";
import Time "mo:core/Time";
import TeamTypes "../types/team";

module {
  public func list(
    teamStore : List.List<TeamTypes.TeamMember>,
  ) : [TeamTypes.TeamMember] {
    teamStore.toArray();
  };

  public func getByPrincipal(
    teamStore : List.List<TeamTypes.TeamMember>,
    principalId : Text,
  ) : ?TeamTypes.TeamMember {
    teamStore.find(func(m) { m.principalId == principalId });
  };

  public func add(
    teamStore : List.List<TeamTypes.TeamMember>,
    id : Text,
    principalId : Text,
    name : Text,
    email : Text,
    role : Text,
  ) {
    // Prevent duplicate principal entries
    switch (getByPrincipal(teamStore, principalId)) {
      case (?_) { /* already exists — no-op */ };
      case null {
        teamStore.add({
          id;
          principalId;
          name;
          email;
          role;
          createdAt = Time.now();
        });
      };
    };
  };

  public func updateRole(
    teamStore : List.List<TeamTypes.TeamMember>,
    memberId : Text,
    newRole : Text,
  ) : Bool {
    var updated = false;
    teamStore.mapInPlace(func(m) {
      if (m.id == memberId) {
        updated := true;
        { m with role = newRole };
      } else {
        m;
      };
    });
    updated;
  };

  public func remove(
    teamStore : List.List<TeamTypes.TeamMember>,
    memberId : Text,
  ) : Bool {
    let sizeBefore = teamStore.size();
    let kept = teamStore.filter(func(m) { m.id != memberId });
    teamStore.clear();
    teamStore.append(kept);
    teamStore.size() < sizeBefore;
  };

  /// Generate a simple text-based unique ID from principal + timestamp
  public func generateId(principalId : Text) : Text {
    let ts = Time.now();
    principalId # "-" # ts.toText();
  };
};
