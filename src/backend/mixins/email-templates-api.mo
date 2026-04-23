import AccessControl "mo:caffeineai-authorization/access-control";
import EmailTemplateLib "../lib/email-templates";
import EmailTemplateTypes "../types/email-templates";

mixin (
  accessControlState : AccessControl.AccessControlState,
  emailTemplateStore : EmailTemplateLib.EmailTemplateStore,
) {
  /// Returns all email templates (confirmation, reminder_24h, reminder_2h, cancellation).
  /// Missing types are filled with built-in Dutch defaults. Admin-only.
  public query ({ caller }) func getEmailTemplates() : async [EmailTemplateTypes.EmailTemplate] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return [];
    };
    EmailTemplateLib.getAll(emailTemplateStore);
  };

  /// Saves a customised email template. Admin-only.
  public shared ({ caller }) func saveEmailTemplate(
    template : EmailTemplateTypes.EmailTemplate,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can save email templates");
    };
    EmailTemplateLib.save(emailTemplateStore, template);
    #ok;
  };

  /// Resets an email template to its built-in default. Admin-only.
  public shared ({ caller }) func resetEmailTemplate(
    templateType : EmailTemplateTypes.EmailTemplateType,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can reset email templates");
    };
    EmailTemplateLib.reset(emailTemplateStore, templateType);
    #ok;
  };

  /// Bulk-saves all email templates at once. Admin-only.
  /// Replaces the entire set of stored templates with the provided array.
  public shared ({ caller }) func saveEmailTemplates(
    templates : [EmailTemplateTypes.EmailTemplate],
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can save email templates");
    };
    for (template in templates.values()) {
      EmailTemplateLib.save(emailTemplateStore, template);
    };
    #ok;
  };
};
