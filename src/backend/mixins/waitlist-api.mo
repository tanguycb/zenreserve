import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import WaitlistLib "../lib/waitlist";
import WaitlistTypes "../types/waitlist";
import CommonTypes "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  waitlist : Map.Map<CommonTypes.WaitlistId, WaitlistTypes.WaitlistEntry>,
  waitlistCounter : List.List<Nat>,
  waitlistRateLimitMap : Map.Map<Text, (Nat, Int)>,
) {
  // ── Waitlist rate limit constants ─────────────────────────────────────────
  let WAITLIST_RATE_LIMIT_PER_CALLER : Nat = 5;    // max 5 per hour per identity
  let WAITLIST_RATE_LIMIT_ANON       : Nat = 20;   // max 20 per hour for all anonymous
  let ONE_HOUR_NS                    : Int = 3_600_000_000_000; // 1 hour in nanoseconds

  /// Returns #ok if the caller is within rate limits, #err if exceeded.
  func checkWaitlistRateLimit(caller : Principal) : { #ok; #err : Text } {
    let isAnon = caller.isAnonymous();
    let key = if (isAnon) "anon" else caller.toText();
    let limit = if (isAnon) WAITLIST_RATE_LIMIT_ANON else WAITLIST_RATE_LIMIT_PER_CALLER;
    let now = Time.now();

    switch (waitlistRateLimitMap.get(key)) {
      case null {
        // First request — record (1, now)
        waitlistRateLimitMap.add(key, (1, now));
        #ok;
      };
      case (?(count, firstTs)) {
        // If the window has expired, reset
        if (now - firstTs > ONE_HOUR_NS) {
          waitlistRateLimitMap.add(key, (1, now));
          #ok;
        } else if (count >= limit) {
          #err("Rate limit exceeded: too many waitlist entries. Please try again later.");
        } else {
          waitlistRateLimitMap.add(key, (count + 1, firstTs));
          #ok;
        };
      };
    };
  };

  public shared ({ caller }) func addToWaitlist(
    guestId : CommonTypes.GuestId,
    date : Text,
    partySize : Nat,
    requestedTime : ?Text,
    notes : ?Text,
  ) : async { #ok : WaitlistTypes.WaitlistEntry; #err : Text } {
    switch (checkWaitlistRateLimit(caller)) {
      case (#err(msg)) { return #err(msg) };
      case (#ok) {};
    };
    let entry = WaitlistLib.add(waitlist, waitlistCounter, guestId, date, partySize, requestedTime, notes, Time.now());
    #ok(entry);
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

  /// Remove a waitlist entry. Admin-only — soft-deletes to preserve audit trail.
  public shared ({ caller }) func removeWaitlistEntry(
    id : CommonTypes.WaitlistId,
  ) : async { #ok : (); #err : Text } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
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
