import Set "mo:core/Set";
import AccessControl "mo:caffeineai-authorization/access-control";
import EmailReviewLib "../lib/email-review";
import EmailTemplateTypes "../types/email-templates";
import EmailReviewTypes "../types/email-review";

mixin (
  accessControlState : AccessControl.AccessControlState,
  emailTemplateStore : EmailReviewLib.EmailTemplateStore,
  reviewSentSet : EmailReviewLib.ReviewSentSet,
  reviewSettings : { var value : EmailReviewTypes.ReviewRequestSettings },
) {
  // ─── Email templates ──────────────────────────────────────────────────────

  /// Returns all email templates including the review_request template.
  /// Missing types are filled with built-in Dutch defaults.
  public query func getEmailTemplates() : async [EmailTemplateTypes.EmailTemplate] {
    EmailReviewLib.getAll(emailTemplateStore);
  };

  /// Saves a customised email template. Admin-only.
  public shared ({ caller }) func saveEmailTemplate(
    template : EmailTemplateTypes.EmailTemplate,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can save email templates");
    };
    EmailReviewLib.save(emailTemplateStore, template);
    #ok;
  };

  /// Resets an email template to its built-in Dutch default. Admin-only.
  public shared ({ caller }) func resetEmailTemplate(
    templateType : EmailTemplateTypes.EmailTemplateType,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can reset email templates");
    };
    EmailReviewLib.reset(emailTemplateStore, templateType);
    #ok;
  };

  /// Batch-applies shared branding to all templates in one call. Admin-only.
  public shared ({ caller }) func applyHouseStyleToAll(
    accentColor : Text,
    backgroundColor : Text,
    logoUrl : Text,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can apply house style");
    };
    EmailReviewLib.applyHouseStyle(emailTemplateStore, accentColor, backgroundColor, logoUrl);
    #ok;
  };

  /// Bulk-saves all email templates at once. Admin-only.
  public shared ({ caller }) func saveEmailTemplates(
    templates : [EmailTemplateTypes.EmailTemplate],
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can save email templates");
    };
    for (template in templates.values()) {
      EmailReviewLib.save(emailTemplateStore, template);
    };
    #ok;
  };

  // ─── Review request settings ──────────────────────────────────────────────

  /// Returns the current automated review request configuration.
  public query func getReviewRequestSettings() : async EmailReviewTypes.ReviewRequestSettings {
    reviewSettings.value;
  };

  /// Saves automated review request configuration. Admin-only.
  public shared ({ caller }) func saveReviewRequestSettings(
    enabled : Bool,
    delay : EmailReviewTypes.ReviewRequestDelay,
    message : Text,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized");
    };
    reviewSettings.value := { enabled; delay; message };
    #ok;
  };

  // ─── Duplicate-send prevention ─────────────────────────────────────────────

  /// Records that a review request email has been sent for a reservation.
  /// Idempotent — safe to call multiple times.
  public shared ({ caller }) func recordReviewRequestSent(
    reservationId : Text,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };
    EmailReviewLib.markReviewSent(reviewSentSet, reservationId);
    #ok;
  };

  /// Returns true if no review request has been sent for this reservation yet.
  public query func shouldSendReviewRequest(reservationId : Text) : async Bool {
    EmailReviewLib.shouldSendReview(reviewSentSet, reservationId);
  };
};
