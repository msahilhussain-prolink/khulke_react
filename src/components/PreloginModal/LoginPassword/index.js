import React from "react";
import PreloginModal from "..";
import LoginPassComp from "./LoginPassComp";

export default function LoginPassword(props) {
  const {
    setLoginComp,
    setSignupComp,
    logPassComp,
    setLogPassComp,
    setForgotPassComp,
    src,
    extraComp,
  } = props;

  return (
    <>
      <PreloginModal
        open={logPassComp}
        setOpen={setLogPassComp}
        src={src}
        txt1="Enter Password"
        component={
          logPassComp === true ? (
            <LoginPassComp
              setLoginComp={setLoginComp}
              setSignupComp={setSignupComp}
              setForgotPassComp={setForgotPassComp}
              setLogPassComp={setLogPassComp}
            />
          ) : null
        }
        setLoginComp={setLoginComp}
        setSignupComp={setSignupComp}
        extraComp={extraComp}
      />
    </>
  );
}
