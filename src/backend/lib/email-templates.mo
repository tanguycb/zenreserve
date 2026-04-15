import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import EmailTemplateTypes "../types/email-templates";

module {
  public type EmailTemplateStore = Map.Map<Text, EmailTemplateTypes.EmailTemplate>;

  /// Returns the default template for the given templateType.
  /// Provides sensible Dutch defaults with template variables.
  public func getDefault(templateType : EmailTemplateTypes.EmailTemplateType) : EmailTemplateTypes.EmailTemplate {
    Runtime.trap("not implemented");
  };

  /// Returns all 4 templates (confirmation, reminder_24h, reminder_2h, cancellation),
  /// falling back to the built-in default for any type not yet customised.
  public func getAll(store : EmailTemplateStore) : [EmailTemplateTypes.EmailTemplate] {
    Runtime.trap("not implemented");
  };

  /// Saves (upserts) a template into the store keyed by templateType.
  public func save(store : EmailTemplateStore, template : EmailTemplateTypes.EmailTemplate) {
    Runtime.trap("not implemented");
  };

  /// Removes the custom template for the given type, so it reverts to the built-in default.
  public func reset(store : EmailTemplateStore, templateType : EmailTemplateTypes.EmailTemplateType) {
    Runtime.trap("not implemented");
  };
};
