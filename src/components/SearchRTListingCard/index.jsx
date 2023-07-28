import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Styles
import "../RTListingCard/style.css";

import RTCard from "./RTCard";

export default function SearchRTListingCard(props) {

  const navigate = useNavigate();
  const [accept, setAccept] = useState(false);
  const [reject, setReject] = useState(false);
  const [muteFlag, setMuteFlag] = useState(false);
  const [dotOpen, setDotOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [time, setTime] = useState(0);
  const [checkMuteFlag, setCheckMuteFlag] = useState(false);
  const open = Boolean(anchorEl);

  let current_user = null;
  try {
    current_user = JSON.parse(
      localStorage.current_user || localStorage.anonymous_user
    );
  } catch (err) {}

  //   useRef
  const videoElem = useRef();
  let timer = "";

  function playVid() {
    if (checkMuteFlag) {
      setMuteFlag(false);
      return setCheckMuteFlag(false);
    }
    setMuteFlag(true);
    videoElem?.current?.play();
    timer = setInterval(() => {
      setTime(Math.round(videoElem?.current?.currentTime));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }

  function pauseVid() {
    setCheckMuteFlag(true);
    setMuteFlag(false);
    // videoElem?.current?.pause();
    // window?.hls?.detachMedia();
  }

  return (
    <>
    <RTCard muteFlag={muteFlag} setMuteFlag={setMuteFlag} videoElem={videoElem} 
            reject={reject}
            accept={accept} time={time} 
            setTime={setTime} pauseVid={pauseVid} playVid={playVid} {...props}/>
    </>
  );
}
