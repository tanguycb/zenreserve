import List "mo:core/List";
import SettingsTypes "../types/settings";

module {
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
};
