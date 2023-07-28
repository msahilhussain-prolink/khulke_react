import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  // REACT_APP_BASE_URL,
  REACT_APP_BASE_URL_FOR_USER_V1,
  REACT_APP_VAPID_ID,
  STATIC_TOKEN,
} from "../../../constants/env";
import "../Login2/index.css";
// Assets
import { Grid } from "@mui/material";
import { onMessage } from "firebase/messaging";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { allWords } from "../../../App";
import signup2 from "../../../assets/gif/signup2.gif";
import KhulKeLogo from "../../../assets/icons/KhulKe_logo.svg";
import logo from "../../../assets/images/logo.svg";
import { metaData } from "../../../constants/StaticPagesMetaTags";
import logger from "../../../logger";
import { messaging } from "../../../push_firebase";
import { notificationsState } from "../../../redux/actions/notificationAction";
import { tokensState } from "../../../redux/actions/notificationAction/token";
import { MetaTagsGenerator } from "../../../utils/MetaTagsGenerator";
import ToastHandler from "../../../utils/ToastHandler";
import { device_info, moengageEvent } from "../../../utils/utils";

export default function Signup22() {
  // State
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState("01");
  const [otp_alert, setOTPAlert] = useState(null);
  const [is_valid, setIsValid] = useState(false);
  const [otpSentLine, setOtpSentLine] = useState("");
  const [country_name, setCountryName] = useState("India");
  const [city_name, setCityName] = useState("Mumbai");

  // vars
  const navigate = useNavigate();
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("current_user"))) {
      window.history.back(0);
    }
  }, []);

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
      fourth.current.value +
      fiveth.current.value +
      sixth.current.value;

    let data = {};
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (sessionStorage.getItem("signupUsername").match(regexEmail)) {
      data = JSON.stringify({
        user_type: "REGISTER",
        email: sessionStorage.getItem("signupUsername"),
        otp,
      });
    } else {
      data = JSON.stringify({
        device_info: device_info,
        user_type: "REGISTER",
        phone_number: sessionStorage.getItem("signupUsername"),
        country_code: "+91",
        otp,
      });
    }
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
        }
        if (res.status === 200) {
          clearOTPfields();
          setOTPAlert("");
          localStorage.removeItem("anonymous_user");
          localStorage.removeItem("joined_rt");
          localStorage.setItem(
            "current_user",
            JSON.stringify(res.data.data[0])
          );
          localStorage.setItem("access", res.data.data[0].access);
          localStorage.setItem("refresh", res.data.data[0].refresh);
          sessionStorage.setItem("showWelcome", true);
          navigate("/welcome");
          firebase_actions();

          window.Moengage?.add_unique_user_id(res?.data?.data?.[0]?.["_id"]);
          window.Moengage?.add_first_name(res?.data?.data?.[0]?.["name"]);
          window.Moengage?.add_user_name(res?.data?.data?.[0]?.["username"]);
          window.Moengage?.add_email(res?.data?.data?.[0]?.["email"]);
          window.Moengage?.add_mobile(res?.data?.data?.[0]?.["phone_number"]);
          let moe = {};
          if (sessionStorage.getItem("signupUsername").match(regexEmail)) {
            moe = {
              Email: sessionStorage.getItem("signupUsername"),
            };
          } else {
            moe = {
              "Mobile Number": sessionStorage.getItem("signupUsername"),
            };
          }
          moe["CreationDate"] = new Date();
          moe["Username"] = res?.data?.data?.[0]?.["username"];
          moe["Name"] = res?.data?.data?.[0]?.["name"];
          moengageEvent("Signup", "User", moe);
        }
      })
      .catch((err) => logger.error(err));
  }

  const clearOTPfields = () => {
    first.current.value = "";
    second.current.value = "";
    third.current.value = "";
    fourth.current.value = "";
    fiveth.current.value = "";
    sixth.current.value = "";
  };
  const onClickReset = () => {
    clearTimer(getDeadTime());
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
    let data = {};
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (sessionStorage.getItem("signupUsername").match(regexEmail)) {
      data = JSON.stringify({
        user_type: "REGISTER",
        email: sessionStorage.getItem("signupUsername"),
      });
    } else {
      data = JSON.stringify({
        user_type: "REGISTER",
        phone_number: sessionStorage.getItem("signupUsername"),
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
    const res = await axios(config);
    if (res.status === 200) {
      ToastHandler("sus", "OTP sent.");
    }
  }

  let emailRegex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
  let phoneRegex = new RegExp(
    "^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$"
  );

  const getCountryCode = async () => {
    axios
      .get("https://ipapi.co/json/")
      .then((response) => {
        setCountryName(response.data.country_name);
        setCityName(response.data.city);
      })
      .catch();
  };

  // Effects
  useEffect(() => {
    if (emailRegex.test(sessionStorage.getItem("signupUsername"))) {
      setOtpSentLine(
        `OTP has been sent to ${sessionStorage.getItem("signupUsername")}`
      );
    } else if (phoneRegex.test(sessionStorage.getItem("signupUsername"))) {
      setOtpSentLine(
        `OTP has been sent to ${sessionStorage.getItem("signupUsername")}`
      );
    } else {
      setOtpSentLine(
        `OTP has been sent to your registered Email Id/ Mobile Number`
      );
    }

    getCountryCode();
  }, []);

  return (
    <>
      <MetaTagsGenerator metaTags={metaData["signup/otp"]} />
      <div className="main">
        <h1 id="page-title" style={{ display: "none" }}>
          {allWords.misc.pages.signup.sup}
        </h1>
        <div className="left">
          <div className="lcont">
            <img src={logo} alt="logo" />
            <h2 className="heading">{allWords.misc.pages.login.pp21}</h2>
            <img
              className="custom-gif"
              src={signup2}
              alt="login gif"
              width="auto"
              height="430"
              style={{ objecFit: "cover" }}
            />
          </div>
        </div>
        <div className="right">
          <div className="formDiv">
            <form onSubmit={verifyOTP}>
              <p className="loginp">{allWords.misc.pages.signup.enterotp}</p>
              <div className="otpdivMain">
                <span className="sentoLine">{otpSentLine}</span>
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <Grid container direction="row pr-3">
                    <Grid
                      item
                      className="inputs d-flex flex-row justify-content-start"
                    >
                      <input
                        className="m-2 text-center form-control rounded ibox"
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
                        className="m-2 text-center form-control rounded ibox"
                        type="text"
                        id="second"
                        maxLength="1"
                        placeholder="0"
                        autoComplete={false}
                        ref={second}
                        onInput={(e) => {
                          if (e.target.value !== "") {
                            third.current.focus();
                          }
                        }}
                      />
                      <input
                        className="m-2 text-center form-control rounded ibox"
                        type="text"
                        id="third"
                        maxLength="1"
                        placeholder="0"
                        autoComplete={false}
                        ref={third}
                        onInput={(e) => {
                          if (e.target.value !== "") {
                            fourth.current.focus();
                          }
                        }}
                      />
                      <input
                        className="m-2 text-center form-control rounded ibox"
                        type="text"
                        id="fourth"
                        maxLength="1"
                        placeholder="0"
                        autoComplete={false}
                        onInput={(e) => {
                          if (e.target.value !== "") {
                            fiveth.current.focus();
                          }
                        }}                       
                        ref={fourth}
                      />
                      <input
                        className="m-2 text-center form-control rounded ibox"
                        type="text"
                        id="fiveth"
                        maxLength="1"
                        placeholder="0"
                        autoComplete={false}
                        ref={fiveth}
                        onInput={(e) => {
                          if (e.target.value !== "") {
                            sixth.current.focus();
                          }
                        }}
                      />
                      <input
                        className="m-2 text-center form-control rounded ibox"
                        type="text"
                        id="sixth"
                        maxLength="1"
                        placeholder="0"
                        autoComplete={false}
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
                            {allWords.misc.pages.signup.resend}
                          </Link>
                        ) : (
                          <div>
                            <small>
                              Didn't receive the OTP?&nbsp;Resend in {timer} sec
                            </small>
                          </div>
                        )}
                      </>
                    </div>
                  </div>
                  <br />
                </div>
              </div>
              <div
                className="buttonCont"
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <button
                  type="submit"
                  style={{
                    width: "95%",
                  }}
                  className={
                    is_valid
                      ? `btn primary-btn-blk`
                      : "disabled-button btn primary-btn-blk"
                  }
                >
                  {allWords.misc.pages.signup.siuptitle}
                </button>
              </div>
              <div className="text-center mb-5">
                <small className="alert-text caLine">
                  {allWords.misc.pages.signup.alreadya}
                  <Link to="/login" style={{ textDecoration: "none" }}>
                    <span> Log In</span>
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
