import { Grid } from "@mui/material";
import axios from "axios";
import { onMessage } from "firebase/messaging";
import React, { useEffect, useRef, useState } from "react";
import TagManager from "react-gtm-module";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { allWords } from "../../../App";
import KhulKeLogo from "../../../assets/icons/KhulKe_logo.svg";
import {
  MEET_UP_BASE_URL,
  REACT_APP_BASE_URL_FOR_USER_V1,
  REACT_APP_VAPID_ID,
  STATIC_TOKEN,
} from "../../../constants/env";
import { messaging } from "../../../push_firebase";
import { notificationsState } from "../../../redux/actions/notificationAction";
import { tokensState } from "../../../redux/actions/notificationAction/token";
import { SENDTYPE } from "../../../utils/Constant";
import { MaskEmailPhone } from "../../../utils/MaskEmailPhone";
import ToastHandler from "../../../utils/ToastHandler";
import { device_info, moengageEvent } from "../../../utils/utils";
import "../style.css";
import logger from "../../../logger";

export default function LogGetOtpComp(props) {
  const { setLoginComp, setSignupComp, setLogGetOtpComp } = props;

  // state
  const [otp_alert, setOTPAlert] = useState(null);
  const [is_valid, setIsValid] = useState(false);
  const [timer, setTimer] = useState("01");
  const [isCrossLimit, setIsCrossLimit] = useState(false);
  const redirectToMeet = localStorage?.getItem("redirectToMeet");

  //Refs
  const Ref = useRef(null);
  const location = useLocation();
  const first = useRef("");
  const second = useRef("");
  const third = useRef("");
  const fourth = useRef("");
  const fiveth = useRef("");
  const sixth = useRef("");
  const resend_ref = useRef("");
  const opt_alert_text = useRef("");

  const dispatch = useDispatch();

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
    let { total, seconds } = getTimeRemaining(e);
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
    const options = {
      body: body,
      icon: { KhulKeLogo },
      dir: "ltr",
    };
    const notification = new Notification("KhulKe", options);
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
        }
      })
      .catch();

    onMessage(messaging, (payload) => {
      //** DUMMY MODEL */
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
      fourth.current.value +
      fiveth.current.value +
      sixth.current.value;

    let data = JSON.stringify({
      device_info: device_info,
      user_type: "LOGIN",
      username: sessionStorage.getItem("username"),
      otp,
    });
    const config = {
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

          gtmEventLogin(res.data.data[0]._id);
          localStorage.setItem("access", res.data.data[0].access);
          localStorage.setItem("refresh", res.data.data[0].refresh);
          if (redirectToMeet === "true") {
            localStorage?.removeItem("redirectToMeet");
            window.location.replace(
              `${MEET_UP_BASE_URL}/?token=${res.data.data[0].access}&redirect_url=${location?.search}`
            );
          }
          window.location.reload();
          firebase_actions();
        }
      })
      .catch((err) => logger.info(err));
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
        "m-2 text-center form-control rounded alrtClass iPbox",
      ]; //Should have alert
      second.current.classList = [
        "m-2 text-center form-control rounded alrtClass iPbox",
      ]; //Should have alert
      third.current.classList = [
        "m-2 text-center form-control rounded alrtClass iPbox",
      ]; //Should have alert
      fourth.current.classList = [
        "m-2 text-center form-control rounded alrtClass iPbox",
      ]; //Should have alert
      fiveth.current.classList = [
        "m-2 text-center form-control rounded alrtClass iPbox",
      ]; //Should have alert
      sixth.current.classList = [
        "m-2 text-center form-control rounded alrtClass iPbox",
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
        "m-2 text-center form-control rounded alrtClass iPbox",
      ]; //Should have alert
      second.current.classList = [
        "m-2 text-center form-control rounded alrtClass iPbox",
      ]; //Should have alert
      third.current.classList = [
        "m-2 text-center form-control rounded alrtClass iPbox",
      ]; //Should have alert
      fourth.current.classList = [
        "m-2 text-center form-control rounded alrtClass iPbox",
      ]; //Should have alert
      fiveth.current.classList = [
        "m-2 text-center form-control rounded alrtClass iPbox",
      ]; //Should have alert
      sixth.current.classList = [
        "m-2 text-center form-control rounded alrtClass iPbox",
      ]; //Should have alert
      setIsValid(false);
      return false;
    } else {
      first.current.classList = ["m-2 text-center form-control rounded iPbox"];
      second.current.classList = ["m-2 text-center form-control rounded iPbox"];
      third.current.classList = ["m-2 text-center form-control rounded iPbox"];
      fourth.current.classList = ["m-2 text-center form-control rounded iPbox"];
      fiveth.current.classList = ["m-2 text-center form-control rounded iPbox"];
      sixth.current.classList = ["m-2 text-center form-control rounded iPbox"];
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
    const config = {
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
      <div className="loginContainer">
        <span className="signUpTitle">{allWords.misc.pages.prelogin.til1}</span>
        <ol className="signUpDesc">
          <li>{allWords.misc.pages.prelogin.til2}</li>
          <li>{allWords.misc.pages.prelogin.til3}</li>
        </ol>
        <form onSubmit={verifyOTP}>
          <div className="otpdivMain">
            <span className="sentoLine">
              OTP sent to
              <span className="usnmInSentLine">
                &nbsp;{" "}
                {sessionStorage.getItem("username") !== getDetailSender.id
                  ? MaskEmailPhone(getDetailSender.id, getDetailSender.type)
                  : sessionStorage.getItem("username")}
              </span>
            </span>
            <div className="col-lg-12 col-md-12 col-sm-12">
              <Grid container direction="row pr-3">
                <Grid
                  item
                  className="inputs d-flex flex-row justify-content-start"
                >
                  <input
                    className="iPbox m-2 text-center form-control rounded"
                    type="text"
                    id="first"
                    maxLength="1"
                    placeholder="0"
                    ref={first}
                    autoFocus={true}
                    onInput={(e) => {
                      if (e.target.value !== "") {
                        second.current.focus();
                      }
                    }}
                    autocomplete="off"
                  />
                  <input
                    className="iPbox m-2 text-center form-control rounded"
                    type="text"
                    id="second"
                    maxLength="1"
                    placeholder="0"
                    ref={second}
                    onInput={(e) => {
                      if (e.target.value !== "") {
                        third.current.focus();
                      }
                    }}
                    autocomplete="off"
                  />
                  <input
                    className="iPbox m-2 text-center form-control rounded"
                    type="text"
                    id="third"
                    maxLength="1"
                    placeholder="0"
                    ref={third}
                    onInput={(e) => {
                      if (e.target.value !== "") {
                        fourth.current.focus();
                      }
                    }}
                    autocomplete="off"
                  />
                  <input
                    className="iPbox m-2 text-center form-control rounded"
                    type="text"
                    id="fourth"
                    maxLength="1"
                    placeholder="0"
                    onInput={(e) => {
                      if (e.target.value !== "") {
                        fiveth.current.focus();
                      }
                    }}
                    ref={fourth}
                    autocomplete="off"
                  />
                   <input
                    className="iPbox m-2 text-center form-control rounded"
                    type="text"
                    id="fiveth"
                    maxLength="1"
                    placeholder="0"
                    ref={fiveth}
                    onInput={(e) => {
                      if (e.target.value !== "") {
                        sixth.current.focus();
                      }
                    }}
                    autocomplete="off"
                  />
                  <input
                    className="iPbox m-2 text-center form-control rounded"
                    type="text"
                    id="sixth"
                    maxLength="1"
                    placeholder="0"
                    onInput={check_valid}
                    ref={sixth}
                    autocomplete="off"
                  />
                </Grid>
              </Grid>
              <div className="row">
                {otp_alert && (
                  <small ref={opt_alert_text} className="warn-text errorDivotp">
                    {otp_alert}
                  </small>
                )}

                <div className="otpContainer">
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
                      <div className="resendOtpMessage">
                        {isCrossLimit ? (
                          <small className="erorPhonmailindex">
                            {allWords.otpLimitMsg}
                          </small>
                        ) : (
                          <small>
                            Didn't receive the OTP?&nbsp;Resend in {timer} sec
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
                ? `logUp_btn login_btn btn primary-btn-blk login-primary-button`
                : "logUp_btn login_btn disabled-button btn primary-btn-blk"
            }
          >
            Login
          </button>

          <div className="text-center mb-5">
            <small className="alert-text ca">
              New User?
              <span
                onClick={() => {
                  setSignupComp(true);
                  setLoginComp(false);
                  setLogGetOtpComp(false);
                }}
                className="cursorPointer"
              >
                {" "}
                Create an Account
              </span>
            </small>
            <br />
          </div>
        </form>
      </div>
    </>
  );
}
