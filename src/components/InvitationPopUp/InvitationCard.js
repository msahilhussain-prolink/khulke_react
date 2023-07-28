import React, { useEffect, useState } from "react";
import moment from "moment";

// Material UI
import { IconButton } from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

// Components

// Style
import "./style.css";
import { getTimeRemaining } from "../../utils/utils";
import InvitationDesc from "./InvitationDesc";
import InvitationButton from "./InvitationButton";
import InvitationSkip from "./InvitationSkip";

export default function InvitationCard({
  item,
  setClicked,
  ind,
  setSlideDetails,
  setInvPop,
  invData,
}) {
  const [index, setIndex] = useState(0);
  const [label, setLabel] = useState("upcoming");
  const [skip, setSkip] = useState(false);
  const [startTimer, setStartTimer] = useState({
    num: 5,
    flag: false,
  });
  const [timeLeft, setTimeLeft] = useState("00 : 00");
  const [belowTimer, setBelowTimer] = useState({
    timer: "00 : 00 ",
    msg: "",
  });

  let dateObj = new Date();

  const numSlides = invData?.length;
  const inds = ind + 1;

  const handleClose = () => {
    setSkip(!skip);
  };

  useEffect(() => {
    checkLabel();
  }, [invData[ind]]);

  const countDownTimer = (timeout, now) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(timeout, now);
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
        setTimeLeft(hours + " : " + minutes + " : " + seconds);
      } else {
        setTimeLeft(minutes + " : " + seconds);
      }

      let min20 = minutes - 20;
      let m20 = min20 < 10 ? "0" + String(min20) : "10";

      setBelowTimer({
        timer: min20 < 1 ? "00:00" : m20 + ":" + String(seconds),
        msg: min20 < 1 ? "Timer over" : "",
      });
    }
  };

  const checkLabel = () => {
    if (moment(new Date(item?.start_time)).diff(dateObj, "seconds") > 300) {
      setLabel("upcoming");
    } else if (
      moment(new Date(item?.start_time)).diff(dateObj, "minutes") < 0
    ) {
      setLabel("live");
      setStartTimer({
        num: 10,
        flag: true,
        start: new Date(item?.end_time).getTime(),
      });
    } else {
      if (moment(new Date(item?.start_time)).diff(dateObj, "minutes") >= 0) {
        if (
          moment(new Date(item?.start_time)).diff(dateObj, "seconds") <= 300
        ) {
          setLabel("live");
          setStartTimer({
            num: 5,
            flag: true,
            start: new Date(item?.start_time).getTime(),
          });
        } else {
          setLabel("upcoming");
        }
      }
    }
  };

  useEffect(() => {
    let interval = "";
    interval = setInterval(() => {
      checkLabel();
      if (moment(new Date(item?.start_time)).diff(dateObj, "seconds") < 0) {
        setStartTimer({
          num: 10,
          flag: true,
          start: new Date(item?.end_time).getTime(),
        });
        countDownTimer(
          new Date(item?.end_time).getTime(),
          new Date().getTime()
        );
      } else {
        countDownTimer(startTimer?.start, new Date().getTime());
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [item, startTimer?.start, dateObj]);

  return (
    <>
      <div
        className="d-flex justify-content-between"
        style={{
          alignItems: "center",
          padding: 20,
        }}
      >
        <span className="numSpan">
          {!skip && (
            <>
              {inds} / {numSlides}{" "}
            </>
          )}
        </span>
        <IconButton onClick={handleClose}>
          <CancelOutlinedIcon />
        </IconButton>
      </div>

      <div className="invitationDiv">
        <>
          {!skip ? (
            <>
              <InvitationDesc
                item={item}
                label={label}
                timeLeft={timeLeft}
                startTimer={startTimer}
                belowTimer={belowTimer}
              />

              <InvitationButton
                ind={ind}
                index={index}
                setIndex={setIndex}
                item={item}
                setSlideDetails={setSlideDetails}
                numSlides={numSlides}
                label={label}
                setStartTimer={setStartTimer}
                setClicked={setClicked}
                setInvPop={setInvPop}
                checkLabel={checkLabel}
              />
            </>
          ) : (
            <InvitationSkip
              numSlides={numSlides}
              inds={ind}
              skip={skip}
              setSkip={setSkip}
              setInvPop={setInvPop}
            />
          )}
        </>
      </div>
    </>
  );
}
