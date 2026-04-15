module {
  /// Template type identifiers (extends email-templates domain)
  public type ReviewRequestDelay = { #hour1; #hour2; #hour24 };

  /// Settings for automated post-visit review requests
  public type ReviewRequestSettings = {
    enabled : Bool;
    delay : ReviewRequestDelay;
    message : Text;
  };

  /// Tracks which reservations have already had a review request sent
  /// to prevent duplicate sends
  public type ReviewRequestRecord = {
    reservationId : Text;
    sentAt : Int; // nanoseconds since epoch
  };
};
