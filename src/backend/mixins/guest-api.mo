import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import GuestLib "../lib/guest";
import GuestTypes "../types/guest";
import CommonTypes "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  guests : Map.Map<CommonTypes.GuestId, GuestTypes.Guest>,
  guestCounter : List.List<Nat>,
) {
  public shared ({ caller }) func createGuest(
    name : Text,
    email : Text,
    phone : ?Text,
  ) : async GuestTypes.Guest {
    GuestLib.create(guests, guestCounter, name, email, phone, Time.now());
  };

  public query ({ caller }) func getGuest(id : CommonTypes.GuestId) : async ?GuestTypes.Guest {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    GuestLib.get(guests, id);
  };

  public shared ({ caller }) func updateGuestTags(
    id : CommonTypes.GuestId,
    tags : [Text],
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    GuestLib.updateTags(guests, id, tags);
  };

  public query ({ caller }) func listGuests() : async [GuestTypes.Guest] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    GuestLib.list(guests);
  };

  public query ({ caller }) func searchGuests(searchQuery : Text) : async [GuestTypes.Guest] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    GuestLib.search(guests, searchQuery);
  };
};
