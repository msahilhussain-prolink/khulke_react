import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import DeleteSVG from "../../../assets/icons/delete.svg";
import CropTrimSVG from "../../../assets/icons/audio trim.svg";
import { Box, Grid, IconButton, Input, Typography } from "@mui/material";
import Slider from "@mui/material/Slider";
import AudioImage from "../../../assets/images/Audio.png";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {
  returnMinString,
  returnSecondString,
  returnTimeString,
} from "../../../utils/timeutils";
import { percentToNum, ReturnEndTime } from "../../../utils/mathutils";
import ToastHandler from "../../../utils/ToastHandler";
import { allWords } from "../../../App"
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
      cursor: pointer;
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
  showCaption,
  setStartAudioTime,
  setEndAudioTime,
  setAudioDuration,
  audioFile,
  hideEdit,
  increaseViewCount,
  viewCountTimer,
  setViewCountTimer,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [value, setValue] = useState([0, 0]);
  const [duration, setDuration] = useState(0);
  const [show, setShow] = useState(false);
  const audioPlayer = useRef();
  const startTimeInputSecondRef = useRef();
  const startTimeInputMinRef = useRef();
  const endTimeInputSecondRef = useRef();
  const endTimeInputMinRef = useRef();
  const [error, setError] = useState(false);
  const [audioBars, setAudioBars] = useState([]);

  const canvasref = useRef();
  function handleShow() {
    audioPlayer.current.currentTime = 0;
    setCurrentTime(0);
    setValue([0, ReturnEndTime(audioPlayer.current?.duration)]);
    setAudioDuration(ReturnEndTime(audioPlayer.current?.duration));
    setShow(!show);
  }

  useEffect(() => {
    setDuration(audioPlayer?.current?.duration);
    if (value.length > 1) {
      audioPlayer.current.currentTime = value[0];
    }
    if (!show) {
      if (setStartAudioTime) {
        setStartAudioTime(value[0]);
        setEndAudioTime(value[1]);
        setAudioDuration(audioPlayer?.current?.duration);
      }
    }
  }, [duration, value, audioPlayer]);

  useEffect(() => {
    if (!show) {
      return;
    }

    if (value[1] < value[0]) {
      setError(true);
      let temp = [0, ReturnEndTime(audioPlayer.current?.duration)];
      setValue(temp);
      return;
    }

    if (value[0] > value[1]) {
      setError(true);
      let temp = [0, ReturnEndTime(audioPlayer.current?.duration)];
      setValue(temp);
      return;
    }

    if (
      audioPlayer.current &&
      parseInt(audioPlayer.current.duration.toFixed(2)) <
      parseInt(value[1].toFixed(2))
    ) {
      setError(true);
      let temp = [0, ReturnEndTime(audioPlayer.current?.duration)];
      setValue(temp);
      return ToastHandler(
        "warn",
        "End time cannot exceed the complete audio duration."
      );
    }

    if (
      parseInt(audioPlayer.current.duration.toFixed(2)) <
      parseInt(value[0].toFixed(2))
    ) {
      setError(true);
      let temp = [0, ReturnEndTime(audioPlayer.current?.duration)];
      setValue(temp);
      return ToastHandler(
        "warn",
        "Start time cannot exceed the complete audio duration."
      );
    }

    if (value[1] - value[0] > 150) {
      setError(true);
      let temp = [0, ReturnEndTime(audioPlayer.current?.duration)];
      setValue(temp);
      return ToastHandler(
        "warn",
        "The trimmed clip cannot exceed 2min 30sec duration."
      );
    }

    if (setStartAudioTime) {
      setStartAudioTime(value[0]);
      setEndAudioTime(value[1]);
      setAudioDuration(Math.floor(value[1] - value[0]));
    }
  }, [value[0], value[1]]);

  useEffect(() => {
    if (value[0] > value[1]) {
      return ToastHandler("warn", "Start time cannot exceed the end time.");
    }
  }, [value[0]]);

  useEffect(() => {
    if (value[1] < value[0]) {
      return ToastHandler(
        "warn",
        "End time cannot be less than the start time."
      );
    }
  }, [value[1]]);

  const drawbars = (data) => {
    if (!show || !canvasref.current || !audioPlayer.current) {
      return;
    }
    let canvas = canvasref.current;
    let ctx = canvas.getContext("2d");
    let barWidth = canvas.width / (data.length + 36);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    data.forEach((elem, index) => {
      let x = (index * canvas.width) / data.length;
      let y = (canvas.height * (1 - elem)) / 2;

      if (
        currentTime / audioPlayer.current?.duration < x / canvas.width ||
        value[0] / audioPlayer.current?.duration > x / canvas.width
      ) {
        ctx.fillStyle = "#e0e0e0";
      } else {
        ctx.fillStyle = "#6dcfb6";
      }
      ctx.fillRect(x, y, barWidth, canvas.height * elem);
    });
  };

  useEffect(() => {
    if (!audioPlayer.current || !show || !canvasref.current) {
      return;
    }
    const visualise = (audioBuffer) => {
      const filterData = (audioBuffer) => {
        const rawData = audioBuffer.getChannelData(0);
        const samples = 64;
        const blockSize = Math.floor(rawData.length / samples);
        const filteredData = [];
        for (let i = 0; i < samples; i++) {
          let blockStart = blockSize * i;
          let sum = 0;
          for (let j = 0; j < blockSize; j++) {
            sum = sum + Math.abs(rawData[blockStart + j]);
          }
          filteredData.push(sum / blockSize);
        }
        return filteredData;
      };

      const normalizeData = (filteredData) => {
        const multiplier = Math.pow(Math.max(...filteredData), -1);
        return filteredData.map((n) => n * multiplier);
      };

      let actualData = normalizeData(filterData(audioBuffer));
      setAudioBars(actualData);
    };

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();

    let reader = new FileReader();
    reader.readAsArrayBuffer(audioFile);
    reader.onloadend = (e) => {
      audioContext.decodeAudioData(e.target.result).then((audioBuffer) => {
        visualise(audioBuffer);
      });
    };
  }, [canvasref.current, audioFile, audioPlayer.current, show]);

  useEffect(() => {
    if (!setStartAudioTime || setEndAudioTime || setAudioDuration) {
      return;
    }

    if (!show) {
      setStartAudioTime(0);
      setEndAudioTime(audioPlayer.current?.duration);
      setAudioDuration(audioPlayer.current?.duration);
    }
    if (show) {
      setStartAudioTime(0);
      setEndAudioTime(value[1]);
      setAudioDuration(value[1]);
    }
  }, [show]);

  useEffect(() => {
    if (audioBars.length === 0) {
      return;
    }
    drawbars(audioBars);
  }, [audioBars, currentTime]);

  return (
    <Container
      style={{
        marginTop: "0px",
      }}
    >
      <div className="audio_container">
        <img className="img" src={AudioImage} alt="" />
        {user && (
          <div className="icon_container">
            {!hideEdit && (
              <IconButton
                className="icon"
                style={{ backgroundColor: "white", width: 40, height: 40 }}
                onClick={() => {
                  setDuration(audioPlayer.current.duration);
                  handleShow();
                }}
              >
                <img
                  src={CropTrimSVG}
                  alt="delete_icon"
                  style={{ width: 26, height: 26 }}
                />
              </IconButton>
            )}

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
        <audio
          onTimeUpdate={(e) => {
            if (show) {
              if (e.target.currentTime > value[1]) {
                e.target.currentTime = value[1];
                setCurrentTime(e.target.currentTime);
                e.target.pause();
                return;
              }
              if (e.target.currentTime < value[0]) {
                e.target.currentTime = value[0];
                setCurrentTime(e.target.currentTime);
                e.target.pause();
                return;
              }
              setCurrentTime(e.target.currentTime);
            }
          }}
          onLoadedMetadata={() => {
            if (setAudioDuration) {
              if (!show) {
                setAudioDuration(audioPlayer?.current?.duration);
                setEndAudioTime(audioPlayer.current?.duration);
              }
              if (show) {
                setAudioDuration(ReturnEndTime(audioPlayer?.current?.duration));
                setEndAudioTime(ReturnEndTime(audioPlayer.current?.duration));
              }

              let temp = [...value];
              temp[1] = ReturnEndTime(audioPlayer?.current?.duration);
              setValue(temp);
            }
          }}
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
          ref={audioPlayer}
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
        />
      </div>

      {show && (
        <>
          <Grid
            container
            justifyContent={"space-between"}
            width={"80%"}
            sx={{
              m: "auto",
            }}
          >
            <Grid
              item
              xs={3}
              md={3}
              sx={{
                font: "normal normal normal 12px/14px Work Sans",
                color: "#63779C",
              }}
            >
              {Math.round(audioFile.size / 10 ** 6) === 0
                ? Math.round(audioFile.size / 10 ** 3) + " Kb"
                : Math.round(audioFile.size / 10 ** 6) + " Mb"}
            </Grid>
            <Grid
              item
              xs={6}
              md={6}
              sx={{
                display: "flex",
                justifyContent: "center",
                font: "normal normal normal 12px/14px Work Sans",
                color: "#63779C",
              }}
            >
              {" "}
              {value[0] ? returnTimeString(value[0]) : `00:00 min`} -{" "}
              {value[1]
                ? returnTimeString(value[1])
                : returnTimeString(audioPlayer.current?.duration)}
            </Grid>
            <Grid
              item
              xs={3}
              md={3}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                font: "normal normal normal 12px/14px Work Sans",
                color: "#63779C",
              }}
            >
              {returnTimeString(value[1] - value[0])}
            </Grid>
          </Grid>
          <Grid className="trimGridCont" container>
            <Grid item xs={12} md={4}>
              <Grid container spacing={3}>
                <Grid
                  item
                  xs={6}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    alignItems: "center",
                    paddingLeft: "0px",
                  }}
                >
                  <Typography
                    sx={{
                      font: "normal normal normal 12px/14px Work Sans",
                      color: "#475376",
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    {allWords.misc.review.Starttm}
                  </Typography>
                  <Input
                    error={error}
                    sx={{
                      width: "45%",
                      textAlign: "center",
                      font: "normal normal normal 18px/21px Work Sans",
                      color: "#939699",
                    }}
                    value={
                      value[0] && Math.floor(value[0] / 60) !== 0
                        ? returnMinString(value[0])
                        : ""
                    }
                    placeholder="00"
                    onChange={(e) => {
                      let temp;

                      if (value.length === 0) {
                        temp = [];
                      } else {
                        temp = [...value];
                      }

                      temp[0] =
                        parseInt(e.target.value || 0) * 60 +
                        parseInt(
                          startTimeInputSecondRef.current.childNodes[0].value ||
                          0
                        );
                      setValue(temp);
                    }}
                    inputProps={{
                      style: {
                        textAlign: "center",
                      },
                    }}
                    type="tel"
                    ref={startTimeInputMinRef}
                  />
                  <span>:</span>
                  <Input
                    error={error}
                    placeholder="00"
                    ref={startTimeInputSecondRef}
                    sx={{
                      width: "45%",
                      textAlign: "center",
                      font: "normal normal normal 18px/21px Work Sans",
                      color: "#939699",
                    }}
                    type="tel"
                    value={
                      value[0] && Math.floor(value[0] % 60) !== 0
                        ? returnSecondString(value[0])
                        : ""
                    }
                    onChange={(e) => {
                      let temp;

                      if (value.length === 0) {
                        temp = [];
                      } else {
                        temp = [...value];
                      }

                      temp[0] =
                        parseInt(e.target.value || 0) +
                        parseInt(
                          startTimeInputMinRef.current.childNodes[0].value *
                          60 || 0
                        );
                      setValue(temp);
                    }}
                    inputProps={{
                      style: {
                        textAlign: "center",
                      },
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      font: "normal normal normal 12px/14px Work Sans",
                      color: "#475376",
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    End Time
                  </Typography>
                  <Input
                    error={error}
                    value={
                      value[1] && Math.floor(value[1] / 60) !== 0
                        ? returnMinString(value[1])
                        : ""
                    }
                    ref={endTimeInputMinRef}
                    placeholder="00"
                    sx={{
                      width: "45%",
                      textAlign: "center",
                      font: "normal normal normal 18px/21px Work Sans",
                      color: "#939699",
                    }}
                    onChange={(e) => {
                      let temp;

                      if (value.length === 0) {
                        temp = [0, 0];
                      } else {
                        temp = [...value];
                      }

                      temp[1] =
                        parseInt(e.target.value || 0) * 60 +
                        parseInt(
                          endTimeInputSecondRef.current.childNodes[0].value || 0
                        );

                      setValue(temp);
                    }}
                    type="tel"
                    inputProps={{
                      style: {
                        textAlign: "center",
                      },
                    }}
                  />
                  <span>:</span>
                  <Input
                    error={error}
                    value={
                      value[1] && Math.floor(value[1] % 60) !== 0
                        ? returnSecondString(value[1])
                        : ""
                    }
                    ref={endTimeInputSecondRef}
                    placeholder="00"
                    sx={{
                      width: "45%",
                      textAlign: "center",
                      font: "normal normal normal 18px/21px Work Sans",
                      color: "#939699",
                    }}
                    onChange={(e) => {
                      let temp;
                      if (value.length === 0) {
                        temp = [0, 0];
                      } else {
                        temp = [...value];
                      }

                      temp[1] =
                        parseInt(e.target.value || 0) +
                        parseInt(
                          endTimeInputMinRef.current.childNodes[0].value * 60 ||
                          0
                        );

                      setValue(temp);
                    }}
                    type="tel"
                    inputProps={{
                      style: {
                        textAlign: "center",
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item className="trimSlider" xs={12} md={8}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  width: "80%",
                  position: "absolute",
                  left: "10%",
                  height: "100%",
                  top: "8px",
                }}
                component="span"
              >
                <canvas
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  ref={canvasref}
                ></canvas>
              </Box>
              <Slider
                step={1}
                min={0}
                max={audioPlayer.current?.duration}
                componentsProps={{
                  thumb: {
                    onClick: () => {
                      setCurrentTime(audioPlayer.current?.currentTime);
                      if (!audioPlayer.current?.paused) {
                        return audioPlayer.current?.pause();
                      }
                      return audioPlayer.current?.play();
                    },
                  },
                }}
                sx={{
                  position: "absolute",
                  width: "80%",
                  left: "10%",
                  top: "3%",
                  height: "80%",
                  "& .MuiSlider-thumb": {
                    height: "150%",
                    zIndex: "200",
                    borderRadius: "0px",
                    width: "3px",
                    backgroundColor: "#ED4D29",
                  },
                  "& .MuiSlider-thumb::after": {
                    content: audioPlayer.current?.paused
                      ? `"play_arrow"`
                      : `"paused"`,
                    fontFamily: "Material Icons",
                    textAlign: "center",
                    display: "flex",
                    position: "absolute",
                    justifyContent: "center",
                    top: "115%",
                    backgroundColor: "orange",
                    color: "white",
                    borderRadius: "5px",
                    width: "30px",
                    height: "20px",
                    paddingLeft: audioPlayer.current?.paused ? "0px" : "15px",
                  },
                  "& .MuiSlider-rail": {
                    backgroundColor: "transparent",
                    border: "none",
                  },
                }}
                value={[currentTime]}
                onChange={(e) => {
                  let val = e.target.value[0];
                  if (val < value[0] || val > value[1]) {
                    return;
                  }
                  setCurrentTime(val);
                  audioPlayer.current.currentTime = val;
                }}
                track={false}
              />
              <Slider
                step={1}
                min={0}
                max={audioPlayer.current?.duration}
                marks={(() => {
                  let temp = [];
                  for (let i = 0; i <= 100; i += 10) {
                    temp.push({
                      value: Math.floor(
                        percentToNum(i, audioPlayer.current?.duration)
                      ),
                      label: (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            width: "fit-content",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              width: "100%",
                              font: "normal normal normal 10px/11px Work Sans",
                              textAlign: "center",
                              color: "#AEBDD3",
                            }}
                          >
                            {Math.floor(
                              percentToNum(i, audioPlayer.current?.duration)
                            )}
                          </Typography>
                          <FiberManualRecordIcon />
                        </div>
                      ),
                    });
                  }
                  return temp;
                })()}
                componentsProps={{
                  markLabel: {
                    style: {
                      top: "-40%",
                    },
                  },
                }}
                sx={{
                  width: "80%",
                  margin: "auto",
                  height: "80%",
                  zIndex: "5",
                  "& .MuiSlider-thumb": {
                    borderRadius: "5px",
                    height: "80%",
                    width: "20px",
                    backgroundColor: "#ED4D29",
                  },
                  "& .MuiSlider-thumb::after": {
                    content: `""`,
                    backgroundColor: "white",
                    height: "50%",

                    width: "3px",
                    borderRadius: "3px",
                  },
                  "& .MuiSlider-track": {
                    backgroundColor: "transparent",
                    border: "2px solid #ED4D29",
                  },
                  "& .MuiSlider-rail": {
                    backgroundColor: "transparent",
                    border: "1px solid black",
                  },
                  "& .MuiSlider-mark": {
                    display: "none",
                  },
                }}
                getAriaLabel={() => "Minimum distance"}
                onChange={(e, val, activeThumb) => {
                  if (val[1] - val[0] > 150) {
                    if (activeThumb === 0) {
                      return setValue([val[0], val[0] + 150]);
                    }

                    return setValue([val[1] - 150, val[1]]);
                  }

                  setValue(val);
                }}
                value={value}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => {
                  return returnTimeString(value);
                }}
                disableSwap
              />
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default AudioContainer;
