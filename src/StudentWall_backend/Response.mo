import Types "Types";
import Type "Types"
module {
    public type Message = {
        id : Nat;
        message : Type.Message;
    };

    public type Comment = {
        id : Nat;
        comment : Type.Comment;
    }
}