import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import SeasonalAiTypes "../types/seasonal-ai";

mixin (
  accessControlState : AccessControl.AccessControlState,
  seasonalPeriods : List.List<SeasonalAiTypes.SeasonalPeriod>,
  suggestionFeedback : List.List<SeasonalAiTypes.SuggestionFeedback>,
  tableWeights : Map.Map<Text, SeasonalAiTypes.TableWeight>,
  suggestionHistory : Map.Map<Text, SeasonalAiTypes.AISeatingSuggestion>,
) {

  // ── Seasonal period CRUD ─────────────────────────────────────────────────

  /// Returns all seasonal periods. Accessible to admin and staff.
  public query func getSeasonalPeriods() : async [SeasonalAiTypes.SeasonalPeriod] {
    seasonalPeriods.toArray();
  };

  /// Creates or replaces a seasonal period identified by id. Admin-only.
  public shared ({ caller }) func saveSeasonalPeriod(
    period : SeasonalAiTypes.SeasonalPeriod,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: admin required");
    };
    let kept = seasonalPeriods.filter(func(p : SeasonalAiTypes.SeasonalPeriod) : Bool {
      p.id != period.id
    });
    seasonalPeriods.clear();
    seasonalPeriods.addAll(kept.values());
    seasonalPeriods.add(period);
    #ok;
  };

  /// Deletes a seasonal period by id. Admin-only.
  public shared ({ caller }) func deleteSeasonalPeriod(
    id : Text,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: admin required");
    };
    let kept2 = seasonalPeriods.filter(func(p : SeasonalAiTypes.SeasonalPeriod) : Bool {
      p.id != id
    });
    seasonalPeriods.clear();
    seasonalPeriods.addAll(kept2.values());
    #ok;
  };

  /// Activates or deactivates a seasonal period. Admin-only.
  public shared ({ caller }) func toggleSeasonalPeriod(
    id : Text,
    active : Bool,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: admin required");
    };
    var found = false;
    seasonalPeriods.mapInPlace(func(p : SeasonalAiTypes.SeasonalPeriod) : SeasonalAiTypes.SeasonalPeriod {
      if (p.id == id) {
        found := true;
        { p with isActive = active };
      } else {
        p;
      };
    });
    if (found) { #ok } else { #err("Seasonal period not found") };
  };

  // ── Active season / zone detection ──────────────────────────────────────

  /// Returns the currently active seasonal period for a given date,
  /// or null if no period applies.
  public query func getActiveSeason(
    date : Text,
  ) : async ?SeasonalAiTypes.SeasonalPeriod {
    seasonalPeriods.find(func(p : SeasonalAiTypes.SeasonalPeriod) : Bool {
      p.isActive and p.dateFrom <= date and date <= p.dateTo
    });
  };

  /// Returns the list of zone names that should be auto-activated for a date.
  public query func getActiveZonesForDate(
    date : Text,
  ) : async [Text] {
    let matching = seasonalPeriods.filter(func(p : SeasonalAiTypes.SeasonalPeriod) : Bool {
      p.isActive and p.autoActivate and p.dateFrom <= date and date <= p.dateTo
    });
    var zones : [Text] = [];
    for (p in matching.values()) {
      zones := zones.concat(p.activatedZones);
    };
    zones;
  };

  // ── AI table suggestion ──────────────────────────────────────────────────

  /// Suggests the best table(s) for a party.
  /// Returns a scoring-based suggestion derived from tableWeights and existing reservations.
  public shared ({ caller }) func suggestTable(
    partySize : Nat,
    zonePreference : ?Text,
    date : Text,
    time : Text,
    existingReservations : [SeasonalAiTypes.ReservationSummary],
  ) : async { #ok : SeasonalAiTypes.AISeatingSuggestion; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };

    // Collect table IDs already occupied at the requested date+time
    let occupiedTableIds : [Text] = existingReservations
      .filter(func(r : SeasonalAiTypes.ReservationSummary) : Bool {
        r.date == date and r.time == time
      })
      .map<SeasonalAiTypes.ReservationSummary, Text>(func(r) { r.tableId });

    // Pick best-scored table from weights; fall back to empty suggestion
    var bestTableId : ?Text = null;
    var bestScore : Int = -1;
    for ((tableId, weight) in tableWeights.entries()) {
      let isOccupied = occupiedTableIds.find(func(id : Text) : Bool { id == tableId }) != null;
      if (not isOccupied) {
        let zoneBonus : Int = switch (zonePreference) {
          case (?pref) { if (weight.zoneId == pref) 10 else 0 };
          case null { 0 };
        };
        let score : Int = weight.acceptCount.toInt() - weight.rejectCount.toInt() + zoneBonus;
        if (score > bestScore) {
          bestScore := score;
          bestTableId := ?tableId;
        };
      };
    };

    let suggestedIds : [Text] = switch (bestTableId) {
      case (?id) { [id] };
      case null { [] };
    };

    let suggestionId = "sugg-" # date # "-" # time # "-" # debug_show(partySize);
    let suggestion : SeasonalAiTypes.AISeatingSuggestion = {
      suggestionId;
      suggestedTableIds = suggestedIds;
      reasoning = if (suggestedIds.size() == 0) {
        "No suitable table found for the requested time slot."
      } else {
        "Table selected based on historical acceptance data" # (switch zonePreference {
          case (?z) { " and zone preference: " # z };
          case null { "" };
        })
      };
      confidence = if (suggestedIds.size() == 0) { 0.0 } else { 0.75 };
      partySize;
      zonePreference;
      date;
      createdAt = Time.now();
    };

    suggestionHistory.add(suggestionId, suggestion);
    #ok(suggestion);
  };

  // ── AI feedback / learning loop ──────────────────────────────────────────

  /// Records whether a previous suggestion was accepted or rejected.
  /// Updates internal table-weight counters for the learning loop.
  public shared ({ caller }) func recordSuggestionFeedback(
    suggestionId : Text,
    accepted : Bool,
    rejectionReason : ?Text,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };
    switch (suggestionHistory.get(suggestionId)) {
      case null { return #err("Suggestion not found") };
      case (?suggestion) {
        let feedback : SeasonalAiTypes.SuggestionFeedback = {
          suggestionId;
          accepted;
          rejectionReason;
          recordedAt = Time.now();
        };
        suggestionFeedback.add(feedback);

        // Update per-table weights for the learning loop
        for (tableId in suggestion.suggestedTableIds.values()) {
          switch (tableWeights.get(tableId)) {
            case (?existing) {
              let updated : SeasonalAiTypes.TableWeight = if (accepted) {
                { existing with acceptCount = existing.acceptCount + 1 };
              } else {
                { existing with rejectCount = existing.rejectCount + 1 };
              };
              tableWeights.add(tableId, updated);
            };
            case null {
              let newWeight : SeasonalAiTypes.TableWeight = {
                tableId;
                zoneId = "";
                acceptCount = if (accepted) 1 else 0;
                rejectCount = if (accepted) 0 else 1;
              };
              tableWeights.add(tableId, newWeight);
            };
          };
        };
        #ok;
      };
    };
  };

  // ── Analytics ────────────────────────────────────────────────────────────

  /// Returns AI suggestion accuracy statistics over the last N days.
  public query func getSuggestionAccuracyStats(
    days : Nat,
  ) : async SeasonalAiTypes.SuggestionAccuracyStats {
    let nsPerDay : Int = 24 * 60 * 60 * 1_000_000_000;
    let cutoff : Int = Time.now() - (days.toInt() * nsPerDay);
    let relevant = suggestionFeedback.filter(func(f : SeasonalAiTypes.SuggestionFeedback) : Bool {
      f.recordedAt >= cutoff
    });
    let total : Nat = relevant.size();
    var accepted : Nat = 0;
    for (f in relevant.values()) {
      if (f.accepted) { accepted += 1 };
    };
    let rejected : Nat = total - accepted;
    let rate : Float = if (total == 0) { 0.0 } else {
      accepted.toFloat() / total.toFloat() * 100.0
    };
    {
      totalSuggestions = total;
      acceptedCount = accepted;
      rejectedCount = rejected;
      acceptanceRatePct = rate;
      periodDays = days;
    };
  };
};
