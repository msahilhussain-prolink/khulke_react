import React from "react";
import PreloginModal from "..";
import SignupComponent from "./SignupComponent";

export default function SignupComp(props) {
  const {
    loginComp,
    setLoginComp,
    signupComp,
    setSignupComp,
    setGetOtpComp,
    setModalOpen,
    src,
    txt1,
    txt2,
    extraComp,
  } = props;

  return (
    <>
      <PreloginModal
        open={signupComp}
        setOpen={setSignupComp}
        src={src}
        txt1={txt1}
        txt2={txt2}
        component={
          signupComp === true ? (
            <SignupComponent
              loginComp={loginComp}
              setLoginComp={setLoginComp}
              signupComp={signupComp}
              setSignupComp={setSignupComp}
              setGetOtpComp={setGetOtpComp}
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
