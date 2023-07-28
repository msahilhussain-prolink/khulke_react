import axios from "axios";
import React, { useState } from "react";
import { allWords } from "../../../App";
import {
  REACT_APP_BASE_URL_FOR_USER_V1,
  STATIC_TOKEN,
} from "../../../constants/env";
import logger from "../../../logger";
import ToastHandler from "../../../utils/ToastHandler";
import FormInput from "../../FormInput";

export default function SignupComponent(props) {
  const {
    setLoginComp,
    setSignupComp,
    setGetOtpComp,
    setModalOpen,
  } = props;
  const [phoneEmailSwap, setPhoneEmailSwap] = useState("phone");
  const [email_id, setEmailID] = useState(null);
  const [phone_no, setPhoneNumber] = useState(null);
  const [erroDiv, setErroDiv] = useState("");

  const toggleSignInOption = (key) => {
    if (key === "email") {
      setPhoneEmailSwap("email");
      setPhoneNumber(null);
      setErroDiv("");
    } else {
      setPhoneEmailSwap("phone");
      setEmailID(null);
      setErroDiv("");
    }
  };

  const switchToLogin = () => {
    setSignupComp(false);
    setModalOpen(false);
    setLoginComp(true);
  };

  const sendToNxtPage = async (e) => {
    let emailRegex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    let phoneRegexTwo = new RegExp(
      "^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$"
    );
    let data = {};
    setErroDiv("");
    let phone = phone_no;
    if (phoneEmailSwap == "phone") {
      if (phone.length !== 10) {
        if (phone.length > 10) {
          if (phone[0] === "+" || phone[0] === "9") {
            const code = phone.slice(0, phone.length - 10);
            if (code === "+91" || code === "91") {
              phone = phone.slice(code.length, code.length + 10);
            } else {
              setErroDiv(allWords.misc.pages.prelogin.pleaseadd);
            }
          } else {
            setErroDiv(allWords.misc.pages.prelogin.pleaseadd);
          }
        } else {
          setErroDiv(allWords.misc.pages.prelogin.pleaseadd);
        }
      }
      if (phone.length == 10) {
        if (phoneRegexTwo.test(phone)) {
          if (email_id == null) {
            data = {
              user_type: "REGISTER",
              phone_number: `${phone}`,
              country_code: "+91",
            };
          }
        } else {
          setErroDiv("Please enter a valid phone no.");
        }
      }
    }

    if (phone == null && phoneEmailSwap == "email") {
      if (emailRegex.test(email_id)) {
        data = {
          user_type: "REGISTER",
          email: email_id,
        };
      } else {
        logger.info("fail");
        setErroDiv(allWords.misc.pages.prelogin.validem);
      }
    }

    const config = {
      method: "POST",
      url: `${REACT_APP_BASE_URL_FOR_USER_V1}/auth/send-otp`,
      headers: {
        "Content-Type": "application/json",
        Authorization: STATIC_TOKEN,
      },
      data: data,
    };

    try {
      await axios(config)
        .then((res) => {
          if (res.status === 253) {
            setErroDiv(res.data.message);
          }
          if (res.status === 200) {
            if (email_id == null) {
              sessionStorage.setItem("signupUsername", `${phone}`);
            } else if (phone == null) {
              sessionStorage.setItem("signupUsername", email_id);
            }

            setModalOpen(false);
            setSignupComp(false);
            setGetOtpComp(true);
          }
        })
        .catch((err) => {
          ToastHandler("dan", allWords.misc.somethingwrong);
        });
    } catch (error) {
      ToastHandler("dan", allWords.misc.somethingwrong);
    }
  };

  return (
    <div className="signUpContainer">
      <span className="signUpTitle">{allWords.misc.pages.prelogin.til1}</span>
      <ol className="signUpDesc">
        <li>{allWords.misc.pages.prelogin.til2}</li>
        <li>{allWords.misc.pages.prelogin.til3}</li>
      </ol>
      {/* email field */}
      {phoneEmailSwap === "email" && (
        <>
          <p className="enterP">{allWords.misc.pages.signup.enteradd}</p>
          <FormInput>
            <input
              type="email"
              autoComplete="false"
              onChange={(e) => {
                setEmailID(e.target.value);
              }}
              placeholder="abcd@example.com"
              required
            />
          </FormInput>
          <small className="erorPhonmail">{erroDiv}</small>
          <div
            className="phone-link signupUsing_email"
            onClick={() => toggleSignInOption("phone")}
          >
            {allWords.misc.pages.signup.usephone}
          </div>
          <br />
        </>
      )}

      {/* phone no. field */}
      {phoneEmailSwap === "phone" && (
        <>
          <p className="enterP">{allWords.misc.pages.signup.ph1}</p>
          <FormInput>
            <input
              value={phone_no}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setErroDiv("");
              }}
              autoComplete="false"
              type="tel"
              placeholder="9876543210"
              required
            />
          </FormInput>
          <small className="erorPhonmail">{erroDiv}</small>
          <div
            className="phone-link signupUsing_email"
            onClick={() => toggleSignInOption("email")}
          >
            {allWords.misc.pages.signup.usemail}
          </div>
        </>
      )}

      <button
        className="logUp_btn login_btn btn primary-btn-blk"
        onClick={() => {
          sendToNxtPage();
        }}
      >
        GET OTP
      </button>
      <div className="text-center mb-5">
        <small className="alert-text ca">
          {allWords.misc.pages.signup.alreadya}
          <span onClick={switchToLogin} className="cursorPointer">
            {" "}
            Log In
          </span>
        </small>
      </div>
    </div>
  );
}
