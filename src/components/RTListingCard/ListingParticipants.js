import React from "react";
import moment from "moment";
import UserProfile from "../UserProfile";
import VIPComp from "../VipComp";
import { allWords } from "../../App";

export default function ListingParticipants(props) {
  const { moderator, speakers, timestamp, user_type, marginTopStyle, hideTime } = props;

  let speaker_list_one = [];
  let speaker_list_zero = [];
  if (speakers?.length > 0) {
    speakers?.forEach((speaker) => {
      if (speaker?.has_confirmed === 1 && speaker?.type === "NORMAL") {
        speaker_list_one.push(speaker);
      }
      if (speaker?.has_confirmed === 0 && speaker?.type === "NORMAL") {
        speaker_list_zero.push(speaker);
      }
    });
  }

  return (
    <>
      <div>
        <div>
          <div style={{ display: "flex" }}>
            <div
              className="d-flex justify-content-between"
              style={{
                marginLeft: "-5px",
                alignItems: "center",
                marginTop: "-8px",
              }}
            >
              <UserProfile
                className="mod_img"
                username={moderator?.username}
                hidden={moderator?.has_confirmed !== 1 ? true : false}
              />
              &nbsp;
              <div>
                {moderator?.has_confirmed === 1 ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <p
                      style={
                        marginTopStyle ? { marginTop: marginTopStyle } : null
                      }
                      className="mod_tag"
                    >
                      @{moderator?.username || "Deleted User"}
                    </p>
                    <VIPComp user_type={user_type} />
                  </div>
                ) : (
                  <>
                    <small
                      style={{
                        fontSize: "0.75rem",
                        width: "min-content",
                        color: "#707070",
                      }}
                    >
                      {allWords.misc.cawaited}
                    </small>
                  </>
                )}

                {/* Time Div */}
                {!hideTime && <div
                  className="d-flex"
                  style={{ marginTop: "1.3rem", marginLeft: "-3px" }}
                >
                  {/* <img className="time_img" alt="" src={timeimg} /> */}
                  <p className="time_p">
                    <div className="d-flex text-muted">
                      {moment(new Date(timestamp?.["start"]))
                        .local()
                        .format("DD MMM")}
                      <span>&nbsp;at&nbsp;</span>
                      {moment(new Date(timestamp?.["start"]))
                        .local()
                        .format("hh:mm A")}
                    </div>
                  </p>
                </div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
