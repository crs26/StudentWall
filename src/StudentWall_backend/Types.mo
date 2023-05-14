import Principal "mo:base/Principal";
module {
  public type Content = {
    #Text : Text;
    #Image : Blob;
    #Survey : Survey;
  };

  public type Message = {
    text : Text;
    content : Content;
    vote : Int;
    creator : Principal;
    comments : [Nat]
  };

  public type Comment = {
    text : Text;
    user : User;
  };

  public type Answer = (
    description : Text, // contains description of the answer
    numberOfVotes : Nat // represents the number of votes for this answer
  );

  public type Survey = {
    title : Text; // title describes the survey
    answers : [Answer]; // possible answers for the survey
  };

  public type User = {
    name : Text;
    image : Blob;
    allowMsg : Bool;
  };
};
