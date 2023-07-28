import React from "react";
import menu_icon from "../../assets/icons/Group 21268.svg";
import "./novideonew.css";
import { allWords } from "../../App"

const ModeratorContols = ({
  user_uid,
  mic_status,
  wc_uids,
  moderatorActions,
  handle_wildcard_removal,
  role,
  customStyle,
  disableInteraction,
  test,
  logoCount,
}) => {

  if (!mic_status) {
    try {
      document.querySelector(`#${user_uid}`).style.boxShadow =
        "0px 0px 0px white";
    } catch (err) { }
  }
  let current_user = null;

  try {
    current_user = JSON.parse(localStorage.getItem("current_user"))["username"];
  } catch (e) { }
  return (
    <div
      // className="overlay-item mod-overlay-center"
      style={{ ...customStyle }}
    // style={{ cursor: "pointer",
    // position: "absolute",
    // right: "0.9rem",
    // top: test ===1? "-2130%":"-1000%;"
    //  }}
    >
      <div className="dropdown">
        <button
          className={`${
            test > 3 && logoCount >=2 && role === "host" ? "margin-left-50" : "dropbtn"
          }`}
        >
          <img src={menu_icon} alt="" />
        </button>
        <div
          className="dropdown-content"
          style={{
            left: "0px",
            right: "auto",
          }}
        >
          {role.includes("moderator") && (
            <li
              onClick={() => {
                if (disableInteraction) return;

                moderatorActions("audio", user_uid, wc_uids.includes(user_uid));
              }}
              style={{
                opacity: disableInteraction ? "0.6" : "1",
              }}
            >
              {mic_status ? "Mute" : "Unmute"}
            </li>
          )}
          {wc_uids.includes(current_user) ? (
            <li
              onClick={() => {
                if (disableInteraction) return;
                handle_wildcard_removal(current_user);
              }}
              style={{
                opacity: disableInteraction ? "0.6" : "1",
              }}
              id="removemeLine"
            >
              {allWords.misc.pages.removeme}
            </li>
          ) : null}
          {role.includes("moderator") && wc_uids.includes(user_uid) && (
            <li
              onClick={() => {
                if (disableInteraction) return;
                handle_wildcard_removal(user_uid);
              }}
              style={{
                opacity: disableInteraction ? "0.6" : "1",
              }}
            >
              {allWords.misc.pages.removewild}
            </li>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModeratorContols;
