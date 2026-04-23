import List "mo:core/List";
import Int "mo:core/Int";
import SettingsTypes "../types/settings";

module {
  // ── Default zone definitions seeded on first run ──────────────────────────
  func defaultZoneDefs() : [SettingsTypes.Zone] {
    [
      { id = "binnen";   name = "Binnen";   color = "#3B82F6"; maxGuests = 40; boundaries = null },
      { id = "terras";   name = "Terras";   color = "#22C55E"; maxGuests = 20; boundaries = null },
      { id = "bar";      name = "Bar";      color = "#F59E0B"; maxGuests = 15; boundaries = null },
      { id = "privezaal"; name = "Privézaal"; color = "#8B5CF6"; maxGuests = 20; boundaries = null },
      { id = "rooftop";  name = "Rooftop";  color = "#EF4444"; maxGuests = 30; boundaries = null },
    ]
  };

  func defaultReservationRules() : SettingsTypes.ReservationRules {
    {
      advanceBookingDays = 90;
      cancellationHoursBeforeFree = 24;
      depositRequired = false;
      depositAmountEur = 0;
      depositRequiredAbovePartySize = 8;
      noShowFeeEur = 0;
      minPartySize = 1;
      maxPartySize = 20;
      maxStayMinutesLunch = 120;
      maxStayMinutesDinner = 180;
    };
  };

  func defaultGuestForm() : SettingsTypes.GuestFormSettings {
    {
      requirePhone = true;
      requireAllergies = false;
      requireDietPreferences = false;
      customQuestions = [];
      showBabiesChildren = true;
    };
  };

  func defaultBranding() : SettingsTypes.BrandingSettings {
    {
      primaryColor = "#22C55E";
      accentColor = "#3B82F6";
      logoUrl = null;
      welcomeText = "Welcome! We look forward to seeing you.";
      confirmationText = "Your reservation is confirmed. See you soon!";
      defaultLanguage = "nl";
    };
  };

  func defaultNotifications() : SettingsTypes.NotificationSettings {
    {
      sendConfirmationEmail = true;
      sendReminderEmail = true;
      reminderHoursBefore = [24, 2];
      sendCancellationEmail = true;
      waitlistAutoActivate = true;
    };
  };

  func defaultIntegrations() : SettingsTypes.IntegrationSettings {
    {
      stripePublicKey = "";
      stripeEnabled = false;
      mollieEnabled = false;
      posSystem = null;
      calendarSyncEnabled = false;
      apiKey = "";
    };
  };

  public func getDefault() : SettingsTypes.RestaurantExtendedConfig {
    {
      restaurantName = "My Restaurant";
      currency = "EUR";
      timezone = "Europe/Brussels";
      contactPhone = "";
      contactEmail = "";
      logoUrl = null;
      totalSeatsPerSlot = 20;
      openingHour = 12;
      closingHour = 22;
      slotIntervalMinutes = 30;
      services = [];
      fixedClosingDays = [];
      exceptionalClosingDays = [];
      zones = [];
      zoneDefs = defaultZoneDefs();
      tableTypes = [];
      occupancySettings = null;
      reservationRules = defaultReservationRules();
      guestForm = defaultGuestForm();
      branding = defaultBranding();
      notifications = defaultNotifications();
      integrations = defaultIntegrations();
    };
  };

  public func get(
    configStore : List.List<SettingsTypes.RestaurantExtendedConfig>,
  ) : SettingsTypes.RestaurantExtendedConfig {
    configStore.at(0);
  };

  public func updateGeneralInfo(
    configStore : List.List<SettingsTypes.RestaurantExtendedConfig>,
    restaurantName : Text,
    currency : Text,
    timezone : Text,
    contactPhone : Text,
    contactEmail : Text,
    logoUrl : ?Text,
  ) {
    let current = configStore.at(0);
    configStore.put(0, {
      current with
      restaurantName;
      currency;
      timezone;
      contactPhone;
      contactEmail;
      logoUrl;
    });
  };

  public func updateServiceHours(
    configStore : List.List<SettingsTypes.RestaurantExtendedConfig>,
    services : [SettingsTypes.ServiceHours],
  ) {
    let current = configStore.at(0);
    configStore.put(0, { current with services });
  };

  public func updateExceptionalClosingDays(
    configStore : List.List<SettingsTypes.RestaurantExtendedConfig>,
    fixedClosingDays : [SettingsTypes.DayOfWeek],
    exceptionalClosingDays : [SettingsTypes.ClosingDay],
  ) {
    let current = configStore.at(0);
    configStore.put(0, { current with fixedClosingDays; exceptionalClosingDays });
  };

  public func updateCapacitySettings(
    configStore : List.List<SettingsTypes.RestaurantExtendedConfig>,
    zones : [SettingsTypes.ZoneCapacity],
    tableTypes : [SettingsTypes.TableType],
    occupancySettings : ?SettingsTypes.OccupancySettings,
    totalSeatsPerSlot : Nat,
  ) {
    let current = configStore.at(0);
    configStore.put(0, {
      current with
      zones;
      tableTypes;
      occupancySettings;
      totalSeatsPerSlot;
    });
  };

  public func updateReservationRules(
    configStore : List.List<SettingsTypes.RestaurantExtendedConfig>,
    reservationRules : SettingsTypes.ReservationRules,
  ) {
    let current = configStore.at(0);
    configStore.put(0, { current with reservationRules });
  };

  public func updateGuestFormSettings(
    configStore : List.List<SettingsTypes.RestaurantExtendedConfig>,
    guestForm : SettingsTypes.GuestFormSettings,
  ) {
    let current = configStore.at(0);
    configStore.put(0, { current with guestForm });
  };

  public func updateBrandingSettings(
    configStore : List.List<SettingsTypes.RestaurantExtendedConfig>,
    branding : SettingsTypes.BrandingSettings,
  ) {
    let current = configStore.at(0);
    configStore.put(0, { current with branding });
  };

  public func updateNotificationSettings(
    configStore : List.List<SettingsTypes.RestaurantExtendedConfig>,
    notifications : SettingsTypes.NotificationSettings,
  ) {
    let current = configStore.at(0);
    configStore.put(0, { current with notifications });
  };

  public func updateIntegrationSettings(
    configStore : List.List<SettingsTypes.RestaurantExtendedConfig>,
    integrations : SettingsTypes.IntegrationSettings,
  ) {
    let current = configStore.at(0);
    configStore.put(0, { current with integrations });
  };

  /// Derive a legacy-compatible config record from the extended config.
  /// Used by reservation-api to keep existing slot logic working.
  public func toLegacyConfig(
    cfg : SettingsTypes.RestaurantExtendedConfig,
  ) : { restaurantName : Text; totalSeatsPerSlot : Nat; openingHour : Nat; closingHour : Nat; slotIntervalMinutes : Nat } {
    {
      restaurantName = cfg.restaurantName;
      totalSeatsPerSlot = cfg.totalSeatsPerSlot;
      openingHour = cfg.openingHour;
      closingHour = cfg.closingHour;
      slotIntervalMinutes = cfg.slotIntervalMinutes;
    };
  };

  // ── Zone CRUD ──────────────────────────────────────────────────────────────

  /// Return all zone definitions. Seeds defaults if array is empty.
  public func getZones(
    configStore : List.List<SettingsTypes.RestaurantExtendedConfig>,
  ) : [SettingsTypes.Zone] {
    let current = configStore.at(0);
    if (current.zoneDefs.size() == 0) {
      let seeded = defaultZoneDefs();
      configStore.put(0, { current with zoneDefs = seeded });
      seeded;
    } else {
      current.zoneDefs;
    };
  };

  /// Generate a simple unique-enough ID from name + timestamp suffix.
  func makeZoneId(name : Text, now : Int) : Text {
    let slug = name.toLower().replace(#char ' ', "-");
    slug # "-" # (Int.abs(now) % 1_000_000).toText();
  };

  /// Add a new zone. Returns the created Zone.
  public func addZone(
    configStore : List.List<SettingsTypes.RestaurantExtendedConfig>,
    name        : Text,
    color       : Text,
    maxGuests   : Nat,
    now         : Int,
  ) : SettingsTypes.Zone {
    let current = configStore.at(0);
    let id = makeZoneId(name, now);
    let zone : SettingsTypes.Zone = { id; name; color; maxGuests; boundaries = null };
    let updated = current.zoneDefs.concat([zone]);
    configStore.put(0, { current with zoneDefs = updated });
    zone;
  };

  /// Update an existing zone by ID. Returns the updated Zone or null if not found.
  public func updateZone(
    configStore : List.List<SettingsTypes.RestaurantExtendedConfig>,
    id          : Text,
    name        : Text,
    color       : Text,
    maxGuests   : Nat,
  ) : ?SettingsTypes.Zone {
    let current = configStore.at(0);
    var found : ?SettingsTypes.Zone = null;
    let updated = current.zoneDefs.map(func(z : SettingsTypes.Zone) : SettingsTypes.Zone {
      if (z.id == id) {
        let u : SettingsTypes.Zone = { z with name; color; maxGuests };
        found := ?u;
        u;
      } else { z };
    });
    switch (found) {
      case null { null };
      case (?_) {
        configStore.put(0, { current with zoneDefs = updated });
        found;
      };
    };
  };

  /// Delete a zone by ID. Returns true if the zone was found and deleted.
  public func deleteZone(
    configStore : List.List<SettingsTypes.RestaurantExtendedConfig>,
    id          : Text,
  ) : Bool {
    let current = configStore.at(0);
    let before = current.zoneDefs.size();
    let updated = current.zoneDefs.filter(func(z : SettingsTypes.Zone) : Bool { z.id != id });
    if (updated.size() < before) {
      configStore.put(0, { current with zoneDefs = updated });
      true;
    } else {
      false;
    };
  };

  /// Update the floor-plan visual boundaries for a zone. Returns true if zone found.
  public func updateZoneBoundaries(
    configStore : List.List<SettingsTypes.RestaurantExtendedConfig>,
    id          : Text,
    boundaries  : Text,
  ) : Bool {
    let current = configStore.at(0);
    var found = false;
    let updated = current.zoneDefs.map(func(z : SettingsTypes.Zone) : SettingsTypes.Zone {
      if (z.id == id) {
        found := true;
        { z with boundaries = ?boundaries };
      } else { z };
    });
    if (found) {
      configStore.put(0, { current with zoneDefs = updated });
    };
    found;
  };
};
