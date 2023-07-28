import { Grid } from "@mui/material";
import axios from "axios";
import { onMessage } from "firebase/messaging";
import React, { useEffect, useRef, useState } from "react";
import TagManager from "react-gtm-module";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import login2 from "../../../assets/gif/login2.gif";
import KhulKeLogo from "../../../assets/icons/KhulKe_logo.svg";
import logo from "../../../assets/images/logo.svg";
import {
  REACT_APP_BASE_URL_FOR_USER_V1,
  REACT_APP_VAPID_ID,
  STATIC_TOKEN,
} from "../../../constants/env";
import { metaData } from "../../../constants/StaticPagesMetaTags";
import { messaging } from "../../../push_firebase";
import { notificationsState } from "../../../redux/actions/notificationAction";
import { tokensState } from "../../../redux/actions/notificationAction/token";
import { SENDTYPE } from "../../../utils/Constant";
import { MetaTagsGenerator } from "../../../utils/MetaTagsGenerator";
import ToastHandler from "../../../utils/ToastHandler";
import { device_info, moengageEvent } from "../../../utils/utils";
import "./index.css";

import { allWords } from "../../../App";
import logger from "../../../logger";
export default function Logino() {
  // var
  const navigate = useNavigate();
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("current_user"))) {
      navigate("/home");
    }
    // return () => {  }
  }, []);

  // state
  const [loading, setLoading] = useState(false);
  const [otp_alert, setOTPAlert] = useState(null);
  const [is_valid, setIsValid] = useState(false);
  const [timer, setTimer] = useState("01");
  const [isCrossLimit, setIsCrossLimit] = useState(false);

  //Refs
  const Ref = useRef(null);
  const first = useRef("");
  const second = useRef("");
  const third = useRef("");
  const fourth = useRef("");
  const fiveth = useRef("");
  const sixth = useRef("");
  const resend_ref = useRef("");
  const opt_alert_text = useRef("");

  const dispatch = useDispatch();

  // moen State
  const [country_code, setCountryCode] = useState("+91");
  const [country_name, setCountryName] = useState("India");
  const [city_name, setCityName] = useState("Mumbai");

  const getCountryCode = async () => {
    axios
      .get("https://ipapi.co/json/")
      .then((response) => {
        setCountryCode(response.data.country_calling_code);
        setCountryName(response.data.country_name);
        setCityName(response.data.city);
      })
      .catch();
  };

  useEffect(() => {
    getCountryCode();
  }, []);

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor(((total / 1000) * 60 * 60) % 24);
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  };

  const startTimer = (e) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(seconds > 9 ? seconds : "0" + seconds);
    }
  };

  const clearTimer = (e) => {
    setTimer("30");
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 30);
    return deadline;
  };
  const onClickReset = () => {
    clearTimer(getDeadTime());
  };

  useEffect(() => {
    clearTimer(getDeadTime());
    return () => {
      if (Ref.current) clearInterval(Ref.current);
    };
  }, []);

  function showNotification(body) {
    var options = {
      body: body,
      icon: { KhulKeLogo },
      dir: "ltr",
    };
    var notification = new Notification("KhulKe", options);
  }

  function firebase_actions() {
    //FOR PUSH NOTIFICATIONS

    if (!messaging) return;
    messaging
      .getToken({ vapidKey: REACT_APP_VAPID_ID })
      .then((currentToken) => {
        let current_user = localStorage.current_user;
        if (!current_user) return;
        current_user = JSON.parse(current_user);
        let data = {
          access: current_user["access"],
          action: "save",
          token: currentToken,
        };
        if (currentToken) {
          if (localStorage.current_user) {
            let device_ids = current_user["device_ids"] || null;
            if (device_ids) {
              if (device_ids.length > 0) {
                let temp = [];
                device_ids.forEach((item) => {
                  temp.push(item["firebase_token"]);
                });
                if (!temp.includes(currentToken)) {
                  dispatch(tokensState(data));
                }
              }
            } else {
              dispatch(tokensState(data));
            }
          }
        } else {
        }
      })
      .catch();

    onMessage(messaging, (payload) => {
      let notification_body = payload.data.data;
      showNotification(JSON.parse(notification_body)["body"]["message"]);
      let data = {
        notification: JSON.parse(notification_body)["body"]["message"],
      };
      dispatch(notificationsState(data));
    });
  }

  // handlers
  async function verifyOTP(e) {
    e.preventDefault();
    if (!check_valid) {
      return;
    }
    let otp =
      first.current.value +
      second.current.value +
      third.current.value +
      fourth.current.value + fiveth.current.value +
      sixth.current.value;

    let data = JSON.stringify({
      device_info: device_info,
      user_type: "LOGIN",
      username: sessionStorage.getItem("username"),
      otp,
    });
    var config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER_V1}/auth/verify-otp`,
      headers: {
        "Content-Type": "application/json",
        Authorization: STATIC_TOKEN,
      },
      data,
    };
    await axios(config)
      .then((res) => {
        if (res.status === 253) {
          check_valid(false);
          clearOTPfields();
          setOTPAlert(res.data.message);
        } else if (res.status === 200) {
          clearOTPfields();
          setOTPAlert("");
          localStorage.removeItem("anonymous_user");
          localStorage.removeItem("joined_rt");
          localStorage.setItem(
            "current_user",
            JSON.stringify(res.data.data[0])
          );
          window.Moengage?.add_unique_user_id(res.data.data[0]["_id"]);
          window.Moengage?.add_user_name(res.data.data[0]["username"]);
          window.Moengage?.add_first_name(
            res.data.data[0]["name"] ? res.data.data[0]["name"] : ""
          );
          window.Moengage?.add_email(res.data.data[0]["email"]);
          window.Moengage?.add_mobile(
            res.data.data[0]["phone_number"]
              ? res.data.data[0]["phone_number"]
              : ""
          );

          let data = { Username: res?.data?.data?.[0]?.["username"] };
          if (res?.data?.data?.[0]?.["email"]) {
            data["Email"] = res.data.data[0]["email"];
          }

          if (res.data.data[0]["phone_number"]) {
            data["Mobile Number"] = res?.data?.data?.[0]?.["phone_number"];
          }

          moengageEvent("Login", "User", data);
          if (res.data.data[0].is_deactivated.flag == 1) {
            localStorage.setItem("access", res.data.data[0].access);
            localStorage.setItem("refresh", res.data.data[0].refresh);
            navigate(
              { pathname: "/reactivate" },
              {
                state: {
                  date: res.data.data[0].is_deactivated.timestamp,
                },
              }
            );
          } else {
            gtmEventLogin(res.data.data[0]._id);
            localStorage.setItem("access", res.data.data[0].access);
            localStorage.setItem("refresh", res.data.data[0].refresh);
            navigate("/home");
            firebase_actions();
          }
        }
      })
      .catch((err) => logger.error(err));
  }

  function gtmEventLogin(id) {
    TagManager.dataLayer({
      dataLayer: {
        event: "Login event",
        category: "Login",
        action: "click",
        label: "success",
        userID: id,
      },
    });
  }
  const clearOTPfields = () => {
    first.current.value = "";
    second.current.value = "";
    third.current.value = "";
    fourth.current.value = "";
    fiveth.current.value = "";
    sixth.current.value = "";
  };
  const check_valid = (force = true) => {
    if (!force) {
      first.current.classList = [
        "m-2 text-center form-control rounded alrtClass ibox",
      ]; //Should have alert
      second.current.classList = [
        "m-2 text-center form-control rounded alrtClass ibox",
      ]; //Should have alert
      third.current.classList = [
        "m-2 text-center form-control rounded alrtClass ibox",
      ]; //Should have alert
      fourth.current.classList = [
        "m-2 text-center form-control rounded alrtClass ibox",
      ]; //Should have alert
      fiveth.current.classList = [
        "m-2 text-center form-control rounded alrtClass ibox",
      ]; //Should have alert
      sixth.current.classList = [
        "m-2 text-center form-control rounded alrtClass ibox",
      ]; //Should have alert
      setOTPAlert("OTP entered was invalid!");
      clearOTPfields();
      opt_alert_text.current.classList = ["warn-text errorDivotp"];
      return false;
    }
    if (
      first.current.value === "" ||
      second.current.value === "" ||
      third.current.value === "" ||
      fourth.current.value === "" ||
      fiveth.current.value === "" ||
      sixth.current.value === ""
    ) {
      first.current.classList = [
        "m-2 text-center form-control rounded alrtClass ibox",
      ]; //Should have alert
      second.current.classList = [
        "m-2 text-center form-control rounded alrtClass ibox",
      ]; //Should have alert
      third.current.classList = [
        "m-2 text-center form-control rounded alrtClass ibox",
      ]; //Should have alert
      fourth.current.classList = [
        "m-2 text-center form-control rounded alrtClass ibox",
      ]; //Should have alert
      fiveth.current.classList = [
        "m-2 text-center form-control rounded alrtClass ibox",
      ]; //Should have alert
      sixth.current.classList = [
        "m-2 text-center form-control rounded alrtClass ibox",
      ]; //Should have alert
      setIsValid(false);
      // setOTPAlert("OTP should contain 4 numbers");
      return false;
    } else {
      first.current.classList = ["m-2 text-center form-control rounded ibox"];
      second.current.classList = ["m-2 text-center form-control rounded ibox"];
      third.current.classList = ["m-2 text-center form-control rounded ibox"];
      fourth.current.classList = ["m-2 text-center form-control rounded ibox"];
      fiveth.current.classList = ["m-2 text-center form-control rounded ibox"];
      sixth.current.classList = ["m-2 text-center form-control rounded ibox"];
      setIsValid(true);
      setOTPAlert("");
      return true;
    }
  };
  async function sendOTP() {
    onClickReset();
    let data = JSON.stringify({
      user_type: "LOGIN",
      username: sessionStorage.getItem("username"),
    });
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
        if (res.status === 200) {
          ToastHandler("sus", "OTP sent.");
        }
      })
      .catch((err) => {
        if (err.response.status === 429) {
          setIsCrossLimit(true);
        }
      });
  }
  // useEffect(() => {
  //   if (localStorage.getItem("access")) {
  //     window.location.replace("home");
  //   }
  // }, []);
  const getDetailSender = JSON.parse(sessionStorage.getItem("emailorphone"))[
    SENDTYPE.EMAIL
  ]
    ? {
        id: JSON.parse(sessionStorage.getItem("emailorphone"))[SENDTYPE.EMAIL],
        type: SENDTYPE.EMAIL,
      }
    : {
        id: JSON.parse(sessionStorage.getItem("emailorphone"))[
          SENDTYPE.PHONENUMBER
        ],
        type: SENDTYPE.PHONENUMBER,
      };

  return (
    <>
      <MetaTagsGenerator metaTags={metaData["login/otp"]} />
      <div className="main">
        <h1 id="page-title" style={{ display: "none" }}>
          Log In - Khul Ke - Social Networking PLatform
        </h1>
        <div className="left">
          <div className="lcont">
            <img src={logo} alt="logo" />
            <h2 className="heading">{allWords.misc.pages.login.pp21}</h2>
            <img
              src={login2}
              alt="login gif"
              width="auto"
              height="450"
              style={{ objecFit: "cover" }}
            />
          </div>
        </div>
        <div className="right">
          <div className="formDiv">
            <form onSubmit={verifyOTP}>
              <p className="loginp">{allWords.misc.pages.signup.enterotp}</p>

              <div className="otpdivMain">
                <span className="sentoLine">
                  {/* {otpSentLine} */}
                  OTP sent to
                  <span className="usnmInSentLine">
                    {sessionStorage.getItem("username")}
                  </span>
                </span>
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <Grid container direction="row pr-3">
                    <Grid
                      item
                      className="inputs d-flex flex-row justify-content-start"
                    >
                      <input
                        className="ibox m-2 text-center form-control rounded"
                        type="text"
                        id="first"
                        autoComplete="off"
                        maxLength="1"
                        placeholder="0"
                        ref={first}
                        autoFocus={true}
                        onInput={(e) => {
                          if (e.target.value !== "") {
                            second.current.focus();
                          }
                        }}
                      />
                      <input
                        className="ibox m-2 text-center form-control rounded"
                        type="text"
                        id="second"
                        autoComplete="off"
                        maxLength="1"
                        placeholder="0"
                        ref={second}
                        onInput={(e) => {
                          if (e.target.value !== "") {
                            third.current.focus();
                          }
                        }}
                      />
                      <input
                        className="ibox m-2 text-center form-control rounded"
                        type="text"
                        id="third"
                        autoComplete="off"
                        maxLength="1"
                        placeholder="0"
                        ref={third}
                        onInput={(e) => {
                          if (e.target.value !== "") {
                            fourth.current.focus();
                          }
                        }}
                      />
                      <input
                        className="ibox m-2 text-center form-control rounded"
                        type="text"
                        id="fourth"
                        maxLength="1"
                        autoComplete="off"
                        placeholder="0"
                        onInput={(e) => {
                          if (e.target.value !== "") {
                            fiveth.current.focus();
                          }
                        }}
                        ref={fourth}
                      />
                           <input
                        className="ibox m-2 text-center form-control rounded"
                        type="text"
                        id="fiveth"
                        autoComplete="off"
                        maxLength="1"
                        placeholder="0"
                        ref={fiveth}
                        onInput={(e) => {
                          if (e.target.value !== "") {
                            sixth.current.focus();
                          }
                        }}
                      />
                      <input
                        className="ibox m-2 text-center form-control rounded"
                        type="text"
                        id="sixth"
                        maxLength="1"
                        autoComplete="off"
                        placeholder="0"
                        onInput={check_valid}
                        ref={sixth}
                      />
                    </Grid>
                  </Grid>
                  <div className="row">
                    {otp_alert && (
                      <small
                        ref={opt_alert_text}
                        className="warn-text errorDivotp"
                      >
                        {otp_alert}
                      </small>
                    )}

                    <div
                      style={{
                        textAlign: "end",
                        paddingRight: "20px",
                        marginTop: "1rem",
                      }}
                    >
                      <>
                        {timer === "00" ? (
                          <Link
                            to="#"
                            style={{
                              pointerEvents: timer == "00" ? "" : "none",
                            }}
                            onClick={sendOTP}
                            ref={resend_ref}
                            disabled={timer !== "00" ? true : false}
                          >
                            {allWords.misc.pages.signup.enterotp}
                          </Link>
                        ) : (
                          <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                            {isCrossLimit ? (
                              <small className="erorPhonmailindex">
                                {allWords.otpLimitMsg}
                              </small>
                            ) : (
                              <small>
                                Didn't receive the OTP?&nbsp;Resend in {timer}{" "}
                                sec
                              </small>
                            )}
                          </div>
                        )}
                      </>
                    </div>
                  </div>
                  <br />
                </div>
              </div>

              <button
                type="submit"
                className={
                  is_valid
                    ? `btn primary-btn-blk login-primary-button`
                    : "disabled-button btn primary-btn-blk"
                }
              >
                Login
              </button>

              <div className="text-center mb-5">
                <small className="alert-text caLine">
                  New User?
                  <Link to="/signup" style={{ textDecoration: "none" }}>
                    <span> Create an Account</span>
                  </Link>
                </small>
                <br />
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
