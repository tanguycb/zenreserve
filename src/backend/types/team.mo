module {
  /// A team member record stored in the backend
  public type TeamMember = {
    id : Text;          // unique identifier (e.g. UUID-style text)
    principalId : Text; // Internet Identity principal as text
    name : Text;
    email : Text;
    role : Text;        // "owner" | "manager" | "staff" | "marketing"
    createdAt : Int;    // nanoseconds since epoch (Time.now()), same as CommonTypes.Timestamp
  };
};
