import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Map "mo:core/Map";
import SeasonalAiTypes "../types/seasonal-ai";

module {

  // ── Seasonal period CRUD ───────────────────────────────────────────────────

  /// Returns all seasonal periods as an immutable array.
  public func listSeasonalPeriods(
    periodsStore : List.List<SeasonalAiTypes.SeasonalPeriod>
  ) : [SeasonalAiTypes.SeasonalPeriod] {
    Runtime.trap("not implemented");
  };

  /// Inserts a new period or replaces the one with matching id.
  public func saveSeasonalPeriod(
    periodsStore : List.List<SeasonalAiTypes.SeasonalPeriod>,
    period : SeasonalAiTypes.SeasonalPeriod,
  ) {
    Runtime.trap("not implemented");
  };

  /// Removes the period identified by id. No-op if not found.
  public func deleteSeasonalPeriod(
    periodsStore : List.List<SeasonalAiTypes.SeasonalPeriod>,
    id : Text,
  ) {
    Runtime.trap("not implemented");
  };

  /// Sets the isActive flag of the matching period.
  public func toggleSeasonalPeriod(
    periodsStore : List.List<SeasonalAiTypes.SeasonalPeriod>,
    id : Text,
    active : Bool,
  ) {
    Runtime.trap("not implemented");
  };

  // ── Active season detection ────────────────────────────────────────────────

  /// Returns the first active (or autoActivate-eligible) period that contains
  /// the given date ("YYYY-MM-DD"). Returns null when none qualifies.
  public func getActiveSeason(
    periodsStore : List.List<SeasonalAiTypes.SeasonalPeriod>,
    date : Text,
  ) : ?SeasonalAiTypes.SeasonalPeriod {
    Runtime.trap("not implemented");
  };

  /// Returns the list of zone names to auto-activate for the given date.
  /// Delegates to getActiveSeason and reads activatedZones.
  public func getActiveZonesForDate(
    periodsStore : List.List<SeasonalAiTypes.SeasonalPeriod>,
    date : Text,
  ) : [Text] {
    Runtime.trap("not implemented");
  };

  // ── AI table suggestion ────────────────────────────────────────────────────

  /// Scores each available table and returns the best match.
  /// Scoring factors: capacity fit, zone match, historical acceptance rate.
  /// Returns a fully populated AISeatingSuggestion (no http-outcall — pure logic).
  public func suggestTable(
    tableWeights : Map.Map<Text, SeasonalAiTypes.TableWeight>,
    existingReservations : [SeasonalAiTypes.ReservationSummary],
    partySize : Nat,
    zonePreference : ?Text,
    date : Text,
    time : Text,
    suggestionId : Text,
    nowNs : Int,
  ) : SeasonalAiTypes.AISeatingSuggestion {
    Runtime.trap("not implemented");
  };

  // ── AI feedback / learning loop ────────────────────────────────────────────

  /// Stores feedback and updates the table-weight counters in-place.
  public func recordSuggestionFeedback(
    feedbackStore : List.List<SeasonalAiTypes.SuggestionFeedback>,
    tableWeights : Map.Map<Text, SeasonalAiTypes.TableWeight>,
    suggestionHistory : Map.Map<Text, SeasonalAiTypes.AISeatingSuggestion>,
    suggestionId : Text,
    accepted : Bool,
    rejectionReason : ?Text,
    nowNs : Int,
  ) {
    Runtime.trap("not implemented");
  };

  // ── Accuracy analytics ─────────────────────────────────────────────────────

  /// Computes acceptance-rate statistics over the last `days` calendar days.
  public func getSuggestionAccuracyStats(
    feedbackStore : List.List<SeasonalAiTypes.SuggestionFeedback>,
    days : Nat,
    nowNs : Int,
  ) : SeasonalAiTypes.SuggestionAccuracyStats {
    Runtime.trap("not implemented");
  };

  // ── HTTP-outcall AI prompt helpers ─────────────────────────────────────────

  /// Builds a JSON prompt payload for an external AI service.
  /// Returns the serialised Text to be forwarded via http-outcalls.
  public func buildAIPrompt(
    partySize : Nat,
    date : Text,
    time : Text,
    preferences : Text,
    tablesSummary : Text,
    reservationContext : Text,
  ) : Text {
    Runtime.trap("not implemented");
  };

  /// Parses the raw response body from an external AI service into a suggestion.
  /// Returns a deterministic fallback when the response cannot be parsed.
  public func parseAIResponse(
    responseBody : Text,
    suggestionId : Text,
    partySize : Nat,
    zonePreference : ?Text,
    date : Text,
    nowNs : Int,
  ) : SeasonalAiTypes.AISeatingSuggestion {
    Runtime.trap("not implemented");
  };
};
