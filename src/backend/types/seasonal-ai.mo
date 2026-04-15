module {
  /// A seasonal period that can auto-activate zones and override capacity.
  public type SeasonalPeriod = {
    id : Text;
    name : Text;
    dateFrom : Text;         // "YYYY-MM-DD"
    dateTo : Text;           // "YYYY-MM-DD"
    isActive : Bool;
    autoActivate : Bool;     // auto-activate when today falls within dateFrom/dateTo
    activatedZones : [Text]; // list of zone names enabled during this period
    capacityOverride : ?Nat; // optional total seat override during this period
  };

  /// Result of an AI table-assignment suggestion.
  public type AISeatingSuggestion = {
    suggestionId : Text;
    suggestedTableIds : [Text];
    reasoning : Text;
    confidence : Float;
    partySize : Nat;
    zonePreference : ?Text;
    date : Text;
    createdAt : Int;         // nanoseconds since epoch
  };

  /// Feedback record for a previous AI suggestion (learning loop).
  public type SuggestionFeedback = {
    suggestionId : Text;
    accepted : Bool;
    rejectionReason : ?Text;
    recordedAt : Int;        // nanoseconds since epoch
  };

  /// Per-table/zone weight record used by the scoring algorithm.
  public type TableWeight = {
    tableId : Text;
    zoneId : Text;
    acceptCount : Nat;
    rejectCount : Nat;
  };

  /// Accuracy statistics returned to the analytics dashboard.
  public type SuggestionAccuracyStats = {
    totalSuggestions : Nat;
    acceptedCount : Nat;
    rejectedCount : Nat;
    acceptanceRatePct : Float; // 0.0–100.0
    periodDays : Nat;
  };

  /// Lightweight reservation summary passed to the AI scoring function.
  public type ReservationSummary = {
    tableId : Text;
    partySize : Nat;
    date : Text;             // "YYYY-MM-DD"
    time : Text;             // "HH:MM"
  };
};
