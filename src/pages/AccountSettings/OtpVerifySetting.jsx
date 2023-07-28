import { Grid } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { allWords } from "../../App";
import AccountLeftSideBar from "../../components/AccountLeftsideBar";
import SettingsHeader from "../../components/SettingsHeader";
import {
  REACT_APP_BASE_URL_FOR_USER_V1,
  STATIC_TOKEN,
} from "../../constants/env.js";
import logger from "../../logger";
import ToastHandler from "../../utils/ToastHandler";
import { device_info } from "../../utils/utils";
import DeactiveModal from "./DeactiveModal";
import { LeftDiv } from "./style";
import "./style.css";

export default function OtpVerifySetting() {
  const datas = useLocation();
  // refs and state
  const Ref = useRef(null);
  const first = useRef("");
  const second = useRef("");
  const third = useRef("");
  const fourth = useRef("");
  const fiveth = useRef("");
  const sixth = useRef("");
  const opt_alert_text = useRef("");
  const resend_ref = useRef("");
  const [loading, setLoading] = useState(false);
  const [otp_alert, setOTPAlert] = useState(null);
  const [timer, setTimer] = useState("01");

  const [is_valid, setIsValid] = useState(false);

  // handlers
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
      user_type: "DEACTIVATE",
      username: datas.state.username,
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
          setOpen(true);
          localStorage.removeItem("anonymous_user");
          localStorage.removeItem("joined_rt");
          localStorage.setItem(
            "current_user",
            JSON.stringify(res.data.data[0])
          );
        }
      })
      .catch((err) => logger.error(err));
  }
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
    const res = await axios(config);
    if (res.status === 200) {
      ToastHandler("sus", "OTP sent.");
    }
  }

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <div className="outerdeactivePages">
        <LeftDiv style={{ minWidth: "300px" }}>
          <AccountLeftSideBar />
        </LeftDiv>
        <DeactiveModal
          open={open}
          handleOpen={handleOpen}
          handleClose={handleClose}
        />
        <div style={{ marginLeft: "2rem" }}>
          <SettingsHeader alternate_title="Deactivate your account" />
          <h5>Verify using Password</h5>
          <div>
            <div className="formDiv">
              <form onSubmit={verifyOTP}>
                <p className="loginp">
                  Enter the OTP sent to your registered email address or phone
                  number
                </p>

                <div className="otpdivMain">
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
                          placeholder="0"
                          onInput={check_valid}
                          ref={sixth}
                        />
                      </Grid>
                    </Grid>
                    <div className="row">
                      {otp_alert && (
                        <small
                          style={{ textAlign: "end", color: "red" }}
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
                          marginTop: "0.5rem",
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
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                              }}
                            >
                              <small>
                                Didn't receive the OTP?&nbsp;Resend in {timer}{" "}
                                sec
                              </small>
                            </div>
                          )}
                        </>
                      </div>

                      {/* <div
                      className="d-flex justify-content-between"
                      style={{ border: "2px solid blue" }}
                    >
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
                    </div> */}
                    </div>
                    <br />
                  </div>
                </div>

                <button
                  type="submit"
                  className="loginBtn btn primary-btn-blk"
                  disabled={loading}
                  style={{
                    color: "#ED4D29",
                    background: "white",
                    fontWeight: "bold",
                    border: "1px solid #ED4D29",
                    borderRadius: "50px",
                    margin: "0 !important",
                  }}
                  onClick={verifyOTP}
                >
                  {loading ? (
                    <CircularProgress
                      style={{ color: "#66B984", width: 27, height: 27 }}
                    />
                  ) : (
                    "Deactivate"
                  )}
                </button>
                {/* <button
              type="submit"
              className={
                is_valid
                  ? `btn primary-btn-blk login-primary-button`
                  : "disabled-button btn primary-btn-blk"
              }
            >
              Login
            </button> */}
              </form>
              <button
                type=""
                className="loginBtn btn primary-btn-blk"
                style={{ borderRadius: "50px", marginTop: "0.5rem" }}
              >
                <Link
                  to={"/account_settings"}
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Go Back
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
