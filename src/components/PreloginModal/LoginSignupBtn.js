import React from "react";

export default function LoginSignupBtn(props) {
  const { loginComp, setLoginComp, signupComp, setSignupComp, setModalOpen } =
    props;

  return (
    <>
      <button
        style={{ padding: "9px 1.25rem" }}
        id="login_button"
        className="d-flex logUp_btn login_btn"
        onClick={() => {
          if (loginComp === false) {
            setLoginComp(true);
            setSignupComp(false);
            setModalOpen(false);
          }
        }}
      >
        {loginComp === false ? <>Log In</> : <>Continue</>}
      </button>
      <button
        style={{ padding: "9px 1.25rem" }}
        id="signUp_button"
        className="d-flex logUp_btn signup_btn"
        onClick={() => {
          if (signupComp === false) {
            setSignupComp(true);
            setLoginComp(false);
            setModalOpen(false);
          }
        }}
      >
        {signupComp === false ? <> Sign Up </> : <> Get Otp </>}
      </button>
    </>
  );
}
