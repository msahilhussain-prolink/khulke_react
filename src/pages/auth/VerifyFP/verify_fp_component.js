import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Khulkelogo from "../../../assets/icons/KhulKe_logo.svg";
import {
  REACT_APP_BASE_URL,
  REACT_APP_BASE_URL_FOR_USER,
  STATIC_TOKEN,
} from "../../../constants/env";
import { Grid } from "@mui/material";
import "./style.css";

const VerifyFP = () => {
  //Timer
  const [timer, setTimer] = useState("01");
  const [otp_alert, setOTPAlert] = useState("");
  const opt_alert_text = useRef("");
  const [is_valid, setIsValid] = useState(false);
  const Ref = useRef(null);

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

  //Refs
  const first = useRef("");
  const second = useRef("");
  const third = useRef("");
  const fourth = useRef("");
  const resend_ref = useRef("");

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
    let temp = sessionStorage.getItem("fp_username").split("|");
    let otp =
      first.current.value +
      second.current.value +
      third.current.value +
      fourth.current.value;
    let url = `${REACT_APP_BASE_URL_FOR_USER}`;
    let data = {};
    let validPhone = REACT_APP_BASE_URL.includes("perf")
      ? /^([0|\+[0-9]{1,5})?([1-9][0-9]{9})$/
      : /^([0|\+[0-9]{1,5})?([6-9][0-9]{9})$/;
    let phone = temp[1];

    if (validPhone.test(phone)) {
      if (phone.length === 10) {
        phone = "+91" + phone;
      } else if (phone.length !== 10) {
        if (phone.length > 10) {
          if (phone[0] === "+" || phone[0] === "9") {
            const code = phone.slice(0, phone.length - 10);
            if (code === "+91" || code === "91") {
              phone = temp[1];
            }
          }
        }
      }
    }
    if (temp[0] === "email") {
      url = url + "/verify-email-otp/";
      data = JSON.stringify({ email: temp[1], otp: otp });
    } else if (temp[0] === "phone") {
      url = url + "/verify-phone-otp/";
      data = JSON.stringify({ phone_number: phone, otp: otp });
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
          window.location.replace("/password_reset");
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

  const sendOTP = async () => {
    onClickReset();
    let url = `${REACT_APP_BASE_URL_FOR_USER}/`;
    let data = {};
    let temp = sessionStorage.getItem("fp_username").split("|");
    if (temp[0] === "phone") {
      let phone_number = temp[1];
      url = url + `send-otp-phone/`;
      data = JSON.stringify({ phone_number });
    } else if (temp[0] === "email") {
      url = url + `send-otp-email/`;
      data = JSON.stringify({ email: temp[1], r_type: "password" });
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

  return (
    <div className="col-sm-12 col-md-6 col-lg-6 order-first order-md-second order-lg-1">
      <div className="row mb-2 col-sm-12 col-md-9 col-lg-9">
        <div className="col-sm-6 col-md-6 col-lg-6">
          <img src={Khulkelogo} className="img-fluid" alt="KhulKe Logo" />
        </div>
      </div>
      <h1 className="primary-heading">Verify.</h1>
      <p className="text-muted-dark">Enter your verification code</p> <br />
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
              onInput={check_valid}
              type="text"
              id="fourth"
              maxLength="1"
              placeholder="0"
              ref={fourth}
            />
          </Grid>
        </Grid>
        <br />

        <div className="row">
          <div className="d-flex justify-content-between px-3">
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
        <small ref={opt_alert_text} className="warn-text">
          {otp_alert}
        </small>
        <br />
        <div>
          <button
            onClick={verifyOTP}
            className={
              is_valid
                ? `btn primary-btn-blk`
                : "disabled-button btn primary-btn-blk"
            }
          >
            CONTINUE
          </button>
        </div>
        <div className="text-center">
          <small className="alert-text">
            Already a User? <Link to="/">Login</Link>
          </small>
        </div>
      </div>
    </div>
  );
};
export default VerifyFP;
