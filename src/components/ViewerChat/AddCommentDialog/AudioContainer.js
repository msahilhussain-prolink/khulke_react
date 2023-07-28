import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import DeleteSVG from "../../../assets/icons/delete.svg";
import CropTrimSVG from "../../../assets/icons/crop_trim.svg";
import PlayIcon from "../../../assets/icons/play.svg";
import { IconButton } from "@mui/material";
import { Pause } from "@material-ui/icons";

const Container = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  position: relative;

  .audio_container {
    .img {
      width: 100%;
      height: 250px;
      border-radius: 0.5rem;
      object-fit: cover;
    }

    .icon_container {
      position: absolute;
      right: 0;
      top: 10px;

      .icon {
        width: 45px;
        height: 45px;
        margin-right: 0.5rem;
      }
    }
  }
  .footer_container {
    display: flex;
    align-items: center;
    margin-top: -70px;
  }
`;

const AudioContainer = ({
  user,
  audioFilePath,
  setAduioFilePath,
  increaseViewCount,
  setViewCountTimer,
  viewCountTimer,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioPlayer = useRef();
  const progressBar = useRef();

  useEffect(() => {
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;
  }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

  const handleIsPlaying = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      audioPlayer.current.pause();
    } else {
      audioPlayer.current.play();
      whilePlaying();
    }
  };
  const whilePlaying = () => {
    progressBar.current.value = audioPlayer.current.currentTime;
  };

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  };
  const changePlayerCurrentTime = () => {
    progressBar.current.value = `${
      (progressBar.current.value / duration) * 100
    }`;
    setCurrentTime(progressBar.current.value);
  };

  return (
    <Container>
      <div className="audio_container">
        <img className="img" src={"https://picsum.photos/200/300"} alt="" />
        {user && (
          <div className="icon_container">
            <IconButton
              className="icon"
              style={{ backgroundColor: "white", width: 40, height: 40 }}
            >
              <img
                src={CropTrimSVG}
                alt="delete_icon"
                style={{ width: 26, height: 26 }}
              />
            </IconButton>
            <IconButton
              className="icon"
              onClick={() => {
                setAduioFilePath("");
              }}
            >
              <img
                src={DeleteSVG}
                alt="delete_icon"
                style={{ width: 38, height: 38 }}
              />
            </IconButton>
          </div>
        )}
      </div>

      <div className="footer_container">
        <IconButton onClick={handleIsPlaying} style={{ width: 70, height: 70 }}>
          {!isPlaying ? (
            <>
              <img
                src={PlayIcon}
                alt="delete_icon"
                style={{ width: 70, height: 70, marginTop: "10px" }}
              />
            </>
          ) : (
            <>
              <Pause color="white" />
            </>
          )}
        </IconButton>
        <input
          type="range"
          defaultValue={currentTime}
          ref={progressBar}
          onChange={changeRange}
          style={{ flex: 1, marginRight: 8 }}
        />
        <p style={{ margin: 0, marginRight: 4 }}>{duration}</p>
      </div>
      <audio
        ref={audioPlayer}
        controls
        src={audioFilePath}
        preload="metadata"
        hidden
        onPlay={() => {
          const timer = setTimeout(() => {
            increaseViewCount();
          }, [5000]);

          setViewCountTimer(timer);
        }}
        onPause={() => {
          clearTimeout(viewCountTimer);
          setViewCountTimer(null);
        }}
      />
    </Container>
  );
};

export default AudioContainer;
