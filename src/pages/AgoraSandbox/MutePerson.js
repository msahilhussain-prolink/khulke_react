import React, { useState } from "react";
import { Link } from "react-router-dom";

// Material UI
import { Menu, MenuItem, Typography } from "@mui/material";

// Constants
import { POST_API_BASE_URL } from "../../constants/env";

// Assets
import ChatMenuIcon from "../../assets/icons/post_menu.svg";
import UserProfile from "../../components/UserProfile";
import { allWords } from "../../App";
import VIPComp from "../../components/VipComp";

export const MutePerson = ({ person, muteUser }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        position: "relative",
        paddingBottom: "8px",
      }}
    >
      <div className="d-flex justify-content-center">
        <div style={{ position: "relative" }}>
          <UserProfile username={person.username} className="avatar" />
        </div>
        &emsp;
        <span
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "-5px",
            marginTop: "-5px",
          }}
        >
          <Link
            to={`/profile/${person.username}/posts`}
            target="__blank"
            style={{
              textDecoration: "none",
            }}
          >
            <strong
              style={{
                textTransform: "capitalize",
                display: "block",
                "&:hover": {
                  color: "black",
                },
              }}
            >
              <span style={{ color: "#4f4f4f" }}>@</span>
              {person.username}
              <VIPComp user_type={person.user_type} />
            </strong>
          </Link>
        </span>
      </div>
      {/* three dot icon below */}

      <div
        style={{
          outline: "none",
          backgroundColor: "white",
          position: "absolute",
          right: "-10px",
          top: "20%",
        }}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <img alt="" src={ChatMenuIcon} height="24px" width="auto" />
      </div>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        PaperProps={{
          elevation: 0,
          // justifyContent: "left",
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.32))",
            mt: 1.5,

            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              left: 8,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        <div
          style={{
            width: 200,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <MenuItem
            style={{
              width: 200,
            }}
            onClick={() => {
              muteUser("unmute", person?.user_id, person?.username);
            }}
          >
            <Typography
              style={{
                width: "100%",
                textOverflow: "ellipsis",
                overflowX: "hidden",
              }}
            >
              {allWords.misc.pages.unmute} @{person.username}
            </Typography>
          </MenuItem>
        </div>
      </Menu>
    </div>
  );
};
