import { IconButton } from "@mui/material";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allWords } from "../../../../App";
import DeleteSVG from "../../../../assets/icons/edit_rt_imgs_icon.svg";
import { createEditRoundtableInitialize } from "../../../../redux/actions/createEditRoundtable";
import ToastHandler from "../../../../utils/ToastHandler";

// THE NAMES BELOW ARE SAME KEY PAIRS USED IN THE REDUCER. IF ANY CHANGE IS MADE, MAKE SURE SAME NAME IS USED IN THE REDUCER TOO

// uploadType = intro => for intro of rt
// uploadType = outro => for outro of rt
// uploadType = recording => for recording of rt

const VideoPreviewComponent = ({ text, uploadType }) => {
  const urlRtId = useSelector((state) => state.createEditRoundtable.urlRtId);
  const vidPreview = useSelector(
    (state) => state.createEditRoundtable[uploadType + "Preview"]
  );
  const dispatch = useDispatch();

  const vidRef = useRef(null);

  const clickHandler = () => {
    vidRef.current.click();
  };

  const changeHandler = (e, type) => {
    const videoFile = e.target.files[0];

    if (!videoFile) {
      ToastHandler("warn", allWords.misc.toastMsg.select_video);
      return false;
    }

    if (type === "recording") {
      if (!videoFile.name.match(/\.(mp4|MP4|mp3|MP3)$/)) {
        ToastHandler("warn", allWords.misc.toastMsg.invalidVidAudFormat);
        return false;
      }

      if (Math.round(videoFile?.size / 1024) > 1024 * 2000) {
        ToastHandler("warn", allWords.createRT.maximum_2_gb);
        return false;
      }
    } else {
      if (!videoFile.name.match(/\.(mp4|MP4)$/)) {
        ToastHandler("warn", allWords.misc.toastMsg.invalidVideoFormat);
        return false;
      }
    }

    if (uploadType === "recording") {
      setTimeout(() => {
        const { duration } = vidRef.current;

        const hrs = Math.floor(duration / 3600);
        const min = Math.floor(duration / 60);
        const sec = Math.floor(duration % 60);

        return dispatch(
          createEditRoundtableInitialize({
            [uploadType]: videoFile,
            durationHr: {
              label: `${hrs} ${allWords.misc.livert.h}`,
              value: hrs,
            },
            durationMin: {
              label: `${min} ${allWords.misc.livert.m}`,
              value: min,
            },
            durationSec: {
              label: `${sec} ${allWords.misc.livert.m}`,
              value: sec,
            },
            totalDur: duration,
            [uploadType + "Preview"]: URL.createObjectURL(e.target.files[0]),
          })
        );
      }, 1000);
    }

    if (uploadType !== "recording") {
      setTimeout(() => {
        const { duration } = vidRef.current;

        if (Math.round(duration) > 15) {
          return ToastHandler(
            "warn",
            allWords.misc.toastMsg.max_video_duration
          );
        }
      }, 1000);
    }

    dispatch(
      createEditRoundtableInitialize({
        [uploadType]: videoFile,
        [uploadType + "Preview"]: URL.createObjectURL(e.target.files[0]),
      })
    );
  };

  const removeHandler = () => {
    dispatch(
      createEditRoundtableInitialize({
        [uploadType]: "",
        [uploadType + "Del"]: true,
        [uploadType + "Preview"]: null,
      })
    );
  };

  return vidPreview ? (
    <>
      <div
        style={{
          width: "10.5rem",
          height: "7.2rem",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <video
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "100%",
            maxHeight: "7.75rem",
            borderRadius: "10px",
            color: "transparent",
            objectFit: "cover",
          }}
          preload
          id="video_id_button"
          // className="videoClass"
          src={vidPreview}
          ref={vidRef}
          muted
          controls
          onLoadedMetadata={() => {
            const invideo = vidRef.current;

            if (!invideo) return;
            if (uploadType !== "recording") {
              if (invideo.videoWidth * invideo.videoHeight > 8294400) {
                ToastHandler("warn", "Max. resolution should be 4k only.");
              }

              if (Math.round(invideo.duration) > 15) {
                ToastHandler("warn", allWords.misc.toastMsg.max_video_duration);
                dispatch(
                  createEditRoundtableInitialize({
                    [uploadType + "Preview"]: null,
                    [uploadType]: null,
                  })
                );
              }
            } else {
              if (Math.round(invideo.duration) > 10800) {
                ToastHandler("warn", allWords.misc.recline1);
              }
            }
          }}
          controlsList="nodownload"
        />

        <IconButton className="icon icon-btn-position" onClick={removeHandler}>
          <img
            src={DeleteSVG}
            alt="delete_icon"
            id="delete"
            className="delete-icon-for-thumbnail"
          />
        </IconButton>
      </div>
    </>
  ) : (
    <>
      <div
        className="thumbnail-parent"
        style={{
          backgroundImage:
            uploadType === "recording"
              ? `url(/assets/icons/recording.svg)`
              : `url(/assets/icons/thumbnail_vid.svg)`,
          height: "8rem",
          marginBottom: "0.8rem",
        }}
        onClick={clickHandler}
      >
        <span className="thumbnail-text">{text}</span>
      </div>
      <input
        type="file"
        accept={`${
          uploadType === "recording" ? "video/*, audio/*" : "video/*"
        }`}
        style={{ visibility: "hidden", display: "none" }}
        ref={vidRef}
        onChange={(e) => {
          changeHandler(e, uploadType);
        }}
      />
    </>
  );
};

export default VideoPreviewComponent;
