import { IconButton } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import MenuSVG from "../../assets/icons/menu.svg";
import { Divider, Menu as CustomMenu } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

import { useNavigate } from "react-router-dom";
import logoutUser from "../../apis/logoutUser";
import TagManager from "react-gtm-module";
import UserProfile from "../UserProfile";
import { allWords } from "../../App";
import { useSelector } from "react-redux";

const Container = styled.div`
  width: 100%;
  border: 1px solid lightgray;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem;
  height: 60px;
  margin-bottom: 1.75rem;
  justify-content: space-between;
  @media screen and (min-width: 1980px) {
    margin-top: 15rem;
  }

  .user_container {
    display: flex;
    align-items: center;
  }

  @media screen and (max-width: 480px) {
    width: 100%;
    flex-direction: row;
  }

  @media screen and (max-width: 968px) {
    width: fit-content;
    flex-direction: row;
  }
  @media screen and (max-width: 820px) {
    width: 100%;
    flex-direction: row;
  }
`;
export const Avatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 0.5rem;
`;
const UserCard = ({ avatar, windowWidth }) => {
  const userDataDetails = useSelector(
    (state) => state.user_profile.data?.data?.self_user
  );
  const [current_user, setCurrentUser] = useState({
    username: localStorage?.current_user?.username,
  });
  useEffect(() => {
    if (userDataDetails) {
      setCurrentUser({username: userDataDetails?.username});
    } else {
      setCurrentUser({username: localStorage?.current_user?.username})
    }
  }, [userDataDetails]);

  // * Menu Option
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // gtm events
  function gtmEventLogout() {
    TagManager.dataLayer({
      dataLayer: {
        event: "logout event",
        category: "Logout",
        action: "click",
        label: "success",
      },
    });
  }

  const navigate = useNavigate();
  return (
    <div className="outer_div_in_leftBar_usercard">
      <Container className="userCardStep">
        <UserProfile
          username={current_user.username}
          onClick={() => {
            navigate(`/profile`, {
              state: {
                self: true,
              },
            });
          }}
        />

        <p
          onClick={() => {
            navigate(`/profile`, {
              state: {
                self: true,
              },
            });
          }}
          className="p_in_usercard"
          style={{
            padding: "0px",
            margin: "0px",
            marginLeft: "0.5rem",
            fontSize: 18,
            textDecoration: "none",
            fontWeight: "bold",
            cursor: "pointer",
            flex: 1,
            maxWidth: 170,
            minWidth: 10,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {current_user.username || localStorage?.current_user?.username}
        </p>
        {/* </div> */}
        <IconButton
          style={{ width: 30, height: 30, marginBottom: 0 }}
          onClick={handleClick}
        >
          <Avatar src={MenuSVG} style={{ width: 30, height: 30 }} />
        </IconButton>
      </Container>

      {/* menu */}

      <CustomMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div
          style={{
            width: 180,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <MenuItem
            style={{
              width: "100%",
              padding: "0.5rem",
              margin: "0",
            }}
            onClick={() => navigate("/profile")}
          >
            {allWords.th.profile}
          </MenuItem>
          <Divider />
          <MenuItem
            style={{
              width: "100%",
              padding: "0.5rem",
              margin: "0",
            }}
            onClick={() => navigate("/account_settings")}
          >
            {allWords.th.accSettings}
          </MenuItem>

          <Divider />

          <MenuItem
            style={{
              width: "100%",
              padding: "0.5rem",
              margin: "0",
              color: "#ED4D29",
            }}
            onClick={() => {
              gtmEventLogout();
              handleClose();
              logoutUser();
            }}
          >
            {allWords.th.logout}
          </MenuItem>
        </div>
      </CustomMenu>
    </div>
  );
};

export default UserCard;
