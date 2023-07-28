import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import {
  STATIC_TOKEN,
  REACT_APP_BASE_URL_FOR_USER,
  REACT_APP_BASE_URL,
  REACT_APP_BASE_URL_FOR_USER_V1,
} from "../../../constants/env";

// assets
import logingif2 from "../../../assets/gif/logingif2.gif";
import logo from "../../../assets/images/logo.svg";
import ToastHandler from "../../../utils/ToastHandler";
import { allWords } from "../../../App";
import { MetaTagsGenerator } from "../../../utils/MetaTagsGenerator";
import { metaData } from "../../../constants/StaticPagesMetaTags";
import logger from "../../../logger";

export default function Login2() {
  // vars
  const navigate = useNavigate();
  const inputReff = useRef();
  // state
  const [username, setfirstName] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [erroDiv, setErroDiv] = useState("");
  const [l2ErrFlag, setL2ErrFlag] = useState(false);

  // Effects
  useEffect(() => {
    sessionStorage.clear();
    if (localStorage.getItem("access")) {
      window.location.replace("home");
    }
  }, []);

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
              setErroDiv(allWords.misc.pages.prelogin.pleaseadd);
              setShowLoader(false);
              return;
            }
          } else {
            setErroDiv(allWords.misc.pages.prelogin.pleaseadd);
            setShowLoader(false);
            return;
          }
        } else {
          setErroDiv(allWords.misc.pages.prelogin.pleaseadd);
          setShowLoader(false);
          return;
        }
      }

      if (country_code !== "+91") {
        setErroDiv(
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
        user_type: "LOGIN",
        username: username,
      });
    }

    var config = {
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
        setErroDiv("");
        sessionStorage.setItem(
          "emailorphone",
          JSON.stringify(res.data?.data[0])
        );
        navigate("/login/otp");
      } else if (res.data.status == 253) {
        setErroDiv(res.data.message);
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
    let emailRegex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    let phoneRegex = new RegExp("^([0-9()/+ -]*)$");
    let phoneRegexTwo = new RegExp(
      REACT_APP_BASE_URL.includes("perf")
        ? "(0|91)?[1-9][0-9]{9}"
        : "(0|91)?[6-9][0-9]{9}"
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
              setErroDiv(allWords.misc.pages.prelogin.pleaseadd);
              setShowLoader(false);
              return;
            }
          } else {
            setErroDiv(allWords.misc.pages.prelogin.pleaseadd);
            setShowLoader(false);
            return;
          }
        } else {
          setErroDiv(allWords.misc.pages.prelogin.pleaseadd);
          setShowLoader(false);
          return;
        }
      }
      if (!phoneRegexTwo.test(username)) {
        setErroDiv("Please enter a valid phone no.");
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

    var config = {
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
            setErroDiv(
              "You are not registered with us. Kindly create an account to login."
            );
            return;
          }
          setErroDiv(res.data.message || allWords.misc.somethingwrong);
          inputReff.current.style.border = "2px solid #c94c56";
          return;
        }
        if (res.data.status == 200) {
          setShowLoader(false);
          if (res.data.message == "Password not present") {
            setErroDiv(
              "You have not set your password. Kindly Login with OTP."
            );
            return;
          }
          if (res.data.message == "Password present") {
            setErroDiv("");
            setShowLoader(false);
            navigate("/login/password");
          }
        }
      })
      .catch((err) => {
        logger.error(err);
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
    <>
      <MetaTagsGenerator metaTags={metaData["login"]} />
      <div className="main">
        <h1 id="page-title" style={{ display: "none" }}>
          Khul Ke - Social Networking Platform
        </h1>
        <div className="left">
          <div className="lcont">
            <img src={logo} alt="logo" />
            <h2 className="heading">{allWords.login.headingleft}</h2>
            <img
              src={logingif2}
              alt="login gif"
              width="auto"
              height="450"
              style={{ objecFit: "cover" }}
              className="logingif2"
            />
          </div>
        </div>
        <div className="right">
          <div className="formDiv">
            <form onSubmit={sendToNxtPage}>
              <p className="loginp">{allWords.login.headingOfForm}</p>
              {/* email field */}
              <div className="emailField">
                <label htmlFor="fname">{allWords.login.lineAboveInput}</label>
                <br />
                <input
                  type="text"
                  id="fname"
                  name="fname"
                  autoComplete="off"
                  placeholder={allWords.login.placeHolder}
                  required
                  value={username}
                  onChange={(e) => {
                    setfirstName(e.target.value);
                    erroDiv.length > 0 && setErroDiv("");
                  }}
                  ref={inputReff}
                />
                <br />
              </div>
              {/* error div */}
              <small
                // ref={email_alert_text}
                className="erorPhonmailindex"
              >
                {erroDiv}
              </small>
              {/* radio buttons container */}
              <div className="radioDiv">
                <p className="loginWith">{allWords.login.radioTitle}</p>
                <div className="d-flex">
                  <span className="otpcont">
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
                    <label htmlFor="otp">{allWords.login.opt1}</label>
                  </span>

                  <span className="passcont">
                    <input
                      className="radiopass"
                      type="radio"
                      id="password"
                      name="fav_language"
                      value="password"
                      checked={selectedType == "password"}
                      onChange={() => {
                        setSelectedType("password");
                      }}
                    />
                    <label htmlFor="password">{allWords.login.opt2}</label>
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="loginBtn btn primary-btn-blk"
                disabled={selectedType == null || username == ""}
                // onClick={() => window.location.replace("/signup")}
              >
                {showLoader ? (
                  <CircularProgress
                    style={{ color: "#66B984", width: 27, height: 27 }}
                  />
                ) : (
                  allWords.login.btn
                )}
              </button>
              <div className="text-center mb-5">
                <small className="alert-text caLine">
                  New User?
                  <Link to="/signup" style={{ textDecoration: "none" }}>
                    <span> Create an Account</span>
                  </Link>
                </small>
              </div>

              <div className="policyDiv mb-4">
                <p>
                  By continuing, you agree to accept our{" "}
                  <Link
                    to="/privacy-policy"
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <span style={{ fontSize: "14px" }}>Privacy Policy</span>
                  </Link>{" "}
                  &#38;{" "}
                  <Link
                    to="/terms-conditions"
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <span style={{ fontSize: "14px" }}>Terms of Service.</span>
                  </Link>
                </p>
              </div>
            </form>
            <div className="lastLne alert-text">
              For any support, you can reach us at{" "}
              <span style={{ fontWeight: "bold" }}>
                <a
                  href="mailto: support@khulke.com"
                  style={{ textDecoration: "none" }}
                >
                  {allWords.login.khulkeMail}
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
