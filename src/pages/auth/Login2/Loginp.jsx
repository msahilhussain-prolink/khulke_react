import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./index.css";
// assets
import { useNavigate } from "react-router-dom";
import eye_visible from "../../../assets/icons/eye_visible.svg";
import eye_hidden from "../../../assets/icons/eye_hidden.svg";
import FormInput from "../../../components/FormInput";
import CircularProgress from "@mui/material/CircularProgress";
import logo from "../../../assets/images/logo.svg";
import login2 from "../../../assets/gif/login2.gif";
import {
  device_info,
  get_encrypted_password,
  moengageEvent,
} from "../../../utils/utils";
import TagManager from "react-gtm-module";
import {
  // LOGIN_URL,
  STATIC_TOKEN,
  ENCRYPTED_PASSWORD_KEY,
  // REACT_APP_BASE_URL,
  REACT_APP_BASE_URL_FOR_USER,
  REACT_APP_VAPID_ID,
} from "../../../constants/env";
import axios from "axios";
import KhulKeLogo from "../../../assets/icons/KhulKe_logo.svg";
import { messaging } from "../../../push_firebase";
import { onMessage } from "firebase/messaging";
import { tokensState } from "../../../redux/actions/notificationAction/token";
import { notificationsState } from "../../../redux/actions/notificationAction";
import { useDispatch } from "react-redux";
import { MetaTagsGenerator } from "../../../utils/MetaTagsGenerator";
import { metaData } from "../../../constants/StaticPagesMetaTags";
import { allWords } from "../../../App";

export default function LoginP() {
  // var
  const navigate = useNavigate();

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("current_user"))) {
      navigate("/home");
    }
    // return () => {  }
  }, []);

  // state
  const [pasword, setPasword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pass1_alert, setPass1Alert] = useState(null);
  const [loginData, setLoginData] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [pass1_emotion, setPass1Emotion] = useState("");
  const [err, setErr] = useState(null);
  // const [authentication, setAuthentication] = useState(false);
  // moen State
  const [country_code, setCountryCode] = useState("+91");
  const [country_name, setCountryName] = useState("India");
  const [city_name, setCityName] = useState("Mumbai");

  const dispatch = useDispatch();

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

  //Refs
  const pass1 = useRef("");
  const pass1_icon = useRef("");
  const pass1_alert_text = useRef("");

  useEffect(() => {
    setPass1Alert(null);
  }, []);

  useEffect(() => {
    if (tokens) {
      setLoading(false);
      if (!localStorage.getItem("access") || !localStorage.getItem("refresh")) {
        localStorage.setItem("access", loginData?.["access"]);
        localStorage.setItem("refresh", loginData?.["refresh"]);
        setPass1Alert(null);
        if (localStorage.getItem("current_user")) {
          let current_user = JSON.parse(localStorage.getItem("current_user"));
          if (current_user) {
            if (localStorage.getItem("redirect_origin")) {
              window.location.replace(localStorage.redirect_origin);
              return;
            } else {
              window.location.replace("/home");
              return;
            }
          }
        }
      }
    }
  }, [tokens]);

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

  // submit handler
  async function submitH(e) {
    e.preventDefault();
    setLoading(true);
    setPass1Alert(null);
    let user_id =
      sessionStorage.getItem("username") && sessionStorage.getItem("username");
    const encrypted_password = await get_encrypted_password(pasword);

    let data = JSON.stringify({
      device_info: device_info,
      user_type: "LOGIN",
      username: user_id,
      password: encrypted_password,
    });

    var config = {
      method: "POST",
      url: `${REACT_APP_BASE_URL_FOR_USER}/auth/login`,
      headers: {
        "Content-Type": "application/json",
        Authorization: STATIC_TOKEN,
      },
      data: data,
    };

    await axios(config)
      .then(function (res) {
        if (res.status === 200) {
          setPass1Emotion("");
          pass1_alert_text.current.classList = ["alert-text"];
          localStorage.removeItem("anonymous_user");
          localStorage.removeItem("joined_rt");
          localStorage.setItem(
            "current_user",
            JSON.stringify(res.data.data[0])
          );
          gtmEventLogin(res.data.data[0]._id);

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
            localStorage.setItem(ENCRYPTED_PASSWORD_KEY, encrypted_password);
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
            localStorage.setItem(ENCRYPTED_PASSWORD_KEY, encrypted_password);
            localStorage.setItem("access", res.data.data[0].access);
            localStorage.setItem("refresh", res.data.data[0].refresh);
            navigate("/home");
            firebase_actions();
          }
        } else {
          setPass1Emotion("-alert");

          setPass1Alert(res.data.message);
          setLoading(false);
        }
      })
      .catch(function (error) {
        setLoading(false);
        if (error.response.status === 429) {
          setPass1Alert(error?.response?.data?.message);
        }
      });
  }
  // gtm event
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
  //Toggles password visibility
  const toggleVisibility = (field, status) => {
    if (field === "pass1") {
      if (status === "password") {
        pass1.current.type = "text";
        pass1_icon.current.src = eye_hidden;
      } else {
        pass1.current.type = "password";
        pass1_icon.current.src = eye_visible;
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem("access")) {
      window.location.replace("home");
    }
  }, []);
  return (
    <>
      <MetaTagsGenerator metaTags={metaData["login"]} />
      <div className="main">
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
            <form onSubmit={submitH}>
              <p className="loginp">Enter Password</p>

              <div className="passwordDiv">
                <span className="sentoLine2">Enter Password</span>
                <FormInput emotion={pass1_emotion}>
                  <input
                    required
                    type="password"
                    autoComplete="off"
                    ref={pass1}
                    placeholder="Your password here"
                    value={pasword}
                    onChange={(e) => setPasword(e.target.value)}
                  />
                  <img
                    className="toggleImg"
                    ref={pass1_icon}
                    onClick={() => {
                      toggleVisibility("pass1", pass1.current.type);
                    }}
                    src={eye_visible}
                    alt="toggle eye logo"
                  />
                </FormInput>
                <small ref={pass1_alert_text} className="alert-text errorLine">
                  {pass1_alert}
                </small>
                <Link to="/forgot_password" className="forgotLine">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="loginBtn btn primary-btn-blk"
                disabled={loading}
                style={{ marginTop: "3rem" }}
              >
                {loading ? (
                  <CircularProgress
                    style={{ color: "#66B984", width: 27, height: 27 }}
                  />
                ) : (
                  "Login"
                )}
              </button>

              <div className="text-center mb-5">
                <small className="alert-text caLine">
                  New User?
                  <Link to="/signup" style={{ textDecoration: "none" }}>
                    <span> Create an Account</span>
                  </Link>
                </small>
                <br />
                {pass1_alert !== null && (
                  <span className="backLine" onClick={() => navigate(-1)}>
                    <small>
                      <span>&#8592; </span> Go back
                    </small>
                  </span>
                )}
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
