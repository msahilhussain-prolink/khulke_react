import React from "react";
import PreloginModal from "..";
import SignGetOtpComp from "./SignGetOtpComp";
import { allWords } from "../../../App";

export default function SignGetOtp(props) {
  const {
    getotpComp,
    setGetOtpComp,
    setLoginComp,
    setSignupComp,
    setWelcomeScreen,
    src,
    extraComp,
  } = props;

  return (
    <>
      <PreloginModal
        open={getotpComp}
        setOpen={setGetOtpComp}
        src={src}
        txt1={allWords.misc.pages.signup.enterotp}
        component={
          getotpComp === true ? (
            <SignGetOtpComp
              setLoginComp={setLoginComp}
              setSignupComp={setSignupComp}
              setWelcomeScreen={setWelcomeScreen}
              setGetOtpComp={setGetOtpComp}
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
