import axios from "axios";
import React, { useEffect, useState } from "react";
import { allWords } from "../../../App";
import {
  REACT_APP_BASE_URL,
  REACT_APP_BASE_URL_FOR_USER_V1,
  REACT_APP_BASE_URL_FOR_USER,
  STATIC_TOKEN,
} from "../../../constants/env";
import logger from "../../../logger";
import ToastHandler from "../../../utils/ToastHandler";
import { device_info } from "../../../utils/utils";
import "../style.css";

export default function LoginComponent(props) {
  const { setLoginComp, setSignupComp, setLogGetOtpComp, setLogPassComp } =
    props;

  const [username, setfirstName] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [errorDiv, setErrorDiv] = useState("");

  // country code state
  const [country_code, setCountryCode] = useState("+91");
  const getCountryCode = async () => {
    axios
      .get("https://ipapi.co/json/")
      .then((response) => {
        setCountryCode(response.data.country_calling_code);
      })
      .catch();
  };

  useEffect(() => {
    getCountryCode();
  }, []);

  // handlers
  async function sendOTPFunc() {
    setShowLoader(true);
    let data;

    let emailRegex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    let phoneRegex = new RegExp("^([0-9()/+ -]*)$");
    let phoneRegexTwo = new RegExp(
      REACT_APP_BASE_URL.includes("perf")
        ? "(0|91)?[1-9][0-9]{9}"
        : "(0|91)?[6-9][0-9]{9}"
    );

    let phone = username;

    if (emailRegex.test(username)) {
      await sessionStorage.setItem("username", username);
      await sessionStorage.setItem("selectedType", selectedType);
      data = JSON.stringify({
        user_type: "LOGIN",
        username: username,
      });
    } else if (phoneRegex.test(phone)) {
      if (phone.length !== 10) {
        if (phone.length > 10) {
          if (phone[0] === "+" || phone[0] === "9") {
            const code = phone.slice(0, phone.length - 10);
            if (code === "+91" || code === "91") {
              phone = phone.slice(code.length, code.length + 10);
            } else {
              setErrorDiv(allWords.misc.pages.prelogin.pleaseadd);
              setShowLoader(false);
              return;
            }
          } else {
            setErrorDiv(allWords.misc.pages.prelogin.pleaseadd);
            setShowLoader(false);
            return;
          }
        } else {
          setErrorDiv(allWords.misc.pages.prelogin.pleaseadd);
          setShowLoader(false);
          return;
        }
      }

      if (country_code !== "+91") {
        setErrorDiv(
          "You cannot login with your mobile number from outside India. Kindly use your username to login"
        );
        setShowLoader(false);
        return;
      }

      if (phone.length === 10) {
        if (phoneRegexTwo.test(phone)) {
          await sessionStorage.setItem("username", `${country_code}${phone}`);
          await sessionStorage.setItem("selectedType", selectedType);
          data = JSON.stringify({
            user_type: "LOGIN",
            country_code: "+91",
            username: `${country_code}${phone}`,
          });
        }
      }
    } else {
      await sessionStorage.setItem("username", username);
      await sessionStorage.setItem("selectedType", selectedType);
      data = JSON.stringify({
        device_info: device_info,
        user_type: "LOGIN",
        username: username,
      });
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
      const res = await axios(config);
      if (res.data.status === 200) {
        setErrorDiv("");
        sessionStorage.setItem(
          "emailorphone",
          JSON.stringify(res.data?.data[0])
        );
        setLoginComp(false);
        setLogGetOtpComp(true);
      } else if (res.data.status == 253) {
        setErrorDiv(res.data.message);
        setShowLoader(false);
      } else {
        setShowLoader(false);
        ToastHandler("dan", allWords.misc.somethingwrong);
      }
    } catch (error) {
      setShowLoader(false);
      ToastHandler("dan", allWords.misc.somethingwrong);
    }
  }

  async function checkPassRedirect() {
    setShowLoader(true);
    let url = `${REACT_APP_BASE_URL_FOR_USER}/check_passwordpresent/`;
    let phoneRegex = new RegExp("^([0-9()/+ -]*)$");
    let phoneRegexTwo = new RegExp(
      "^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$"
    );
    let data;
    let phone = username;

    if (phoneRegex.test(phone)) {
      if (phone.length !== 10) {
        if (phone.length > 10) {
          if (phone[0] === "+" || phone[0] === "9") {
            const code = phone.slice(0, phone.length - 10);
            if (code === "+91" || code === "91") {
              phone = phone.slice(code.length, code.length + 10);
            } else {
              setErrorDiv(allWords.misc.pages.prelogin.pleaseadd);
              setShowLoader(false);
              return;
            }
          } else {
            setErrorDiv(allWords.misc.pages.prelogin.pleaseadd);
            setShowLoader(false);
            return;
          }
        } else {
          setErrorDiv(allWords.misc.pages.prelogin.pleaseadd);
          setShowLoader(false);
          return;
        }
      }
      if (!phoneRegexTwo.test(username)) {
        setErrorDiv("Please enter a valid phone no.");
        setShowLoader(false);
        return;
      }
      if (phoneRegexTwo.test(username)) {
        data = {
          user_data: `${country_code}${phone}`,
        };
      }
    } else {
      data = {
        user_data: username,
      };
    }

    const config = {
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Authorization: STATIC_TOKEN,
      },
      data: data,
    };
    if (phoneRegexTwo.test(username)) {
      await sessionStorage.setItem("username", `${country_code}${phone}`);
    } else {
      await sessionStorage.setItem("username", username);
    }
    await sessionStorage.setItem("selectedType", selectedType);

    await axios(config)
      .then((res) => {
        if (res.data.status === 253) {
          setShowLoader(false);
          if (res.data.message == "user not found") {
            setErrorDiv(
              "You are not registered with us. Kindly create an account to login."
            );
            return;
          }
          return;
        }
        if (res.data.status == 200) {
          setShowLoader(false);
          if (res.data.message == "Password not present") {
            setErrorDiv(
              "You have not set your password. Kindly Login with OTP."
            );
            return;
          }
          if (res.data.message == "Password present") {
            setErrorDiv("");
            setShowLoader(false);
            setLoginComp(false);
            setLogPassComp(true);
          }
        }
      })
      .catch((err) => {
        logger.info(err);
      });
  }

  const sendToNxtPage = async (e) => {
    e.preventDefault();
    if (selectedType === "otp") {
      sendOTPFunc();
    }
    if (selectedType === "password") {
      checkPassRedirect();
    }
  };

  return (
    <div style={{ marginTop: "40px", width: "100%" }}>
      <span
        style={{
          marginLeft: "10px",
        }}
      >
        {allWords.misc.pages.prelogin.til1}
      </span>
      <ol
        style={{
          marginLeft: "10px",
        }}
      >
        <li>{allWords.misc.pages.prelogin.til2}</li>
        <li>{allWords.misc.pages.prelogin.til3}</li>
      </ol>
      <form onSubmit={sendToNxtPage}>
        <div className="emField">
          <label htmlFor="fname">{allWords.misc.pages.prelogin.til4}</label>
          <br />
          <input
            type="text"
            id="fname"
            name="fname"
            placeholder="abcd@example.com"
            autoComplete="off"
            required
            value={username}
            onChange={(e) => {
              setfirstName(e.target.value);
              errorDiv.length > 0 && setErrorDiv("");
            }}
          />
          <br />
        </div>
        {/* error div */}
        <small className="errormsg">{errorDiv}</small>
        {/* radio buttons container */}
        <div className="radioBtnGrp">
          <p className="loginP">Login with</p>
          <span className="otpSpan">
            <input
              onChange={() => {
                setSelectedType("otp");
              }}
              type="radio"
              id="otp"
              name="fav_language"
              value="otp"
              checked={selectedType == "otp"}
            />
            <label htmlFor="otp">OTP</label>
          </span>

          <span className="passSpan">
            <input
              className="radioIp"
              type="radio"
              id="password"
              name="fav_language"
              value="password"
              checked={selectedType == "password"}
              onChange={() => {
                setSelectedType("password");
              }}
            />
            <label htmlFor="password">Password</label>
          </span>

          <button
            type="submit"
            className="logUp_btn login_btn btn primary-btn-blk"
            disabled={selectedType == null || username == ""}
          >
            CONTINUE
          </button>
          <div className="text-center mb-5">
            <small className="alert-text ca">
              New User?
              <span
                onClick={() => {
                  setSignupComp(true);
                  setLoginComp(false);
                }}
                style={{
                  cursor: "pointer",
                }}
              >
                {" "}
                Create an Account
              </span>
            </small>
          </div>
        </div>
      </form>
    </div>
  );
}
