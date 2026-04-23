import Map "mo:core/Map";
import EmailTemplateTypes "../types/email-templates";

module {
  public type EmailTemplateStore = Map.Map<Text, EmailTemplateTypes.EmailTemplate>;

  /// Returns the default template for the given templateType.
  /// Provides sensible Dutch defaults with template variables.
  public func getDefault(templateType : EmailTemplateTypes.EmailTemplateType) : EmailTemplateTypes.EmailTemplate {
    switch (templateType) {
      case "confirmation" {
        {
          id = "confirmation";
          templateType = "confirmation";
          subject = "Bevestiging van uw reservering — {{restaurant_name}}";
          heading = "Uw reservering is bevestigd!";
          bodyHtml = "<p>Beste {{guest_name}},</p><p>Bedankt voor uw reservering bij <strong>{{restaurant_name}}</strong>.</p><p><strong>Datum:</strong> {{date}}<br/><strong>Tijd:</strong> {{time}}<br/><strong>Aantal personen:</strong> {{party_size}}<br/><strong>Reserveringsnummer:</strong> {{reservation_id}}</p><p>Tot dan!</p>";
          footer = "U ontvangt dit bericht omdat u een reservering heeft gemaakt via {{restaurant_name}}.";
          accentColor = "#22C55E";
          backgroundColor = "#FFFFFF";
          logoUrl = "";
        };
      };
      case "reminder_24h" {
        {
          id = "reminder_24h";
          templateType = "reminder_24h";
          subject = "Herinnering: uw reservering morgen — {{restaurant_name}}";
          heading = "Uw reservering is morgen!";
          bodyHtml = "<p>Beste {{guest_name}},</p><p>Dit is een vriendelijke herinnering dat u morgen een reservering heeft bij <strong>{{restaurant_name}}</strong>.</p><p><strong>Datum:</strong> {{date}}<br/><strong>Tijd:</strong> {{time}}<br/><strong>Aantal personen:</strong> {{party_size}}</p><p>Tot morgen!</p>";
          footer = "U ontvangt dit bericht omdat u een reservering heeft bij {{restaurant_name}}.";
          accentColor = "#22C55E";
          backgroundColor = "#FFFFFF";
          logoUrl = "";
        };
      };
      case "reminder_2h" {
        {
          id = "reminder_2h";
          templateType = "reminder_2h";
          subject = "Herinnering: uw reservering over 2 uur — {{restaurant_name}}";
          heading = "Over 2 uur zien we u!";
          bodyHtml = "<p>Beste {{guest_name}},</p><p>Uw reservering bij <strong>{{restaurant_name}}</strong> begint over 2 uur.</p><p><strong>Datum:</strong> {{date}}<br/><strong>Tijd:</strong> {{time}}<br/><strong>Aantal personen:</strong> {{party_size}}</p><p>Tot straks!</p>";
          footer = "U ontvangt dit bericht omdat u een reservering heeft bij {{restaurant_name}}.";
          accentColor = "#22C55E";
          backgroundColor = "#FFFFFF";
          logoUrl = "";
        };
      };
      case "cancellation" {
        {
          id = "cancellation";
          templateType = "cancellation";
          subject = "Annulering van uw reservering — {{restaurant_name}}";
          heading = "Uw reservering is geannuleerd";
          bodyHtml = "<p>Beste {{guest_name}},</p><p>Uw reservering bij <strong>{{restaurant_name}}</strong> op {{date}} om {{time}} is geannuleerd.</p><p>We hopen u een andere keer te mogen verwelkomen.</p>";
          footer = "U ontvangt dit bericht omdat uw reservering bij {{restaurant_name}} is geannuleerd.";
          accentColor = "#EF4444";
          backgroundColor = "#FFFFFF";
          logoUrl = "";
        };
      };
      case _ {
        {
          id = templateType;
          templateType;
          subject = "Bericht van {{restaurant_name}}";
          heading = "Bericht";
          bodyHtml = "<p>Beste {{guest_name}},</p><p>U ontvangt dit bericht van {{restaurant_name}}.</p>";
          footer = "{{restaurant_name}}";
          accentColor = "#22C55E";
          backgroundColor = "#FFFFFF";
          logoUrl = "";
        };
      };
    };
  };

  let allTypes : [EmailTemplateTypes.EmailTemplateType] = [
    "confirmation",
    "reminder_24h",
    "reminder_2h",
    "cancellation",
  ];

  /// Returns all 4 templates (confirmation, reminder_24h, reminder_2h, cancellation),
  /// falling back to the built-in default for any type not yet customised.
  public func getAll(store : EmailTemplateStore) : [EmailTemplateTypes.EmailTemplate] {
    allTypes.map<EmailTemplateTypes.EmailTemplateType, EmailTemplateTypes.EmailTemplate>(
      func(t) {
        switch (store.get(t)) {
          case (?tmpl) tmpl;
          case null getDefault(t);
        };
      }
    );
  };

  /// Saves (upserts) a template into the store keyed by templateType.
  public func save(store : EmailTemplateStore, template : EmailTemplateTypes.EmailTemplate) {
    store.add(template.templateType, template);
  };

  /// Removes the custom template for the given type, so it reverts to the built-in default.
  public func reset(store : EmailTemplateStore, templateType : EmailTemplateTypes.EmailTemplateType) {
    store.remove(templateType);
  };
};
