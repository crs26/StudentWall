import Types "Types";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Nat "mo:base/Nat";
import HashMap "mo:base/HashMap";
module {
    public func addComment(msg : Types.Message, comment : Types.Comment) : (Types.Message) {
        let newComm = Buffer.fromArray<Types.Comment>(msg.comments);
        newComm.add(comment);
        return ({comments = Buffer.toArray(newComm); text = msg.text; content = msg.content; vote = msg.vote; creator = msg.creator});
    };
    public func removeComment(msg : Types.Message, commentId : Nat) : (Types.Message) {
        let tempComm = Buffer.fromArray<Types.Comment>(msg.comments);
        let comm = tempComm.getOpt(commentId);
        switch(comm) {
            case(?comm) {  
                ignore tempComm.remove(commentId);
                return ({comments = Buffer.toArray<Types.Comment>(tempComm); text = msg.text; content = msg.content; vote = msg.vote; creator = msg.creator});
            };
            case(_) { 
                return msg
            };
        };
    };
}