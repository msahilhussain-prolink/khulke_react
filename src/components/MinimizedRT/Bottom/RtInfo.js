import { Avatar, Grid, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import timeimg from "../../../assets/icons/schedule.svg";
import Viewers from "../../../assets/icons/Group 19646.svg";
import { useSelector } from "react-redux";

import {
  CHAR_LIMIT,
  SPEAKER_ROLE,
  UTC_IST_TIME_DIFFERENCE,
} from "../Constants";
import { allWords } from "../../../App"

export default function RtInfo({ role, leaveChannel, setTime }) {
  //store selectors
  const rt_data = useSelector((state) => state.minimizedData.rt_data);
  const channel = useSelector((state) => state.minimizedData.channel);
  const useClient_RTM = useSelector(
    (state) => state.minimizedData.useClient_RTM
  );

  //states here
  const [viewerCount, setViewerCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timer, setTimer] = useState();
  const [endTime, setendTime] = useState(
    new Date(rt_data?.end?.toLocaleString() || 0).getTime() -
    UTC_IST_TIME_DIFFERENCE
  );

  //refs here
  const endtimeRef = useRef();
  endtimeRef.current = endTime;

  //functions here
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

  //effects here
  useEffect(() => {
    if (!channel || !useClient_RTM) return;

    //event handler functions
    const memberCountUpdatedEvent = (memberCount) => {
      setViewerCount(memberCount);
    };

    const ChannelMessageEvents = async (message) => {
      const data = message.text.split("||");

      if (data[0] === "renewself") {
        setendTime((prev) => prev + data[2] * 60 * 1000);
      }
    };

    const rt_id = rt_data.rt_id;

    useClient_RTM.getChannelMemberCount([rt_id]).then((data) => {
      const count = data[rt_id];
      setViewerCount(count);
    });

    channel.on("MemberCountUpdated", memberCountUpdatedEvent);

    channel.on("ChannelMessage", ChannelMessageEvents);

    //cleanup function
    return () => {
      channel?.off("MemberCountUpdated", memberCountUpdatedEvent);

      channel?.off("ChannelMessage", ChannelMessageEvents);
    };
  }, [channel, rt_data, useClient_RTM]);

  useEffect(() => {
    if (!rt_data) return;
    const endTimeLocal =
      new Date(rt_data?.end?.toLocaleString() || 0).getTime() -
      UTC_IST_TIME_DIFFERENCE;

    setendTime(endTimeLocal);
  }, [rt_data]);

  useEffect(() => {
    if (!rt_data) return;

    if (timer) return;

    const interval = setInterval(() => {
      const remainingTime = endtimeRef.current - new Date().getTime();

      if (remainingTime <= 0) {
        clearInterval(interval);
      }

      let { total, hours, minutes, seconds } = getTimeRemaining(
        endtimeRef.current
      );

      if (total >= 0) {
        if (hours < 10) {
          hours = "0" + String(hours);
        }
        if (minutes < 10) {
          minutes = "0" + String(minutes);
        }
        if (seconds < 10) {
          seconds = "0" + String(seconds);
        }
        setTimeLeft(hours + ":" + minutes + ":" + seconds);
        setTime(hours + ":" + minutes + ":" + seconds);
      }
    }, [1000]);

    setTimer(interval);

    return () => {
      clearInterval(interval);
    };
  }, [rt_data]);

  useEffect(() => {
    return () => {
      if (!timer) return;
      clearInterval(timer);
    };
  }, []);

  window.addEventListener("unload", (ev) => {
    ev.preventDefault();
    try {
      leaveChannel();
    } catch (err) { }
  });

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography
          style={{
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          {rt_data.rt_name?.length > CHAR_LIMIT
            ? `${rt_data?.rt_name?.slice(0, CHAR_LIMIT - 3)}...`
            : rt_data.rt_name}
        </Typography>
      </Grid>
      <Grid
        item
        xs={role === SPEAKER_ROLE ? 6 : 4}
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Avatar
          src={timeimg}
          style={{ marginRight: "5px", maxWidth: "20px", maxHeight: "20px" }}
        />
        <Typography
          style={{
            fontSize: "12px",
          }}
        >
          {" "}
          {allWords.misc.livert.tleft}{timeLeft}
        </Typography>
      </Grid>
      <Grid
        item
        xs={role === SPEAKER_ROLE ? 6 : 4}
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingLeft: "10px",
        }}
      >
        <Avatar
          src={Viewers}
          style={{ marginRight: "5px", maxWidth: "20px", maxHeight: "20px" }}
        />
        <Typography
          style={{
            fontSize: "12px",
          }}
        >
          {allWords.misc.pg4.viewer}:{viewerCount}
        </Typography>
      </Grid>
    </Grid>
  );
}
