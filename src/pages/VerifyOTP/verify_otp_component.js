import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Timeline from "../../components/Timeline";
import Disclaimer from "../../components/Disclaimer";
import Khulkelogo from "../../assets/icons/KhulKe_logo.svg";
import { REACT_APP_BASE_URL_FOR_USER, STATIC_TOKEN } from "../../constants/env";
import { Grid } from "@mui/material";
import "./style.css";
import TagManager from "react-gtm-module";

const VerifyOTP = () => {
  // useEffect(() => {
  //   if (
  //     !sessionStorage.getItem("step-1-email") &&
  //     !sessionStorage.getItem("step-1-phone")
  //   ) {
  //     window.location.replace("/step-1");
  //   } else if (sessionStorage.getItem("verification_obj")) {
  //     window.location.replace("/step-3");
  //   }
  // }, []);
  const Ref = useRef(null);
  //Refs
  const first = useRef("");
  const second = useRef("");
  const third = useRef("");
  const fourth = useRef("");
  const resend_ref = useRef("");

  const [timer, setTimer] = useState("01");

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
  // useEffect(() => {
  //   if (timer === "00:00:00") {
  //     resend_ref.current.classList = [""];
  //   } else {
  //     resend_ref.current.classList = ["disabled-button"];
  //   }
  // }, [timer]);

  const onClickReset = () => {
    clearTimer(getDeadTime());
  };
  const clearOTPfields = () => {
    first.current.value = "";
    second.current.value = "";
    third.current.value = "";
    fourth.current.value = "";
  };

  // Verify Otp
  const [is_valid, setIsValid] = useState(false);
  const [otp_alert, setOTPAlert] = useState("");
  const opt_alert_text = useRef("");

  const check_valid = (force = true) => {
    if (!force) {
      first.current.classList = ["m-2 text-center form-control rounded"]; //Should have alert
      second.current.classList = ["m-2 text-center form-control rounded"]; //Should have alert
      third.current.classList = ["m-2 text-center form-control rounded"]; //Should have alert
      fourth.current.classList = ["m-2 text-center form-control rounded"]; //Should have alert
      setOTPAlert("OTP entered was invalid!");
      clearOTPfields();
      opt_alert_text.current.classList = ["warn-text"];
      return false;
    }
    if (
      first.current.value === "" ||
      second.current.value === "" ||
      third.current.value === "" ||
      fourth.current.value === ""
    ) {
      first.current.classList = ["m-2 text-center form-control rounded"]; //Should have alert
      second.current.classList = ["m-2 text-center form-control rounded"]; //Should have alert
      third.current.classList = ["m-2 text-center form-control rounded"]; //Should have alert
      fourth.current.classList = ["m-2 text-center form-control rounded"]; //Should have alert
      setIsValid(false);
      return false;
    } else {
      first.current.classList = ["m-2 text-center form-control rounded"];
      second.current.classList = ["m-2 text-center form-control rounded"];
      third.current.classList = ["m-2 text-center form-control rounded"];
      fourth.current.classList = ["m-2 text-center form-control rounded"];
      setIsValid(true);
      return true;
    }
  };

  const verifyOTP = async () => {
    if (!check_valid) {
      return;
    }
    let email = sessionStorage.getItem("step-1-email");
    let phone_number = sessionStorage.getItem("step-1-phone");
    let otp =
      first.current.value +
      second.current.value +
      third.current.value +
      fourth.current.value;
    let url = `${REACT_APP_BASE_URL_FOR_USER}`;
    let data = {};
    if (email != "") {
      url = url + "/verify-email-otp/";
      data = JSON.stringify({ email, otp });
    } else if (phone_number != "") {
      url = url + "/verify-phone-otp/";
      data = JSON.stringify({ phone_number, otp });
    }
    var config = {
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Authorization: STATIC_TOKEN,
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        if (response.status === 253) {
          check_valid(false);
          clearOTPfields();
        } else if (response.status === 200) {
          sessionStorage.setItem(
            "verification_obj",
            JSON.stringify(response.data["data"])
          );
          navigate("/step-3");
        } else if (response.status === 252) {
          if (
            response.data["message"] ===
            "Verification attempt exceeded. Please try after sometime"
          ) {
            setOTPAlert(
              "Verification attempt exceeded. Please try after sometime"
            );
          } else if (response.data["message"] === "Invalid OTP") {
            check_valid(false);
          }
          clearOTPfields();
        }
      })
      .catch(function (error) {
        clearOTPfields();
      });
  };

  const navigate = useNavigate();
  useEffect(() => {
    const age = sessionStorage.getItem("age");
    const verificationObj = sessionStorage.getItem("verification_obj");
    if (verificationObj && age) return navigate("step-3");

    if (age) return;
    navigate("/step-1");
  }, []);

  const sendOTP = async () => {
    onClickReset();
    let url = `${REACT_APP_BASE_URL_FOR_USER}/`;
    let data = {};
    let sess_email = sessionStorage.getItem("step-1-email");
    let sess_phone = sessionStorage.getItem("step-1-phone");
    if (sess_phone !== "") {
      let phone_number = sess_phone;
      url = url + `send-otp-phone/`;
      data = JSON.stringify({ phone_number });
    } else if (sess_email !== "") {
      url = url + `send-otp-email/`;
      data = JSON.stringify({ email: sess_email, r_type: "register" });
    } else {
      return false;
    }

    var config = {
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Authorization: STATIC_TOKEN,
      },
      data: data,
    };

    await axios(config).then().catch();
  };

  // gtm events
  function gtmEvent3() {
    TagManager.dataLayer({
      dataLayer: {
        event: "sign-up event",
        category: "Sign-up",
        action: "Step2",
        label: "otp",
      },
    });
  }

  return (
    <div className="col-sm-12 col-md-6 col-lg-6 order-first order-md-second order-lg-1">
      <div className="row mb-2 col-sm-12 col-md-9 col-lg-9">
        <div className="col-sm-6 col-md-6 col-lg-6 mb-3">
          <img
            src={Khulkelogo}
            style={{ height: "9rem" }}
            className="img-fluid"
            alt="KhulKe Logo"
          />
        </div>
        <Timeline
          status={{
            "step-1": "completed",
            "step-2": "current",
            "step-3": "incomplete",
            "step-4": "incomplete",
          }}
        />
      </div>
      <h1 className="primary-heading">Verify</h1>
      <p className="text-muted-dark">Enter verification code</p> <br />
      <div className="col-lg-9 col-md-9 col-sm-12">
        <Grid container direction="row pr-3">
          <Grid item className="inputs d-flex flex-row justify-content-start">
            <input
              className="m-2 text-center form-control rounded"
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
            />
            <input
              className="m-2 text-center form-control rounded"
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
            />
            <input
              className="m-2 text-center form-control rounded"
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
            />
            <input
              className="m-2 text-center form-control rounded"
              type="text"
              id="fourth"
              maxLength="1"
              placeholder="0"
              onInput={check_valid}
              ref={fourth}
            />
          </Grid>
        </Grid>
        <br />

        <div className="row">
          <div className="d-flex justify-content-between">
            {timer === "00" ? (
              <>
                <small className="timer">&nbsp; &nbsp;</small>

                <small>
                  <Link
                    to="#"
                    onClick={sendOTP}
                    ref={resend_ref}
                    // className="disabled-button"
                  >
                    Resend Code
                  </Link>
                </small>
              </>
            ) : (
              <>
                <small className="timer">
                  You can resend verification code in {timer} seconds
                </small>

                <small>&nbsp; &nbsp;</small>
              </>
            )}
          </div>
        </div>
        <br />

        <small ref={opt_alert_text} className="warn-text">
          {otp_alert}
        </small>

        <br />
        <Disclaimer origin_url={window.location.href} />
        <div>
          <button
            // onClick={verifyOTP}
            onClick={() => {
              verifyOTP();
              gtmEvent3();
            }}
            className={
              is_valid
                ? `btn primary-btn-blk`
                : "disabled-button btn primary-btn-blk"
            }
          >
            CONTINUE
          </button>
        </div>
        <div className="text-center mb-5">
          <small className="alert-text">
            Already a User? <Link to="/">Login</Link>
          </small>
        </div>
      </div>
    </div>
  );
};
export default VerifyOTP;
