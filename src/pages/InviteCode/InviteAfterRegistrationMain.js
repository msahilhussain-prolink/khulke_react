import React from "react";
import InviteAfterRegistration from "./InviteAfterRegistration";
import UnauthorizedLayout from "../Layouts/UnauthorizedLayout";
import RegisterIllustration from "../../assets/images/register_hires.png";
const Step4 = () => {
  return (
    <UnauthorizedLayout
      illustration={RegisterIllustration}
      left_heading={"Conversation Matters"}
      left_subheading={"Your portal to great conversations"}
      rightcomponent={<InviteAfterRegistration />}
    />
  );
};

export default Step4;
