import React from "react";
import LoginIllustration from "../../../assets/images/login.png";
import UnauthorizedLayout from "../../Layouts/UnauthorizedLayout";
import LoginComponent from "./login_component";

const Login = () => {
  return (
    <UnauthorizedLayout
      illustration={LoginIllustration}
      left_heading={"Create your own RoundTable and"}
      left_subheading={"stream them live in audio & video format."}
      rightcomponent={<LoginComponent />}
    />
  );
};
export default Login;
