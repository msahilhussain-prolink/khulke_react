import { IconButton, Slider } from "@mui/material";
import { useEffect, useState } from "react";
import VolumeUpOutlinedIcon from "../../assets/icons/Speaker on.svg";
import VolumeOffIcon from "../../assets/icons/Speaker off.svg";
import SpeakerWhite from "../../assets/icons/Speaker onWhite.svg";
import { useSelector, useDispatch } from "react-redux";

export default function AudienceVolumeController({ volume, setVolume }) {
  //volume controller related states
  const [showSlider, setShowSlider] = useState(false);
  const [insideSlider, setInsideSlider] = useState(false);
  const [volumeChanging, setVolumeChanging] = useState(false);
  let dispatch = useDispatch();

  //volume controller function
  const mouseDownEvent = (e) => {
    setVolumeChanging(true);
  };

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

  // redux
  const showVolume = useSelector((state) => state.audioVolume.level);
  //useEffect Regarding volume change

  useEffect(() => {
    if (volumeChanging) return;
    if (insideSlider) setShowSlider(true);
    if (!insideSlider) setShowSlider(false);
  }, [volumeChanging, insideSlider]);

  useEffect(() => {
    if (volume === 0) {
      return;
    }
    setVolume(showVolume);
  }, [showVolume]);

  useEffect(() => {
    const mouseUpEvent = () => {
      setVolumeChanging(false);
    };
    window.addEventListener("mouseup", mouseUpEvent);
    return () => {
      window.removeEventListener("mouseup", mouseUpEvent);
    };
  }, []);

  const fullScr = useSelector((state) => state.fullScreen.full);

  let st1 = {
    position: "absolute",
    left: "10px",
    bottom: "-20px",
    height: "100%",
    width: "350%",
    display: "flex",
    alignItems: "center",
    paddingTop: "20px",
    zIndex: "2",
  };
  let st2 = {
    position: "absolute",
    left: "32px",
    right: "20px",
    height: "100%",
    width: "350%",
    display: "flex",
    alignItems: "center",
    zIndex: "2",
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        margin: "0px 10px",
        cursor: "pointer",
      }}
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
            src={fullScr ? SpeakerWhite : VolumeUpOutlinedIcon}
            style={{
              width: "30px",
              height: "30px",
            }}
            alt=""
          />
        )}
      </IconButton>

      {showSlider && volume !== 0 && (
        <div style={fullScr ? st2 : st1}>
          <Slider
            value={showVolume}
            onChange={(e, newVolume) => {
              dispatch({ type: "changeVol", payload: parseInt(newVolume) });
            }}
            sx={{
              "& .MuiSlider-thumb": {
                backgroundColor: "#3E965E",
              },
              "& .MuiSlider-rail": {
                color: "white",
                border: "1px solid #CBCBCB",
                height: "8px",
                borderRadius: "11px",
              },
              "& .MuiSlider-track": {
                color: "#3E965E",
                height: "8px",
                borderRadius: "11px",
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
}
