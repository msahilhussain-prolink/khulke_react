import moment from "moment";
import { useEffect, useRef, useState } from "react";
import timeimg from "../../../assets/icons/schedule.svg";
import { TimeImg, Visibility } from ".././style";
import { useDispatch, useSelector } from "react-redux";
import { MOBILE_VIEW } from "../../../constants/env";
import { allWords } from "../../../App";
import TimerIcon from "../../../assets/icons/comp/Timer";
import "./Timer.css";
import { getLiveRTTimer } from "../../../redux/reducers/liveRTReducer";
import { updateLiveRTTimer } from "../../../redux/actions/LiveRT";

export default function RtTimer(props) {
  //props destructuring here
  const {
    windowWidth,
    setEndTimeLocal,
    endtime_local,
    rtm_channel,
    setWasExtended,
    was_extended,
    showExtendTime,
    setDisable,
    setTimeup,
    extendedTime,
    setExtendedTime,
    setRtTime,
  } = props;

  //states here

  const timer = useSelector(getLiveRTTimer);
  const dispatch = useDispatch();

  //refs here
  const timerRef = useRef();
  const Ref = useRef(null);
  //endtime local ref

  const endtime_local_ref = useRef();
  endtime_local_ref.current = endtime_local;
  //sideeffects here

  const endTimeEvent = (message, _memberId, messagePros) => {
    const data = message.text.split("||");
    if (data[0] !== "renewself") return;
    setEndTimeLocal(
      moment(
        new Date(endtime_local_ref.current).getTime() + Number(data[2]) * 60000
      )
        .local()
        .format()
        .split("+")[0]
    );
    setExtendedTime({ timeValue: { value: data[2] } });
    setWasExtended(true);
  };

  useEffect(() => {
    if (!rtm_channel) return;

    rtm_channel?.on("ChannelMessage", endTimeEvent);

    return () => {
      rtm_channel?.off("ChannelMessage", endTimeEvent);
    };
  }, [rtm_channel]);

  useEffect(() => {
    clearTimer(getDeadTime());
    return () => {
      if (Ref.current) clearInterval(Ref.current);
    };
  }, [endtime_local]);

  useEffect(() => {
    if (was_extended) {
      const localTimer = setTimeout(() => {
        setWasExtended(false);
      }, 60000);
      return () => clearTimeout(localTimer);
    }
  }, [was_extended]);

  useEffect(() => {
    if (!endtime_local) return;

    const rt_end =
      (new Date(endtime_local).getTime() - new Date().getTime()) / 1000;

    const timeOut = setTimeout(() => {
      setTimeup(true);
    }, rt_end * 1000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [endtime_local]);

  //functions here
  const startTimer = (e) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(endtime_local);

    if (hours === 0 && minutes < 5) {
      timerRef.current.classList = ["time_warn timer-warn"];
      showExtendTime(true);
      setDisable(false);
    } else {
      timerRef.current.classList = ["timer-text"];
      showExtendTime(false);
    }

    if (hours === 0 && minutes === 0 && seconds === 0) {
      setTimeup(true);
    }
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
      const time = hours + ":" + minutes + ":" + seconds;
      dispatch(updateLiveRTTimer(time));
      setRtTime(time);
    }
  };

  const clearTimer = (e) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(endtime_local);
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
    }
    const time = hours + ":" + minutes + ":" + seconds;
    dispatch(updateLiveRTTimer(time));
    setRtTime(time);

    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(endtime_local);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    return moment(endtime_local).local().format("hh:mm:ss");
  };

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

  const fullScr = useSelector((state) => state.fullScreen.full);
  return (
    <>
      <div
        className="timer-div"
        style={{ position: "relative", width: "auto", display: 'flex' }}
      >
        {windowWidth > 768 ? (
          <>{!fullScr && <TimerIcon />}</>
        ) : (
          <>{!fullScr && <TimeImg src={timeimg} />}</>
        )}
        {endtime_local && (
          <>
            {
              <small
                style={{ display: fullScr ? "none" : "initial" }}
                className="text-muted"
              >
                <span className={`timer-text`} ref={timerRef}>
                  {timer}
                </span>
              </small>
            }

            {fullScr === true && (
              <>
                <TimerIcon color="#fff" />
                <small className={`text-light timer-text-fullscreen`}>
                  <span>{timer}</span>
                </small>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
