import Map "mo:core/Map";
import Set "mo:core/Set";
import Runtime "mo:core/Runtime";
import EmailTemplateTypes "../types/email-templates";
import EmailReviewTypes "../types/email-review";

module {
  public type EmailTemplateStore = Map.Map<Text, EmailTemplateTypes.EmailTemplate>;
  public type ReviewSentSet = Set.Set<Text>;

  // ─── Default Dutch templates ─────────────────────────────────────────────

  /// Returns the built-in Dutch default for a given templateType.
  /// Covers: confirmation, reminder_24h, reminder_2h, cancellation, review_request
  public func getDefault(templateType : EmailTemplateTypes.EmailTemplateType) : EmailTemplateTypes.EmailTemplate {
    Runtime.trap("not implemented");
  };

  // ─── Template CRUD ────────────────────────────────────────────────────────

  /// Returns all templates (confirmation, reminder_24h, reminder_2h, cancellation, review_request),
  /// filling in built-in Dutch defaults for any type not yet customised.
  public func getAll(store : EmailTemplateStore) : [EmailTemplateTypes.EmailTemplate] {
    Runtime.trap("not implemented");
  };

  /// Upserts a template into the store keyed by templateType.
  public func save(store : EmailTemplateStore, template : EmailTemplateTypes.EmailTemplate) {
    Runtime.trap("not implemented");
  };

  /// Removes the custom template for the given type so it reverts to the default.
  public func reset(store : EmailTemplateStore, templateType : EmailTemplateTypes.EmailTemplateType) {
    Runtime.trap("not implemented");
  };

  /// Batch-applies shared branding (accentColor, backgroundColor, logoUrl) to all templates.
  public func applyHouseStyle(
    store : EmailTemplateStore,
    accentColor : Text,
    backgroundColor : Text,
    logoUrl : Text,
  ) {
    Runtime.trap("not implemented");
  };

  // ─── Review request settings ─────────────────────────────────────────────

  /// Returns the current review request settings from the singleton list.
  public func getReviewSettings(
    settingsHolder : { var value : EmailReviewTypes.ReviewRequestSettings }
  ) : EmailReviewTypes.ReviewRequestSettings {
    Runtime.trap("not implemented");
  };

  /// Persists updated review request settings.
  public func saveReviewSettings(
    settingsHolder : { var value : EmailReviewTypes.ReviewRequestSettings },
    enabled : Bool,
    delay : EmailReviewTypes.ReviewRequestDelay,
    message : Text,
  ) {
    Runtime.trap("not implemented");
  };

  // ─── Duplicate-send prevention ────────────────────────────────────────────

  /// Records that a review request was sent for the given reservationId.
  public func markReviewSent(sentSet : ReviewSentSet, reservationId : Text) {
    Runtime.trap("not implemented");
  };

  /// Returns true when no review request has been sent for this reservationId yet.
  public func shouldSendReview(sentSet : ReviewSentSet, reservationId : Text) : Bool {
    Runtime.trap("not implemented");
  };
};
