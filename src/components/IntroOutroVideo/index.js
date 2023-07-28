import React, { useRef } from "react";
import { useDispatch } from "react-redux";

import { ExpandRoundtable } from "../../redux/actions/minimizedRoundtable";

import "./style.css";

export default function IntroOutroVideo({
  introStart,
  setShowIntro,
  setIntroDisable,
  videoUrl,
  showLabel,
  endDur,
  setEndDur,
  setShowLabel,
  setStart,
  setInCall,
  mini,
  closeFullscreen,
}) {
  //constants here
  const dispatch = useDispatch();

  const videoRef = useRef(null);
  return (
    <>
      <div className="ioContainer">
        <video
          preload
          autoPlay
          id="video_id_button"
          className="ioVideoClass"
          src={`${videoUrl}#t=${introStart},${endDur}`}
          ref={videoRef}
          // controls
          onEnded={() => {
            if (showLabel === "OUTRO") {
              if (!mini) {
                window.location.replace("/roundtable/all");
                closeFullscreen();
                setStart(false);
                setInCall(false);
              } else {
                dispatch(ExpandRoundtable());
              }
            }
            setShowLabel("");
            setShowIntro(false);
            setIntroDisable(false);
          }}
          onLoadedMetadata={() => {
            const video = videoRef.current;
            if (!video) return;
            setEndDur(video?.duration);
          }}
          controlsList="nodownload"
        />
        <div className="txtCenter"> {showLabel} </div>
      </div>
    </>
  );
}
