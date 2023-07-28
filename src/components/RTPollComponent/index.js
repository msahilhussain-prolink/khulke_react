import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Material UI
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

// Constants
import { POST_API_BASE_URL } from "../../constants/env";

// Components
import PostedAt from "../ViewerChat/posted_at";
import ToastHandler from "../../utils/ToastHandler";
import MenuComp from "./MenuComp";

// Assets
import PollIcon from "../../assets/icons/poll_icon.svg";

// Style
import "./style.css";
import { PollingContainer, PollingInnerContainer } from "./style";
import PreLoginComp from "../PreLoginComp";
import moment from "moment";
import UserProfile from "../UserProfile";
import { allWords } from "../../App";

export default function RTPollComponent(props) {
  const {
    username,
    name,
    polling_data,
    posted_at,
    type,
    pollExpireTime,
    day_duration,
    post_id,
    rt_id,
    current_user,
    single_rt_data,
    setTotal,
    userId,
    indexVal,
    setPollFlag,
  } = props;

  const [expanded, setExpanded] = useState(false);
  const [pollState, setPollState] = useState(false);
  const [polling, setPolling] = useState(true);
  const [state, setState] = useState(null);
  const [vote, setVote] = useState(0);
  const [percent, setPercent] = useState(0);
  const [poll_user_id, setPollUserId] = useState([]);
  const [percent_more, setPercentMore] = useState({
    index: [],
    index1: [],
    index2: [],
    index3: [],
    value: false,
  });
  const [day, setDay] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  //   Local Ref
  const timerRef = useRef();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // UseEffect
  useEffect(() => {
    polling_data?.result?.allUserPolled?.filter((val) => {
      if (val === JSON.parse(localStorage.getItem("current_user"))?.["_id"]) {
        setPolling(false);
      }
    });

    if (
      moment(new Date(pollExpireTime)).isSameOrBefore(moment(new Date())) ===
      true
    ) {
      setPolling(false);
    }

    if (
      JSON.parse(localStorage.getItem("current_user"))?.["username"] !== null
    ) {
      if (
        type === "POLL_ROUNDTABLE" &&
        JSON.parse(localStorage.getItem("current_user"))?.["username"] ===
        username
      ) {
        setPolling(false);
      }
    }

    setPollFlag(true);
  }, [polling_data, polling]);

  useEffect(() => {
    setPollUserId([]);
    setVote(0);
  }, []);

  useEffect(() => {
    if (polling_data?.result?.userids) {
      setPollUserId(polling_data?.result?.userids);
    }
    if (polling_data?.result?.percent) {
      setPercent(polling_data?.result?.percent);
    }

    if (
      moment(new Date(pollExpireTime)).isSameOrBefore(moment(new Date())) ===
      true
    ) {
      if (polling_data?.result?.options?.length === 2) {
        polling_data?.result?.options?.map((item, index) => {
          if (
            polling_data?.result?.percent?.[0] !== undefined &&
            polling_data?.result?.percent?.[1] !== undefined
          ) {
            if (
              polling_data?.result?.percent?.[0] ===
              polling_data?.result?.percent?.[1]
            ) {
              setPercentMore({ index: 0, index1: 1, value: true });
            }
          }

          if (
            polling_data?.result?.percent?.[0] >
            polling_data?.result?.percent?.[1]
          ) {
            setPercentMore({ index: 0, value: true });
          } else if (
            polling_data?.result?.percent?.[1] >
            polling_data?.result?.percent?.[0]
          ) {
            setPercentMore({ index: 1, value: true });
          }
        });
      } else if (polling_data?.result?.options?.length === 3) {
        polling_data?.result?.options?.map((item, index) => {
          if (
            polling_data?.result?.percent?.[0] !== undefined &&
            polling_data?.result?.percent?.[1] !== undefined &&
            polling_data?.result?.percent?.[2] !== undefined
          ) {
            if (
              polling_data?.result?.percent?.[0] ===
              polling_data?.result?.percent?.[1]
            ) {
              setPercentMore({ index: 0, index1: 1, value: true });
            } else if (
              polling_data?.result?.percent?.[0] ===
              polling_data?.result?.percent?.[2]
            ) {
              setPercentMore({ index: 0, index1: 2, value: true });
            }

            if (
              polling_data?.result?.percent?.[0] ===
              polling_data?.result?.percent?.[1] &&
              polling_data?.result?.percent?.[0] ===
              polling_data?.result?.percent?.[2]
            ) {
              setPercentMore({ index: 0, index1: 1, index2: 2, value: true });
            }
          }

          if (
            polling_data?.result?.percent?.[0] >
            polling_data?.result?.percent?.[1] &&
            polling_data?.result?.percent?.[0] >
            polling_data?.result?.percent?.[2]
          ) {
            setPercentMore({ index: 0, value: true });
          } else if (
            polling_data?.result?.percent?.[1] >
            polling_data?.result?.percent?.[0] &&
            polling_data?.result?.percent?.[1] >
            polling_data?.result?.percent?.[2]
          ) {
            setPercentMore({ index: 1, value: true });
          } else if (
            polling_data?.result?.percent?.[2] >
            polling_data?.result?.percent?.[0] &&
            polling_data?.result?.percent?.[2] >
            polling_data?.result?.percent?.[1]
          ) {
            setPercentMore({ index: 2, value: true });
          }
        });
      } else if (polling_data?.result?.options?.length === 4) {
        polling_data?.result?.options?.map((item, index) => {
          if (
            polling_data?.result?.percent?.[0] !== undefined &&
            polling_data?.result?.percent?.[1] !== undefined &&
            polling_data?.result?.percent?.[2] !== undefined &&
            polling_data?.result?.percent?.[3] !== undefined
          ) {
            if (
              polling_data?.result?.percent?.[0] ===
              polling_data?.result?.percent?.[1]
            ) {
              setPercentMore({ index: 0, index1: 1, value: true });
            } else if (
              polling_data?.result?.percent?.[0] ===
              polling_data?.result?.percent?.[2]
            ) {
              setPercentMore({ index: 0, index1: 2, value: true });
            } else if (
              polling_data?.result?.percent?.[0] ===
              polling_data?.result?.percent?.[3]
            ) {
              setPercentMore({ index: 0, index1: 3, value: true });
            } else if (
              polling_data?.result?.percent?.[1] ===
              polling_data?.result?.percent?.[2]
            ) {
              setPercentMore({ index: 1, index1: 2, value: true });
            } else if (
              polling_data?.result?.percent?.[3] ===
              polling_data?.result?.percent?.[1]
            ) {
              setPercentMore({ index: 3, index1: 1, value: true });
            } else if (
              polling_data?.result?.percent?.[3] ===
              polling_data?.result?.percent?.[2]
            ) {
              setPercentMore({ index: 3, index1: 2, value: true });
            }

            if (
              polling_data?.result?.percent?.[0] ===
              polling_data?.result?.percent?.[1] &&
              polling_data?.result?.percent?.[0] ===
              polling_data?.result?.percent?.[2]
            ) {
              setPercentMore({ index: 0, index1: 1, index2: 2, value: true });
            } else if (
              polling_data?.result?.percent?.[0] ===
              polling_data?.result?.percent?.[1] &&
              polling_data?.result?.percent?.[0] ===
              polling_data?.result?.percent?.[3]
            ) {
              setPercentMore({ index: 0, index1: 1, index2: 3, value: true });
            }
            if (
              polling_data?.result?.percent?.[3] ===
              polling_data?.result?.percent?.[1] &&
              polling_data?.result?.percent?.[3] ===
              polling_data?.result?.percent?.[2]
            ) {
              setPercentMore({ index: 3, index1: 1, index2: 2, value: true });
            } else if (
              polling_data?.result?.percent?.[0] ===
              polling_data?.result?.percent?.[2] &&
              polling_data?.result?.percent?.[0] ===
              polling_data?.result?.percent?.[3]
            ) {
              setPercentMore({ index: 0, index1: 2, index2: 3, value: true });
            } else if (
              polling_data?.result?.percent?.[0] ===
              polling_data?.result?.percent?.[1] &&
              polling_data?.result?.percent?.[0] ===
              polling_data?.result?.percent?.[3]
            ) {
              setPercentMore({ index: 0, index1: 1, index2: 3, value: true });
            }

            if (
              polling_data?.result?.percent?.[0] ===
              polling_data?.result?.percent?.[1] &&
              polling_data?.result?.percent?.[0] ===
              polling_data?.result?.percent?.[2] &&
              polling_data?.result?.percent?.[0] ===
              polling_data?.result?.percent?.[3]
            ) {
              setPercentMore({
                index: 0,
                index1: 1,
                index2: 2,
                index3: 3,
                value: true,
              });
            }
          }

          if (
            polling_data?.result?.percent?.[0] >
            polling_data?.result?.percent?.[1] &&
            polling_data?.result?.percent?.[0] >
            polling_data?.result?.percent?.[2] &&
            polling_data?.result?.percent?.[0] >
            polling_data?.result?.percent?.[3]
          ) {
            setPercentMore({ index: 0, value: true });
          } else if (
            polling_data?.result?.percent?.[1] >
            polling_data?.result?.percent?.[0] &&
            polling_data?.result?.percent?.[1] >
            polling_data?.result?.percent?.[2] &&
            polling_data?.result?.percent?.[1] >
            polling_data?.result?.percent?.[3]
          ) {
            setPercentMore({ index: 1, value: true });
          } else if (
            polling_data?.result?.percent?.[2] >
            polling_data?.result?.percent?.[0] &&
            polling_data?.result?.percent?.[2] >
            polling_data?.result?.percent?.[1] &&
            polling_data?.result?.percent?.[2] >
            polling_data?.result?.percent?.[3]
          ) {
            setPercentMore({ index: 2, value: true });
          } else if (
            polling_data?.result?.percent?.[3] >
            polling_data?.result?.percent?.[0] &&
            polling_data?.result?.percent?.[3] >
            polling_data?.result?.percent?.[1] &&
            polling_data?.result?.percent?.[3] >
            polling_data?.result?.percent?.[2]
          ) {
            setPercentMore({ index: 3, value: true });
          }
        });
      }
    } else {
      setPercentMore({
        index: 0,
        value: false,
      });
      setPercentMore({
        index1: 1,

        value: false,
      });
      setPercentMore({
        index2: 2,
        value: false,
      });
      setPercentMore({
        index3: 3,
        value: false,
      });
    }
  }, [polling_data, pollExpireTime]);

  function getTimeRemaining(end_time) {
    let timeout = new Date(end_time).getTime();
    let now = new Date().getTime();
    const total = timeout - now;
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return {
      total,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  const startTimer = () => {
    let { total, days, hours, minutes, seconds } =
      getTimeRemaining(pollExpireTime);

    if (day_duration === 0) {
      setDay("");
    }

    if (total) {
      if (days > 0) {
        setDay(days === 1 ? days + " Day " : days + " Days ");
      }
      if (days === 0 && hours > 0) {
        setDay(hours === 1 ? hours + " hour " : hours + " hours ");
      }

      if (days === 0 && hours === 0 && minutes > 0) {
        setDay(minutes === 1 ? minutes + " min " : minutes + " mins ");
      }

      if (days === 0 && hours === 0 && minutes === 0 && seconds) {
        setDay(seconds === 1 ? seconds + " sec " : seconds + " secs ");
      }

      if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
        setDay("Final Result");
      }
    }
  };

  const clearTimer = (e) => {
    let { total, days, hours, minutes, seconds } =
      getTimeRemaining(pollExpireTime);
    if (total) {
      setTotal(total > 0 ? "left" : "");
      if (days > 0) {
        setDay(days === 1 ? days + " Day " : days + " Days ");
      }
      if (days === 0 && hours > 0) {
        setDay(hours === 1 ? hours + " hour " : hours + " hours ");
      }

      if (days === 0 && hours === 0 && minutes > 0) {
        setDay(minutes === 1 ? minutes + " min " : minutes + " mins ");
      }

      if (days === 0 && hours === 0 && minutes === 0 && seconds) {
        setDay(seconds === 1 ? seconds + " sec " : seconds + " secs ");
      }
    }

    if (timerRef.current) clearInterval(timerRef.current);
    const id = setInterval(() => {
      startTimer(pollExpireTime);
    }, 1000);
    timerRef.current = id;
  };

  const getDeadTime = () => {
    return moment(pollExpireTime).local().format("hh:mm:ss");
  };

  useEffect(() => {
    clearTimer(getDeadTime());
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pollExpireTime]);

  const handleAddPoll = (item) => {
    const data = new FormData();
    data.append(
      "message",
      `{"post_id":"${post_id}","option":"${item}","user_id":"${JSON.parse(localStorage.getItem("current_user"))["_id"]
      }"}`
    );

    if (window.location.pathname === "/roundtable/join") {
      data.append("type", "ROUNDTABLE");
      data.append("roundtable_id", rt_id);
    }

    const config = {
      method: "post",
      url: `${POST_API_BASE_URL}/post/add-poll`,
      headers: {
        "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
        "device-type": "android",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        setPollState(false);
        if (response.status === 200) {
          setPolling(false);
          setVote(response?.data?.data?.polling_data?.total_count);
          setPercent(response?.data?.data?.polling_data?.result?.percent);
          setPollUserId(response?.data?.data?.polling_data?.result?.userids);
        } else {
          ToastHandler("dan", allWords.misc.somethingwrong);
        }
      })
      .catch();
  };

  return (
    <>
      <Box style={{ marginTop: "5px", marginBottom: "5px" }}>
        <Accordion
          id="accordionID"
          sx={{
            backgroundColor: "#293146",
            borderRadius: expanded !== false ? "12px" : "6px",
            width: "90%"
          }}
          square={expanded !== false ? true : false}
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <AccordionSummary
            sx={{ padding: "0px 8px" }}
            expandIcon={
              !localStorage?.anonymous_user &&
              localStorage?.current_user && (
                <>
                  {userId === JSON.parse(localStorage.current_user)._id ? (
                    <div id="more_vert_button">
                      <MenuComp
                        username={username}
                        post_id={post_id}
                        single_rt_data={single_rt_data}
                        customStyle={{ marginLeft: "0" }}
                        setPollFlag={setPollFlag}
                      />
                    </div>
                  ) : null}
                </>
              )
            }
            aria-controls={`panel${indexVal}bh-content`}
            id={`panel${indexVal}bh-header`}
          >
            <UserProfile username={username} className="img_avatar" />
            {expanded === false ? (
              <div
                className="d-flex justify-content-between"
                style={{ width: "90%" }}
              >
                <div className="d-flex">
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "#fff",
                      alignSelf: "center",
                      fontWeight: "600",
                      flexShrink: 0,
                    }}
                  >
                    &nbsp; Poll
                  </Typography>{" "}
                  &nbsp;
                  <FiberManualRecordIcon
                    style={{
                      color: "#fff",
                      width: "8px",
                      height: "8px",
                      alignSelf: "center",
                    }}
                  />
                  &nbsp;
                  <Typography
                    sx={{
                      color: "#fff",
                      alignSelf: "center",
                      fontSize: "12px",
                      width: "auto",
                    }}
                  >
                    {polling_data?.total_count || vote}
                    {polling_data?.total_count > 1 || vote > 1
                      ? " Votes"
                      : allWords.misc.livert.vote}
                  </Typography>
                  &nbsp;
                  <FiberManualRecordIcon
                    style={{
                      color: "#fff",
                      width: "8px",
                      height: "8px",
                      alignSelf: "center",
                    }}
                  />
                  &nbsp;
                  <Typography
                    sx={{
                      color: "#fff",
                      alignSelf: "center",
                      fontSize: "12px",
                      maxWidth: "52%",
                    }}
                  >
                    {polling_data?.question?.length > 15
                      ? polling_data?.question?.slice(0, 15) + "..."
                      : polling_data?.question}
                  </Typography>
                </div>
              </div>
            ) : (
              <div
                className="d-flex justify-content-between"
                style={{ width: "85%" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "8px",
                  }}
                >
                  <Typography
                    style={{
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {name}
                  </Typography>
                  <Typography
                    style={{
                      color: "#fff",
                      fontSize: "0.66rem",
                      display: "flex",
                    }}
                  >
                    <Link
                      style={{
                        textDecoration: "none",
                      }}
                      to={`/profile/${username}/posts`}
                      target="_blank"
                    >
                      <p
                        style={{
                          margin: "0",
                          color: "#fff",
                          opacity: "0.5",
                          fontSize: "0.66rem",
                        }}
                      >
                        @{username}
                      </p>
                    </Link>

                    <PostedAt posted_at={posted_at} />
                  </Typography>
                </div>
              </div>
            )}
          </AccordionSummary>
          <AccordionDetails
            style={{ marginTop: "-12px" }}
          >
            <Typography
              sx={{
                color: "#fff",
                alignSelf: "center",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              {polling_data?.question}
            </Typography>

            {polling ? (
              <div style={{ position: "relative" }}>
                {polling_data?.result?.options?.map((item) => (
                  <div key={item}>
                    <PollingContainer
                      style={{ height: "40px" }}
                      key={item}
                      onClick={() => {
                        if (
                          !localStorage.current_user &&
                          localStorage.anonymous_user
                        )
                          return setModalOpen(true);

                        if (
                          JSON.parse(localStorage.getItem("current_user"))[
                          "username"
                          ] !== username
                        ) {
                          setPollState(true);
                          setState(item);
                        }
                      }}
                    >
                      <span
                        style={{
                          marginLeft: "0.2rem",
                          position: "absolute",
                          left: "0.4rem",
                          // top: "15px",
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {item}
                      </span>
                    </PollingContainer>
                    <div
                      style={{
                        marginTop: "-2rem",
                        position: "absolute",
                        right: 0,
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* after polling view */}
                <div style={{ position: "relative" }}>
                  {polling_data?.result?.options?.map((item, index) => (
                    <div key={item}>
                      <PollingContainer
                        key={item}
                        justifyContent="space-between"
                        border={"#6a779b"}
                      >
                        <PollingInnerContainer
                          key={item}
                          width={percent?.[index]}
                          bgColor={
                            percent_more?.value === true
                              ? percent_more?.index === index ||
                                percent_more?.index1 === index ||
                                percent_more?.index2 === index ||
                                percent_more?.index3 === index
                                ? "#4B707B"
                                : "#6A779B"
                              : "#6A779B"
                          }
                        ></PollingInnerContainer>
                        <div className="poll_tooltip">
                          <span
                            style={{
                              marginLeft: "0.2rem",
                              position: "absolute",
                              left: "0.4rem",
                              // top: "15px",
                              color: "#fff",
                              fontWeight: "bold",
                              fontSize: "14px",
                            }}
                          >
                            &nbsp; &nbsp;
                            {poll_user_id?.[index]?.includes(
                              current_user["_id"]
                            ) ? (
                              <>
                                {item?.length > 15
                                  ? item.slice(0, 15) + "..."
                                  : item}{" "}
                                &nbsp;
                                <CheckCircleOutlineIcon />
                              </>
                            ) : (
                              item
                            )}
                          </span>

                          {poll_user_id?.[index]?.includes(
                            current_user?.["_id"]
                          ) ? (
                            <>
                              {item?.length > 15 ? (
                                <span className="polltooltiptext">{item}</span>
                              ) : (
                                ""
                              )}
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      </PollingContainer>
                      <div
                        style={{
                          marginTop: "-2rem",
                          position: "absolute",
                          right: 0,
                          color: "white",
                          paddingRight: "10px",
                        }}
                      >
                        {percent?.[index] ? <>{percent?.[index]}%</> : "0%"}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div
              style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
              ref={timerRef}
            >
              <span
                style={{ fontSize: "14px", color: "white", opacity: "0.7" }}
              >
                {polling_data?.total_count || vote}{" "}
                {polling_data?.total_count > 1 || vote > 1 ? " Votes" : " Vote"}
                &nbsp;
                <FiberManualRecordIcon
                  style={{
                    color: "#fff",
                    width: "8px",
                    height: "8px",
                    alignSelf: "center",
                  }}
                />
                &nbsp;
                {moment(pollExpireTime).valueOf() < Date.now() ? (
                  "Final Result"
                ) : (
                  <>
                    {day}
                    {day !== "" ? " left" : ""}
                  </>
                )}
              </span>
            </div>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* poll dialog */}
      <Dialog
        open={pollState}
        onClose={() => setPollState(false)}
        PaperProps={{
          style: { height: "16%" },
        }}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You have selected the <b>{state}</b>. Once you confirm, you cannot
            undo this selection.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setPollState(false)}
            variant="outlined"
            style={{ textTransform: "capitalize" }}
            color="secondary"
          >
            {allWords.misc.cancel}
          </Button>
          <Button
            onClick={() => handleAddPoll(state)}
            variant="contained"
            style={{
              textTransform: "capitalize",
              backgroundColor: "#66B984",
              color: "white",
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Menus */}
      <PreLoginComp
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        icon={
          <img
            src={PollIcon}
            style={{
              width: "40px",
              height: "40px",
            }}
            alt="poll-icon"
          />
        }
        title={"To cast a vote , Login or sign up to Khul Ke"}
        description={""}
      />
    </>
  );
}
