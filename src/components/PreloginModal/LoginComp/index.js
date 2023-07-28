import React from "react";
import PreloginModal from "..";
import LoginComponent from "./LoginComponent";

export default function LoginComp(props) {
  const {
    loginComp,
    setLoginComp,
    signupComp,
    setSignupComp,
    setLogGetOtpComp,
    setLogPassComp,
    setModalOpen,
    txt1,
    txt2,
    src,
    extraComp,
  } = props;

  return (
    <>
      <PreloginModal
        open={loginComp}
        setOpen={setLoginComp}
        src={src}
        txt1={txt1}
        txt2={txt2}
        component={
          loginComp === true ? (
            <LoginComponent
              loginComp={loginComp}
              setLoginComp={setLoginComp}
              signupComp={signupComp}
              setSignupComp={setSignupComp}
              setLogGetOtpComp={setLogGetOtpComp}
              setLogPassComp={setLogPassComp}
              setModalOpen={setModalOpen}
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
