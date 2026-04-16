import Map "mo:core/Map";
import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import CommonTypes "types/common";
import ReservationTypes "types/reservation";
import GuestTypes "types/guest";
import ExperienceTypes "types/experience";
import WaitlistTypes "types/waitlist";
import SettingsTypes "types/settings";
import TeamTypes "types/team";
import ReservationApi "mixins/reservation-api";
import GuestApi "mixins/guest-api";
import ExperienceApi "mixins/experience-api";
import WaitlistApi "mixins/waitlist-api";
import ConfigApi "mixins/config-api";
import SettingsApi "mixins/settings-api";
import TeamApi "mixins/team-api";
import SeatingTypes "types/seating";
import SeatingApi "mixins/seating-api";
import AiApi "mixins/ai-api";
import SeasonalAiTypes "types/seasonal-ai";
import SeasonalAiApi "mixins/seasonal-ai-api";
import SettingsLib "lib/settings";

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

actor {
  // Authorization
  // NOTE: The caffeineai-authorization extension handles role management.
  // The deployer MUST call setOwner() once post-deploy to lock the admin
  // before _initializeAccessControl is exposed to other callers.
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // SEC-008 fix: one-time owner initialization.
  // Can only be called when no admin has been assigned yet (adminAssigned == false).
  // Once called, accessControlState.adminAssigned is set to true and this
  // function permanently rejects all future calls.
  public shared func setOwner(owner : Principal) : async () {
    if (accessControlState.adminAssigned) {
      // Owner already set — reject to prevent takeover
      return;
    };
    AccessControl.initialize(accessControlState, owner);
  };

  // Returns true if an owner/admin has already been assigned via setOwner().
  // Read-only query — no auth required. Used by the frontend onboarding flow
  // to determine whether to show the initial owner-setup modal (SEC-008).
  public query func hasOwner() : async Bool {
    accessControlState.adminAssigned;
  };

  // Domain state — HashMaps
  let reservations = Map.empty<CommonTypes.ReservationId, ReservationTypes.Reservation>();
  let guests = Map.empty<CommonTypes.GuestId, GuestTypes.Guest>();
  let experiences = Map.empty<CommonTypes.ExperienceId, ExperienceTypes.Experience>();
  let waitlist = Map.empty<CommonTypes.WaitlistId, WaitlistTypes.WaitlistEntry>();

  // Mutable ID counters as List<Nat> singletons (reference semantics)
  let reservationCounter = List.singleton<Nat>(0);
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

  // Team members
  let teamStore = List.empty<TeamTypes.TeamMember>();

  // Seasonal AI state
  let seasonalPeriods = List.empty<SeasonalAiTypes.SeasonalPeriod>();
  let suggestionFeedback = List.empty<SeasonalAiTypes.SuggestionFeedback>();
  let tableWeights = Map.empty<Text, SeasonalAiTypes.TableWeight>();
  let suggestionHistory = Map.empty<Text, SeasonalAiTypes.AISeatingSuggestion>();

  // Mixin includes
  include ReservationApi(accessControlState, reservations, reservationCounter, experiences, restaurantConfig, tables);
  include GuestApi(accessControlState, guests, guestCounter);
  include ExperienceApi(accessControlState, experiences, experienceCounter);
  include WaitlistApi(accessControlState, waitlist, waitlistCounter);
  include ConfigApi(accessControlState, restaurantConfig);
  include SettingsApi(accessControlState, extendedConfig);
  include TeamApi(accessControlState, teamStore);
  include SeatingApi(accessControlState, tables, tableCounter);
  include AiApi(accessControlState);
  include SeasonalAiApi(accessControlState, seasonalPeriods, suggestionFeedback, tableWeights, suggestionHistory);
};
