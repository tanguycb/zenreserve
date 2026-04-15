import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";
import TeamLib "../lib/team";
import TeamTypes "../types/team";

mixin (
  accessControlState : AccessControl.AccessControlState,
  teamStore : List.List<TeamTypes.TeamMember>,
) {
  /// List all team members. Admin-only.
  public shared query ({ caller }) func listTeamMembers() : async [TeamTypes.TeamMember] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return [];
    };
    TeamLib.list(teamStore);
  };

  /// Add a new team member. Owner-only.
  public shared ({ caller }) func addTeamMember(
    principalId : Text,
    name : Text,
    email : Text,
    role : Text,
  ) : async { #ok : TeamTypes.TeamMember; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can add team members");
    };
    if (name == "") {
      return #err("Name cannot be empty");
    };
    if (principalId == "") {
      return #err("Principal ID cannot be empty");
    };
    // Prevent duplicate entries
    switch (TeamLib.getByPrincipal(teamStore, principalId)) {
      case (?_) {
        return #err("A team member with this principal ID already exists");
      };
      case null {};
    };
    let id = TeamLib.generateId(principalId);
    TeamLib.add(teamStore, id, principalId, name, email, role);
    switch (TeamLib.getByPrincipal(teamStore, principalId)) {
      case (?member) { #ok(member) };
      case null { #err("Failed to add team member") };
    };
  };

  /// Update a team member's role. Owner-only.
  public shared ({ caller }) func updateTeamMemberRole(
    memberId : Text,
    newRole : Text,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can update team member roles");
    };
    if (newRole == "") {
      return #err("Role cannot be empty");
    };
    let success = TeamLib.updateRole(teamStore, memberId, newRole);
    if (success) { #ok } else { #err("Team member not found") };
  };

  /// Remove a team member. Owner-only.
  public shared ({ caller }) func removeTeamMember(
    memberId : Text,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can remove team members");
    };
    let success = TeamLib.remove(teamStore, memberId);
    if (success) { #ok } else { #err("Team member not found") };
  };
};
