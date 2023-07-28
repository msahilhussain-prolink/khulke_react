import { Grid } from "@material-ui/core";
import { Typography } from "@mui/material";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { returnMinString, returnSecondString } from "../../utils/timeutils";
import { useDispatch, useSelector } from "react-redux";
import { getRTSingleData } from "../../redux/actions/roundtableAction/single_roundtable";
import { useNavigate } from "react-router-dom";
import { REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1 } from "../../constants/env";
import { auto_login_continue, device_info } from "../../utils/utils";
import ToastHandler from "../../utils/ToastHandler";
import { allWords } from "../../App";

function PreRtUI(props, ref) {
  //props destructuring here
  const { setDisableInteraction, start_time, client, rt_id } = props;

  //useState hooks here
  const [TimeUntillRTStarts, setTimeUntilRTStarts] = useState();
  const [rtMsg, setRtmsg] = useState(allWords.misc.livert.rtStartSoon);
  const [timer, setTimer] = useState({});

  const [moderator, setModerator] = useState(false);

  //refs here
  const moderatorRef = useRef();
  moderatorRef.current = moderator;

  const timerRef = useRef();
  timerRef.current = timer;

  //useSelector calls here
  const has_broadcasted = useSelector((state) => state.single_rt.data);

  //dispatch here
  const dispatch = useDispatch();

  //navigate here
  const navigate = useNavigate();

  useImperativeHandle(
    ref,
    () => ({
      timeRemaining: TimeUntillRTStarts,
    }),
    [TimeUntillRTStarts],
  )

  //event listeners here

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

  //useEffects here

  useEffect(() => {
    const data = {
      rt_id,
      token:
        localStorage.access || JSON.parse(localStorage.anonymous_user).token,
    };
    dispatch(getRTSingleData(data));
  }, []);

  useEffect(() => {
    if (!has_broadcasted) return;

    if (has_broadcasted?.data[0]?.broadcast_live_flag === 1) {
      setModerator(true);
    }
  }, [has_broadcasted]);

  useEffect(() => {
    let timeElapsed =
      (new Date().getTime() - new Date(start_time)?.getTime()) / 60000;

    if (timeElapsed >= 10) {
      return setDisableInteraction(false);
    }

    //used to clear timeout on unmount
    let localTimer = {
      interval_all: "",
      interval_mod: "",
      timeout_all: "",
      timeout_mod: "",
    };

    const handleModeratorNotAvailable = () => {
      if (moderatorRef.current) return;

      timeElapsed =
        (new Date().getTime() - new Date(start_time)?.getTime()) / 60000;
      const timeRemainingToStartRT = 10 * 60 - timeElapsed * 60;
      setTimeUntilRTStarts(timeRemainingToStartRT);

      const intervals = setInterval(() => {
        setTimeUntilRTStarts((prt) => prt - 1);
      }, 1000);

      setRtmsg(allWords.misc.livert.modNotJoined);
      const timeout = setTimeout(async () => {
        if (moderatorRef.current) return;

        ToastHandler(
          "info",
          allWords.misc.livert.nodNotPres
        );
        try {
          let response = await fetch(
            `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1}/cancel-rt/`,
            {
              body: JSON.stringify({
                device_info: device_info,
                roundtable_id: rt_id,
              }),
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.access}`,
                "content-type": "Application/json",
              },
            }
          );
          response = await response.json();

          if (response.status !== 200) {
            throw new Error(response.message);
          }
        } catch (e) {
          const response = e.response;
          if (!response) {
            ToastHandler("dan", allWords.misc.pages.facingDiffi);
            return;
          }
          if (response.status === 401) {
            return auto_login_continue(handleModeratorNotAvailable);
          }

          ToastHandler("dan", allWords.misc.pages.facingDiffi);
        }
        navigate("/roundtable/all", { replace: true });

        clearInterval(intervals);
        return setDisableInteraction(false);
      }, timeRemainingToStartRT * 1000);

      localTimer.interval_mod = intervals;
      localTimer.timeout_mod = timeout;
      setTimer({ interval: intervals, timeout: timeout });
    };

    if (timeElapsed < 0) {
      const timeRemainingToStartRT = -(timeElapsed * 60);

      setTimeUntilRTStarts(timeRemainingToStartRT);

      const intervals = setInterval(() => {
        setTimeUntilRTStarts((prt) => prt - 1);
      }, 1000);

      localTimer.interval_all = intervals;

      const timeout_5min_before = setTimeout(() => {
        clearInterval(intervals);
        if (!moderatorRef.current) return handleModeratorNotAvailable();

        setDisableInteraction(false);
      }, [timeRemainingToStartRT * 1000]);

      localTimer.timeout_all = timeout_5min_before;
    } else if (timeElapsed > 0 && !moderator) {
      handleModeratorNotAvailable();
    }

    return () => {
      clearTimeout(localTimer.timeout_all);
      clearInterval(localTimer.interval_all);
      clearTimeout(localTimer.timeout_mod);
      clearInterval(localTimer.interval_mod);
    };
  }, [start_time]);

  useEffect(() => {
    let timeElapsed =
      (new Date().getTime() - new Date(start_time)?.getTime()) / 60000;
    if (
      (moderator ||
        client.uid ===
          JSON.parse(localStorage.getItem("join_rt"))["moderator"][
            "username"
          ]) &&
      timeElapsed > 0
    ) {
      setDisableInteraction(false);
    }
  }, [moderator, client]);

  return (
    <Grid
      container
      style={{
        height: "100%",
      }}
      justifyContent="center"
      alignItems="center"
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        height="50%"
        style={{ background: "#66B984", padding: "15px 0px" }}
      >
        <Grid item xs={12}>
          <Typography
            variant="h3"
            style={{
              textAlign: "center",
              font: "normal normal normal 11px/16px Work Sans",
              color: " #fff",
            }}
          >
            {rtMsg}
          </Typography>

          <Typography
            variant="h3"
            style={{
              textAlign: "center",
              font: "normal normal bold 24px/41px Work Sans",
              color: "#fff",
            }}
          >
            {returnMinString(TimeUntillRTStarts)}:
            {returnSecondString(TimeUntillRTStarts)}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default  forwardRef(PreRtUI)
