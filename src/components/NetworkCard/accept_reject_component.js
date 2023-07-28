import React, { useState } from "react";
import axios from "axios";
import { REACT_APP_BASE_URL_FOR_USER } from "../../constants/env";
import user_plus from "../../assets/icons/UserPlus.svg";
import check_white from "../../assets/icons/CheckWhite.svg";
import "./style.css";
import { auto_login_continue } from "../../utils/utils";
import { allWords } from "../../App"

const ARComponent = ({ to_render }) => {
  const [hideme, setHideme] = useState(false);
  let mode = to_render?.action;
  let created_at = to_render.created_at;
  created_at = created_at[created_at.length - 1];
  if (!mode) {
    return;
  }
  let dp =
    to_render?.profile_photo ||
    `https://via.placeholder.com/300x300/66B984/FFFFFF?text=${to_render.name[0].toUpperCase()}`;

  let badge_image;
  if (mode === "REGISTER_REQUEST") {
    badge_image = user_plus;
  } else {
    badge_image = check_white;
  }

  const accept_reject_request = (action) => {
    const data = JSON.stringify({
      username: to_render["username"],
      action: action,
    });

    const config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/save-details/`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(async function (response) {
        if (response.status === 200) {
          setHideme(true);
        }
      })
      .catch(async (e) => {
        const response = e.response;
        if (!response) return;
        if (response.status === 401) {
          return await auto_login_continue(() => accept_reject_request(action));
        }
      });
  };

  return (
    <div
      className={hideme ? `hidden-card` : `mb-4 pb-4`}
      style={{ borderBottom: "1px solid lightgray" }}
    >
      <span className="alert-text d-flex justify-content-start pb-2">
        <img src={badge_image} height={25} width={25} alt="" />
        &nbsp;
        {mode === "REGISTER_REQUEST" && (
          <small>
            Your Friend Wants To Join{" "}
            <strong>
              <i>Khul Ke</i>
            </strong>
          </small>
        )}
        {mode === "REGISTER_REQUEST_ACCEPTED" && (
          <small>
            Accepted your <strong>Invitation</strong>
          </small>
        )}
      </span>
      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <img className="avatar" src={dp} />
          <small style={{ visibility: "hidden", userSelect: "none" }}>aa</small>
          <div>
            <h6 style={{ display: "block", textTransform: "capitalize" }}>
              {to_render.name}
            </h6>
            <span className="d-flex justify-content-start">
              <small className="alert-text">@{to_render.username}</small>
              {/* NEED CORRECT DATE FORMAT FROM BACKEND */}
              {/*
              <small className="alert-text">{created_at}</small> */}
            </span>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          {mode === "REGISTER_REQUEST" && (
            <>
              <button
                className="follow-button-small"
                onClick={() => {
                  accept_reject_request("accept");
                }}
              >
                {allWords.misc.accept}
              </button>
              <small style={{ visibility: "hidden", userSelect: "none" }}>
                aa
              </small>
              <button
                className="reject-button-small"
                onClick={() => {
                  accept_reject_request("reject");
                }}
              >
                {allWords.misc.reject}
              </button>
            </>
          )}
          {mode === "REGISTER_REQUEST_ACCEPTED" && (
            <>
              <button
                className="following-button-small"
                style={{ pointerEvents: "none" }}
              >
                Accepted
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ARComponent;
