import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import AccessControl "mo:caffeineai-authorization/access-control";
import AuditLogTypes "../types/audit-log";
import TeamTypes "../types/team";

mixin (
  accessControlState : AccessControl.AccessControlState,
  auditLog           : List.List<AuditLogTypes.AuditLogEntry>,
  auditLogCounter    : List.List<Nat>,
  teamStore          : List.List<TeamTypes.TeamMember>,
) {
  // ── Internal helpers ──────────────────────────────────────────────────────

  // Maximum number of entries retained in the ring buffer.
  let AUDIT_MAX_ENTRIES : Nat = 10_000;

  /// Resolve a caller principal to a human-readable name + role by checking
  /// the team store. Falls back to "Owner" / "owner" if not found.
  func resolveCallerInfoAudit(callerText : Text) : (Text, Text) {
    switch (teamStore.find(func(m : TeamTypes.TeamMember) : Bool { m.principalId == callerText })) {
      case (?member) { (member.name, member.role) };
      case null      { ("Owner", "owner") };
    };
  };

  /// Append an audit entry. Enforces MAX_AUDIT_ENTRIES ring-buffer limit by
  /// dropping the oldest entry when the cap is exceeded.
  public func logAuditEntry(
    callerText : Text,
    page       : Text,
    action     : Text,
    summary    : Text,
    oldValue   : ?Text,
    newValue   : ?Text,
  ) : () {
    let (callerName, callerRole) = resolveCallerInfoAudit(callerText);
    let currentId = auditLogCounter.at(0);
    auditLogCounter.put(0, currentId + 1);

    let entry : AuditLogTypes.AuditLogEntry = {
      id              = currentId.toText();
      timestamp       = Time.now();
      callerPrincipal = callerText;
      callerName;
      callerRole;
      action;
      page;
      summary;
      oldValue;
      newValue;
    };

    auditLog.add(entry);

    // Ring-buffer: when over the limit, rebuild without the oldest entry (index 0)
    if (auditLog.size() > AUDIT_MAX_ENTRIES) {
      let arr = auditLog.toArray();
      auditLog.clear();
      var i = 1;
      while (i < arr.size()) {
        auditLog.add(arr[i]);
        i += 1;
      };
    };
  };

  // ── Public API ────────────────────────────────────────────────────────────

  /// Returns all audit log entries sorted newest-first. Admin-only.
  public query ({ caller }) func getAuditLog() : async { #ok : [AuditLogTypes.AuditLogEntry]; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only admins can view the audit log");
    };
    let arr = auditLog.toArray();
    #ok(arr.reverse());
  };

  /// Returns a paginated slice of audit log entries, newest-first. Admin-only.
  public query ({ caller }) func getAuditLogPaginated(
    offset : Nat,
    limit  : Nat,
  ) : async { #ok : { entries : [AuditLogTypes.AuditLogEntry]; total : Nat }; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only admins can view the audit log");
    };
    let arr = auditLog.toArray().reverse();
    let total = arr.size();
    let safeOffset = if (offset >= total) total else offset;
    let safeEnd    = Nat.min(safeOffset + limit, total);
    let entries    = arr.sliceToArray(safeOffset.toInt(), safeEnd.toInt());
    #ok({ entries; total });
  };
};
