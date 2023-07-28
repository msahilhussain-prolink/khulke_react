import { Typography } from "@mui/material";
import React from "react";
import { allWords } from "../../App"

export default function PreLoginSignup() {
  return (
    <>
      <div
        className='d-flex'
        style={{
          backgroundColor: "#66B984",
          padding: "1rem",
          paddingLeft: "8rem",
          position: "fixed",
          zIndex: "1000",
          bottom: "0px",
          width: "100%",
        }}
      >
        <button
          style={{
            padding: "9px 1.25rem",
            marginTop: "0",
            border: "1px solid #fff",
            width: "8rem",
            maxWidth: "8rem",
            minWidth: "8rem",
          }}
          id='login_button'
          className='d-flex logUp_btn login_btn'
          onClick={() => {
            window.location.replace("/login");
          }}
        >
          LOGIN
        </button>{" "}
        &emsp; &emsp;
        <button
          style={{
            padding: "9px 1.25rem",
            marginTop: "0",
            color: "#000",
            fontWeight: "bold",
            fontSize: "14px",
            maxWidth: "8rem",
            minWidth: "8rem",
          }}
          id='signUp_button'
          className='d-flex logUp_btn signup_btn'
          onClick={() => {
            window.location.replace("/signup");
          }}
        >
          SIGNUP
        </button>
        &emsp; &emsp;&emsp; &emsp;&emsp; &emsp;&emsp; &emsp;&emsp;&emsp;
        &emsp;&emsp;&emsp; &emsp;
        <Typography
          style={{
            color: "#fff",
            fontWeight: "bolder",
            fontSize: "24px",
            padding: "5px",
          }}
        >
          {allWords.misc.pages.login.pp21}
        </Typography>
      </div>
    </>
  );
}
