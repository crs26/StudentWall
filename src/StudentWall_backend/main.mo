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
import Response "Response";

actor class StudentWall() {
  type Message = Type.Message;
  type Content = Type.Content;
  type Survey = Type.Survey;
  type Answer = Type.Answer;
  type User = Type.User;
  type Comment = Type.Comment;

  stable var enReg : Bool = true;
  stable var enMod : Bool = false;
  stable var postCount : Nat = 0;
  stable var commCount : Nat = 0;

  func _natHash(n : Nat) : (Nat32) {
    Text.hash(Nat.toText(n));
  };

  var messageHash = HashMap.HashMap<Nat, Message>(1, Nat.equal, _natHash);
  var commentHash = HashMap.HashMap<Nat, Comment>(1, Nat.equal, _natHash);
  var userHash = HashMap.HashMap<Principal, User>(1, Principal.equal, Principal.hash);
  var admin = Buffer.Buffer<User>(1);

  // Add a new message to the wall
  public shared ({ caller }) func writeMessage(t : Text, c : Content) : async Nat {
    postCount += 1;
    messageHash.put(postCount, {text = t; content = c; creator = caller; vote = 0; comments = []});
    return postCount;
  };

  // Get a specific message by ID
  public query func getMessage(messageId : Nat) : async Result.Result<Message, Text> {
    let msg : ?Message = messageHash.get(messageId);
    switch(msg) {
      case(?value) {
        return #ok(value);
      };
      case(_) {
        return #err("Message with id " # Nat.toText(messageId) #  "does not exist.");
      };
    };
  };

  // Get user messages
  public shared ({caller}) func getUserMessages() : async Result.Result<[Message], Text>{
    let buff = Buffer.Buffer<Message>(1);
    let t = HashMap.mapFilter<Nat, Message, Message>(messageHash, Nat.equal, _natHash, func (k, v) {
      if(Principal.equal(v.creator, caller)){
        buff.add(v);
        return ?v
      }else return null
    });
    return #ok(Buffer.toArray(buff))
  };

  // Update the content for a specific message by ID
  public shared ({ caller }) func updateMessage(messageId : Nat, t : Text, c : Content) : async Result.Result<(), Text> {
    let msg : ?Message = messageHash.remove(messageId);
    switch(msg) {
      case(?value) {  
        let owner : Bool = Principal.equal(caller, value.creator);
        if (owner) {
          messageHash.put(messageId, {text = t; content = c; creator = value.creator; vote = value.vote; comments = value.comments});
          return #ok();
        };
        return #err("Only the owner can update the content");
      };
      case(_) { 
        return #err("Message with id " # Nat.toText(messageId) #  "does not exist.")
      };
    };
  };

  // Delete a specific message by ID
  public shared ({ caller }) func deleteMessage(messageId : Nat) : async Result.Result<(), Text> {
    let msg : ?Message = messageHash.remove(messageId);
    switch(msg) {
      case(?msg) {  
        return #ok();
      };
      case(_) { 
        return #err("Message with id " # Nat.toText(messageId) #  "does not exist.")
      };
    };
  };

  // Voting
  public func upVote(messageId : Nat) : async Result.Result<(), Text> {
    let msg : ?Message = messageHash.get(messageId);
    switch(msg) {
      case(?value) {
        return #ok(messageHash.put(messageId, {text = value.text; content = value.content; creator = value.creator; vote = value.vote + 1; comments = value.comments}));
      };
      case(_) {
        return #err("Message with id " # Nat.toText(messageId) #  "does not exist.");
      };
    };
  };

  public func downVote(messageId : Nat) : async Result.Result<(), Text> {
    let msg : ?Message = messageHash.get(messageId);
    switch(msg) {
      case(?value) {
        return #ok(messageHash.put(messageId, {text = value.text; content = value.content; creator = value.creator; vote = value.vote - 1; comments = value.comments}));
      };
      case(_) {
        return #err("Message with id " # Nat.toText(messageId) #  "does not exist.");
      };
    };
  };

  // Get all messages
  public query func getAllMessages() : async [Response.Message] {
    var arr  = Buffer.Buffer<Response.Message>(1);
    for ((key, value) in messageHash.entries()) {
      arr.add({id = key; message = value});
    };
    arr.sort(func (x : Response.Message, y : Response.Message) {
      return Nat.compare(x.id, y.id);
    });
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

  public query func getAllMessagesRanked() : async [Response.Message] {
    var arr  = Buffer.Buffer<Response.Message>(1);
    for ((key, value) in messageHash.entries()) {
      arr.add({id=key; message=value});
    };
    arr.sort(func (x : Response.Message, y : Response.Message) {
      return desc(x.message.vote, y.message.vote);
    });
    return Buffer.toArray(arr);
  };

  // Comment functions
  public shared({caller}) func writeComment(t : Text, messageId : Nat) : async (Result.Result<(), Text>) {
    let m = messageHash.get(messageId);
    switch(m) {
      case(?m) {  
        commCount += 1;
        commentHash.put(commCount, {text = t; creator = caller});
        messageHash.put(messageId, _Message.addComment(m, commCount));
        return #ok();
      };
      case(_) { 
        // return error invalid message id
        return #err("Invalid message id");
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

  public query func getAllComment(messageId : Nat) : async Result.Result<[Response.Comment], Text> {
    let msg : ?Message = messageHash.get(messageId);
    switch(msg) {
      case(?msg) {  
        var commList = Buffer.Buffer<Response.Comment>(1);
        for(item in msg.comments.vals()) {
          let comm = commentHash.get(item);
          switch(comm) {
            case(?comm) {  
              commList.add({id = item; comment = comm});
            };
            case(_) { 
              // return #err("Comment with id " # Nat.toText(item) #  "does not exist.");
            };
          };
        };
        commList.sort(func (x : Response.Comment, y : Response.Comment) {
          return Nat.compare(x.id, y.id);
        });
        return #ok(Buffer.toArray(commList))
      };
      case(_) { 
        return #err("Message with id " # Nat.toText(messageId) #  "does not exist.");
      };
    };
  };

  // User functions
  public func addUser(n:Text, p:Principal, i:Blob) : async (Result.Result<(), Text>) {
    if (not enReg) return #err("Registration is disabled");
    if (Principal.isAnonymous(p)) return #err("Anonymous user is not allowed to register");
    let s = userHash.size();
    userHash.put(p, {name = n ; allowMsg = true; image=i});
    return #ok();
  };

  public shared({caller}) func getUser(p : ?Principal) : async Result.Result<User, Text> {
    switch(p) {
      case(?p) {  
        let u : ?User = userHash.get(p);
        switch(u) {
          case(?u) {  
            return #ok(u)
          };
          case(_) { 
            return #err("User not found")
          };
        };
      };
      case(_) { 
        let u : ?User = userHash.get(caller);
        switch(u) {
          case(?u) {  
            return #ok(u)
          };
          case(_) { 
            return #err("User not found")
          };
        };
      };
    };
  };


  // Admin functions
  public func adminEnReg(b:Bool) : async () {
    enReg := b;
  };
};
