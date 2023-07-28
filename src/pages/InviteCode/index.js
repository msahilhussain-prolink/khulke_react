import React from "react";
import InviteCodeComponent from "./invite_code_component";
import UnauthorizedLayout from "../../pages/Layouts/UnauthorizedLayout";
import RegisterIllustration from "../../assets/images/register_hires.png";
const Step4 = () => {
  return (
    <UnauthorizedLayout
      illustration={RegisterIllustration}
      left_heading={"Conversation Matters"}
      left_subheading={"Your portal to great conversations"}
      rightcomponent={<InviteCodeComponent />}
    />
  );
};

export default Step4;
