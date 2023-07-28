import React from "react";
import VerifyFPIllustration from "../../../assets/images/verifyfp.png";
import UnauthorizedLayout from "../../Layouts/UnauthorizedLayout";
import VerifyFPComponent from "./verify_fp_component";

const VerifyOTP = () => {
  return (
    <UnauthorizedLayout
      illustration={VerifyFPIllustration}
      left_heading={"Speak your mind or interact "}
      left_subheading={"with others on your TownHall."}
      rightcomponent={<VerifyFPComponent />}
    />
  );
};
export default VerifyOTP;
