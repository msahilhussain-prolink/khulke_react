import React from "react";
import FriendsIllustration from "../../assets/images/Group 21353.png";
import UnauthorizedLayout from "../Layouts/UnauthorizedLayout";
import FriendsComponent from "./friends_component";

const FriendSuggestions = () => {
  return (
    <UnauthorizedLayout
      illustration={FriendsIllustration}
      left_heading={"Collaborate with people"}
      left_subheading={"with different talents."}
      rightcomponent={<FriendsComponent />}
    />
  );
};

export default FriendSuggestions;
