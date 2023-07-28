import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
// import Khulkelogo from "../../assets/icons/KhulKe_logo.svg";
import FormInput from "../../components/FormInput";
import Disclaimer from "../../components/Disclaimer";
// import RegisterIllustration from "../../assets/images/register_hires.png";
import { useDebounce } from "use-debounce";
import "./inviteAfterRegistration.css";
import { Link } from "react-router-dom";
// importing env links
import { REACT_APP_BASE_URL_FOR_USER } from "../../constants/env";
import { auto_login_continue } from "../../utils/utils";
import { globalImages } from "../../assets/imagesPath/images";

export default function InviteAfterRegistration() {
  // local state
  const [invite_code_emotion, setInviteCodeEmotion] = useState("");
  const [invite_alert_text, setInviteAlertText] = useState("");
  const [isValid, setIsValid] = useState(false);

  const [isVerified, setIsVerified] = useState(false);
  const [first_time, setFirstTime] = useState(true);

  const [invite_code, setInviteCode] = useState("");
  const [invite_debounce] = useDebounce(invite_code, 1000);
  const [accessTkn, setAccessTkn] = useState(localStorage.getItem("access"));

  const invite_alert = useRef("");

  // Handlers
  const checkInvite = async () => {
    if (invite_debounce === "") {
      setInviteCodeEmotion("-alert");
      setInviteAlertText("Invitation code can't be blank.");
      invite_alert.current.classList = ["warn-text"];
      setIsValid(false);
      return;
    }

    let data = {
      invitation_code: String(invite_debounce),
    };

    //API integration to check if code posted is valid (new api)
    let config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/check-update-invite-code/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessTkn}`,
      },
      data: data,
    };

    if (isVerified === false) {
      try {
        let dd = await axios(config);
        if (dd.data.message === "Invalid invitation code") {
          setInviteCodeEmotion("-alert");
          setInviteAlertText(dd.data.message);
          invite_alert.current.classList = ["warn-text"];
          setIsValid(false);
        }
        if (dd.data.message === "Data Updated") {
          setInviteCodeEmotion("-success");
          setInviteAlertText("Invite code verified!");
          invite_alert.current.classList = ["text-success"];
          setIsValid(true);
        }
      } catch (e) {
        const res = e.response;
        if (!res) return;
        if (res.status === 401) {
          return auto_login_continue(checkInvite);
        }
      }
    }
  };

  // Effects
  useEffect(() => {
    if (!first_time) {
      checkInvite();
    }
  }, [invite_debounce]);

  return (
    <div className="col-sm-12 col-md-6 col-lg-6 order-first order-md-second order-lg-1">
      <>
        <div className="row mb-4 col-sm-12 col-md-9 col-lg-9">
          <div className="col-sm-6 col-md-6 col-lg-6 mb-3">
            <img
              src={globalImages.logo}
              style={{ height: "9rem" }}
              className="img-fluid"
              alt="KhulKe Logo"
            />
          </div>
        </div>
        <h1 className="primary-heading">Enter Invitation Code</h1>
        <p className="text-muted-dark">
          This is the beginning of a strong friendship
        </p>
        <div className="col-lg-9 col-md-9 col-sm-12">
          <FormInput emotion={invite_code_emotion}>
            <input
              onChange={(e) => {
                setInviteCode(e.target.value);
                setFirstTime(false);
              }}
              placeholder="Enter Code"
            />
          </FormInput>
          <small ref={invite_alert}>{invite_alert_text}</small>

          <div className="mt-5">
            <Disclaimer origin_url={window.location.href} />

            <Link to={isValid ? "/welcome2" : "inviteCode"}>
              <button
                className={
                  isValid
                    ? `btn primary-btn-blk`
                    : `disabled-button btn primary-btn-blk`
                }
                disabled={isValid ? false : true}
              >
                CONTINUE
              </button>
            </Link>
          </div>

          <div className="text-center mb-5">
            <Link to="/waiting">
              <small className="alert-text">Don't have a invite code?</small>
            </Link>
          </div>
        </div>
      </>
    </div>
  );
}
