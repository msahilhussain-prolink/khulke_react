import React, { useState } from "react";
import SettingsHeader from "../../components/SettingsHeader";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import ToastHandler from "../../utils/ToastHandler";
import CircularProgress from "@mui/material/CircularProgress";
import AccountLeftSideBar from "../../components/AccountLeftsideBar";
import {
  REACT_APP_BASE_URL_FOR_USER,
  STATIC_TOKEN,
} from "../../constants/env.js";
import { LeftDiv } from "./style";
import UserProfile from "../../components/UserProfile";
import { allWords } from "../../App";
import logger from "../../logger";

export default function DeactivateInfo() {
  // vars
  const datas = useLocation();
  const navigate = useNavigate();
  // state
  const [error, setError] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [smallLoader, setsmallLoader] = useState(false);

  // send OTP function
  async function sendOTPFunc() {
    setShowLoader(true);

    let data = JSON.stringify({
      user_type: "DEACTIVATE",
      username: datas.state.username,
    });

    var config = {
      method: "POST",
      url: `${REACT_APP_BASE_URL_FOR_USER}/auth/send-otp`,
      headers: {
        "Content-Type": "application/json",
        Authorization: STATIC_TOKEN,
      },
      data: data,
    };
    try {
      const res = await axios(config);
      if (res.data.status === 200) {
        setShowLoader(false);
        setError("");
        navigate(
          { pathname: "/verifyotp_setting" },
          {
            state: {
              username: datas.state.username,
            },
          }
        );
      } else if (res.data.status == 253) {
        setError(res.data.message);
        setShowLoader(false);
      } else {
        setShowLoader(false);
        ToastHandler("dan", allWords.misc.somethingwrong);
      }
    } catch (error) {
      setShowLoader(false);
      ToastHandler("dan", allWords.misc.somethingwrong);
    }
  }
  // api call to check whether password is set or not and redirect accordingly
  async function checkPassRedirect() {
    let url = `${REACT_APP_BASE_URL_FOR_USER}/check_passwordpresent/`;
    var config = {
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Authorization: STATIC_TOKEN,
      },
      data: {
        user_data: datas.state.username,
      },
    };
    try {
      const rest = await axios(config);
      if (rest?.data?.data[0].pflag === true) {
        // navigate("/verifypass_setting");
        navigate(
          { pathname: "/verifypass_setting" },
          {
            state: {
              username: datas.state.username,
            },
          }
        );
      }
      if (rest?.data?.data[0].pflag === false) {
        // navigate("/verifyotp_setting");
        sendOTPFunc();
      }
    } catch (error) {
      logger.error(error);
      setError("something went wrong");
    }
  }

  //API call checking whether to send on set new password or old password pages.
  async function passFunc() {
    // setsmallLoader(true);
    let url = `${REACT_APP_BASE_URL_FOR_USER}/check_passwordpresent/`;

    const data = {
      user_data: JSON.parse(localStorage.getItem("current_user"))["username"],
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
        if (res.data.data[0].pflag === false) {
          navigate("/setPass");
        }
        if (res.data.data[0].pflag === true) {
          navigate("/oldpass");
        }
      })
      .catch((err) => {
        logger.error(err);
        setError(allWords.misc.somethingwrong);
      });
  }

  return (
    <>
      <div className="outerdeactivePages">
        <LeftDiv style={{ minWidth: "300px" }}>
          <AccountLeftSideBar />
        </LeftDiv>

        <div className="left_zero" style={{ marginLeft: "2rem" }}>
          <SettingsHeader alternate_title="Deactivate your account" />
          <div className="profleCont">
            <div className="left">
              <UserProfile
                className="imgInLeft"
                username={datas.state.username}
                alt=""
                width="50px"
                height="50px"
                objectFit="cover"
              />
            </div>
            <div className="right">
              <p className="name">{datas.state.name}</p>
              <p className="usernamep">{`@${datas.state.username}`}</p>
            </div>
          </div>
          <br />
          {/* <br /> */}
          <div className="top">
            <p className="deactivate_bold">
              Note before deactivating your account
            </p>
            <p className="deactivate_p">
              You can revive your account by logging in within 30 days. After 30
              days, the account will be permanently deleted along with all the
              posts, and media.
            </p>
          </div>
          <div className="bottom">
            <p className="deactivate_bold">Some more information</p>
            <div>
              <p className="deactivate_p">
                You can restore your Khul Ke account if it was accidentally or
                wrongfully deactivated for up to 30 days after deactivation.
              </p>

              <p className="deactivate_p">
                Some account information may still be available in search
                engines, such as Google or Bing.{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  to={"/faq"}
                  style={{
                    color: "#009AD3",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Learn more
                </Link>
              </p>
              <br />
              <p className="deactivate_p">
                If you just want to change your <b>@username</b>, you don't need
                to deactivate your account — edit it in your
                <Link
                  // target="_blank"
                  rel="noopener noreferrer"
                  to={"/account_settings"}
                  style={{
                    color: "#009AD3",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  {` settings.`}
                </Link>
              </p>
              <p className="deactivate_p">
                If you just want to change your <b>profile name</b>, you don't
                need to deactivate your account — edit it in your{" "}
                <Link
                  // target="_blank"
                  rel="noopener noreferrer"
                  to={"/personal_details"}
                  style={{
                    color: "#009AD3",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  {` settings.`}
                </Link>
              </p>
              <p className="deactivate_p">
                If you just want to change your <b>profile image</b>, you don't
                need to deactivate your account — edit it in your{" "}
                <Link
                  // target="_blank"
                  // rel="noopener noreferrer"
                  to={"/personal_details"}
                  style={{
                    color: "#009AD3",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  {` settings.`}
                </Link>
              </p>
              <p className="deactivate_p">
                If you just want to change your <b>password</b>, you don't need
                to deactivate your account — edit it in your{" "}
                <span
                  // target="_blank"
                  // rel="noopener noreferrer"
                  // to={"/personal_details"}
                  style={{
                    color: "#009AD3",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                  className="passLine"
                  onClick={() => passFunc()}
                >
                  {` settings.`}
                  {smallLoader ? (
                    <CircularProgress
                      style={{
                        color: "#66B984",
                        marginLeft: "10px",
                        width: 20,
                        height: 20,
                      }}
                    />
                  ) : (
                    ""
                  )}
                </span>
              </p>

              <br />
              <p className="deactivate_p">
                If you want to download your Khul Ke data, you'll need to
                complete both the request and download process before
                deactivating your account. Links to download your data cannot be
                sent to deactivated accounts.
              </p>
            </div>
          </div>
          <br />
          <button className="continue_btn" onClick={() => checkPassRedirect()}>
            {showLoader ? (
              <CircularProgress
                style={{ color: "#66B984", width: 27, height: 27 }}
              />
            ) : (
              "CONTINUE"
            )}
          </button>
          {error && (
            <div
              style={{ color: "red", fontSize: "1rem", marginLeft: "0.5rem" }}
            >
              <small className="alert-text errorLine">{error}</small>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
