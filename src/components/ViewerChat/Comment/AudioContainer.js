import React from "react";
import styled from "styled-components";

import DeleteSVG from "../../../assets/icons/delete.svg";
import AudioDefaultPng from "../../../assets/images/audio_default.png";
import CropTrimSVG from "../../../assets/icons/crop_trim.svg";
import { IconButton } from "@mui/material";

import ReactAudioPlayer from "react-audio-player";

const Container = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  position: relative;

  .audio {
  }
  .audio::-webkit-media-controls {
  }

  .audio::-webkit-media-controls-enclosure {
    border-radius: 0px;
    /* background-color: transparent; */
  }

  /* .audio::-webkit-media-controls-play-button {
  }
  audio::-webkit-media-controls-fullscreen-button {
    display: none !important;
  }
  audio::-webkit-media-controls-volume-control-container {
  }

  audio::-webkit-media-controls-toggle-closed-captions-button {
    display: none;
  } */

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
  setState,
}) => {
  return (
    <Container>
      <div className="audio_container">
        <img className="img" src={AudioDefaultPng} alt="" />
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
                if (setState) {
                  setState(false);
                }
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

      <div style={{ color: "red", marginTop: "-40px", marginBottom: 16 }}>
        <ReactAudioPlayer
          src={audioFilePath}
          controls
          style={{
            width: "100%",
            height: 40,
            color: "white",
            borderRadius: 0,
          }}
          className="audio"
          controlsList="nodownload"
          onLoadedMetadata={(e) => {}}
        />
        {/* <audio
          style={{
            width: "100%",
          }}
          className="audio"
          ref={audioPlayer}
          controls
          onLoadedMetadata={(event) =>
            
          }
          onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
          src={audioFilePath}
          preload="metadata"
        /> */}
      </div>

      {/* <div className="footer_container" >
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
              <FaPause color="white" />
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
        <p style={{ margin: 0, marginRight: 4, color: "white" }}>
          {duration && !isNaN(duration) && calculateTime(duration)}
        </p>
      </div> */}
      {/* <ReactAudioPlayer
        src={audioFilePath}
        controls
        style={{
          width: "100%",
          // marginTop: "-100px",
          backgroundColor: "red",
        }}
      /> */}
    </Container>
  );
};

export default AudioContainer;
