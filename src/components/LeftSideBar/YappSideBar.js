import { IconButton } from "@mui/material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import TownHallIcon from "../../assets/icons/home_icon.svg";
import Meet from "../../assets/icons/meet.svg";
import YappIcon from "../../assets/icons/Yapp_icon.svg";
import YappIconActive from "../../assets/icons/Yapp_icon_active.svg";
import RoundTableIcon from "../../assets/icons/RoundTable_icon.svg";
import { Notifications } from "@material-ui/icons";
import YappSideBarItem from "./YappSideBarItem";
import { MOBILE_VIEW } from "../../constants/env";
import { useDispatch } from "react-redux";
import { getPostData } from "../../redux/actions/postAction";
import logger from "../../logger";
const YappSideBar = ({
  username,
  setModalOpen,
  hasClickedNotification,
  notification_count,
  rtInvite,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let current_user = null;
  try {
    current_user = JSON.parse(
      localStorage.current_user || localStorage.anonymous_user
    );
  } catch (err) {
    logger.error({ err });
  }
  return (
    <div
      style={{
        marginTop: "1.5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "20px",
      }}
    >
      <YappSideBarItem
        Icon={TownHallIcon}
        path="/home"
        onClick={() => {
          dispatch(getPostData(20));
          navigate("/home");
        }}
      />
      <YappSideBarItem
        Icon={RoundTableIcon}
        path={"/roundtable/all"}
        onClick={rtInvite}
      />
      <YappSideBarItem
        Icon={Meet}
        onClick={() => {
          if (!localStorage.current_user && localStorage.anonymous_user)
            return setModalOpen(true);

          if (MOBILE_VIEW)
            return (window.location.href = `https://meet.khulke.com?token=${localStorage.access}`);
          else
            return window.open(
              `https://meet.khulke.com?token=${localStorage.access}`
            );
        }}
      />
      <YappSideBarItem Icon={YappIconActive} />
      <YappSideBarItem
        Icon={Notifications}
        path={"/notifications/interaction"}
        isCompnent={true}
        onClick={() => {
          navigate("/notifications/interaction");
          localStorage.setItem(
            "current_user",
            JSON.stringify({
              ...hasClickedNotification,
              clicked_notification: true,
              notification_count: notification_count,
            })
          );
        }}
      />
      <YappSideBarItem
        username={username}
        path={`/profile/${current_user?.["username"]}`}
        onClick={() => {
          navigate(`/profile/${current_user?.["username"]}`);
        }}
      />
    </div>
  );
};

export default YappSideBar;
