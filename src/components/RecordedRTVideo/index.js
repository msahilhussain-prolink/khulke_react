import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { REACT_APP_BASE_URL_CLOUDFRONT } from "../../constants/env";
import clsx from "clsx";
import "./style.css";
import M3U8Player from "../M3U8Player";

export default function RecordedRTVideo(props) {
  const {
    single_rt_data,
    rt_id,
    current_user,
    fullScrc,
    volume,
    showTwoSecLogo,
    minimized = false,
    ownerId,
    disableInteraction,
    closeFullscreen,
  } = props;

  const navigate = useNavigate();

  const [videoStart, setVideoStart] = useState("");
  const [videoData, setVideoData] = useState("");
  const [ext, setExt] = useState("");

  let errorData = "";

  const videoElem = useRef();
  const audioRef = useRef();

  useEffect(() => {
    let vst = moment(new Date()).diff(
      new Date(single_rt_data?.data?.[0]?.["start"]),
      "seconds"
    );

    setVideoStart(vst);

    single_rt_data?.data?.forEach((item) => {
      if (item?.media_recording?.length > 0) {
        const media = item?.media_recording?.find((item) =>
          item?.metadata?.ext.includes("m3u8")
            ? item?.metadata?.ext.includes("m3u8")
            : item?.metadata?.mimeType.includes("video") ||
              item?.metadata?.mimeType.includes("audio")
        );
        setVideoData(media?.metadata.tempFilename);
        setExt(media?.metadata.mimeType);
      } else {
        errorData = "This RoundTable is not recorded.";
      }
    });
  }, [single_rt_data]);

  useEffect(() => {
    if (ext?.includes("video")) {
      if (
        videoElem?.current?.volume !== undefined &&
        (volume !== undefined || volume !== null)
      ) {
        videoElem.current.volume = parseFloat(volume / 100).toFixed(1);
      }
    } else if (ext === "mp3" || ext?.includes("audio")) {
      if (audioRef?.current?.volume !== undefined && volume !== undefined) {
        audioRef.current.volume = parseFloat(volume) / 100;
      }
    }
  }, [ext, volume, videoElem, audioRef]);

  return (
    <>
      {ext?.includes("audio") ? (
        <>
          <div
            className="audioDiv"
            style={{
              border: "1px solid",
              height: minimized === true ? "17rem" : "100%",
            }}
            hidden={showTwoSecLogo}
          >
            {single_rt_data?.data?.[0]?.media?.length > 0 ? (
              <img
                className="aud_cover_img"
                alt=""
                src={`${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${ownerId}/roundtable/${rt_id}/profile/${single_rt_data?.data?.[0]?.["media"]?.[0]?.["metadata"]?.["tempFilename"]}`}
                // style={{ width: "inherit" }}
              />
            ) : (
              <p
                className="rt_img_p"
                style={{ fontSize: minimized === true ? "2rem" : "2.5rem" }}
              >
                {single_rt_data?.data?.[0]?.name}
              </p>
            )}
            <audio
              ref={audioRef}
              id="player-audio-id"
                src={`${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${ownerId}/roundtable/${rt_id}/recording/${videoData}#t=${videoStart}`}
              // controls
              // muted
              autoPlay={!disableInteraction}
              onContextMenu={(e) => e.preventDefault()}
              className={clsx("audio_player", {
                ["rtVideo"]: !fullScrc,
                ["fScrVideo"]: fullScrc,
              })}
              controlsList={
                single_rt_data?.data?.[0]?.owner?.username !==
                current_user?.username
                  ? "nodownload"
                  : ""
              }
              onEnded={() => {
                navigate("/roundtable/all");
                if (fullScrc) {
                  closeFullscreen();
                }
              }}
              hidden={showTwoSecLogo}
            />
          </div>
        </>
      ) : (
        <>
          {videoData && !disableInteraction ? (
            <M3U8Player
               src={`${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${ownerId}/roundtable/${rt_id}/recording/${videoData}#t=${videoStart}`}
              videoElem={videoElem}
              label="live_rt"
              id="player-video-id"
              className={clsx({
                ["rtVideo"]: !fullScrc,
                ["fScrVideo"]: fullScrc,
              })}
              autoPlay={!disableInteraction}
              hidden={showTwoSecLogo}
              endFunc={() => {
                navigate("/roundtable/all");
                if (fullScrc) {
                  closeFullscreen();
                }
              }}
              start={single_rt_data?.data?.[0]?.["start"]}
            />
          ) : (
            ""
          )}
        </>
      )}

      {errorData && <h5>{errorData}</h5>}
    </>
  );
}
