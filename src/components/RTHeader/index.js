import {
  Dialog as MyDialog,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  Menu as CustomMenuDot,
  Typography,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { channel_token } from "../../pages/AgoraSandbox/settings";
import MemoTimerIcon from "../IconsComponents/TimerIcon";
// import LogoImg from "../../assets/icons/KhulKe_logo.svg";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import { allWords } from "../../App";
import PanelChat from "../../assets/icons/Group 19683.svg";
import Mini from "../../assets/icons/Group 21622.svg";
import EndRT from "../../assets/icons/Group 21625.svg";
import Leave from "../../assets/icons/Group 21627.svg";
import IconInfo from "../../assets/icons/iconInfo.svg";
import timeimg from "../../assets/icons/schedule.svg";
import Dialog from "../../components/LeftSideBar/Dialog";
import {
  REACT_APP_BASE_URL_FOR_ROUNDTABLE,
  REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1,
} from "../../constants/env";
import "../../pages/RoundTable/Create/style.css";
import "./headerStyles.css";
import LeaveMeeting from "./LeaveMeeting.js";
import {
  Avatar,
  Button,
  CancelBtn,
  Container,
  Logo,
  RTKhulkeLogo,
  StyledBox,
  TimeImg,
  Visibility,
} from "./style";

import DialogContent from "@mui/material/DialogContent";

import {
  CancelOutlined,
  FiberManualRecord,
  MoreVert,
  ShareOutlined,
} from "@material-ui/icons";
import live_recording from "../../assets/gif/live_recording.gif";
import audience from "../../assets/icons/audience.svg";
import BackArrowIcon from "../../assets/icons/back-arrow-icon.svg";
import disableGrid from "../../assets/icons/disable_grid.svg";
import fullScreenHeader from "../../assets/icons/Group 21777.svg";
import togglegridIcon from "../../assets/icons/toggle_grid.svg";
import { globalImages } from "../../assets/imagesPath/images";
import { extendMin } from "../../data";
import logger from "../../logger";
import { MinimizeRoundtable } from "../../redux/actions/minimizedRoundtable";
import { getRTSingleData } from "../../redux/actions/roundtableAction/single_roundtable";
import ToastHandler from "../../utils/ToastHandler";
import { auto_login_continue, moengageEvent } from "../../utils/utils";
import SimpleModalComponent from "../SimpleModalComponent";
import RaiseHand from "../ViewerChat/RaiseHand";
import ShowAudienceList from "./AudienceList";
import AudienceVolumeController from "./AudienceVolumeController";
import MutedAudienceList from "./MutedAudienceList";
import PanelistChat from "./PanelistChat/PanelistChat";
import RtTimer from "./RtTime/Timer";
import StarMessage from "./StarMessage/StarMessage";
import RTSearchBar from "./RTSearchBar/RTSearchBar";
import {
  getLiveRTDialogExtend,
  getLiveRTExtended,
  getLiveRTExtendedTime,
  getLiveRTTimer,
} from "../../redux/reducers/liveRTReducer";
import {
  liveRTExtended,
  updateExtendDialog,
  updateRTExtendedTime,
} from "../../redux/actions/LiveRT";
import TimerBanner from "../TimerBanner";
import RtShareComponent from "../RtShareComponent";

const RTHeader = ({
  client,
  role,
  panelChat,
  star,
  leaveChannel,
  endtime,
  setTimeup,
  rtm_channel,
  post_id_list,
  setPostIdList,
  start_time,
  wc_uids,
  handle_wildcard_removal,
  mod_pan_list,
  mute_id,
  mute_username,
  volume,
  setVolume,
  setRtTime,
  rt_id,
  isRecording,
  typeOfRT,
  rtTypeBased,
  muteUser,
  rt_name,
}) => {
  let current_user = null;
  const navigate = useNavigate();
  try {
    current_user = JSON.parse(localStorage.getItem("current_user"));
  } catch (err) {
    logger.error("Not found current user in RTHeader", err);
  }

  const { state: expandedState } = useLocation();

  const dispatch = useDispatch();
  const [endtime_local, setEndTimeLocal] = useState(endtime);
  const [show_extend_time, showExtendTime] = useState(false);
  const [disable, setDisable] = useState(false);
  const [has_unread, setHasUnread] = useState(false);

  const [disablePanelChat, setDisablePanelChat] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [showHand, setShowHand] = useState(false);

  const [moderatorPresent, setModerator] = useState(false);
  const moderatorRef = useRef();
  moderatorRef.current = moderatorPresent;
  const setWasExtended = (value) => {
    dispatch(liveRTExtended(value));
  };

  // Muted Audience List
  const [muted_audience_list, setMutedAudienceList] = useState(false);
  //useSelector calls here
  const timer = useSelector(getLiveRTTimer);
  const was_extended = useSelector(getLiveRTExtended);
  const extendedTime = useSelector(getLiveRTExtendedTime);
  const has_broadcasted = useSelector((state) => state.single_rt.data);

  const setExtendedTime = (data) => {
    dispatch(updateRTExtendedTime(data));
  };

  useEffect(() => {
    setEndTimeLocal(
      has_broadcasted?.data?.[0]?.["r_type"] !== "RECORDING_BASED"
        ? moment(new Date(endtime).getTime()).format().split("+")[0]
        : moment(new Date(endtime).getTime())
            .add(5, "seconds")
            .format()
            .split("+")[0]
    );
  }, [endtime]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });

  let rtMoeData = {
    RoundTableID: rt_id,
    Name: has_broadcasted?.data?.[0]?.["name"],
    "K Type": has_broadcasted?.data?.[0]?.["r_type"],
    "K SubType": has_broadcasted?.data?.[0]?.["open_to_all"],
    "Audience Interaction": 0,
  };

  // ** for Panelist Chat
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState("paper");

  const PanelChatIconRef = useRef();
  const openRef = useRef();
  openRef.current = open;

  const handleClick = (scrollType) => () => {
    setOpen(true);
    moenFunc();
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // ** for vertical Dot
  const [anchorElD, setAnchorElD] = React.useState(null);
  const openD = Boolean(anchorElD);

  const handleClickDot = (event) => {
    setAnchorElD(event.currentTarget);
  };
  const handleCloseDot = () => {
    setAnchorElD(null);
  };

  const [endRoundTable, setEndRoundTable] = useState(false);
  const [leaveMeeting, setLeaveMeeting] = useState(false);
  // const [extend_dialog, setExtendDialog] = useState(false);

  // notify once recording is available popup
  const [openPopup, setOpenPopup] = useState(false);

  // global state
  const extend_dialog = useSelector(getLiveRTDialogExtend);
  const globalHeaderData = useSelector((state) => state.HeaderData.data);
  const somett = useSelector((state) => state.toggleGrid);
  const fullScr = useSelector((state) => state.fullScreen.full);

  const setExtendDialog = (value) => {
    dispatch(updateExtendDialog(value));
  };

  async function renewRTC() {
    try {
      rtm_channel
        .sendMessage({
          text: `renewself||${current_user.username}||${Number(
            extendedTime?.["timeValue"]?.["value"]
          )}`,
        })
        .then(() => {})
        .catch((err) => {});

      await client.renewToken(channel_token);
    } catch (err) {}
  }
  async function extendTime(extendedTime) {
    const data = JSON.stringify({
      rountable_id: rt_id,
      extend_time: Number(extendedTime),
    });

    const config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1}/extend-roundtable/`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(async function (response) {
        if (response.status === 200) {
          setExtendedTime({ timeValue: { value: extendedTime } });
          setExtendDialog(false);
          setWasExtended(true);
          renewRTC();
          moengageEvent("Extend Time", "RoundTable", rtMoeData);
        } else {
          setExtendDialog(false);
          ToastHandler("dan", allWords.misc.somethingwrong);
        }
      })
      .catch(async function (error) {
        const response = error.response;

        if (!response) {
          ToastHandler("dan", allWords.misc.somethingwrong);

          return;
        }

        if (response.status === 401) {
          return await auto_login_continue(() => extendTime(extendedTime));
        }
      });
  }
  // end round table
  async function handleEndRoundTable() {
    if (localStorage.getItem("join_rt")) {
      const rtData = JSON.parse(localStorage.getItem("join_rt"));
      let data = new FormData();
      data.append("roundtable_id", `${rtData.rt_id}`);
      const config = {
        method: "post",
        url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1}/end-roundtable/`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        data: data,
      };
      await axios(config)
        .then(async function (response) {
          if (response.status === 200) {
            moengageEvent("End RoundTable", "RoundTable", rtMoeData);
            rtm_channel
              .sendMessage({
                text: `ownerendrt||${current_user.username}`,
              })
              .then(() => {})
              .catch((err) => {});

            leaveChannel(true);
            setEndRoundTable(false);
          } else {
            setEndRoundTable(false);
            ToastHandler("warn", response.data.message);
          }
        })
        .catch(async function (error) {
          const response = error.response;
          if (!response) return;

          if (response.status === 401) {
            return await auto_login_continue(handleEndRoundTable);
          }
        });
    }
  }

  //panelist chat disable issue fix here
  useEffect(() => {
    const data = {
      rt_id,
      token:
        localStorage.access || JSON.parse(localStorage.anonymous_user).token,
    };
    dispatch(getRTSingleData(data));
  }, []);

  useEffect(() => {
    if (!client) return;
    client.on("user-joined", (user) => {
      if (
        user.uid ===
        JSON.parse(localStorage.getItem("join_rt"))["moderator"]["username"]
      ) {
        setModerator(true);
      }
    });

    if (
      client.uid ===
      JSON.parse(localStorage.getItem("join_rt"))["moderator"]["username"]
    ) {
      setModerator(true);
    }
  }, [client]);

  useEffect(() => {
    if (!has_broadcasted) return;

    if (has_broadcasted?.data[0]?.broadcast_live_flag) {
      setModerator(true);
    }
  }, [has_broadcasted]);

  useEffect(() => {
    let timeElapsed =
      (new Date().getTime() - new Date(start_time)?.getTime()) / 60000;

    if (moderatorPresent && timeElapsed > 0 && disablePanelChat) {
      setDisablePanelChat(false);
    }
  }, [moderatorPresent]);

  useEffect(() => {
    let timeElapsed =
      (new Date().getTime() - new Date(start_time)?.getTime()) / 60000;

    if (timeElapsed >= 10) return;

    setDisablePanelChat(true);

    const blockUntil = -(timeElapsed * 60 * 1000);

    setTimeout(() => {
      if (!moderatorRef.current) return;
      setDisablePanelChat(false);
    }, blockUntil);
  }, []);

  const [start_rec, setStartRec] = useState(false);
  const [stop_disabled, setStopDisabled] = useState(false);

  let timeElapsed =
    (new Date().getTime() - new Date(start_time)?.getTime()) / 60000;

  // stop recording
  const stopRecording = async () => {
    const data = JSON.stringify({
      roundtable_id: rt_id,
    });

    const config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1}/end_rt_recording/`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(async function (response) {
        if (response.data.status === 200) {
          ToastHandler("sus", "Recording Stopped successfully!");

          moengageEvent("Stop Recording", "RoundTable", rtMoeData);

          setStopDisabled(true);
          rtm_channel
            .sendMessage({
              text: `recordingended||${current_user.username}`,
            })
            .then(() => {})
            .catch((err) => {});
        }
      })
      .catch(async function (error) {
        const response = error.response;
        if (response.status === 401) {
          return await auto_login_continue(stopRecording);
        }
      });
  };

  // Start recording
  const startRecording = async () => {
    const data = JSON.stringify({
      roundtable_id: rt_id,
    });

    const config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1}/start_rt_recording/`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(async function (response) {
        if (response.data.status === 200) {
          ToastHandler("sus", "Recording Started successfully!");
          moengageEvent("Start Recording", "RoundTable", rtMoeData);

          setStartRec(true);
          rtm_channel
            .sendMessage({
              text: `recordingstarted||${current_user?.username}`,
            })
            .then(() => {})
            .catch(() => {});
        } else {
          ToastHandler("warn", response.data.message);
          setStartRec(false);
        }
      })
      .catch(async function (error) {
        const response = error.response;

        if (response.status === 401) {
          return await auto_login_continue(startRecording);
        }
      });
  };

  const handleChange = (timeValue) => {
    setExtendedTime({ timeValue });
  };

  const time_value = extendedTime && extendedTime.value;
  /* Handle auto record and show notification to admin and post owner */
  const recordingEvent = (message) => {
    let text = message.text.split("||");
    if (text[0] === "recordingstarted") {
      setStartRec(true);
    } else if (text[0] === "recordingended") {
      setStopDisabled(true);
    }
  };

  useEffect(() => {
    if (!rtm_channel) return;

    rtm_channel?.on("ChannelMessage", recordingEvent);

    return () => {
      rtm_channel?.off("ChannelMessage", recordingEvent);
    };
  }, [rtm_channel]);

  function moenFunc() {
    moengageEvent("Panelsit Chat", "RoundTable", rtMoeData);
  }

  const memoizedAudienceList = useMemo(() => {
    return (
      <ShowAudienceList
        open={open}
        rtm_channel={rtm_channel}
        disabledWildcardAddition={disablePanelChat}
      />
    );
  }, [open, rtm_channel, disablePanelChat]);

  const MemoizedAudienceVolumeController = useMemo(() => {
    return <AudienceVolumeController volume={volume} setVolume={setVolume} />;
  }, [volume, setVolume]);

  const topRef = useRef();
  const topRefSecond = useRef();
  const fullScrRef = useRef();
  fullScrRef.current = fullScr;

  useEffect(() => {
    if (!fullScr || !topRef.current) {
      topRef.current.style.display = "block";
      return;
    }
    const intName = setTimeout(() => {
      if (!topRef.current || !fullScrRef.current) return;
      topRef.current.style.display = "none";
      // topRef.current.style.height = "0px"
      topRefSecond.current.style.paddingTop = "0px";
    }, 5000);

    let timeout;

    function mouseEvent() {
      if (timeout) {
        clearTimeout(timeout);
      }
      if (!topRef.current) return;
      topRef.current.style.display = "block";

      timeout = setTimeout(() => {
        if (!topRef.current || !fullScrRef.current) return;
        topRef.current.style.display = "none";
        topRefSecond.current.style.paddingTop = "0px";
      }, 5000);
    }
    window.addEventListener("mousemove", mouseEvent);
    return () => {
      clearTimeout(intName);
      window.removeEventListener("mousemove", mouseEvent);
    };
  }, [fullScr]);

  useEffect(() => {
    if (!endtime_local) return;

    const existingRTData = JSON.parse(localStorage.getItem("join_rt"));

    existingRTData.end = endtime_local;

    localStorage.setItem("join_rt", JSON.stringify(existingRTData));
  }, [endtime_local]);

  const style1 = {
    width: "100%",
    backgroundColor: "#000",
  };

  const style2 = {
    // width: "",
    backgroundColor: "#fff",
    // paddingTop: "",
  };

  const style3 = {
    backgroundColor: "#000",
    borderRadius: "8px",
    height: "4.5rem",
  };
  const style4 = {};

  // copy rt id link on click of share.
  const handleCopy3 = () => {
    const data = JSON.stringify({
      device_info: device_info,
      roundtable_id: rt_id,
      rt_time: moment(new Date(has_broadcasted?.data?.[0]?.start)).format(
        "hh:mm A"
      ),
    });
    const config = {
      method: "post",
      url: `${
        localStorage.anonymous_user
          ? REACT_APP_BASE_URL_FOR_ROUNDTABLE
          : REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1
      }/${
        localStorage.anonymous_user ? "anonymous/" : ""
      }share-roundtable-data-links/`,
      headers: {
        Authorization: `Bearer ${
          localStorage.access || JSON.parse(localStorage.anonymous_user).token
        }`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        navigator.clipboard.writeText(response.data.data[0]).then(
          function () {
            ToastHandler("sus", allWords.misc.succcopied);
            moengageEvent("Share", "RoundTable", rtMoeData);
          },
          function () {
            /* clipboard write failed */
            ToastHandler("dan", "Failed. try again!");
          }
        );
      })
      .catch(async function (error) {
        const res = error.response;

        if (res.status === 401) {
          return await auto_login_continue(handleCopy3);
        }
      });
  };

  const minimizeRT = () => {
    let localET = endtime_local;
    if (!localET.split("+")[1]) {
      localET = `${localET}+00:00`;
    }
    if (document.fullscreenElement) {
      dispatch({ type: "notFull" });
      document?.exitFullscreen();
    }

    dispatch(
      MinimizeRoundtable({
        ...JSON.parse(localStorage.getItem("join_rt")),
        end: localET,
        volume: volume,
      })
    );
  };

  const isShowExtendButton =
    rtTypeBased !== "RECORDING_BASED" &&
    !disable &&
    !["audience", "panellist", "host"].includes(role) &&
    (["admin-moderator", "moderator", "admin", "admin-panellist"].includes(
      role
    ) ||
      has_broadcasted?.data?.[0]?.moderator?.m_type === "co-owner");

  return (
    <>
      <div
        className="mainOuterHead"
        ref={topRefSecond}
        style={fullScr ? style1 : style2}
      >
        <div
          className="rtheader-head-mobile"
          onClick={() => {
            navigate("/roundtable/all", { replace: true });
          }}
        >
          <img alt="" src={BackArrowIcon} style={{ height: "30px" }} />
        </div>
        {fullScr && was_extended && (
          <>
            <TimerBanner
              bannerColor="#F2C318"
              time={`${extendedTime?.["timeValue"]?.["value"]}`}
              timerText="RoundTable time is extended by"
              isShowMin={true}
              timeColor="#000000"
            />
          </>
        )}
        {fullScr && timer <= "00:05:00" && !was_extended && (
          <div>
            <TimerBanner
              time={`${timer}`}
              isShowButton={isShowExtendButton}
              buttonName="Extend Time"
              timerText="RoundTable is about to end in:"
              onButtonClick={() => {
                setExtendDialog(true);
              }}
            />
          </div>
        )}
        <div
          ref={topRef}
          className="headerDivCollap"
          style={fullScr ? style3 : style4}
        >
          <div
            className="header-div"
            style={{
              paddingTop: fullScr ? "0.5rem" : "",
              paddingBottom: fullScr ? "0.5rem" : "",
              marginLeft: "0",
            }}
          >
            <div
              className="logo-title-cont"
              style={{
                overflow: "hidden",
                paddingLeft: fullScr ? "1.5rem" : "",
              }}
            >
              <RTKhulkeLogo
                className="logo-img"
                style={{ cursor: "pointer", display: fullScr ? "none" : "" }}
                src={globalImages.logo}
                alt="open in new tab"
                onClick={() => {
                  window.open(`${window.location.origin}/roundtable/all`);
                }}
              />
              {fullScr && <div className="rt-name-div">
                <div>
                  <h5 className={fullScr?"header-title header-title-fullScreen":"header-title"} data-tip={rt_name}>
                    {rt_name}
                  </h5>
                  {/* </NoMaxWidthTooltip> */}
                </div>
                </div>}

              {!fullScr && <RTSearchBar minimizeRT={minimizeRT} />}
            </div>
            <div
              className="d-flex header-right-cont"
              style={{
                paddingRight: fullScr ? "1.5rem" : "",
              }}
            >
              <div>
                <div className="rt-header-name">{rt_name}</div>
                <div className="timer-div-parent">
                  {windowWidth > 768 && <>{memoizedAudienceList}</>}
                  <RtTimer
                    windowWidth={windowWidth}
                    rtm_channel={rtm_channel}
                    endtime_local={endtime_local}
                    setEndTimeLocal={setEndTimeLocal}
                    setWasExtended={setWasExtended}
                    was_extended={was_extended}
                    showExtendTime={showExtendTime}
                    setDisable={setDisable}
                    setTimeup={setTimeup}
                    extendedTime={extendedTime}
                    setExtendedTime={setExtendedTime}
                    setRtTime={setRtTime}
                  />
                  {windowWidth < 769 && <>{memoizedAudienceList}</>}
                </div>
              </div>

              {windowWidth > 768 && (
                <>
                  {/* -------- Raise hand logics here --------*/}
                  {rtTypeBased !== "RECORDING_BASED" && (
                    <RaiseHand
                      role={role}
                      rtm_channel={rtm_channel}
                      handle_wildcard_removal={handle_wildcard_removal}
                      disabledChat={disablePanelChat}
                      showHand={showHand}
                      setShowHand={setShowHand}
                    />
                  )}
                </>
              )}

              <div
                className="rtheader-star-msg"
                style={{
                  display: fullScr ? "none" : "flex",
                  // display: "flex",
                  alignItems: "center",
                  color: fullScr ? "white !important" : "",
                  flexDirection: "row",
                  marginLeft: 0,
                  position: "initial",
                  bottom: "initial",
                  gap: "5px"
                }}
              >
                {windowWidth > 768 && (
                  <>
                    {star && (
                      <StarMessage
                        role={role}
                        post_id_list={post_id_list}
                        scroll={scroll}
                        setScroll={setScroll}
                        setPostIdList={setPostIdList}
                        rtm_channel={rtm_channel}
                        handle_wildcard_removal={handle_wildcard_removal}
                        mod_pan_list={mod_pan_list}
                        wc_uids={wc_uids}
                      />
                    )}

                    {rtTypeBased !== "RECORDING_BASED" && (
                      <>
                        {panelChat &&
                          role !== "host" &&
                          role !== "owner" &&
                          !globalHeaderData?.wc_uids?.includes(
                            current_user.username
                          ) && (
                            <div style={{ position: "relative" }}>
                              {has_unread && (
                                <span
                                  style={{
                                    position: "absolute",
                                    right: "15px",
                                    top: "13px",
                                    backgroundColor: "#ed4d29",
                                    padding: "3px",
                                    borderRadius: "100%",
                                    opacity: "1!important",
                                  }}
                                ></span>
                              )}

                              <>
                                <motion.div>
                                  <IconButton
                                    onClick={handleClick("paper")}
                                    style={{
                                      width: 45,
                                      height: 45,
                                      position: "relative",
                                      zIndex: 10,
                                      margin: "0px",
                                    }}
                                    disabled={disablePanelChat}
                                    ref={PanelChatIconRef}
                                  >
                                    <TimeImg src={PanelChat} />
                                  </IconButton>
                                </motion.div>
                                <div className="circle-around-chatIcon"></div>
                              </>
                            </div>
                          )}
                      </>
                    )}
                  </>
                )}

                {(role === "audience" ||
                  role === "admin" ||
                  rtTypeBased == "RECORDING_BASED") &&
                  !window.innerWidth < 768 &&
                  MemoizedAudienceVolumeController}

                {/* toggle grid icon---------- */}
                {rtTypeBased !== "RECORDING_BASED" && (
                  <>
                    <div className="toggleIconDiv">
                      {somett?.showAll ? (
                        <img
                          onClick={() => dispatch({ type: "one" })}
                          src={togglegridIcon}
                          alt="toggle icon all"
                          height="90%"
                        />
                      ) : (
                        <img
                          onClick={() => dispatch({ type: "all" })}
                          src={disableGrid}
                          alt="toggle icon one"
                          height="90%"
                        />
                      )}
                    </div>
                  </>
                )}

                {/* --------------------------- */}
              </div>
              <div className="rtheader-clickdot">
                <motion.div>
                  <IconButton
                    onClick={handleClickDot}
                    style={{
                      width: 45,
                      height: 45,
                      marginLeft: fullScr ? "0.5rem" : "",
                      marginRight: fullScr ? "-0.3rem" : "",
                      // border: "1px solid red"
                      position: "initial",
                      right: "initial",
                    }}
                    disableTouchRipple
                  >
                    <MoreVert
                      fontSize="large"
                      style={{ color: fullScr ? "white" : "" }}
                    />
                  </IconButton>
                </motion.div>
              </div>
            </div>
          </div>

          {muted_audience_list && !open ? (
            <MutedAudienceList
              setMutedAudienceList={setMutedAudienceList}
              muted_audience_list={muted_audience_list}
              mute_id={mute_id}
              mute_username={mute_username}
              muteUser={muteUser}
            />
          ) : (
            ""
          )}

          {/* commenting out unneccessary gap below header div */}
          <div
            className="justify-content-between container-fluid not-recording-based-container"
            style={{ height: fullScr ? "5px" : "" }}
          >
            <div className="d-flex" style={{ alignSelf: "center" }}>
              {/* Panelist Chat */}
              {rtTypeBased !== "RECORDING_BASED" && (
                <PanelistChat
                  open={open}
                  handleClose={handleClose}
                  scroll={scroll}
                  rtm_channel={rtm_channel}
                  setHasUnread={setHasUnread}
                  role={role}
                  PanelChatIconRef={PanelChatIconRef}
                />
              )}

              <CustomMenuDot
                anchorEl={anchorElD}
                open={openD}
                onClose={handleCloseDot}
                onClick={handleCloseDot}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    // color: "white",
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
                      right: 20,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <div
                  style={{
                    width: 210,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {rtTypeBased !== "RECORDING_BASED" && (
                    <>
                      {show_extend_time &&
                        role !== "audience" &&
                        role !== "panellist" &&
                        role !== "host" && (
                          <>
                            {role === "admin" ||
                            role === "admin-panellist" ||
                            role === "admin-moderator" ||
                            has_broadcasted?.data?.[0]?.moderator?.m_type ===
                              "co-owner" ? (
                              <>
                                <MenuItem
                                  disabled={disable}
                                  style={{
                                    width: "100%",
                                    padding: "0.6rem 0.7rem",
                                    margin: "0",
                                    color: "#475376",
                                  }}
                                  onClick={() => {
                                    setExtendDialog(true);
                                  }}
                                  className="d-flex justify-content-start text-muted"
                                >
                                  <MemoTimerIcon />
                                  <Visibility>aa</Visibility>
                                  {allWords.misc.livert.extentTime}
                                </MenuItem>
                                <Divider />
                              </>
                            ) : null}
                          </>
                        )}
                    </>
                  )}

                  <MenuItem
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      margin: "0",
                      color: "#F15B29",
                    }}
                    onClick={() => {
                      setLeaveMeeting(true);
                    }}
                  >
                    <Avatar
                      src={Leave}
                      style={{
                        width: "26px",
                        height: "26px",
                      }}
                    />
                    {/* <small style={{ visibility: "hidden", userSelect: "none" }}>
                      a
                    </small> */}
                    <p className="title-for-options-rt">
                      {" "}
                      {allWords.misc.livert.leave}
                    </p>
                  </MenuItem>
                  <Divider />
                  {timeElapsed > 0.5 && (
                    <>
                      <MenuItem
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          margin: "0",
                          color: "#000",
                        }}
                      >
                        <Link
                          style={{
                            textDecoration: "none",
                          }}
                          className="disclaimer_link"
                          to="/roundtable/disclaimer"
                          target="_blank"
                        >
                          <img
                            style={{ height: "26px" }}
                            src={IconInfo}
                            alt="no-info-icn"
                          />

                          <p
                            className="title-for-options-rt"
                            style={{ marginLeft: "0" }}
                          >
                            {" "}
                            {allWords.misc.livert.disclaimer}
                          </p>
                        </Link>
                      </MenuItem>
                      <Divider />
                    </>
                  )}

                  <MenuItem
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      margin: "0",
                      color: "#FFBC00",
                    }}
                    disabled={disablePanelChat}
                    onClick={() => {
                      let localET = endtime_local;
                      if (!localET.split("+")[1]) {
                        localET = `${localET}+00:00`;
                      }
                      if (document.fullscreenElement) {
                        dispatch({ type: "notFull" });
                        document?.exitFullscreen();
                      }

                      dispatch(
                        MinimizeRoundtable({
                          ...JSON.parse(localStorage.getItem("join_rt")),
                          end: localET,
                          volume: volume,
                        })
                      );

                      if (!expandedState?.expandedFrom) {
                        navigate("/roundtable/all");
                      } else {
                        navigate(expandedState?.expandedFrom);
                      }
                    }}
                  >
                    <Avatar
                      src={Mini}
                      style={{
                        width: "26px",
                        height: "26px",
                      }}
                    />
                    {/* <small style={{ visibility: "hidden", userSelect: "none" }}>
                      a
                    </small> */}
                    <p className="title-for-options-rt">
                      {allWords.misc.livert.mini}
                    </p>
                  </MenuItem>
                  <Divider />
                  {/* fullscreen option in header */}
                  <MenuItem
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      margin: "0",
                      color: "#54B798",
                    }}
                    onClick={() => dispatch({ type: "full" })}
                    disabled={fullScr ? true : false}
                  >
                    <img
                      alt=""
                      src={fullScreenHeader}
                      style={{
                        height: "25px",
                        width: "25px",
                        marginLeft: "0.1rem",
                        marginRight: "0.25rem",
                      }}
                    />
                    <p
                      className="title-for-options-rt"
                      style={{ marginLeft: "2px" }}
                    >
                      {allWords.misc.livert.full}
                    </p>
                  </MenuItem>

                  {/* TODO: Keeping this till Live RT enhancement. After that we will remove this part. */}
                  {rtTypeBased !== "RECORDING_BASED" && (
                    <>
                      {role !== "audience" &&
                        role !== "panellist" &&
                        role !== "host" && (
                          <>
                            {role === "admin-moderator" ||
                            role === "admin" ||
                            role === "admin-panellist" ||
                            has_broadcasted?.data?.[0]?.moderator?.m_type ===
                              "co-owner" ? (
                              <>
                                <Divider />
                                <MenuItem
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    margin: "0",
                                    color: "#ED4D29",
                                  }}
                                  onClick={() => {
                                    if (document.fullscreenElement) {
                                      dispatch({ type: "notFull" });
                                      document?.exitFullscreen();
                                    }
                                    setEndRoundTable(true);
                                  }}
                                >
                                  <Avatar
                                    src={EndRT}
                                    style={{
                                      padding: "0.1rem",
                                      width: "29px",
                                      height: "29px",
                                    }}
                                  />
                                  <p
                                    className="title-for-options-rt"
                                    style={{ marginLeft: "3px" }}
                                  >
                                    {allWords.misc.endrt}
                                  </p>
                                </MenuItem>
                              </>
                            ) : null}
                          </>
                        )}

                      {windowWidth < 769 ? (
                        <>
                          {showHand ? (
                            <>
                              <Divider />
                              <MenuItem
                                style={{
                                  width: "100%",
                                  padding: "0rem",
                                  margin: "0",
                                  color: "#66B984",
                                }}
                              >
                                {rtTypeBased !== "RECORDING_BASED" && (
                                  <RaiseHand
                                    role={role}
                                    rtm_channel={rtm_channel}
                                    handle_wildcard_removal={
                                      handle_wildcard_removal
                                    }
                                    disabledChat={disablePanelChat}
                                    showHand={showHand}
                                    setShowHand={setShowHand}
                                    msg="Raise Hand"
                                    width="100%"
                                  />
                                )}
                              </MenuItem>
                            </>
                          ) : null}

                          <Divider />
                          <MenuItem
                            style={{
                              width: "100%",
                              padding: "0.5rem",
                              margin: "0",
                              color: "#66B984",
                            }}
                            onClick={handleClick("paper")}
                            disabled={disablePanelChat}
                            ref={PanelChatIconRef}
                          >
                            <Avatar src={PanelChat} /> &nbsp; Panelist Chat
                          </MenuItem>

                          <Divider />
                          <MenuItem
                            style={{
                              width: "100%",
                              padding: "0.5rem",
                              margin: "0",
                              color: "#66B984",
                            }}
                          >
                            {star && (
                              <StarMessage
                                role={role}
                                post_id_list={post_id_list}
                                scroll={scroll}
                                setScroll={setScroll}
                                setPostIdList={setPostIdList}
                                rtm_channel={rtm_channel}
                                handle_wildcard_removal={
                                  handle_wildcard_removal
                                }
                                mod_pan_list={mod_pan_list}
                                wc_uids={wc_uids}
                                msg="Starred Message"
                              />
                            )}
                          </MenuItem>
                        </>
                      ) : null}
                    </>
                  )}

                  {role !== "audience" &&
                    role !== "panellist" &&
                    role !== "host" && (
                      <>
                        {role === "admin-moderator" ||
                        role === "moderator" ||
                        role === "admin" ||
                        role === "admin-panellist" ||
                        has_broadcasted?.data?.[0]?.moderator?.m_type ===
                          "co-owner" ? (
                          <>
                            <Divider />
                            <MenuItem
                              style={{
                                width: "100%",
                                padding: "0.5rem",
                                margin: "0",
                                color: " black",
                              }}
                              onClick={() => {
                                setMutedAudienceList(true);
                              }}
                            >
                              <img
                                alt=""
                                src={audience}
                                style={{
                                  height: "26px",
                                  width: "26px",
                                }}
                              />
                              <p className="title-for-options-rt">
                                {allWords.misc.muteda}
                              </p>
                            </MenuItem>
                          </>
                        ) : null}
                      </>
                    )}
                  {has_broadcasted?.data?.[0]?.open_to_all !== "secret" ? (
                    <>
                      <Divider />
                      <MenuItem
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          margin: "0",
                          color: "#000",
                        }}
                      >
                        <RtShareComponent
                          rt_id={rt_id}
                          className="rt-header-share-btn"
                        />
                      </MenuItem>
                    </>
                  ) : null}
                </div>
              </CustomMenuDot>
            </div>
            {/* Extend RoundTable Dialog */}
            <MyDialog
              open={extend_dialog}
              PaperProps={{
                style: { borderRadius: 16, minHeight: 300, minWidth: 600 },
              }}
            >
              <DialogTitle>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p
                    style={{ fontWeight: "bold", flex: 1, textAlign: "center" }}
                  >
                    {allWords.misc.livert.extentTime}
                  </p>
                  <div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.1, opacity: 0.8 }}
                    >
                      <IconButton
                        id="close_button"
                        onClick={() => setExtendDialog(false)}
                        style={{ width: 50, height: 50 }}
                      >
                        <CancelOutlined />
                      </IconButton>
                    </motion.div>
                  </div>
                </div>
              </DialogTitle>
              <DialogContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  color="#63779C"
                  sx={{ fontFamily: "Work Sans", fontSize: "1rem", opacity: 1 }}
                >
                  {allWords.misc.livert.extendbymin}
                </Typography>
                <StyledBox>
                  <TimeImg src={timeimg} />
                  <FormControl
                    variant="filled"
                    sx={{ m: 1, minWidth: 250, maxWidth: 270 }}
                  >
                    <Select
                      placeholder={allWords.misc.timer.selectTime}
                      labelId="demo-simple-select-filled-label"
                      id="demo-simple-select-filled"
                      value={time_value}
                      options={extendMin}
                      closeMenuOnSelect={true}
                      onChange={handleChange}
                      components={{
                        IndicatorSeparator: () => null,
                      }}
                      styles={{
                        menu: (base) => ({
                          ...base,
                          height: "120px",
                          backgroundColor: "white",
                        }),
                        menuList: (base) => ({
                          ...base,
                          height: "120px",
                          backgroundColor: "white",
                        }),
                      }}
                    />
                  </FormControl>
                  <div className="minute">{allWords.misc.livert.minutes}</div>
                </StyledBox>
                <Button
                  bgColor
                  style={{ textTransform: "uppercase" }}
                  onClick={() => {
                    setEndTimeLocal(
                      moment(
                        new Date(endtime_local).getTime() +
                          Number(extendedTime?.["timeValue"]?.["value"]) * 60000
                      )
                        .format()
                        .split("+")[0]
                    );

                    setDisable(true);
                    extendTime(extendedTime?.["timeValue"]?.["value"]);
                  }}
                >
                  {allWords.misc.livert.extentTime}
                </Button>
              </DialogContent>
            </MyDialog>
            {/* Leave Roundtable */}
            <Dialog
              title={allWords.misc.livert.leave}
              open={leaveMeeting}
              setOpen={setLeaveMeeting}
              onCloseBtnClick={() => {
                setLeaveMeeting(false);
              }}
            >
              <LeaveMeeting
                leaveChannel={leaveChannel}
                setLeaveMeeting={setLeaveMeeting}
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
                isRecording={isRecording}
                startedRecording={start_rec}
                typeOfRT={typeOfRT}
              />
            </Dialog>

            {/* End Roundtable */}
            <Dialog
              title={allWords.misc.livert.endRt}
              open={endRoundTable}
              setOpen={setEndRoundTable}
              onCloseBtnClick={() => {
                setEndRoundTable(false);
              }}
            >
              <Container>
                <small>{allWords.misc.livert.sureendthis}</small>
                <div className="btn_container">
                  <CancelBtn
                    style={{ marginTop: "1rem" }}
                    onClick={handleEndRoundTable}
                  >
                    {allWords.misc.yes}
                  </CancelBtn>
                  <Button
                    style={{ marginTop: "1rem" }}
                    bgColor
                    onClick={() => {
                      setEndRoundTable(false);
                    }}
                  >
                    {allWords.misc.no}
                  </Button>
                </div>
              </Container>
            </Dialog>
            {/* <hr /> */}
          </div>
        </div>
      </div>

      {/* notification once recording of rt is available popup */}
      <SimpleModalComponent
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        leaveChannel={leaveChannel}
        rtId={rt_id}
      />
    </>
  );
};

export default RTHeader;
