import React, { useState } from "react";
import { CardContainer, SuggestionTitle } from "./style";
import { POST_API_BASE_URL } from "../../constants/env";
import { AvatarBadge } from "../ListComponent/AvatarBadge";
import { MOBILE_VIEW } from "../../constants/env";
import Moment from "react-moment";
import PreloginComp from "../PreLoginComp";
import PersonIcon from "@mui/icons-material/Person";
import { allWords } from "../../App";
import FollowBtn from "../../assets/icons/followBtn.svg";
import UnfollowBtn from "../../assets/icons/unfollowBtn.svg";
import "./style.css";
import UserProfile from "../UserProfile";
import VIPComp from "../VipComp";

const SuggesstionListComponent = ({
  render_points,
  btn_fucntion,
  disable_btn_fucntion = () => {},
}) => {
  let safe_zone_css = "";
  let status = disable_btn_fucntion();
  if (status) {
    safe_zone_css = "disabled-button";
  } else {
    safe_zone_css = "";
  }
  let current_user = null;
  try {
    current_user = JSON.parse(
      localStorage.current_user || localStorage.anonymous_user
    );
  } catch (err) {
    current_user = { username: null };
  }

  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <div className="container">
        {render_points?.length > 0 &&
          typeof render_points !== "string" &&
          render_points.map((render_point, index) => {
            try {
              if (render_point["username"]) {
                return (
                  <div
                    key={render_point["username"]}
                    className="d-flex justify-content-between mb-3 mt-2"
                    style={{ width: "16rem" }}
                  >
                    <div
                      style={{ cursor: "pointer", paddingLeft: "0px" }}
                      className="d-flex justify-content-start col-sm-12 col-lg-7 col-md-7"
                      onClick={() => {
                        if (window.location.pathname !== "/friends") {
                          window.open(
                            `${window.location.origin}/profile/${render_point["username"]}/posts`
                          );
                        }
                      }}
                    >
                      <UserProfile username={render_point["username"]} />
                      &nbsp;&nbsp;
                      <div style={{ marginTop: "0px" }}>
                        <p
                          style={{
                            cursor: "pointer",
                            width:
                              render_point?.["name"]?.length > 14
                                ? "8rem"
                                : "100%",
                            fontSize: "14px",
                          }}
                          className="friend-name mb-0"
                        >
                          {render_point?.["name"]?.length > 14
                            ? render_point["name"]?.slice(0, 14) + "..."
                            : render_point["name"].split(" ")}
                          {render_point?.user_type ? (
                            <VIPComp user_type={render_point?.user_type} />
                          ) : null}
                        </p>
                        {render_point?.formatted_created_at ? (
                          <small className="small-one text-muted">
                            <Moment fromNow>
                              {render_point["formatted_created_at"]}
                            </Moment>
                          </small>
                        ) : (
                          <p
                            className="small-one text-muted friend-name"
                            style={{
                              cursor: "pointer",
                              width:
                                render_point?.["username"]?.length > 9
                                  ? "5rem"
                                  : "100%",
                              fontSize: "12px",
                            }}
                          >
                            @{render_point["username"]}
                          </p>
                        )}
                      </div>
                    </div>
                    {current_user["username"] !== render_point["username"] && (
                      <div
                        className="col-sm-12 col-lg-5 col-md-5 follow-suggestion-button"
                        style={{
                          display: "flex",
                          justifyContent: "end",
                          cursor: "pointer",
                        }}
                      >
                        {render_point["is_following"] ? (
                          <img
                            src={FollowBtn}
                            onClick={() => {
                              btn_fucntion(
                                render_point["username"],
                                "unfollow"
                              );
                            }}
                            style={{ width: "40px", height: "40px" }}
                          />
                        ) : (
                          <img
                            src={UnfollowBtn}
                            onClick={() => {
                              if (
                                !localStorage.current_user &&
                                localStorage.anonymous_user
                              ) {
                                return setProfileOpen(true);
                              }
                              btn_fucntion(
                                render_point["username"],
                                "follow",
                                index
                              );
                            }}
                            style={{ width: "40px", height: "40px" }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              }
            } catch (err) {
              return;
            }
          })}
        {render_points?.length === 0 ||
          (typeof render_points === "string" && (
            <div className="text-center">
              <p className="warn-text">{allWords.th.suggested.noResult}</p>
            </div>
          ))}
      </div>
      <PreloginComp
        modalOpen={profileOpen}
        setModalOpen={setProfileOpen}
        icon={
          <PersonIcon style={{ color: "#66B984" }} width={40} height={40} />
        }
        title={allWords.th.suggested.pre}
        description={""}
      />
    </>
  );
};

const SuggestionCard = ({
  render_points,
  btn_fucntion,
  type,
  disable_btn_fucntion = () => {},
  need_badge,
}) => {
  return (
    <CardContainer>
      <SuggestionTitle
        style={{
          lineHeight: "3rem",
          fontSize: "1.2rem",
        }}
      >
        {allWords.th.suggested.sugTitle}
      </SuggestionTitle>
      <div className="suggestedList mt-1" style={{ paddingRight: "3%" }}>
        <SuggesstionListComponent
          render_points={render_points}
          btn_fucntion={btn_fucntion}
          type={type}
          need_badge={need_badge}
        />
      </div>
    </CardContainer>
  );
};

const MemoSuggesstion = React.memo(SuggestionCard);
export default MemoSuggesstion;
