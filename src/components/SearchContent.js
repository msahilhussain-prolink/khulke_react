import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactPlaceholder from "react-placeholder";
import styled from "styled-components";
import axios from "axios";

// Styles
import "react-placeholder/lib/reactPlaceholder.css";
import "../components/ProfileCenter/style.css";

// Constants
import {
  REACT_APP_BASE_URL_FOR_USER,
  REACT_APP_BASE_URL_CLOUDFRONT,
} from "../constants/env";

// Material UI
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AppBar from "@mui/material/AppBar";

// Components
import PostCardPlaceHolder from "../components/PostCardPlaceholder";
import Post from "../components/Post";
import Spinner from "../components/Spinner";
import ListComponent from "./ListComponent";
import RTListingCard from "./RTListingCard";
import PreloginComp from "./PreLoginComp";

// Assets
// import SearchIcon from "../assets/icons/search_for_yapp.svg";
// import TownHallIconActive from "../assets/icons/home_icon_active.svg";

// Utils
import { auto_login_continue, moengageEvent } from "../utils/utils";
import ToastHandler from "../utils/ToastHandler";
import { allWords } from "../App";
import { globalImages } from "../assets/imagesPath/images";
import { Grid } from "@mui/material";
import GetBorderColor from "../utils/RTListType";

const MyContentCard = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 4px;
  padding: 0.2rem;
  margin-top: 1rem;
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
  .event_container {
    width: 100%;
    height: 92%;
    overflow: hidden;
    overflow-y: scroll;
    ::-webkit-scrollbar {
      width: 0.3em;
      display: none;
    }
  }
`;

const CardContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  margin-top: 1rem;
  overflow: hidden;

  .user_suggestion_container {
    width: 100%;
    height: 92%;
    padding: 0.5rem;
    margin-left: auto;
    margin-right: auto;
  }
`;

const FirstTabContainer = styled.div``;

const SecondTabContainer = styled.div``;

const ThirdTabContainer = styled.div``;

const SearchContent = ({
  callback,
  render_list,
  search_error,
  search_loading,
  setCurated,
  rtData,
  searchPostData,
  searchRT,
  searchPosts,
  trigger_search,
  search_debounce,
}) => {
  const [selectedTab, setSelectedTab] = useState(1);
  const [isMuted, setIsMuted] = useState(false); // video mute-unmute

  const [modalOpen, setModalOpen] = useState(false);
  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
    callback(newValue);

    if (newValue === 0) {
      searchPosts(search_debounce);
    } else if (newValue === 1) {
      trigger_search("", "people");
    } else {
      searchRT(search_debounce);
    }
  };

  const dispatch = useDispatch();
  const allPostData = searchPostData;
  const postLoading = useSelector((state) => state.post.loading);
  const [limit, setLimit] = useState(20);
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
          moengageEvent(type === "follow" ? "Follow" : "UnFollow", "User", {
            IdOth: "",
            UsernameOth: handle,
          });

          let temp_solution = [...render_list];
          let toset = true;
          if (type === "unfollow") {
            toset = false;
          }
          for (let i = 0; i < temp_solution.length; i++) {
            if (temp_solution[i]["username"] === handle) {
              temp_solution[i]["is_following"] = toset;
              setCurated(temp_solution);
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

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 50;
    if (bottom) {
      setLimit(limit + 20);
    }
  };

  return (
    <MyContentCard>
      <AppBar
        position="static"
        elevation={0}
        style={{ backgroundColor: "transparent" }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab
            label={allWords.search.post}
            disabled={false}
            style={{
              width: "33%",
              textTransform: "capitalize",
              color: "black",
              fontWeight: "bold",
              backgroundColor: "transparent",
              borderBottom: "1px solid lightgray",
            }}
          />
          <Tab
            label={allWords.search.people}
            defaultChecked={true}
            style={{
              width: "33%",
              textTransform: "capitalize",
              color: "black",
              fontWeight: "bold",
              backgroundColor: "transparent",
              borderBottom: "1px solid lightgray",
            }}
          />
          <Tab
            label={allWords.search.rt}
            style={{
              width: "33%",
              textTransform: "capitalize",
              color: "black",
              fontWeight: "bold",
              borderBottom: "1px solid lightgray",
            }}
          />
        </Tabs>
      </AppBar>

      <div className="event_container">
        {selectedTab === 0 && (
          <FirstTabContainer>
            {allPostData?.data?.old_post?.[0]?.["type"] === "BLANK_TAB" ||
            !allPostData?.data?.old_post ||
            allPostData?.data?.old_post?.length === 0 ? (
              <div className="my-5 container-fluid text-center">
                <img
                  src={globalImages.si_search_post}
                  alt="search"
                  style={{ width: "30%" }}
                  className="mt-5"
                />
              </div>
            ) : (
              <>
                <div onScroll={handleScroll}>
                  <ReactPlaceholder
                    customPlaceholder={<PostCardPlaceHolder />}
                    type="media"
                    rows={7}
                    showLoadingAnimation
                    ready={allPostData?.data?.old_post?.length > 0}
                  >
                    {allPostData?.data?.old_post?.map((item, index) => (
                      <>
                        {item?.media_type === "VIDEO" && (
                          <Post
                            key={item._id}
                            mentioned_usernames={item?.mentioned_usernames}
                            townhall_thread={
                              item.IS_THREAD === true ? true : false
                            }
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
                            post_parent={item?.parent}
                            formatted_created_at={item?.formatted_created_at}
                            round_table_data={item?.round_table_data}
                            isMuted={isMuted}
                            setIsMuted={setIsMuted}
                            user_type={item?.user_type}
                            src={`${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${
                              item?.user_id
                            }/post/${item?._id}/${
                              item?.is_converted == 1
                                ? item?.media[0]?.extra?.convertedFilename
                                : item?.media[0]?.extra?.filename
                            }`}
                          />
                        )}
                        {item?.media_type === "IMAGE" && (
                          <>
                            <>
                              <Post
                                mentioned_usernames={item?.mentioned_usernames}
                                townhall_thread={
                                  item.IS_THREAD === true ? true : false
                                }
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
                                formatted_created_at={
                                  item?.formatted_created_at
                                }
                                post_parent={item?.parent}
                                round_table_data={item?.round_table_data}
                                user_type={item?.user_type}
                              />
                            </>
                          </>
                        )}
                        {item?.media_type === "" && (
                          <Post
                            mentioned_usernames={item?.mentioned_usernames}
                            townhall_thread={
                              item.IS_THREAD === true ? true : false
                            }
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
                            type={item?.type}
                            polling_data={item?.polling_data}
                            pollExpireTime={
                              new Date(item?.polling_data?.end_date)
                            }
                            user_type={item?.user_type}
                          />
                        )}
                      </>
                    ))}
                    {postLoading && <Spinner />}
                  </ReactPlaceholder>
                </div>
              </>
            )}
          </FirstTabContainer>
        )}
        {selectedTab === 1 && (
          <SecondTabContainer>
            <CardContainer>
              {search_loading ? (
                <Spinner />
              ) : search_error ? (
                <>
                  <div className="text-center container mt-5">
                    <small className="warn-text">
                      Something went wrong! Try again later!
                    </small>
                  </div>
                </>
              ) : render_list.length > 0 ? (
                <div className="user_suggestion_container">
                  <ListComponent
                    render_points={render_list}
                    btn_fucntion={follow_unfollow_driver}
                    type={"follow"}
                    need_badge={false}
                    div_border={false}
                  />
                </div>
              ) : (
                <div className="my-5 container-fluid text-center">
                  <img
                    src={globalImages.si_search_rt}
                    alt="search"
                    style={{ width: "30%" }}
                    className="mt-5"
                  />
                </div>
              )}
            </CardContainer>
          </SecondTabContainer>
        )}
        {selectedTab === 2 && (
          <ThirdTabContainer>
            {search_loading ? (
              <Spinner />
            ) : (
              <>
                <div className="profile_div">
                  {rtData &&
                    rtData?.data?.length > 0 &&
                    rtData?.data
                      ?.sort((a, b) => {
                        return b._id.localeCompare(a._id);
                      })
                      ?.map((item) => (
                        <Grid
                          xl={3}
                          lg={4}
                          sm={6}
                          xs={12}
                          style={{ padding: "5px" }}
                          key={item?._id}
                        >
                          <div key={item?._id} style={{ marginTop: "1rem" }}>
                            <RTListingCard
                              listingDisplay
                              broadcast_destination={item.broadcast_destination}
                              displayValue={"space-between"}
                              style={GetBorderColor(item)}
                              rt_id={item?._id}
                              cardImg
                              cover_img={
                                item?.media?.length > 0 &&
                                `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${item?.owner?.user_id}/roundtable/${item?.["_id"]}/profile/${item?.["media"]?.[0]?.["metadata"]?.["tempFilename"]}`
                              }
                              mod_cover_img={
                                item?.media?.length > 0 &&
                                `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${item?.moderator?.user_id}/roundtable/${item?.["_id"]}/profile/${item?.["media"]?.[0]?.["metadata"]?.["tempFilename"]}`
                              }
                              title={item?.name}
                              timestamp={item?.utc_time}
                              rt_type={item?.r_type}
                              rt_nature={item?.open_to_all}
                              moderator={item?.moderator}
                              speakers={item?.speakers}
                              reminder_status={
                                item.reminder_set || item.was_invited
                              }
                              upcoming={item?.upcoming_flag}
                              past={item?.happened_flag}
                              bodyRow
                              cardCenter
                              centerRow
                              cardHr
                              cardfooter
                              live={item.active_flag}
                              join_count={
                                item?.happened_flag === true
                                  ? item?.["join_count"]
                                  : 0
                              }
                              viewer_count={
                                item?.active_flag === true
                                  ? item?.["viewer_count"]
                                  : ""
                              }
                              invitees_count={
                                item?.upcoming_flag === true
                                  ? item?.["invite_count"] -
                                    item?.["rejected_count"]
                                  : ""
                              }
                              rt_details={item}
                              req_visitor_count={item?.req_visitor_count}
                              req_visitor={item.req_visitor_count}
                              request_status={
                                item?.invite_requested || item?.was_invited
                              }
                              was_invited={item?.was_invited}
                              request_access={
                                !item.owner_flag ||
                                !item.moderator_flag ||
                                !item.speaker_flag
                              }
                              invitation_code={item?.roundtable_code}
                              owner_details={item?.owner}
                              is_cancelled={item?.is_cancelled}
                              rec_owner_flag={
                                item?.recording?.[0]?.owner_flag === 1
                                  ? true
                                  : false
                              }
                              rec_start_flag={
                                item?.recording?.[0]?.start_recording === 1
                                  ? true
                                  : false
                              }
                              rec_end_flag={
                                item?.recording?.[0]?.soft_end_recording === 0
                                  ? true
                                  : false
                              }
                              media_recording={
                                item?.media_recording?.length > 0
                                  ? item?.media_recording
                                  : undefined
                              }
                              description={item?.description}
                              category={item?.category}
                              other_count={item?.other_count}
                              user_views_count={item?.user_views_count}
                              ext={
                                item?.media_recording?.length > 0
                                  ? item?.media_recording?.[0]?.["metadata"]?.[
                                      "ext"
                                    ]
                                  : undefined
                              }
                            />
                          </div>
                        </Grid>
                      ))}
                </div>
                {(rtData?.data?.length === 0 || rtData?.length === 0) && (
                  <>
                    <div className="my-5 container text-center">
                      <div className="my-5 container-fluid text-center">
                        <img
                          src={globalImages.si_search_rt}
                          alt=""
                          style={{ width: "30%" }}
                          className="mt-5"
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </ThirdTabContainer>
        )}
      </div>

      <PreloginComp
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        icon={
          <img src={globalImages.si_th_menu_a} alt="" width={40} height={40} />
        }
        title={"For searching, Login or sign up to Khul Ke"}
        description={""}
      />
    </MyContentCard>
  );
};

export default SearchContent;
