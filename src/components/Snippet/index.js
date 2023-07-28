import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import { CenterDiv } from "../../global_styles/global_style.js";
import axios from "axios";
import {
  POST_API_BASE_URL,
  REACT_APP_BASE_URL_FOR_USER,
} from "../../constants/env";
import ToastHandler from "../../utils/ToastHandler";
import like from "../../assets/icons/like.svg";
import like_fill from "../../assets/icons/like_fill.svg";
import dislike from "../../assets/icons/dislike.svg";
import dislike_fill from "../../assets/icons/dislike_fill.svg";
import comment from "../../assets/icons/comment.svg";
import comment_fill from "../../assets/icons/comment_fill.svg";
import share from "../../assets/icons/share.svg";
import PostMenuIcon from "../../assets/icons/post_menu.svg";
import Reply from "../Reply/index";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Avatar, Menu as CustomMenu, MenuItem } from "@mui/material";
import { getPostData, postDeleteData } from "../../redux/actions/postAction";
import { MenuContainer } from "../Post/style";
import styled from "styled-components";
import { moengageEvent } from "../../utils/utils";
import {
  Pause,
  PlayArrow,
  VolumeOffOutlined,
  VolumeUpOutlined,
} from "@material-ui/icons";
import PreloginComp from "../PreLoginComp";
import RoundTableIconActive from "../../assets/icons/RoundTable_icon_active.svg";
import UserProfile from "../UserProfile";
import VIPComp from "../VipComp";
import { allWords } from "../../App";
import logger from "../../logger";
import ReactPlayer from "react-player";

const SnippetComponent = ({
  videoVal,
  username,
  parentRef,
  postId,
  isLiked,
  isDisliked,
  hashTags,
  userId,
  hasCommented,
  profilename,
  likeCount,
  muted,
  setMuted,
  commentCount,
  user_type,
  parentType,
}) => {
  const [videoElement, setVideoElement] = useState();

  const [snippetState, setSnippetState] = useState({
    isPlaying: true,
    isLiked: isLiked,
    isDisliked: isDisliked,
    likeCountVal: likeCount,
    hasFollowed: false,
  });

  const [playerState, setPlayerState] = useState({
    progress: 0,
    speed: 1,
  });

  const [commentPopup, setCommentPopup] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [hover, setHover] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const snippetRef = useRef();

  const likeDislikePost = async (postId, type) => {
    const data = {
      post_id: postId,
      type,
    };

    return await axios({
      method: "post",
      url: `${POST_API_BASE_URL}/api/post/${postId}/${type}`,
      headers: {
        "device-type": "android",
        "user-id": localStorage.getItem("current_user")
          ? JSON.parse(localStorage.getItem("current_user"))?.["_id"]
          : JSON.parse(localStorage.getItem("anonymous_user"))?.["_id"],
      },
      data: data,
    })
      .then((res) => res)
      .catch((err) => logger.error(err));
  };

  const sharePost = async (postId) => {
    navigator.clipboard
      .writeText(`${window.location.origin}/post/${postId}`)
      .then(
        function () {
          /* clipboard successfully set */
          ToastHandler("sus", allWords.misc.succcopied);
        },
        function () {
          /* clipboard write failed */
          ToastHandler("dan", "Failed. try again!");
        }
      );
  };

  const togglePlay = () => {
    setSnippetState({ ...snippetState, isPlaying: !snippetState.isPlaying });
  };

  const handleOnTimeUpdate = (pr) => {
    if (hover) {
      let progress = pr.played * 100;

      if (!progress) {
        progress = 0;
      }

      setPlayerState({
        ...playerState,
        progress,
      });
    }
  };

  const handleVideoProgress = (event) => {
    const manualChange = Number(event.target.value);
    snippetRef.current.currentTime =
      (snippetRef.current.duration / 100) * manualChange;
    setPlayerState({
      ...playerState,
      progress: manualChange,
    });
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const likeHandler = (e) => {
    const { id: postId } = e.target;

    likeDislikePost(postId, "LIKE").then((res) => {
      const { data } = res.data;

      if (res.data.code === 200) {
        setSnippetState({
          ...snippetState,
          isDisliked: data.self_dislikes,
          isLiked: data.self_likes,
          likeCountVal: data.likes,
        });

        moengageEvent("Like", "Snip-It", {
          PostID: res?.data?.data?.["post_id"],
          "K Type": "SNIPPET",
          "Media type": "VIDEO",
          Status: 1,
        });
      }
    });
  };

  const dislikeHandler = (e) => {
    const { id: postId } = e.target;

    likeDislikePost(postId, "DISLIKE").then((res) => {
      const { data } = res.data;

      if (res.data.code === 200) {
        setSnippetState({
          ...snippetState,
          isDisliked: data.self_dislikes,
          isLiked: data.self_likes,
          likeCountVal: data.likes,
        });

        moengageEvent("DisLike", "Snip-It", {
          PostID: res?.data?.data?.["post_id"],
          "K Type": "SNIPPET",
          "Media type": "VIDEO",
          Status: 1,
        });
      }
    });
  };

  const shareHandler = (e) => {
    const { id: postId } = e.target;

    sharePost(postId).then((res) => {
      navigator.clipboard.writeText(res.data.url);
      ToastHandler("sus", "Link copied successfully");

      moengageEvent("Share", "Snip-It", {
        PostID: postId,
        "K Type": "SNIPPET",
        "Media type": "VIDEO",
      });
    });
  };

  const followHandler = async () => {
    const data = { handle: username, type: "follow" };

    let config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/follow-friends/`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      },
      data: data,
    };
    await axios(config)
      .then(async (res) =>
        res.status === 200 || res.status === 252
          ? setSnippetState({
              ...snippetState,
              hasFollowed: true,
            })
          : setSnippetState(snippetState)
      )
      .catch((err) => logger.error(err));
  };

  useEffect(() => {
    const options = {
      rootMargin: "0px",
      threshold: 0.5, // Adjust the threshold value as needed
    };

    const observer = new IntersectionObserver(([entry]) => {
      setIsInViewport(entry.isIntersecting);
      setSnippetState({
        ...snippetState,
        isPlaying: entry.isIntersecting,
      });
    }, options);

    if (snippetRef?.current) observer.observe(snippetRef?.current);

    return () => {
      if (snippetRef?.current) observer.unobserve(snippetRef?.current);
    };
  }, [snippetRef?.current]);

  const Menu = styled(Avatar)`
    width: 30px !important;
    height: 30px !important;
  `;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [viewCountTimer, setViewCountTimer] = useState();
  useEffect(() => {
    return () => {
      if (viewCountTimer) clearTimeout(viewCountTimer);
    };
  }, []);

  function increaseViewCount() {
    let data = new FormData();
    data.append("post_id", postId);

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

  const onPlay = () => {
    const timer = setTimeout(() => {
      moengageEvent("View", "Snip-It", {
        PostID: postId,
        "K Type": "SNIPPET",
        "Media type": "VIDEO",
      });
      increaseViewCount();
    }, [5000]);

    setViewCountTimer(timer);
  };

  const onPause = () => {
    clearTimeout(viewCountTimer);
    setViewCountTimer(null);
  };

  return (
    <>
      <CenterDiv label="snip-it" className="snippetCenterDiv">
        <div className="snippetContainer">
          <div className="snippetVideo-wrapper" ref={snippetRef}>
            <ReactPlayer
              url={videoVal}
              className="snippet"
              width="100%"
              height="100%"
              style={{ objectFit: "cover" }}
              onPlay={onPlay}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() =>
                setTimeout(() => {
                  setHover(false);
                }, 3000)
              }
              onPause={onPause}
              muted={muted}
              playing={snippetState?.isPlaying && isInViewport}
              onProgress={(pr) => {
                handleOnTimeUpdate(pr);
              }}
            />

            <div className="controlssnippet">
              <div className="actions" hidden={!hover}>
                <button onClick={togglePlay}>
                  {snippetState.isPlaying ? (
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
                value={playerState.progress}
                className="progresssnippet"
                hidden={!hover}
              />
              <button className="mute-btn" onClick={toggleMute} hidden={!hover}>
                {!muted ? (
                  <i className="bx bxs-volume-full">
                    <VolumeUpOutlined />
                  </i>
                ) : (
                  <i className="bx bxs-volume-mute">
                    <VolumeOffOutlined />
                  </i>
                )}
              </button>
            </div>
            <div className="container snippetContent">
              <div className="row contentInnerDiv">
                {hashTags.length < 150 || readMore ? (
                  <>
                    <small
                      className="snippetTags px-0"
                      dangerouslySetInnerHTML={{
                        __html: hashTags,
                      }}
                      onClick={() => setReadMore(false)}
                    />
                    {hashTags.length > 100 ? (
                      <small
                        onClick={() => setReadMore(false)}
                        className="readMoreSnippet px-0"
                      >
                        {allWords.misc.readless}
                      </small>
                    ) : null}
                  </>
                ) : (
                  <>
                    <small
                      className="snippetTags px-0"
                      dangerouslySetInnerHTML={{
                        __html: hashTags.slice(0, 50).concat("..."),
                      }}
                    />
                    {hashTags.length > 100 ? (
                      <small
                        onClick={() => setReadMore(true)}
                        className="readMoreSnippet px-0"
                      >
                        {allWords.misc.readmore}
                      </small>
                    ) : null}
                  </>
                )}
              </div>

              <div className="row snippetRow">
                <div xs={8} sm={8} className="col snippetCol">
                  <div className="snippetImageContainer">
                    <UserProfile username={username} className="snippetImage" />
                  </div>
                  <div>
                    <div style={{ display: "flex" }}>
                      <p className="snippetUsername namebeforeVip">
                        {profilename}
                      </p>
                      <VIPComp user_type={user_type} />
                    </div>
                    <p className="snippetUsername">
                      <Link
                        className="snippetUserLink"
                        to={`/profile/${username}/posts`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        @{username}
                      </Link>
                    </p>
                  </div>
                </div>
                <div xs={4} sm={4} className="col snippetColBtn" hidden>
                  <button
                    className="snippetBtn"
                    style={
                      snippetState.hasFollowed
                        ? { background: "#fff", color: "#000" }
                        : { background: "#66b984", color: "#fff" }
                    }
                    hidden={
                      userId ===
                      JSON.parse(localStorage.getItem("current_user"))?.["_id"]
                    }
                    onClick={
                      !localStorage.current_user && localStorage.anonymous_user
                        ? () => setIsAnonymous(true)
                        : followHandler
                    }
                  >
                    {snippetState.hasFollowed ? "Following" : "Follow"}
                  </button>
                </div>
              </div>
            </div>

            <div className="controlssnippet controlssnippet2">
              <div className="actions">
                <button onClick={togglePlay}>
                  {snippetState.isPlaying ? (
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
                value={playerState.progress}
                onChange={(e) => handleVideoProgress(e)}
                className="progresssnippet"
              />
              <button className="mute-btn" onClick={toggleMute}>
                {!muted ? (
                  <i className="bx bxs-volume-full">
                    <VolumeUpOutlined />
                  </i>
                ) : (
                  <i className="bx bxs-volume-mute">
                    <VolumeOffOutlined />
                  </i>
                )}
              </button>
            </div>
          </div>

          <div className="snippetSocial">
            <div>
              {JSON.parse(localStorage.getItem("current_user"))?.[
                "username"
              ] === username && (
                <MenuContainer
                  id="basic-button"
                  aria-controls="basic-menu"
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                >
                  <Menu src={PostMenuIcon} />
                </MenuContainer>
              )}
            </div>
            <CustomMenu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <div
                style={{
                  width: 200,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <>
                  <MenuItem
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      margin: "0",
                    }}
                    onClick={() => {
                      handleClose();
                      dispatch(postDeleteData(postId, parentType, false));

                      dispatch(getPostData(20));

                      if (window.location?.pathname.includes("/post")) {
                        navigate("/home");
                      }
                    }}
                  >
                    {allWords.misc.livert.del}
                  </MenuItem>
                </>
              </div>
            </CustomMenu>
            <div className="commentPart">
              <div className="snippetComment">
                <img
                  src={snippetState.isLiked ? like_fill : like}
                  className="snippetLike"
                  alt="like"
                  id={postId}
                  onClick={
                    localStorage.current_user && localStorage.anonymous_user
                      ? () => setIsAnonymous(true)
                      : likeHandler
                  }
                />
                <span>{snippetState.likeCountVal}</span>
              </div>

              <div className="snippetComment">
                <img
                  src={snippetState.isDisliked ? dislike_fill : dislike}
                  className="snippetLike"
                  alt="dislike"
                  id={postId}
                  onClick={
                    !localStorage.current_user && localStorage.anonymous_user
                      ? () => setIsAnonymous(true)
                      : userId ===
                        JSON.parse(localStorage.getItem("current_user"))?.[
                          "_id"
                        ]
                      ? ""
                      : dislikeHandler
                  }
                />
                <span>{allWords.snip.dislike}</span>
              </div>

              <div
                className="snippetComment"
                onClick={() =>
                  !localStorage.current_user && localStorage.anonymous_user
                    ? setIsAnonymous(true)
                    : setCommentPopup(true)
                }
              >
                <img
                  className="snippetLike"
                  src={hasCommented ? comment_fill : comment}
                  alt="comment"
                />
                <span className="snippetCommentText">{commentCount}</span>
              </div>
              <div className="snippetComment">
                <img
                  className="snippetLike"
                  src={share}
                  alt="share"
                  onClick={shareHandler}
                  id={postId}
                />
                <span>{allWords.snip.share}</span>
              </div>
              {commentPopup && (
                <Reply
                  post_id={postId}
                  username={username}
                  setLike={() => {}}
                  setLikeCount={() => {}}
                  postReply={commentPopup}
                  setPostReply={setCommentPopup}
                  videoFile={videoVal}
                  parentType={"SNIPPET"}
                  name={profilename}
                />
              )}

              <PreloginComp
                modalOpen={isAnonymous}
                setModalOpen={setIsAnonymous}
                icon={
                  <img
                    src={RoundTableIconActive}
                    alt=""
                    width={40}
                    height={40}
                  />
                }
                title={allWords.misc.pages.prelog}
                description={""}
              />
            </div>
          </div>
        </div>
      </CenterDiv>
    </>
  );
};

export default SnippetComponent;
