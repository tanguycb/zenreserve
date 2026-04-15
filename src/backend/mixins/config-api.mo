import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";

mixin (
  accessControlState : AccessControl.AccessControlState,
  restaurantConfig : List.List<{ restaurantName : Text; totalSeatsPerSlot : Nat; openingHour : Nat; closingHour : Nat; slotIntervalMinutes : Nat }>,
) {
  public query func getRestaurantConfig() : async { restaurantName : Text; totalSeatsPerSlot : Nat; openingHour : Nat; closingHour : Nat; slotIntervalMinutes : Nat } {
    restaurantConfig.at(0);
  };

  public shared ({ caller }) func updateRestaurantConfig(
    restaurantName : Text,
    totalSeatsPerSlot : Nat,
    openingHour : Nat,
    closingHour : Nat,
    slotIntervalMinutes : Nat,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update restaurant configuration");
    };
    if (openingHour >= closingHour) {
      Runtime.trap("Opening hour must be before closing hour");
    };
    if (slotIntervalMinutes == 0 or 60 % slotIntervalMinutes != 0) {
      Runtime.trap("Slot interval must divide evenly into 60 minutes");
    };
    restaurantConfig.put(0, {
      restaurantName;
      totalSeatsPerSlot;
      openingHour;
      closingHour;
      slotIntervalMinutes;
    });
  };
};
