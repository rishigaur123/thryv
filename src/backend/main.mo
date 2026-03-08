import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

actor {
  let emails = Map.empty<Principal, Text>();

  module ResponseMessage {
    public type Message = {
      #success : Text;
      #error : Text;
    };
  };

  func validateEmailFormat(email : Text) : Bool {
    let atPos = email.chars().toArray().findIndex(func(c) { c == '@' });
    let hasAt = atPos != null;
    let rest = switch (atPos) {
      case (?i) { email.chars().toArray().sliceToArray(i + 1, email.size()) };
      case (null) { [] };
    };
    let hasDot = hasAt and rest.values().findIndex(func(c) { c == '.' }) != null;
    hasAt and hasDot;
  };

  public shared ({ caller }) func addEmail(email : Text) : async ResponseMessage.Message {
    if (not validateEmailFormat(email)) {
      return #error("Invalid email format. Please enter a valid email address.");
    };

    if (emails.containsKey(caller)) {
      return #error("This email has already been submitted. Thank you for your interest!");
    };

    emails.add(caller, email);
    #success("Thank you for registering your interest in THRYV Wellness! We'll keep you updated on our progress.");
  };

  public query ({ caller }) func getMyEmail() : async Text {
    switch (emails.get(caller)) {
      case (null) { Runtime.trap("Email does not exist") };
      case (?email) { email };
    };
  };

  public query ({ caller }) func getAllEmails() : async [Text] {
    emails.values().toArray();
  };
};
