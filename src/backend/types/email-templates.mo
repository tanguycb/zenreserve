module {
  /// Template type identifiers
  public type EmailTemplateType = Text; // "confirmation" | "reminder_24h" | "reminder_2h" | "cancellation"

  /// A customizable email template for guest notifications.
  /// Body uses template variables: {{guest_name}}, {{date}}, {{time}},
  /// {{party_size}}, {{restaurant_name}}, {{reservation_id}}
  public type EmailTemplate = {
    id : Text;                  // unique id matching templateType for the 4 default templates
    templateType : EmailTemplateType;
    subject : Text;
    heading : Text;
    bodyHtml : Text;
    footer : Text;
    accentColor : Text;         // hex color e.g. "#22C55E"
    backgroundColor : Text;     // hex color e.g. "#FFFFFF"
    logoUrl : Text;             // URL from object-storage, or "" when not set
  };
};
