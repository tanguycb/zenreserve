import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import CommonTypes "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
) {
  /// Send a prompt to the AI service with optional context.
  /// Uses http-outcalls extension pattern — returns stub error until integrated.
  public shared ({ caller }) func askAI(
    prompt : Text,
    context : Text,
  ) : async { #ok : Text; #err : Text } {
    Runtime.trap("not implemented");
  };

  /// Get AI-powered booking suggestions for a guest or reservation context.
  /// Returns a list of suggestion strings (e.g., table recommendations, upsells).
  public shared ({ caller }) func getAISuggestions(
    guestId : ?CommonTypes.GuestId,
    reservationContext : Text,
  ) : async { #ok : [Text]; #err : Text } {
    Runtime.trap("not implemented");
  };
};
