import React from "react";
import { IconButton } from "@material-ui/core";
import DeleteSVG from "../../../assets/icons/delete.svg";
import styled from "styled-components";
import CropTrimSVG from "../../../assets/icons/crop_trim.svg";

const MainDiv = styled.div`
  position: relative;
  .icon_container {
    position: absolute;
    top: 0;
    right: 0;
    margin-top: 1rem;

    .icon {
      width: 45px;
      height: 45px;
      margin-right: 0.5rem;
    }
  }
`;

const VideoContainer = ({
  setEditVideo,
  videoFilePath,
  setVideoFilePath,
  setShowVideo,
  ...props
}) => {
  return (
    <MainDiv>
      <video
        {...props}
        style={{
          width: "100%",
          height: 300,
          borderRadius: 10,
          marginTop: "0.5rem",
        }}
      />
      <div className="icon_container">
        <IconButton
          className="icon"
          onClick={() => {
            setEditVideo(true);
            setVideoFilePath(videoFilePath);
          }}
          style={{ backgroundColor: "white", height: 42, width: 42 }}
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
            setVideoFilePath("");
          }}
        >
          <img
            src={DeleteSVG}
            alt="delete_icon"
            style={{ width: 38, height: 38 }}
          />
        </IconButton>
      </div>
    </MainDiv>
  );
};

export default VideoContainer;
