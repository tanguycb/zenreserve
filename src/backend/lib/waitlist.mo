import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import WaitlistTypes "../types/waitlist";
import CommonTypes "../types/common";

module {
  func nextId(counter : List.List<Nat>) : Text {
    let id = counter.at(0);
    counter.put(0, id + 1);
    "w" # id.toText();
  };

  public func add(
    waitlist : Map.Map<CommonTypes.WaitlistId, WaitlistTypes.WaitlistEntry>,
    counter : List.List<Nat>,
    guestId : CommonTypes.GuestId,
    date : Text,
    partySize : Nat,
    requestedTime : ?Text,
    notes : ?Text,
    joinedAt : CommonTypes.Timestamp,
  ) : WaitlistTypes.WaitlistEntry {
    let id = nextId(counter);
    let entry : WaitlistTypes.WaitlistEntry = {
      id;
      guestId;
      date;
      partySize;
      requestedTime;
      notes;
      joinedAt;
      notifiedAt = null;
      status = #waiting;
    };
    waitlist.add(id, entry);
    entry;
  };

  public func getByDate(
    waitlist : Map.Map<CommonTypes.WaitlistId, WaitlistTypes.WaitlistEntry>,
    date : Text,
  ) : [WaitlistTypes.WaitlistEntry] {
    waitlist.values().filter(func(e : WaitlistTypes.WaitlistEntry) : Bool {
      e.date == date
    }).toArray();
  };

  /// Fetch a single waitlist entry by ID.
  public func getEntry(
    waitlist : Map.Map<CommonTypes.WaitlistId, WaitlistTypes.WaitlistEntry>,
    id : CommonTypes.WaitlistId,
  ) : ?WaitlistTypes.WaitlistEntry {
    waitlist.get(id);
  };

  public func offerSpot(
    waitlist : Map.Map<CommonTypes.WaitlistId, WaitlistTypes.WaitlistEntry>,
    id : CommonTypes.WaitlistId,
    notifiedAt : CommonTypes.Timestamp,
  ) {
    switch (waitlist.get(id)) {
      case null { Runtime.trap("Waitlist entry not found") };
      case (?entry) {
        waitlist.add(id, { entry with status = #offered; notifiedAt = ?notifiedAt });
      };
    };
  };

  /// Update mutable fields of a waitlist entry (partySize, notes).
  public func updateWaitlistEntry(
    waitlist : Map.Map<CommonTypes.WaitlistId, WaitlistTypes.WaitlistEntry>,
    id : CommonTypes.WaitlistId,
    partySize : Nat,
    notes : ?Text,
  ) : { #ok : WaitlistTypes.WaitlistEntry; #err : Text } {
    switch (waitlist.get(id)) {
      case null { #err("Waitlist entry not found") };
      case (?entry) {
        let updated = { entry with partySize; notes };
        waitlist.add(id, updated);
        #ok(updated);
      };
    };
  };

  /// Soft-delete a waitlist entry by setting its status to #removed_by_staff.
  /// The entry is preserved in state for audit trail purposes.
  public func removeWaitlistEntry(
    waitlist : Map.Map<CommonTypes.WaitlistId, WaitlistTypes.WaitlistEntry>,
    id : CommonTypes.WaitlistId,
  ) : { #ok : (); #err : Text } {
    switch (waitlist.get(id)) {
      case null { #err("Waitlist entry not found") };
      case (?entry) {
        waitlist.add(id, { entry with status = #removed_by_staff });
        #ok(());
      };
    };
  };

  /// Re-send the offer to a waitlist entry (resets notifiedAt and re-sets status to #offered).
  public func reofferWaitlistSpot(
    waitlist : Map.Map<CommonTypes.WaitlistId, WaitlistTypes.WaitlistEntry>,
    id : CommonTypes.WaitlistId,
    notifiedAt : CommonTypes.Timestamp,
  ) : { #ok : WaitlistTypes.WaitlistEntry; #err : Text } {
    switch (waitlist.get(id)) {
      case null { #err("Waitlist entry not found") };
      case (?entry) {
        let updated = { entry with status = #offered; notifiedAt = ?notifiedAt };
        waitlist.add(id, updated);
        #ok(updated);
      };
    };
  };

  /// Expire stale entries where status is #offered and notifiedAt older than cutoff.
  public func expireStale(
    waitlist : Map.Map<CommonTypes.WaitlistId, WaitlistTypes.WaitlistEntry>,
    cutoff : CommonTypes.Timestamp,
  ) {
    let toExpire = waitlist.entries()
      .filter(func((_, e) : (CommonTypes.WaitlistId, WaitlistTypes.WaitlistEntry)) : Bool {
        e.status == #offered and (
          switch (e.notifiedAt) {
            case (?t) t < cutoff;
            case null false;
          }
        )
      })
      .toArray();
    for ((id, entry) in toExpire.values()) {
      waitlist.add(id, { entry with status = #expired });
    };
  };
};
