import React from "react";
import RegisterIllustration from "../../assets/images/Group 22247.png";
import UnauthorizedLayout from "../Layouts/UnauthorizedLayout";
import VerifyOTPComponent from "./verify_otp_component";

const VerifyOTP = () => {
  return (
    <UnauthorizedLayout
      illustration={RegisterIllustration}
      left_heading={
        "Share your personal opinions, thoughts, updates with audio & visual content."
      }
      // left_subheading={"This is the beginning of a strong friendship"}
      rightcomponent={<VerifyOTPComponent />}
    />
  );
};
export default VerifyOTP;
