import React from "react";
import { Avatar, Typography } from "@mui/material";
import { POST_API_BASE_URL } from "../../constants/env";
import { UserCardContainer } from "./usercard_style";
import UserProfile from "../../components/UserProfile";
import VIPComp from "../../components/VipComp";

const UserCard = (props) => {
  const { username, user_type } = props;
  return (
    <UserCardContainer
      onClick={() => {
        window.open(`/profile?username=${username}`);
      }}
    >
      <UserProfile username={username} borderRadius="0.4rem" />
      <Typography className="username_container">@{username}</Typography>
      {user_type ? <VIPComp user_type={user_type} /> : null}
    </UserCardContainer>
  );
};

export default UserCard;
