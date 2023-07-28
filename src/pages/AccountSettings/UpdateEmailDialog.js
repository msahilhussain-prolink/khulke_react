import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogTitle, IconButton, Grid } from "@mui/material";
import axios from "axios";
import { REACT_APP_BASE_URL_FOR_USER, STATIC_TOKEN } from "../../constants/env";
import {
  auto_login_continue,
  device_info,
  moengageEvent,
} from "../../utils/utils";
import { CancelOutlined } from "@material-ui/icons";

const OTPEmailDialog = (props) => {
  const {
    otp_for,
    otp_to,
    getProfileData,
    title,
    subtitle,
    open,
    setOpen,
    onCloseBtnClick,
    setsuccess,
    setIsValid,
    is_valid,
  } = props;

  const first = useRef("");
  const second = useRef("");
  const third = useRef("");
  const fourth = useRef("");

  // const [is_valid, setIsValid] = useState(false);
  const [otp_alert, setOTPAlert] = useState("");
  const opt_alert_text = useRef("");

  useEffect(() => {
    setOTPAlert("");
  }, []);
  const changeuserDetails = () => {
    var data = {
      device_info: device_info,
    };

    data["email"] = otp_to;

    var config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/change-account-details/`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    };

    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          opt_alert_text.current.classList = ["text-success"];
          setOTPAlert("Details updated successfully!");
          setOpen(false);
          setsuccess(true);
          setIsValid(true);
          getProfileData();
        } else {
          setOTPAlert(response.message);
          opt_alert_text.current.classList = ["warn-text"];
        }
      })
      .catch(async function (error) {
        const res = error.response;
        if (!res) return;
        if (res.status === 401) {
          return await auto_login_continue(changeuserDetails);
        }
      });
  };

  const clearOTPfields = () => {
    first.current.value = "";
    second.current.value = "";
    third.current.value = "";
    fourth.current.value = "";
  };

  const check_valid = (force = true) => {
    if (!force) {
      first.current.classList = ["m-2 text-center form-control rounded"]; //Should have alert
      second.current.classList = ["m-2 text-center form-control rounded"]; //Should have alert
      third.current.classList = ["m-2 text-center form-control rounded"]; //Should have alert
      fourth.current.classList = ["m-2 text-center form-control rounded"]; //Should have alert
      setOTPAlert("OTP entered was invalid!");
      clearOTPfields();
      opt_alert_text.current.classList = ["warn-text"];
      return false;
    }
    if (
      first.current.value === "" ||
      second.current.value === "" ||
      third.current.value === "" ||
      fourth.current.value === ""
    ) {
      first.current.classList = ["m-2 text-center form-control rounded"]; //Should have alert
      second.current.classList = ["m-2 text-center form-control rounded"]; //Should have alert
      third.current.classList = ["m-2 text-center form-control rounded"]; //Should have alert
      fourth.current.classList = ["m-2 text-center form-control rounded"]; //Should have alert
      setIsValid(false);
      return false;
    } else {
      first.current.classList = ["m-2 text-center form-control rounded"];
      second.current.classList = ["m-2 text-center form-control rounded"];
      third.current.classList = ["m-2 text-center form-control rounded"];
      fourth.current.classList = ["m-2 text-center form-control rounded"];
      setIsValid(true);
      setOTPAlert("");
      return true;
    }
  };

  const verifyOTP = async () => {
    if (!check_valid) {
      return;
    }
    let email = otp_to;
    let otp =
      first.current.value +
      second.current.value +
      third.current.value +
      fourth.current.value;
    let url = `${REACT_APP_BASE_URL_FOR_USER}/verify-email-otp/`;
    let data = JSON.stringify({ email, otp });

    var config = {
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Authorization: STATIC_TOKEN,
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        if (response.status === 253) {
          check_valid(false);
          clearOTPfields();
        } else if (response.status === 200) {
          changeuserDetails();
          moengageEvent("Update Email", "User", {
            Email: email,
          });
        } else if (response.status === 252) {
          if (
            response.data["message"] ===
            "Verification attempt exceeded. Please try after sometime"
          ) {
            setOTPAlert(
              "Verification attempt exceeded. Please try after sometime"
            );
          } else if (response.data["message"] === "Invalid OTP") {
            check_valid(false);
          }
          clearOTPfields();
        }
      })
      .catch(function (error) {
        clearOTPfields();
      });
  };

  return (
    <Dialog
      open={open}
      maxWidth="md"
      onClose={() => {
        setOpen();
        setOpen(true);
      }}
    >
      <DialogTitle>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p className="dialog-update-title">{title}</p>
            <small className="text-muted">{subtitle}</small>
          </div>
          <div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.1, opacity: 0.8 }}
            >
              <IconButton
                onClick={onCloseBtnClick}
                style={{ width: 50, height: 50 }}
              >
                <CancelOutlined />
              </IconButton>
            </motion.div>
          </div>
        </div>
      </DialogTitle>
      <Grid container direction="row pr-3 p-3">
        <Grid item className="inputs d-flex flex-row justify-content-start">
          <input
            className="m-2 text-center form-control rounded"
            type="text"
            id="first"
            maxLength="1"
            style={{ fontSize: "3rem" }}
            placeholder="0"
            autoFocus={true}
            ref={first}
            onInput={(e) => {
              if (e.target.value !== "") {
                second.current.focus();
              }
            }}
          />
          <input
            className="m-2 text-center form-control rounded"
            type="text"
            id="second"
            style={{ fontSize: "3rem" }}
            maxLength="1"
            placeholder="0"
            ref={second}
            onInput={(e) => {
              if (e.target.value !== "") {
                third.current.focus();
              }
            }}
          />
          <input
            className="m-2 text-center form-control rounded"
            type="text"
            id="third"
            style={{ fontSize: "3rem" }}
            maxLength="1"
            placeholder="0"
            ref={third}
            onInput={(e) => {
              if (e.target.value !== "") {
                fourth.current.focus();
              }
            }}
          />
          <input
            className="m-2 text-center form-control rounded"
            type="text"
            id="fourth"
            style={{ fontSize: "3rem" }}
            maxLength="1"
            placeholder="0"
            onInput={check_valid}
            ref={fourth}
          />
        </Grid>
      </Grid>
      <div className="container pl-5">
        <small ref={opt_alert_text} className="warn-text">
          {otp_alert}
        </small>
      </div>
      <div className="d-flex justify-content-between px-4">
        <button
          onClick={onCloseBtnClick}
          className="reject-btn dialog-update-btn"
        >
          CANCEL
        </button>
        <button
          className={
            is_valid
              ? `w-10 btn primary-btn-blk dialog-update-btn`
              : `w-10 disabled-button btn primary-btn-blk dialog-update-btn`
          }
          onClick={verifyOTP}
        >
          SUBMIT
        </button>
      </div>
    </Dialog>
  );
};

export default OTPEmailDialog;
