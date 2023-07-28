import React, { useRef, useState } from "react";
import SettingsHeader from "../../components/SettingsHeader";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";
import FormInput from "../../components/FormInput";
import eye_visible from "../../assets/icons/eye_visible.svg";
import eye_hidden from "../../assets/icons/eye_hidden.svg";
import axios from "axios";
import {
  REACT_APP_BASE_URL_FOR_USER,
  STATIC_TOKEN,
} from "../../constants/env.js";
import { device_info, get_encrypted_password } from "../../utils/utils";
import "./style.css";
import { useLocation } from "react-router-dom";
import DeactiveModal from "./DeactiveModal";
import { LeftDiv } from "./style";
import AccountLeftSideBar from "../../components/AccountLeftsideBar";
import logger from "../../logger";

export default function PasswordVerifySetting() {
  const datas = useLocation();

  //Refs
  const pass1 = useRef("");
  const pass1_icon = useRef("");
  const pass1_alert_text = useRef("");
  const [loading, setLoading] = useState(false);
  const [pass1_emotion, setPass1Emotion] = useState("");
  const [pass1_alert, setPass1Alert] = useState(null);
  const [pasword, setPasword] = useState("");

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

  // submit handler
  async function submitH(e) {
    e.preventDefault();
    setLoading(true);
    setPass1Alert(null);
    let user_id = datas.state.username;
    const encrypted_password = await get_encrypted_password(pasword);

    let data = JSON.stringify({
      device_info: device_info,
      user_type: "DEACTIVATE",
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

    try {
      let result = await axios(config);
      if (result.status == 252) {
        // setOpen(true);
        setPass1Emotion("-alert");
        // pass1_alert_text.current.classList = ["warn-text"];
        // setPass1Alert("Username / Password entered is incorrect!");
        pass1_alert_text.current.classList.add = ("warn-text", "errorLine");
        setPass1Alert(result.data.message);
        setLoading(false);
      }
      if (result.status === 200) {
        setLoading(false);
        setPass1Emotion("");
        // pass1_alert_text.current.classList = ["alert-text"];
        setPass1Alert("");
        setOpen(true);
      } else {
        // setOpen(true);
        setPass1Emotion("-alert");
        setPass1Alert(result.data.message);
        setLoading(false);
      }
    } catch (error) {
      logger.error(error);
      setPass1Emotion("-alert");
      setPass1Alert(allWords.misc.somethingwrong);
      setLoading(false);
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

          <div className="formDiv">
            <form onSubmit={submitH}>
              <p
                className="loginp"
                style={{
                  fontFamily: "WorkSans-Bold",
                  fontSize: "1.05rem",
                }}
              >
                Enter Password
              </p>

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
                {pass1_alert && (
                  <div style={{ textAlign: "end", color: "red" }}>
                    <small
                      ref={pass1_alert_text}
                      className="alert-text errorLine"
                    >
                      {pass1_alert}
                    </small>
                  </div>
                )}
                <div style={{ textAlign: "end" }}>
                  <Link to="/forgot_password" className="forgotLine">
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                className="loginBtn btn primary-btn-blk"
                disabled={loading}
                style={{
                  marginTop: "3rem",
                  color: "#ED4D29",
                  background: "white",
                  fontWeight: "bold",
                  border: "1px solid #ED4D29",
                  borderRadius: "50px",
                }}
              >
                {loading ? (
                  <CircularProgress
                    style={{ color: "#66B984", width: 27, height: 27 }}
                  />
                ) : (
                  "Deactivate"
                )}
              </button>
            </form>

            <button
              type=""
              className="loginBtn btn primary-btn-blk"
              style={{
                borderRadius: "50px",
                marginTop: "0.5rem",
                textTransform: "initial",
              }}
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
    </>
  );
}
