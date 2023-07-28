import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import FormInput from "../../../components/FormInput";
import Khulkelogo from "../../../assets/icons/KhulKe_logo.svg";
import {
  REACT_APP_BASE_URL,
  REACT_APP_BASE_URL_FOR_USER,
  STATIC_TOKEN,
} from "../../../constants/env";
import check_green from "../../../assets/icons/check_green.svg";
import cross_red from "../../../assets/icons/cross_red.svg";
import { allWords } from "../../../App";
import logger from "../../../logger";

const ForgotPasswordComponent = () => {
  //Username refs
  const username = useRef("");
  const username_icon = useRef("");
  const username_alert_text = useRef("");
  const [username_emotion, setUsernameEmotion] = useState("");
  const [username_alert, setUsernameAlert] = useState("");
  const [toggle_username_icon, setToggleUsernameIcon] = useState(true);
  const [otp_for, setOTPFor] = useState("");

  const validate = (validate_for) => {
    let validPhone = REACT_APP_BASE_URL.includes("perf")
      ? /^([0|\+[0-9]{1,5})?([1-9][0-9]{9})$/
      : /^([0|\+[0-9]{1,5})?([6-9][0-9]{9})$/;
    let validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (validate_for === "email") {
      if (!validEmail.test(username.current.value)) {
        return false;
      }
      return "email";
    } else if (validate_for === "phone") {
      if (!validPhone.test(username.current.value)) {
        return false;
      }
      return "phone";
    }
  };

  async function checkPasswordPresent() {
    let url = `${REACT_APP_BASE_URL_FOR_USER}/check_passwordpresent/`;
    let validPhone = REACT_APP_BASE_URL.includes("perf")
      ? /^([0|\+[0-9]{1,5})?([1-9][0-9]{9})$/
      : /^([0|\+[0-9]{1,5})?([6-9][0-9]{9})$/;
    let phone = username.current.value;

    if (validPhone.test(phone)) {
      if (phone.length === 10) {
        phone = "+91" + phone;
      } else if (phone.length !== 10) {
        if (phone.length > 10) {
          if (phone[0] === "+" || phone[0] === "9") {
            const code = phone.slice(0, phone.length - 10);
            if (code === "+91" || code === "91") {
              phone = username.current.value;
            } else {
              setUsernameEmotion("-alert");
              setUsernameAlert(allWords.misc.pages.prelogin.pleaseadd);
              username_alert_text.current.classList = ["warn-text"];
              return;
            }
          } else {
            setUsernameEmotion("-alert");
            setUsernameAlert(allWords.misc.pages.prelogin.pleaseadd);
            username_alert_text.current.classList = ["warn-text"];
            return;
          }
        } else {
          setUsernameEmotion("-alert");
          setUsernameAlert(allWords.misc.pages.prelogin.pleaseadd);
          username_alert_text.current.classList = ["warn-text"];
          return;
        }
      }
    }
    const data = {
      user_data: phone,
    };
    var config = {
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Authorization: STATIC_TOKEN,
      },
      data: data,
    };

    await axios(config)
      .then((res) => {
        if (res.data.status === 253) {
          if (res.data.message === "user not found") {
            setUsernameEmotion("-alert");
            setUsernameAlert(
              "You are not registered with us. Kindly create an account to login."
            );
            username_alert_text.current.classList = ["warn-text"];
            return;
          }
          return;
        }
        if (res.data.status == 200) {
          if (res.data.message == "Password not present") {
            setUsernameEmotion("-alert");
            setUsernameAlert(
              "You have not set your password. Kindly Login with OTP."
            );
            username_alert_text.current.classList = ["warn-text"];
            return;
          }
          if (res.data.message == "Password present") {
            setUsernameEmotion("-success");
            sendOTP();
          }
        }
      })
      .catch((err) => {
        logger.error(err);
      });
  }

  const sendOTP = async () => {
    if (!validate("phone") && !validate("email")) {
      setUsernameAlert("Email/Phone number was invalid!");
      setUsernameEmotion("-alert");
      setToggleUsernameIcon(false);
      username_alert_text.current.classList = ["warn-text"];
      return;
    }
    setUsernameAlert("");
    setUsernameEmotion("-success");
    setToggleUsernameIcon(true);
    username_alert_text.current.classList = ["alert-text"];
    let url = `${REACT_APP_BASE_URL_FOR_USER}`;
    let data = {};
    if (otp_for === "phone") {
      let phone_number = username.current.value;
      if (phone_number.length === 10) {
        phone_number = "+91" + phone_number;
      } else if (phone_number.length !== 10) {
        if (phone_number[0] === "+" || phone_number[0] === "9") {
          const code = phone_number.slice(0, phone_number.length - 10);
          if (code === "+91" || code === "91") {
            phone_number = username.current.value;
          } else {
            setUsernameEmotion("-alert");
            setUsernameAlert(allWords.misc.pages.prelogin.pleaseadd);
            username_alert_text.current.classList = ["warn-text"];
            return;
          }
        } else {
          setUsernameEmotion("-alert");
          setUsernameAlert(allWords.misc.pages.prelogin.pleaseadd);
          username_alert_text.current.classList = ["warn-text"];
          return;
        }
      }
      url = url + `/send-otp-phone/`;
      data = JSON.stringify({ phone_number });
    } else if (otp_for === "email") {
      url = url + `/send-otp-email/`;
      data = JSON.stringify({
        email: username.current.value,
        r_type: "password",
      });
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

    await axios(config)
      .then(function (response) {
        if (response.status === 200) {
          sessionStorage.setItem(
            "fp_username",
            otp_for + "|" + username.current.value
          );
          window.location.replace("/verify_fp");
        }
      })
      .catch();
  };

  const check_existence = async (should_call_api) => {
    //Calling without API

    if (!should_call_api) {
      let mob = validate("phone");
      let mail = validate("email");
      if (!mob && !mail) {
        setUsernameAlert("Email/Phone number was invalid!");
        setUsernameEmotion("-alert");
        username_alert_text.current.classList = ["warn-text"];
        setToggleUsernameIcon(false);
        return false;
      }
      setOTPFor(mail ? mail : mob);
      return true;
    }

    //Calling with API
    let data = {};
    if (otp_for === "phone") {
      let phone_number = username.current.value;
      if (phone_number.length === 10) {
        phone_number = "+91" + phone_number;
      } else if (phone_number.length !== 10) {
        if (phone_number[0] === "+" || phone_number[0] === "9") {
          const code = phone_number.slice(0, phone_number.length - 10);
          if (code === "+91" || code === "91") {
            phone_number = phone_number.slice(code.length, code.length + 10);
          } else {
            setUsernameEmotion("-alert");
            setUsernameAlert(allWords.misc.pages.prelogin.pleaseadd);
            username_alert_text.current.classList = ["warn-text"];
            return;
          }
        } else {
          setUsernameEmotion("-alert");
          setUsernameAlert(allWords.misc.pages.prelogin.pleaseadd);
          username_alert_text.current.classList = ["warn-text"];
          return;
        }
      }
      data = JSON.stringify({
        phone_number: phone_number,
      });
    } else if (otp_for === "email") {
      data = JSON.stringify({ email: username.current.value });
    }

    var config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/check/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: STATIC_TOKEN,
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        if (response.data["status"] !== 200) {
          setUsernameEmotion("-success");
          setUsernameAlert("");
          username_alert_text.current.classList = ["alert-text"];
          checkPasswordPresent();
          // sendOTP();
        } else {
          checkPasswordPresent();
          setUsernameEmotion("-alert");
          // setUsernameAlert("Email/Phone number was invalid!");
          username_alert_text.current.classList = ["warn-text"];
        }
      })
      .catch();
  };

  useEffect(() => {
    if (otp_for !== "") {
      check_existence(true);
    }
  }, [otp_for]);

  // function moenFunc() {
  //   window.Moengage?.track_event("Forgot password", {
  //     "email/password": username.current.value,
  //   });
  // }

  return (
    <div className="col-sm-12 col-md-6 col-lg-6 order-first order-md-second order-lg-1">
      <div className="row mb-5 col-sm-12 col-md-9 col-lg-9">
        <div className="col-sm-6 col-md-6 col-lg-6">
          <img src={Khulkelogo} className="img-fluid" alt="KhulKe Logo" />
        </div>
      </div>
      <h1 className="primary-heading"> {allWords.misc.pages.fortitle}</h1>
      <p className="text-muted-dark">
        {allWords.misc.pages.for1}
        <br />   {allWords.misc.pages.for2}
      </p>
      <div className="col-lg-9 col-md-9 col-sm-12">
        <FormInput emotion={username_emotion}>
          <input autoFocus ref={username} placeholder="Email / Mobile" />
          <img
            style={{ visibility: "hidden" }}
            src={toggle_username_icon ? check_green : cross_red}
            ref={username_icon}
            alt="dummy"
          />
        </FormInput>
        <small ref={username_alert_text}>{username_alert}</small>
        <br />
        <div className="text-center my-1">
          <small className="alert-text">
            {allWords.misc.pages.rempass}<Link to="/">Login</Link>
          </small>
        </div>
        <div>
          <button
            className="btn primary-btn-blk"
            onClick={async () => {
              let res = await check_existence(false);
              if (res) {
                check_existence(true);
              }
              // moenFunc();
            }}
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordComponent;
