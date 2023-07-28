import React, { useState, useRef, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Link, Navigate, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import FormInput from "../../../components/FormInput";
import Khulkelogo from "../../../assets/icons/KhulKe_logo.svg";
import eye_visible from "../../../assets/icons/eye_visible.svg";
import eye_hidden from "../../../assets/icons/eye_hidden.svg";
import {
  REACT_APP_BASE_URL,
  REACT_APP_BASE_URL_FOR_USER,
  STATIC_TOKEN,
} from "../../../constants/env";
import { get_encrypted_password } from "../../../utils/utils";

const ResetPasswordComponent = () => {
  //Btn refs
  const [btn_status, setBtnStatus] = useState(false);
  const [first_time, setFirstTime] = useState(true);
  //Pass1 refs
  const [pass1_visibility, setPass1Visibility] = useState(false);
  const [pass1, setPass1] = useState("");
  const [pass1_debounce] = useDebounce(pass1, 1000);
  const pass1_icon = useRef("");
  const pass1_alert_text = useRef("");
  const [pass1_emotion, setPass1Emotion] = useState("");
  const [pass1_alert, setPass1Alert] = useState("");
  const handlePass1Change = (value) => {
    setPass1(value);
  };

  //Pass2 refs
  const [pass2_visibility, setPass2Visibility] = useState(false);
  const [pass2, setPass2] = useState("");
  const [pass2_debounce] = useDebounce(pass2, 1000);
  const pass2_icon = useRef("");
  const pass2_alert_text = useRef("");
  const [pass2_emotion, setPass2Emotion] = useState("");
  const [pass2_alert, setPass2Alert] = useState("");
  const handlePass2Change = (value) => {
    setPass2(value);
  };

  const toggleVisibility = (field, status) => {
    //!Toggles password visibility
    if (field === "pass1") {
      setPass1Visibility(status);
      if (status) {
        pass1_icon.current.src = eye_hidden;
      } else {
        pass1_icon.current.src = eye_visible;
      }
    }

    if (field === "pass2") {
      setPass2Visibility(status);
      if (status) {
        pass2_icon.current.src = eye_hidden;
      } else {
        pass2_icon.current.src = eye_visible;
      }
    }
  };

  const checkPassword = () => {
    let policy =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,32}$/;
    if (policy.test(pass1) && policy.test(pass2) && pass1 === pass2) {
      setPass2Alert("");
      setPass1Alert("");
      setPass1Emotion("-success");
      setPass2Emotion("-success");
      setBtnStatus(true);
    } else {
      if (pass1 !== pass2) {
        setPass2Alert("Both passwords must match.");
      } else {
        setPass2Alert(
          "Must have at least one special character excluding space, one number, both upper and lower case characters and must be 8 characters long"
        );
      }
      setPass2Emotion("-alert");
      setPass1Emotion("-alert");
      pass2_alert_text.current.classList = ["warn-text"];
      pass1_alert_text.current.classList = ["warn-text"];
      setBtnStatus(false);
    }
  };

  const [login_link, setLoginLink] = useState(false);

  const reset_password = async () => {
    let temp = sessionStorage.getItem("fp_username").split("|");
    let data;
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
      data = JSON.stringify({
        email: temp[1],
        password: await get_encrypted_password(pass2),
      });
    } else if (temp[0] === "phone") {
      data = JSON.stringify({
        phone_number: phone,
        password: await get_encrypted_password(pass2),
      });
    }

    var config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/forgot_password/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: STATIC_TOKEN,
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setPass2Alert("Password Changed Successfully !");
          pass2_alert_text.current.classList = ["text-success"];
          setLoginLink(true);
          sessionStorage.clear();
        } else if (response.status === 253 || response.status === 252) {
          setPass2Alert(response.data["message"][0]);
          setPass2Emotion("-alert");
          setPass1Emotion("-alert");
          pass2_alert_text.current.classList = ["warn-text"];
          pass1_alert_text.current.classList = ["warn-text"];
        }
        setBtnStatus(false);
      })
      .catch();
  };

  useEffect(() => {
    if (!first_time) {
      checkPassword();
    }
  }, [pass1_debounce, pass2_debounce]);

  const navigate = useNavigate();

  return (
    <div className="col-sm-12 col-md-6 col-lg-6 order-first order-md-second order-lg-1">
      {!sessionStorage.getItem("fp_username") && navigate("/login")}
      <div className="row col-sm-12 col-md-9 col-lg-9">
        <div className="col-sm-6 col-md-6 col-lg-6">
          <img
            src={Khulkelogo}
            className="img-fluid"
            alt="KhulKe Logo"
            style={{ visibility: "hidden", userSelect: "none" }}
          />
        </div>
      </div>
      <h1 className="primary-heading" style={{ marginTop: "-6rem" }}>
        Reset your password
      </h1>
      <br />
      {/* <p className="text-muted-dark">Change your password!</p> */}
      <div className="col-lg-9 col-md-9 col-sm-12">
        <FormInput emotion={pass1_emotion}>
          <input
            type={pass1_visibility ? `text` : "password"}
            onChange={(e) => {
              setFirstTime(false);
              handlePass1Change(e.target.value);
            }}
            placeholder="Enter New Password"
          />
          <img
            ref={pass1_icon}
            onClick={() => {
              toggleVisibility("pass1", !pass1_visibility);
            }}
            src={eye_visible}
            alt=""
          />
        </FormInput>
        <small ref={pass1_alert_text} className="alert-text">
          {pass1_alert}
        </small>
        <FormInput emotion={pass2_emotion}>
          <input
            type={pass2_visibility ? `text` : "password"}
            onChange={(e) => {
              setFirstTime(false);
              handlePass2Change(e.target.value);
            }}
            placeholder="Retype your password."
          />
          <img
            ref={pass2_icon}
            onClick={() => {
              toggleVisibility("pass2", !pass2_visibility);
            }}
            src={eye_visible}
            alt=""
          />
        </FormInput>
        <small ref={pass2_alert_text} className="alert-text">
          {pass2_alert}
        </small>
        <br />
        <div className="text-center">
          <small className={login_link ? `alert-text` : `hidden-link`}>
            Continue To{" "}
            <Link to="/" push>
              Login
            </Link>
          </small>
        </div>
        <div>
          <button
            className={
              btn_status
                ? "btn primary-btn-blk"
                : "disabled-button btn primary-btn-blk"
            }
            onClick={reset_password}
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordComponent;
