import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import { liveRTState } from "../../redux/actions/compActions";

// Style.css
import "./style.css";

export default function LiveRtTimer(props) {
  const { start_time, end_time, live, past, muteFlag, time, rt_type, rt_id } =
    props;

  //   Local state
  const [timeLeft, setTimeLeft] = useState("00:00:00");
  const [duration, setDuration] = useState("00:00:00");

  const dispatch = useDispatch();

  function getDifference() {
    let timeout = new Date(end_time).getTime();
    let now = new Date(start_time).getTime();
    const total = timeout - now;
    let sec = Math.floor((total / 1000) % 60);
    let min = Math.floor((total / 1000 / 60) % 60);
    let hr = Math.floor((total / (1000 * 60 * 60)) % 24);

    if (hr < 10) {
      hr = "0" + String(hr);
    }
    if (min < 10) {
      min = "0" + String(min);
    }
    if (sec < 10) {
      sec = "0" + String(sec);
    }

    if (hr > 0) {
      setTimeLeft(hr + ":" + min + ":" + sec);
    } else {
      setTimeLeft(min + ":" + sec);
    }
  }

  function getTimeRemaining(end) {
    let timeout = new Date(end).getTime();
    let now = new Date().getTime();
    const total = timeout - now;
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  }

  const startTimer = (end_time) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(end_time);
    if (total > 0) {
      if (hours < 10) {
        hours = "0" + String(hours);
      }
      if (minutes < 10) {
        minutes = "0" + String(minutes);
      }
      if (seconds < 10) {
        seconds = "0" + String(seconds);
      }

      if (hours > 0) {
        setTimeLeft(hours + ":" + minutes + ":" + seconds);
      } else {
        setTimeLeft(minutes + ":" + seconds);
      }

      if (
        hours + ":" + minutes + ":" + seconds == "00:00:00" ||
        minutes + ":" + seconds == "00:00"
      ) {
        dispatch(
          liveRTState({
            rt_flag: "LIVE OVER",
            rt_id: rt_id,
          })
        );
      }
    } else if (total === 0) {
      setTimeLeft("00:00:00");
      dispatch(
        liveRTState({
          rt_flag: "LIVE OVER",
          rt_id: rt_id,
        })
      );
    }
  };

  useEffect(() => {
    let id = "";

    id = setInterval(() => {
      if (
        new Date(start_time?.split("+")?.[0]).getTime() ===
          new Date().getTime() ||
        new Date(start_time?.split("+")?.[0]).getTime() < new Date().getTime()
      ) {
        if (live) startTimer(end_time);
      } else if (
        new Date(start_time?.split("+")?.[0]).getTime() > new Date().getTime()
      ) {
        getDifference();
      }
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [end_time, start_time]);

  useEffect(() => {
    let timeout = new Date(end_time?.split("+")?.[0]).getTime();
    let now = new Date(start_time?.split("+")?.[0]).getTime();
    const total = timeout - now;
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    let hr = "";
    let min = "";
    let sec = "";
    if (total > 0) {
      if (hours < 10) {
        hr = "0" + String(hours);
      } else {
        hr = String(hours);
      }
      if (minutes < 10) {
        min = "0" + String(minutes);
      } else {
        min = String(minutes);
      }
      if (seconds < 10) {
        sec = "0" + String(seconds);
      } else {
        sec = String(seconds);
      }
      if (hr > 0) {
        setDuration(hr + ":" + min + ":" + sec);
      } else {
        setDuration(min + ":" + sec);
      }
    }
  }, []);

  return (
    <>
      {live && (
        <>
          <p
            style={{
              fontSize: "12px",
              color: "white",
              fontWeight: "600",
              width: timeLeft?.split(":").length === 2 ? "32px" : "50px",
              textAlign: "left",
            }}
          >
            {timeLeft}
          </p>
          {muteFlag && live && rt_type === "RECORDING_BASED" ? null : (
            <>
              &nbsp;
              <span
                className={clsx("white_dot", {
                  ["hideTR"]: rt_type == "RECORDING_BASED" && live,
                })}
              ></span>
              &nbsp;
            </>
          )}
        </>
      )}
      {past && (
        <>
          <p
            style={{
              fontSize: "12px",
              color: "white",
              fontWeight: "600",
              width:
                muteFlag === true
                  ? moment.duration(time, "seconds").format("hh") <= 3600
                    ? "32px"
                    : "50px"
                  : duration?.split(":").length === 2
                  ? "32px"
                  : "50px",
              textAlign: "left",
            }}
          >
            {muteFlag === true ? (
              <>
                <small>
                  {moment.duration(time, "seconds").format("hh:mm:ss") <= 59
                    ? "00:"
                    : ""}
                </small>
                <small>
                  {moment.duration(time, "seconds").format("hh:mm:ss")}
                </small>
              </>
            ) : (
              duration
            )}
          </p>
          {muteFlag ? null : (
            <>
              &nbsp; <span className="white_dot pastDot"></span> &nbsp;
            </>
          )}
        </>
      )}
    </>
  );
}
