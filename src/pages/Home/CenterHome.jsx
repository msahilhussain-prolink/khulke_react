import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTownhallPost } from "../../apis/postApi";
import ToastHandler from "../../utils/ToastHandler";
// import { json, useNavigate } from "react-router-dom";
import { allWords } from "../../App";
import { globalImages } from "../../assets/imagesPath/images";
import Post from "../../components/Post";
import CreatePost from "../../components/Post/CreatePost";
import Spinner from "../../components/Spinner";
import "./CenterHome.css";
import { REACT_APP_BASE_URL_CLOUDFRONT } from "../../constants/env";
import ConvertDateInIST from "../Notification/CentralContent/ConvertDateInIST";

export default function CenterHome({
  setDayDuration,
  setHourDuration,
  day_duration,
  hour_duration,
}) {
  // vars
  const ref = React.useRef();
  // state
  const [allPostData, setAllPostData] = useState([]);
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState({ message: "", val: false });
  const updatedPostData = useSelector((state) => state.post.posts);
  const circulateData = useSelector((state) => state.post.circulateData);
  const [useAction, setUserAction]= useState(null)
  const [skip, setSkip] = useState(0);
  const limit = 20;
  const [callingApi, setCallingApi] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // handlers
  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 50;

    if (bottom && !callingApi) {
      setSkip(allPostData.length);
    }
  };

  const GetAllPostData = async () => {
    setCallingApi(true);
    var response;
    try {
      response = await getTownhallPost(limit, skip);
      setPostLoading(false);
      setCallingApi(false);
    } catch (e) {
      setPostLoading(false);
      setCallingApi(false);
      return ToastHandler("dan", allWords.misc.pages.facingDiffi);
    }
    const data = response.data.data.old_post;
    if (data.length < 0 || data[0]?.message)
      return setPostError({ val: true, message: data[0]?.message });
    setAllPostData((prev) => [...prev, ...data]);
  };

  useEffect(() => {
    if (callingApi) return;
    GetAllPostData();
  }, [skip]);

  useEffect(() => {
    const hasOldData = updatedPostData?.data?.old_post;

    if (hasOldData && allPostData !== hasOldData) {
      setAllPostData(hasOldData);
    }
  }, [allPostData, updatedPostData]);


  const useActionGetData = async () => {
    setCallingApi(true);
    var response;
    try {
      response = await getTownhallPost(1, skip);
      setPostLoading(false);
      setCallingApi(false);
    } catch (e) {
      setPostLoading(false);
      setCallingApi(false);
      return ToastHandler("dan", allWords.misc.pages.facingDiffi);
    }
    const data = response.data.data.old_post;
    if (data.length < 0 || data[0]?.message)
      return setPostError({ val: true, message: data[0]?.message });
    setAllPostData((prev) => [...prev, ...data]);
  };

  useEffect(()=>{

  },[useAction])

  // new filtering
  let filtey = [];
  function newFilFunc() {
    for (let i = 0; i < allPostData.length; i++) {
      if (allPostData[i].has_child !== true) {
        filtey.push(allPostData[i]);
      }
      if (allPostData[i].has_child === true) {
        filtey.push(allPostData[i]);
        filtey.push(allPostData[i].child[0]);
      }
    }
  }

  newFilFunc();

  return (
    <div
      style={{
        height: "calc(100vh - 130px)",
        overflowY: "scroll",
        overflowX: "hidden",
      }}
      onScroll={handleScroll}
    >
      <CreatePost
        setDayDuration={setDayDuration}
        setHourDuration={setHourDuration}
      />

      <>
        {filtey.length > 0 ? (
          filtey?.map((item, index) => (
            <div key={`${item._id}${Math.floor(Math.random() * 10)}`}>
              {item?.media_type === "VIDEO" && (
                <>
                  <Post
                    key={item._id}
                    mentioned_usernames={item?.mentioned_usernames}
                    townhall_thread={item.IS_THREAD === true ? true : false}
                    complete_url={item?.urls?.other}
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
                    videoFile={item?.media[0]?.name}
                    post_media_type={item?.media_type}
                    post_media={item?.media}
                    title={item?.raw_text}
                    username={item?.username}
                    name={item?.name}
                    totalLike={item?.like}
                    totalDislike={item?.dislike}
                    totalComment={item?.comment}
                    post_parent={item?.parent || item?.child}
                    formatted_created_at={ConvertDateInIST(item?.created_at)}
                    round_table_data={item?.round_table_data}
                    GetAllPostDataHome={GetAllPostData}
                    THpost={"true"}
                    nested_parent={item.nested_parent ? true : false}
                    liked_usernameTF={
                      item.liked_usernames?.length > 0
                        ? item.liked_usernames
                        : false
                    }
                    itemType={item?.type}
                    prnt={item?.has_child}
                    isMuted={isMuted}
                    setIsMuted={setIsMuted}
                    user_type={item?.user_type}
                    src={`${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${
                      item?.user_id
                    }/post/${item?._id}/${
                      item?.is_converted === 1
                        ? item?.media[0]?.extra?.convertedFilename ??
                          item?.media[0]?.metadata?.convertedFilename
                        : item?.media[0]?.extra?.filename
                    }`}
                  />
                </>
              )}
              {item?.media_type === "AUDIO" && (
                <>
                  <Post
                    mentioned_usernames={item?.mentioned_usernames}
                    townhall_thread={item.IS_THREAD === true ? true : false}
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
                    post_media={item?.media}
                    audio
                    post_quote_count={item?.post_quote}
                    post_circulated_count={item?.circulate_count}
                    post_id={item?.post_id}
                    post_type={item?.type}
                    key={item?._id}
                    audioFile={item?.media[0]?.name}
                    title={item?.raw_text}
                    username={item?.username}
                    name={item?.name}
                    totalLike={item?.like}
                    totalDislike={item?.dislike}
                    totalComment={item?.comment}
                    post_parent={item?.parent || item?.child}
                    formatted_created_at={ConvertDateInIST(item?.created_at)}
                    round_table_data={item?.round_table_data}
                    GetAllPostDataHome={GetAllPostData}
                    THpost={"true"}
                    nested_parent={item.nested_parent ? true : false}
                    liked_usernameTF={
                      item.liked_usernames?.length > 0
                        ? item.liked_usernames
                        : false
                    }
                    itemType={item?.type}
                    prnt={item?.has_child}
                    user_type={item?.user_type}
                  />
                </>
              )}
              {item?.media_type === "PDF" && (
                <>
                  <Post
                    mentioned_usernames={item?.mentioned_usernames}
                    townhall_thread={item.IS_THREAD === true ? true : false}
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
                    post_media={item?.media}
                    post_type={item?.type}
                    pdf
                    post_circulated_count={item?.circulate_count}
                    post_id={item?.post_id}
                    key={item?._id}
                    docsFile={item?.media[0]?.name}
                    title={item?.raw_text}
                    username={item?.username}
                    name={item?.name}
                    totalLike={item?.like}
                    totalDislike={item?.dislike}
                    totalComment={item?.comment}
                    post_parent={item?.parent || item?.child}
                    formatted_created_at={ConvertDateInIST(item?.created_at)}
                    round_table_data={item?.round_table_data}
                    GetAllPostDataHome={GetAllPostData}
                    THpost={"true"}
                    nested_parent={item.nested_parent ? true : false}
                    liked_usernameTF={
                      item.liked_usernames?.length > 0
                        ? item.liked_usernames
                        : false
                    }
                    itemType={item?.type}
                    prnt={item?.has_child}
                    user_type={item?.user_type}
                  />
                </>
              )}
              {item?.media_type === "XLS" && (
                <>
                  <Post
                    mentioned_usernames={item?.mentioned_usernames}
                    townhall_thread={item.IS_THREAD === true ? true : false}
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
                    post_media={item?.media}
                    post_type={item?.type}
                    excel
                    post_circulated_count={item?.circulate_count}
                    post_id={item?.post_id}
                    key={item?._id}
                    docsFile={item?.media[0]?.name}
                    title={item?.raw_text}
                    username={item?.username}
                    name={item?.name}
                    totalLike={item?.like}
                    totalDislike={item?.dislike}
                    totalComment={item?.comment}
                    post_parent={item?.parent || item?.child}
                    formatted_created_at={ConvertDateInIST(item?.created_at)}
                    round_table_data={item?.round_table_data}
                    GetAllPostDataHome={GetAllPostData}
                    THpost={"true"}
                    nested_parent={item.nested_parent ? true : false}
                    liked_usernameTF={
                      item.liked_usernames?.length > 0
                        ? item.liked_usernames
                        : false
                    }
                    itemType={item?.type}
                    prnt={item?.has_child}
                    user_type={item?.user_type}
                  />
                </>
              )}
              {item?.media_type === "DOC" && (
                <>
                  <Post
                    mentioned_usernames={item?.mentioned_usernames}
                    townhall_thread={item.IS_THREAD === true ? true : false}
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
                    post_media={item?.media}
                    post_type={item?.type}
                    doc
                    post_circulated_count={item?.circulate_count}
                    post_id={item?.post_id}
                    key={item?._id}
                    docsFile={item?.media[0]?.name}
                    title={item?.raw_text}
                    username={item?.username}
                    name={item?.name}
                    totalLike={item?.like}
                    totalDislike={item?.dislike}
                    totalComment={item?.comment}
                    post_parent={item?.parent || item?.child}
                    formatted_created_at={ConvertDateInIST(item?.created_at)}
                    round_table_data={item?.round_table_data}
                    GetAllPostDataHome={GetAllPostData}
                    THpost={"true"}
                    nested_parent={item.nested_parent ? true : false}
                    liked_usernameTF={
                      item.liked_usernames?.length > 0
                        ? item.liked_usernames
                        : false
                    }
                    itemType={item?.type}
                    prnt={item?.has_child}
                    user_type={item?.user_type}
                  />
                </>
              )}
              {item?.media_type === "PPTX" && (
                <>
                  <Post
                    mentioned_usernames={item?.mentioned_usernames}
                    townhall_thread={item.IS_THREAD === true ? true : false}
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
                    post_media={item?.media}
                    post_type={item?.type}
                    ppt
                    post_circulated_count={item?.circulate_count}
                    post_id={item?.post_id}
                    key={item?._id}
                    docsFile={item?.media[0]?.name}
                    title={item?.raw_text}
                    username={item?.username}
                    name={item?.name}
                    totalLike={item?.like}
                    totalDislike={item?.dislike}
                    totalComment={item?.comment}
                    post_parent={item?.parent || item?.child}
                    formatted_created_at={ConvertDateInIST(item?.created_at)}
                    round_table_data={item?.round_table_data}
                    GetAllPostDataHome={GetAllPostData}
                    THpost={"true"}
                    nested_parent={item.nested_parent ? true : false}
                    liked_usernameTF={
                      item.liked_usernames?.length > 0
                        ? item.liked_usernames
                        : false
                    }
                    itemType={item?.type}
                    prnt={item?.has_child}
                    user_type={item?.user_type}
                  />
                </>
              )}
              {item?.media_type === "IMAGE" && (
                <>
                  <Post
                    mentioned_usernames={item?.mentioned_usernames}
                    townhall_thread={item.IS_THREAD === true ? true : false}
                    //  primary={item.parent[0]._id === "" ? "true" : "false"}
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
                    post_media={item?.media}
                    post_type={item?.type}
                    post_id={item?.post_id}
                    key={item?._id}
                    imgData={item?.media}
                    imgSrc={item?.imgSrc}
                    title={item?.raw_text}
                    totalComment={item?.comment}
                    totalDislike={item?.dislike}
                    totalLike={item?.like}
                    username={item?.username}
                    name={item?.name}
                    formatted_created_at={ConvertDateInIST(item?.created_at)}
                    post_parent={item?.parent || item?.child}
                    round_table_data={item?.round_table_data}
                    GetAllPostDataHome={GetAllPostData}
                    THpost={"true"}
                    nested_parent={item.nested_parent ? true : false}
                    liked_usernameTF={
                      item.liked_usernames?.length > 0
                        ? item.liked_usernames
                        : false
                    }
                    itemType={item?.type}
                    prnt={item?.has_child}
                    user_type={item?.user_type}
                  />
                </>
              )}
              {item?.media_type === "" && (
                <>
                  <Post
                    mentioned_usernames={item?.mentioned_usernames}
                    townhall_thread={item.IS_THREAD === true ? true : false}
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
                    post_media={item?.media}
                    post_type={item?.type}
                    post_id={item?.post_id}
                    key={item?._id}
                    imgSrc={item?.imgSrc}
                    title={item?.raw_text}
                    username={item?.username}
                    name={item?.name}
                    totalLike={item?.like}
                    totalDislike={item?.dislike}
                    totalComment={item?.comment}
                    post_parent={item?.parent || item?.child}
                    formatted_created_at={ConvertDateInIST(item?.created_at)}
                    round_table_data={item?.round_table_data}
                    GetAllPostDataHome={GetAllPostData}
                    type={item?.type}
                    polling_data={item?.polling_data}
                    pollExpireTime={new Date(item?.polling_data?.end_date)}
                    day_duration={day_duration}
                    hour_duration={hour_duration}
                    THpost={"true"}
                    nested_parent={item.nested_parent ? true : false}
                    liked_usernameTF={
                      item.liked_usernames?.length > 0
                        ? item.liked_usernames
                        : false
                    }
                    itemType={item?.type}
                    prnt={item?.has_child}
                    user_type={item?.user_type}
                  />
                </>
              )}
            </div>
          ))
        ) : (
          <div className="empty_timeline_div">
            <img
              src={globalImages.si_th_empty}
              className="empty_timeline_img"
            />
          </div>
        )}

        {callingApi && <Spinner />}
      </>
    </div>
  );
}
