import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";
import TeamLib "../lib/team";
import TeamTypes "../types/team";
import AuditLogTypes "../types/audit-log";
import Time "mo:core/Time";

mixin (
  accessControlState : AccessControl.AccessControlState,
  teamStore          : List.List<TeamTypes.TeamMember>,
  auditLog           : List.List<AuditLogTypes.AuditLogEntry>,
  auditLogCounter    : List.List<Nat>,
) {
  let TEAM_MAX_AUDIT_ENTRIES : Nat = 10_000;

  func resolveCallerInfoTeam(callerText : Text) : (Text, Text) {
    switch (teamStore.find(func(m : TeamTypes.TeamMember) : Bool { m.principalId == callerText })) {
      case (?member) { (member.name, member.role) };
      case null      { ("Owner", "owner") };
    };
  };

  func logTeam(callerText : Text, page : Text, action : Text, summary : Text) {
    let (callerName, callerRole) = resolveCallerInfoTeam(callerText);
    let currentId = auditLogCounter.at(0);
    auditLogCounter.put(0, currentId + 1);
    auditLog.add({
      id              = currentId.toText();
      timestamp       = Time.now();
      callerPrincipal = callerText;
      callerName;
      callerRole;
      action;
      page;
      summary;
      oldValue = null;
      newValue = null;
    });
    if (auditLog.size() > TEAM_MAX_AUDIT_ENTRIES) {
      let arr = auditLog.toArray();
      auditLog.clear();
      var i = 1;
      while (i < arr.size()) {
        auditLog.add(arr[i]);
        i += 1;
      };
    };
  };

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
    name        : Text,
    email       : Text,
    role        : Text,
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
    switch (TeamLib.getByPrincipal(teamStore, principalId)) {
      case (?_) {
        return #err("A team member with this principal ID already exists");
      };
      case null {};
    };
    let id = TeamLib.generateId(principalId);
    TeamLib.add(teamStore, id, principalId, name, email, role);
    switch (TeamLib.getByPrincipal(teamStore, principalId)) {
      case (?member) {
        logTeam(caller.toText(), "Team", "add", "Team member added: " # name # " (" # role # ")");
        #ok(member);
      };
      case null { #err("Failed to add team member") };
    };
  };

  /// Update a team member's role. Owner-only.
  public shared ({ caller }) func updateTeamMemberRole(
    memberId : Text,
    newRole  : Text,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can update team member roles");
    };
    if (newRole == "") {
      return #err("Role cannot be empty");
    };
    let success = TeamLib.updateRole(teamStore, memberId, newRole);
    if (success) {
      logTeam(caller.toText(), "Team", "update", "Team member role updated to: " # newRole);
      #ok;
    } else {
      #err("Team member not found");
    };
  };

  /// Remove a team member. Owner-only.
  public shared ({ caller }) func removeTeamMember(
    memberId : Text,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can remove team members");
    };
    let success = TeamLib.remove(teamStore, memberId);
    if (success) {
      logTeam(caller.toText(), "Team", "remove", "Team member removed (id=" # memberId # ")");
      #ok;
    } else {
      #err("Team member not found");
    };
  };
};
