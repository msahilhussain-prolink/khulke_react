import React, { useState, useEffect } from "react";
import PopularRT from "../../components/PopularRT";
import Tabs from "./Tabs";
// import News from "./News";
import ReactPlaceholder from "react-placeholder";
import { getTownhallPost } from "../../apis/postApi";
import ToastHandler from "../../utils/ToastHandler";
import Post from "../../components/Post";
import PostCardPlaceHolder from "../../components/PostCardPlaceholder";
import Spinner from "../../components/Spinner";
import { allWords } from "../../App";

export default function NewsParent({ activeTab, setActiveTab, setAnonymous }) {
  const [allPostData, setAllPostData] = useState([]);
  const [postLoading, setPostLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [callingApi, setCallingApi] = useState(false);
  const [postError, setPostError] = useState({ message: "", val: false });
  const limit = 20;
  const [day_duration, setDayDuration] = useState("");
  const [hour_duration, setHourDuration] = useState("");

  // handler
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
    let type = "feeds";
    try {
      response = await getTownhallPost(limit, skip, type);
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

  return (
    <div
      style={{
        height: "calc(100vh - 130px)",
        overflowY: "scroll",
        overflowX: "hidden",
      }}
      className="contForTmln"
      onScroll={handleScroll}
    >
      {!localStorage.current_user && localStorage.anonymous_user && (
        <>
          <PopularRT />
        </>
      )}
      <div
        style={{
          position: "sticky",
          top: "-1px",
          backgroundColor: "white",
          zIndex: 1,
        }}
      >
        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setAnonymous={setAnonymous}
        />
      </div>
      {/* <News /> */}

      <ReactPlaceholder
        customPlaceholder={<PostCardPlaceHolder />}
        type="media"
        rows={7}
        showLoadingAnimation
        ready={(allPostData?.length > 0 && !postLoading) || postError.val}
      >
        {/* {<h1>news</h1>} */}
        {allPostData.map((item, index) => (
          <div key={`${item._id}${Math.floor(Math.random() * 10)}`}>
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
                imgSrc={item?.imgSrc}
                title={item?.raw_text}
                username={item?.username}
                name={item?.name}
                totalLike={item?.like}
                totalDislike={item?.dislike}
                totalComment={item?.comment}
                post_parent={item?.parent}
                formatted_created_at={item?.formatted_created_at}
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
              />
            </>
          </div>
        ))}
        {callingApi && <Spinner />}
      </ReactPlaceholder>
    </div>
  );
}
