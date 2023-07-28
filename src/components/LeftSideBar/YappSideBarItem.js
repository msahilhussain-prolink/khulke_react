import { IconButton } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import UserProfile from "../UserProfile";

const YappSideBarItem = ({ Icon, isCompnent, username, path, onClick }) => {
  return (
    <Link to={path} style={{ textDecoration: "none", textAlign: "center" }}>
      <IconButton onClick={onClick}>
        {" "}
        {username ? (
          <UserProfile
            username={username}
            width={"25px"}
            height={"25px"}
            borderRadius="0.6rem"
          />
        ) : isCompnent ? (
          <Icon style={{ color: "#63779c" }} />
        ) : (
          <img
            alt=""
            src={Icon}
            // className={`icon  ${"selected_icon"}  ${"iconColor"}`}
            style={{ borderRadius: 0, width: "20px", height: "20px" }}
          />
        )}
      </IconButton>
    </Link>
  );
};

export default YappSideBarItem;
