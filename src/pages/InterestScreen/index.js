import React from "react";
import RegisterIllustration from "../../assets/images/Group 21349.png";
import UnauthorizedLayout from "../Layouts/UnauthorizedLayout";
import InterestScreenComponent from "./interest_screen_component";

const InterestScreen = () => {
  return (
    <UnauthorizedLayout
      illustration={RegisterIllustration}
      left_heading={"Join engaging conversations "}
      left_subheading={"on topics of your interest."}
      rightcomponent={<InterestScreenComponent />}
    />
  );
};
export default InterestScreen;
