import React, { useState } from "react";

// Assets
import PreloginModal from "../PreloginModal";
import LoginComp from "../PreloginModal/LoginComp";
import SignupComp from "../PreloginModal/SignupComp";
import SignGetOtp from "../PreloginModal/SignGetOTP";
import LoginGetOTP from "../PreloginModal/LoginGetOTP";
import LoginPassword from "../PreloginModal/LoginPassword";
import ForgotPass from "../PreloginModal/ForgotPass";
import Welcome3 from "../../pages/Welcome/Welcome3";
import SignupComponent from "../PreloginModal/SignupComp/SignupComponent";

export default function PreloginComp(props) {
  const { modalOpen, setModalOpen, title, description, icon, extraComp } =
    props;

  const [loginComp, setLoginComp] = useState(false);
  const [signupComp, setSignupComp] = useState(false);
  const [getotpComp, setGetOtpComp] = useState(false);
  const [logGetotpComp, setLogGetOtpComp] = useState(false);
  const [logPassComp, setLogPassComp] = useState(false);
  const [forgotPassComp, setForgotPassComp] = useState(false);
  const [welcomeScreen, setWelcomeScreen] = useState(false);

  return (
    <>
      <PreloginModal
        open={modalOpen}
        setOpen={setModalOpen}
        src={icon}
        txt1={title}
        txt2={description}
        component={
          <SignupComponent
            loginComp={loginComp}
            setLoginComp={setLoginComp}
            signupComp={signupComp}
            setSignupComp={setSignupComp}
            setGetOtpComp={setGetOtpComp}
            setModalOpen={setModalOpen}
          />
        }
        setLoginComp={setLoginComp}
        setSignupComp={setSignupComp}
        extraComp={extraComp}
      />
      {loginComp === true && (
        <>
          <LoginComp
            loginComp={loginComp}
            setLoginComp={setLoginComp}
            signupComp={signupComp}
            setSignupComp={setSignupComp}
            setLogGetOtpComp={setLogGetOtpComp}
            setLogPassComp={setLogPassComp}
            setModalOpen={setModalOpen}
            txt1={title}
            txt2={description}
            src={icon}
            extraComp={extraComp}
          />
        </>
      )}
      {signupComp === true && (
        <>
          <SignupComp
            loginComp={loginComp}
            setLoginComp={setLoginComp}
            signupComp={signupComp}
            setSignupComp={setSignupComp}
            setGetOtpComp={setGetOtpComp}
            setModalOpen={setModalOpen}
            txt1={title}
            src={icon}
            txt2={description}
            extraComp={extraComp}
          />
        </>
      )}
      {getotpComp === true && (
        <>
          <SignGetOtp
            getotpComp={getotpComp}
            setGetOtpComp={setGetOtpComp}
            setLoginComp={setLoginComp}
            setSignupComp={setSignupComp}
            setWelcomeScreen={setWelcomeScreen}
            setModalOpen={setModalOpen}
            txt1={title}
            txt2={description}
            src={icon}
            extraComp={extraComp}
          />
        </>
      )}
      {logGetotpComp === true && (
        <>
          <LoginGetOTP
            logGetotpComp={logGetotpComp}
            setLogGetOtpComp={setLogGetOtpComp}
            setLoginComp={setLoginComp}
            setSignupComp={setSignupComp}
            setModalOpen={setModalOpen}
            txt1={title}
            txt2={description}
            src={icon}
            extraComp={extraComp}
          />
        </>
      )}
      {logPassComp === true && (
        <>
          <LoginPassword
            logPassComp={logPassComp}
            setLogPassComp={setLogPassComp}
            setLoginComp={setLoginComp}
            setSignupComp={setSignupComp}
            setForgotPassComp={setForgotPassComp}
            setModalOpen={setModalOpen}
            txt1={title}
            txt2={description}
            src={icon}
            extraComp={extraComp}
          />
        </>
      )}
      {forgotPassComp === true && (
        <>
          <ForgotPass
            forgotPassComp={forgotPassComp}
            setForgotPassComp={setForgotPassComp}
            setLoginComp={setLoginComp}
            setSignupComp={setSignupComp}
            txt1={title}
            txt2={description}
            src={icon}
            extraComp={extraComp}
          />
        </>
      )}
      {welcomeScreen === true && (
        <>
          <Welcome3 welcomeScreen={welcomeScreen} />
        </>
      )}
    </>
  );
}
