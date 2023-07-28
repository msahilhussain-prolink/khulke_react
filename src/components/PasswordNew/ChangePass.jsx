import { React, useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import axios from "axios";
import {
  ENCRYPTED_PASSWORD_KEY,
  REACT_APP_BASE_URL_FOR_USER,
} from "../../constants/env";
import AccountLeftSideBar from "../AccountLeftsideBar";
import FormInput from "../FormInput";

import eye_visible from "../../assets/icons/eye_visible.svg";
import eye_hidden from "../../assets/icons/eye_hidden.svg";

import {
  MainDiv,
  LeftDiv,
  RightDiv,
  CenterDiv,
} from "../../pages/Password/style";
import SettingsHeader from "../SettingsHeader";
import {
  auto_login_continue,
  device_info,
  get_encrypted_password,
  moengageEvent,
} from "../../utils/utils";
import Header from "../../components/Header";

export default function ChangePass() {
  const [first_time, setFirstTime] = useState(true);
  const [btn_status, setBtnStatus] = useState(false);
  const [pass_current_emotion, setCurrentEmotion] = useState("");
  const pass_current_icon = useRef("");
  const [pass_current_visibility, setPassCurrentVisibility] = useState(false);
  const pass_current_alert = useRef("");
  const [pass_current_alert_text, setPassCurrentAlertText] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass1_debounce] = useDebounce(pass1, 1000);
  const [pass1_emotion, setPass1Emotion] = useState("");
  const pass1_icon = useRef("");
  const [pass1_visibility, setPass1Visibility] = useState(false);
  const pass1_alert = useRef("");
  const [pass1_alert_text, setPass1AlertText] = useState("");

  const handlePassword1 = (value) => {
    setPass1(value);
  };

  const [pass2, setPass2] = useState("");
  const [pass2_debounce] = useDebounce(pass2, 1000);
  const [pass2_emotion, setPass2Emotion] = useState("");
  const pass2_icon = useRef("");
  const [pass2_visibility, setPass2Visibility] = useState(false);
  const pass2_alert = useRef("");
  const [pass2_alert_text, setPass2AlertText] = useState("");

  const handlePassword2 = (value) => {
    setPass2(value);
  };

  const checkPassword = () => {
    let policy =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,32}$/;
    if (policy.test(pass1) && policy.test(pass2) && pass1 === pass2) {
      setPass2AlertText("");
      setPass1AlertText("");
      setPassCurrentAlertText("");
      setPass1Emotion("-success");
      setPass2Emotion("-success");
      setBtnStatus(true);
    } else {
      if (pass1 !== pass2) {
        pass_current_alert.current.classList = ["warn-text"];
        setPassCurrentAlertText("Both passwords must match.");
      } else {
        setPassCurrentAlertText(
          "Must have at least one special character excluding space, one number, both upper and lower case characters and must be 8 characters long"
        );
      }
      setPass2Emotion("-alert");
      setPass1Emotion("-alert");
      pass2_alert.current.classList = ["warn-text"];
      pass1_alert.current.classList = ["warn-text"];
      setBtnStatus(false);
    }
  };

  useEffect(() => {
    if (!first_time) {
      checkPassword();
    }
  }, [pass1_debounce, pass2_debounce]);

  useEffect(() => {
    if (!sessionStorage.getItem("oldpass")) {
      sessionStorage.clear();

      window.location.replace("/oldpass");
    }
    moengageEvent("View Page", "ALL", {
      URL: `${window.location.origin}/${window.location.pathname}`,
    });
  }, []);

  const changePassword = async () => {
    const password = await get_encrypted_password(pass1);

    const data = JSON.stringify({
      device_info: device_info,
      current_password: JSON.parse(sessionStorage.getItem("oldpass")).password,
      new_password: password,
      re_new_password: password,
    });

    const config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/change-password/`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        if (response.status === 253) {
          setCurrentEmotion("-alert");
          setPass1Emotion("-alert");
          setPass2Emotion("-alert");
          setPassCurrentAlertText(response.data?.message);
          pass_current_alert.current.classList = ["warn-text"];
        } else if (response.status === 200) {
          localStorage.setItem(ENCRYPTED_PASSWORD_KEY, password);
          setCurrentEmotion("-success");
          setPass1Emotion("-success");
          setPass2Emotion("-success");
          setPassCurrentAlertText("Password Changed Succesfully.");
          setPass1AlertText("");
          setPass2AlertText("");
          pass_current_alert.current.classList = ["text-success"];
          setBtnStatus(false);

          moengageEvent("Update Password", "User", { UpdatedDate: new Date() });
        }
      })
      .catch(async function (e) {
        const res = e.response;
        if (!res) return;

        if (res.status === 401) {
          return await auto_login_continue(changePassword);
        }
      });
  };

  const toggleVisibility = (field, status) => {
    //!Toggles password visibility
    if (field === "current_password") {
      if (status) {
        pass_current_icon.current.src = eye_hidden;
        setPassCurrentVisibility(status);
      } else {
        pass_current_icon.current.src = eye_visible;
        setPassCurrentVisibility(status);
      }
    }
    if (field === "password1") {
      if (status) {
        pass1_icon.current.src = eye_hidden;
        setPass1Visibility(status);
      } else {
        pass1_icon.current.src = eye_visible;
        setPass1Visibility(status);
      }
    }
    if (field === "password2") {
      if (status) {
        pass2_icon.current.src = eye_hidden;
        setPass2Visibility(status);
      } else {
        pass2_icon.current.src = eye_visible;
        setPass2Visibility(status);
      }
    }
  };

  useEffect(() => {
    if (!first_time) {
      if (pass1_emotion !== "-success" && pass_current_emotion !== "-success") {
        setPass2AlertText("");
      }
    }
  }, [pass_current_alert_text, pass1_alert_text, pass2_alert_text]);

  return (
    <>
      <Header />
      <MainDiv>
        <LeftDiv>
          <AccountLeftSideBar />
        </LeftDiv>
        <CenterDiv>
          <div style={{ marginLeft: "3rem" }}>
            <SettingsHeader page_header="Change Password" />
            <div className="my-3 container-fluid">
              <div className="col-lg-9 col-md-9 col-sm-12">
                <small className="text-muted">Enter New Password</small>
                <FormInput emotion={pass1_emotion}>
                  <input
                    type={pass1_visibility ? "text" : "password"}
                    value={pass1}
                    placeholder="********"
                    onChange={(e) => {
                      setFirstTime(false);
                      handlePassword1(e.target.value);
                    }}
                  />
                  <img
                    alt=""
                    ref={pass1_icon}
                    onClick={() => {
                      toggleVisibility("password1", !pass1_visibility);
                    }}
                    src={eye_visible}
                  />
                </FormInput>
                <small ref={pass1_alert}>{pass1_alert_text}</small>
              </div>
              <div
                className="col-lg-9 col-md-9 col-sm-12"
                style={{ marginTop: "1.5rem" }}
              >
                <small className="text-muted">Confirm New Password</small>
                <FormInput emotion={pass2_emotion}>
                  <input
                    type={pass2_visibility ? "text" : "password"}
                    value={pass2}
                    placeholder="********"
                    onChange={(e) => {
                      setFirstTime(false);
                      handlePassword2(e.target.value);
                    }}
                  />
                  <img
                    alt=""
                    ref={pass2_icon}
                    onClick={() => {
                      toggleVisibility("password2", !pass2_visibility);
                    }}
                    src={eye_visible}
                  />
                </FormInput>
              </div>
              <div>
                <small ref={pass2_alert}>{pass2_alert_text}</small>
                <small ref={pass_current_alert}>
                  {pass_current_alert_text}
                </small>
              </div>
              <button
                className={
                  btn_status
                    ? `btn primary-btn-blk`
                    : `disabled-button btn primary-btn-blk`
                }
                style={{ width: "50%" }}
                onClick={changePassword}
              >
                {" "}
                UPDATE{" "}
              </button>
            </div>
          </div>
        </CenterDiv>
        <RightDiv></RightDiv>
      </MainDiv>
    </>
  );
}
