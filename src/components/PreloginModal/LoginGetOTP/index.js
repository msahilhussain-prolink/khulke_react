import React from "react";
import PreloginModal from "..";
import LogGetOtpComp from "./LogGetOtpComp";
import { allWords } from "../../../App"

export default function LoginGetOTP(props) {
  const {
    setLoginComp,
    setSignupComp,
    logGetotpComp,
    setLogGetOtpComp,
    src,
    extraComp,
  } = props;

  return (
    <>
      <PreloginModal
        open={logGetotpComp}
        setOpen={setLogGetOtpComp}
        src={src}
        txt1={allWords.misc.pages.signup.enterotp}
        component={
          logGetotpComp === true ? (
            <LogGetOtpComp
              setLoginComp={setLoginComp}
              setSignupComp={setSignupComp}
              setLogGetOtpComp={setLogGetOtpComp}
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
