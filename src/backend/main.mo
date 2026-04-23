import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import CommonTypes "types/common";
import ReservationTypes "types/reservation";
import GuestTypes "types/guest";
import ExperienceTypes "types/experience";
import WaitlistTypes "types/waitlist";
import SettingsTypes "types/settings";
import TeamTypes "types/team";
import AuditLogTypes "types/audit-log";
import ReservationApi "mixins/reservation-api";
import GuestApi "mixins/guest-api";
import ExperienceApi "mixins/experience-api";
import WaitlistApi "mixins/waitlist-api";
import ConfigApi "mixins/config-api";
import SettingsApi "mixins/settings-api";
import TeamApi "mixins/team-api";
import AuditLogApi "mixins/audit-log-api";
import SeatingTypes "types/seating";
import SeatingApi "mixins/seating-api";
import AiApi "mixins/ai-api";
import SeasonalAiTypes "types/seasonal-ai";
import SeasonalAiApi "mixins/seasonal-ai-api";
import SettingsLib "lib/settings";
import EmailReviewApi "mixins/email-review-api";
import EmailReviewLib "lib/email-review";
import EmailReviewTypes "types/email-review";
import Migration "migration";


// ─────────────────────────────────────────────────────────────────────────────
// SINGLE-TENANT CANISTER — ZenReserve
//
// This canister is strictly single-tenant: one canister deployment per
// restaurant. Do NOT share this canister across multiple restaurants.
//
// DEPLOYMENT INSTRUCTIONS (SEC-008 fix):
//   After deploying this canister, the deploying principal MUST call
//   `setOwner(ownerPrincipal)` exactly once to lock the admin role before
//   any other user calls `_initializeAccessControl`. This prevents an
//   attacker from becoming admin by racing the first initialization call.
//
//   Steps:
//     1. dfx deploy zenreserve_backend
//     2. dfx canister call zenreserve_backend setOwner '(principal "<your-principal>")'
//
//   After `setOwner` is called once, the function permanently rejects
//   all further calls. `_initializeAccessControl` is still available for
//   subsequent users to self-register as #user role.
// ─────────────────────────────────────────────────────────────────────────────





(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // SEC-008 fix: one-time owner initialization.
  public shared func setOwner(owner : Principal) : async () {
    if (accessControlState.adminAssigned) {
      return;
    };
    AccessControl.initialize(accessControlState, owner);
  };

  // Returns true if an owner/admin has already been assigned via setOwner().
  public query func hasOwner() : async Bool {
    accessControlState.adminAssigned;
  };

  // Domain state — HashMaps
  let reservations = Map.empty<CommonTypes.ReservationId, ReservationTypes.Reservation>();
  let guests = Map.empty<CommonTypes.GuestId, GuestTypes.Guest>();
  // SEC-005: email secondary index — O(1) uniqueness check instead of O(n) scan.
  let guestEmailIndex = Map.empty<Text, CommonTypes.GuestId>();
  let experiences = Map.empty<CommonTypes.ExperienceId, ExperienceTypes.Experience>();
  let waitlist = Map.empty<CommonTypes.WaitlistId, WaitlistTypes.WaitlistEntry>();

  // Mutable ID counters as List<Nat> singletons (reference semantics)
  let reservationCounter = List.singleton<Nat>(0);
  let reservationChangeCounter = List.singleton<Nat>(0);
  let guestCounter = List.singleton<Nat>(0);
  let experienceCounter = List.singleton<Nat>(0);
  let waitlistCounter = List.singleton<Nat>(0);

  // Legacy restaurant configuration — kept for ConfigApi and ReservationApi backwards-compat
  let restaurantConfig = List.singleton<{
    restaurantName : Text;
    totalSeatsPerSlot : Nat;
    openingHour : Nat;
    closingHour : Nat;
    slotIntervalMinutes : Nat;
  }>({
    restaurantName = "My Restaurant";
    totalSeatsPerSlot = 20;
    openingHour = 12;
    closingHour = 22;
    slotIntervalMinutes = 30;
  });

  // Extended restaurant configuration — used by SettingsApi
  let extendedConfig = List.singleton<SettingsTypes.RestaurantExtendedConfig>(
    SettingsLib.getDefault()
  );

  // Seating state
  let tables = Map.empty<SeatingTypes.TableId, SeatingTypes.Table>();
  let tableCounter = List.singleton<Nat>(0);
  let tableGroupDefinitions = List.empty<SeatingTypes.TableGroupDefinition>();
  let tableGroupDefCounter = List.singleton<Nat>(0);

  // Team members
  let teamStore = List.empty<TeamTypes.TeamMember>();

  // Seasonal AI state
  let seasonalPeriods = List.empty<SeasonalAiTypes.SeasonalPeriod>();
  let suggestionFeedback = List.empty<SeasonalAiTypes.SuggestionFeedback>();
  let tableWeights = Map.empty<Text, SeasonalAiTypes.TableWeight>();
  let suggestionHistory = Map.empty<Text, SeasonalAiTypes.AISeatingSuggestion>();

  // Email template store — keyed by templateType ("confirmation", "reminder_24h", etc.)
  let emailTemplateStore : EmailReviewLib.EmailTemplateStore = Map.empty();

  // Review request — tracks which reservations already had a review email sent
  let reviewSentSet : EmailReviewLib.ReviewSentSet = Set.empty();

  // Review request settings — mutable singleton holder for persistence
  let reviewSettings : { var value : EmailReviewTypes.ReviewRequestSettings } = {
    var value = {
      enabled = false;
      delay = #hour24;
      message = "Hoe was uw bezoek? We stellen uw feedback op prijs!";
    };
  };

  // ── Audit log state ────────────────────────────────────────────────────────
  // Stores all admin audit log entries (max 10_000, ring buffer).
  let auditLog = List.empty<AuditLogTypes.AuditLogEntry>();
  let auditLogCounter = List.singleton<Nat>(0);

  // ── Rate limit state ───────────────────────────────────────────────────────
  // Widget: key = caller principal text, value = List of nanosecond timestamps
  // (reservations in the last 1 hour). Max 3 per hour.
  let widgetRateLimitMap = Map.empty<Text, List.List<Int>>();

  // Dashboard: key = caller principal text, value = List of nanosecond timestamps
  // (reservations in the last 1 minute). Max 2 per minute.
  let dashboardRateLimitMap = Map.empty<Text, List.List<Int>>();

  // Waitlist: key = caller principal text, value = (count, firstTimestamp) tuple
  // Max 5 entries per hour per caller. Anonymous callers share "anon" bucket (max 20/hour).
  let waitlistRateLimitMap = Map.empty<Text, (Nat, Int)>();

  // Mixin includes
  include ReservationApi(accessControlState, reservations, reservationCounter, reservationChangeCounter, experiences, restaurantConfig, tables, tableCounter, tableGroupDefinitions, extendedConfig, waitlist, teamStore, auditLog, auditLogCounter, widgetRateLimitMap, dashboardRateLimitMap);
  include GuestApi(accessControlState, guests, guestEmailIndex, guestCounter);
  include ExperienceApi(accessControlState, experiences, experienceCounter);
  include WaitlistApi(accessControlState, waitlist, waitlistCounter, waitlistRateLimitMap);
  include ConfigApi(accessControlState, restaurantConfig);
  include SettingsApi(accessControlState, extendedConfig, auditLog, auditLogCounter, teamStore);
  include TeamApi(accessControlState, teamStore, auditLog, auditLogCounter);
  include AuditLogApi(accessControlState, auditLog, auditLogCounter, teamStore);
  include SeatingApi(accessControlState, tables, tableCounter, tableGroupDefinitions, tableGroupDefCounter, reservations, extendedConfig);
  include AiApi(accessControlState);
  include SeasonalAiApi(accessControlState, seasonalPeriods, suggestionFeedback, tableWeights, suggestionHistory);
  include EmailReviewApi(accessControlState, emailTemplateStore, reviewSentSet, reviewSettings);
};
