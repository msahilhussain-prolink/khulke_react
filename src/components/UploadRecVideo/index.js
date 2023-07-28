import { IconButton } from "@mui/material";
import React, { useEffect, useRef, useState, useCallback } from "react";
import clsx from "clsx";

// Components
import InfoIcon from "../InfoIcon";

// Assets
import DeleteSVG from "../../assets/icons/delete.svg";
import ToastHandler from "../../utils/ToastHandler";
import { allWords } from "../../App";
import M3U8Player from "../M3U8Player";
//import { REACT_APP_BASE_URL_CLOUDFRONT } from "../../constants/env";

export default function UploadRecVideo({
  recordVideoUrls,
  setRecordVideoUrls,
  vidValidation,
  recVidRef,
  setRecVid,
  setRecordDel,
  url_rt_id,
  parsed_data,
  current_user,
  status,
}) {
  const recordVideoRef = useRef(null);
  const [videoDeleted, setVideoDeleted] = useState(false); // Track video deletion state

  const isReview = window.location.pathname.includes("review");
  const hasIdParam = new URL(window.location.href).searchParams.get("id");

  useEffect(() => {
    if (status === "upcoming" && parsed_data) {
      const { owner, moderator } = parsed_data;
      const isOwner = owner?.username === current_user?.username;
      const isCoOwner =
        moderator?.username === current_user?.username &&
        moderator?.m_type === "co-owner";
      if (!isOwner && !isCoOwner) {
        const video = recVidRef.current;
        if (video && !video.paused) {
          video.pause();
        }
      }
    }
  }, [status, current_user, parsed_data]);

  useEffect(() => {
    if (videoDeleted) {
      // Clear the video deletion state and enable reselection
      setVideoDeleted(false);
    }
  }, [recordVideoUrls]);

  const deleteVideo = useCallback(() => {
    setRecordVideoUrls([]);
    setRecVid([]);
    if (url_rt_id) {
      setRecordDel(true);
    }
    setVideoDeleted(true);
    // Clear the file input value
    recordVideoRef.current.value = "";
  }, [setRecordVideoUrls, setRecVid, setRecordDel, url_rt_id]);

  const selectVideo = useCallback(
    (e) => {
      if (e.target.id !== "delete" && recordVideoUrls.length === 0) {
        recordVideoRef.current.value = "";
        recordVideoRef.current.click();
      }
    },
    [recordVideoUrls]
  );

  const handleMediaLoadedMetadata = (mediaRef) => {
    const media = mediaRef.current;
    if (!media) return;
    if (Math.round(media.duration) > 10800) {
      ToastHandler("warn", "Max. duration should be 3hrs only.");
      deleteVideo();
    }
  };

  return (
    <div>
      <div className="mt-4">
        <small className="label_txt">
          {!isReview ? <>{allWords.misc.uploddw} &nbsp;</> : ""}
          {allWords.misc.recording}
          <InfoIcon
            infoTitle1={allWords.misc.pg3.Recommendation}
            infoTitle6={allWords.misc.recline1}
            infoTitle7={allWords.misc.recline2}
            infoTitle8={allWords.misc.recline3}
          />
        </small>
      </div>

      <div className=" d-flex mt-2">
        <div
          onClick={selectVideo}
          className={clsx(
            "d-flex flex-column justify-content-center align-items-center",
            {
              ["vidDoc"]: !isReview,
              ["vidDocReview"]: isReview || hasIdParam,
            }
          )}
        >
          {recordVideoUrls?.length !== 0 ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!recordVideoRef?.current?.files?.[0]?.type.includes("audio") ? (
                <>
                  <M3U8Player
                    src={recordVideoUrls}
                    rt_data={parsed_data}
                    label="upload"
                    current_user={current_user}
                    className="videoClass"
                    videoElem={recVidRef}
                    onUploadLoadMetaData={() =>
                      handleMediaLoadedMetadata(recVidRef)
                    }
                    owner_details={parsed_data?.owner}
                    open_to_all={parsed_data?.open_to_all}
                    id={`upload_video`}
                  />
                </>
              ) : (
                <>
                  <audio
                    preload
                    id="video_id_button"
                    className="videoClass"
                    src={recordVideoUrls}
                    ref={recVidRef}
                    muted
                    controls
                    onLoadedMetadata={() =>
                      handleMediaLoadedMetadata(recVidRef)
                    }
                    controlsList="nodownload"
                  />
                </>
              )}

              <IconButton
                className="icon"
                style={{
                  position: "absolute",
                  top: "0px",
                  right: "0px",
                }}
                hidden={hasIdParam ? true : false}
              >
                <img
                  src={DeleteSVG}
                  alt="delete_icon"
                  id="delete"
                  style={{ width: 38, height: 38 }}
                  onClick={deleteVideo}
                />
              </IconButton>
            </div>
          ) : (
            <span
              style={{
                fontSize: "0.8rem",
                color: "#63779C",
                marginTop: "4rem",
                textAlign: "center",
              }}
            >
              {allWords.misc.livert.uploadRecRT}
            </span>
          )}
        </div>
      </div>

      <input
        type="file"
        accept=".mp3,.mp4,.MP3,.MP4"
        style={{ visibility: "hidden", display: "none" }}
        ref={recordVideoRef}
        onChange={(e) => {
          vidValidation(e, "record");
        }}
      />
    </div>
  );
}
