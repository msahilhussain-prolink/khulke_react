import React from "react";
import PreloginModal from "..";
import ForgotPassComp from "./ForgotPassComp";
import { allWords } from "../../../App"

export default function ForgotPass(props) {
  const {
    forgotPassComp,
    setForgotPassComp,
    setLoginComp,
    setSignupComp,
    src,
    extraComp,
  } = props;

  return (
    <>
      <PreloginModal
        open={forgotPassComp}
        setOpen={setForgotPassComp}
        src={src}
        txt1={allWords.misc.pages.fortitle}
        txt2={allWords.misc.pages.prelogin.entero}
        component={
          forgotPassComp === true ? (
            <ForgotPassComp
              setLoginComp={setLoginComp}
              setSignupComp={setSignupComp}
              setForgotPassComp={setForgotPassComp}
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
