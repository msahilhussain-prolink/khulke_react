import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  REACT_APP_BASE_URL_FOR_NOTIFICATION,
  REACT_APP_BASE_URL_FOR_USER,
} from "../../constants/env";
import { useLocation, useNavigate } from "react-router-dom";
import { ShepherdTourContext } from "react-shepherd";
import { allWords } from "../../App";
import Meet from "../../assets/icons/meet.svg";
import logger from "../../logger";
import { getFriendListData } from "../../redux/actions/interestAction/friendlist";
import ToastHandler from "../../utils/ToastHandler";
import { auto_login_continue } from "../../utils/utils";
import AddPostDialog from "../Post/AddPostDialog";
import DiscardDialog from "../Post/AddPostDialog/DiscardDialog";
import PreloginComp from "../PreLoginComp";
import "./style.css";
import { getInvitationData } from "../../redux/actions/InvitationAction";
import CommonLeftbarItem from "./CommonLeftbarItem";
const LeftSideBar = ({
  expanded,
  setExpanded,
  handleClose,
  icon_menu,
}) => {
  const live_notifcation_data = useSelector((state) => state?.notification?.data);
  const live_notifcation_err = useSelector((state) => state?.notification?.error);
  const toggleSignUp = useSelector((state) => state?.signUpRed?.signUpFlag);
  const interactionNotification = useSelector((state) => state?.interaction);
  const [addPost, setAddPost] = useState(false);
  const [dayDuration, setDayDuration] = useState(1);
  const [hourDuration, setHourDuration] = useState(0);
  const [dialogTitle, setDialogTitle] = useState(null);
  const [discard, setDiscard] = useState(false);
  // const location = window.location.pathname;
  const loc = useLocation();

  const [notification_count, setNotificationCount] = useState(0);
  const [rt_count, setRTCount] = useState(0);
  const [try_rtm, setTryRTM] = useState(0);
  const [screenSize, setScreenSize] = useState(false); // device screen width
  const [msgFlag, setMsgFlag] = useState({ title: "", flag: false });
  const [windowWidth, setWindowWidth] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  const tour = useContext(ShepherdTourContext);

  let current_user = null;
  try {
    if(localStorage.current_user || localStorage.anonymous_user) {
    current_user = JSON.parse(
      localStorage.current_user || localStorage.anonymous_user
    );
    }
  } catch (err) {
    logger.error({ err });
  }

  const userData = useSelector((state) => state.user_profile.data);

  useEffect(() => {
    if (toggleSignUp === true) {
      if (userData && userData?.status === 200)
        if (
          userData?.["data"]?.["self_user"]?.["product_walkthrough"]?.[
            "is_interested"
          ] === true
        ) {
          if (
            userData?.["data"]?.["self_user"]?.["product_walkthrough"]?.[
              "walkthrough_step"
            ] <= 6
          ) {
            tour?.show(
              userData?.["data"]?.["self_user"]?.["product_walkthrough"]?.[
                "walkthrough_step"
              ],
              true
            );
          } else {
            navigate("/roundtable/all");
          }
        }
    }
  }, [userData, toggleSignUp]);

  const getRTMToken = () => {
    if (try_rtm < 4) {
      const configuration = {
        method: "get",
        url: `${REACT_APP_BASE_URL_FOR_USER}/${
          localStorage.anonymous_user
            ? "anonymous/agora-token"
            : "agora_rtm_token"
        }`,
        headers: {
          Authorization: `Bearer ${
            localStorage.access || JSON.parse(localStorage.anonymous_user).token
          }`,
        },
      };
      axios(configuration)
        .then(async function (response) {
          if (response?.status === 200) {
            setTryRTM(0);
            localStorage.setItem("rtm_token", JSON.stringify(response?.data));
          } else {
            setTryRTM(try_rtm + 1);
            getRTMToken();
          }
        })
        .catch(async function (error) {
          const response = error?.response;
          if (!response)
            return localStorage.setItem("rtm_token", "error getting rtm token");
          if (response.status === 401) {
            return await auto_login_continue(getRTMToken);
          }
          localStorage.setItem("rtm_token", "error getting rtm token");
        });
    } else {
      localStorage.setItem("rtm_token", "error getting rtm token");
      return false;
    }
  };

  const getIsTitleVisible = () => {
    return screenSize && !expanded
  }

  const getNotificationCount = () => {
    const config = {
      method: "get",
      url: `${REACT_APP_BASE_URL_FOR_NOTIFICATION}/count`,
      headers: {
        Authorization: `Bearer ${localStorage?.access}`,
      },
    };
    if (localStorage?.access) {
      axios(config)
        .then(async function (response) {
          if (response?.data?.data?.length) {
            setNotificationCount(
              response?.data?.data[0]?.interaction +
                response?.data?.data[0]?.reaction +
                response?.data?.data[0]?.new_followers
            );
            setRTCount(response?.data?.data[0]?.roundtable)
          }
        })
        .catch(async function (error) {
          const response = error?.response;
          if (!response) return;
          if (response?.status === 401) {
            return await auto_login_continue(getNotificationCount);
          }
        });
    }
  };

  useEffect(() => {
    if (live_notifcation_data) {
      setNotificationCount(notification_count + 1);
    }
  }, [live_notifcation_data, live_notifcation_err]);

  useEffect(() => {
    if (localStorage?.current_user && !localStorage?.anonymous_user)
      getNotificationCount();
    if (localStorage?.current_user || localStorage?.anonymous_user) getRTMToken();
  }, [interactionNotification]);

  const dispatch = useDispatch();

  useEffect(() => {
    window.innerWidth < 968 ? setScreenSize(true) : setScreenSize(false);
  }, []);

  let resizeWindow = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  useEffect(() => {
    if (addPost === false && msgFlag?.flag === true) {
      if (msgFlag?.title === "Poll") {
        ToastHandler("sus", allWords.post.pollCreate);
      }
    }
  }, [addPost, msgFlag]);

  useEffect(() => {
    let interests;
    try {
      interests = JSON.parse(localStorage.getItem("current_user"))["interest"];
    } catch (err) {
      try {
        interests = JSON.parse(localStorage.getItem("interests"));
      } catch (suberr) {
        interests = [
          {
            category_name: "Tech",
            sub_category: [
              {
                sub_category_name: "Startups",
              },
            ],
          },
          {
            category_name: "Tech",
            sub_category: [
              {
                sub_category_name: "Venture Capital",
              },
            ],
          },
          {
            category_name: "Tech",
            sub_category: [
              {
                sub_category_name: "Angel Investing",
              },
            ],
          },
        ];
      }
    }
    let stage = {
      data: interests,
    };
    let access = localStorage.getItem("access");
    let data = { interests: stage, access: access, limit: 10, skip: 0 };

    if (current_user?.name) dispatch(getFriendListData(data));
  }, [current_user?.name]);

  const hasClickedNotification = JSON.parse(
    localStorage.getItem("current_user")
  );

  const rtInvite = async () => {
    dispatch(getInvitationData());

    navigate("/roundtable/all");
  };

  return (
    <>
      <CommonLeftbarItem windowWidth={windowWidth} 
      expanded={expanded} 
      setExpanded={setExpanded} 
      condition={false} 
      current_user={current_user}
      handleClose={handleClose}
      isNotItemTtitle={getIsTitleVisible()}
      notification_count={notification_count}
      setNotificationCount={setNotificationCount}
      rtInvite={rtInvite}
      rt_count={rt_count}
      setRTCount={setRTCount}
      setModalOpen={setModalOpen}
      hasClickedNotification={hasClickedNotification}
      setAddPost={setAddPost}
      icon_menu={icon_menu}
      />
      {addPost && (
        <AddPostDialog
          open={addPost}
          setAddPost={setAddPost}
          setDialogTitle={setDialogTitle}
          setDiscard={setDiscard}
          setDayDuration={setDayDuration}
          setHourDuration={setHourDuration}
          setMsgFlag={setMsgFlag}
        />
      )}
      {/* discard */}
      {discard && (
        <DiscardDialog setDiscard={setDiscard} setAddPost={setAddPost} />
      )}

      <PreloginComp
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        icon={<img src={Meet} alt="" width={40} height={40} />}
        title="To open the meet, Login or sign up to Khul Ke"
        description={""}
      />
    </>
  );
};

export default LeftSideBar;
