module {
  /// Days of week: 0=Sunday, 1=Monday, ..., 6=Saturday
  public type DayOfWeek = Nat;

  /// A named service window (e.g. Lunch, Diner, Brunch)
  public type ServiceHours = {
    id : Text;
    name : Text;
    openTime : Text;  // "HH:MM"
    closeTime : Text; // "HH:MM"
    maxCapacity : Nat;
    enabledDays : [DayOfWeek]; // days this service runs
  };

  /// An exceptional (one-off) closing day, optionally for a specific service
  public type ClosingDay = {
    date : Text;      // "YYYY-MM-DD"
    reason : Text;
    serviceId : ?Text; // null = whole restaurant closed
  };

  /// Capacity limit for a named zone (e.g. "Terras", "Binnen", "Bar")
  public type ZoneCapacity = {
    zoneName : Text;
    maxGuests : Nat;
  };

  /// A table type with its seating capacity and how many of that type exist
  public type TableType = {
    typeName : Text;
    capacity : Nat;
    count : Nat;
  };

  /// Global occupancy / party-size settings
  public type OccupancySettings = {
    globalCeilingPercent : Nat; // 0-100, e.g. 85 means never above 85%
    maxGuestsPerReservationMin : Nat;
    maxGuestsPerReservationMax : Nat;
  };

  /// Reservation policy rules
  public type ReservationRules = {
    advanceBookingDays : Nat;           // how many days ahead guests can book
    cancellationHoursBeforeFree : Nat;  // free cancellation up to X hours before
    depositRequired : Bool;
    depositAmountEur : Nat;             // in euro cents
    depositRequiredAbovePartySize : Nat; // require deposit when party >= this size
    noShowFeeEur : Nat;                 // in euro cents
    minPartySize : Nat;
    maxPartySize : Nat;
    maxStayMinutesLunch : Nat;
    maxStayMinutesDinner : Nat;
  };

  /// A single custom question in the guest form
  public type CustomQuestion = {
    id : Text;
    labelText : Text;
    questionType : { #text; #dropdown };
    options : [Text];  // used when type = #dropdown
    required : Bool;
  };

  /// Guest form / reservation form settings
  public type GuestFormSettings = {
    requirePhone : Bool;
    requireAllergies : Bool;
    requireDietPreferences : Bool;
    customQuestions : [CustomQuestion];
  };

  /// Widget & branding settings
  public type BrandingSettings = {
    primaryColor : Text;    // hex color e.g. "#22C55E"
    accentColor : Text;
    logoUrl : ?Text;
    welcomeText : Text;
    confirmationText : Text;
    defaultLanguage : Text; // "nl" | "en" | "fr" | "de"
  };

  /// Notification settings
  public type NotificationSettings = {
    sendConfirmationEmail : Bool;
    sendReminderEmail : Bool;
    reminderHoursBefore : [Nat]; // e.g. [48, 24, 2]
    sendCancellationEmail : Bool;
    waitlistAutoActivate : Bool;
  };

  /// Integration settings
  public type IntegrationSettings = {
    stripePublicKey : Text;
    stripeEnabled : Bool;
    mollieEnabled : Bool;
    posSystem : ?Text;          // e.g. "Lightspeed", "Square"
    calendarSyncEnabled : Bool;
    apiKey : Text;
  };

  /// Full extended restaurant configuration
  public type RestaurantExtendedConfig = {
    // General info
    restaurantName : Text;
    currency : Text;
    timezone : Text;
    contactPhone : Text;
    contactEmail : Text;
    logoUrl : ?Text;

    // Legacy slot-based config (kept for backwards-compat)
    totalSeatsPerSlot : Nat;
    openingHour : Nat;
    closingHour : Nat;
    slotIntervalMinutes : Nat;

    // Extended service-based config
    services : [ServiceHours];

    // Closing days
    fixedClosingDays : [DayOfWeek]; // always-closed weekdays
    exceptionalClosingDays : [ClosingDay];

    // Capacity & occupancy
    zones : [ZoneCapacity];
    tableTypes : [TableType];
    occupancySettings : ?OccupancySettings;

    // New settings sections
    reservationRules : ReservationRules;
    guestForm : GuestFormSettings;
    branding : BrandingSettings;
    notifications : NotificationSettings;
    integrations : IntegrationSettings;
  };
};
