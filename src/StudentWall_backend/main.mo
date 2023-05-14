import Type "Types";
import Admin "Admin";
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
import _Message "Message";
import Message "Message";

actor class StudentWall() {
  type Message = Type.Message;
  type Content = Type.Content;
  type Survey = Type.Survey;
  type Answer = Type.Answer;
  type User = Type.User;
  type Comment = Type.Comment;

  stable var enReg : Bool = true;
  stable var enMod : Bool = false;

  var messageHash = HashMap.HashMap<Nat, Message>(1, Nat.equal, Hash.hash);
  var commentHash = HashMap.HashMap<Nat, Comment>(1, Nat.equal, Hash.hash);
  var userHash = HashMap.HashMap<Principal, User>(1, Principal.equal, Principal.hash);
  var admin = Buffer.Buffer<User>(1);

  // Add a new message to the wall
  public shared ({ caller }) func writeMessage(t : Text, c : Content) : async Nat {
    let len: Nat = messageHash.size();
    messageHash.put(len, {text = t; content = c; creator = caller; vote = 0; comments = []});
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
  public shared ({ caller }) func updateMessage(messageId : Nat, t : Text, c : Content) : async Result.Result<(), Text> {
    let validId : Bool = Nat.greater(messageHash.size(), messageId);
    if (validId) {
      switch(messageHash.get(messageId)) {
        case(?value) {
          let owner : Bool = Principal.equal(caller, value.creator);
          if (owner) {
            messageHash.put(messageId, {text = t; content = c; creator = value.creator; vote = value.vote; comments = value.comments});
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
        return #ok(messageHash.put(messageId, {text = value.text; content = value.content; creator = value.creator; vote = value.vote + 1; comments = value.comments}));
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
        return #ok(messageHash.put(messageId, {text = value.text; content = value.content; creator = value.creator; vote = value.vote - 1; comments = value.comments}));
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

  // Comment functions
  public func writeComment(t : Text, p : Principal, messageId : Nat) : async () {
    let s : Nat = commentHash.size();
    let u : ?User = userHash.get(p);
    switch(u) {
      case(?u) { 
        let m = messageHash.get(messageId);
        let comSize = commentHash.size();
        switch(m) {
          case(?m) {  
            commentHash.put(comSize, {text = t; user = u});
            messageHash.put(messageId, _Message.addComment(m, comSize));
          };
          case(_) { 
            // return error invalid message id
          };
        };
      };
      case(_) { 
        // return error user not exist
      };
    };
  };

  public func deleteComment(commentId : Nat, messageId : Nat) : async () {
    let msg : ?Message = messageHash.get(messageId);
    switch(msg) {
      case(?msg) {  
        messageHash.put(messageId, _Message.removeComment(msg, commentId));
        ignore commentHash.remove(commentId);
      };
      case(_) { };
    };
  };

  public query func getComment(messageId:Nat) : async Result.Result<[Comment], Text> {
    let msg : ?Message = messageHash.get(messageId);
    var commBuff = Buffer.Buffer<Comment>(1);
    switch(msg) {
      case(?msg) {  
        let commArr : [Nat] = msg.comments;
        for(item in commArr.vals()) {
          let comment : ?Comment = commentHash.get(item);
          switch(comment) {
            case(?comment) {  
              commBuff.add(comment); 
            };
            case(_) { 
              // return error invalid comment id
            };
          };
        };
        return #ok(Buffer.toArray(commBuff));
      };
      case(_) { 
        // return error invalid message id
        return #err("Invalid message Id")
      };
    };
  };

  // User functions
  public func addUser(n:Text, p:Principal, i:Blob) : async () {
    let s = userHash.size();
    userHash.put(p, {name = n ; allowMsg = true; image=i});
  };


  // Admin functions
  public func adminEnReg(b:Bool) : async () {
    enReg := b;
  };
};
