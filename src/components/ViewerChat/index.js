import React, { useState, useEffect, useRef } from "react";
import {POST_API_BASE_URL,REACT_APP_BASE_URL_FOR_USER,REACT_APP_DEVICE_TYPE,} from "../../constants/env";
import { Link } from "react-router-dom";
import { Button, Divider, Menu as CustomMenu ,MenuItem,IconButton,Grid} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChatMenuIcon from "../../assets/icons/post_menu.svg";
import Starred from "../../assets/icons/starred.svg";
import BookmarkIcon from "../IconsComponents/BookmarkIcon";
import ListItem from "./ListItem";
import CommentIcon from "../IconsComponents/CommentIcon";
import ReTweetIcon from "../IconsComponents/ReTweetIcon";
import OrangeReTweetIcon from "../IconsComponents/OrangeTweetIcon";
import LikeIcon from "../IconsComponents/LikeIcon";
import DislikeIcon from "../IconsComponents/DislikeIcon";
import LikedIConComp from "../IconsComponents/LikedComponent";
import DislikedIconComp from "../IconsComponents/DislikeComponent";
import RepliedIconComp from "../../components/IconsComponents/RepliedIconComponent";
import PostImg1 from "../../assets/images/post_img1.png";
import Dialog from "../common/Dialog";
import AudioContainer from "./AddCommentDialog/AudioContainer";
import DocsContainer from "./AddCommentDialog/DocsContainer";
import { useDispatch, useSelector } from "react-redux";
import AddComment from "./AddComment";
import { allWords } from "../../App";
import ReactPlayer from "react-player";
import {replaceURLs,auto_login_continue,filterURLs,moengageEvent,} from "../../utils/utils";
import { db } from "../../push_firebase";
import axios from "axios";
import { circulatePost } from "../../redux/actions/RTuserInteractionAction";
import { MyContentCard, ViewersDiv, Header, SubHeader, SubHeaderMain,
  UserAvatar,
  UserNameContainer,
  MenuContainer,
  Menu,
  Footer,
  Body,
  CmtTitle,
  CmtContent,
  CmtImgContainer,
  FullNameInPanel,
  PostImgContainer,
} from "./style";
import "./style.css";
import { getPostData } from "../../redux/actions/postAction";
import { postDeleteData } from "../../redux/actions/postAction";
import { moderator, speakers, uid } from "../../pages/AgoraSandbox/settings";
import QuotedCard from "./QuotedCard";
import { getRTSingleData } from "../../redux/actions/roundtableAction/single_roundtable";
import PollComponent from "../PollComponent";
import ToastHandler from "../../utils/ToastHandler";
import PreloginComp from "../PreLoginComp";
import Carousel from "react-material-ui-carousel";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { CancelOutlined, MoreVert, ShareOutlined } from "@material-ui/icons";
import CustomizedSnackbars from "../Snackbar.component";
import UserProfile from "../UserProfile";
import VIP from "../../assets/images/VIP.png";
import VIPComp from "../VipComp";
import { addLike } from "../../apis/postApi";
import logger from "../../logger";
import ConvertDateInIST from "../../pages/Notification/CentralContent/ConvertDateInIST";
import { Typography } from "@material-ui/core";
const ViewersChat = ({
  post_id,
  raw_text,
  formatted_created_at,
  favorite,
  cmt_media_type,
  cmt_parent,
  title,
  pdf,
  excel,
  ppt,
  doc,
  audio,
  audioFile,
  docsFile,
  video,
  videoFile,
  imgData,
  cmt_id,
  imgSrc,
  cmt_circulated_count,
  totalLike,
  totalDislike,
  hideIconContainer,
  totalComment,
  like_self,
  dislike_self,
  username,
  name,
  role,
  circulate_self,
  circulate_user,
  comment_self,
  post_quote_count,
  post_type,
  post_circulated_count,
  wc_uids,
  handle_wildcard_removal,
  complete_url,
  youtube_url,
  rt_id,
  before_star,
  after_star,
  star_viewer,
  rtm_channel,
  current_user,
  post_id_list,
  setPostIdList,
  mod_pan_list,
  post_media,
  star_space,
  setConsent,
  consent,
  mute_id,
  posted_at,
  docName,
  pollExpireTime,
  polling_data,
  day_duration,
  hour_duration,
  requote_post_id,
  requote_type,
  chatReply,
  setChatReply,
  setReplyingId,
  user_id,
  thumbnail,
  muteUser,
  mute_msg,
  past,
  mentioned_usernames,
  single_rt_data,
  user_type,
}) => {
  const imgRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
 const rtPrivacyType = useSelector(
    (state) => state.single_rt?.data?.data[0]?.open_to_all
  );
const rtType = useSelector((state) => state.single_rt?.data?.data[0]?.r_type);
  // const single_rt_data = useSelector((state) => state.single_rt.data);
  const liveUser = useSelector((state) => state.roundtable.liveUser);

  // ** Uncirculate menu
  const [anchorElUncirculate, setAnchorElUncirculate] = React.useState(null);
  const openUnCirculate = Boolean(anchorElUncirculate);
const handleClickUncirculate = (event) => {
    setAnchorElUncirculate(event.currentTarget);
  };
  const handleCloseUncirculate = () => {
    setAnchorElUncirculate(null);
  };

  //like dislike handling here
  const [likeCount, setLikeCount] = useState(parseInt(totalLike));
const [modalOpen, setModalOpen] = useState(false);
  const [modalIcon, setModalIcon] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalDec, setModalDec] = useState("");
   const [dislikeCount, setDislikeCount] = useState(parseInt(totalDislike));
  const [dislike, setDislike] = useState(dislike_self);
  const [like, setLike] = useState(like_self);
   const [addComment, setAddComment] = useState(false);
  const [cmtImgSrc, setCmtImgSrc] = useState("");
  const [openImage, setOpenImage] = useState(false);
  const [circulate, setCirculate] = useState(allWords.misc.livert.quote);
  const [star_msg, setStarMsg] = useState(false);
  const [clickedImageId, setClickedImageId] = useState(0);
  const [speaker_flag, setSpeakerFlag] = useState(false);
  // Reply
  const replyLoading = useSelector((state) => state.rtPost.loading);
  const replyData = useSelector((state) => state.rtPost.replyData);
const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
 // * Menu Option
  const [anchorElP, setAnchorElP] = React.useState(null);
    const [imgPreview, setImgPreview] = React.useState([]);
  const [metadata, setMetadata] = useState({
    title: null,
    image_url: null,
  });
  const [postImgSrc, setPostImgSrc] = useState("");
  let moeData = {
    RoundTableID: rt_id,
    Name: single_rt_data?.[0]?.["name"],
    "K Type": single_rt_data?.[0]?.["r_type"],
    "K SubType": single_rt_data?.[0]?.["open_to_all"],
    "Audience Interaction": 1,
  };

  const handleReply = () => {
    setChatReply(true);
    setReplyingId({
      ppt: ppt,
      excel: excel,
      doc: doc,
      pdf: pdf,
      complete_url: complete_url,
      youtube_url: youtube_url,
      post_media: post_media,
      open: chatReply,
      setOpen: setChatReply,
      setLike: setLike,
      setLikeCount: setLikeCount,
      totalComment: totalComment > 0 && totalComment,
      cmt_circulated_count: cmt_circulated_count,
      like_self: like_self,
      dislike_self: dislike_self,
      likeCount: likeCount,
      replyData: replyData,
      loading: replyLoading,
      cmt_id: JSON.parse(
        localStorage.current_user || localStorage.anonymous_user
      )["_id"], // later provide comment id,
      username: username,
      name: name,
      setChatReply: setChatReply,
      videoFile: videoFile,
      audioFile: audioFile,
      docsFile: docsFile,
      imgData: imgData,
      formatted_created_at: formatted_created_at,
      title: title,
      post_id: post_id,
      raw_text: raw_text,
    });
  };

  const handleReplyClick = () => {
    navigate(`/post/${post_id}`);
  };
  // ** Post Circulate
 const handleCirculate = (e) => {
    handleClickUncirculate(e);
  };
const modPromotedReduxState = useSelector((state) => state.modPromoted);

  //self like, dislike handle
 const handleSelfLike = async (id) => {
    addLike(id, "LIKE").then((res) => {
      const { data } = res.data;
         if (res.data.code === 200) {
        setLike(!like);
        setDislike(false);
          setLikeCount(data?.likes);
            moengageEvent("Like", "RoundTable", {
          ...moeData,
          PostID: post_id,
          post_type: post_type,
          "Media Type": cmt_media_type,
          Status: like ? 0 : 1,
        });
      }
    });
  };
 const handleSelfDislike = async (id) => {
    addLike(id, "DISLIKE").then((res) => {
      const { data } = res.data;
      if (res.data.code === 200) {
        setLike(false);
        setDislike(!dislike);
        setLikeCount(data?.likes);
       moengageEvent("DISLike", "RoundTable", {
          ...moeData,
          PostID: post_id,
          post_type: post_type,
          "Media Type": cmt_media_type,
          Status: dislike ? 0 : 1,
        });
      }
    });
  };
//remote like dislike counter updates
  useEffect(() => {
    setLikeCount(totalLike);
  }, [totalLike]);
 useEffect(() => {
    setDislikeCount(totalDislike);
  }, [totalDislike]);
 //Handle Initial Like dislike ui
  useEffect(() => {
    if (!localStorage.current_user) return;
    let current_user = JSON.parse(localStorage.getItem("current_user"))["_id"];
      db.collection("roundtable").doc(rt_id)
      .collection(`notifications/${current_user}/data`)
      .onSnapshot((snapshot) => {
        const tempData = [];
        snapshot.forEach((doc) => {
          let data = doc.data();
          tempData.push(data);
          return;
        });
        tempData.reverse();
        tempData.forEach((data) => {
          let action = data.action;
          if (action === "like" || action === "dislike") {
            let type = data.type;
            let pid = data.post_id;
            let action_type = data.action_type;
            if (type !== "SELF_ACTION" || pid !== post_id) {
              return;
            }
             if (action === "like") {
              switch (action_type) {
                case "ADD":
                  setLike(true);
                  break;
                 case "REVOKE":
                  setLike(false);
                  break;
                  default:
                  break;
              }
            } else if (action === "dislike") {
              switch (action_type) {
                case "ADD":
                  setDislike(true);
                  break;

                case "REVOKE":
                  setDislike(false);
                  break;

                default:
                  break;
              }
            }
          }
        });
      });
  }, []);

  useEffect(() => {
    let current_user = JSON.parse(
      localStorage.current_user || localStorage.anonymous_user
    )["_id"];
    if (mute_msg === user_id) {
      db.collection("roundtable")
        .doc(rt_id)
        .collection(`notifications/${user_id}/data`)
        .onSnapshot((snapshot) => {
          const tempData = [];
          snapshot.forEach((doc) => {
            let data = doc.data();
            tempData.push(data);
            return;
          });
          tempData.reverse();
          tempData.forEach((data) => {
            dispatch(
              getRTSingleData({
                rt_id,
                token:
                  localStorage.getItem("access") ||
                  JSON.parse(localStorage.anonymous_user).token,
              })
            );
          });
        });
    }
  }, []);

  const addWildCardSetData = (username, name) => {
    if (consent?.includes(username)) {
      ToastHandler("info", allWords.misc.pages.consentsent);
      return;
    }
    rtm_channel
      .sendMessage({
        text: `reqwildcard||${username}`,
      })
      .then(() => {
        moengageEvent("Add Wildcard Panelist", "RoundTable", moeData);
        setConsent((prev) => [...prev, username]);
      })
      .catch((err) => {
        logger.error("wildcard req sending error to " + username);
      });
  };
const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
useEffect(() => {
    if (post_id_list?.includes(post_id)) {
      setStarMsg(true);
    } else {
      setStarMsg(false);
    }
  }, [post_id_list]);
  const handleStarMsg = (p_id) => {
    let current_username = JSON.parse(localStorage.getItem("current_user"))[
      "username"
    ];
     var FormData = require("form-data");
    var data = new FormData();
    data.append(
      "message",
      `{"message_id":"${p_id}", "room":"${rt_id}", "sent_by":"${current_username}", "panel_type": "audience", "operation_type": "pinit" }`
    );
       var config = {
      method: "post",
      url: `${POST_API_BASE_URL}/round-table/message`,
      headers: {
        "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
        "device-type": "android",
      },
      data: data,
    };
      axios(config)
      .then(function (response) {
        if (post_id_list.includes(p_id)) {
          rtm_channel?.sendMessage({
            text: `modunstarmarkedpost||${p_id}`,
          });
          setPostIdList((prevState) => {
            return prevState.filter((item) => item !== p_id);
          });
        } else {
          rtm_channel?.sendMessage({
            text: `modstarmarkedpost||${p_id}`,
          });
          setPostIdList((prevState) => {
            return [...prevState, p_id];
          });
        }
       if (response.data.code === 200) {
          setStarMsg(!star_msg);
          // starMark
          moengageEvent("Star Message", "RoundTable", moeData);
        } else if (response.data.code === 422) {
          setStarMsg(false);
        }
      })
      .catch((e) => {});
  };
// get meta data
  const getMetaData = async (complete_url) => {
    var data = JSON.stringify({
      target_url: complete_url[0].complete_url,
    });
     var config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/${
        localStorage.anonymous_user
          ? "anonymous/get_meta_data"
          : "get_meta_data/"
      }`,
      headers: {
        Authorization: `Bearer ${
          localStorage.access || JSON.parse(localStorage.anonymous_user).token
        }`,
        "Content-Type": "application/json",
      },
      data: data,
    };
    await axios(config)
      .then(async function (response) {
        setMetadata(response.data);
      })
      .catch(async function (error) {
        const response = error.response;
        if (!response) return;
        if (response.status === 401) {
          return await auto_login_continue(() => getMetaData(complete_url));
        }
      });
  };
   useEffect(() => {
    if (complete_url) {
      getMetaData(complete_url);
    }
  }, [complete_url]);
const handleCopy = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/post/${post_id}`)
      .then(
        function () {
          /* clipboard successfully set */
          ToastHandler("sus", allWords.misc.succcopied);
        },
        function () {
          ToastHandler("dan", "Failed. try again!");
        }
      );
  };
async function addAsWildCardFunc(username, name, post_id, rt_id) {
    let FormData = require("form-data");
    let thisData = new FormData();
    thisData.append("message_id", post_id);
    thisData.append("roundtable_id", rt_id);
    thisData.append("username", username);
     let config = {
      method: "post",
      url: `${POST_API_BASE_URL}/round-table/wildcard-message`,
      headers: {
        "device-type": REACT_APP_DEVICE_TYPE,
        "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
      },
      data: thisData,
    };

    try {
      const resu = await axios(config);
      moengageEvent("Add Wildcard Message", "RoundTable", moeData);
    } catch (error) {}
  }
  useEffect(() => {
    if (single_rt_data && single_rt_data?.status === 200) {
      single_rt_data?.[0]?.speakers?.map((item) =>
        item?.username !== username
          ? setSpeakerFlag(true)
          : setSpeakerFlag(false)
      );
    }
  }, [single_rt_data]);
 const [alertOpen, setAlertOpen] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
// Share to clipboard function
  const handleShare = () => {
    moeData["PostID"] = post_id;
    (moeData["post_type"] = post_type),
      (moeData["Media Type"] = cmt_media_type);
    navigator.clipboard
      .writeText(`${window.location.origin}/post/${post_id}`)
      .then(
        function () {
          ToastHandler("sus", allWords.misc.succcopied);

          if (response.status === 200) {
            moengageEvent("Share", "RoundTable", moeData);
          }
        },
        function () {
          ToastHandler("dan", "Failed. try again!");
        }
      );
  };

  // extract origin of url of link
  function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url?.indexOf("://") > -1) {
      domain = url?.split("/")[2];
    } else {
      domain = url?.split("/")[0];
    }

    //find & remove www
    if (domain?.indexOf("www.") > -1) {
      domain = domain?.split("www.")[1];
    }

    domain = domain?.split(":")[0]; //find & remove port number
    domain = domain?.split("?")[0]; //find & remove url params

    return domain ? domain : "";
  }

  function getHashTags(inputText, symbol) {
    var hash_regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
    var at_regex = /(?:^|\s)(?:@)([a-zA-Z._-\d]+)/gm;
    var use_reg = null;
    if (symbol === "@") {
      use_reg = at_regex;
    } else {
      use_reg = hash_regex;
    }
    var matches = [];
    var match;
    while ((match = use_reg.exec(inputText))) {
      matches.push(match[1]);
    }

    return matches;
  }
  const hash_driver = (text) => {
    let text_temp = text;
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
        `<a style="color: blue" href="/profile?username=${item}"
        target="_blank"
        rel="noopener noreferrer">@${item}</a>`
      );
    });
    return text_temp;
  };

  const [viewCountTimer, setViewCountTimer] = useState();
  useEffect(() => {
    return () => {
      if (viewCountTimer) clearTimeout(viewCountTimer);
    };
  }, []);

  function increaseViewCount() {
    var data = new FormData();
    data.append("post_id", post_id);
       var config = {
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
 const handleAlertClose = () => {
    setAlertOpen(false);
  };

  // for image carousel

  let copyOfImgData = Array.isArray(imgData) ? [...imgData] : [];
 let imgDataForCarousel = copyOfImgData.splice(0, clickedImageId);
  imgDataForCarousel = [...copyOfImgData, ...imgDataForCarousel];
 return (
    <>
      {alertOpen && (
        <CustomizedSnackbars
          open={alertOpen}
          handleClose={handleAlertClose}
          redirectUrl={redirectUrl}
        />
      )}
      <div
        onClick={(e) => {
          if (
            (e.target.id !== "post_footer_container" &&
              e.target.id !== "post_header_container" &&
              e.target.id !== "viewer_post_body") ||
            rtPrivacyType !== "public"
          )
            return;

          var post_url = window.open(`/post/${post_id}`, "_blank");
          post_url.muted_user_ids = mute_id;
        }}
      >
        <MyContentCard>
          <div className="event_container">
            {circulate_user ? (
              <div
                style={{ marginTop: "0.7rem", marginBottom: "-0.1rem" }}
                className="d-flex"
              >
                {
                  <>
                    <ReTweetIcon />
                    <Link
                      to={`/profile/${circulate_user}/posts`}
                      style={{
                        fontWeight: "600",
                        marginLeft: "0.3rem",
                        textDecoration: "none",
                      }}
                      target="_blank"
                    >
                      {circulate_user === current_user?.["username"]
                        ? allWords.misc.livert.you
                        : "@" + circulate_user || "Null"}
                    </Link>{" "}
                    <span
                      style={{
                        color: "#63779C0",
                        opacity: "0.5",
                        marginLeft: "0.3rem",
                      }}
                    >
                      {allWords.misc.livert.circed}
                    </span>
                  </>
                }
              </div>
            ) : (
              ""
            )}

            {post_type === "COMMENT" &&
            cmt_parent[0]?.username &&
            !post_circulated_count ? (
              <>
                <div
                  style={{marginTop: "0.2rem",marginBottom: "-0.5rem",paddingBottom: "7px", fontSize: "0.95rem",  }}
                  className="d-flex"
                >
                  <CommentIcon />
                  <Link
                    style={{textDecoration: "none",}}
                    to={`/profile/${username}/posts`}
                    target="_blank"
                  >
                    {username === current_user?.username ? "You"  : "@" + username}
                  </Link>
                  <span
                    style={{color: "#63779C0",opacity: "0.5",marginLeft: "0.3rem", }}
                  >
                    {allWords.misc.livert.reply}
                  </span>
                  <span
                    style={{fontWeight: "600",marginLeft: "0.3rem",fontSize: "0.95rem" }}
                  >
                    <Link
                      style={{
                        textDecoration: "none",
                      }}
                      to={`/profile/${cmt_parent[0]?.username}/posts`}
                      target="_blank"
                    >
                      {cmt_parent[0]?.username === current_user?.username
                        ? "You"
                        : "@" + cmt_parent[0]?.username}
                    </Link>
                  </span>
                </div>
              </>
            ) : (
              ""
            )}

            <ViewersDiv
              id="viewers_chat_container"
              contextMenu="none"
              onContextMenu={(e) => {
                e.preventDefault();
              }}
            >
              <Header id="post_header_container">
                <SubHeaderMain>
                  <UserProfile
                    borderRadius="50%"
                    username={username}
                    onClick={() =>
                      window.open(
                        `${window.location.origin}/profile/${username}/posts`,
                        "_blank"
                      )
                    }
                  />
                  <SubHeader>
                    <div style={{ display: "flex" }}>
                      <FullNameInPanel>
                        {name || "Deleted User"}
                      </FullNameInPanel>
                      <VIPComp user_type={user_type} />
                    </div>
                    <UserNameContainer>
                      <Link
                        style={{
                          textDecoration: "none",
                        }}
                        to={`/profile/${username}/posts`}
                        target="_blank"
                        className="UsNami"
                      >
                        <p className="pcontUsername">@{username}</p>
                      </Link>

                        <Typography style={{fontSize : "0.66rem"}}>
                          &nbsp; &nbsp; {ConvertDateInIST(posted_at)}{" "}
                        </Typography>
                    </UserNameContainer>
                  </SubHeader>
                </SubHeaderMain>
                <div>
                  {favorite > 0 && (
                    <IconButton style={{ width: 50, height: 50 }}>
                      <BookmarkIcon />
                    </IconButton>
                  )}

                  {star_viewer && (
                    <>
                      {(JSON.parse(
                        localStorage.current_user || localStorage.anonymous_user
                      )["username"] === username &&
                        post_id_list.includes(post_id)) ||
                      role.includes("moderator") ||
                      role.includes("admin") ? (
                        <>
                          {!star_msg ? null : (
                            <IconButton
                              style={{ marginTop: "-0.3rem" }}
                            >
                              <img
                                src={Starred}
                                alt=""
                                width="20px"
                                height="20px"
                              />
                            </IconButton>
                          )}
                        </>
                      ) : null}
                    </>
                  )}

                  {JSON.parse(
                    localStorage.current_user || localStorage.anonymous_user
                  )["username"] === username ||
                  // role === "admin" ||
                  role === "moderator" ||
                  role === "admin-moderator" ||
                  rtPrivacyType === "public" ? (
                    <IconButton
                      id="basic-button"
                      aria-controls="basic-menu"
                      aria-haspopup="true"
                      onClick={handleClick}
                    >
                      <MoreVert fontSize="medium" style={{ color: "#000" }} />
                    </IconButton>
                  ) : null}
                </div>
              </Header>
              <Body id="viewer_post_body">
                {(() => {
                  if (raw_text?.includes("@")) {
                    let str = raw_text.split(" ");
                    let temp = "";
                    str.forEach((elem) => {
                      if (elem[0] === "@") {
                        temp =
                          temp +
                          `<a href="/profile?username=${elem.split("@")[1]}"
                          target="_blank"
                          rel="noopener noreferrer" style="color:blue; text-decoration:none">${elem}</a> `;
                      } else {
                        temp = temp + `${elem} `;
                      }
                    });

                    return (
                      <CmtTitle
                        dangerouslySetInnerHTML={{ __html: replaceURLs(temp) }}
                      />
                    );
                  } return (
                    <CmtTitle
                      dangerouslySetInnerHTML={
                        raw_text !== "undefined"
                          ? { __html: replaceURLs(raw_text) }
                          : { __html: "" }
                      }
                    />
                  );
                })()}
            {single_rt_data?.[0]?.happened_flag === true && (
                  <>
                    <PollComponent
                      type={post_type}
                      polling_data={polling_data}
                      username={username}
                      current_user={current_user}
                      pollExpireTime={pollExpireTime}
                      day_duration={day_duration}
                      hour_duration={hour_duration}
                      post_id={post_id}
                      rt_id={rt_id}
                      hash_driver={hash_driver}
                    />
                  </>
                )}

                {metadata.title && (
                  <div
                    className="meta_cont_in_post"
                    style={{ marginBottom: "20px" }}
                  >
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={filterURLs(title)?.[0]}
                    >
                      {metadata?.image_url && (
                        <Grid container>
                          <Grid item xs={12}>
                            <PostImgContainer src={metadata?.image_url} />
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
                        style={{fontSize: "0.80rem",color: "#536471",fontWeight: "bold",display: "block",
                          marginLeft: "8px",marginBottom: "8px",marginTop: "3px",
                        }}
                      >
                        {extractDomain(filterURLs(title)?.[0])}
                      </span>
                    </a>
                  </div>
                )}

                {!metadata && (
                  <CmtTitle
                    dangerouslySetInnerHTML={
                      raw_text !== "undefined"
                        ? { __html: replaceURLs(raw_text) }
                        : { __html: "" }
                    }
                  />
                )}
                 {youtube_url && (
                  <>
                    <ReactPlayer
                      className="react-player"
                      width="100%"
                      height="300px"
                      controls={true}
                      url={youtube_url[0].complete_url}
                      style={{ marginBottom: "18px" }}
                    />
                    {star_space && (
                      <p
                        style={{
                          marginBottom: "0px",
                          marginTop: "-25px",
                          visibility: "hidden",
                          userSelect: "none",
                        }}
                      >
                        aa
                      </p>
                    )}
                  </>
                )}
                   {audio ? (
                  <>
                    <AudioContainer
                      audioFilePath={`${POST_API_BASE_URL}/post-media/media/${audioFile}`}
                      viewCountTimer={viewCountTimer}
                      increaseViewCount={increaseViewCount}
                      setViewCountTimer={setViewCountTimer}
                    />
                  </>
                ) : (
                  <></>
                )}
                {/* pdf */}
                {pdf && (
                  <>
                    <DocsContainer
                      thumbnail={thumbnail}
                      docsFilePath={`${POST_API_BASE_URL}/post-media/media/${docsFile}`}
                      docsFile={docName || docsFile}
                    />
                  </>
                )}

                {ppt && (
                  <>
                    <DocsContainer
                      thumbnail={thumbnail}
                      docsFilePath={`${POST_API_BASE_URL}/post-media/media/${docsFile}`}
                      pptDoc={docName || docsFile}
                    />
                  </>
                )}
                {excel && (
                  <>
                    <DocsContainer
                      thumbnail={thumbnail}
                      docsFilePath={`${POST_API_BASE_URL}/post-media/media/${docsFile}`}
                      excelDoc={docName || docsFile}
                    />
                  </>
                )}
                {doc && (
                  <>
                    <DocsContainer
                      thumbnail={thumbnail}
                      docsFilePath={`${POST_API_BASE_URL}/post-media/media/${docsFile}`}
                      wordDoc={docName || docsFile}
                    />
                  </>
                )}
                {video ? (
                  <video
                    width="100%"
                    controls
                    src={`${POST_API_BASE_URL}/post-media/media/${videoFile}`}
                    style={{ borderRadius: "0.5rem", maxHeight: 350 }}
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
                  />
                ) : (
                  <CmtContent>
                    {imgSrc ? (
                      <>
                        <CmtImgContainer src={PostImg1} />
                      </>
                    ) : (
                      <>
                        <Grid container spacing={2}>
                          {imgData?.map((item, index) => (
                            <>
                              {imgData?.length === 1 && (
                                <Grid
                                  item
                                  xs={12}
                                  key={index}
                                  style={{ paddingTop: "8px" }}
                                >
                                  <CmtImgContainer
                                    src={`${POST_API_BASE_URL}/post-media/image/${item?.name}`}
                                    onClick={() => {
                                      setCmtImgSrc(
                                        `${POST_API_BASE_URL}/post-media/image/${item?.name}`
                                      );
                                      setOpenImage(true);
                                    }}
                                  />
                                </Grid>
                              )}
                              {imgData?.length === 2 && (
                                <Grid item xs={6} style={{ paddingTop: "8px" }}>
                                  <CmtImgContainer
                                    src={`${POST_API_BASE_URL}/post-media/image/${item?.name}`}
                                    onClick={() => {
                                      setCmtImgSrc(
                                        `${POST_API_BASE_URL}/post-media/image/${item?.name}`
                                      );
                                      setOpenImage(true);
                                      setClickedImageId(index);
                                    }}
                                  />
                                </Grid>
                              )}
                              {imgData?.length === 3 && (
                                <Grid item xs={6} style={{ paddingTop: "8px" }}>
                                  <CmtImgContainer
                                    src={`${POST_API_BASE_URL}/post-media/image/${item?.name}`}
                                    onClick={() => {
                                      setCmtImgSrc(
                                        `${POST_API_BASE_URL}/post-media/image/${item?.name}`
                                      );
                                      setOpenImage(true);
                                      setClickedImageId(index);
                                    }}
                                  />
                                </Grid>
                              )}
                              {imgData?.length === 4 && (
                                <Grid item xs={6} style={{ paddingTop: "8px" }}>
                                  <CmtImgContainer
                                    src={`${POST_API_BASE_URL}/post-media/image/${item?.name}`}
                                    onClick={() => {
                                      setCmtImgSrc(
                                        `${POST_API_BASE_URL}/post-media/image/${item?.name}`
                                      );
                                      setOpenImage(true);
                                      setClickedImageId(index);
                                    }}
                                  />
                                </Grid>
                              )}
                            </>
                          ))}
                        </Grid>
                      </>
                    )}
                  </CmtContent>
                )}
                 {requote_type === "POLL_ROUNDTABLE" && (
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
                 <QuotedCard
                  ppt={ppt}
                  excel={excel}
                  doc={doc}
                  pdf={pdf}
                  docsFile={docsFile}
                  cmt_id={cmt_id}
                  cmt_media_type={cmt_media_type}
                  cmt_parent={cmt_parent}
                  cmt_type={post_type}
                  formatted_created_at={formatted_created_at}
                  polling_data={polling_data}
                />
              </Body>

              {hideIconContainer ? (
                ""
              ) : (
                <Footer>
                  <div
                    className="d-flex justify-content-between"
                    id="post_footer_container"
                  >
                    <div className="d-flex">
                      <ListItem
                        num={totalComment || "0"}
                        Icon={comment_self ? RepliedIconComp : CommentIcon}
                        onClick={(e) => {
                          if (
                            !localStorage.current_user &&
                            localStorage.anonymous_user
                          ) {
                            setModalOpen(true);
                            setModalDec("");
                            setModalIcon(<RepliedIconComp />);
                            setModalTitle(allWords.misc.pages.prelogin.mtext);
                            return;
                          }
                          handleReply(e);
                        }}
                        disabled={
                          mute_id?.includes(current_user?.username)
                            ? true
                            : false
                        }
                      />
                      <ListItem
                        num={
                          post_circulated_count + parseInt(post_quote_count) ||
                          "0"
                        }
                        Icon={
                          circulate_user === current_user?.["username"] ||
                          circulate_self === 1
                            ? OrangeReTweetIcon
                            : ReTweetIcon
                        }
                        onClick={(e) => {
                          if (
                            !localStorage.current_user &&
                            localStorage.anonymous_user
                          ) {
                            setModalOpen(true);
                            setModalDec("");
                            setModalIcon(<OrangeReTweetIcon />);
                            setModalTitle(allWords.misc.pages.prelogin.mtext);
                            return;
                          }

                          handleCirculate(e);
                        }}
                        iconColor={
                          circulate_user === current_user?.["username"] ||
                          circulate_self === 1
                            ? true
                            : false
                        }
                        disabled={
                          mute_id?.includes(current_user?.username)
                            ? true
                            : false
                        }
                      />
                      {/* like */}
                      <ListItem
                        num={likeCount || "0"}
                        Icon={like ? LikedIConComp : LikeIcon}
                        onClick={(e) => {
                          if (
                            !localStorage.current_user &&
                            localStorage.anonymous_user
                          ) {
                            setModalOpen(true);
                            setModalDec("");
                            setModalIcon(<LikedIConComp />);
                            setModalTitle(allWords.misc.pages.prelogin.mtext);
                            return;
                          }

                          if (username === uid) return;
                          handleSelfLike(post_id);
                        }}
                        disabled={
                          username === uid ||
                          mute_id?.includes(current_user?.username)
                            ? true
                            : false
                        }
                      />
                      {/* dislikes */}
                      <ListItem
                        num={username === uid && (dislikeCount || "0")}
                        Icon={dislike ? DislikedIconComp : DislikeIcon}
                        onClick={(e) => {
                          if (
                            !localStorage.current_user &&
                            localStorage.anonymous_user
                          ) {
                            setModalOpen(true);
                            setModalDec("");
                            setModalIcon(<DislikedIconComp />);
                            setModalTitle(allWords.misc.pages.prelogin.mtext);
                            return;
                          }

                          if (username === uid) return;
                          handleSelfDislike(post_id);
                        }}
                        disabled={
                          username === uid ||
                          mute_id?.includes(current_user?.username)
                            ? true
                            : false
                        }
                      />
                    </div>
                    <div>
                      <ListItem
                        notSmall={true}
                        Icon={ShareOutlined}
                        onClick={handleShare}
                        iconName="Share"
                      />
                    </div>
                  </div>
                  <div></div>
                </Footer>
              )}
            </ViewersDiv>

            {/* openImage */}
            {openImage && (
              <Dialog
                hiddenHeader
                title={""}
                open={openImage}
                setOpen={setOpenImage}
                style={{ padding: 0 }}
              >
                <div
                  style={{
                    // width: 700,
                    position: "absolute",
                    zIndex: 99999,
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                    top: "3px",
                    left: "15px",
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                  }}
                >
                  <IconButton
                    onClick={() => {
                      setOpenImage(false);
                    }}
                  >
                    <CancelOutlined color="black" />
                  </IconButton>
                </div>
                <Carousel
                  className="carousel-audience-interaction"
                  autoPlay={true}
                  interval={10000}
                  // animation={"slide"}
                  indicators={false}
                  navButtonsAlwaysVisible={true}
                  swipe={true}
                  NavButton={({ onClick, className, style, next, prev }) => {
                    return (
                      <Button
                        onClick={onClick}
                        className={className}
                        style={{
                          ...style,
                          backgroundColor: "#494949",opacity: ".7", width: "30px", height: "30px", minWidth: "0px", top: "50%",transform: "translateY(-50%)",borderRadius: "50%",
                        }}
                        sx={{
                          "&.MuiButton-root:hover": {
                            backgroundColor: "#494949 !important",opacity: "1 !important",
                          },
                        }}
                        ref={(el) => {
                          if (el) {
                            if (prev) {
                              el.style.setProperty(
                                "left",
                                "0.6rem",
                                "important"
                              );
                            }
                            if (next) {
                              el.style.setProperty("right", "0px", "important");
                            }
                          }
                        }}
                        variant={"contained"}
                      >
                        {next && <NavigateNextIcon />}
                        {prev && <NavigateBeforeIcon />}
                      </Button>
                    );
                  }}
                >
                  {imgDataForCarousel?.map((item, index) => (
                    <div key={index}>
                      <img
                        key={index}
                        src={`${POST_API_BASE_URL}/post-media/image/${item?.name}`}
                        alt="images"
                        style={{width: "100%",height: "auto",borderRadius: 8,maxHeight: "400px",objectFit: "contain", }}
                      />{" "}
                      {/* &nbsp; */}
                    </div>
                  ))}
                </Carousel>
                
              </Dialog>
            )}
            {addComment && (
              <Dialog
                title={circulate}
                open={addComment}
                setOpen={setAddComment}
              >
                <AddComment
                  circulate_user={circulate_user}
                  totalComment={totalComment > 0 && totalComment}
                  cmt_circulated_count={
                    cmt_circulated_count > 0 && cmt_circulated_count
                  }
                  like_self={like_self}
                  dislike_self={dislike_self}
                  likeCount={likeCount}
                  post_id={post_id}
                  name={name}
                  username={username}
                  setAddComment={setAddComment}
                  audio
                  audioFile={audioFile}
                  setCirculate={setCirculate}
                  formatted_created_at={formatted_created_at}
                  ppt={ppt}
                  excel={excel}
                  doc={doc}
                  pdf={pdf}
                  post_media={post_media}
                  docsFile={docsFile}
                  video
                  videoFile={videoFile}
                  title={title}
                  imgData={imgData}
                  circulate_self={circulate_self}
                  post_quote_count={post_quote_count}
                  type={post_type}
                  polling_data={polling_data}
                />
              </Dialog>
            )}
            <CustomMenu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                justifyContent: "left",
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
                    right: 0,
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
                  width:
                    JSON.parse(localStorage.getItem("current_user"))
                      ?.display_language === "hi"
                      ? 240
                      : 210,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {rtPrivacyType === "public" && (
                  <>
                    <MenuItem
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        margin: "0",
                      }}
                      onClick={() => {
                        handleCopy();
                      }}
                    >
                      {allWords.misc.livert.copy}
                    </MenuItem>
                  </>
                )}

                {/* Wildcard Panelist */}
                {rtType !== "RECORDING_BASED" && (
                  <>
                    {single_rt_data?.[0]?.owner?.username !== username && (
                      <>
                        {((role === "host" && username === uid) ||
                          role === "moderator" ||
                          role === "admin" ||
                          role === "admin-moderator") &&
                          username !== moderator.username &&
                          username !== speakers?.[0]?.username &&
                          username !== speakers?.[1]?.username &&
                          username !== speakers?.[2]?.username &&
                          username !== speakers?.[3]?.username &&
                          username !== speakers?.[4]?.username &&
                          username !== speakers?.[5]?.username && (
                            <>
                              {rtPrivacyType === "public" && <Divider />}
                              {wc_uids.includes(username) ? (
                                <MenuItem
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    margin: "0",
                                  }}
                                  onClick={() => {
                                    handle_wildcard_removal(username);
                                  }}
                                >
                                  {allWords.misc.pages.removewild}
                                </MenuItem>
                              ) : (
                                <>
                                  <MenuItem
                                    style={{
                                      width: "100%",
                                      padding: "0.5rem",
                                      margin: "0",
                                    }}
                                    onClick={() => {
                                      if (!liveUser.includes(username)) {
                                        ToastHandler(
                                          "info",
                                          allWords.misc.pages.cantaddw
                                        );
                                        return;
                                      }

                                      const panel = mod_pan_list.filter(
                                        (item) => {
                                          return (
                                            item.username !== moderator.username
                                          );
                                        }
                                      );

                                      const wildcards = [];

                                      wc_uids.map((elem) => {
                                        if (wildcards.includes(elem)) return 0;
                                        wildcards.push(elem);
                                        return 1;
                                      });

                                      if (panel.length + wildcards.length > 4) {
                                        return ToastHandler(
                                          "info",
                                          allWords.misc.pages.fivespeaker
                                        );
                                      }
                                      addWildCardSetData(username, name);
                                    }}
                                  >
                                    {allWords.misc.text_wilduser}
                                  </MenuItem>
                                </>
                              )}
                            </>
                          )}
                      </>
                    )}
                  </>
                )}

                {/* Wildcard Message */}
                {(role === "moderator" ||
                  role === "admin-moderator" ||
                  role === "admin") && (
                  <>
                    {modPromotedReduxState.includes(post_id) == false && (
                      <>
                        {single_rt_data?.[0]?.owner?.username !== username &&
                          rtPrivacyType !== "public" && <Divider />}
                        {rtPrivacyType === "public" && <Divider />}
                        <MenuItem
                          style={{
                            width: "100%",
                            padding: "0.5rem",
                            margin: "0",
                            textAlign: "start",
                          }}
                          onClick={(e) => {
                            addAsWildCardFunc(username, name, post_id, rt_id);
                          }}
                        >
                          {allWords.misc.addwm}
                        </MenuItem>
                      </>
                    )}
                  </>
                )}

                {single_rt_data?.[0]?.owner?.username !== username ? (
                  <>
                    {(role === "admin" ||role === "moderator" ||role === "admin-moderator" ||role === "admin-panellist") &&
                    username !== moderator.username && username !== speakers?.[0]?.username &&
                    username !== speakers?.[1]?.username && username !== speakers?.[2]?.username &&
                    username !== speakers?.[3]?.username && username !== speakers?.[4]?.username &&
                     username !== speakers?.[5]?.username ? (
                      <>
                        <Divider />
                        <MenuItem
                          style={{width: "100%",padding: "0.5rem",margin: "0",}}
                          onClick={() => {
                            muteUser("mute", user_id, username);
                          }}
                        >
                          {allWords.misc.pages.mute} @{username}
                        </MenuItem>
                      </>
                    ) : null}
                  </>
                ) : null}

                {before_star && (
                  <>
                    {/* Star Message */}
                    {(role === "moderator" || role === "admin-moderator" || role === "admin") &&
                    username !== moderator.username ? (
                      <>
                        <Divider />
                        {!star_msg ? (
                          <MenuItem
                            style={{
                              width: "100%",
                              padding: "0.5rem",
                              margin: "0",
                              textAlign: "start",
                            }}
                            onClick={() => {
                              handleStarMsg(post_id);
                            }}
                          >
                            {allWords.misc.star}
                          </MenuItem>
                        ) : (
                          <MenuItem
                            style={{
                              width: "100%",
                              padding: "0.5rem",
                              margin: "0",
                            }}
                            onClick={() => {
                              handleStarMsg(post_id);
                            }}
                          >
                            {allWords.misc.unstar}
                          </MenuItem>
                        )}
                      </>
                    ) : null}
                {/* <Divider /> */}
                  </>
                )}
                 {after_star && (
                  <>
                    {(role === "moderator" ||
                      role === "admin-moderator" ||
                      role === "admin") && (
                      <>
                        <Divider />
                        <MenuItem
                          style={{
                            width: "100%",
                            padding: "0.5rem",
                            margin: "0",
                          }}
                          onClick={() => {
                            handleStarMsg(post_id);
                          }}
                        >
                          {allWords.misc.unstar}
                        </MenuItem>
                      </>
                    )}
                  </>    
                )}
             {JSON.parse(
                  localStorage.current_user || localStorage.anonymous_user
                )["username"] === username && (
                  <>
                    {single_rt_data?.[0]?.open_to_all !== "private" && (
                      <Divider />
                    )}
                    {role == "admin-moderator" &&
                      single_rt_data[0]?.open_to_all == "private" && (
                        <Divider />
                      )}
                    <MenuItem
                      style={{  width: "100%",  padding: "0.5rem",  margin: "0",
                      }}
                      onClick={() => {
                        handleClose();
                        dispatch(
                          postDeleteData(
                            post_id,
                            "post",
                            true,
                            post_type,
                            cmt_media_type
                          )
                        );
                        dispatch(getPostData(20));

                        setAddComment(false);
                      }}
                    >
                      {allWords.misc.livert.del}
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
              <div className="circ-quote-menu-div">
                {circulate_user === current_user?.["username"] ||
                circulate_self === 1 ? (
                  <MenuItem
                    className="circ-quote-menu-item"
                    onClick={() => {
                      if (
                        !localStorage.current_user &&
                        localStorage.anonymous_user
                      ) {
                        setModalOpen(true);
                        setModalDec("");
                        setModalIcon(<OrangeReTweetIcon />);
                        setModalTitle(
                          "To Uncirculate, Login or sign up to Khul Ke"
                        );
                        return;
                      }
                      dispatch(circulatePost(post_id, username, user_id));
                      dispatch(getPostData(20));
                    }}
                  >
                    {allWords.misc.uncirc}
                  </MenuItem>
                ) : (
                  <MenuItem
                    className="circ-quote-menu-item"
                    onClick={() => {
                      if (
                        !localStorage.current_user &&
                        localStorage.anonymous_user
                      ) {
                        setModalOpen(true);
                        setModalDec("");
                        setModalIcon(<OrangeReTweetIcon />);
                        setModalTitle(
                          "To Circulate, Login or sign up to Khul Ke"
                        );
                        return;
                      }
                      dispatch(circulatePost(post_id, username, user_id));
                      dispatch(getPostData(20));
                    }}
                  >
                    {allWords.misc.livert.circ}
                  </MenuItem>
                )}
                <Divider className="menu-divider" />
                 <MenuItem
                  className="circ-quote-menu-item"
                  onClick={() => {
                    if (
                      !localStorage.current_user &&
                      localStorage.anonymous_user
                    ) {
                      setModalOpen(true);
                      setModalDec("");
                      setModalIcon(<OrangeReTweetIcon />);
                      setModalTitle("To Quote, Login or sign up to Khul Ke");
                      return;
                    }
                   setAddComment(true);
                  }}
                >
                  {allWords.misc.livert.quote}
                </MenuItem>
              </div>
            </CustomMenu>
          </div>
        </MyContentCard>
      </div>
      <PreloginComp
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        icon={modalIcon}
        title={modalTitle}
        description={modalDec}
      />
    </>
  );
};
export default ViewersChat;
