import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import WaitlistLib "../lib/waitlist";
import WaitlistTypes "../types/waitlist";
import CommonTypes "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  waitlist : Map.Map<CommonTypes.WaitlistId, WaitlistTypes.WaitlistEntry>,
  waitlistCounter : List.List<Nat>,
) {
  public shared ({ caller }) func addToWaitlist(
    guestId : CommonTypes.GuestId,
    date : Text,
    partySize : Nat,
    requestedTime : ?Text,
    notes : ?Text,
  ) : async WaitlistTypes.WaitlistEntry {
    WaitlistLib.add(waitlist, waitlistCounter, guestId, date, partySize, requestedTime, notes, Time.now());
  };

  public query ({ caller }) func getWaitlist(date : Text) : async [WaitlistTypes.WaitlistEntry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    WaitlistLib.getByDate(waitlist, date);
  };

  /// Fetch a single waitlist entry by ID. Staff-only.
  public query ({ caller }) func getWaitlistEntry(id : CommonTypes.WaitlistId) : async ?WaitlistTypes.WaitlistEntry {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    WaitlistLib.getEntry(waitlist, id);
  };

  public shared ({ caller }) func offerWaitlistSpot(id : CommonTypes.WaitlistId) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    WaitlistLib.offerSpot(waitlist, id, Time.now());
  };

  /// Update a waitlist entry's partySize and/or notes. Staff-only.
  public shared ({ caller }) func updateWaitlistEntry(
    id : CommonTypes.WaitlistId,
    partySize : Nat,
    notes : ?Text,
  ) : async { #ok : WaitlistTypes.WaitlistEntry; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };
    WaitlistLib.updateWaitlistEntry(waitlist, id, partySize, notes);
  };

  /// Remove a waitlist entry. Staff-only.
  public shared ({ caller }) func removeWaitlistEntry(
    id : CommonTypes.WaitlistId,
  ) : async { #ok : (); #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };
    WaitlistLib.removeWaitlistEntry(waitlist, id);
  };

  /// Re-offer a spot to a waitlist entry (resets notifiedAt). Staff-only.
  public shared ({ caller }) func reofferWaitlistSpot(
    id : CommonTypes.WaitlistId,
  ) : async { #ok : WaitlistTypes.WaitlistEntry; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };
    WaitlistLib.reofferWaitlistSpot(waitlist, id, Time.now());
  };
};
