import { React, useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  ENCRYPTED_PASSWORD_KEY,
  REACT_APP_BASE_URL_FOR_USER,
} from "../../constants/env";
import "./index.css";
import AccountLeftSideBar from "../AccountLeftsideBar";
import FormInput from "../FormInput";
import eye_visible from "../../assets/icons/eye_visible.svg";
import eye_hidden from "../../assets/icons/eye_hidden.svg";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

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
} from "../../utils/utils";
import Header from "../../components/Header";
import logger from "../../logger";

export default function EnterOldPass() {
  const [loading, setLoading] = useState(false);
  const [btn_status, setBtnStatus] = useState(false);
  const pass_current = "";
  const pass_current_icon = useRef("");
  const [pass_current_visibility, setPassCurrentVisibility] = useState(false);
  const pass_current_alert = useRef("");
  const [pass_current_alert_text, setPassCurrentAlertText] = useState("");

  // state
  const [pass1, setPass1] = useState("");
  const [pass1_visibility, setPass1Visibility] = useState(false);
  const [pass1_emotion, setPass1Emotion] = useState("");
  const pass1_icon = useRef("");

  const pass1_alert = useRef("");

  const pass2_icon = useRef("");
  const [pass2_visibility, setPass2Visibility] = useState(false);

  const navigate = useNavigate();

  // Effects
  useEffect(() => {
    if (pass1.length > 7) {
      setBtnStatus(true);
    }
  }, [pass1]);

  // handlers
  const checkPassword = () => {
    let policy =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,32}$/;
    if (policy.test(pass1)) {
      setPassCurrentAlertText("");
      setPass1Emotion("-success");
      setBtnStatus(true);

      return true;
    } else {
      setPassCurrentAlertText(
        "Must have at least one special character excluding space, one number, both upper and lower case characters and must be 8 characters long"
      );
      setPass1Emotion("-alert");
      pass1_alert.current.classList = ["warn-text errorlne"];
      setBtnStatus(false);
      setLoading(false);
      return false;
    }
  };
  const changePassword = async () => {
    const password = await get_encrypted_password(pass1);
    const data = JSON.stringify({
      device_info: device_info,
      current_password: await get_encrypted_password(pass_current),
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
          setPass1Emotion("-alert");
          setPassCurrentAlertText(response.data?.message[0]);
          pass_current_alert.current.classList = ["warn-text"];
        } else if (response.status === 200) {
          localStorage.setItem(ENCRYPTED_PASSWORD_KEY, password);
          setPass1Emotion("-success");
          setPassCurrentAlertText("Password Changed Succesfully.");
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

  async function verifyPass(params) {
    setLoading(true);
    if (checkPassword()) {
      const data = JSON.stringify({
        password: await get_encrypted_password(pass1),
      });

      const config = {
        method: "post",
        url: `${REACT_APP_BASE_URL_FOR_USER}/auth/check-password`,
        headers: {
          Authorization: `Bearer ${localStorage.access}`,
          "Content-Type": "application/json",
        },
        data: data,
      };
      await axios(config)
        .then((res) => {
          if (res.data.status === 200) {
            setLoading(false);
            sessionStorage.setItem("oldpass", data);
            navigate("/changepass");
          }
          if (res.data.status === 253) {
            setLoading(false);
            setPassCurrentAlertText(res.data.message);
            setPass1Emotion("-alert");
            pass1_alert.current.classList = ["warn-text errorlne"];
          }
        })
        .catch((err) => {
          logger.info(err);
          setLoading(false);
        });
    }
  }

  return (
    <>
      <Header />
      <MainDiv>
        <LeftDiv>
          <AccountLeftSideBar />
        </LeftDiv>
        <CenterDiv>
          <div className="custom_mr">
            <SettingsHeader page_header="Change Password" />
            <div
              className="account-settings-div-mob custom"
              style={{
                alignItems: "center",
              }}
            >
              <div className="col-lg-9 col-md-9 col-sm-12">
                <small className="text-muted">Enter Old Password</small>
                <FormInput emotion={pass1_emotion}>
                  <input
                    type={pass1_visibility ? "text" : "password"}
                    value={pass1}
                    placeholder="********"
                    onChange={(e) => setPass1(e.target.value)}
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
              </div>
              <button
                className={
                  btn_status
                    ? `btn primary-btn-blk`
                    : `disabled-button btn primary-btn-blk`
                }
                disabled={loading}
                style={{
                  width: "50%",
                  height: "50px",
                  marginTop: "0",
                  marginBottom: "-30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "1rem",
                }}
                onClick={verifyPass}
              >
                {loading ? (
                  <CircularProgress
                    style={{ color: "#66B984", width: 27, height: 27 }}
                  />
                ) : (
                  "Verify"
                )}
              </button>
            </div>
            <small className="errorlne" ref={pass1_alert}>
              {pass_current_alert_text}
            </small>
          </div>
        </CenterDiv>
        <RightDiv></RightDiv>
      </MainDiv>
    </>
  );
}
