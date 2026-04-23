import List "mo:core/List";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import SettingsLib "../lib/settings";
import SettingsTypes "../types/settings";
import AuditLogTypes "../types/audit-log";
import TeamTypes "../types/team";

mixin (
  accessControlState : AccessControl.AccessControlState,
  extendedConfig     : List.List<SettingsTypes.RestaurantExtendedConfig>,
  auditLog           : List.List<AuditLogTypes.AuditLogEntry>,
  auditLogCounter    : List.List<Nat>,
  teamStore          : List.List<TeamTypes.TeamMember>,
) {
  // ── Audit helper (inline — avoids cross-mixin dependency) ─────────────────

  let SETTINGS_MAX_AUDIT_ENTRIES : Nat = 10_000;

  func resolveCallerInfoSettings(callerText : Text) : (Text, Text) {
    switch (teamStore.find(func(m : TeamTypes.TeamMember) : Bool { m.principalId == callerText })) {
      case (?member) { (member.name, member.role) };
      case null      { ("Owner", "owner") };
    };
  };

  func logSettings(callerText : Text, page : Text, action : Text, summary : Text, oldV : ?Text, newV : ?Text) {
    let (callerName, callerRole) = resolveCallerInfoSettings(callerText);
    let currentId = auditLogCounter.at(0);
    auditLogCounter.put(0, currentId + 1);
    auditLog.add({
      id              = currentId.toText();
      timestamp       = Time.now();
      callerPrincipal = callerText;
      callerName;
      callerRole;
      action;
      page;
      summary;
      oldValue  = oldV;
      newValue  = newV;
    });
    if (auditLog.size() > SETTINGS_MAX_AUDIT_ENTRIES) {
      let arr = auditLog.toArray();
      auditLog.clear();
      var i = 1;
      while (i < arr.size()) {
        auditLog.add(arr[i]);
        i += 1;
      };
    };
  };

  // ── Public API ─────────────────────────────────────────────────────────────

  /// Returns the full extended restaurant configuration. Admin-only.
  public query ({ caller }) func getExtendedConfig() : async { #ok : SettingsTypes.RestaurantExtendedConfig; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can read the full configuration");
    };
    #ok(SettingsLib.get(extendedConfig));
  };

  /// Update general restaurant info. Owner-only.
  public shared ({ caller }) func updateGeneralInfo(
    restaurantName : Text,
    currency       : Text,
    timezone       : Text,
    contactPhone   : Text,
    contactEmail   : Text,
    logoUrl        : ?Text,
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can update restaurant settings");
    };
    if (restaurantName == "") {
      return #err("Restaurant name cannot be empty");
    };
    SettingsLib.updateGeneralInfo(extendedConfig, restaurantName, currency, timezone, contactPhone, contactEmail, logoUrl);
    logSettings(caller.toText(), "General Information", "update", "Restaurant general info updated", null, ?("name=" # restaurantName));
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
    logSettings(caller.toText(), "Opening Hours", "update", "Service hours updated (" # services.size().toText() # " services)", null, null);
    #ok;
  };

  /// Update fixed and exceptional closing days. Owner-only.
  public shared ({ caller }) func updateExceptionalClosingDays(
    fixedClosingDays      : [SettingsTypes.DayOfWeek],
    exceptionalClosingDays : [SettingsTypes.ClosingDay],
  ) : async { #ok; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can update closing days");
    };
    SettingsLib.updateExceptionalClosingDays(extendedConfig, fixedClosingDays, exceptionalClosingDays);
    logSettings(caller.toText(), "Opening Hours", "update", "Closing days updated", null, null);
    #ok;
  };

  /// Update capacity settings (zones, table types, occupancy ceiling, party-size limits). Owner-only.
  public shared ({ caller }) func updateCapacitySettings(
    zones             : [SettingsTypes.ZoneCapacity],
    tableTypes        : [SettingsTypes.TableType],
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
    logSettings(caller.toText(), "Capacity", "update", "Capacity settings updated (seats/slot=" # totalSeatsPerSlot.toText() # ")", null, null);
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
    logSettings(caller.toText(), "Reservation Rules", "update", "Reservation rules updated", null, null);
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
    logSettings(caller.toText(), "Guest Form", "update", "Guest form settings updated", null, null);
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
    logSettings(caller.toText(), "Branding", "update", "Branding settings updated", null, null);
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
    logSettings(caller.toText(), "Notifications", "update", "Notification settings updated", null, null);
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
    logSettings(caller.toText(), "Integrations", "update", "Integration settings updated", null, null);
    #ok;
  };

  // ── Zone CRUD API ──────────────────────────────────────────────────────────

  /// Returns all zone definitions. Seeds defaults if none exist.
  public query ({ caller }) func getZones() : async { #ok : [SettingsTypes.Zone]; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can read zone settings");
    };
    #ok(SettingsLib.getZones(extendedConfig));
  };

  /// Add a new zone. Auth-guarded (owner or manager). Returns the created Zone.
  public shared ({ caller }) func addZone(
    name      : Text,
    color     : Text,
    maxGuests : Nat,
  ) : async { #ok : SettingsTypes.Zone; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can add zones");
    };
    if (name == "") {
      return #err("Zone name cannot be empty");
    };
    let zone = SettingsLib.addZone(extendedConfig, name, color, maxGuests, Time.now());
    logSettings(caller.toText(), "Zones", "add", "Zone added: " # name, null, ?name);
    #ok(zone);
  };

  /// Update an existing zone by ID. Owner-only.
  public shared ({ caller }) func updateZone(
    id        : Text,
    name      : Text,
    color     : Text,
    maxGuests : Nat,
  ) : async { #ok : SettingsTypes.Zone; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can update zones");
    };
    if (name == "") {
      return #err("Zone name cannot be empty");
    };
    switch (SettingsLib.updateZone(extendedConfig, id, name, color, maxGuests)) {
      case null { #err("Zone not found: " # id) };
      case (?z) {
        logSettings(caller.toText(), "Zones", "update", "Zone updated: " # id, null, ?name);
        #ok(z);
      };
    };
  };

  /// Delete a zone by ID. Owner-only. Clears zone from tables using it.
  public shared ({ caller }) func deleteZone(
    id : Text,
  ) : async { #ok : Bool; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can delete zones");
    };
    let deleted = SettingsLib.deleteZone(extendedConfig, id);
    if (deleted) {
      logSettings(caller.toText(), "Zones", "delete", "Zone deleted: " # id, ?id, null);
    };
    #ok(deleted);
  };

  /// Update floor-plan visual boundaries for a zone. Owner-only.
  public shared ({ caller }) func updateZoneBoundaries(
    id         : Text,
    boundaries : Text,
  ) : async { #ok : Bool; #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return #err("Unauthorized: Only the owner can update zone boundaries");
    };
    let updated = SettingsLib.updateZoneBoundaries(extendedConfig, id, boundaries);
    #ok(updated);
  };
};
