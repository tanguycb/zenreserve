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



actor {
  // Authorization
  // NOTE: The caffeineai-authorization extension handles first-caller admin assignment.
  // When _initializeAccessControl is called and no admin exists yet, the caller
  // automatically becomes admin (owner). Subsequent callers must be explicitly granted roles.
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

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
