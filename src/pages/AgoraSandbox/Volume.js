import { IconButton, Slider } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import VolumeOffIcon from "../../assets/icons/Speaker off.svg";
import VolumeUpOutlinedIcon from "../../assets/icons/Speaker on.svg";
import "./video.css";

const Volume = ({ volume, setVolume }) => {
  const [volumeChanging, setVolumeChanging] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const [insideSlider, setInsideSlider] = useState(false);
  const showVolume = useSelector((state) => state.audioVolume.level);
  let dispatch = useDispatch();

  useEffect(() => {
    if (volumeChanging) return;

    if (insideSlider) setShowSlider(true);

    if (!insideSlider) setShowSlider(false);
  }, [volumeChanging, insideSlider]);

  const mouseDownEvent = (e) => {
    setVolumeChanging(true);
  };

  useEffect(() => {
    const mouseUpEvent = () => {
      setVolumeChanging(false);
    };

    window.addEventListener("mouseup", mouseUpEvent);

    return () => {
      window.removeEventListener("mouseup", mouseUpEvent);
    };
  }, []);

  useEffect(() => {
    if (volume === 0) {
      return;
    }
    setVolume(showVolume);
  }, [setVolume, showVolume]);

  const ToggleMute = () => {
    setVolume((prev) => {
      if (prev > 0) {
        return 0;
      }
      if (showVolume === 0) {
        return 1;
      }
      return showVolume;
    });
  };

  return (
    <div
      className="volume-parent-div"
      onMouseEnter={() => {
        setInsideSlider(true);
      }}
      onMouseLeave={() => {
        setInsideSlider(false);
      }}
    >
      <IconButton
        style={{
          outline: "none",
          border: "none",
          textAlign: "center",
          width: "30px",
          height: "30px",
          padding: "0.5rem",
          color: "black",
        }}
        onClick={ToggleMute}
      >
        {volume === 0 ? (
          <img
            src={VolumeOffIcon}
            style={{
              width: "30px",
              height: "30px",
            }}
            alt=""
          />
        ) : (
          <img
            src={VolumeUpOutlinedIcon}
            style={{
              width: "30px",
              height: "30px",
            }}
            alt=""
          />
        )}
      </IconButton>
      {showSlider && volume !== 0 && (
        <div className="volume-slider-div">
          <Slider
            value={showVolume}
            onChange={(e, newVolume) => {
              dispatch({
                type: "changeVol",
                payload: parseInt(newVolume),
              });
            }}
            //valueLabelDisplay="auto"
            sx={{
              "& .MuiSlider-thumb": {
                backgroundColor: "#3E965E",
              },
              "& .MuiSlider-rail": {
                color: "white",
              },
              "& .MuiSlider-track": {
                color: "#3E965E",
              },
            }}
            componentsProps={{
              thumb: {
                onMouseDown: mouseDownEvent,
              },
              rail: {
                onMouseDown: mouseDownEvent,
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Volume;
