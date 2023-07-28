import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import moment from "moment";
import { FiberManualRecord } from "@material-ui/icons";
import { allWords } from "../../App";

export default function PostedAt(props) {
  const { posted_at } = props;

  //   Local state
  const [time_posted, setTimePosted] = useState("");

  function getTimeRemaining(end_time) {
    var timeout = moment(new Date(end_time));
    var now = moment(new Date());
    const total = moment.duration(now.diff(timeout));
    const seconds = now.diff(timeout, "seconds");
    const minutes = now.diff(timeout, "minutes");
    const hours = now.diff(timeout, "hours");
    const days = now.diff(timeout, "days");
    const weeks = now.diff(timeout, "weeks");
    const months = now.diff(timeout, "months");
    const years = now.diff(timeout, "years");
    return {
      total,
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  const startTimer = () => {
    let { total, years, months, weeks, days, hours, minutes, seconds } =
      getTimeRemaining(posted_at);

    if (total >= 0) {
      if (months > 12) {
        setTimePosted(years === 1 ? years + " year ago" : years + " years ago");
      }
      if (years === 0) {
        setTimePosted(months === 1 ? months + " mt ago" : months + " mts ago");
      }
      if (months === 0) {
        setTimePosted(weeks === 1 ? weeks + " week ago" : weeks + " weeks ago");
      }
      if (weeks === 0) {
        setTimePosted(days === 1 ? days + " day ago" : days + " days ago");
      }
      if (days === 0) {
        setTimePosted(hours === 1 ? hours + " hour ago" : hours + " hours ago");
      }
      if (hours === 0) {
        setTimePosted(minutes === 1 ? "a m ago" : minutes + " m ago");
      }
      if (seconds <= 59) {
        setTimePosted(allWords.misc.livert.fewago);
      }
    }
  };

  useEffect(() => {
    var id = "";
    id = setInterval(() => {
      startTimer(posted_at);
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [posted_at]);

  return (
    <div className="d-flex" style={{ marginTop: "-1px", alignItems: "center" }}>
      {time_posted !== "" && (
        <>
          &nbsp;
          <FiberManualRecord style={{ marginBottom: "3px", fontSize: "8px" }} />
        </>
      )}
      &nbsp;
      <Typography
        sx={{
          fontSize: "0.66rem",
        }}
      >
        {" "}
        {time_posted}{" "}
      </Typography>
    </div>
  );
}
