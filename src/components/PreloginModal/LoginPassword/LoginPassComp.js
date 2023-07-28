import axios from "axios";
import { onMessage } from "firebase/messaging";
import React, { useEffect, useRef, useState } from "react";
import TagManager from "react-gtm-module";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  ENCRYPTED_PASSWORD_KEY,
  REACT_APP_BASE_URL_FOR_USER,
  REACT_APP_VAPID_ID,
  MEET_UP_BASE_URL,
  STATIC_TOKEN,
} from "../../../constants/env";
import { messaging } from "../../../push_firebase";
import { notificationsState } from "../../../redux/actions/notificationAction";
import { tokensState } from "../../../redux/actions/notificationAction/token";
import {
  device_info,
  get_encrypted_password,
  moengageEvent,
} from "../../../utils/utils";
import FormInput from "../../FormInput";
import eye_visible from "../../../assets/icons/eye_visible.svg";
import eye_hidden from "../../../assets/icons/eye_hidden.svg";
import KhulKeLogo from "../../../assets/icons/KhulKe_logo.svg";
import "../style.css";
import { allWords } from "../../../App";

export default function LoginPassComp(props) {
  const { setLoginComp, setSignupComp, setForgotPassComp, setLogPassComp } =
    props;

  // state
  const [pasword, setPasword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pass1_alert, setPass1Alert] = useState(null);
  const [pass1_emotion, setPass1Emotion] = useState("");

  const redirectToMeet = localStorage?.getItem("redirectToMeet");

  const dispatch = useDispatch();
  const location = useLocation();

  //Refs
  const pass1 = useRef("");
  const pass1_icon = useRef("");
  const pass1_alert_text = useRef("");

  useEffect(() => {
    setPass1Alert(null);
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

    const config = {
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

          localStorage.setItem(ENCRYPTED_PASSWORD_KEY, encrypted_password);
          localStorage.setItem("access", res.data.data[0].access);
          localStorage.setItem("refresh", res.data.data[0].refresh);
          let join_rt = localStorage.join_rt;
          if (join_rt) {
            join_rt = JSON.parse(join_rt);
            const updatedJoinRT = {
              ...join_rt,
              uid: res.data.data[0].username,
            };
            localStorage.setItem("join_rt", JSON.stringify(updatedJoinRT));
          }
          if (redirectToMeet === "true") {
            localStorage?.removeItem("redirectToMeet");
            window.location.replace(
              `${MEET_UP_BASE_URL}/?token=${res.data.data[0].access}&redirect_url=${location?.search}`
            );
          }
          window.location.reload();
          localStorage.removeItem("anonymous_user");
          localStorage.removeItem("joined_rt");
          firebase_actions();
        } else {
          setPass1Emotion("-alert");
          setPass1Alert(res.data.message);
          setLoading(false);
        }
      })
      .catch(function (error) {
        setLoading(false);
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

  return (
    <div className="loginContainer">
      <span className="signUpTitle">{allWords.misc.pages.prelogin.til1}</span>
      <ol className="signUpDesc">
        <li>{allWords.misc.pages.prelogin.til2}</li>
        <li>{allWords.misc.pages.prelogin.til3}</li>
      </ol>
      <form onSubmit={submitH}>
        <div className="passwordDiv">
          <FormInput emotion={pass1_emotion}>
            <input
              required
              type="password"
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
          <span
            className="forgot_pass"
            onClick={() => {
              setForgotPassComp(true);
              setLogPassComp(false);
            }}
          >
            Forgot Password?
          </span>
        </div>

        <button
          type="submit"
          className="logUp_btn login_btn btn primary-btn-blk"
          disabled={loading}
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
              }}
              className="cursorPointer"
            >
              {" "}
              Create an Account
            </span>
          </small>
          <br />
          {pass1_alert !== null && (
            <small>
              <span>&#8592; </span> {allWords.misc.goback}
            </small>
          )}
        </div>
      </form>
    </div>
  );
}
