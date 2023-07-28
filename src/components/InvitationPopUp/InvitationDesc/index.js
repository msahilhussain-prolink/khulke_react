import React, { useEffect, useState } from "react";
import { allWords } from "../../../App";

import "../style.css";

export default function InvitationDesc(props) {
  const { item, label, startTimer, timeLeft, belowTimer } = props;

  const [role, setRole] = useState("moderator");

  useEffect(() => {
    switch (item.role) {
      case "moderator":
        setRole(allWords.misc.livert.mMODERATOR);
        break;
      case "speakers":
        setRole(allWords.misc.livert.panelist);
        break;
      case "audience":
        setRole(allWords.misc.livert.Audience);
        break;
      default:
        break;
    }
  }, [item?.role]);

  return (
    <>
      {allWords.misc.you_have_been_invited_2 === "" ? (
        <>
          <h1 className="h1Class">{allWords.misc.you_have_been_invited_1}</h1>
          <h1 className={`role role${item?.role}`}>
            {item?.role == "speakers" ? "Panelist" : item?.role}
          </h1>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1 className="h1ClassNE">{allWords.misc.you_have_been_invited_1}</h1>{" "}
          &nbsp;
          <h1 className={`role role${item?.role}`}>{role}</h1> &nbsp;
          <h1 className="h1ClassNE">
            {allWords.misc.you_have_been_invited_2}
          </h1>{" "}
        </div>
      )}

      <div className="invitedByClass">
        by &nbsp;
        <span className="invitedBySpan">@{item?.invited_by}</span>
      </div>

      <h6 className="nameH6Class">
        <span style={{ fontWeight: "normal" }}>{allWords.misc.for_the_rt}</span>{" "}
        {item?.name}
      </h6>
      <br />

      {label !== "upcoming" && (
        <div className="pt-3 d-flex aboutStartIn">
          <span className="aboutStartSpan">
            {startTimer?.num !== 10
              ? allWords.misc.rt_about_start_in
              : allWords.misc.your_rt_is_live_with_time_left}
          </span>

          <h1 className={`role role${item?.role}`}>{timeLeft}</h1>
          <small className="seeYouThere">
            {allWords.misc.see_you_there} &#128522;
          </small>
        </div>
      )}
      {item?.role == "moderator" && (
        <span className="noteSpan">
          {label == "live"
            ? `${allWords.misc.mod_note_10_1} ${
                startTimer?.num == 5 ? "10" : belowTimer?.timer
              }  ${allWords.misc.mod_note_10_2}`
            : allWords.misc.mod_note_1}
        </span>
      )}
    </>
  );
}
