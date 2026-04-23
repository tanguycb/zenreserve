import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Char "mo:core/Char";

/// Input validation helpers shared across lib/ and mixins/.
/// Each function returns #ok(trimmed value) or #err(message).
module {

  // ─── Internal helpers ────────────────────────────────────────────────────

  /// Trim ASCII whitespace from both ends of a Text.
  func trim(t : Text) : Text {
    t.trim(#predicate(func(c) { c == ' ' or c == '\t' or c == '\n' or c == '\r' }));
  };

  /// Parse a 2-character decimal substring (no sign, no whitespace).
  /// Returns null if the slice is not exactly 2 ASCII digits.
  func parseTwoDigits(chars : [Char], from : Nat) : ?Nat {
    if (chars.size() < from + 2) return null;
    let a = chars[from];
    let b = chars[from + 1];
    if (not a.isDigit() or not b.isDigit()) return null;
    let hi = Nat.fromText(Text.fromChar(a));
    let lo = Nat.fromText(Text.fromChar(b));
    switch (hi, lo) {
      case (?h, ?l) ?(h * 10 + l);
      case _ null;
    };
  };

  /// Parse a 4-character decimal year substring.
  func parseFourDigits(chars : [Char], from : Nat) : ?Nat {
    if (chars.size() < from + 4) return null;
    let a = chars[from];
    let b = chars[from + 1];
    let c = chars[from + 2];
    let d = chars[from + 3];
    if (
      not a.isDigit() or not b.isDigit() or
      not c.isDigit() or not d.isDigit()
    ) return null;
    Nat.fromText(Text.fromChar(a) # Text.fromChar(b) # Text.fromChar(c) # Text.fromChar(d));
  };

  // ─── Public validators ───────────────────────────────────────────────────

  /// Validate a guest name: non-empty after trim, max 256 chars.
  public func validateGuestName(name : Text) : { #ok : Text; #err : Text } {
    let t = trim(name);
    if (t.size() == 0) return #err("Guest name is required");
    if (t.size() > 256) return #err("Guest name must be at most 256 characters");
    #ok(t);
  };

  /// Validate a phone number: non-empty after trim, max 32 chars,
  /// only digits, plus, dash, parentheses, and spaces allowed.
  public func validatePhone(phone : Text) : { #ok : Text; #err : Text } {
    let t = trim(phone);
    if (t.size() == 0) return #err("Phone number is required");
    if (t.size() > 32) return #err("Phone number must be at most 32 characters");
    let invalid = t.toArray().filter(func(c : Char) : Bool {
      not c.isDigit() and c != '+' and c != '-' and c != '(' and c != ')' and c != ' '
    });
    if (invalid.size() > 0) return #err("Phone number contains invalid characters");
    #ok(t);
  };

  /// Validate a date string: must be YYYY-MM-DD, month 1–12, day 1–31.
  public func validateDate(date : Text) : { #ok : Text; #err : Text } {
    let chars = date.toArray();
    if (chars.size() != 10) return #err("Date must be in YYYY-MM-DD format");
    if (chars[4] != '-' or chars[7] != '-') return #err("Date must be in YYYY-MM-DD format");
    switch (parseFourDigits(chars, 0), parseTwoDigits(chars, 5), parseTwoDigits(chars, 8)) {
      case (?_year, ?month, ?day) {
        if (month < 1 or month > 12) return #err("Month must be between 1 and 12");
        if (day < 1 or day > 31) return #err("Day must be between 1 and 31");
        #ok(date);
      };
      case _ { #err("Date must be in YYYY-MM-DD format") };
    };
  };

  /// Validate a time string: must be HH:MM, hour 0–23, minute 0–59.
  public func validateTime(time : Text) : { #ok : Text; #err : Text } {
    let chars = time.toArray();
    if (chars.size() != 5) return #err("Time must be in HH:MM format");
    if (chars[2] != ':') return #err("Time must be in HH:MM format");
    switch (parseTwoDigits(chars, 0), parseTwoDigits(chars, 3)) {
      case (?hour, ?minute) {
        if (hour > 23) return #err("Hour must be between 0 and 23");
        if (minute > 59) return #err("Minute must be between 0 and 59");
        #ok(time);
      };
      case _ { #err("Time must be in HH:MM format") };
    };
  };

  /// Validate a search query: non-empty after trim, max 256 chars.
  /// Returns #ok(trimmed) or #err — callers should return empty results on err, not a fault.
  public func validateSearchQuery(q : Text) : { #ok : Text; #err : Text } {
    let t = trim(q);
    if (t.size() == 0) return #err("Search query is required");
    if (t.size() > 256) return #err("Search query must be at most 256 characters");
    #ok(t);
  };

  // ─── Party size ──────────────────────────────────────────────────────────

  /// Maximum number of guests in a single reservation.
  /// Upper bound prevents expensive seating loops from being triggered with
  /// arbitrarily large party sizes (SEC-003 defence).
  public let MAX_PARTY_SIZE : Nat = 500;

  /// Validate a party size: must be at least 1 and at most MAX_PARTY_SIZE.
  public func validatePartySize(n : Nat) : { #ok : Nat; #err : Text } {
    if (n < 1) return #err("Party size must be at least 1");
    if (n > MAX_PARTY_SIZE) return #err("Party size must be at most " # MAX_PARTY_SIZE.toText());
    #ok(n);
  };
};
