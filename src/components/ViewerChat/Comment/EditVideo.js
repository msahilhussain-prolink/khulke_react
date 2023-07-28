import React from "react";
import styled from "styled-components";
import Slider, { SliderThumb } from "@mui/material/Slider";
import PropTypes from "prop-types";
import { allWords } from "../../../App"
import ReactVideoTrimmer from "react-video-trimmer";
import "react-video-trimmer/dist/style.css";

const AirbnbSlider = styled(Slider)(({ theme }) => ({
  color: "#3a8589",
  height: 3,
  padding: "13px 0",
  "& .MuiSlider-thumb": {
    height: 27,
    width: 27,
    backgroundColor: "#fff",
    border: "1px solid currentColor",
    "&:hover": {
      boxShadow: "0 0 0 8px rgba(58, 133, 137, 0.16)",
    },
    "& .airbnb-bar": {
      height: 9,
      width: 1,
      backgroundColor: "currentColor",
      marginLeft: 1,
      marginRight: 1,
    },
  },
  "& .MuiSlider-track": {
    height: 3,
  },
}));

function AirbnbThumbComponent(props) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <span className="airbnb-bar" />
      <span className="airbnb-bar" />
      <span className="airbnb-bar" />
    </SliderThumb>
  );
}

AirbnbThumbComponent.propTypes = {
  children: PropTypes.node,
};

const Container = styled.div`
  width: 100%;
  .controls {
    width: 100%;
    display: flex;
    margin-top: 1rem;

    .start_time {
      margin-right: 1rem;
    }
    .end_time {
      margin-right: 1rem;
    }
  }
`;
const VideoContainer = styled.video`
  width: 100%;
  border-radius: 5px;
`;
const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 1rem;
`;

const Button = styled.button`
  width: 200px;
  height: 50px;
  outline: none;
  border-radius: 5px;
  color: ${(props) => (props.primary ? props.theme.color.primary : "white")};
  background-color: ${(props) =>
    props.bgColor ? props.theme.color.secondary : "white"};
  border: 2px solid
    ${(props) =>
    props.primary ? props.theme.color.primary : props.theme.color.secondary};
`;

const EditVideo = ({ setEditVideo }) => {
  const handleVideoEncode = React.useCallback((result) => { });

  return (
    <Container>
      <VideoContainer
        controls
        src={"https://gutrgoo.com/post-media/media/61518880048463292473669a"}
      />
      <div className="controls">
        <div className="start_time">
          <p>{allWords.misc.review.Starttm}</p>
          <div style={{ display: "flex" }}>
            <input
              type="number"
              placeholder="00"
              style={{ width: 40, border: "none", outline: "none" }}
              maxLength={2}
            />
            <span style={{ fontSize: 25 }}>:</span>
            <input
              type="number"
              placeholder="00"
              style={{ width: 40, border: "none", outline: "none" }}
              maxLength={2}
            />
          </div>
        </div>
        <div className="end_time">
          <p>End time</p>
          <div style={{ display: "flex" }}>
            <input
              type="number"
              placeholder="00"
              style={{ width: 40, border: "none", outline: "none" }}
              max={2}
            />
            <span style={{ fontSize: 25 }}>:</span>
            <input
              type="number"
              placeholder="00"
              style={{ width: 40, border: "none", outline: "none" }}
            />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <AirbnbSlider
            components={{ Thumb: AirbnbThumbComponent }}
            getAriaLabel={(index) =>
              index === 0 ? "Minimum price" : "Maximum price"
            }
            defaultValue={[20, 40]}
          />
        </div>
      </div>

      <div>
        <ReactVideoTrimmer
          onVideoEncode={handleVideoEncode}
          timeRange={{ start: 10, end: 100 }}
        />
      </div>
      <Footer>
        <Button
          primary
          onClick={() => {
            setEditVideo(false);
          }}
        >
          {allWords.misc.cancel}
        </Button>
        <Button bgColor onClick={() => { }}>
        {allWords.misc.save}
        </Button>
      </Footer>
    </Container>
  );
};

export default EditVideo;
