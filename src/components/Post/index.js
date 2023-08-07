import { makeStyles } from "@material-ui/core/styles";
import {
  FiberManualRecord,
  Pause,
  PlayArrow,
  ShareOutlined,
  VolumeOff,
  VolumeUp,
} from "@material-ui/icons";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import {
  Divider,
  Grid,
  IconButton,
  Menu as CustomMenu,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import TagManager from "react-gtm-module";
import ReactHtmlParser from "react-html-parser";
import Moment from "react-moment";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addLike } from "../../apis/postApi";
import { allWords } from "../../App";
import Interactions from "../../assets/icons/Group 19646.svg";
import PostMenuIcon from "../../assets/icons/post_menu.svg";
import PostImg1 from "../../assets/images/post_img1.png";
import { globalImages } from "../../assets/imagesPath/images";
import CommentIcon from "../../components/IconsComponents/CommentIcon";
import DislikeComponent from "../../components/IconsComponents/DislikeComponent";
import DislikeIcon from "../../components/IconsComponents/DislikeIcon";
import LikeIcon from "../../components/IconsComponents/LikeIcon";
import RepliedIconComp from "../../components/IconsComponents/RepliedIconComponent";
import ReTweetIcon from "../../components/IconsComponents/ReTweetIcon";
import ShowLikedIcon from "../../components/IconsComponents/ShowLikedIcon";
import {
  POST_API_BASE_URL,
  REACT_APP_BASE_URL_FOR_USER,
} from "../../constants/env";
import { FullName, Username } from "../../global_styles/style";
import logger from "../../logger";
import {
  circulatePost,
  getPostData,
  postDeleteData,
} from "../../redux/actions/postAction";
import ToastHandler from "../../utils/ToastHandler";
import {
  auto_login_continue,
  filterDateTrans,
  filterURLs,
  moengageEvent,
  replaceURLs,
} from "../../utils/utils";
import Dialog from "../common/Dialog";
import GoogleTranslate from "../GoogleTranslate";
import BookmarkIcon from "../IconsComponents/BookmarkIcon";
import DislikedIconComp from "../IconsComponents/DislikeComponent";
import LikedIConComp from "../IconsComponents/LikedComponent";
import MemoOrangeTweetIcon from "../IconsComponents/OrangeTweetIcon";
import ListComponent from "../ListComponent";
import PollComponent from "../PollComponent";
import PreloginComp from "../PreLoginComp";
import Reply from "../Reply";
import Spinner from "../Spinner";
import UserProfile from "../UserProfile";
import VIPComp from "../VipComp";
import AddComment from "./AddComment";
import AudioContainer from "./AddPostDialog/AudioContainer";
import DocsContainer from "./AddPostDialog/DocsContainer";
import ListItem from "./ListItem";
import "./newpoststyle.css";
import QuotedCard from "./QuotedCard";
import RtButton from "./RtButton";
import {
  Body,
  Footer,
  Header,
  Menu,
  MenuContainer,
  PostDiv,
  PostTitle,
  SubHeader,
  SubHeaderMain,
  UserNameContainer,
} from "./style";
import "./style.css";
import OpenImage from "./ViewImages/OpenImage";
import PostVideo from "./PostVideo";
import PostImages from "./ViewImages/PostImages";
const useStyles = makeStyles(() => ({ dialog: { height: 500 } }));
const Post = ({
  post_quote_count,
  singlePost,
  post_id,
  imgSrc,
  imgData,
  title = "",
  className = "",
  hideIconContainer,
  video,
  videoFile,
  totalComment,
  totalLike,
  totalDislike,
  username,
  name,
  formatted_created_at,
  audio,
  pdf,
  excel,
  ppt,
  doc,
  audioFile,
  docsFile,
  post_type,
  post_media_type,
  post_parent,
  post_circulated_count,
  like_self,
  dislike_self,
  favorite,
  user_id,
  circulate_user,
  circulate_self,
  audioCaption,
  videoCaption,
  complete_url,
  comment_self,
  round_table_data,
  timeline_users,
  timeline_action,
  post_media,
  main_post,
  lastPost,
  show_below_line,
  sendingRef,
  type,
  polling_data,
  showAllReplies,
  showIndexes,
  setShowALlRepliesPost,
  created_at,
  mentioned_usernames,
  pollExpireTime,
  day_duration,
  hour_duration,
  GetAllPostData,
  GetAllPostDataProfile,
  requote_type,
  requote_post_id,
  mute_id,
  setAllPostData,
  nested_parent,
  liked_usernameTF,
  nextItem,
  noShowReplyLine,
  itemType,
  prnt,
  getBookmark,
  profile = false,
  setBlock,
  user_type,
  lang,
  src,
}) => {
  const imgRef = useRef();
  const [imgPreview, setImgPreview] = useState([]);
  const [addComment, setAddComment] = useState(false);
  const [postReply, setPostReply] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const [likeCount, setLikeCount] = useState(parseInt(totalLike));
  const quoteData = useSelector((state) => state.post.quoteData);
  const quoteLoading = useSelector((state) => state.post.loading);
  const circulateLoading = useSelector((state) => state.post.loading);
  const circulateData = useSelector((state) => state.post.circulateData);
  const [metadataLoading, setMetadataLoading] = useState(false);
  const replyLoading = useSelector((state) => state.post.loading);
  const post_res = useSelector((state) => state.post.post_res);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedUserList, setLikedUserList] = useState([]);
  const [dislikedUserList, setDislikedUserList] = useState([]);
  const [interactionUserList, setInteractionUserList] = useState([]);
  const [textData, setTextData] = useState("");
  const [roundTableUrl, setRoundTableUrl] = useState("");
  const [youtubeURL, setYoutubeURL] = useState("");
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  let [favourite, setFavourite] = useState(favorite);
  const [videoElement, setVideoElement] = useState();
  const [videoState, setVideoState] = useState({
    isPlaying: true,
    progress: 0,
  });
  const likeD = useSelector((state) => state.likeDislike);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles();
  const [anchorElUncirculate, setAnchorElUncirculate] = useState(null);
  const openUnCirculate = Boolean(anchorElUncirculate);
  const handleClickUncirculate = (event) => {
    setAnchorElUncirculate(event.currentTarget);
  };
  const handleCloseUncirculate = () => {
    setAnchorElUncirculate(null);
  };
  const [circulate_flag, setCirculateFlag] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [metadata, setMetadata] = useState({ title: null, image_url: null });
  const [imgIndex, setImgIndex] = useState(0);
  const [interaction, setInteraction] = useState(false);
  const [likedUser, setLikedUser] = useState(false);
  const [dislikedUser, setDislikedUser] = useState(false);
  const [circulatedUser, setCirculatedUser] = useState(false);
  let current_user = JSON.parse(
    localStorage.current_user || localStorage.anonymous_user
  );
  let data = {
    PostID: post_id,
    "K Type": post_type,
    "Media type": post_media_type,
  };
  useEffect(() => {
    if (post_res) {
      setMetadata({ title: null, image_url: null });
      setRoundTableUrl("");
      setYoutubeURL("");
      setTextData("");
    }
  }, [post_res]);
  function getHashTags(inputText, symbol) {
    const hash_regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
    const at_regex = /(?:^|\s)(?:@)([a-zA-Z._-\d]+)/gm;
    let use_reg = null;
    if (symbol === "@") {
      use_reg = at_regex;
    } else {
      use_reg = hash_regex;
    }
    const matches = [];
    let match;
    while ((match = use_reg.exec(inputText))) {
      matches.push(match[1]);
    }
    return matches;
  }
  const hash_driver = (text) => {
    let text_temp = text;
    text_temp = text_temp?.replace("<br /> ", "<br />");
    const hashes = getHashTags(text, "#");
    hashes.forEach((item) => {
      //hash
      text_temp = text_temp?.replace(
        "#" + item,
        `<a style="color: blue" href="#">#${item}</a>`
      );
    });
    const tags = getHashTags(text, "@");
    tags.forEach((item) => {
      //hash
      if (mentioned_usernames) {
        if (!mentioned_usernames.includes(item)) return;
      }

      text_temp = text_temp?.replace(
        "@" + item,
        `<a style="color: blue" href="/profile/${item}/posts"
        target="_blank"
        rel="noopener noreferrer">@${item}</a>`
      );
    });
    return text_temp;
  };

  const handleBlock = () => {
    let data = JSON.stringify({
      handle: username,
      type: "block",
    });
    axios
      .post(`${REACT_APP_BASE_URL_FOR_USER}/user-action/`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          "Content-Type": "application/json",
        },
      })
      .then(async (res) => {
        if (res.status === 200) {
          moengageEvent("Block Account", "User", {
            IdOth: user_id,
            UsernameOth: username,
          });
          if (window.location.pathname.includes("/profile")) {
            setBlock(true);
          } else {
            dispatch(getPostData(20));
          }
        }
      })
      .catch(async (e) => {
        const res = e.response;
        if (!res) return;
        if (res.status === 401) {
          return await auto_login_continue(handleBlock);
        }
      });
  };
  // ** Handle click functionality
  const handleReply = () => {
    setPostReply(true);
  };

  const handleCirculate = (e) => {
    gtmEvent("circulate icon click", "circulate");
    setAddComment(false);
    handleClickUncirculate(e);
  };

  const handleLike = (id) => {
    addLike(id, "LIKE").then((res) => {
      if (res.data.code === 200) {
        setLike(!like);
        setDislike(false);

        setLikeCount(res?.data?.data?.likes);

        moengageEvent("Like", "Post", {
          ...data,
          Status: like ? 0 : 1,
        });
      }
    });
  };
  const handleDislike = (id) => {
    addLike(id, "DISLIKE").then((res) => {
      if (res.data.code === 200) {
        setLike(false);
        setDislike(!dislike);
        setLikeCount(res?.data?.data?.likes);
        moengageEvent("DISLIKE", "Post", {
          ...data,
          Status: dislike ? 0 : 1,
        });
      }
    });
  };

  const handleShare = async () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/post/${post_id}`)
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

  useEffect(() => {
    if (like_self > 0) {
      setLike(true);
    }
    if (dislike_self > 0) {
      setDislike(true);
    }
    if (!imgPreview[imgIndex]) {
      setOpenImage(false);
    }
  }, [imgIndex, postReply]);

  const handleReplyClick = () => {
    navigate(`/post/${post_id}`);
  };

  const [metaRecieved, setMetaRecieved] = useState(false);
  const getMetaData = async (target_url) => {
    const data = JSON.stringify({ target_url: target_url });
    let access = null;
    const anonymous_user = JSON.parse(localStorage.getItem("anonymous_user"));
    access = localStorage.access || anonymous_user.token;
    const config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/${
        localStorage.anonymous_user
          ? "anonymous/get_meta_data"
          : "get_meta_data/"
      }`,
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
      data: data,
    };
    setMetadataLoading(true);
    await axios(config)
      .then(async function (response) {
        setMetadataLoading(false);
        setMetadata(response.data);
        setRoundTableUrl("");
        if (response.status === 253) {
          setMetaRecieved(false);
        } else {
          setMetaRecieved(true);
        }
      })
      .catch(async function (error) {
        const response = error.response;
        if (!response) {
          setMetadataLoading(false);
          return;
        }
        if (response.status === 401) {
          return await auto_login_continue(() => getMetaData(target_url));
        }
        setMetadataLoading(false);
      });
  };

  let youtubeRegexCheck = new RegExp(
    "^(https?://)?((www.)?youtube.com|youtu.be)/.+$"
  );

  useEffect(() => {
    if (title?.includes("https")) {
      if (youtubeRegexCheck.test(title)) {
        const url = filterURLs(title);
        setYoutubeURL(url[0]);
        setTextData(null);
      } else {
        setTextData(title);
        if (complete_url === undefined) {
          const url = filterURLs(title);
          getMetaData(url[0]);
          setYoutubeURL("");
        } else {
          getMetaData(complete_url?.[0]?.["complete_url"]);
          setYoutubeURL("");
        }
      }
    }
  }, [title, complete_url]);

  const Bookmark = (action) => {
    const FormData = require("form-data");
    const data = new FormData();
    data.append("post_id", post_id);
    data.append("type", "FAVORITE");
    axios({
      method: "post",
      url: `${POST_API_BASE_URL}/post/${post_id}/favourite`,
      headers: {
        "device-type": "android",
        "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
      },
      data: data,
    })
      .then((res) => {
        if (action == "Bookmark") {
          if (res?.status === 200) {
            if (window.location.pathname.includes("/profile")) {
              GetAllPostDataProfile(true);
            } else {
              setFavourite(1);
            }
            moengageEvent("Save", "Post", {
              PostID: post_id,
              "K Type": post_type,
              "Media type": post_media_type,
            });
          }
        } else {
          if (profile === true) return getBookmark();
          setFavourite(0);
        }
      })
      .catch((err) => {
        ToastHandler("dan", "somethings went wrong! try again.");
      });
  };

  // next
  const handleNext = () => {
    if (imgPreview[imgIndex]) {
      setImgIndex(imgIndex + 1);
    }
  };
  const handlePrevious = () => {
    setImgIndex(imgIndex - 1);
  };
  const postMute = () => {
    const data = new FormData();
    data.append("operation_type", "MUTED");
    data.append("user", `${user_id}`);
    return axios({
      method: "post",
      url: `${POST_API_BASE_URL}/post/${post_id}`,
      headers: {
        "device-type": "android",
        "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
      },
      data: data,
    })
      .then((res) => {
        if (res?.status == 200) {
          if (window.location.pathname.includes("/profile")) {
            GetAllPostDataProfile(true);
          } else {
            dispatch(getPostData(20));
          }
          moengageEvent("Mute", "User", {
            IdOth: user_id,
            UsernameOth: username,
          });
        }
      })
      .catch();
  };
  const [circulated_username, setCirculateUsername] = useState([]);
  function getUserInteraction() {
    const data3 = new FormData();
    data3.append("post_id", `${post_id}`);
    data3.append("type", "interaction");
    const config3 = {
      method: "post",
      url: `${POST_API_BASE_URL}/action-data`,
      headers: {
        "device-type": "android",
        "user-id": JSON.parse(localStorage.getItem("current_user"))?.["_id"],
      },
      data: data3,
    };
    axios(config3)
      .then(function (response) {
        if (response.data !== false) {
          const newArray = [
            ...response.data.data.circulate,
            ...response.data.data.reply,
            ...response.data.data.quote,
          ];
          const uniq = [
            ...new Set(newArray.map(({ username }) => username)),
          ].map((e) => newArray.find(({ username }) => username == e));
          setInteractionUserList(uniq);

          let temp_user = [];
          response?.data?.data?.circulate?.map((item) =>
            temp_user.push({
              username: item?.["username"],
              name: item?.["name"],
              is_following: item?.["you_follow"],
              user_id: "",
            })
          );
          setCirculateUsername(temp_user);
        }
      })
      .catch(function () {});
  }

  function getLikes(actiotype) {
    const data = new FormData();
    data.append("post_id", `${post_id}`);
    data.append("type", actiotype);
    const config = {
      method: "post",
      url: `${POST_API_BASE_URL}/action-data`,
      headers: {
        "device-type": "android",
        "user-id": JSON.parse(localStorage.getItem("current_user"))?.["_id"],
      },
      data: data,
    };
    axios(config).then(function (response) {
      let temp_user = [];
      if (response.data !== false) {
        response?.data?.data?.users?.map((item) =>
          temp_user.push({
            username: item?.["username"],
            name: item?.["name"],
            is_following: item?.["you_follow"],
            user_id: "",
          })
        );
        if (actiontype == "like") {
          setLikeCount(response?.data?.data?.users?.length);
          setLikedUserList(temp_user);
        } else {
          setDislikedUserList(temp_user);
        }
      }
    });
  }


  useEffect(() => {
    if (singlePost) {
      // Likes
      if (likeCount > 0) {
        getLikes("like");
      }
      // DisLikes
      if (totalDislike > 0) {
        getLikes("dislike");
      }
      // Interaction
      getUserInteraction();

      setCirculateFlag(false);
    }
  }, []);

  useEffect(() => {
    if (circulate_flag === true) {
      if (circulateData) {
        getUserInteraction();
        if (window.location.pathname.includes("/notifications")) {
          GetAllPostData("interaction");
          GetAllPostData("reaction");
        } else if (window.location.pathname.includes("/profile")) {
          setAllPostData([]);
          GetAllPostDataProfile(true);
        } else {
          dispatch(getPostData(20));
        }
      }
    }
  }, [circulateData]);

  const postRef = useRef();

  function gtmEvent(info, action) {
    logger.info(info);
    TagManager.dataLayer({
      dataLayer: {
        event: `${
          info == "share" ? "share post event" : "Post reaction event"
        }`,
        category: `${info == "share" ? "Share post" : "User Post Reaction"}`,
        action: action,
        label: "Click",
        userID: current_user._id,
      },
    });
  }
  function gtmEventCirculateOption(info, label) {
    console.log(info, label,"info_label")
    logger.info(info);
    TagManager.dataLayer({
      dataLayer: {
        event: "Post reaction event",
        category: "User Post Reaction",
        action: "circulate",
        label: label,
        userID: current_user._id,
      },
    });
  }
  
  const follow_unfollow_driver = async (handle, type) => {
    if (!handle || !type) {
      return;
    }
    let data = JSON.stringify({ handle, type });
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
      .then(async (res) => {
        if (res.status === 200) {
          let temp_solution = [];
          if (likedUser === true) {
            temp_solution = [...likedUserList];
          } else if (dislikedUser === true) {
            temp_solution = [...dislikedUserList];
          }
          let toset = true;
          if (type === "unfollow") {
            toset = false;
          }
          for (let i = 0; i < temp_solution.length; i++) {
            if (temp_solution[i]["username"] === handle) {
              temp_solution[i]["is_following"] = toset;
              if (likedUser === true) {
                setLikedUserList(temp_solution);
              } else if (dislikedUser === true) {
                setDislikedUserList(temp_solution);
              }
              return;
            }
          }
        }
      })
      .catch(async (e) => {
        const res = e.response;
        if (!res) return;
        if (res.status === 401) {
          return auto_login_continue(() => {
            return follow_unfollow_driver(handle, type);
          });
        }
      });
  };
  function extractDomain(url) {
    let domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url?.indexOf("://") > -1) {
      domain = url?.split("/")[2];
    } else {
      domain = url?.split("/")[0];
    }
    //find & remove www
    if (domain?.indexOf("www.") > -1) {
      domain = domain.split("www.")[1];
    }
    domain = domain?.split(":")[0]; //find & remove port number
    domain = domain?.split("?")[0]; //find & remove url params
    return domain ? domain : "";
  }
  const [postOpen, setPostOpen] = useState(false);
  const [postIcon, setPostIcon] = useState("");
  const [postTitles, setPostTitles] = useState("");
  const [postDec, setPostDec] = useState("");
  const [viewCountTimer, setViewCountTimer] = useState();
  useEffect(() => {
    return () => {
      if (viewCountTimer) clearTimeout(viewCountTimer);
    };
  }, []);

  function increaseViewCount() {
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
  const [chars, setChars] = useState(300);
  const [full, setFull] = useState(false);
  function readMoreFunc() {
    if (singlePost) {
      setFull((prev) => !prev);
    }
  }
  useEffect(() => {
    if (full && singlePost) {
      setChars(undefined);
    } else {
      setChars(300);
    }
  }, [full, chars]);
  const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;

  return (
    <>
      {/* Circulated user data */}
      {timeline_action !== "LIKE" && timeline_action !== "DISLIKE" && (
        <>
          {post_circulated_count > 0 ? (
            <div
              style={{
                marginTop: "0.2rem",
                marginBottom: "-0.8rem",
                fontSize: "0.9rem",
              }}
              className="d-flex"
            >
              {!singlePost && (
                <div
                  style={{
                    color: "#4a5982",
                    fontSize: "0.88rem",
                    fontWeight: "bold",
                    width: "100%",
                    marginLeft: "1rem",
                  }}
                >
                  {circulate_user && <ReTweetIcon />}
                  <span style={{ marginLeft: "0.2rem" }}>
                    {post_circulated_count > 1 &&
                    (circulate_user || timeline_users?.length) ? (
                      <span
                        onClick={() => {
                          getUserInteraction();
                          setCirculatedUser(true);
                        }}
                      >
                        {circulate_user === current_user["username"] ||
                        timeline_users?.[0] === current_user["username"]
                          ? "You"
                          : "@" + circulate_user || timeline_users?.[0]}{" "}
                        and {post_circulated_count - 1}
                        {post_circulated_count - 1 === 1 ? " other" : " others"}
                      </span>
                    ) : (
                      <>
                        {circulate_user && (
                          <Link
                            to={`/profile/${
                              circulate_user || timeline_users?.[0]
                            }/posts`}
                            target="_blank"
                            style={{ textDecoration: "none", color: "#4a5982" }}
                          >
                            {circulate_user === current_user["username"] ||
                            timeline_users?.[0] === current_user["username"]
                              ? "You"
                              : "@" + circulate_user || timeline_users?.[0]}
                          </Link>
                        )}
                      </>
                    )}
                  </span>{" "}
                  {circulate_user && <span>circulated this post</span>}
                </div>
              )}
            </div>
          ) : (
            ""
          )}
        </>
      )}
      {window.location.pathname == "/home" &&
        liked_usernameTF &&
        !circulate_user &&
        itemType !== "COMMENT" && (
          <div
            style={{
              color: "#4a5982",
              fontSize: "0.88rem",
              fontWeight: "bold",
              marginLeft: "1rem",
              marginBottom: "-10px",
              cursor: "pointer",
            }}
            onClick={() => {
              if (liked_usernameTF?.length > 1) {
                getLikes("like");
                setLikedUser(true);
              }
            }}
          >
            <ShowLikedIcon /> &nbsp;
            {`@${liked_usernameTF?.length && liked_usernameTF[0].username}`}
            &nbsp;
            {liked_usernameTF?.length - 1 >= 1 && (
              <>{`& ${liked_usernameTF?.length - 1} other `}</>
            )}
            liked
          </div>
        )}

      {window.location.pathname == "/home" &&
        nested_parent &&
        itemType !== "COMMENT" && (
          <div
            style={{
              color: "#4a5982",
              fontSize: "0.88rem",
              fontWeight: "bold",
              marginLeft: "2rem",
            }}
          >
            <RepliedIconComp /> {`${nextItem} replied`}
          </div>
        )}
      <PostDiv
        ref={main_post === true ? sendingRef : postRef}
        onClick={(e) => {
          if (
            (e.target.id === "townhall_post_container" ||
              e.target.id === "townhall_post_body" ||
              e.target.id === "post_footer_container" ||
              e.target.id === "post_header_container") &&
            post_id
          ) {
            navigate(`/post/${post_id}`);
          }
        }}
        className={`${post_id} ${className} postStylekk ${
          main_post === true ? "highlighted_post" : ""
        }`}
        id="townhall_post_container"
        contextMenu="none"
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        {/* Liked user data */}
        {likeCount > 0 ? (
          <>
            {timeline_action === "LIKE" && (
              <div
                style={{
                  marginTop: "0.7rem",
                  marginLeft: "0.5rem",
                  color: "#4a5982",
                  fontSize: "0.88rem",
                  fontWeight: "bold",
                  width: "100%",
                }}
              >
                <span style={{ cursor: "pointer" }}>
                  {likeCount === 1 ? (
                    <>
                      <ShowLikedIcon />
                      <Link
                        to={`/profile/${timeline_users?.[0]}/posts`}
                        target="_blank"
                        style={{ textDecoration: "none", color: "#4a5982" }}
                      >
                        {timeline_users &&
                        timeline_users?.[0] === current_user?.["username"]
                          ? "You"
                          : "@" + timeline_users?.[0]}
                      </Link>{" "}
                    </>
                  ) : (
                    <span
                      onClick={() => {
                        if (likeCount > 1) {
                          getLikes("like");
                          setLikedUser(true);
                        }
                      }}
                    >
                      {likeCount > 1 ? (
                        <>
                          <ShowLikedIcon />
                          {timeline_users?.length &&
                          timeline_users[0] === current_user?.["username"]
                            ? "You"
                            : "@" + timeline_users[0]}{" "}
                          and {likeCount - 1}{" "}
                          {likeCount && likeCount - 1 === 1
                            ? "other has"
                            : "others"}{" "}
                        </>
                      ) : null}{" "}
                    </span>
                  )}
                </span>
                <span>{allWords.misc.liked_post}</span>
              </div>
            )}
          </>
        ) : null}

        {/* Disliked user data */}
        {timeline_users?.length > 0 || totalDislike > 0 ? (
          <>
            {timeline_action === "DISLIKE" && (
              <div
                style={{
                  marginTop: "0.7rem",
                  marginLeft: "0.5rem",
                  color: "#4a5982",
                  fontSize: "0.88rem",
                  fontWeight: "bold",
                }}
              >
                <span style={{ fontWeight: "600", marginLeft: "0.3rem" }}>
                  {totalDislike === 1 ? (
                    <>
                      <DislikeComponent />{" "}
                      <Link
                        to={`/profile/${timeline_users?.[0]}/posts`}
                        target="_blank"
                        style={{ textDecoration: "none", color: "#4a5982" }}
                      >
                        {timeline_users &&
                        timeline_users?.[0] === current_user?.["username"]
                          ? "You"
                          : "@" + timeline_users?.[0]}
                      </Link>{" "}
                    </>
                  ) : (
                    <span
                      onClick={() => {
                        if (totalDislike > 1) {
                          getLikes("dislike");
                          setDislikedUser(true);
                        }
                      }}
                    >
                      {totalDislike > 1 ? (
                        <>
                          <DislikeComponent />
                          {timeline_users &&
                          timeline_users?.[0] === current_user?.["username"]
                            ? "You"
                            : "@" + timeline_users?.[0]}{" "}
                          and {totalDislike - 1}{" "}
                          {totalDislike - 1 === 1 ? "other" : "others"}{" "}
                        </>
                      ) : null}{" "}
                    </span>
                  )}
                </span>
                <span>disliked your post</span>
              </div>
            )}
          </>
        ) : null}

        <Header id="post_header_container" className="headikk">
          <SubHeaderMain>
            <UserProfile
              username={username}
              onClick={() => navigate(`/profile/${username}/posts`)}
            />
            <SubHeader>
              <FullName>
                <div>
                  <Link
                    to={`/profile/${username}/posts`}
                    style={{ textDecoration: "none" }}
                  >
                    {name || "Anonymous"}
                  </Link>
                  <VIPComp user_type={user_type} />
                  <RtButton round_table_data={round_table_data} />
                </div>
              </FullName>
              <UserNameContainer className="custom_user">
                <Link
                  to={`/profile/${username}/posts`}
                  style={{ textDecoration: "none" }}
                >
                  <Username>@{username}</Username>
                </Link>
                <FiberManualRecord className="dot_icon" />
                <p
                  onClick={() => {
                    post_id && navigate(`/post/${post_id}`);
                  }}
                  className="time-ago-p"
                >
                  {formatted_created_at || `2 ${allWords.misc.minago}`}
                </p>
              </UserNameContainer>
            </SubHeader>
          </SubHeaderMain>
          <div>
            {favourite > 0 && (
              <IconButton
                style={{ width: 50, height: 50 }}
                onClick={() => Bookmark("handleUnBookmark")}
              >
                <BookmarkIcon />
              </IconButton>
            )}
            <MenuContainer
              id="basic-button"
              aria-controls="basic-menu"
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              hidden={post_type === "RSS" ? true : false}
              className="menucontainer_inside_post"
            >
              <Menu src={PostMenuIcon} />
            </MenuContainer>
          </div>
        </Header>
        <div className="body_line_container">
          {singlePost && !main_post && !lastPost ? (
            <div className="vl_cont">
              {!show_below_line ? (
                <div
                  className="vl"
                  style={{
                    height: showAllReplies
                      ? "calc(100% + 28px)"
                      : "calc(100% + 45px)",
                  }}
                ></div>
              ) : (
                <div></div>
              )}
            </div>
          ) : (
            <div className="vl_cont">
              {prnt && (
                <>
                  <div
                    className="vl"
                    style={{
                      height:
                        totalComment >= 2
                          ? "calc(100% + 20px)"
                          : "calc(100% + 50px)",
                    }}
                  ></div>
                  {!prnt && <div className="small_box"></div>}
                </>
              )}
            </div>
          )}
          <div className="bodyCont">
            <Body id="townhall_post_body" className="postBodkk">
              <PollComponent
                type={type}
                polling_data={polling_data}
                username={username}
                current_user={current_user}
                pollExpireTime={pollExpireTime}
                day_duration={day_duration}
                hour_duration={hour_duration}
                post_id={post_id}
                hash_driver={hash_driver}
              />
              {youtubeURL && (
                <>
                  <PostTitle>
                    <div
                      style={{ whiteSpace: "pre-wrap" }}
                      dangerouslySetInnerHTML={{
                        __html: replaceURLs(title),
                      }}
                    />
                  </PostTitle>
                  <ReactPlayer
                    className="react-player"
                    width="100%"
                    height="300px"
                    controls={true}
                    url={youtubeURL}
                  />
                </>
              )}
              {textData && post_type !== "POLL" ? (
                <div className="yeWaliDvi">
                  {!metaRecieved && (
                    <div
                      style={{
                        color: "#009AD3",
                        height: "25px",
                        overflow: "hidden",
                      }}
                    >
                      <a
                        rel="noreferrer"
                        target="_blank"
                        style={{ color: "#009AD3" }}
                        href={title.slice(title.search(urlRegex))}
                        dangerouslySetInnerHTML={{
                          __html: title.slice(title.search(urlRegex)),
                        }}
                      />
                    </div>
                  )}

                  <div
                    onClick={
                      singlePost
                        ? ""
                        : () =>
                            window.open(
                              `${window.location.origin}/post/${post_id}`
                            )
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {`${ReactHtmlParser(
                      textData?.split("<br />")[1]?.substring(0, chars)
                    )}${
                      textData?.split("<br />")[1]?.length > 300 && !full
                        ? "..."
                        : ""
                    }`}
                    {textData?.split("<br />")[1]?.length > 300 && (
                      <span
                        className="readMoreSpan"
                        onClick={() => readMoreFunc()}
                        style={{
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                          color: "#66B984",
                          marginLeft: "5px",
                        }}
                      >
                        {!full
                          ? allWords.misc.readmore
                          : allWords.misc.readless}
                      </span>
                    )}
                  </div>
                </div>
              ) : null}
              {metaRecieved && metadata.title ? (
                <>
                  {post_media_type?.length === 0 &&
                  polling_data?.options.length === 0 &&
                  post_type !== "POLL" ? (
                    <>
                      {type !== "RSS" &&
                      textData.split("<br />").length > 1 &&
                      textData !== title
                        ? textData.split("<br />").at(-1)
                        : ""}
                      <div className="meta_cont_in_post">
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href={filterURLs(title)?.[0]}
                        >
                          {metadata?.image_url && (
                            <Grid container>
                              <Grid item xs={12}>
                                <img
                                  alt=""
                                  style={{
                                    width: "100%",
                                    maxHeight: "350px",
                                    objectFit: "cover",
                                  }}
                                  src={metadata?.image_url}
                                />
                              </Grid>
                            </Grid>
                          )}
                          {metadata?.title && (
                            <p className="meta_title">{metadata?.title} </p>
                          )}

                          {metadata?.content && (
                            <p className="meta_content">{metadata?.content}</p>
                          )}
                          <span
                            style={{
                              fontSize: "0.80rem",
                              color: "#536471",
                              fontWeight: "bold",
                              display: "block",
                              marginLeft: "8px",
                              marginBottom: "8px",
                              marginTop: "6px",
                            }}
                          >
                            {extractDomain(filterURLs(title)?.[0])}
                          </span>
                        </a>
                      </div>
                    </>
                  ) : post_type === "POLL" ? null : (
                    <a
                      className="link-to-show"
                      rel="noreferrer"
                      target="_blank"
                      style={{ color: "#009AD3" }}
                      href={textData.split("<br />").at(-1)}
                    >
                      {textData.split("<br />").at(-1)}
                    </a>
                  )}
                </>
              ) : (
                ""
              )}
              {title !== "undefined" && type !== "POLL" && (
                <PostTitle
                  style={{
                    whiteSpace: "pre-wrap",
                    width: "83%",
                    marginLeft: "0rem",
                  }}
                  onClick={() => {
                    navigate(`/post/${post_id}`);
                  }}
                >
                  {roundTableUrl ? (
                    <>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: replaceURLs(title),
                        }}
                      />
                    </>
                  ) : (
                    <>
                      {ReactHtmlParser(
                        title?.includes("https") ? "" : hash_driver(title)
                      )}
                    </>
                  )}
                </PostTitle>
              )}
              {requote_type === "POLL" && (
                <>
                  <span
                    onClick={() => {
                      window.open(
                        `${window.location.origin}/post/${requote_post_id}`
                      );
                    }}
                    className="requote_poll_txt"
                  >
                    {allWords.misc.showthispoll}
                  </span>
                </>
              )}
              {metadataLoading && (
                <>
                  <Spinner />
                  <br />
                </>
              )}
              {audio ? (
                <>
                  <AudioContainer
                    audioFilePath={`${POST_API_BASE_URL}/post-media/media/${audioFile}`}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    viewCountTimer={viewCountTimer}
                    setViewCountTimer={setViewCountTimer}
                    increaseViewCount={increaseViewCount}
                  />
                  {audioCaption && <p>{audioCaption}</p>}
                </>
              ) : undefined}
              {/* pdf */}
              {pdf && (
                <div style={{ marginBottom: "1.3rem" }}>
                  <DocsContainer
                    docsFilePath={`${POST_API_BASE_URL}/post-media/media/${docsFile}`}
                    docsFile={
                      post_media ? post_media[0]?.extra?.orignalFilename : null
                    }
                    orignalFilename={
                      post_media ? post_media[0]?.extra?.orignalFilename : null
                    }
                    thumbnail={
                      post_media &&
                      `${POST_API_BASE_URL}/post-media/frame/${post_media[0]?.name}`
                    }
                  />
                </div>
              )}
              {ppt && (
                <div style={{ marginBottom: "1.3rem" }}>
                  <DocsContainer
                    docsFilePath={`${POST_API_BASE_URL}/post-media/media/${docsFile}`}
                    pptDoc={
                      post_media ? post_media[0]?.extra?.orignalFilename : null
                    }
                    orignalFilename={
                      post_media ? post_media[0]?.extra?.orignalFilename : null
                    }
                    thumbnail={
                      post_media &&
                      `${POST_API_BASE_URL}/post-media/frame/${post_media[0]?.name}`
                    }
                  />
                </div>
              )}
              {excel && (
                <div style={{ marginBottom: "1.3rem" }}>
                  <DocsContainer
                    docsFilePath={`${POST_API_BASE_URL}/post-media/media/${docsFile}`}
                    excelDoc={
                      post_media ? post_media[0]?.extra?.orignalFilename : null
                    }
                    orignalFilename={
                      post_media ? post_media[0]?.extra?.orignalFilename : null
                    }
                    thumbnail={
                      post_media &&
                      `${POST_API_BASE_URL}/post-media/frame/${post_media[0]?.name}`
                    }
                  />
                </div>
              )}
              {doc && (
                <div style={{ marginBottom: "1.3rem" }}>
                  <DocsContainer
                    docsFilePath={`${POST_API_BASE_URL}/post-media/media/${docsFile}`}
                    wordDoc={
                      post_media ? post_media[0]?.extra?.orignalFilename : null
                    }
                    orignalFilename={
                      post_media ? post_media[0]?.extra?.orignalFilename : null
                    }
                    thumbnail={
                      post_media &&
                      `${POST_API_BASE_URL}/post-media/frame/${post_media[0]?.name}`
                    }
                  />
                </div>
              )}

              {video ? (
                <PostVideo
                  src={src}
                  videoCaption={videoCaption}
                  post_id={post_id}
                  itemType={post_type}
                />
              ) : (
                <PostImages
                  PostImg={PostImg1}
                  imgData={imgData}
                  imgSrc={imgSrc}
                  setImgIndex={setImgIndex}
                  setImgPreview={setImgPreview}
                  setOpenImage={setOpenImage}
                />
              )}
              {singlePost &&
                (lang == "en" || lang == "hi" || lang == "ta") &&
                JSON.parse(localStorage.getItem("current_user"))?.[
                  "display_language"
                ] !== lang && <GoogleTranslate lang={lang} post_id={post_id} />}

              <QuotedCard
                post_id={post_id}
                post_media_type={post_media_type}
                post_parent={post_parent}
                post_type={post_type}
              />
              {/* POST Details */}
              {singlePost && main_post && (
                <>
                  <>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        paddingTop: "10px",
                        color: "#606060",
                      }}
                    >
                      <Moment format="hh:mm A">{created_at}</Moment>
                      <span
                        style={{
                          marginLeft: "8px",
                          marginRight: "8px",
                          fontSize: "0.9rem",
                          color: "#606060",
                        }}
                      >
                        •
                      </span>
                      <Moment
                        interval={0}
                        format="DD MMM YYYY"
                        filter={filterDateTrans}
                        withTitle
                      >
                        {created_at}
                      </Moment>
                    </div>
                  </>
                  <Divider style={{ marginTop: "2px" }} />
                  <div
                    style={{
                      width: "98%",
                      display: "flex",
                      justifyContent: "space-between",
                      margin: "0.5rem 0.5rem 0.5rem 0.3rem",
                      fontSize: "0.95rem",
                    }}
                  >
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        if (
                          !localStorage.current_user &&
                          localStorage.anonymous_user
                        ) {
                          setPostOpen(true);
                          setPostIcon(<img src={Interactions} alt="" />);
                          setPostDec("");
                          setPostTitles(
                            "For viewing Interactions, Login or sign up to Khul Ke"
                          );
                          return;
                        }
                        if (totalComment > 0 || post_circulated_count > 0) {
                          setInteraction(true);
                        }
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>
                        {totalComment + post_circulated_count}
                      </span>
                      {allWords.snip.interactions}
                    </span>
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        if (
                          !localStorage.current_user &&
                          localStorage.anonymous_user
                        ) {
                          setPostOpen(true);
                          setPostIcon(<LikedIConComp />);
                          setPostDec("");
                          setPostTitles(
                            "For viewing Likes, Login or sign up to Khul Ke"
                          );
                          return;
                        }

                        if (likeCount > 0) {
                          setLikedUser(true);
                        }
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>{likeCount}</span>{" "}
                      {allWords.snip.likes}
                    </span>
                    <span
                      onClick={() => {
                        if (totalDislike > 0) {
                          setDislikedUser(true);
                        }
                      }}
                    >
                      {JSON.parse(localStorage.getItem("current_user"))?.[
                        "username"
                      ] === username ? (
                        <>
                          <span style={{ fontWeight: "bold" }}>
                            {totalDislike}
                          </span>{" "}
                          {allWords.snip.dislike}
                        </>
                      ) : undefined}
                    </span>
                  </div>
                  <Divider />
                </>
              )}
            </Body>
            {hideIconContainer ? undefined : (
              <Footer
                className="postFotkk footerStep"
                style={{ marginLeft: "0rem", width: "100%" }}
                disabled={
                  mute_id?.includes(current_user?.username) ? true : false
                }
              >
                <div
                  id="post_footer_container"
                  style={{
                    display: "flex",
                    width: "99%",
                    alignItems: "center !important",
                  }}
                >
                  <ListItem
                    num={totalComment || "0"}
                    Icon={comment_self ? RepliedIconComp : CommentIcon}
                    disabled={
                      mute_id?.includes(current_user?.username) ? true : false
                    }
                    onClick={() => {
                      if (
                        !localStorage.current_user &&
                        localStorage.anonymous_user
                      ) {
                        setPostOpen(true);
                        setPostIcon(<RepliedIconComp />);
                        setPostDec("");
                        setPostTitles(allWords.misc.pages.prelogin.mtext);
                        return;
                      }
                      handleReply();
                      gtmEvent("reply", "reply");
                      set;
                    }}
                    onNumClick={handleReplyClick}
                  />
                  <ListItem
                    num={post_circulated_count + quoteData?.count || "0"}
                    Icon={
                      circulate_user === current_user?.["username"] ||
                      timeline_users?.[0] === current_user?.["username"] ||
                      circulate_self === 1
                        ? MemoOrangeTweetIcon
                        : ReTweetIcon
                    }
                    disabled={
                      mute_id?.includes(current_user?.username) === true
                        ? true
                        : false
                    }
                    onClick={(e) => {
                      if (
                        !localStorage.current_user &&
                        localStorage.anonymous_user
                      ) {
                        setPostOpen(true);
                        setPostIcon(<MemoOrangeTweetIcon />);
                        setPostDec("");
                        setPostTitles(allWords.misc.pages.prelogin.mtext);
                        return;
                      }

                      handleCirculate(e);
                    }}
                    iconColor={
                      circulate_user === current_user?.["username"] ||
                      timeline_users?.[0] === current_user?.["username"] ||
                      circulate_self === 1
                        ? true
                        : false
                    }
                  />
                  {/* likes */}
                  <ListItem
                    num={likeCount || "0"}
                    Icon={like ? LikedIConComp : LikeIcon}
                    disabled={
                      JSON.parse(localStorage.getItem("current_user"))?.[
                        "username"
                      ] === username ||
                      mute_id?.includes(current_user?.username)
                        ? true
                        : false
                    }
                    onClick={() => {
                      if (
                        !localStorage.current_user &&
                        localStorage.anonymous_user
                      ) {
                        setPostOpen(true);
                        setPostIcon(<LikedIConComp />);
                        setPostDec("");
                        setPostTitles(allWords.misc.pages.prelogin.mtext);
                        return;
                      }
                      handleLike(post_id);
                      gtmEvent("like gtm", "like");
                    }}
                  />
                  {/* dislikes */}
                  <ListItem
                    num={
                      JSON.parse(localStorage.getItem("current_user"))?.[
                        "username"
                      ] === username
                        ? totalDislike
                        : ""
                    }
                    Icon={dislike ? DislikedIconComp : DislikeIcon}
                    disabled={
                      JSON.parse(localStorage.getItem("current_user"))?.[
                        "username"
                      ] === username ||
                      mute_id?.includes(current_user?.username)
                        ? true
                        : false
                    }
                    onClick={() => {
                      if (
                        !localStorage.current_user &&
                        localStorage.anonymous_user
                      ) {
                        setPostOpen(true);
                        setPostIcon(<DislikedIconComp />);
                        setPostDec("");
                        setPostTitles(allWords.misc.pages.prelogin.mtext);
                        return;
                      }
                      handleDislike(post_id);
                      gtmEvent("dislike", "dislike");
                    }}
                  />
                </div>
                <ListItem
                  Icon={ShareOutlined}
                  onClick={() => {
                    moengageEvent("Share", "Post", {
                      PostID: post_id,
                      "K Type": post_type,
                      "Media type": post_media_type,
                    });
                    handleShare();
                    gtmEvent("share", "share");
                  }}
                />
              </Footer>
            )}
          </div>
        </div>

        {showAllReplies && (
          <>
            <span
              onClick={() => {
                setShowALlRepliesPost(showIndexes);
              }}
              className="show_all_replyline"
            >
              {allWords.misc.showallrep}
            </span>
            <hr style={{ marginTop: "8px", marginBottom: "0px" }} />
          </>
        )}

        {window.location.pathname == "/home" && totalComment >= 2 && (
          <>
            <div
              onClick={() => {
                navigate(`/post/${post_id}`);
              }}
              className="show_all_replyline_2 show_all_dotted_line"
              style={{ display: noShowReplyLine ? "none" : "block" }}
            >
              {allWords.misc.showallrep}
            </div>
          </>
        )}
        {singlePost ? (
          main_post ? (
            <hr className="main_post_hr" />
          ) : (
            ""
          )
        ) : (
          !prnt && <hr className="main_post_hr" />
        )}

        {singlePost && !main_post && show_below_line && !lastPost && (
          <hr className="line_btw_post" />
        )}
      </PostDiv>

      {/* openImage */}
      {openImage && (
        <OpenImage
          openImage={openImage}
          setOpenImage={setOpenImage}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          imgIndex={imgIndex}
          imgPreview={imgPreview}
          imgData={imgData}
          imgRef={imgRef}
          imgSrc={imgSrc}
        />
      )}
      {/*  */}
      {addComment && (
        <AddComment
          user_id={user_id}
          addComment={addComment}
          ppt={ppt}
          excel={excel}
          doc={doc}
          pdf={pdf}
          post_media={post_media}
          setRoundTableUrl={setRoundTableUrl}
          setMetadata={setMetadata}
          setYoutubeURL={setYoutubeURL}
          totalComment={totalComment > 0 && totalComment}
          post_circulated_count={
            post_circulated_count > 0 && post_circulated_count
          }
          like_self={like_self}
          dislike_self={dislike_self}
          likeCount={likeCount}
          name={name}
          username={username}
          post_id={post_id}
          loading={quoteLoading}
          setAddComment={setAddComment}
          audio
          audioFile={audioFile}
          circulateLoading={circulateLoading}
          formatted_created_at={formatted_created_at}
          docsFile={docsFile}
          video
          videoFile={videoFile}
          title={title}
          imgData={imgData}
          type={type}
          polling_data={polling_data}
          GetAllPostDataProfile={GetAllPostDataProfile}
          src={src}
        />
      )}
      {/* Reply */}
      {postReply && (
        <Reply
          user_id={user_id}
          ppt={ppt}
          excel={excel}
          doc={doc}
          pdf={pdf}
          post_media={post_media}
          setLike={setLike}
          setLikeCount={setLikeCount}
          totalComment={totalComment > 0 && totalComment}
          post_circulated_count={
            post_circulated_count > 0 && post_circulated_count
          }
          like_self={like_self}
          dislike_self={dislike_self}
          likeCount={likeCount}
          loading={replyLoading}
          post_id={post_id}
          username={username}
          name={name}
          postReply={postReply}
          setPostReply={setPostReply}
          videoFile={videoFile}
          audioFile={audioFile}
          docsFile={docsFile}
          imgData={imgData}
          formatted_created_at={formatted_created_at}
          title={title}
          GetAllPostDataProfile={GetAllPostDataProfile}
          src={src}
        />
      )}
      {/* menu */}
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
        <div style={{ width: 200, display: "flex", flexDirection: "column" }}>
          {favourite ? (
            <>
              <MenuItem
                style={{ width: "100%", padding: "0.5rem", margin: "0" }}
                onClick={() => {
                  handleClose();
                  Bookmark("handleUnBookmark");
                }}
              >
                {allWords.misc.unsave}
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem
                style={{ width: "100%", padding: "0.5rem", margin: "0" }}
                onClick={() => {
                  if (
                    !localStorage.current_user &&
                    localStorage.anonymous_user
                  ) {
                    setPostOpen(true);
                    setPostIcon(
                      <img
                        src={globalImages.si_rt_menu_a}
                        alt=""
                        width={40}
                        height={40}
                      />
                    );
                    setPostDec("");
                    setPostTitles(
                      "To Save a Post, Login or sign up to Khul Ke"
                    );
                    return;
                  }
                  handleClose();
                  Bookmark("Bookmark");
                }}
              >
                {allWords.misc.save}
              </MenuItem>
            </>
          )}
          {JSON.parse(localStorage.getItem("current_user"))?.["username"] ===
            username && (
            <>
              <Divider />
              <MenuItem
                style={{ width: "100%", padding: "0.5rem", margin: "0" }}
                onClick={() => {
                  handleClose();
                  dispatch(
                    postDeleteData(
                      post_id,
                      "post",
                      false,
                      post_type,
                      post_media_type
                    )
                  );
                  if (window.location.pathname.includes("/notifications")) {
                    GetAllPostData("interaction");
                    GetAllPostData("reaction");
                  } else if (window.location.pathname.includes("/profile")) {
                    GetAllPostDataProfile();
                  } else {
                    dispatch(getPostData(20));
                  }
                  setPostReply(false);
                  setAddComment(false);

                  postRef.current.style.display = "none";
                }}
              >
                {allWords.misc.livert.del}
              </MenuItem>
            </>
          )}
          {JSON.parse(localStorage.getItem("current_user"))?.["username"] !==
            username && (
            <>
              <Divider />
              <MenuItem
                style={{ width: "100%", padding: "0.5rem", margin: "0" }}
                onClick={() => {
                  if (
                    !localStorage.current_user &&
                    localStorage.anonymous_user
                  ) {
                    setPostOpen(true);
                    setPostIcon(
                      <img
                        src={TownHallIconActive}
                        alt=""
                        width={40}
                        height={40}
                      />
                    );
                    setPostDec("");
                    setPostTitles(
                      "To Block a Post, Login or sign up to Khul Ke"
                    );
                    return;
                  }
                  handleClose();
                  handleBlock();
                }}
              >
                {allWords.snip.block}
              </MenuItem>
              <Divider />
              <MenuItem
                style={{ width: "100%", padding: "0.5rem", margin: "0" }}
                onClick={() => {
                  if (
                    !localStorage.current_user &&
                    localStorage.anonymous_user
                  ) {
                    setPostOpen(true);
                    setPostIcon(
                      <img
                        src={TownHallIconActive}
                        alt=""
                        width={40}
                        height={40}
                      />
                    );
                    setPostDec("");
                    setPostTitles(
                      "To Mute a Post, Login or sign up to Khul Ke"
                    );
                    return;
                  }

                  handleClose();
                  postMute();
                }}
              >
                {allWords.misc.pages.mute}
              </MenuItem>
            </>
          )}
        </div>
      </CustomMenu>
      {/* uncirculate menu */}
      <CustomMenu
        anchorEl={anchorElUncirculate}
        open={openUnCirculate}
        onClose={handleCloseUncirculate}
        onClick={handleCloseUncirculate}
      >
        <div style={{ width: 200, display: "flex", flexDirection: "column" }}>
          {circulate_user === current_user?.["username"] ||
          timeline_users?.[0] === current_user?.["username"] ||
          circulate_self === 1 ? (
            <MenuItem
              style={{ width: "100%", padding: "0.5rem", margin: "0" }}
              onClick={() => {
                dispatch(circulatePost(post_id, 0, post_type, post_media_type));
                setCirculateFlag(true);
                gtmEventCirculateOption(
                  "circulate uncirculate click",
                  "circulate uncirculate"
                );
              }}
            >
              {allWords.misc.uncirc}
            </MenuItem>
          ) : (
            <MenuItem
              style={{ width: "100%", padding: "0.5rem", margin: "0" }}
              onClick={() => {
                dispatch(circulatePost(post_id, 1, post_type, post_media_type));
                setCirculateFlag(true);
                gtmEventCirculateOption(
                  "circulate option1 click",
                  "circulate option1"
                );
              }}
            >
              {allWords.misc.livert.circ}
            </MenuItem>
          )}
          <Divider />
          <MenuItem
            style={{ width: "100%", padding: "0.5rem", margin: "0" }}
            onClick={() => {
              setAddComment(true);
              gtmEventCirculateOption(
                "circulate option2 click",
                "circulate option2"
              );
            }}
          >
            {allWords.misc.livert.quote}
          </MenuItem>
        </div>
      </CustomMenu>
      {interaction && (
        <>
          <Dialog
            title={allWords.snip.interactions}
            open={interaction}
            setOpen={setInteraction}
          >
            {interactionUserList?.map((item, index) => (
              <div
                key={item?.username}
                className="user__container"
                style={{
                  maxHeight: 80,
                  display: "flex",
                  borderRadius: 4,
                  border: "1px solid lightgray",
                  padding: "0.5rem",
                  marginTop: "0.5rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  navigate(`/profile/${item.username}/posts`);
                }}
              >
                <UserProfile username={item.username} />

                <div
                  style={{
                    marginLeft: "1rem",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>{item?.name}</span>
                  <span>{item?.username}</span>
                </div>
              </div>
            ))}
          </Dialog>
        </>
      )}
      {likedUser && (
        <>
          <Dialog
            title={allWords.snip.likes}
            open={likedUser}
            setOpen={setLikedUser}
          >
            {likedUserList?.length > 0 ? (
              <>
                <ListComponent
                  render_points={likedUserList}
                  btn_fucntion={follow_unfollow_driver}
                  type={"follow"}
                  need_badge={false}
                  div_border={true}
                  margin_flag={true}
                />
              </>
            ) : null}
          </Dialog>
        </>
      )}
      {dislikedUser && (
        <>
          <Dialog
            title={"Dislikes"}
            open={dislikedUser}
            setOpen={setDislikedUser}
            classes={{ paper: classes.dialog }}
          >
            {dislikedUserList?.length > 0 ? (
              <>
                <ListComponent
                  render_points={dislikedUserList}
                  btn_fucntion={follow_unfollow_driver}
                  type={"follow"}
                  need_badge={false}
                  div_border={true}
                  margin_flag={true}
                />
              </>
            ) : null}
          </Dialog>
        </>
      )}
      {circulatedUser && (
        <>
          <Dialog
            title={"Circulated By"}
            open={circulatedUser}
            setOpen={setCirculatedUser}
            classes={{ paper: classes.dialog }}
          >
            {circulated_username?.length > 0 ? (
              <>
                <ListComponent
                  render_points={circulated_username}
                  btn_fucntion={follow_unfollow_driver}
                  type={"follow"}
                  need_badge={false}
                  div_border={true}
                />
              </>
            ) : null}
          </Dialog>
        </>
      )}
      <PreloginComp
        modalOpen={postOpen}
        setModalOpen={setPostOpen}
        icon={postIcon}
        title={postTitles}
        description={postDec}
      />
    </>
  );
};
export default Post;