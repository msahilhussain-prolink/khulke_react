import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactPlaceholder from "react-placeholder";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

// Material UI
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import styled from "styled-components";

// Components
import Post from "../Post";
import PostCardPlaceHolder from "../PostCardPlaceholder";
import Spinner from "../Spinner";

// CONSTANTS
import {
  POST_API_BASE_URL,
  REACT_APP_BASE_URL_CLOUDFRONT,
  REACT_APP_BASE_URL_FOR_USER,
  REACT_APP_DEVICE_TYPE,
} from "../../constants/env";

// Styles
import "react-placeholder/lib/reactPlaceholder.css";
import "./style.css";
// API
import { getPost } from "../../apis/postApi";

// Utils
import ToastHandler from "../../utils/ToastHandler";

// Lang
import { allWords } from "../../App";
import { globalImages } from "../../assets/imagesPath/images";
import logger from "../../logger";
import ErrorDiv from "../ResponseData/ErrorDiv";
import ConvertDateInIST from "../../pages/Notification/CentralContent/ConvertDateInIST";
import MineRT from "../RTListing/MineRT";
import { getMineRTListData } from "../../redux/actions/rtListingAction/mineRtAction";
import { userProfileData } from "../../redux/actions/profileAction/userProfileAction";

const MyContentCard = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  padding: 0.2rem;
  overflow: hidden;

  .tab_container {
    padding: 1rem;
  }
  .firstTab {
    border-bottom: 1px solid #ed4d29;
  }
  .secondTab {
    border-bottom: 1px solid lightgray;
  }
  .thirdTab {
    border-bottom: 1px solid lightgray;
  }

  .css-1aquho2-MuiTabs-indicator {
    background-color: #ed4d29 !important;
  }
  .css-1h9z7r5-MuiButtonBase-root-MuiTab-root.Mui-selected {
    color: black;
    font-weight: bold;
  }
  .css-1h9z7r5-MuiButtonBase-root-MuiTab-root {
    color: #aebdd3;
    font-weight: bold;
  }
  .event_container {
    width: 100%;
    height: 92%;
    /* overflow-y: scroll; */
    overflow-x: hidden;
    overflow-y: auto;
    ::-webkit-scrollbar {
      width: 0.2em;
    }

    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px #f0f4f8;
    }

    ::-webkit-scrollbar-thumb {
      /* background-color: darkgrey; */
      outline: 1px solid #aebdd3;
    }
  }
  @media screen and (max-width: 1700px) {
    padding: 0;
    z-index: 0;
  }
`;

const FirstTabContainer = styled.div``;
const SecondTabContainer = styled.div``;
const ThirdTabContainer = styled.div``;

const ProfileCenter = ({
  blockUser = false,
  user_id,
  selectedTab,
  setBlock,
}) => {
  // URL Params
  const url_search_params = new URL(window.location.href);
  let username =
    url_search_params.pathname.split("/")[2] ||
    JSON.parse(localStorage.current_user || localStorage.anonymous_user)[
      "username"
    ];

  let url_path = url_search_params.pathname.split("/")[3];
  let pathname = window.location.pathname;

  const navigate = useNavigate();
  const selfState = useLocation();
  const dispatch = useDispatch();
  const [allPostData, setAllPostData] = useState([]);
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState({ val: false, message: "" });
  const [rt_limit, setRTLimit] = useState(12);
  const [skip, setSkip] = useState(0);
  const [rtLoading, setRTLoading] = useState(null);
  const [rtError, setRTError] = useState(null);
  const [callingApi, setCallingApi] = useState(false);
  const updatedPostData = useSelector((state) => state.post.posts);
  const [has_error, setHasError] = useState(false);
  const [error_message, setErrorMessage] = useState("");
  const [isMuted, setIsMuted] = useState(false); // video mute-unmute

  const limit = 20;
  const current_user = localStorage.current_user
  ? JSON.parse(localStorage.current_user)
  : null;

  useEffect(() => {
    dispatch(userProfileData({ username: current_user?.username }));
  },[])
 
  useEffect(() => {
    if(username) {
    if (user_id &&
      JSON.parse(localStorage.getItem("current_user"))?.["username"] !==
      username
    ) {
      dispatch(getMineRTListData({user_id, skip, limit}));
    } else {
      dispatch(getMineRTListData());
    }
  }
  },[username, user_id])
  useEffect(() => {
    if (
      username !==
      JSON.parse(localStorage.current_user || localStorage.anonymous_user)[
        "username"
      ]
    ) {
      if (url_path === "saved_posts")
        return navigate(`/profile/${username}/posts`, { replace: true });
    }
  }, [username]);

  const [bookmarkData, setBookMarkData] = useState([]);

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 50;

    if (bottom) {
      if (selectedTab === 0 || selectedTab === 2) {
        setSkip(allPostData.length);
      }
      if (selectedTab === 1) {
        setRTLimit(rt_limit + 10);
      }
    }
  };

  const GetAllPostData = async (initial) => {
    if (callingApi) return;

    setPostError({ val: false, message: "" });

    setCallingApi(true);
    let response;

    try {
      response = await getPost(limit, skip, username, pathname);
      setPostLoading(false);
      setCallingApi(false);
    } catch (e) {
      setPostLoading(false);
      setCallingApi(false);

      return ToastHandler("dan", allWords.misc.pages.facingDiffi);
    }

    const data = response.data.data.old_post;

    if (data[0]?.message) {
      return setPostError({ val: true, message: data[0].message });
    }

    if (initial) {
      setAllPostData(data);
      return;
    }

    setAllPostData((prev) => [...prev, ...data]);
  };

  useEffect(() => {
    if (callingApi) return;

    GetAllPostData();
  }, [skip]);

  useEffect(() => {
    if (
      allPostData.length === 0 ||
      !updatedPostData ||
      !updatedPostData?.data ||
      !updatedPostData?.data?.old_post ||
      updatedPostData?.data?.old_post?.length === 0
    )
      return;
    const getNewlyaddedPost = async () => {
      const data = updatedPostData.data.old_post;
      setAllPostData(data);
    };

    getNewlyaddedPost();
  }, [updatedPostData]);

  const getBookmark = () => {
    const FormData = require("form-data");
    const data = new FormData();
    data.append("path", "bookmark");

    const config = {
      method: "post",
      url: `${POST_API_BASE_URL}/post-paginate`,
      headers: {
        "device-type": REACT_APP_DEVICE_TYPE,
        "user-id": JSON.parse(localStorage.getItem("current_user"))?.["_id"],
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        setBookMarkData(response.data);
      })
      .catch();
  };

  useState(() => {
    paginateRT();
  }, [rt_limit, skip]);

  function paginateRT() {
    let access = null;
    const anonymous_user = JSON.parse(localStorage.getItem("anonymous_user"));
    access = localStorage.access || anonymous_user?.["token"];

    if (
      JSON.parse(localStorage.getItem("current_user"))?.["username"] !==
      username
    ) {
      dispatch(getMineRTListData({user_id, skip, limit}));
    } else {
      dispatch(getMineRTListData());
    }
  }

  useEffect(() => {
    getBookmark();
  }, [limit]);

  useEffect(() => {
    paginateRT();
  }, [selectedTab]);

  useEffect(() => {
    setAllPostData([]);
    GetAllPostData(true);
  }, [selfState]);

  const [snips, setSnips] = useState([]);
  const [snipLoader, setSnipLoader] = useState();
  async function fetchSnips() {
    setSnipLoader(true);
    const rrr = await GettingUser();

    const config = {
      url: `${POST_API_BASE_URL}/get-snippets`,
      method: "post",
      headers: {
        "device-type": REACT_APP_DEVICE_TYPE,
        "user-id": rrr,
      },
      data: {
        limit: 10,
        skip: 0,
        pageNum: 1,
        path: "profile",
      },
    };
    try {
      const resulti = await axios(config);
      setSnipLoader(false);
      if (resulti.data.data.length > 0) {
        setSnips(resulti.data.data);
      }
    } catch {
      setSnipLoader(false);
    }
  }

  const GettingUser = async (params) => {
    const anonymous_user = JSON.parse(localStorage.getItem("anonymous_user"));
    const url_search_params = new URL(window.location.href);
    let username =
      url_search_params.pathname.split("/")[2] ||
      JSON.parse(localStorage.current_user || localStorage.anonymous_user)[
        "username"
      ];
    const data = JSON.stringify({
      username: username,
    });
    const config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}${
        anonymous_user ? "/anonymous/user_profile/" : "/profile/"
      }`,
      headers: {
        Authorization: `Bearer ${
          anonymous_user ? anonymous_user?.["token"] : localStorage.access
        }`,
        "Content-Type": "application/json",
      },
      data: data,
    };
    try {
      const data = await axios(config);
      const requiredId = await data.data.data["user_other"]?.["_id"];
      return requiredId;
    } catch (error) {
      logger.info(error);
    }
  };

  useEffect(() => {
    if (selectedTab === 2) {
      fetchSnips();
    }
  }, [selectedTab]);

  return (
    <>
      {blockUser === false && (
        <MyContentCard>
          <div elevation={0} className="stickySticker" style={{ zIndex: 0 }}>
            <Tabs
              value={selectedTab}
              aria-label="simple tabs example"
              className="stickySticker"
            >
              <Tab
                label={allWords.profile.tabopt1}
                onClick={() => {
                  navigate(`/profile/${username}/posts`);
                }}
                className="user_profile"
                style={{
                  width:
                    username ===
                    JSON.parse(
                      localStorage.current_user || localStorage.anonymous_user
                    )["username"]
                      ? "25%"
                      : "33%",
                  textTransform: "capitalize",
                  borderBottom: "1px solid lightgray",
                  color: selectedTab === 0 ? "black" : "#AEBDD3",
                  fontWeight: "bold",
                }}
              />

              <Tab
                onClick={() => {
                  navigate(`/profile/${username}/roundtables`);
                }}
                label={allWords.profile.tabopt2}
                style={{
                  width:
                    username ===
                    JSON.parse(
                      localStorage.current_user || localStorage.anonymous_user
                    )["username"]
                      ? "25%"
                      : "33%",
                  textTransform: "capitalize",
                  borderBottom: "1px solid lightgray",
                  color: selectedTab === 1 ? "black" : "#AEBDD3",
                  fontWeight: "bold",
                }}
              />

              <Tab
                onClick={() => {
                  navigate(`/profile/${username}/snip-it`);
                }}
                label={allWords.profile.tabopt3}
                style={{
                  width:
                    username ===
                    JSON.parse(
                      localStorage.current_user || localStorage.anonymous_user
                    )["username"]
                      ? "25%"
                      : "33%",
                  textTransform: "capitalize",
                  borderBottom: "1px solid lightgray",
                  color: selectedTab === 2 ? "black" : "#AEBDD3",
                  fontWeight: "bold",
                }}
              />

              {username ===
                JSON.parse(
                  localStorage.current_user || localStorage.anonymous_user
                )["username"] && (
                <Tab
                  onClick={() => {
                    navigate(`/profile/${username}/saved_posts`);
                  }}
                  label={allWords.profile.tabopt4}
                  style={{
                    width: "25%",
                    textTransform: "capitalize",
                    borderBottom: "1px solid lightgray",
                    color: selectedTab === 3 ? "black" : "#AEBDD3",
                    fontWeight: "bold",
                  }}
                />
              )}
            </Tabs>
          </div>
          <div className="event_container" onScroll={handleScroll}>
            {selectedTab === 0 && (
              <FirstTabContainer>
                <div>
                  <ReactPlaceholder
                    customPlaceholder={<PostCardPlaceHolder />}
                    type="media"
                    rows={7}
                    showLoadingAnimation
                    ready={allPostData?.length > 0 || postError.val}
                  >
                    {allPostData?.length ? (
                      allPostData?.map((item) => (
                        <>
                          {item?.name !== undefined && (
                            <>
                              {item?.media_type === "VIDEO" && (
                                <>
                                  <Post
                                    setBlock={setBlock}
                                    complete_url={item?.urls?.other}
                                    GetAllPostDataProfile={GetAllPostData}
                                    setAllPostData={setAllPostData}
                                    mentioned_usernames={
                                      item?.mentioned_usernames
                                    }
                                    youtube_url={item?.urls?.youtube}
                                    videoCaption={item?.media[0]?.caption}
                                    circulate_self={item?.circulate_self}
                                    circulate_user={item?.circ_username}
                                    user_id={item?.user_id}
                                    favorite={item?.favorite_self}
                                    like_self={item?.like_self}
                                    comment_self={item?.comment_self}
                                    dislike_self={item?.dislike_self}
                                    post_circulated_count={
                                      item?.circulate_count
                                    }
                                    post_quote_count={item?.post_quote}
                                    post_id={item?.post_id}
                                    post_type={item?.type}
                                    video
                                    key={item?.post_id}
                                    videoFile={item?.media[0]?.name}
                                    post_media_type={item?.media_type}
                                    title={item?.raw_text}
                                    username={item?.username}
                                    name={item?.name}
                                    totalLike={item?.like}
                                    totalDislike={item?.dislike}
                                    totalComment={item?.comment}
                                    post_parent={item?.parent}
                                    formatted_created_at={ConvertDateInIST(
                                      item?.created_at
                                    )}
                                    round_table_data={item?.round_table_data}
                                    isMuted={isMuted}
                                    setIsMuted={setIsMuted}
                                    user_type={item?.user_type}
                                    src={`${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${
                                      item?.user_id
                                    }/post/${item?._id}/${
                                      item?.is_converted === 1
                                        ? item?.media[0]?.extra
                                            ?.convertedFilename ??
                                          item?.media[0]?.metadata
                                            ?.convertedFilename
                                        : item?.media[0]?.extra?.filename
                                    }`}
                                  />
                                </>
                              )}
                              {item?.media_type === "AUDIO" && (
                                <>
                                  <Post
                                    setBlock={setBlock}
                                    comment_self={item?.comment_self}
                                    complete_url={item?.urls?.other}
                                    GetAllPostDataProfile={GetAllPostData}
                                    setAllPostData={setAllPostData}
                                    mentioned_usernames={
                                      item?.mentioned_usernames
                                    }
                                    youtube_url={item?.urls?.youtube}
                                    audioCaption={item?.media[0]?.caption}
                                    circulate_self={item?.circulate_self}
                                    circulate_user={item?.circ_username}
                                    user_id={item?.user_id}
                                    favorite={item?.favorite_self}
                                    like_self={item?.like_self}
                                    dislike_self={item?.dislike_self}
                                    post_media_type={item?.media_type}
                                    audio
                                    post_quote_count={item?.post_quote}
                                    post_circulated_count={
                                      item?.circulate_count
                                    }
                                    post_id={item?.post_id}
                                    post_type={item?.type}
                                    key={item?.post_id}
                                    audioFile={item?.media[0]?.name}
                                    title={item?.raw_text}
                                    username={item?.username}
                                    name={item?.name}
                                    totalLike={item?.like}
                                    totalDislike={item?.dislike}
                                    totalComment={item?.comment}
                                    post_parent={item?.parent}
                                    formatted_created_at={ConvertDateInIST(
                                      item?.created_at
                                    )}
                                    round_table_data={item?.round_table_data}
                                    user_type={item?.user_type}
                                  />
                                </>
                              )}
                              {item?.media_type === "PDF" && (
                                <>
                                  <Post
                                    setBlock={setBlock}
                                    comment_self={item?.comment_self}
                                    complete_url={item?.urls?.other}
                                    GetAllPostDataProfile={GetAllPostData}
                                    setAllPostData={setAllPostData}
                                    mentioned_usernames={
                                      item?.mentioned_usernames
                                    }
                                    youtube_url={item?.urls?.youtube}
                                    post_quote_count={item?.post_quote}
                                    circulate_self={item?.circulate_self}
                                    circulate_user={item?.circ_username}
                                    user_id={item?.user_id}
                                    favorite={item?.favorite_self}
                                    like_self={item?.like_self}
                                    dislike_self={item?.dislike_self}
                                    post_media_type={item?.media_type}
                                    post_type={item?.type}
                                    post_media={item?.media}
                                    pdf
                                    post_circulated_count={
                                      item?.circulate_count
                                    }
                                    post_id={item?.post_id}
                                    key={item?.post_id}
                                    docsFile={
                                      item?.media[0]?.extra?.orignalFilename
                                    }
                                    title={item?.raw_text}
                                    username={item?.username}
                                    name={item?.name}
                                    totalLike={item?.like}
                                    totalDislike={item?.dislike}
                                    totalComment={item?.comment}
                                    post_parent={item?.parent}
                                    formatted_created_at={ConvertDateInIST(
                                      item?.created_at
                                    )}
                                    round_table_data={item?.round_table_data}
                                    user_type={item?.user_type}
                                  />
                                </>
                              )}
                              {item?.media_type === "XLS" && (
                                <>
                                  <Post
                                    setBlock={setBlock}
                                    complete_url={item?.urls?.other}
                                    GetAllPostDataProfile={GetAllPostData}
                                    setAllPostData={setAllPostData}
                                    mentioned_usernames={
                                      item?.mentioned_usernames
                                    }
                                    youtube_url={item?.urls?.youtube}
                                    post_quote_count={item?.post_quote}
                                    circulate_self={item?.circulate_self}
                                    circulate_user={item?.circ_username}
                                    user_id={item?.user_id}
                                    favorite={item?.favorite_self}
                                    like_self={item?.like_self}
                                    dislike_self={item?.dislike_self}
                                    post_media_type={item?.media_type}
                                    post_type={item?.type}
                                    post_media={item?.media}
                                    excel
                                    post_circulated_count={
                                      item?.circulate_count
                                    }
                                    post_id={item?.post_id}
                                    key={item?.post_id}
                                    docsFile={
                                      item?.media[0]?.extra?.orignalFilename
                                    }
                                    title={item?.raw_text}
                                    username={item?.username}
                                    name={item?.name}
                                    totalLike={item?.like}
                                    totalDislike={item?.dislike}
                                    totalComment={item?.comment}
                                    post_parent={item?.parent}
                                    formatted_created_at={ConvertDateInIST(
                                      item?.created_at
                                    )}
                                    round_table_data={item?.round_table_data}
                                    user_type={item?.user_type}
                                  />
                                </>
                              )}
                              {item?.media_type === "DOC" && (
                                <>
                                  <Post
                                    setBlock={setBlock}
                                    complete_url={item?.urls?.other}
                                    GetAllPostDataProfile={GetAllPostData}
                                    setAllPostData={setAllPostData}
                                    mentioned_usernames={
                                      item?.mentioned_usernames
                                    }
                                    youtube_url={item?.urls?.youtube}
                                    post_quote_count={item?.post_quote}
                                    circulate_self={item?.circulate_self}
                                    circulate_user={item?.circ_username}
                                    user_id={item?.user_id}
                                    favorite={item?.favorite_self}
                                    like_self={item?.like_self}
                                    dislike_self={item?.dislike_self}
                                    post_media_type={item?.media_type}
                                    post_type={item?.type}
                                    post_media={item?.media}
                                    doc
                                    post_circulated_count={
                                      item?.circulate_count
                                    }
                                    post_id={item?.post_id}
                                    key={item?.post_id}
                                    docsFile={
                                      item?.media[0]?.extra?.orignalFilename
                                    }
                                    title={item?.raw_text}
                                    username={item?.username}
                                    name={item?.name}
                                    totalLike={item?.like}
                                    totalDislike={item?.dislike}
                                    totalComment={item?.comment}
                                    post_parent={item?.parent}
                                    formatted_created_at={ConvertDateInIST(
                                      item?.created_at
                                    )}
                                    round_table_data={item?.round_table_data}
                                    user_type={item?.user_type}
                                  />
                                </>
                              )}
                              {item?.media_type === "PPTX" && (
                                <>
                                  <Post
                                    setBlock={setBlock}
                                    complete_url={item?.urls?.other}
                                    GetAllPostDataProfile={GetAllPostData}
                                    setAllPostData={setAllPostData}
                                    mentioned_usernames={
                                      item?.mentioned_usernames
                                    }
                                    youtube_url={item?.urls?.youtube}
                                    post_quote_count={item?.post_quote}
                                    circulate_self={item?.circulate_self}
                                    circulate_user={item?.circ_username}
                                    user_id={item?.user_id}
                                    favorite={item?.favorite_self}
                                    like_self={item?.like_self}
                                    dislike_self={item?.dislike_self}
                                    post_media_type={item?.media_type}
                                    post_type={item?.type}
                                    post_media={item?.media}
                                    ppt
                                    post_circulated_count={
                                      item?.circulate_count
                                    }
                                    post_id={item?.post_id}
                                    key={item?.post_id}
                                    docsFile={
                                      item?.media[0]?.extra?.orignalFilename
                                    }
                                    title={item?.raw_text}
                                    username={item?.username}
                                    name={item?.name}
                                    totalLike={item?.like}
                                    totalDislike={item?.dislike}
                                    totalComment={item?.comment}
                                    post_parent={item?.parent}
                                    formatted_created_at={ConvertDateInIST(
                                      item?.created_at
                                    )}
                                    round_table_data={item?.round_table_data}
                                    user_type={item?.user_type}
                                  />
                                </>
                              )}
                              {item?.media_type === "IMAGE" && (
                                <>
                                  <Post
                                    setBlock={setBlock}
                                    comment_self={item?.comment_self}
                                    complete_url={item?.urls?.other}
                                    GetAllPostDataProfile={GetAllPostData}
                                    setAllPostData={setAllPostData}
                                    mentioned_usernames={
                                      item?.mentioned_usernames
                                    }
                                    youtube_url={item?.urls?.youtube}
                                    post_quote_count={item?.post_quote}
                                    circulate_self={item?.circulate_self}
                                    circulate_user={item?.circ_username}
                                    user_id={item?.user_id}
                                    favorite={item?.favorite_self}
                                    like_self={item?.like_self}
                                    dislike_self={item?.dislike_self}
                                    post_circulated_count={
                                      item?.circulate_count
                                    }
                                    post_media_type={item?.media_type}
                                    post_type={item?.type}
                                    post_id={item?.post_id}
                                    key={item?.post_id}
                                    imgData={item?.media}
                                    imgSrc={item?.imgSrc}
                                    title={item?.raw_text}
                                    totalComment={item?.comment}
                                    totalDislike={item?.dislike}
                                    totalLike={item?.like}
                                    username={item?.username}
                                    name={item?.name}
                                    formatted_created_at={ConvertDateInIST(
                                      item?.created_at
                                    )}
                                    post_parent={item?.parent}
                                    round_table_data={item?.round_table_data}
                                    user_type={item?.user_type}
                                  />
                                </>
                              )}
                              {item?.media_type === "" && (
                                <>
                                  <Post
                                    setBlock={setBlock}
                                    comment_self={item?.comment_self}
                                    complete_url={item?.urls?.other}
                                    GetAllPostDataProfile={GetAllPostData}
                                    setAllPostData={setAllPostData}
                                    mentioned_usernames={
                                      item?.mentioned_usernames
                                    }
                                    youtube_url={item?.urls?.youtube}
                                    post_quote_count={item?.post_quote}
                                    circulate_self={item?.circulate_self}
                                    circulate_user={item?.circ_username}
                                    user_id={item?.user_id}
                                    favorite={item?.favorite_self}
                                    like_self={item?.like_self}
                                    dislike_self={item?.dislike_self}
                                    post_circulated_count={
                                      item?.circulate_count
                                    }
                                    post_media_type={item?.media_type}
                                    post_type={item?.type}
                                    post_id={item?.post_id}
                                    key={item?.post_id}
                                    imgSrc={item?.imgSrc}
                                    title={item?.raw_text}
                                    username={item?.username}
                                    name={item?.name}
                                    totalLike={item?.like}
                                    totalDislike={item?.dislike}
                                    totalComment={item?.comment}
                                    post_parent={item?.parent}
                                    formatted_created_at={ConvertDateInIST(
                                      item?.created_at
                                    )}
                                    round_table_data={item?.round_table_data}
                                    type={item?.type}
                                    polling_data={item?.polling_data}
                                    pollExpireTime={
                                      new Date(item?.polling_data?.end_date)
                                    }
                                    user_type={item?.user_type}
                                  />
                                </>
                              )}
                            </>
                          )}
                        </>
                      ))
                    ) : (
                      <div className="noPostFallback">
                        {/* <img src={no_post_profile} alt="" /> */}
                        <lottie-player
                          src={globalImages.si_pr_post}
                          background="transparent"
                          speed="1"
                          style={{
                            width: "300px",
                          }}
                          loop
                          autoplay
                        />
                        <p>{allWords.profile.noPost}</p>
                      </div>
                    )}
                    {(postLoading || callingApi) && <Spinner />}

                    {!postLoading && !callingApi && (
                      <ErrorDiv error_message={""} />
                    )}
                  </ReactPlaceholder>
                </div>
              </FirstTabContainer>
            )}
            {selectedTab === 1 && (
              <SecondTabContainer>
                {rtLoading === true ? (
                  <Spinner />
                ) : (
                  <>
                    {has_error && (
                      <ErrorDiv error_message={error_message} />
                    )} 
                      <div id="rtProfile" className="profile_div">
                          <MineRT
                            isProfile={true}
                            width={
                              document.getElementById("rtProfile")?.clientWidth
                            }
                          />
                      </div>

                  </>
                )}
              </SecondTabContainer>
            )}
            {selectedTab === 2 && (
              <>
                <div>
                  <>
                    {snipLoader === true ? (
                      <Spinner />
                    ) : snips.length === 0 ? (
                      <div
                        className="d-flex justify-content-center"
                        style={{
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <lottie-player
                          src={globalImages.si_pr_snip}
                          background="transparent"
                          speed="1"
                          style={{
                            width: "300px",
                          }}
                          loop
                          autoplay
                        />
                        <p className="noSnippLine">
                          {allWords.profile.noSnips}
                        </p>
                      </div>
                    ) : (
                      snips.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "space-around",
                          }}
                        >
                          {snips.map((el) => {
                            return (
                              <div
                                key={el._id}
                                className="snipsDiv"
                                style={{
                                  height: "350px",
                                  width: "31%",
                                  borderRadius: "8px",
                                  overflow: "hidden",
                                  margin: "10px 0",
                                  border: "1px solid #eee",
                                }}
                                onClick={() => {
                                  navigate("/snip-it", {
                                    state: { postId: el._id },
                                  });
                                }}
                              >
                                <>
                                  <img
                                    src={`${POST_API_BASE_URL}/post-media/frame/${el.media[0]?.name}`}
                                    alt=""
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                  <div className="viewcountdivkk">{`${el.views} views`}</div>
                                </>
                              </div>
                            );
                          })}
                        </div>
                      )
                    )}
                  </>
                </div>
              </>
            )}
            {selectedTab === 3 &&
              username ===
                JSON.parse(
                  localStorage.current_user || localStorage.anonymous_user
                )["username"] && (
                <ThirdTabContainer>
                  <div onScroll={handleScroll}>
                    <ReactPlaceholder
                      customPlaceholder={<PostCardPlaceHolder />}
                      type="media"
                      rows={7}
                      showLoadingAnimation
                      ready={bookmarkData?.data?.old_post?.length > 0}
                    >
                      {bookmarkData?.data?.old_post[0].type == "BLANK_TAB" && (
                        <div className="noSaved">
                          {/* <img
                            alt="no saved post"
                            className="nosaveIcon"
                            src={no_save_profile}
                          /> */}

                          <lottie-player
                            src={globalImages.si_pr_save}
                            background="transparent"
                            speed="1"
                            style={{
                              width: "150px",
                            }}
                            loop
                            autoplay
                          />

                          <p>{allWords.profile.noSave}</p>
                        </div>
                      )}
                      {bookmarkData?.data?.old_post
                        ?.filter((val) => {
                          if (val?.username) {
                            return val;
                          }
                        })
                        .map((item) => (
                          <>
                            {item?.media_type === "VIDEO" && (
                              <>
                                <Post
                                  setBlock={setBlock}
                                  GetAllPostDataProfile={GetAllPostData}
                                  setAllPostData={setAllPostData}
                                  complete_url={item?.urls?.other}
                                  mentioned_usernames={
                                    item?.mentioned_usernames
                                  }
                                  youtube_url={item?.urls?.youtube}
                                  videoCaption={item?.media[0]?.caption}
                                  circulate_self={item?.circulate_self}
                                  circulate_user={item?.circ_username}
                                  user_id={item?.user_id}
                                  favorite={item?.favorite_self}
                                  like_self={item?.like_self}
                                  comment_self={item?.comment_self}
                                  dislike_self={item?.dislike_self}
                                  post_circulated_count={item?.circulate_count}
                                  post_quote_count={item?.post_quote}
                                  post_id={item?.post_id}
                                  post_type={item?.type}
                                  video
                                  key={item?.post_id}
                                  videoFile={item?.media[0]?.name}
                                  post_media_type={item?.media_type}
                                  title={item?.raw_text}
                                  username={item?.username}
                                  name={item?.name}
                                  totalLike={item?.like}
                                  totalDislike={item?.dislike}
                                  totalComment={item?.comment}
                                  post_parent={item?.parent}
                                  formatted_created_at={ConvertDateInIST(
                                    item?.created_at
                                  )}
                                  round_table_data={item?.round_table_data}
                                  getBookmark={getBookmark}
                                  profile={true}
                                  isMuted={isMuted}
                                  setIsMuted={setIsMuted}
                                  src={`${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${item?.user_id}/post/${item?._id}/${item?.media[0]?.extra?.filename}`}
                                />
                              </>
                            )}
                            {item?.media_type === "AUDIO" && (
                              <>
                                <Post
                                  setBlock={setBlock}
                                  GetAllPostDataProfile={GetAllPostData}
                                  setAllPostData={setAllPostData}
                                  comment_self={item?.comment_self}
                                  complete_url={item?.urls?.other}
                                  mentioned_usernames={
                                    item?.mentioned_usernames
                                  }
                                  youtube_url={item?.urls?.youtube}
                                  audioCaption={item?.media[0]?.caption}
                                  circulate_self={item?.circulate_self}
                                  circulate_user={item?.circ_username}
                                  user_id={item?.user_id}
                                  favorite={item?.favorite_self}
                                  like_self={item?.like_self}
                                  dislike_self={item?.dislike_self}
                                  post_media_type={item?.media_type}
                                  audio
                                  post_quote_count={item?.post_quote}
                                  post_circulated_count={item?.circulate_count}
                                  post_id={item?.post_id}
                                  post_type={item?.type}
                                  key={item?.post_id}
                                  audioFile={item?.media[0]?.name}
                                  title={item?.raw_text}
                                  username={item?.username}
                                  name={item?.name}
                                  totalLike={item?.like}
                                  totalDislike={item?.dislike}
                                  totalComment={item?.comment}
                                  post_parent={item?.parent}
                                  formatted_created_at={ConvertDateInIST(
                                    item?.created_at
                                  )}
                                  round_table_data={item?.round_table_data}
                                  getBookmark={getBookmark}
                                  profile={true}
                                />
                              </>
                            )}
                            {item?.media_type === "PDF" && (
                              <>
                                <Post
                                  setBlock={setBlock}
                                  GetAllPostDataProfile={GetAllPostData}
                                  setAllPostData={setAllPostData}
                                  comment_self={item?.comment_self}
                                  complete_url={item?.urls?.other}
                                  mentioned_usernames={
                                    item?.mentioned_usernames
                                  }
                                  youtube_url={item?.urls?.youtube}
                                  post_quote_count={item?.post_quote}
                                  circulate_self={item?.circulate_self}
                                  circulate_user={item?.circ_username}
                                  user_id={item?.user_id}
                                  favorite={item?.favorite_self}
                                  like_self={item?.like_self}
                                  dislike_self={item?.dislike_self}
                                  post_media_type={item?.media_type}
                                  post_type={item?.type}
                                  pdf
                                  post_circulated_count={item?.circulate_count}
                                  post_id={item?.post_id}
                                  key={item?.post_id}
                                  docsFile={item?.media[0]?.name}
                                  title={item?.raw_text}
                                  username={item?.username}
                                  name={item?.name}
                                  totalLike={item?.like}
                                  totalDislike={item?.dislike}
                                  totalComment={item?.comment}
                                  post_parent={item?.parent}
                                  formatted_created_at={ConvertDateInIST(
                                    item?.created_at
                                  )}
                                  round_table_data={item?.round_table_data}
                                  getBookmark={getBookmark}
                                  profile={true}
                                />
                              </>
                            )}
                            {item?.media_type === "XLS" && (
                              <>
                                <Post
                                  setBlock={setBlock}
                                  GetAllPostDataProfile={GetAllPostData}
                                  setAllPostData={setAllPostData}
                                  complete_url={item?.urls?.other}
                                  mentioned_usernames={
                                    item?.mentioned_usernames
                                  }
                                  youtube_url={item?.urls?.youtube}
                                  post_quote_count={item?.post_quote}
                                  circulate_self={item?.circulate_self}
                                  circulate_user={item?.circ_username}
                                  user_id={item?.user_id}
                                  favorite={item?.favorite_self}
                                  like_self={item?.like_self}
                                  dislike_self={item?.dislike_self}
                                  post_media_type={item?.media_type}
                                  post_type={item?.type}
                                  pdf
                                  post_circulated_count={item?.circulate_count}
                                  post_id={item?.post_id}
                                  key={item?.post_id}
                                  docsFile={item?.media[0]?.name}
                                  title={item?.raw_text}
                                  username={item?.username}
                                  name={item?.name}
                                  totalLike={item?.like}
                                  totalDislike={item?.dislike}
                                  totalComment={item?.comment}
                                  post_parent={item?.parent}
                                  formatted_created_at={ConvertDateInIST(
                                    item?.created_at
                                  )}
                                  round_table_data={item?.round_table_data}
                                  getBookmark={getBookmark}
                                  profile={true}
                                />
                              </>
                            )}
                            {item?.media_type === "DOC" && (
                              <>
                                <Post
                                  setBlock={setBlock}
                                  GetAllPostDataProfile={GetAllPostData}
                                  setAllPostData={setAllPostData}
                                  complete_url={item?.urls?.other}
                                  mentioned_usernames={
                                    item?.mentioned_usernames
                                  }
                                  youtube_url={item?.urls?.youtube}
                                  post_quote_count={item?.post_quote}
                                  circulate_self={item?.circulate_self}
                                  circulate_user={item?.circ_username}
                                  user_id={item?.user_id}
                                  favorite={item?.favorite_self}
                                  like_self={item?.like_self}
                                  dislike_self={item?.dislike_self}
                                  post_media_type={item?.media_type}
                                  post_type={item?.type}
                                  pdf
                                  post_circulated_count={item?.circulate_count}
                                  post_id={item?.post_id}
                                  key={item?.post_id}
                                  docsFile={item?.media[0]?.name}
                                  title={item?.raw_text}
                                  username={item?.username}
                                  name={item?.name}
                                  totalLike={item?.like}
                                  totalDislike={item?.dislike}
                                  totalComment={item?.comment}
                                  post_parent={item?.parent}
                                  formatted_created_at={ConvertDateInIST(
                                    item?.created_at
                                  )}
                                  round_table_data={item?.round_table_data}
                                  getBookmark={getBookmark}
                                  profile={true}
                                />
                              </>
                            )}
                            {item?.media_type === "PPTX" && (
                              <>
                                <Post
                                  setBlock={setBlock}
                                  GetAllPostDataProfile={GetAllPostData}
                                  setAllPostData={setAllPostData}
                                  complete_url={item?.urls?.other}
                                  mentioned_usernames={
                                    item?.mentioned_usernames
                                  }
                                  youtube_url={item?.urls?.youtube}
                                  post_quote_count={item?.post_quote}
                                  circulate_self={item?.circulate_self}
                                  circulate_user={item?.circ_username}
                                  user_id={item?.user_id}
                                  favorite={item?.favorite_self}
                                  like_self={item?.like_self}
                                  dislike_self={item?.dislike_self}
                                  post_media_type={item?.media_type}
                                  post_type={item?.type}
                                  pdf
                                  post_circulated_count={item?.circulate_count}
                                  post_id={item?.post_id}
                                  key={item?.post_id}
                                  docsFile={item?.media[0]?.name}
                                  title={item?.raw_text}
                                  username={item?.username}
                                  name={item?.name}
                                  totalLike={item?.like}
                                  totalDislike={item?.dislike}
                                  totalComment={item?.comment}
                                  post_parent={item?.parent}
                                  formatted_created_at={ConvertDateInIST(
                                    item?.created_at
                                  )}
                                  round_table_data={item?.round_table_data}
                                  getBookmark={getBookmark}
                                  profile={true}
                                />
                              </>
                            )}
                            {item?.media_type === "IMAGE" && (
                              <>
                                <Post
                                  setBlock={setBlock}
                                  GetAllPostDataProfile={GetAllPostData}
                                  setAllPostData={setAllPostData}
                                  comment_self={item?.comment_self}
                                  complete_url={item?.urls?.other}
                                  mentioned_usernames={
                                    item?.mentioned_usernames
                                  }
                                  youtube_url={item?.urls?.youtube}
                                  post_quote_count={item?.post_quote}
                                  circulate_self={item?.circulate_self}
                                  circulate_user={item?.circ_username}
                                  user_id={item?.user_id}
                                  favorite={item?.favorite_self}
                                  like_self={item?.like_self}
                                  dislike_self={item?.dislike_self}
                                  post_circulated_count={item?.circulate_count}
                                  post_media_type={item?.media_type}
                                  post_type={item?.type}
                                  post_id={item?.post_id}
                                  key={item?.post_id}
                                  imgData={item?.media}
                                  imgSrc={item?.imgSrc}
                                  title={item?.raw_text}
                                  totalComment={item?.comment}
                                  totalDislike={item?.dislike}
                                  totalLike={item?.like}
                                  username={item?.username}
                                  name={item?.name}
                                  formatted_created_at={ConvertDateInIST(
                                    item?.created_at
                                  )}
                                  post_parent={item?.parent}
                                  round_table_data={item?.round_table_data}
                                  getBookmark={getBookmark}
                                  profile={true}
                                />
                              </>
                            )}
                            {item?.media_type === "" && (
                              <>
                                <Post
                                  setBlock={setBlock}
                                  GetAllPostDataProfile={GetAllPostData}
                                  setAllPostData={setAllPostData}
                                  comment_self={item?.comment_self}
                                  complete_url={item?.urls?.other}
                                  mentioned_usernames={
                                    item?.mentioned_usernames
                                  }
                                  youtube_url={item?.urls?.youtube}
                                  post_quote_count={item?.post_quote}
                                  circulate_self={item?.circulate_self}
                                  circulate_user={item?.circ_username}
                                  user_id={item?.user_id}
                                  favorite={item?.favorite_self}
                                  like_self={item?.like_self}
                                  dislike_self={item?.dislike_self}
                                  post_circulated_count={item?.circulate_count}
                                  post_media_type={item?.media_type}
                                  post_type={item?.type}
                                  post_id={item?.post_id}
                                  key={item?.post_id}
                                  imgSrc={item?.imgSrc}
                                  title={item?.raw_text}
                                  username={item?.username}
                                  name={item?.name}
                                  totalLike={item?.like}
                                  totalDislike={item?.dislike}
                                  totalComment={item?.comment}
                                  post_parent={item?.parent}
                                  formatted_created_at={ConvertDateInIST(
                                    item?.created_at
                                  )}
                                  round_table_data={item?.round_table_data}
                                  getBookmark={getBookmark}
                                  profile={true}
                                />
                              </>
                            )}
                          </>
                        ))}
                      {postLoading && <Spinner />}
                    </ReactPlaceholder>
                  </div>
                </ThirdTabContainer>
              )}
          </div>
        </MyContentCard>
      )}
    </>
  );
};

export default ProfileCenter;
