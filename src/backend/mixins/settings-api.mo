import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";
import SettingsLib "../lib/settings";
import SettingsTypes "../types/settings";

mixin (
  accessControlState : AccessControl.AccessControlState,
  extendedConfig : List.List<SettingsTypes.RestaurantExtendedConfig>,
) {
  /// Returns the full extended restaurant configuration.
  public query func getExtendedConfig() : async SettingsTypes.RestaurantExtendedConfig {
    SettingsLib.get(extendedConfig);
  };

  /// Update general restaurant info. Owner-only.
  public shared ({ caller }) func updateGeneralInfo(
    restaurantName : Text,
    currency : Text,
    timezone : Text,
    contactPhone : Text,
    contactEmail : Text,
    logoUrl : ?Text,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can update restaurant settings");
    };
    if (restaurantName == "") {
      return #err("Restaurant name cannot be empty");
    };
    SettingsLib.updateGeneralInfo(extendedConfig, restaurantName, currency, timezone, contactPhone, contactEmail, logoUrl);
    #ok;
  };

  /// Update service hours configuration. Owner-only.
  public shared ({ caller }) func updateServiceHours(
    services : [SettingsTypes.ServiceHours],
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can update service hours");
    };
    SettingsLib.updateServiceHours(extendedConfig, services);
    #ok;
  };

  /// Update fixed and exceptional closing days. Owner-only.
  public shared ({ caller }) func updateExceptionalClosingDays(
    fixedClosingDays : [SettingsTypes.DayOfWeek],
    exceptionalClosingDays : [SettingsTypes.ClosingDay],
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can update closing days");
    };
    SettingsLib.updateExceptionalClosingDays(extendedConfig, fixedClosingDays, exceptionalClosingDays);
    #ok;
  };

  /// Update capacity settings (zones, table types, occupancy ceiling, party-size limits). Owner-only.
  public shared ({ caller }) func updateCapacitySettings(
    zones : [SettingsTypes.ZoneCapacity],
    tableTypes : [SettingsTypes.TableType],
    occupancySettings : ?SettingsTypes.OccupancySettings,
    totalSeatsPerSlot : Nat,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can update capacity settings");
    };
    if (totalSeatsPerSlot < 1) {
      return #err("Total seats per slot must be at least 1");
    };
    SettingsLib.updateCapacitySettings(extendedConfig, zones, tableTypes, occupancySettings, totalSeatsPerSlot);
    #ok;
  };

  /// Update reservation policy rules. Owner-only.
  public shared ({ caller }) func updateReservationRules(
    reservationRules : SettingsTypes.ReservationRules,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can update reservation rules");
    };
    if (reservationRules.minPartySize < 1) {
      return #err("Minimum party size must be at least 1");
    };
    if (reservationRules.maxPartySize < reservationRules.minPartySize) {
      return #err("Maximum party size must be >= minimum party size");
    };
    SettingsLib.updateReservationRules(extendedConfig, reservationRules);
    #ok;
  };

  /// Update guest form settings. Owner-only.
  public shared ({ caller }) func updateGuestFormSettings(
    guestForm : SettingsTypes.GuestFormSettings,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can update guest form settings");
    };
    SettingsLib.updateGuestFormSettings(extendedConfig, guestForm);
    #ok;
  };

  /// Update widget branding settings. Owner-only.
  public shared ({ caller }) func updateBrandingSettings(
    branding : SettingsTypes.BrandingSettings,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can update branding settings");
    };
    if (branding.primaryColor == "") {
      return #err("Primary color cannot be empty");
    };
    SettingsLib.updateBrandingSettings(extendedConfig, branding);
    #ok;
  };

  /// Update notification settings. Owner-only.
  public shared ({ caller }) func updateNotificationSettings(
    notifications : SettingsTypes.NotificationSettings,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can update notification settings");
    };
    SettingsLib.updateNotificationSettings(extendedConfig, notifications);
    #ok;
  };

  /// Update integration settings. Owner-only.
  public shared ({ caller }) func updateIntegrationSettings(
    integrations : SettingsTypes.IntegrationSettings,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can update integration settings");
    };
    SettingsLib.updateIntegrationSettings(extendedConfig, integrations);
    #ok;
  };
};
