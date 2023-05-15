import Types "Types";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Nat "mo:base/Nat";
module {
    public func addComment(msg : Types.Message, commentId : Nat) : (Types.Message) {
        let newComm = Buffer.fromArray<Nat>(msg.comments);
        newComm.add(commentId);
        return ({comments = Buffer.toArray(newComm); text = msg.text; content = msg.content; vote = msg.vote; creator = msg.creator});
    };
    public func removeComment(msg : Types.Message, commentId : Nat) : (Types.Message) {
        let tempComm = Buffer.fromArray<Nat>(msg.comments);
        let commIndex = Buffer.indexOf<Nat>(commentId, tempComm, Nat.equal);
        switch(commIndex) {
            case(?commIndex) {  
                ignore tempComm.remove(commIndex);
                return ({comments = Buffer.toArray<Nat>(tempComm); text = msg.text; content = msg.content; vote = msg.vote; creator = msg.creator});
            };
            case(_) { 
                // comment not found
                return msg;
            };
        };
    };
}