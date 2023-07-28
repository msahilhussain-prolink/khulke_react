import React, { useEffect, useState, useRef } from "react";
import {
  IS_ANDROID_OR_IOS,
  POST_API_BASE_URL,
  REACT_APP_BASE_URL_CLOUDFRONT,
  REACT_APP_DEVICE_TYPE,
} from "../../constants/env";
import {
  MainDiv,
  CenterDiv,
  RightDiv,
  Title,
} from "../../global_styles/global_style";
// import LeftSideBar from "../../components/LeftSideBar";
import RightSideBar from "../../components/RightSideBar";
import Post from "../../components/Post";
import axios from "axios";
import { useParams, useNavigate, redirect } from "react-router-dom";
import ReactPlaceholder from "react-placeholder";
import PostCardPlaceHolder from "../../components/PostCardPlaceholder";
import { IconButton } from "@mui/material";
import BackBtn from "../../components/IconsComponents/BackBtn";
import { useSelector } from "react-redux";
import "./style.css";
import { allWords } from "../../App";

import Header from "../../components/Header";
import { MetaTagsGenerator } from "../../utils/MetaTagsGenerator";
import { moengageEvent } from "../../utils/utils";
import CustomizedSnackbars from "../../components/Snackbar.component";
import ConvertDateInIST from "../Notification/CentralContent/ConvertDateInIST";

const SinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // state
  const [postData, setPostData] = useState([]);
  const post = useSelector((state) => state.post);
  const [showAllRepliesPost, setShowALlRepliesPost] = useState([]);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [open, setOpen] = useState(false);

  // ref
  const refForScroll = useRef(null);

  // local variable
  var showAllRepliesGlobal = false;

  // API Call
  const getSinglePost = async (customId) => {
    let data = new FormData();
    data.append("type", "COMMENT");

    var config = {
      method: "post",
      url: `${POST_API_BASE_URL}/post/${customId || id}`,
      headers: {
        "device-type": REACT_APP_DEVICE_TYPE,
        "user-id":
          JSON.parse(localStorage.getItem("current_user"))?.["_id"] ||
          JSON.parse(localStorage.getItem("anonymous_user"))?.["_id"],
      },
      data: data,
    };

    try {
      const response = await axios(config);
      if (response.code === 200)
        return moengageEvent("View", "Post", {
          PostID: response?.data?.[0]?.["post_id"],
          "K Type": response?.data?.[0]?.["post_type"],
          "Media type": response?.data?.[0]?.["media_type"],
        });
      await setPostData(response.data.data);
      handleScroll();
    } catch (e) {}
  };

  useEffect(() => {
    getSinglePost();
  }, [post]);

  function handleScroll() {
    setTimeout(() => {
      refForScroll?.current?.scrollIntoView({ alignToTop: true });
    }, 1500);
  }

  useEffect(() => {
    if (
      IS_ANDROID_OR_IOS &&
      redirectUrl === "" &&
      window.location.pathname.includes("/post")
    ) {
      setRedirectUrl(
        !window.location.origin.includes("dev") &&
          !window.location.origin.includes("stage")
          ? `https://www.khulke.com/post/${id}`
          : `${window.location.origin}/post/${id}`
      );
      setOpen(true);
    }
  }, []);

  const lastPost = postData.length - 1;

  var mute_id = window?.muted_user_ids;

  return (
    <>
      {open && (
        <CustomizedSnackbars
          open={open}
          handleClose={() => {
            setOpen(false);
          }}
          redirectUrl={redirectUrl}
        />
      )}
      <MetaTagsGenerator
        metaTags={{
          title: `${postData[0]?.username} on Khul ke`,
          description: postData[0]?.text,
        }}
      />
      <Header />
      <MainDiv>
        <CenterDiv
          style={{
            maxWidth: "768px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={() => {
                navigate("/home");
              }}
            >
              <BackBtn />
            </IconButton>
            <Title>{allWords.misc.pages.thread}</Title>
          </div>
          <ReactPlaceholder
            customPlaceholder={<PostCardPlaceHolder />}
            type="media"
            rows={7}
            showLoadingAnimation
            ready={postData?.length > 0}
          >
            <div style={{ minHeight: "300vh" }}>
              {postData
                // ?.filter((val) => {
                //   if (id === val?.post_id) {
                //     return val;
                //   }
                // })
                .map((item, index) => {

                  item.formatted_created_at = ConvertDateInIST(item?.created_at)

                  let show_below_line =
                    postData[index + 1]?.["parent"]?.[0]?.["_id"] === item._id
                      ? false
                      : true;

                  let showAllReplies =
                    postData[index + 1]?.["parent"]?.[0]?.["_id"] ===
                      item._id &&
                    postData[index - 1]?.["parent"]?.[0]?.["_id"] === id &&
                    item["parent"]?.[0]?.["_id"] === postData[index - 1]._id
                      ? true
                      : false;

                  const temp = [];

                  if (showAllReplies) {
                    for (let i = index; i < postData.length; i++) {
                      let show_below =
                        postData[i + 1]?.["parent"]?.[0]?.["_id"] ===
                        postData[i]._id
                          ? false
                          : true;

                      if (show_below) break;
                      temp.push(postData[i]._id);
                    }
                  }

                  if (show_below_line && showAllRepliesGlobal) {
                    showAllRepliesGlobal = false;
                    return;
                  }

                  if (showAllRepliesGlobal) return;

                  if (
                    showAllReplies &&
                    !showAllRepliesPost.includes(item._id)
                  ) {
                    showAllRepliesGlobal = true;
                  }

                  return (
                    <>
                      {item?.media_type === "VIDEO" && (
                        <>
                          {item?.media_type === "VIDEO" && (
                            <Post
                              lastPost={
                                item._id === postData[lastPost]["_id"]
                                  ? true
                                  : false
                              }
                              show_below_line={
                                postData[index + 1]?.["parent"]?.[0]?.[
                                  "_id"
                                ] === item._id
                                  ? false
                                  : true ||
                                    (showAllReplies &&
                                      !showAllRepliesPost.includes(item._id))
                              }
                              showAllReplies={
                                postData[index + 1]?.["parent"]?.[0]?.[
                                  "_id"
                                ] === item._id &&
                                postData[index - 1]?.["parent"]?.[0]?.[
                                  "_id"
                                ] === id &&
                                item["parent"]?.[0]?.["_id"] ===
                                  postData[index - 1]._id &&
                                !showAllRepliesPost.includes(item._id)
                                  ? true
                                  : false
                              }
                              created_at={item?.created_at}
                              showIndexes={temp}
                              mentioned_usernames={item?.mentioned_usernames}
                              setShowALlRepliesPost={setShowALlRepliesPost}
                              sendingRef={refForScroll}
                              main_post={item._id === id ? true : false}
                              post_quote_count={item?.post_quote}
                              likedUserArray={item?.action?.LIKE}
                              commentUserArray={item?.action}
                              dislikeUserArray={item?.action?.DISLIKE}
                              singlePost
                              circulate_self={item?.circulate_self}
                              circulate_user={item?.circ_username}
                              muted={item?.muted}
                              user_id={item?.user_id}
                              favorite={item?.favorite}
                              like_self={item?.like_self}
                              dislike_self={item?.dislike_self}
                              post_circulated_count={item?.circulate_count}
                              post_obj={item}
                              post_id={item?.post_id}
                              post_type={item?.type}
                              repost={item?.action?.REPOST}
                              video
                              key={index}
                              videoFile={item?.media[0]?.name}
                              post_media_type={item?.media_type}
                              title={item?.raw_text}
                              username={item?.username}
                              name={item?.name}
                              post_action={item?.action}
                              totalLike={item?.like}
                              totalDislike={item?.dislike}
                              totalComment={item?.comment}
                              post_parent={item?.parent}
                              formatted_created_at={item?.formatted_created_at}
                              mute_id={mute_id}
                              user_type={item.user_type}
                              lang={item?.lang}
                              src={`${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${
                                item?.user_id
                              }/post/${item?._id}/${item?.media[0]?.extra?.filename}`}
                            />
                          )}
                          {item?.media_type === "AUDIO" && (
                            <>
                              <Post
                                lastPost={
                                  item._id === postData[lastPost]["_id"]
                                    ? true
                                    : false
                                }
                                show_below_line={
                                  postData[index + 1]?.["parent"]?.[0]?.[
                                    "_id"
                                  ] === item._id
                                    ? false
                                    : true ||
                                      (showAllReplies &&
                                        !showAllRepliesPost.includes(item._id))
                                }
                                showAllReplies={
                                  postData[index + 1]?.["parent"]?.[0]?.[
                                    "_id"
                                  ] === item._id &&
                                  postData[index - 1]?.["parent"]?.[0]?.[
                                    "_id"
                                  ] === id &&
                                  item["parent"]?.[0]?.["_id"] ===
                                    postData[index - 1]._id &&
                                  !showAllRepliesPost.includes(item._id)
                                    ? true
                                    : false
                                }
                                created_at={item?.created_at}
                                showIndexes={temp}
                                mentioned_usernames={item?.mentioned_usernames}
                                setShowALlRepliesPost={setShowALlRepliesPost}
                                sendingRef={refForScroll}
                                main_post={item._id === id ? true : false}
                                post_quote_count={item?.post_quote}
                                likedUserArray={item?.action?.LIKE}
                                commentUserArray={item?.action}
                                dislikeUserArray={item?.action?.DISLIKE}
                                singlePost
                                circulate_self={item?.circulate_self}
                                circulate_user={item?.circ_username}
                                muted={item?.muted}
                                user_id={item?.user_id}
                                favorite={item?.favorite}
                                like_self={item?.like_self}
                                dislike_self={item?.dislike_self}
                                post_obj={item}
                                post_media_type={item?.media_type}
                                repost={item?.action?.REPOST}
                                audio
                                post_circulated_count={item?.circulate_count}
                                post_id={item?.post_id}
                                post_type={item?.type}
                                key={index}
                                audioFile={item?.media[0]?.name}
                                title={item?.raw_text}
                                username={item?.username}
                                name={item?.name}
                                post_action={item?.action}
                                totalLike={item?.like}
                                totalDislike={item?.dislike}
                                totalComment={item?.comment}
                                post_parent={item?.parent}
                                formatted_created_at={
                                  item?.formatted_created_at
                                }
                                user_type={item.user_type}
                                lang={item?.lang}
                              />
                            </>
                          )}
                          {item?.media_type === "PDF" && (
                            <>
                              <Post
                                lastPost={
                                  item._id === postData[lastPost]["_id"]
                                    ? true
                                    : false
                                }
                                show_below_line={
                                  postData[index + 1]?.["parent"]?.[0]?.[
                                    "_id"
                                  ] === item._id
                                    ? false
                                    : true ||
                                      (showAllReplies &&
                                        !showAllRepliesPost.includes(item._id))
                                }
                                showAllReplies={
                                  postData[index + 1]?.["parent"]?.[0]?.[
                                    "_id"
                                  ] === item._id &&
                                  postData[index - 1]?.["parent"]?.[0]?.[
                                    "_id"
                                  ] === id &&
                                  item["parent"]?.[0]?.["_id"] ===
                                    postData[index - 1]._id &&
                                  !showAllRepliesPost.includes(item._id)
                                    ? true
                                    : false
                                }
                                showIndexes={temp}
                                mentioned_usernames={item?.mentioned_usernames}
                                created_at={item?.created_at}
                                setShowALlRepliesPost={setShowALlRepliesPost}
                                sendingRef={refForScroll}
                                main_post={item._id === id ? true : false}
                                post_quote_count={item?.post_quote}
                                likedUserArray={item?.action?.LIKE}
                                commentUserArray={item?.action}
                                dislikeUserArray={item?.action?.DISLIKE}
                                singlePost
                                circulate_self={item?.circulate_self}
                                circulate_user={item?.circ_username}
                                muted={item?.muted}
                                user_id={item?.user_id}
                                favorite={item?.favorite}
                                like_self={item?.like_self}
                                dislike_self={item?.dislike_self}
                                post_obj={item}
                                post_media_type={item?.media_type}
                                repost={item?.action?.REPOST}
                                post_type={item?.type}
                                post_media={item?.media}
                                pdf
                                post_circulated_count={item?.circulate_count}
                                post_id={item?.post_id}
                                key={index}
                                docsFile={item?.media[0]?.name}
                                title={item?.raw_text}
                                username={item?.username}
                                name={item?.name}
                                post_action={item?.action}
                                totalLike={item?.like}
                                totalDislike={item?.dislike}
                                totalComment={item?.comment}
                                post_parent={item?.parent}
                                formatted_created_at={
                                  item?.formatted_created_at
                                }
                                user_type={item.user_type}
                                lang={item?.lang}
                              />
                            </>
                          )}
                          {item?.media_type === "XLS" && (
                            <>
                              <Post
                                lastPost={
                                  item._id === postData[lastPost]["_id"]
                                    ? true
                                    : false
                                }
                                show_below_line={
                                  postData[index + 1]?.["parent"]?.[0]?.[
                                    "_id"
                                  ] === item._id
                                    ? false
                                    : true ||
                                      (showAllReplies &&
                                        !showAllRepliesPost.includes(item._id))
                                }
                                showAllReplies={
                                  postData[index + 1]?.["parent"]?.[0]?.[
                                    "_id"
                                  ] === item._id &&
                                  postData[index - 1]?.["parent"]?.[0]?.[
                                    "_id"
                                  ] === id &&
                                  item["parent"]?.[0]?.["_id"] ===
                                    postData[index - 1]._id &&
                                  !showAllRepliesPost.includes(item._id)
                                    ? true
                                    : false
                                }
                                showIndexes={temp}
                                mentioned_usernames={item?.mentioned_usernames}
                                created_at={item?.created_at}
                                setShowALlRepliesPost={setShowALlRepliesPost}
                                sendingRef={refForScroll}
                                main_post={item._id === id ? true : false}
                                post_quote_count={item?.post_quote}
                                likedUserArray={item?.action?.LIKE}
                                commentUserArray={item?.action}
                                dislikeUserArray={item?.action?.DISLIKE}
                                singlePost
                                circulate_self={item?.circulate_self}
                                circulate_user={item?.circ_username}
                                muted={item?.muted}
                                user_id={item?.user_id}
                                favorite={item?.favorite}
                                like_self={item?.like_self}
                                dislike_self={item?.dislike_self}
                                post_obj={item}
                                post_media_type={item?.media_type}
                                repost={item?.action?.REPOST}
                                post_type={item?.type}
                                post_media={item?.media}
                                excel
                                post_circulated_count={item?.circulate_count}
                                post_id={item?.post_id}
                                key={index}
                                docsFile={item?.media[0]?.name}
                                title={item?.raw_text}
                                username={item?.username}
                                name={item?.name}
                                post_action={item?.action}
                                totalLike={item?.like}
                                totalDislike={item?.dislike}
                                totalComment={item?.comment}
                                post_parent={item?.parent}
                                formatted_created_at={
                                  item?.formatted_created_at
                                }
                                user_type={item.user_type}
                                lang={item?.lang}
                              />
                            </>
                          )}
                          {item?.media_type === "DOC" && (
                            <>
                              <Post
                                lastPost={
                                  item._id === postData[lastPost]["_id"]
                                    ? true
                                    : false
                                }
                                show_below_line={
                                  postData[index + 1]?.["parent"]?.[0]?.[
                                    "_id"
                                  ] === item._id
                                    ? false
                                    : true ||
                                      (showAllReplies &&
                                        !showAllRepliesPost.includes(item._id))
                                }
                                showAllReplies={
                                  postData[index + 1]?.["parent"]?.[0]?.[
                                    "_id"
                                  ] === item._id &&
                                  postData[index - 1]?.["parent"]?.[0]?.[
                                    "_id"
                                  ] === id &&
                                  item["parent"]?.[0]?.["_id"] ===
                                    postData[index - 1]._id &&
                                  !showAllRepliesPost.includes(item._id)
                                    ? true
                                    : false
                                }
                                showIndexes={temp}
                                mentioned_usernames={item?.mentioned_usernames}
                                created_at={item?.created_at}
                                setShowALlRepliesPost={setShowALlRepliesPost}
                                sendingRef={refForScroll}
                                main_post={item._id === id ? true : false}
                                post_quote_count={item?.post_quote}
                                likedUserArray={item?.action?.LIKE}
                                commentUserArray={item?.action}
                                dislikeUserArray={item?.action?.DISLIKE}
                                singlePost
                                circulate_self={item?.circulate_self}
                                circulate_user={item?.circ_username}
                                muted={item?.muted}
                                user_id={item?.user_id}
                                favorite={item?.favorite}
                                like_self={item?.like_self}
                                dislike_self={item?.dislike_self}
                                post_obj={item}
                                post_media_type={item?.media_type}
                                repost={item?.action?.REPOST}
                                post_type={item?.type}
                                post_media={item?.media}
                                doc
                                post_circulated_count={item?.circulate_count}
                                post_id={item?.post_id}
                                key={index}
                                docsFile={item?.media[0]?.name}
                                title={item?.raw_text}
                                username={item?.username}
                                name={item?.name}
                                post_action={item?.action}
                                totalLike={item?.like}
                                totalDislike={item?.dislike}
                                totalComment={item?.comment}
                                post_parent={item?.parent}
                                formatted_created_at={
                                  item?.formatted_created_at
                                }
                                user_type={item.user_type}
                                lang={item?.lang}
                              />
                            </>
                          )}
                          {item?.media_type === "PPTX" && (
                            <>
                              <Post
                                lastPost={
                                  item._id === postData[lastPost]["_id"]
                                    ? true
                                    : false
                                }
                                show_below_line={
                                  postData[index + 1]?.["parent"]?.[0]?.[
                                    "_id"
                                  ] === item._id
                                    ? false
                                    : true ||
                                      (showAllReplies &&
                                        !showAllRepliesPost.includes(item._id))
                                }
                                showAllReplies={
                                  postData[index + 1]?.["parent"]?.[0]?.[
                                    "_id"
                                  ] === item._id &&
                                  postData[index - 1]?.["parent"]?.[0]?.[
                                    "_id"
                                  ] === id &&
                                  item["parent"]?.[0]?.["_id"] ===
                                    postData[index - 1]._id &&
                                  !showAllRepliesPost.includes(item._id)
                                    ? true
                                    : false
                                }
                                showIndexes={temp}
                                mentioned_usernames={item?.mentioned_usernames}
                                created_at={item?.created_at}
                                setShowALlRepliesPost={setShowALlRepliesPost}
                                sendingRef={refForScroll}
                                main_post={item._id === id ? true : false}
                                post_quote_count={item?.post_quote}
                                likedUserArray={item?.action?.LIKE}
                                commentUserArray={item?.action}
                                dislikeUserArray={item?.action?.DISLIKE}
                                singlePost
                                circulate_self={item?.circulate_self}
                                circulate_user={item?.circ_username}
                                muted={item?.muted}
                                user_id={item?.user_id}
                                favorite={item?.favorite}
                                like_self={item?.like_self}
                                dislike_self={item?.dislike_self}
                                post_obj={item}
                                post_media_type={item?.media_type}
                                repost={item?.action?.REPOST}
                                post_type={item?.type}
                                post_media={item?.media}
                                ppt
                                post_circulated_count={item?.circulate_count}
                                post_id={item?.post_id}
                                key={index}
                                docsFile={item?.media[0]?.name}
                                title={item?.raw_text}
                                username={item?.username}
                                name={item?.name}
                                post_action={item?.action}
                                totalLike={item?.like}
                                totalDislike={item?.dislike}
                                totalComment={item?.comment}
                                post_parent={item?.parent}
                                formatted_created_at={
                                  item?.formatted_created_at
                                }
                                user_type={item.user_type}
                                lang={item?.lang}
                              />
                            </>
                          )}
                          {item?.media_type === "IMAGE" && (
                            <>
                              <Post
                                lastPost={
                                  item._id === postData[lastPost]["_id"]
                                    ? true
                                    : false
                                }
                                show_below_line={
                                  postData[index + 1]?.["parent"]?.[0]?.[
                                    "_id"
                                  ] === item._id
                                    ? false
                                    : true ||
                                      (showAllReplies &&
                                        !showAllRepliesPost.includes(item._id))
                                }
                                showAllReplies={
                                  postData[index + 1]?.["parent"]?.[0]?.[
                                    "_id"
                                  ] === item._id &&
                                  postData[index - 1]?.["parent"]?.[0]?.[
                                    "_id"
                                  ] === id &&
                                  item["parent"]?.[0]?.["_id"] ===
                                    postData[index - 1]._id &&
                                  !showAllRepliesPost.includes(item._id)
                                    ? true
                                    : false
                                }
                                showIndexes={temp}
                                mentioned_usernames={item?.mentioned_usernames}
                                created_at={item?.created_at}
                                setShowALlRepliesPost={setShowALlRepliesPost}
                                sendingRef={refForScroll}
                                main_post={item._id === id ? true : false}
                                post_quote_count={item?.post_quote}
                                likedUserArray={item?.action?.LIKE}
                                commentUserArray={item?.action}
                                dislikeUserArray={item?.action?.DISLIKE}
                                singlePost
                                circulate_self={item?.circulate_self}
                                circulate_user={item?.circ_username}
                                muted={item?.muted}
                                user_id={item?.user_id}
                                favorite={item?.favorite}
                                like_self={item?.like_self}
                                dislike_self={item?.dislike_self}
                                post_obj={item}
                                post_circulated_count={item?.circulate_count}
                                post_media_type={item?.media_type}
                                post_type={item?.type}
                                repost={item?.action?.REPOST}
                                post_id={item?.post_id}
                                key={index}
                                imgData={item?.media}
                                imgSrc={item?.imgSrc}
                                title={item?.raw_text}
                                totalComment={item?.comment}
                                totalReply={item?.action?.REPOST?.length}
                                totalDislike={item?.dislike}
                                totalLike={item?.like}
                                username={item?.username}
                                name={item?.name}
                                formatted_created_at={
                                  item?.formatted_created_at
                                }
                                post_action={item?.action}
                                post_parent={item?.parent}
                                user_type={item.user_type}
                                lang={item?.lang}
                              />
                            </>
                          )}
                          {item?.media_type === "" && (
                            <>
                              <Post
                                lastPost={
                                  item._id === postData[lastPost]["_id"]
                                    ? true
                                    : false
                                }
                                show_below_line={
                                  postData[index + 1]?.["parent"]?.[0]?.[
                                    "_id"
                                  ] === item._id
                                    ? false
                                    : true ||
                                      (showAllReplies &&
                                        !showAllRepliesPost.includes(item._id))
                                }
                                showAllReplies={
                                  postData[index + 1]?.["parent"]?.[0]?.[
                                    "_id"
                                  ] === item._id &&
                                  postData[index - 1]?.["parent"]?.[0]?.[
                                    "_id"
                                  ] === id &&
                                  item["parent"]?.[0]?.["_id"] ===
                                    postData[index - 1]._id &&
                                  !showAllRepliesPost.includes(item._id)
                                    ? true
                                    : false
                                }
                                showIndexes={temp}
                                mentioned_usernames={item?.mentioned_usernames}
                                created_at={item?.created_at}
                                setShowALlRepliesPost={setShowALlRepliesPost}
                                sendingRef={refForScroll}
                                main_post={item._id === id ? true : false}
                                post_quote_count={item?.post_quote}
                                likedUserArray={item?.action?.LIKE}
                                commentUserArray={item?.action}
                                dislikeUserArray={item?.action?.DISLIKE}
                                singlePost
                                circulate_self={item?.circulate_self}
                                circulate_user={item?.circ_username}
                                muted={item?.muted}
                                user_id={item?.user_id}
                                favorite={item?.favorite}
                                like_self={item?.like_self}
                                dislike_self={item?.dislike_self}
                                post_obj={item}
                                post_circulated_count={item?.circulate_count}
                                post_media_type={item?.media_type}
                                post_type={item?.type}
                                repost={item?.action?.REPOST}
                                post_id={item?.post_id}
                                key={index}
                                imgSrc={item?.imgSrc}
                                title={item?.raw_text}
                                username={item?.username}
                                name={item?.name}
                                post_action={item?.action}
                                totalLike={item?.like}
                                totalDislike={item?.dislike}
                                totalComment={item?.comment}
                                post_parent={item?.parent}
                                formatted_created_at={
                                  item?.formatted_created_at
                                }
                                type={item?.type}
                                polling_data={item?.polling_data}
                                user_type={item.user_type}
                                lang={item?.lang}
                              />
                            </>
                          )}
                        </>
                      )}
                      {item?.media_type === "AUDIO" && (
                        <>
                          <Post
                            lastPost={
                              item._id === postData[lastPost]["_id"]
                                ? true
                                : false
                            }
                            show_below_line={
                              postData[index + 1]?.["parent"]?.[0]?.["_id"] ===
                              item._id
                                ? false
                                : true ||
                                  (showAllReplies &&
                                    !showAllRepliesPost.includes(item._id))
                            }
                            showAllReplies={
                              postData[index + 1]?.["parent"]?.[0]?.["_id"] ===
                                item._id &&
                              postData[index - 1]?.["parent"]?.[0]?.["_id"] ===
                                id &&
                              item["parent"]?.[0]?.["_id"] ===
                                postData[index - 1]._id &&
                              !showAllRepliesPost.includes(item._id)
                                ? true
                                : false
                            }
                            created_at={item?.created_at}
                            showIndexes={temp}
                            mentioned_usernames={item?.mentioned_usernames}
                            setShowALlRepliesPost={setShowALlRepliesPost}
                            singlePost
                            sendingRef={refForScroll}
                            main_post={item._id === id ? true : false}
                            comment_self={item?.comment_self}
                            complete_url={item?.urls?.other}
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
                            key={index}
                            audioFile={item?.media[0]?.name}
                            title={item?.raw_text}
                            username={item?.username}
                            name={item?.name}
                            totalLike={item?.like}
                            totalDislike={item?.dislike}
                            totalComment={item?.comment}
                            post_parent={item?.parent}
                            formatted_created_at={item?.formatted_created_at}
                            mute_id={mute_id}
                            round_table_data={item?.round_table_data}
                            user_type={item.user_type}
                            lang={item?.lang}
                          />
                        </>
                      )}
                      {item?.media_type === "PDF" && (
                        <>
                          <Post
                            lastPost={
                              item._id === postData[lastPost]["_id"]
                                ? true
                                : false
                            }
                            show_below_line={
                              postData[index + 1]?.["parent"]?.[0]?.["_id"] ===
                              item._id
                                ? false
                                : true ||
                                  (showAllReplies &&
                                    !showAllRepliesPost.includes(item._id))
                            }
                            showAllReplies={
                              postData[index + 1]?.["parent"]?.[0]?.["_id"] ===
                                item._id &&
                              postData[index - 1]?.["parent"]?.[0]?.["_id"] ===
                                id &&
                              item["parent"]?.[0]?.["_id"] ===
                                postData[index - 1]._id &&
                              !showAllRepliesPost.includes(item._id)
                                ? true
                                : false
                            }
                            showIndexes={temp}
                            mentioned_usernames={item?.mentioned_usernames}
                            created_at={item?.created_at}
                            setShowALlRepliesPost={setShowALlRepliesPost}
                            sendingRef={refForScroll}
                            main_post={item._id === id ? true : false}
                            singlePost
                            comment_self={item?.comment_self}
                            complete_url={item?.urls?.other}
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
                            post_circulated_count={item?.circulate_count}
                            post_id={item?.post_id}
                            key={index}
                            docsFile={item?.media[0]?.name}
                            title={item?.raw_text}
                            username={item?.username}
                            name={item?.name}
                            totalLike={item?.like}
                            totalDislike={item?.dislike}
                            totalComment={item?.comment}
                            post_parent={item?.parent}
                            formatted_created_at={item?.formatted_created_at}
                            mute_id={mute_id}
                            round_table_data={item?.round_table_data}
                            user_type={item.user_type}
                            lang={item?.lang}
                          />
                        </>
                      )}
                      {item?.media_type === "XLS" && (
                        <>
                          <Post
                            lastPost={
                              item._id === postData[lastPost]["_id"]
                                ? true
                                : false
                            }
                            show_below_line={
                              postData[index + 1]?.["parent"]?.[0]?.["_id"] ===
                              item._id
                                ? false
                                : true ||
                                  (showAllReplies &&
                                    !showAllRepliesPost.includes(item._id))
                            }
                            showAllReplies={
                              postData[index + 1]?.["parent"]?.[0]?.["_id"] ===
                                item._id &&
                              postData[index - 1]?.["parent"]?.[0]?.["_id"] ===
                                id &&
                              item["parent"]?.[0]?.["_id"] ===
                                postData[index - 1]._id &&
                              !showAllRepliesPost.includes(item._id)
                                ? true
                                : false
                            }
                            showIndexes={temp}
                            mentioned_usernames={item?.mentioned_usernames}
                            created_at={item?.created_at}
                            setShowALlRepliesPost={setShowALlRepliesPost}
                            sendingRef={refForScroll}
                            main_post={item._id === id ? true : false}
                            singlePost
                            complete_url={item?.urls?.other}
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
                            post_circulated_count={item?.circulate_count}
                            post_id={item?.post_id}
                            key={index}
                            docsFile={item?.media[0]?.name}
                            title={item?.raw_text}
                            username={item?.username}
                            name={item?.name}
                            totalLike={item?.like}
                            totalDislike={item?.dislike}
                            totalComment={item?.comment}
                            post_parent={item?.parent}
                            formatted_created_at={item?.formatted_created_at}
                            mute_id={mute_id}
                            round_table_data={item?.round_table_data}
                            user_type={item.user_type}
                            lang={item?.lang}
                          />
                        </>
                      )}
                      {item?.media_type === "DOC" && (
                        <>
                          <Post
                            lastPost={
                              item._id === postData[lastPost]["_id"]
                                ? true
                                : false
                            }
                            show_below_line={
                              postData[index + 1]?.["parent"]?.[0]?.["_id"] ===
                              item._id
                                ? false
                                : true ||
                                  (showAllReplies &&
                                    !showAllRepliesPost.includes(item._id))
                            }
                            showAllReplies={
                              postData[index + 1]?.["parent"]?.[0]?.["_id"] ===
                                item._id &&
                              postData[index - 1]?.["parent"]?.[0]?.["_id"] ===
                                id &&
                              item["parent"]?.[0]?.["_id"] ===
                                postData[index - 1]._id &&
                              !showAllRepliesPost.includes(item._id)
                                ? true
                                : false
                            }
                            showIndexes={temp}
                            mentioned_usernames={item?.mentioned_usernames}
                            created_at={item?.created_at}
                            setShowALlRepliesPost={setShowALlRepliesPost}
                            sendingRef={refForScroll}
                            main_post={item._id === id ? true : false}
                            singlePost
                            complete_url={item?.urls?.other}
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
                            post_circulated_count={item?.circulate_count}
                            post_id={item?.post_id}
                            key={index}
                            docsFile={item?.media[0]?.name}
                            title={item?.raw_text}
                            username={item?.username}
                            name={item?.name}
                            totalLike={item?.like}
                            totalDislike={item?.dislike}
                            totalComment={item?.comment}
                            post_parent={item?.parent}
                            formatted_created_at={item?.formatted_created_at}
                            mute_id={mute_id}
                            round_table_data={item?.round_table_data}
                            user_type={item.user_type}
                            lang={item?.lang}
                          />
                        </>
                      )}
                      {item?.media_type === "PPTX" && (
                        <>
                          <Post
                            lastPost={
                              item._id === postData[lastPost]["_id"]
                                ? true
                                : false
                            }
                            show_below_line={
                              postData[index + 1]?.["parent"]?.[0]?.["_id"] ===
                              item._id
                                ? false
                                : true ||
                                  (showAllReplies &&
                                    !showAllRepliesPost.includes(item._id))
                            }
                            showAllReplies={
                              postData[index + 1]?.["parent"]?.[0]?.["_id"] ===
                                item._id &&
                              postData[index - 1]?.["parent"]?.[0]?.["_id"] ===
                                id &&
                              item["parent"]?.[0]?.["_id"] ===
                                postData[index - 1]._id &&
                              !showAllRepliesPost.includes(item._id)
                                ? true
                                : false
                            }
                            showIndexes={temp}
                            mentioned_usernames={item?.mentioned_usernames}
                            created_at={item?.created_at}
                            setShowALlRepliesPost={setShowALlRepliesPost}
                            sendingRef={refForScroll}
                            main_post={item._id === id ? true : false}
                            singlePost
                            complete_url={item?.urls?.other}
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
                            post_circulated_count={item?.circulate_count}
                            post_id={item?.post_id}
                            key={index}
                            docsFile={item?.media[0]?.name}
                            title={item?.raw_text}
                            username={item?.username}
                            name={item?.name}
                            totalLike={item?.like}
                            totalDislike={item?.dislike}
                            totalComment={item?.comment}
                            post_parent={item?.parent}
                            formatted_created_at={item?.formatted_created_at}
                            mute_id={mute_id}
                            round_table_data={item?.round_table_data}
                            user_type={item.user_type}
                            lang={item?.lang}
                          />
                        </>
                      )}
                      {item?.media_type === "IMAGE" && (
                        <>
                          <Post
                            lastPost={
                              item._id === postData[lastPost]["_id"]
                                ? true
                                : false
                            }
                            show_below_line={
                              postData[index + 1]?.["parent"]?.[0]?.["_id"] ===
                              item._id
                                ? false
                                : true ||
                                  (showAllReplies &&
                                    !showAllRepliesPost.includes(item._id))
                            }
                            showAllReplies={
                              postData[index + 1]?.["parent"]?.[0]?.["_id"] ===
                                item._id &&
                              postData[index - 1]?.["parent"]?.[0]?.["_id"] ===
                                id &&
                              item["parent"]?.[0]?.["_id"] ===
                                postData[index - 1]._id &&
                              !showAllRepliesPost.includes(item._id)
                                ? true
                                : false
                            }
                            showIndexes={temp}
                            mentioned_usernames={item?.mentioned_usernames}
                            created_at={item?.created_at}
                            setShowALlRepliesPost={setShowALlRepliesPost}
                            sendingRef={refForScroll}
                            main_post={item._id === id ? true : false}
                            singlePost
                            comment_self={item?.comment_self}
                            complete_url={item?.urls?.other}
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
                            key={index}
                            imgData={item?.media}
                            imgSrc={item?.imgSrc}
                            title={item?.raw_text}
                            totalComment={item?.comment}
                            totalDislike={item?.dislike}
                            totalLike={item?.like}
                            username={item?.username}
                            name={item?.name}
                            formatted_created_at={item?.formatted_created_at}
                            mute_id={mute_id}
                            post_parent={item?.parent}
                            round_table_data={item?.round_table_data}
                            user_type={item.user_type}
                            lang={item?.lang}
                          />
                        </>
                      )}
                      {item?.media_type === "" && (
                        <>
                          <Post
                            lastPost={
                              item._id === postData[lastPost]["_id"]
                                ? true
                                : false
                            }
                            show_below_line={
                              postData[index + 1]?.["parent"]?.[0]?.["_id"] ===
                              item._id
                                ? false
                                : true ||
                                  (showAllReplies &&
                                    !showAllRepliesPost.includes(item._id))
                            }
                            showAllReplies={
                              postData[index + 1]?.["parent"]?.[0]?.["_id"] ===
                                item._id &&
                              postData[index - 1]?.["parent"]?.[0]?.["_id"] ===
                                id &&
                              item["parent"]?.[0]?.["_id"] ===
                                postData[index - 1]._id &&
                              !showAllRepliesPost.includes(item._id)
                                ? true
                                : false
                            }
                            showIndexes={temp}
                            mentioned_usernames={item?.mentioned_usernames}
                            created_at={item?.created_at}
                            setShowALlRepliesPost={setShowALlRepliesPost}
                            sendingRef={refForScroll}
                            main_post={item._id === id ? true : false}
                            singlePost
                            comment_self={item?.comment_self}
                            complete_url={item?.urls?.other}
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
                            key={index}
                            imgSrc={item?.imgSrc}
                            title={item?.raw_text}
                            username={item?.username}
                            name={item?.name}
                            totalLike={item?.like}
                            totalDislike={item?.dislike}
                            totalComment={item?.comment}
                            post_parent={item?.parent}
                            formatted_created_at={item?.formatted_created_at}
                            mute_id={mute_id}
                            round_table_data={item?.round_table_data}
                            type={item?.type}
                            polling_data={item?.polling_data}
                            pollExpireTime={
                              new Date(item?.polling_data?.end_date)
                            }
                            user_type={item.user_type}
                            lang={item?.lang}
                          />
                        </>
                      )}
                    </>
                  );
                })}
            </div>
          </ReactPlaceholder>
        </CenterDiv>

        <RightDiv>
          <RightSideBar showRoundtabaleContent />
        </RightDiv>
      </MainDiv>
    </>
  );
};

export default SinglePost;
