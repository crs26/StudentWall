import Type "Types"
module {
    public type Message = {
        id : Nat;
        message : Type.Message;
        creator : Type.User;
    };

    public type Comment = {
        id : Nat;
        comment : Type.Comment;
        creator : Type.User;
    }
}