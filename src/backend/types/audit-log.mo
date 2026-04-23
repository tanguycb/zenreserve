module {
  /// A single audit log entry recording a settings or team mutation.
  public type AuditLogEntry = {
    id          : Text;
    timestamp   : Int;          // nanoseconds (Time.now())
    callerPrincipal : Text;
    callerName  : Text;         // resolved from team store, or "Owner"
    callerRole  : Text;         // e.g. "owner", "manager"
    action      : Text;         // e.g. "update", "add", "remove"
    page        : Text;         // e.g. "General Information", "Team"
    summary     : Text;         // human-readable description
    oldValue    : ?Text;        // optional snapshot of previous values
    newValue    : ?Text;        // optional snapshot of new values
  };
};
