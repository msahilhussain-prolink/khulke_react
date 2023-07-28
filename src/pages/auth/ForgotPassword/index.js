import React from "react";
import FPIllustration from "../../../assets/images/forgot_password.png";
import UnauthorizedLayout from "../../Layouts/UnauthorizedLayout";
import ForgotPasswordComponent from "./forgot_password_component";

const ForgotPassword = () => {
  return (
    <UnauthorizedLayout
      illustration={FPIllustration}
      left_heading={"Have monologues, interviews, "}
      left_subheading={"discussions, AGMs, press conferences or just "}
      left_subheading2={"catch up with friends."}
      rightcomponent={<ForgotPasswordComponent />}
    />
  );
};
export default ForgotPassword;
