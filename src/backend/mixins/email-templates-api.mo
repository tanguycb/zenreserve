import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import EmailTemplateLib "../lib/email-templates";
import EmailTemplateTypes "../types/email-templates";

mixin (
  accessControlState : AccessControl.AccessControlState,
  emailTemplateStore : EmailTemplateLib.EmailTemplateStore,
) {
  /// Returns all email templates (confirmation, reminder_24h, reminder_2h, cancellation).
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

  /// Resets an email template to its built-in default. Admin-only.
  public shared ({ caller }) func resetEmailTemplate(
    templateType : EmailTemplateTypes.EmailTemplateType,
  ) : async { #ok; #err : Text } {
    Runtime.trap("not implemented");
  };
};
