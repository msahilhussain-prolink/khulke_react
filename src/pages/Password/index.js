import { React, useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import axios from "axios";
import {
  ENCRYPTED_PASSWORD_KEY,
  REACT_APP_BASE_URL_FOR_USER,
  STATIC_TOKEN,
} from "../../constants/env";

import AccountLeftSideBar from "../../components/AccountLeftsideBar";
import FormInput from "../../components/FormInput";

import eye_visible from "../../assets/icons/eye_visible.svg";
import eye_hidden from "../../assets/icons/eye_hidden.svg";

import { MainDiv, LeftDiv, RightDiv, CenterDiv, Title } from "./style";
import SettingsHeader from "../../components/SettingsHeader";
import {
  auto_login_continue,
  device_info,
  get_encrypted_password,
} from "../../utils/utils";

const Password = () => {
  const [first_time, setFirstTime] = useState(true);
  const [btn_status, setBtnStatus] = useState(false);
  const [pass_current, setPassCurrent] = useState("");
  const [pass_current_emotion, setCurrentEmotion] = useState("");
  const pass_current_icon = useRef("");
  const [pass_current_visibility, setPassCurrentVisibility] = useState(false);
  const pass_current_alert = useRef("");
  const [pass_current_alert_text, setPassCurrentAlertText] = useState("");

  const handleCurrentPassword = (value) => {
    setPassCurrent(value);
  };

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
  const changePassword = async () => {
    const password = await get_encrypted_password(pass1);
    var data = JSON.stringify({
      device_info: device_info,
      current_password: await get_encrypted_password(pass_current),
      new_password: password,
      re_new_password: password,
    });

    var config = {
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
    <MainDiv>
      <LeftDiv>
        <AccountLeftSideBar />
      </LeftDiv>
      <CenterDiv>
        <div style={{ marginLeft: "3rem" }}>
          <SettingsHeader page_header="Change Password" />
          <div className="my-5 container-fluid">
            <div className="row">
              <div className="col-sm-12 col-md-6 col-lg-6">
                <small className="text-muted">Current Password</small>
                <FormInput emotion={pass_current_emotion}>
                  <input
                    type={pass_current_visibility ? "text" : "password"}
                    value={pass_current}
                    placeholder="Enter Current Password"
                    onChange={(e) => {
                      handleCurrentPassword(e.target.value);
                    }}
                  />
                  <img
                    ref={pass_current_icon}
                    onClick={() => {
                      toggleVisibility(
                        "current_password",
                        !pass_current_visibility
                      );
                    }}
                    src={eye_visible}
                  />
                </FormInput>
              </div>
            </div>

            <br />
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <small className="text-muted">New Password</small>
                <FormInput emotion={pass1_emotion}>
                  <input
                    type={pass1_visibility ? "text" : "password"}
                    value={pass1}
                    placeholder="Enter New Password"
                    onChange={(e) => {
                      setFirstTime(false);
                      handlePassword1(e.target.value);
                    }}
                  />
                  <img
                    ref={pass1_icon}
                    onClick={() => {
                      toggleVisibility("password1", !pass1_visibility);
                    }}
                    src={eye_visible}
                  />
                </FormInput>
                <small ref={pass1_alert}>{pass1_alert_text}</small>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <small className="text-muted">Confirm Password</small>
                <FormInput emotion={pass2_emotion}>
                  <input
                    type={pass2_visibility ? "text" : "password"}
                    value={pass2}
                    placeholder="Confirm New Password"
                    onChange={(e) => {
                      setFirstTime(false);
                      handlePassword2(e.target.value);
                    }}
                  />
                  <img
                    ref={pass2_icon}
                    onClick={() => {
                      toggleVisibility("password2", !pass2_visibility);
                    }}
                    src={eye_visible}
                  />
                </FormInput>
              </div>
              <small ref={pass2_alert}>{pass2_alert_text}</small>
              <small ref={pass_current_alert}>{pass_current_alert_text}</small>
            </div>
            <br />
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
  );
};

export default Password;
