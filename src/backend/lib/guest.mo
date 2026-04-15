import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import GuestTypes "../types/guest";
import CommonTypes "../types/common";

module {
  func nextId(counter : List.List<Nat>) : Text {
    let id = counter.at(0);
    counter.put(0, id + 1);
    "g" # id.toText();
  };

  public func create(
    guests : Map.Map<CommonTypes.GuestId, GuestTypes.Guest>,
    counter : List.List<Nat>,
    name : Text,
    email : Text,
    phone : ?Text,
    createdAt : CommonTypes.Timestamp,
  ) : GuestTypes.Guest {
    // Check email uniqueness
    let existing = guests.values().find(func(g : GuestTypes.Guest) : Bool {
      g.email == email
    });
    switch (existing) {
      case (?_) { Runtime.trap("Guest with this email already exists") };
      case null {};
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
  ) : [GuestTypes.Guest] {
    let q = searchQuery.toLower();
    guests.values().filter(func(g : GuestTypes.Guest) : Bool {
      g.name.toLower().contains(#text q) or g.email.toLower().contains(#text q)
    }).toArray();
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
