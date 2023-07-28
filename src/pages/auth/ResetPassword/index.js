import React from "react";
import RPIllustration from "../../../assets/images/reset_password.png";
import UnauthorizedLayout from "../../Layouts/UnauthorizedLayout";
import ResetPasswordComponent from "./reset_password_component";

const ResetPassword = () => {
  return (
    <UnauthorizedLayout
      illustration={RPIllustration}
      left_heading={"Be a powerful audience in "}
      left_subheading={"interesting conversations, have your say!"}
      rightcomponent={<ResetPasswordComponent />}
    />
  );
};
export default ResetPassword;
