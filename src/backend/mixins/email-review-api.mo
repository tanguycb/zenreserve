import Runtime "mo:core/Runtime";
import Set "mo:core/Set";
import AccessControl "mo:caffeineai-authorization/access-control";
import EmailTemplateLib "../lib/email-review";
import EmailTemplateTypes "../types/email-templates";
import EmailReviewTypes "../types/email-review";

mixin (
  accessControlState : AccessControl.AccessControlState,
  emailTemplateStore : EmailTemplateLib.EmailTemplateStore,
  reviewSentSet : EmailTemplateLib.ReviewSentSet,
  reviewSettings : { var value : EmailReviewTypes.ReviewRequestSettings },
) {
  // ─── Email templates ──────────────────────────────────────────────────────

  /// Returns all email templates including the review_request template.
  /// Missing types are filled with built-in Dutch defaults.
  public query func getEmailTemplates() : async [EmailTemplateTypes.EmailTemplate] {
    Runtime.trap("not implemented");
  };

  /// Saves a customised email template. Admin-only.
  public shared ({ caller }) func saveEmailTemplate(
    template : EmailTemplateTypes.EmailTemplate,
  ) : async { #ok; #err : Text } {
    Runtime.trap("not implemented");
  };

  /// Resets an email template to its built-in Dutch default. Admin-only.
  public shared ({ caller }) func resetEmailTemplate(
    templateType : EmailTemplateTypes.EmailTemplateType,
  ) : async { #ok; #err : Text } {
    Runtime.trap("not implemented");
  };

  /// Batch-applies shared branding to all templates in one call. Admin-only.
  public shared ({ caller }) func applyHouseStyleToAll(
    accentColor : Text,
    backgroundColor : Text,
    logoUrl : Text,
  ) : async { #ok; #err : Text } {
    Runtime.trap("not implemented");
  };

  // ─── Review request settings ──────────────────────────────────────────────

  /// Returns the current automated review request configuration.
  public query func getReviewRequestSettings() : async EmailReviewTypes.ReviewRequestSettings {
    Runtime.trap("not implemented");
  };

  /// Saves automated review request configuration. Admin-only.
  public shared ({ caller }) func saveReviewRequestSettings(
    enabled : Bool,
    delay : EmailReviewTypes.ReviewRequestDelay,
    message : Text,
  ) : async { #ok; #err : Text } {
    Runtime.trap("not implemented");
  };

  // ─── Duplicate-send prevention ─────────────────────────────────────────────

  /// Records that a review request email has been sent for a reservation.
  /// Idempotent — safe to call multiple times.
  public shared ({ caller }) func recordReviewRequestSent(
    reservationId : Text,
  ) : async { #ok; #err : Text } {
    Runtime.trap("not implemented");
  };

  /// Returns true if no review request has been sent for this reservation yet.
  public query func shouldSendReviewRequest(reservationId : Text) : async Bool {
    Runtime.trap("not implemented");
  };
};
