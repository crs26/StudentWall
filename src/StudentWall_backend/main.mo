import Type "Types";
import Buffer "mo:base/Buffer";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Hash "mo:base/Hash";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Int "mo:base/Int";

actor class StudentWall() {
  type Message = Type.Message;
  type Content = Type.Content;
  type Survey = Type.Survey;
  type Answer = Type.Answer;

  // var content : Content = {Image(null) };
  // var message: Message = {content = content; creator = null};
  var messageHash = HashMap.HashMap<Nat, Message>(1, Nat.equal, Hash.hash);

  // Add a new message to the wall
  public shared ({ caller }) func writeMessage(c : Content) : async Nat {
    let len: Nat = messageHash.size();
    messageHash.put(len, {content = c; creator = caller; vote = 0});
    return len;
  };

  // Get a specific message by ID
  public shared query func getMessage(messageId : Nat) : async Result.Result<Message, Text> {
    let validId : Bool = Nat.greater(messageHash.size(), messageId);
    if (validId) {
      switch(messageHash.get(messageId)) {
        case(?value) {
          return #ok(value)
        };
        case(_) {
          return #err("not implemented");
        };
      };
    } else {
      return #err("not implemented");
    }
  };

  // Update the content for a specific message by ID
  public shared ({ caller }) func updateMessage(messageId : Nat, c : Content) : async Result.Result<(), Text> {
    let validId : Bool = Nat.greater(messageHash.size(), messageId);
    if (validId) {
      switch(messageHash.get(messageId)) {
        case(?value) {
          let owner : Bool = Principal.equal(caller, value.creator);
          if (owner) {
            messageHash.put(messageId, {content = c; creator = value.creator; vote = value.vote});
          };
          return #err("Only the owner can update the content")
        };
        case(_) {
          return #err("not implemented");
        };
      };
    };
    return #err("not implemented");
  };

  // Delete a specific message by ID
  public shared ({ caller }) func deleteMessage(messageId : Nat) : async Result.Result<(), Text> {
    let validId : Bool = Nat.greater(messageHash.size(), messageId);
    if (not validId) return #err("not implemented");
    return #ok(messageHash.delete(messageId));
  };

  // Voting
  public func upVote(messageId : Nat) : async Result.Result<(), Text> {
    let validId : Bool = Nat.greater(messageHash.size(), messageId);
    if (not validId) return #err("not implemented");
    switch(messageHash.get(messageId)) {
      case(?value) {
        return #ok(messageHash.put(messageId, {content = value.content; creator = value.creator; vote = value.vote + 1}));
      };
      case(_) {
        return #err("not implemented");
      };
    };
  };

  public func downVote(messageId : Nat) : async Result.Result<(), Text> {
    let validId : Bool = Nat.greater(messageHash.size(), messageId);
    if (not validId) return #err("not implemented");
    switch(messageHash.get(messageId)) {
      case(?value) {
        return #ok(messageHash.put(messageId, {content = value.content; creator = value.creator; vote = value.vote - 1}));
      };
      case(_) {
        return #err("not implemented");
      };
    };
  };

  // Get all messages
  public func getAllMessages() : async [Message] {
    var arr  = Buffer.Buffer<Message>(1);
    for ((key, value) in messageHash.entries()) {
      arr.add(value);
    };
    return Buffer.toArray(arr);
  };

  // Get all messages ordered by votes
  func desc(x:Int, y:Int) : { #less; #equal; #greater } {
    switch(Int.compare(x,y)) {
      case(#less) { #greater };
      case(#greater) { #less };
      case(_) { #equal };
    };
  };

  public func getAllMessagesRanked() : async [Message] {
    var arr  = Buffer.Buffer<Message>(1);
    for ((key, value) in messageHash.entries()) {
      arr.add(value);
    };
    arr.sort(func (x : Message, y : Message) {
      return desc(x.vote, y.vote);

    });
    return Buffer.toArray(arr);
  };
};
