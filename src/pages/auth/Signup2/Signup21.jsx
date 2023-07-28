import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../../../components/FormInput";
import {
  REACT_APP_BASE_URL_FOR_USER_V1,
  STATIC_TOKEN,
} from "../../../constants/env";
import ToastHandler from "../../../utils/ToastHandler";
import "../Login2/index.css";
// Assets
import CircularProgress from "@mui/material/CircularProgress";
import { allWords } from "../../../App";
import signup1 from "../../../assets/gif/signup1.gif";
import logo from "../../../assets/images/logo.svg";
import { metaData } from "../../../constants/StaticPagesMetaTags";
import logger from "../../../logger";
import { MetaTagsGenerator } from "../../../utils/MetaTagsGenerator";

export default function Signup21() {
  // vars
  const navigate = useNavigate();
  // state
  const [phoneEmailSwap, setPhoneEmailSwap] = useState("phone");
  const [email_id, setEmailID] = useState(null);
  const [phone_no, setPhoneNumber] = useState(null);
  const [erroDiv, setErroDiv] = useState("");
  const [loading, setLoading] = useState(false);

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
  const sendToNxtPage = async (e) => {
    let emailRegex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    let phoneRegexTwo = new RegExp(
      "^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$"
    );
    setLoading(true);
    e.preventDefault();
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
              setLoading(false);
            }
          } else {
            setErroDiv(allWords.misc.pages.prelogin.pleaseadd);
            setLoading(false);
          }
        } else {
          setErroDiv(allWords.misc.pages.prelogin.pleaseadd);
          setLoading(false);
        }
      }
      if (phone.length === 10) {
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
          setLoading(false);
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
        setErroDiv("Please enter a valid Email Id.");
        setLoading(false);
      }
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
    await axios(config)
      .then((res) => {
        if (res.status === 253) {
          setErroDiv(res.data.message);
          setLoading(false);
        }
        if (res.status === 200) {
          if (email_id == null) {
            sessionStorage.setItem("signupUsername", `${phone}`);
            navigate("/signup/otp");
          } else if (phone == null) {
            sessionStorage.setItem("signupUsername", email_id);
            navigate("/signup/otp");
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        logger.error(err);
        ToastHandler("dan", allWords.misc.somethingwrong);
      });
  };

  // Effects
  useEffect(() => {
    sessionStorage.clear();

    if (localStorage.getItem("access")) {
      navigate("/home");
    }
  }, []);

  return (
    <>
      <MetaTagsGenerator metaTags={metaData.signup} />
      <h1 id="page-title" style={{ display: "none" }}>
        {allWords.misc.pages.signup.sup}
      </h1>
      <div className="main">
        <div className="left">
          <div className="lcont">
            <img src={logo} alt="logo" />
            <h2 className="heading">{allWords.misc.pages.login.pp21}</h2>
            <img
              className="custom-gif"
              src={signup1}
              alt="login gif"
              width="auto"
              height="450"
              style={{ objecFit: "cover" }}
            />
          </div>
        </div>
        {/* right part */}
        <div className="right">
          <div className="formDiv">
            <form onSubmit={sendToNxtPage}>
              <p className="loginp"> {allWords.misc.pages.signup.sup}</p>
              {/* email field */}
              {phoneEmailSwap === "email" && (
                <div>
                  <p className="entermailP">Enter Email Address</p>
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
                  <div className="phone-link phone-email-link">
                    <span
                      onClick={() => {
                        setPhoneEmailSwap("phone");
                        setEmailID(null);
                        setErroDiv("");
                      }}
                    >
                      {allWords.misc.pages.signup.usephone}
                    </span>
                  </div>
                  <br />
                </div>
              )}

              {/* phone no. field */}
              {phoneEmailSwap === "phone" && (
                <div>
                  <p className="entermailP">{allWords.misc.pages.signup.ph1}</p>
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
                  <div className="phone-link phone-email-link">
                    <span
                      onClick={() => {
                        setPhoneEmailSwap("email");
                        setPhoneNumber(null);
                        setErroDiv("");
                      }}
                    >
                      {allWords.misc.pages.signup.usemail}
                    </span>
                  </div>
                  <br />
                </div>
              )}

              <button
                type="submit"
                className="loginBtn btn primary-btn-blk"
                style={{ fontWeight: "bold", letterSpacing: "2px" }}
              >
                {loading ? (
                  <CircularProgress
                    style={{ color: "#66B984", width: 27, height: 27 }}
                  />
                ) : (
                  "GET OTP"
                )}
              </button>
              <div className="text-center mb-5">
                <small className="alert-text caLine">
                  {allWords.misc.pages.signup.alreadya}
                  <Link to="/login" style={{ textDecoration: "none" }}>
                    <span> Log In</span>
                  </Link>
                </small>
              </div>

              <div className="policyDiv  mb-4">
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
              <span>
                <a
                  style={{ fontWeight: "bold", textDecoration: "none" }}
                  href="mailto: support@khulke.com"
                >
                  support@khulke.com
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
