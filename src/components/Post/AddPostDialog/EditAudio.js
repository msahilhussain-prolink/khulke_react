import React, { useState, useEffect, useRef } from "react";
import Slider, { SliderThumb } from "@mui/material/Slider";
import styled from "styled-components";
import PropTypes from "prop-types";
import AudioDefaultPng from "../../../assets/images/audio_default.png";
import { useSelector } from "react-redux";
import { allWords } from "../../../App";

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

const EditAudioContainer = styled.div`
  .audio::-webkit-media-controls-enclosure {
    border-radius: 0px;
    /* background-color: transparent; */
  }
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

const EditAudio = ({
  audioFile,
  audioFilePath,
  setEditAudio,
  setDialogTitle,
  setStartAudioTime,
  setEndAudioTime,
}) => {
  const audioRef = useRef();
  const rangeRef = useRef();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [value, setValue] = useState([]);

  const audioTrim = useSelector((state) => state.audioTrim);

  useEffect(() => {
    setDialogTitle("Audio Trim");
    setStartAudioTime(currentTime);
    setEndAudioTime(duration);
  }, [currentTime, duration]);

  useEffect(() => {
    setDuration(audioRef?.current?.duration);
    if (value.length > 1) {
      audioRef.current.currentTime = value[0];
    }
  }, [audioRef, value, rangeRef]);

  useEffect(() => {
    if (audioTrim?.data) {
      setEditAudio(false);
    }
  }, [audioTrim]);

  return (
    <EditAudioContainer>
      <div className="audio_container">
        <img className="img" src={AudioDefaultPng} alt="" />
      </div>
      <div style={{ color: "red", marginTop: "-40px", marginBottom: 16 }}>
        <audio
          ref={audioRef}
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
          onLoadedMetadata={(e) => { }}
          onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        />
      </div>
      <div style={{ flex: 1 }}>
        <AirbnbSlider
          ref={rangeRef}
          onChange={(e) => {
            setValue(e.target.value);
            value[1] = duration;
          }}
          components={{ Thumb: AirbnbThumbComponent }}
          getAriaLabel={(index) =>
            index === 0 ? "Minimum price" : "Maximum price"
          }
          defaultValue={[2, Math.floor(duration)]}
          // min={Math.floor(duration)}
          max={duration ? Math.floor(duration) : 10}
        />
      </div>
      <Footer>
        <Button
          primary
          onClick={() => {
            setEditAudio(false);
            setDialogTitle(allWords.misc.addPoste);
          }}
        >
          {allWords.misc.cancel}
        </Button>

        <Button
          bgColor
          onClick={() => {
            setEditAudio(false);
            setDialogTitle(allWords.misc.addPoste);
          }}
        >
          {allWords.misc.save}
        </Button>
      </Footer>
    </EditAudioContainer>
  );
};

export default EditAudio;
