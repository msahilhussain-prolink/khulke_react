import React from "react";
import { moderator } from "./settings";
import { POST_API_BASE_URL } from "../../constants/env";
import UserProfile from "../../components/UserProfile";

const NoVideo = ({ user_length, username, role, stage_uids, wc_uids }) => {
  let layout =
    user_length > 2
      ? "half container-fluid text-center"
      : "full container-fluid text-center";
  //Very specific scenario being handled.
  if ((role === "audience" || role === "admin") && user_length === 3) {
    layout = "full container-fluid text-center";
  }
  return (
    <div
      style={{
        borderStyle: "solid",
        borderColor: "#fffbee",
      }}
    >
      <div
        className={layout}
        style={{
          padding: "10px",
          // borderRadius: "1rem",
          borderWidth: "10px",
          backgroundColor: "#161F3A",
          width: "100%",
          position: "relative",
        }}
      >
        <UserProfile
          username={username}
          id={`${username}`}
          boxShadow="1px 2px px red"
        />
        <p
          className="overlay-item uid-overlay"
          style={{
            color: "white",
            paddingTop: "2rem",
            marginBottom: "0px",
          }}
        >
          {username === moderator.username && `@${username} [MODERATOR]`}
          {wc_uids.includes(username) && `@${username} [WILDCARD]`}
          {stage_uids.includes(username) &&
            username !== moderator.username &&
            !wc_uids.includes(username) &&
            `@${username} [PANELIST]`}
        </p>
      </div>
    </div>
  );
};

export default NoVideo;
