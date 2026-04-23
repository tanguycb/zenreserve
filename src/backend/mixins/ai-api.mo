import AccessControl "mo:caffeineai-authorization/access-control";
import CommonTypes "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
) {
  /// Send a prompt to the AI service with optional context.
  /// Returns a graceful not-implemented response — http-outcalls integration pending.
  public shared ({ caller }) func askAI(
    prompt : Text,
    context : Text,
  ) : async { #ok : Text; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };
    // AI http-outcalls integration not yet configured.
    // Return a helpful placeholder so the frontend can degrade gracefully.
    #err("AI service is not yet configured. Please add an API key in Integrations settings.");
  };

  /// Get AI-powered booking suggestions for a guest or reservation context.
  /// Returns a graceful not-implemented response — integration pending.
  public shared ({ caller }) func getAISuggestions(
    guestId : ?CommonTypes.GuestId,
    reservationContext : Text,
  ) : async { #ok : [Text]; #err : Text } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return #err("Unauthorized");
    };
    // AI integration not yet configured — return empty suggestion list so callers
    // can handle the absence without crashing.
    #ok([]);
  };
};
