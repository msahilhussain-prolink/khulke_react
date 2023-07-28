import React from "react";
import "./novideonew.css";
import { moderator } from "./settings";
import { POST_API_BASE_URL } from "../../constants/env";
import SpeakerNames from "./SpeakerNames";
import { useSelector } from "react-redux";
import UserProfile from "../../components/UserProfile";

// This component appears when video is off in grid.
export default function NoVideoNew({
  user_length,
  username,
  role,
  stage_uids,
  wc_uids,
  children,
  toggle,
  test,
  user_type,
}) {
  const fullScrc = useSelector((state) => state.fullScreen.full);

  return (
    <div
      className="novideo-outer"
      style={{ width: toggle ? "100%" : "", borderRadius: toggle ? "8px" : "" }}
    >
      <div className="inner" style={{outline: "#fafafa solid 1px"}}>
        <div
          style={{
            position: "absolute",
            top: "0.3rem",
            left: "0.3rem",
          }}
        >
          {toggle !== true && children[1]}
        </div>

        <UserProfile
          username={username}
          id={username}
          className="avatar-middle"
        />
        <div className="icons-cont">
          <div
            className="icons-cont-inner"
            style={{ width: fullScrc ? "98%" : "" }}
          >
            <SpeakerNames
              wc_uids={wc_uids}
              moderator={moderator}
              userid={username}
              stage_uids={stage_uids}
              test={test}
              user_type={user_type}
            />
            {toggle !== true && children[0]}
          </div>
        </div>
      </div>
    </div>
  );
}
