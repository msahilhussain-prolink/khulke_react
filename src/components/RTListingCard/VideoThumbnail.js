import React, { useEffect, useState } from "react";
import { REACT_APP_BASE_URL_CLOUDFRONT } from "../../constants/env";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import WithoutImage from "../../assets/images/WithoutImage.svg";

// Style
import "./style.css";
import M3U8Player from "../M3U8Player";
import AspectRatio from "@mui/joy/AspectRatio";
import { Box } from "@mui/material";

export default function VideoThumbnail(props) {
  const {
    media_recording,
    owner_details,
    c_img,
    setCImg,
    title,
    rt_id,
    videoElem,
    rt_details,
    pauseVid,
    muteFlag,
    upcoming,
  } = props;

  let current_user = null;
  current_user = JSON.parse(
    localStorage.current_user || localStorage.anonymous_user
  );

  // Local state
  const [isMuted, setIsMuted] = useState(true);
  const [videoData, setVideoData] = useState("");
  const [ext, setExt] = useState("");

  const [id, setrt_id] = useState("");
  const [Flag, setFlag] = useState(false);
  useEffect(() => {
    // console.log("1234",id!==rt_id)
    if (id !== rt_id) {
      setrt_id(rt_id);
    }
    if (muteFlag !== Flag) {
      setFlag(muteFlag);
    }
  }, [rt_id, muteFlag]);

  useEffect(() => {
    const media = media_recording?.find((item) =>
      item?.metadata?.ext.includes("m3u8")
        ? item?.metadata?.ext.includes("m3u8")
        : item?.metadata?.mimeType.includes("video") ||
          item?.metadata?.mimeType.includes("audio")
    );

    setVideoData(media?.metadata?.tempFilename);
    setExt(media?.metadata?.mimeType);
    console.log("media?.metadata?.mimeType", media?.metadata?.mimeType);
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    if (ext?.includes("audio"))
      isMuted
        ? (videoElem.current.muted = true)
        : (videoElem.current.muted = false);
  }, [ext, isMuted, videoElem]);

  return (
    <>
      <div className={`video_img ${c_img ? "" : "title_cover"}`}>
        {c_img ? (
          <Box sx={{ width: "100%", borderRadius: "sm", p: 0 }}>
            <AspectRatio
              objectFit="contain"
              sx={{ borderRadius: "10px 10px 0px 0px" }}
            >
              <img
                alt=""
                src={c_img}
                onError={() => {
                  setCImg(undefined);
                }}
              />
            </AspectRatio>
          </Box>
        ) : (
          <Box sx={{ width: "100%", borderRadius: "10px 10px 0px 0px" }}>
            <AspectRatio
              objectFit="contain"
              sx={{ borderRadius: "10px 10px 0px 0px" }}
            >
              <div>
                <img
                  alt=""
                  src={WithoutImage}
                  onError={() => {
                    setCImg(undefined);
                  }}
                />
                <div className="rt_img_p">
                  <p>{title}</p>
                </div>
              </div>
            </AspectRatio>
          </Box>
        )}
      </div>
      <div id="video_div">
        <div
          id="video_wrappers"
          className="video-wrapper"
          style={{
            width: "100%",
            height:
              rt_details?.["media_recording"]?.[0]?.["metadata"]?.["ext"] !==
              "mp4"
                ? "11.5rem"
                : "100%",
          }}
        >
          {!ext?.includes("audio") ? (
            <>
              {console.log("1234", id, muteFlag, owner_details?.user_id)}
              {Flag == true && id && owner_details && !upcoming && (
                <M3U8Player
                  muteFlag={Flag}
                  src={`${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${
                    owner_details?.user_id
                  }/roundtable/${id}/recording/${videoData}${
                    Math.round(videoElem?.current?.duration) < 330
                      ? `#t=0,31`
                      : `#t=300,331`
                  }`}
                  rt_data={rt_details?.[0]}
                  current_user={current_user}
                  label="listing"
                  videoElem={videoElem}
                  pauseVid={pauseVid}
                  owner_details={rt_details?.[0]?.owner}
                  open_to_all={rt_details?.[0]?.open_to_all}
                  isMuted={isMuted}
                  className="videoThumbnail"
                  id={`video_thumb`}
                />
              )}
            </>
          ) : (
            <div>
              <div>
                {c_img ? (
                  <Box
                    sx={{
                      width: "100%",
                      borderRadius: "10px 10px 0px 0px",
                      p: 0,
                    }}
                  >
                    <AspectRatio
                      objectFit="contain"
                      sx={{ borderRadius: "10px 10px 0px 0px" }}
                    >
                      <img
                        alt=""
                        src={c_img}
                        onError={() => {
                          setCImg(undefined);
                        }}
                      />
                    </AspectRatio>
                  </Box>
                ) : (
                  <Box
                    sx={{ width: "100%", borderRadius: "10px 10px 0px 0px" }}
                  >
                    <AspectRatio
                      objectFit="contain"
                      sx={{ borderRadius: "10px 10px 0px 0px" }}
                    >
                      <div>
                        <img
                          alt=""
                          src={WithoutImage}
                          onError={() => {
                            setCImg(undefined);
                          }}
                        />
                        <div className="rt_img_p">
                          <p>{title}</p>
                        </div>
                      </div>
                    </AspectRatio>
                  </Box>
                )}
              </div>
              <audio
                // preload
                loop={true}
                poster={`${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${rt_details?.owner?.user_id}/roundtable/${rt_details?.["_id"]}/profile/${rt_details?.["media"]?.[0]?.["metadata"]?.["tempFilename"]}`}
                id="video_id"
                className="videoClass"
                src={`${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${
                  owner_details?.user_id
                }/roundtable/${id}/recording/${videoData}${
                  Math.round(videoElem?.current?.duration) < 330
                    ? `#t=0,31`
                    : `#t=300,331`
                }`}
                ref={videoElem}
                onLoadedMetadata={() => {
                  videoElem.current.currentTime =
                    Math.round(videoElem?.current?.duration) < 330 ? 0 : 300;
                }}
                onPlaying={() => {
                  let timer = setInterval(() => {
                    if (Math.round(videoElem?.current?.duration) < 330) {
                      if (Math.round(videoElem?.current?.currentTime) === 30)
                        videoElem.current.currentTime = 0;
                    } else {
                      if (
                        Math.round(videoElem?.current?.currentTime - 300) === 30
                      )
                        videoElem.current.currentTime = 300;
                    }
                  }, 1000);

                  return () => {
                    clearInterval(timer);
                  };
                }}
                muted
                // controls
                onEnded={() => {
                  pauseVid();
                }}
              />
            </div>
          )}
          {
            <div className="controls" id="ctrl_button">
              <button
                id="mute_icon_button"
                className="mute-btn"
                onClick={toggleMute}
              >
                {!isMuted ? (
                  <VolumeUpIcon className="volumeThumbIcon" id="up_button" />
                ) : (
                  <VolumeOffIcon className="volumeThumbIcon" id="down_button" />
                )}
              </button>
            </div>
          }
        </div>
      </div>
    </>
  );
}
