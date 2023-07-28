import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { allWords } from "../../App";
// Assets
import check_icon from "../../assets/icons/Check icon.svg";
import { POST_API_BASE_URL } from "../../constants/env";
import ToastHandler from "../../utils/ToastHandler";

// Style
import { PollingContainer, PollingInnerContainer } from "./style";
import moment from "moment";
import { replaceURLs } from "../../utils/utils";
import logger from "../../logger";

export default function PollComponent(props) {
  const {
    type,
    polling_data,
    username,
    current_user,
    pollExpireTime,
    day_duration,
    post_id,
    rt_id,
    hash_driver,
  } = props;

  // Local State
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
  const [total, setTotal] = useState("");
  const [dot, setDot] = useState("");

  //   Local Ref
  const timerRef = useRef();

  // UseEffect
  useEffect(() => {
    polling_data?.result?.allUserPolled?.filter((val) => {
      if (val === JSON.parse(localStorage.getItem("current_user"))?.["_id"]) {
        setPolling(false);
      }
    });

    if (
      polling_data?.is_expired ||
      moment(new Date(pollExpireTime)).isSameOrBefore(moment(new Date())) ===
      true
    ) {
      setPolling(false);
    }

    if (
      JSON.parse(localStorage.getItem("current_user"))?.["username"] !== null
    ) {
      if (
        type === "POLL" &&
        JSON.parse(localStorage.getItem("current_user"))?.["username"] ===
        username
      ) {
        setPolling(false);
      }
    }
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
      polling_data?.is_expired === true ||
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
  }, [polling_data]);

  function getTimeRemaining(end_time) {
    const timeout = new Date(end_time).getTime();
    const now = new Date().getTime();
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

  const startTimer = (pollExpireTime) => {
    let { total, days, hours, minutes, seconds } =
      getTimeRemaining(pollExpireTime);

    if (day_duration === 0) {
      setDay("");
    }

    if (total > 0) {
      setDot(total > 0 ? ". " : "");
      setTotal(total > 0 ? "left" : "");
      if (days > 0) {
        setDay(days === 1 ? days + " Day " : days + " Days ");
      }
      if (days === 0 && hours > 0) {
        setDay(hours === 1 ? hours + " hour " : hours + " hours ");
      }

      if (days === 0 && hours === 0 && minutes > 0) {
        setDay(minutes === 1 ? minutes + " minute " : minutes + " minutes ");
      }

      if (days === 0 && hours === 0 && minutes === 0 && seconds) {
        setDay(seconds === 1 ? seconds + " second " : seconds + " seconds ");
      }
      if (seconds === 0) {
        setDay(0);
        setDot(". ");
      }
    }
    if (total <= 0) {
      setDot(". ");
      setTotal("Final Result");
    }
  };

  useEffect(() => {
    let id = "";
    id = setInterval(() => {
      startTimer(pollExpireTime);
    }, 1000);

    return () => {
      clearInterval(id);
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
      .catch(function (error) {
        logger.error(error);
      });
  };

  return (
    <>
      {(type === "POLL_ROUNDTABLE" || type === "POLL") && (
        <>
          <span>
            {polling_data?.question?.includes("https") ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: replaceURLs(polling_data?.question),
                }}
              />
            ) : (
              hash_driver(polling_data?.question)
            )}
          </span>

          {polling ? (
            <div style={{ position: "relative" }}>
              {polling_data?.result?.options?.map((item) => (
                <div key={item}>
                  <PollingContainer
                    key={item}
                    onClick={() => {
                      if (
                        JSON.parse(localStorage.getItem("current_user"))[
                        "username"
                        ] !== username
                      ) {
                        setPollState(true);
                        setState(item);
                      }
                    }}
                    width={"100%"}
                    border
                    justifyContent="center"
                  >
                    <span>{item}</span>
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
                    <PollingContainer key={item} justifyContent="space-between">
                      <PollingInnerContainer
                        key={item}
                        width={percent?.[index]}
                        bgColor={
                          percent_more?.value === true
                            ? percent_more?.index === index ||
                              percent_more?.index1 === index ||
                              percent_more?.index2 === index ||
                              percent_more?.index3 === index
                              ? "orange"
                              : "#f2e8ce"
                            : "#f2e8ce"
                        }
                      ></PollingInnerContainer>
                      <span
                        style={{
                          marginLeft: "0.4rem",
                          position: "absolute",
                          left: "0.4rem",
                          // top: "15px",
                        }}
                      >
                        {item} &nbsp; &nbsp;
                        {poll_user_id?.[index]?.includes(
                          current_user["_id"]
                        ) ? (
                          <img src={check_icon} alt="" width={20} height={20} />
                        ) : null}
                      </span>
                    </PollingContainer>
                    <div
                      style={{
                        marginTop: "-2rem",
                        position: "absolute",
                        right: 0,
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
            <span>
              {polling_data?.total_count || vote}{" "}
              {polling_data?.total_count > 1 || vote > 1 ? " Votes" : allWords.misc.livert.vote}
              {polling_data?.is_expired || day === 0 ? (
                " . Final Result"
              ) : (
                <>
                  {" "}
                  {dot}
                  {day}
                  {total}
                </>
              )}
            </span>
          </div>
        </>
      )}

      {/* poll dialog */}
      <Dialog open={pollState} onClose={() => setPollState(false)}>
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
    </>
  );
}
