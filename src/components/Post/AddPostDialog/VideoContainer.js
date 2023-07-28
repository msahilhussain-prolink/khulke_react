import React, { useEffect, useMemo, useRef, useState } from "react";
import { IconButton } from "@material-ui/core";
import DeleteSVG from "../../../assets/icons/delete.svg";
import styledC from "styled-components";
import CropTrimSVG from "../../../assets/icons/video trim.svg";
import { Grid, Input, Slider, Typography, Box } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {
  returnMinString,
  returnSecondString,
  returnTimeString,
} from "../../../utils/timeutils";
import { percentToNum, ReturnEndTime } from "../../../utils/mathutils";
import ToastHandler from "../../../utils/ToastHandler";
import { allWords } from "../../../App"
const MainDiv = styledC.div`
  position: relative;
  .icon_container {
    position: absolute;
    top: 0;
    right: 0;
    margin-top: 1.5rem;

    .icon {
      width: 45px;
      height: 45px;
      margin-right: 0.5rem;
    }
  }
`;

const VideoContainer = ({
  setVideoDuration,
  videoFilePath,
  setVideoFilePath,
  setState,
  showCaption,
  setCaption,
  setStartVideoTime,
  setEndVideoTime,
  videoFile,
  editVideo,
  hideEdit,
  parentType,
  setVideoError,
  ...props
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [value, setValue] = useState([0, 0]);
  const [duration, setDuration] = useState(0);
  const [show, setShow] = useState(editVideo);
  const videoRef = useRef();
  const startTimeInputSecondRef = useRef();
  const startTimeInputMinRef = useRef();
  const endTimeInputSecondRef = useRef();
  const endTimeInputMinRef = useRef();
  const [error, setError] = useState(false);
  const canvascontainerref = useRef();
  const canvasvideoref = useRef();
  const [canvasCounter, setCanvasCounter] = useState(0);
  function handleShow() {
    videoRef.current.currentTime = 0;
    setValue([0, ReturnEndTime(videoRef.current?.duration, parentType)]);
    setShow(!show);
    props.setLengthError(false);
  }

  useEffect(() => {
    if (!show) {
      return;
    }

    if (value[1] < value[0]) {
      setError(true);
      let temp = [0, ReturnEndTime(videoRef.current?.duration, parentType)];
      setValue(temp);
      return;
    }

    if (value[0] > value[1]) {
      setError(true);
      let temp = [0, ReturnEndTime(videoRef.current?.duration, parentType)];
      setValue(temp);
      return;
    }

    if (videoRef.current && videoRef.current.duration < value[1]) {
      setError(true);
      let temp = [0, ReturnEndTime(videoRef.current?.duration, parentType)];
      setValue(temp);
      return ToastHandler("warn", "End time cannot exceed the complete video duration.");
    }

    if (videoRef.current && videoRef.current.duration < value[0]) {
      setError(true);
      let temp = [0, ReturnEndTime(videoRef.current?.duration, parentType)];
      setValue(temp);
      return ToastHandler(
        "warn",
        "Start time cannot exceed the complete video duration."
      );
    }

    if (parentType === "SNIPPET" && value[1] - value[0] > 150) {
      setError(true);
      let temp = [0, ReturnEndTime(videoRef.current?.duration, parentType)];
      setValue(temp);
      return ToastHandler("warn", "The trimmed clip cannot exceed 2min 30sec duration.");
    }

    if (["K3","BKK"].includes(parentType) && value[1] - value[0] > 180) {
      setError(true);
      let temp = [0, ReturnEndTime(videoRef.current?.duration, parentType)];
      setValue(temp);
      return ToastHandler("warn", "The trimmed clip cannot exceed 3min duration.");
    }

    setStartVideoTime(value[0]);
    setEndVideoTime(value[1]);
    setVideoDuration(value[1] - value[0]);
  }, [parentType,value[0], value[1]]);

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

  useEffect(() => {
    if (!show) {
      setStartVideoTime(0);
      setEndVideoTime(videoRef.current?.duration);
      setVideoDuration(videoRef.current?.duration);
    }
    if (show) {
      setStartVideoTime(0);
      setEndVideoTime(value[1]);
      setVideoDuration(value[1]);
    }
  }, [show]);

  useEffect(() => {
    if (value.length > 1) {
      videoRef.current.currentTime = value[0];
    }
  }, [duration, value, videoRef]);

  const CanvasBlueprint = useMemo(() => {
    let temp = [];
    for (let i = 0; i < 5; i++) {
      temp.push(
        <img
          style={{
            height: "100%",
            width: "20%",
            position: "absolute",
            left: `${i * 20}%`,
            top: "0%",
          }}
        />
      );
    }
    return temp;
  }, []);

  return (
    <MainDiv>
      <video
        id="my_video_player"
        onTimeUpdate={(e) => {
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
        }}
        ref={videoRef}
        onLoadedMetadata={(event) => {
          if (setVideoDuration) {
            if (show) {
              setVideoDuration(ReturnEndTime(videoRef.current?.duration, parentType));
              setEndVideoTime(ReturnEndTime(videoRef.current?.duration, parentType));
            } else {
              setVideoDuration(videoRef.current?.duration);
              setEndVideoTime(videoRef.current?.duration);
            }
            let temp = [...value];
            temp[1] = ReturnEndTime(videoRef.current?.duration, parentType);
            setValue(temp);
          }
        }}
        {...props}
        style={{
          width: "100%",
          height: 300,
          borderRadius: 10,
          marginTop: "0.5rem",
        }}
        controlsList="nodownload"
      />
      {show && (
        <video
          ref={canvasvideoref}
          {...props}
          style={{
            display: "none",
          }}
          onLoadedData={() => {
            setCanvasCounter(0);
            let videoelem = canvasvideoref.current;
            videoelem.muted = true;
            videoelem.play();
            videoelem.currentTime = 0;
          }}
          onSeeked={() => {
            let videoelem = canvasvideoref.current;
            let canvases = canvascontainerref.current.childNodes;
            let img = canvases[canvasCounter];
            let canvas = document.createElement("canvas");
            let context = canvas.getContext("2d");
            context.drawImage(videoelem, 0, 0, canvas.width, canvas.height);
            img.src = canvas.toDataURL("image/jpeg");
            if (canvasCounter < 4) {
              videoelem.currentTime =
                ((canvasCounter + 1) * videoelem.duration) / 5;
            }
            setCanvasCounter(canvasCounter + 1);
          }}
        />
      )}

      <div className="icon_container">
        {!hideEdit && (
          <IconButton
            className="icon"
            onClick={() => {
              if (setVideoFilePath) {
                setVideoFilePath(videoFilePath);
                setVideoError("")
              }
              setDuration(videoRef.current.duration);
              handleShow();
            }}
            style={{ backgroundColor: "white", height: 38, width: 38 }}
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
          style={{ marginRight: "1rem" }}
          onClick={() => {
            setVideoFilePath("");
            setVideoError("")
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
              {Math.round(videoFile.size / 10 ** 6) === 0
                ? Math.round(videoFile.size / 10 ** 3) + " Kb"
                : Math.round(videoFile.size / 10 ** 6) + " Mb"}
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
              {value[0]
                ? returnTimeString(value[0])
                : returnTimeString(0)} -{" "}
              {value[1]
                ? returnTimeString(value[1])
                : returnTimeString(videoRef.current?.duration)}
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
                    {allWords.misc.review.Endttm}
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
            <Grid className="trimSlider" item xs={12} md={8}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  width: "80%",
                  position: "absolute",
                  left: "10%",
                  height: "100%",
                  padding: "20px 0px",
                  top: "8px",
                }}
                component="span"
                ref={canvascontainerref}
              >
                {CanvasBlueprint}
              </Box>
              <Slider
                step={1}
                min={0}
                max={videoRef.current?.duration}
                componentsProps={{
                  thumb: {
                    onClick: () => {
                      setCurrentTime(videoRef.current?.currentTime);
                      if (!videoRef.current?.paused) {
                        return videoRef.current?.pause();
                      }
                      return videoRef.current?.play();
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
                    content: videoRef.current?.paused
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
                    paddingLeft: videoRef.current?.paused ? "0px" : "15px",
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
                  videoRef.current.currentTime = val;
                }}
                track={false}
              />
              <Slider
                step={1}
                min={0}
                max={videoRef.current?.duration}
                marks={(() => {
                  let temp = [];
                  for (let i = 0; i <= 100; i += 10) {
                    temp.push({
                      value: Math.floor(
                        percentToNum(i, videoRef.current?.duration)
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
                              percentToNum(i, videoRef.current?.duration)
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
                  if (["K3","BKK"].includes(parentType)) {
                    // Set the maximum range to 180 for K3 parent type
                    if (val[1] - val[0] > 180) {
                      if (activeThumb === 0) {
                        return setValue([val[0], val[0] + 180]);
                      }
                      return setValue([val[1] - 180, val[1]]);
                    }
                  } else {
                    // Set the default maximum range to 150
                    if (val[1] - val[0] > 150) {
                      if (activeThumb === 0) {
                        return setValue([val[0], val[0] + 150]);
                      }
                      return setValue([val[1] - 150, val[1]]);
                    }
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
    </MainDiv>
  );
};

export default VideoContainer;
