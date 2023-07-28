import React, { useEffect } from "react";
import Hls from "hls.js";

// Styles
import "./style.css";
import { m3u8_controls, m3u8_controls_d } from "../../data";
import moment from "moment";
import { AspectRatio, Box } from "@mui/joy";

export default function M3U8Player(props) {
  const {
    muteFlag,
    src,
    increaseViewerCount,
    rt_data,
    current_user,
    label = "",
    videoElem,
    setVideoTimer,
    setLoading,
    pauseVid,
    className,
    setHideRT,
    onUploadLoadMetaData,
    owner_details,
    open_to_all,
    isMuted,
    id,
    autoPlay,
    hidden = false,
    endFunc,
    start = "",
  } = props;

  let optionFlag =
    owner_details?.username === current_user?.username ||
    (rt_data?.moderator?.username === current_user?.username &&
      rt_data?.moderator?.m_type === "co-owner");

  useEffect(() => {
    const video = document.getElementById(id);
    const defaultOptions = {};

    const ownPubflag =
      owner_details?.username == current_user?.username &&
      open_to_all == "public";

    const cont = label == "" ? m3u8_controls : [];
    const notListing = ownPubflag ? m3u8_controls_d : cont;

    const liveAuto = label === "live_rt" ? autoPlay : false;

    defaultOptions.controls =
      label !== "listing" || label !== "live_rt" ? notListing : [];

    defaultOptions.clickToPlay =
      label === "live_rt" || (label == "upload" && !optionFlag) ? false : true;

    defaultOptions.muted = label === "listing" ? true : false;

    defaultOptions.disableContextMenu =
      label == "upload" && !optionFlag ? true : false;

    defaultOptions.autoplay =
      label == "" || (label == "upload" && optionFlag) ? true : liveAuto;

    defaultOptions.ratio = "16:9";

    defaultOptions.loop = {
      active: label === "listing" ? true : false,
    };

    if (
      label === "" ||
      label === "live_rt" ||
      (label === "listing" && muteFlag) ||
      label === "upload"
    ) {
      if (src?.includes("m3u8")) {
        const hls = new Hls({ maxMaxBufferLength: 5 });
        hls.loadSource(src);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          const availableQualities = hls.levels.map((l) => l.height);
          defaultOptions.quality = {
            default: availableQualities[0],
            options: availableQualities,
            forced: true,
            onChange: (e) => updateQuality(e),
          };
          new Plyr(video, defaultOptions);
            video.muted = true;
          video.play();
        });
        hls.attachMedia(video);
        window.hls = hls;
      } else {
        video.src = src;
        video.addEventListener("loadedmetadata", () => {
          video.play();
        });
        new Plyr(video, defaultOptions);
      }
    }
  }, [src]);

  function updateQuality(newQuality) {
    window.hls.levels.forEach((level, levelIndex) => {
      if (level.height == newQuality) {
        window.hls.currentLevel = levelIndex;
      }
    });
  }

  function onLoadedMetadata() {
    videoElem?.current?.play();
    switch (label) {
      case "listing":
        videoElem.current.currentTime =
          Math.round(videoElem?.current?.duration) < 330 ? 0 : 300;
        break;
      case "upload":
        onUploadLoadMetaData();
        break;
      case "live_rt":
        videoElem.current.currentTime = moment(new Date()).diff(
          new Date(start),
          "seconds"
        );
        break;
      default:
        break;
    }
  }

  function onLoadedData() {
    if (label === "") {
      setLoading(false);
      setVideoTimer(videoElem?.current?.duration);
      setTimeout(increaseViewerCount, 5000);
    }
  }

  function onPlaying() {
    if (label === "listing") {
      const timer = setInterval(() => {
        if (Math.round(videoElem?.current?.duration) < 330) {
          if (Math.round(videoElem?.current?.currentTime) === 30)
            videoElem.current.currentTime = 0;
          videoElem.current.muted = true;
        } else {
          if (Math.round(videoElem?.current?.currentTime - 300) === 30)
            videoElem.current.currentTime = 300;
        }
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    } else if (label == "") {
      setHideRT(true);
    }
  }

  function onEnded() {
    switch (label) {
      case "listing":
        pauseVid();
        break;
      case "live_rt":
        endFunc();
        break;
      case "":
        setHideRT(false);
        break;
      default:
        break;
    }
  }
  const getVideo = () => (
    <div
    className="hlsDiv"
    style={{ width: label === "live_rt" ? "100%" : "" }}
  >
    <video
      onContextMenu={(e) => e.preventDefault()}
      disablecontextmenu="true"
      ref={videoElem}
      id={id}
      style={{ height: "100%" }}
      hidden={hidden}
      autoPlay={true}
      className={className}
      onLoadedMetadata={onLoadedMetadata}
      onLoadedData={onLoadedData}
      onPlaying={onPlaying}
      onEnded={onEnded}
      crossOrigin="anonymous"
      muted={isMuted ? isMuted : false}
      onMouseUp={onPlaying}
    />
  </div>
  )
  return (
    id === "past_video" ?
    <>
    <Box>
    <AspectRatio objectFit="contain">
       {getVideo()}
        </AspectRatio>
        </Box>
    </> : getVideo()
  );
}
