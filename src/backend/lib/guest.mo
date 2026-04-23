import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import GuestTypes "../types/guest";
import CommonTypes "../types/common";
import ValidateLib "validate";

module {
  func nextId(counter : List.List<Nat>) : Text {
    let id = counter.at(0);
    counter.put(0, id + 1);
    "g" # id.toText();
  };

  /// Create a new guest record.
  ///
  /// Email uniqueness is enforced via a secondary index (emailIndex: Map<Text, GuestId>)
  /// rather than a full O(n) scan. Actor message sequencing prevents true races, but the
  /// index makes the invariant structurally enforced and O(1) to check (SEC-005 fix).
  public func create(
    guests : Map.Map<CommonTypes.GuestId, GuestTypes.Guest>,
    emailIndex : Map.Map<Text, CommonTypes.GuestId>,
    counter : List.List<Nat>,
    name : Text,
    email : Text,
    phone : ?Text,
    createdAt : CommonTypes.Timestamp,
  ) : GuestTypes.Guest {
    // O(1) uniqueness check via secondary index
    let normalizedEmail = email.toLower();
    if (emailIndex.get(normalizedEmail) != null) {
      Runtime.trap("Guest with this email already exists");
    };

    let id = nextId(counter);
    let guest : GuestTypes.Guest = {
      id;
      name;
      email;
      phone;
      tags = [];
      reservationIds = [];
      createdAt;
    };
    guests.add(id, guest);
    // Maintain secondary index atomically with the primary insert
    emailIndex.add(normalizedEmail, id);
    guest;
  };

  public func get(
    guests : Map.Map<CommonTypes.GuestId, GuestTypes.Guest>,
    id : CommonTypes.GuestId,
  ) : ?GuestTypes.Guest {
    guests.get(id);
  };

  public func list(
    guests : Map.Map<CommonTypes.GuestId, GuestTypes.Guest>,
  ) : [GuestTypes.Guest] {
    guests.values().toArray();
  };

  public func search(
    guests : Map.Map<CommonTypes.GuestId, GuestTypes.Guest>,
    searchQuery : Text,
    limit : Nat,
    offset : Nat,
  ) : { guests : [GuestTypes.Guest]; total : Nat } {
    // SEC-010: validate query — return empty results gracefully on invalid input
    let trimmedQ = switch (ValidateLib.validateSearchQuery(searchQuery)) {
      case (#ok(q)) q;
      case (#err(_)) { return { guests = []; total = 0 } };
    };
    // Clamp limit: 0 → default 20; >100 → cap at 100
    let effectiveLimit : Nat = if (limit == 0) 20 else if (limit > 100) 100 else limit;
    let q = trimmedQ.toLower();
    let matched = guests.values().filter(func(g : GuestTypes.Guest) : Bool {
      g.name.toLower().contains(#text q) or g.email.toLower().contains(#text q)
    }).toArray();
    let total = matched.size();
    // Apply offset + limit slice
    let start = if (offset >= total) total else offset;
    let end_ = if (start + effectiveLimit > total) total else start + effectiveLimit;
    let page = matched.sliceToArray(start, end_);
    { guests = page; total };
  };

  public func updateTags(
    guests : Map.Map<CommonTypes.GuestId, GuestTypes.Guest>,
    id : CommonTypes.GuestId,
    tags : [Text],
  ) {
    switch (guests.get(id)) {
      case null { Runtime.trap("Guest not found") };
      case (?g) {
        guests.add(id, { g with tags });
      };
    };
  };

  public func addReservationId(
    guests : Map.Map<CommonTypes.GuestId, GuestTypes.Guest>,
    guestId : CommonTypes.GuestId,
    reservationId : CommonTypes.ReservationId,
  ) {
    switch (guests.get(guestId)) {
      case null { Runtime.trap("Guest not found") };
      case (?g) {
        let newIds = g.reservationIds.concat([reservationId]);
        guests.add(guestId, { g with reservationIds = newIds });
      };
    };
  };
};
