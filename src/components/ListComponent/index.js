import React, { useState } from "react";
import Moment from "react-moment";
import PreloginComp from "../PreLoginComp";
import PersonIcon from "@mui/icons-material/Person";
import UserProfile from "../UserProfile";
import VipComp from "../VipComp";
import { allWords } from "../../App";

const ListComponent = ({
  render_points,
  btn_fucntion,
  type,
  disable_btn_fucntion = () => {},
  need_badge,
  div_border,
  btn_disabled,
  margin_flag,
}) => {
  const defined_types = {
    follow: "following",
    invite: "invited",
  };
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

  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div>
      {render_points.length > 0 &&
        typeof render_points !== "string" &&
        render_points.map((render_point, index) => {
          try {
            if (render_point["username"]) {
              return (
                <div
                  key={render_point["username"]}
                  className={
                    div_border === true
                      ? "username__div d-flex justify-content-between mb-3 mt-2"
                      : "d-flex justify-content-between mb-3 mt-2"
                  }
                >
                  <div
                    style={{ cursor: "pointer" }}
                    className="d-flex justify-content-start"
                    onClick={() => {
                      if (window.location.pathname !== "/friends") {
                        window.open(
                          `${window.location.origin}/profile/${render_point["username"]}`
                        );
                      }
                    }}
                  >
                    <UserProfile username={render_point["username"]} />
                    <span style={{ visibility: "hidden" }}>sp</span>
                    <div style={{ margin: "0px" }}>
                      <p
                        style={{ cursor: "pointer" }}
                        className="friend-name mb-0"
                      >
                        {render_point["name"]}
                        <VipComp user_type={render_point["user_type"]} />
                      </p>

                      {render_point?.formatted_created_at ? (
                        <small className="small-one text-muted">
                          <Moment fromNow>
                            {render_point["formatted_created_at"].split("T")[0]}
                          </Moment>
                        </small>
                      ) : (
                        <small className="small-one text-muted">
                          @{render_point["username"]}
                        </small>
                      )}
                    </div>
                  </div>
                  {current_user["username"] !== render_point["username"] && (
                    <div
                      style={{ marginTop: margin_flag === true ? "8px" : "" }}
                    >
                      {render_point["is_following"] ? (
                        <button
                          onClick={() => {
                            if (
                              !localStorage.current_user &&
                              localStorage.anonymous_user
                            )
                              return setModalOpen(true);

                            btn_fucntion(
                              render_point["username"],
                              "unfollow",
                              render_point["_id"]
                            );
                          }}
                          disabled={btn_disabled}
                          className={`${defined_types[type]}-button`}
                        >
                          {/* {defined_types[type]} */}
                          {allWords.profile.btnFollowing}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (
                              !localStorage.current_user &&
                              localStorage.anonymous_user
                            )
                              return setModalOpen(true);

                            btn_fucntion(
                              render_point["username"],
                              "follow",
                              render_point["_id"],
                              index
                            );
                          }}
                          className={`${type}-button ${safe_zone_css}`}
                        >
                          {/* {type == "Follow" && allWords.suggested.follow} */}
                          {allWords.th.suggested.follow}
                        </button>
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
      {render_points.length === 0 ||
        (typeof render_points === "string" && (
          <div className="text-center">
            <p className="warn-text">{allWords.suggested.noResult}</p>
          </div>
        ))}

      <PreloginComp
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        icon={
          <PersonIcon style={{ color: "#66B984" }} width={40} height={40} />
        }
        title={"For follow, Login or sign up to Khul Ke"}
        description={""}
      />
    </div>
  );
};

export default ListComponent;
