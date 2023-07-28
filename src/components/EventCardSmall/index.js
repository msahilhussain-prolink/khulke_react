import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import {
  REACT_APP_BASE_URL_FOR_ROUNDTABLE,
  POST_API_BASE_URL,
  REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1,
} from "../../constants/env";
import MemoAudioBased from "../IconsComponents/AudioBased";
import MemoVideoBased from "../IconsComponents/VideoBased";
import MemoGlobeIcon from "../IconsComponents/GlobeBased";
import MemoPrivacyIcon from "../IconsComponents/PrivateBased";
import MemoConfidentialIcon from "../IconsComponents/ConfidentialBased";

import { useDispatch, useSelector } from "react-redux";
import { getPostData } from "../.././redux/actions/postAction";
import {
  CircularProgress,
  Divider,
  Menu as CustomMenu,
  MenuItem,
} from "@mui/material";
import {
  Container,
  CardHeader,
  CardBody,
  CardFooter,
  ImgContainer,
  CardTitle,
  CardTime,
  CardDiv,
  TimeImg,
  CommentsIcon,
  UpBtn,
  MainDiv,
  TitleDiv,
  TitleTxt,
  PastBtn,
  LiveBtn,
} from "./style";

import "./style.css";
import timeimg from "../../assets/icons/schedule.svg";
import check from "../../assets/icons/Group 21224.svg";
import Chat from "../../assets/icons/Group 19541.svg";
import Dialog from "../LeftSideBar/Dialog";
import { auto_login_continue, moengageEvent } from "../../utils/utils";
import ToastHandler from "../../utils/ToastHandler";
import { ScheduleOutlined, ShareOutlined } from "@material-ui/icons";
import { allWords } from "../../App";
import { rtActionData } from "../../redux/actions/roundtableAction/rtAction";

const EventCard = ({
  cover_img,
  title,
  timestamp,
  cardfooter,
  bottomHr,
  txt,
  style,
  rt_nature,
  rt_type,
  rt_id,
  speakers,
  moderator,
  reminder_status = false,
  request_status = false,
  rt_details = null,
  live,
  upcoming,
  past,
  owner_details,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const current_user = JSON.parse(
    localStorage.current_user || localStorage.anonymous_user
  );

  const rtAction = useSelector((state) => state.rtActionRed.data);

  const [status, setStatus] = useState("past");
  const [set_reminder_status, setReminderStatus] = useState(reminder_status);
  const [shareProgress, setShareProgress] = useState(false);
  const [joinFlg, setJoinFlg] = useState(false);

  useEffect(() => {
    if (upcoming === true || upcoming === "true") {
      setStatus("upcoming");
    } else if (live === true || live === "true") {
      setStatus("live");
    } else {
      setStatus("past");
    }
  }, []);

  // * Menu Option
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [notification_text, setNotificationText] = useState("");
  const [notify_box, setNotifyBox] = useState(false);
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    if (shareProgress) {
      if (rtAction && rtAction?.data?.status == 200) {
        setShareProgress(false);
        setRedirectUrl(rtAction?.data?.data?.[0]?.url);
      }
    }
  }, [rtAction]);

  const handleSetReminder = () => {
    let config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/set-reminder`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ roundtable_id: rt_id }),
    };
    axios(config)
      .then(async (res) => {
        if (res.status === 200) {
          setReminderStatus(true);
        } else {
          setReminderStatus(false);
        }
      })
      .catch(async (err) => {
        const res = err.res;
        if (!res) return setReminderStatus(false);
        if (res.status === 401) {
          return await auto_login_continue(handleSetReminder);
        }
        setReminderStatus(false);
      });
  };

  const agora_join = (blocked_array = [], warn_array = []) => {
    let role = null;
    if (rt_details.speaker_flag) {
      if (rt_details.owner_flag) {
        role = "admin-panellist";
      } else {
        role = "panellist";
      }
    } else if (rt_details.moderator_flag) {
      if (rt_details.owner_flag) {
        role = "admin-moderator";
      } else {
        role = "moderator";
      }
    } else if (rt_details.owner_flag) {
      if (rt_details.moderator_flag) {
        role = "admin-moderator";
      } else {
        role = "admin";
      }
    } else {
      role = "audience";
    }
    localStorage.removeItem("join_rt");
    localStorage.setItem(
      "join_rt",
      JSON.stringify({
        uid: current_user.username,
        rt_id: rt_id,
        moderator: moderator,
        speakers: speakers,
        name: current_user.name,
        channelName: rt_details.agora_channel,
        token: rt_details.agora_token,
        rt_name: rt_details.name,
        rt_type: rt_details.r_type,
        start: rt_details.start,
        end: rt_details.end,
        viewer_count: rt_details.viewer_count,
        role: role,
        blocked_array: blocked_array,
        warn_array: warn_array,
        owner: owner_details,
      })
    );
    if (localStorage.join_rt) {
      window.location.replace("/roundtable/join");
    }
  };

  useEffect(() => {
    if (joinFlg) {
      if (rtAction && rtAction?.data?.status === 200) {
        agora_join(
          rtAction?.data?.data?.[0]?.blocked,
          rtAction?.data?.data?.[0]?.warn
        );
        moengageEvent("Join", "RoundTable", {
          RoundTableID: rt_id,
          Name: title,
          "K Type": rt_type,
          "K SubType": rt_nature,
          "Audience Interaction": 0,
        });
      } else {
        if (rtAction && rtAction?.data?.status === 253) {
          if (
            rtAction.data.message !==
            "You're not allowed to join this RoundTable."
          ) {
            if (
              rtAction.data.message ===
              "This round table has been ended by Owner"
            ) {
              setNotifyBox(true);
              setNotificationText("This RoundTable has been ended by Owner");
            } else {
              setNotifyBox(true);
              setNotificationText(res.data.message); //Replace with a dialog popup
            }
          }
        }
      }
    }
  }, [rtAction]);

  const joinRT = async () => {
    dispatch(rtActionData({ rt_id: rt_id, action: "JOIN" }));
    setJoinFlg(true);
  };

  const [set_request_access, SetRequestAccess] = useState(request_status);
  const [request_msg, setRequestMsg] = useState("");
  const [req_msg, setReqMsg] = useState(false);
  const handleRequestAccess = async () => {
    const FormData = require("form-data");
    const data = new FormData();
    let requestValue = {
      roundtable_id: rt_id,
      type: "SEEK-INVITATION",
    };

    data.append("data", JSON.stringify(requestValue));

    const config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/seek-invitation/`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
      },
      data: data,
    };

    await axios(config)
      .then(async function (response) {
        if (response.status === 200 || response.status === 253) {
          SetRequestAccess(true);
          setRequestMsg(JSON.stringify(response.data.message));
        }
      })
      .catch(async function (error) {
        const res = error.response;
        if (!res) {
          SetRequestAccess(false);
          return setRequestMsg("");
        }

        if (res.status === 401) {
          return await auto_login_continue(handleRequestAccess);
        }
      });
  };

  const handleCopy = () => {
    dispatch(rtActionData({ rt_id: rt_id, action: "SHARE" }));
    setShareProgress(true);
  };

  const handleShare = async () => {
    let data = new FormData();
    data.append(
      "message",
      `{"type":"TEXT","text":"${window.location.origin}/roundtable?id=${rt_id}"}`
    );

    const config = {
      method: "post",
      url: `${POST_API_BASE_URL}/post-media`,
      headers: {
        "device-type": "android",
        "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        ToastHandler("sus", "Successfully Shared!");
        dispatch(getPostData());
      })
      .catch();
  };

  const handleCardClick = (e) => {
    if (status === "upcoming" && !e.target.id.includes("button")) {
      ToastHandler(
        "info",
        "This Roundtable is not yet started. We will notify you once the roundtable is ready to join."
      );
    } else {
      navigate({
        pathname: "/roundtable",
        search: `?id=${rt_id}`,
        state: { rt_details_value: "details_page", rt_details: rt_details },
      });
    }
  };

  return (
    <MainDiv style={{ cursor: "pointer" }} onClick={handleCardClick}>
      {txt && (
        <TitleDiv>
          <TimeImg src={check} />
          <TitleTxt>
            {" "}
            @Rajat Lalima{" "}
            <span style={{ color: "#63779C", fontWeight: "lighter" }}>
              {" "}
              Accepted RoundTable
            </span>
          </TitleTxt>
        </TitleDiv>
      )}
      <Container style={style}>
        <CardHeader>
          {rt_nature === "public" && (
            <>
              <MemoGlobeIcon width="18" height="18" color="red" />
              <p style={{ fontSize: "12px" }}>{allWords.createRT.optPub}</p>
            </>
          )}
          {rt_nature === "private" && (
            <>
              <MemoPrivacyIcon width="18" height="18" color="red" />
              <p style={{ fontSize: "12px" }}>{allWords.createRT.optPriv}</p>
            </>
          )}
          {(rt_nature === "confidential" || rt_nature === "secret") && (
            <>
              <MemoConfidentialIcon width="18" height="18" color="red" />
              <p style={{ fontSize: "12px" }}>{allWords.createRT.optConfi}</p>
            </>
          )}
          &nbsp; &nbsp;
          {rt_type === "TEXT_BASED" && (
            <>
              <CommentsIcon
                width="15px"
                height="15px"
                fontSize="0.4rem"
                color="red"
                src={Chat}
              />
              <p style={{ fontSize: "12px" }}>Chat</p>
            </>
          )}
          {rt_type === "AUDIO_STREAMING" && (
            <>
              <MemoAudioBased
                width="14px"
                height="14px"
                fontSize="0.4rem"
                color="red"
                marginTop="2px"
              />
              <p style={{ fontSize: "12px" }}>{allWords.createRT.audioBtn}</p>
            </>
          )}
          {rt_type === "VIDEO_STREAMING" && (
            <>
              <MemoVideoBased
                width="14px"
                height="14px"
                fontSize="0.4rem"
                color="red"
                marginTop="1px"
              />
              <p style={{ fontSize: "12px" }}>{allWords.createRT.videoBtn}</p>
            </>
          )}
          {upcoming && (
            <UpBtn
              style={{
                padding: "4px 10px",
                width: "fit-content",
                fontSize: "12px",
              }}
            >
              {allWords.profile.contentCardRight.opt2}
            </UpBtn>
          )}
          {live && (
            <LiveBtn
              style={{
                padding: "4px 10px",
                width: "fit-content",
                fontSize: "12px",
              }}
            >
              {allWords.profile.contentCardRight.opt1}
            </LiveBtn>
          )}
          {past && (
            <PastBtn
              style={{
                padding: "4px 10px",
                width: "fit-content",
                fontSize: "12px",
              }}
            >
              {allWords.misc.past}
            </PastBtn>
          )}
        </CardHeader>
        <CardBody>
          {cover_img && <ImgContainer src={cover_img} />}

          <div className="mt-2" style={{ overflow: "hidden" }}>
            <CardTitle>{title}</CardTitle>
            <CardDiv className="mt-4">
              <TimeImg src={timeimg} />
              <CardTime>
                <div className="d-flex text-muted">
                  {moment(new Date(timestamp?.["start"]))
                    .local()
                    .format("DD MMM")}
                  <span>&nbsp;-&nbsp;</span>
                  {moment(new Date(timestamp?.["start"]))
                    .local()
                    .format("hh:mm A")}
                  <span style={{ padding: "0 10px" }}>-</span>
                  {moment(new Date(timestamp?.["end"]))
                    .local()
                    .format("hh:mm A")}
                </div>
              </CardTime>
            </CardDiv>
          </div>
        </CardBody>

        {cardfooter && status !== "past" && (
          <>
            <CardFooter style={{ marginTop: "5px" }}>
              {!past && (
                <>
                  {rt_nature === "public" && upcoming && (
                    <>
                      {reminder_status || set_reminder_status ? (
                        <button
                          style={{
                            boxShadow: "none",
                            border: "1px solid lightgray",
                            cursor: "not-allowed",
                            padding: "7px 9px",
                          }}
                          className="set-reminder-white"
                          id="reminder_set_button"
                        >
                          {allWords.misc.sreminder}
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={handleSetReminder}
                            id="reminder_button"
                            className="set-reminder-button"
                          >
                            <ScheduleOutlined
                              id="reminder-button-clock"
                              className="icon"
                              style={{ width: "15px", height: "15px" }}
                            />
                            {allWords.misc.rset}
                          </button>
                        </>
                      )}
                    </>
                  )}
                  {rt_nature === "public" && (
                    <>
                      {live && (
                        <button
                          id="join_button"
                          className="d-flex join-btn-green"
                          onClick={joinRT}
                        >
                          &nbsp; {allWords.misc.jnow} &nbsp;
                        </button>
                      )}
                    </>
                  )}

                  {rt_nature === "secret" && (
                    <>
                      {rt_nature === "secret" && upcoming && (
                        <>
                          {reminder_status || set_reminder_status ? (
                            <button
                              style={{
                                boxShadow: "none",
                                border: "1px solid lightgray",
                                cursor: "not-allowed",
                                padding: "7px 9px",
                              }}
                              className="set-reminder-white"
                              id="reminder_set_button"
                            >
                              {allWords.misc.rset}
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={handleSetReminder}
                                id="reminder_button"
                                className="set-reminder-button"
                              >
                                <ScheduleOutlined
                                  id="reminder-button-clock"
                                  className="icon"
                                  style={{ width: "15px", height: "15px" }}
                                />
                                {allWords.misc.sreminder}
                              </button>
                            </>
                          )}
                        </>
                      )}

                      {rt_nature === "secret" && live && (
                        <>
                          <button
                            id="join_button"
                            className="d-flex join-btn-green"
                            onClick={joinRT}
                          >
                            &nbsp; {allWords.misc.jnow} &nbsp;
                          </button>
                        </>
                      )}
                    </>
                  )}

                  {rt_nature === "private" && (
                    <>
                      {rt_nature === "private" &&
                        upcoming &&
                        request_status === true && (
                          <>
                            {reminder_status || set_reminder_status ? (
                              <button
                                style={{
                                  boxShadow: "none",
                                  border: "1px solid lightgray",
                                  cursor: "not-allowed",
                                  padding: "7px 9px",
                                }}
                                className="set-reminder-white"
                                id="reminder_set_button"
                              >
                                {allWords.misc.rset}
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={handleSetReminder}
                                  id="reminder_button"
                                  className="set-reminder-button"
                                >
                                  <ScheduleOutlined
                                    id="reminder-button-clock"
                                    className="icon"
                                    style={{ width: "15px", height: "15px" }}
                                  />
                                  {allWords.misc.sreminder}
                                </button>
                              </>
                            )}
                          </>
                        )}
                      {rt_nature === "private" &&
                        (upcoming || live) &&
                        request_status !== true && (
                          <>
                            {request_status || set_request_access ? (
                              <>
                                <button
                                  style={{
                                    boxShadow: "none",
                                    border: "1px solid lightgray",
                                    cursor: "not-allowed",
                                    padding: "7px 9px",
                                  }}
                                  className="request-acccess-white "
                                  id="request_sent_button"
                                >
                                  {allWords.misc.reqs}
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="d-flex request-acccess-green "
                                  onClick={() => {
                                    setReqMsg(true);
                                    handleRequestAccess();
                                  }}
                                  id="request_access_button"
                                >
                                  {allWords.misc.reqacc}
                                </button>
                              </>
                            )}
                          </>
                        )}

                      {rt_nature === "private" && (
                        <>
                          {live && request_status === true && (
                            <>
                              <button
                                id="join_button"
                                className="d-flex join-btn-green"
                                onClick={joinRT}
                              >
                                &nbsp; {allWords.misc.jnow} &nbsp;
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                  {status !== "live" && status !== "upcoming" && (
                    <span id="spacer" style={{ userSelect: "none" }}>
                      &nbsp;
                    </span>
                  )}
                </>
              )}

              {rt_type !== "secret" && (
                <button
                  id="share_button"
                  onClick={handleClick}
                  style={{
                    maxHeight: "fit-content",
                    padding: "5px 7px",
                    fontSize: "12px",
                    border: "1px solid transparent",
                    outline: "outline",
                    backgroundColor: "white",
                    color: "#11141C",
                  }}
                >
                  <ShareOutlined
                    id="share_icon_button"
                    className="icon"
                    style={{ width: "20px", height: "20px" }}
                  />{" "}
                </button>
              )}
            </CardFooter>
          </>
        )}

        {bottomHr && (
          <hr style={{ borderColor: "1px solid lightgray", opacity: "0.2" }} />
        )}
      </Container>
      {/* menu */}
      <CustomMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
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
              right: 14,
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
            width: 200,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <MenuItem
            style={{ width: "100%", padding: "0.5rem", margin: "0" }}
            onClick={handleCopy}
            id="copy_button"
          >
            {loadingState ? <CircularProgress /> : null} {allWords.misc.copy}
          </MenuItem>

          <Divider />
          <MenuItem
            style={{ width: "100%", padding: "0.5rem", margin: "0" }}
            onClick={handleShare}
            id="share_button"
          >
            {allWords.misc.sht}
          </MenuItem>
        </div>
      </CustomMenu>
      <Dialog
        title={allWords.misc.livert.rt}
        open={notify_box}
        setOpen={setNotifyBox}
        onCloseBtnClick={() => {
          setNotifyBox(false);
        }}
      >
        <div className="container text-center py-5">
          <small>
            {" "}
            <strong className="text-muted">{notification_text}</strong>{" "}
          </small>
        </div>
      </Dialog>
      <Dialog
        title={"Request Message"}
        open={req_msg}
        setOpen={setReqMsg}
        onCloseBtnClick={() => {
          setReqMsg(false);
        }}
      >
        <small>
          {" "}
          <strong className="text-success">{request_msg}</strong>{" "}
        </small>
      </Dialog>
    </MainDiv>
  );
};

export default EventCard;
