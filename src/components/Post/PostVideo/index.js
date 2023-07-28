import { useEffect, useRef, useState } from "react";
import { Pause, PlayArrow, VolumeOff, VolumeUp } from "@material-ui/icons";

import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import NewsPaperIcon from "../../../assets/icons/awesome-newspaper.svg"
import { allWords } from "../../../App";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import { POST_API_BASE_URL } from "../../../constants/env";
import "./style.css";
import axios from "axios";

export default function PostVideo(props) {
  const {src, videoCaption = "", post_id, itemType=""} = props;

  const [videoState, setVideoState] = useState({
    isPlaying: false,
    progress: 0,
  });
  const [explorevBtn, setExploreVBtn] = useState(false);
  const [watchMBtn, setWatchMBtn] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const [viewCountTimer, setViewCountTimer] = useState();

  const videoElement = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (viewCountTimer) clearTimeout(viewCountTimer);
    };
  }, []);

  useEffect(() => {
    const options = {
      rootMargin: "0px",
      threshold: 0.5, // Adjust the threshold value as needed
    };

    const observer = new IntersectionObserver(([entry]) => {
      setIsInViewport(entry.isIntersecting);
      setVideoState({
        ...videoState,
        isPlaying: entry.isIntersecting,
      });
    }, options);

    if (videoElement?.current) observer.observe(videoElement?.current);

    return () => {
      if (videoElement?.current) observer.unobserve(videoElement?.current);
    };
  }, [videoElement?.current]);

  const muted = localStorage.getItem("isMuted")
    ? localStorage.getItem("isMuted") === "false"
      ? false
      : true
    : true;

  // Video  townhall

  const togglePlay = () => {
    setVideoState({ ...videoState, isPlaying: !videoState.isPlaying });
  };

  const handleVideoProgress = (event) => {
    const manualChange = Number(event.target.value);
    videoElement.current.currentTime =
      (videoElement.current.duration / 100) * manualChange;
    setVideoState({
      ...videoState,
      progress: manualChange,
    });
  };

  const handleOnTimeUpdate = (pr) => {
    let progress = pr.played * 100;

    if (!progress) {
      progress = 0;
    }

    setVideoState({
      ...videoState,
      progress,
    });
  };

  const onLoadedMetadata = () => {
    setExploreVBtn(false);
    setWatchMBtn(true);
  };

  const onPlay = () => {
    const timer = setTimeout(() => {
      increaseViewCount();
    }, [5000]);

    setViewCountTimer(timer);
    setExploreVBtn(false);
    setWatchMBtn(true);
  };

  const onPause = () => {
    clearTimeout(viewCountTimer);
    setViewCountTimer(null);
  };

  const onEnded = () => {
    setExploreVBtn(true);
    setWatchMBtn(false);
  };

  function increaseViewCount(post_id) {
    const data = new FormData();
    data.append("post_id", post_id);

    const config = {
      method: "post",
      url: `${POST_API_BASE_URL}/view-count`,
      headers: {
        "device-type": "android",
        "user-id": JSON.parse(
          localStorage.getItem("current_user") || localStorage.anonymous_user
        )["_id"],
      },
      data: data,
    };

    axios(config).then().catch();
  }

  return (
    <>
      <div className="videoDiv" ref={videoElement}>
        <ReactPlayer
          url={src}
          className="react-player react-player-style"
          onReady={onLoadedMetadata}
          onPlay={onPlay}
          onPause={onPause}
          onEnded={onEnded}
          muted={muted}
          playing={videoState?.isPlaying && isInViewport}
          onProgress={(pr) => {
            handleOnTimeUpdate(pr);
          }}
        />
        <div className="controlsTownhallVideo">
          <div className="actionsVideoTownhall">
            <button onClick={togglePlay}>
              {videoState.isPlaying ? (
                <i className="bx bx-play">
                  <Pause />
                </i>
              ) : (
                <i className="bx bx-pause">
                  <PlayArrow className="play" />
                </i>
              )}
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={videoState.progress}
            onChange={(e) => handleVideoProgress(e)}
            className="progressVideoTownhall"
          />
          <button
            className="muteBtnTownhallVideo"
            onClick={() => {
              localStorage.setItem("isMuted", !muted);
            }}
          >
            {!muted ? (
              <i className="bx bxs-volume-full">
                <VolumeUp />
              </i>
            ) : (
              <i className="bx bxs-volume-mute">
                <VolumeOff />
              </i>
            )}
          </button>
        </div>
        {videoCaption && <p>{videoCaption}</p>}
        {itemType === "K3_POST" ? (
          <>
          <button
            className="exploreBtn"
            hidden={explorevBtn}
            onClick={() => {
              navigate("/k3", {state: {postId: post_id}});
            }}
          >
            <img
              alt=""
              src={NewsPaperIcon}
              height="18px"
              width="18px"
              style={{margin: "0.2rem 0.4rem 0.2rem 0.2rem"}}
            />
            {allWords.misc.explorekhabar}
            </button>
            <button
              className="watchMoreBtn"
              hidden={watchMBtn}
              onClick={() => {
                navigate("/k3", { state: { postId: post_id } });
              }}
            >
              <img
                alt=""
                src={NewsPaperIcon}
                height="18px"
                width="18px"
                style={{ margin: "0.2rem 0.4rem 0.2rem 0.2rem" }}
              />
              {allWords.misc.watchkhabar}
            </button>
          </>
        ) :
          itemType === "BKK_POST" ? (
            <>
          <button
            className="exploreBtn"
            hidden={explorevBtn}
            onClick={() => {
              navigate("/bol-khulke", {state: {postId: post_id}});
            }}
          >
            <img
              alt=""
              src={NewsPaperIcon}
              height="18px"
              width="18px"
              style={{margin: "0.2rem 0.4rem 0.2rem 0.2rem"}}
            />
             {allWords.misc.explorebkk}
          </button>
          <button
              className="watchMoreBtn"
              hidden={watchMBtn}
              onClick={() => {
                navigate("/bol-khulke", {state: {postId: post_id}});
              }}
              >
                <img
                  alt=""
                  src={NewsPaperIcon}
                  height="18px"
                  width="18px"
                  style={{ margin: "0.2rem 0.4rem 0.2rem 0.2rem" }}
                />
                {allWords.misc.watchbkk}
          </button>
            </>
        ) 
        :(
          <>
            <button
              className="exploreBtn"
              hidden={explorevBtn}
              onClick={() => {
                navigate("/snip-it", {state: {postId: post_id}});
              }}
            >
              <OndemandVideoIcon /> {allWords.misc.exploresnip}
            </button>
            <button
              className="watchMoreBtn"
              hidden={watchMBtn}
              onClick={() => {
                navigate("/snip-it", {state: {postId: post_id}});
              }}
            >
              <OndemandVideoIcon /> {allWords.misc.watchsnipit}
            </button>
          </>
        )}
      </div>
    </>
  );
}
