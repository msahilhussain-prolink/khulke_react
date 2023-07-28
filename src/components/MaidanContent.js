import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShepherdTourContext } from "react-shepherd";

// Material UI
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import { ClickAwayListener, IconButton } from "@mui/material";
import styled from "styled-components";

// Constants
import {
  POST_API_BASE_URL,
  REACT_APP_BASE_URL_CLOUDFRONT,
  REACT_APP_BASE_URL_FOR_NOTIFICATION,
  REACT_APP_DEVICE_TYPE,
} from "../constants/env";

// Assets
import recentIcon from "./../assets/icons/Group 1053.svg";
import RoundTableIconActive from "./../assets/icons/RoundTable_icon_active.svg";
import plus_circle from "./../assets/icons/plus-circle.svg";

// Components
import PreloginComp from "./PreLoginComp";
import RTListingCard from "./RTListingCard";
import Spinner from "./Spinner";
import SearchInput from "./common/SearchInput";

// Styles
import "../pages/RoundTable/Create/style.css";
import "./RTListingCard/style.css";
import { SearchItem, Wrapper } from "./RightSideBar/style";

// Utils
import { allWords } from "../App";
import { auto_login_continue, moengageEvent } from "../utils/utils";

// Redux
import { userProfileData } from "../redux/actions/profileAction/userProfileAction";
import ErrorDiv from "./ResponseData/ErrorDiv";
import HasMore from "./ResponseData/HasError";
import NoTables from "./ResponseData/NoTable";
import { globalImages } from "../assets/imagesPath/images";
import moment from "moment";
import { createEditRoundtableInitialize } from "../redux/actions/createEditRoundtable";
import { Grid } from "@material-ui/core";
import MineRT from "./RTListing/MineRT";
import GetBorderColor from "../utils/RTListType";
import ThumbnailImage from "./ThumbnailImage";
import { getMineRTListData } from "../redux/actions/rtListingAction/mineRtAction";

const MyContentCard = styled.div`
  width: auto;
  height: 100%;
  border-radius: 4px;
  padding: 0rem;
  margin-top: 1rem;
  /* maidaan comment */
  overflow: hidden;
  /* border: 1px solid red; */

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

  .mTitle {
    padding-left: 20px;
    margin-right: 1.5rem;
  }

  .event_container {
    width: 100%;
    height: 92%;
    // overflow: hidden;
    overflow: auto;
    padding-right: 8px;
    ::-webkit-scrollbar {
      width: 5px;
      padding-left: 5px;
      /* color: #141414; */
    }
  }
  @media screen and (max-width: 768px) {
    .event_container {
      width: 100%;
    }
    margin-top: 5px;
  }
`;

const TabContainer = styled.div`
  margin-bottom: 20%;
`;

const MaidanContent = ({
  selectedTab,
  setSelectedTab,
  rtData,
  setRTData,
  loading,
  setLoading,
  has_error,
  setHasError,
  error_message,
  skip,
  setSkip,
  hasMore,
  setHasMore,
  setCallingApi,
  callingApi,
}) => {
  const handleChange = (event, newValue) => {
    setRTData((prev) => ({
      ...prev,
      [selectedTab]: [],
    }));
    setLoading(true);
    setHasError(false);
    setSkip(0);
    setHasMore(true);
    setCallingApi(false);
  };

  // vars
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tour = useContext(ShepherdTourContext);

  const userData = useSelector((state) => state.user_profile.data);
  const liveState = useSelector((state) => state.liveRTState);

  let current_user = JSON.parse(
    localStorage.current_user || localStorage.anonymous_user
  );
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const shouldTourContinue = urlParams.get("shtc");

  const [newOpen, setNewOpen] = useState(false);

  useEffect(() => {
    dispatch(userProfileData({ username: current_user?.["username"] }));
    dispatch(getMineRTListData());
  }, []);

  useEffect(() => {
    if (liveState?.rt_flag?.rt_flag == "LIVE OVER") {
      const data = rtData?.filter(
        (item) => liveState?.rt_flag?.rt_id !== item?._id
      );
      setRTData((prev) => ({
        ...prev,
        [selectedTab]: data,
      }));
    }
  }, [liveState?.rt_flag]);

  useEffect(() => {
    if (shouldTourContinue == "t") {
      tour?.show(7, true);
    } else if (shouldTourContinue == "tc") {
      if (
        userData?.["data"]?.["self_user"]?.["product_walkthrough"]?.[
          "is_interested"
        ] === true
      ) {
        if (
          userData?.["data"]?.["self_user"]?.["product_walkthrough"]?.[
            "walkthrough_step"
          ] > 6
        ) {
          tour?.show(
            userData?.["data"]?.["self_user"]?.["product_walkthrough"]?.[
              "walkthrough_step"
            ],
            true
          );
        }
      }
    }
  }, [userData, shouldTourContinue]);

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 50;

    if (bottom && !loading && !callingApi && selectedTab !== 0) {
      setSkip(skip + 12);
    }
  };

  let userdata =
    JSON.parse(localStorage.getItem("current_user")) ||
    JSON.parse(localStorage.getItem("anonymous_user"));

  let config = {
    method: "get",
    url: `${POST_API_BASE_URL}/details-paginate?type=following&skip=0&username=${userdata.username}`,
    headers: {
      "device-type": REACT_APP_DEVICE_TYPE,
      "user-id": userdata._id,
    },
  };

  const [followingUn, setFollowingUn] = useState([]);
  let localfollowArr = [];

  async function callFollowing() {
    let data = await axios(config);
    setFollowingUn(data.data?.data);
  }

  useEffect(() => {
    callFollowing();
  }, []);

  // filtering function
  followingUn?.length > 0 &&
    followingUn?.map((i) => localfollowArr?.push(i.username));
  localStorage.setItem("followings", localfollowArr);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  //states and effects for search input for anonymous user only
  const [recent_searches, setRecentSearches] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("khulke_recents")) {
      let temp_search = JSON.parse(localStorage.getItem("khulke_recents"));
      setRecentSearches(temp_search.reverse());
    }
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      if (!localStorage.getItem("khulke_recents")) {
        localStorage.setItem(
          "khulke_recents",
          JSON.stringify([e.target.value])
        );
      } else {
        let recents = JSON.parse(localStorage.getItem("khulke_recents"));
        recents.push(e.target.value);
        localStorage.setItem("khulke_recents", JSON.stringify(recents));
      }
      moengageEvent("Search", "RoundTable", { "Search Text": e.target.value });
      navigate(`/search?search_term=${e.target.value}`, { replace: true });
    }
  };

  useEffect(() => {
    handleChange();
  }, [selectedTab]);

  const [rtCount, setRtCount] = useState(0);

  const getNotificationCount = () => {
    const config = {
      method: "get",
      url: `${REACT_APP_BASE_URL_FOR_NOTIFICATION}/count`,
      headers: {
        Authorization: `Bearer ${localStorage?.access}`,
      },
    };
    if (localStorage?.access) {
      axios(config)
        .then(async function (response) {
          setRtCount(response?.data?.data?.[0]?.["roundtable"]);
        })
        .catch(async function (error) {
          const response = error.response;
          if (!response) return;
          if (response.status === 401) {
            return await auto_login_continue(getNotificationCount);
          }
        });
    }
  };

  const clearNotificationCount = (type_url) => {
    const FormData = require("form-data");
    const data = new FormData();
    data.append("type", type_url.toUpperCase());

    const config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_NOTIFICATION}/update`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
      },
      data: data,
    };

    axios(config)
      .then((res) => {
        if (type_url === "roundtable") {
          setRtCount(res?.data?.data?.[0]?.["total_count"]);
        }
      })
      .catch(async (e) => {
        const res = e.response;
        if (!res) return;
        if (res.status === 401) {
          return await auto_login_continue(() =>
            clearNotificationCount(type_url)
          );
        }
        return res;
      });
  };

  useEffect(() => {
    if (localStorage?.current_user && !localStorage?.anonymous_user)
      getNotificationCount();
  }, []);

  const newRT = () => {
    if (!localStorage.current_user && localStorage.anonymous_user) {
      setModalOpen(true);
      setModalMsg("This will be available only for registered users.");
      return;
    }

    dispatch(
      createEditRoundtableInitialize({
        rtType: allWords.rt.label2.toLowerCase(),
        rtPlayType: allWords.rt.opt1.toLowerCase(),
        rtNature: allWords.createRT.optPub.toLowerCase(),
        rtTopic: "",
        rtDescription: "",
        dateValue: moment(new Date()).add(30, "minutes"),
        timeValue: moment(new Date()).add(30, "minutes"),
        urlRtId: null,
        wipRtId: null,
        durationHr: {
          label: `0 ${allWords.misc.livert.h}`,
          value: "0",
        },
        durationMin: {
          label: `30 ${allWords.misc.livert.m}`,
          value: "30",
        },
        durationSec: {
          label: `0 ${allWords.misc.livert.m}`,
          value: "0",
        },
        totalDur: "",
        schedule: true,
        rtImage: "",
        rtImageUrl: "",
        rtImgDel: false,
        logo1: "",
        logo2: "",
        logo3: "",
        intro: "",
        outro: "",
        logo1Del: false,
        logo2Del: false,
        logo3Del: false,
        introDel: false,
        outroDel: false,
        recording: "",
        owner: "",
        moderator: "",
        moderatorIntroduction: "",
        panelists: [],
        rtDoc: "",
        invitesList: {},
        user_data: [],
        phoneList: [],
        emailList: [],
        created_at: "",
        m_type: false,
        backdropFlag: false,
        inviteFollower: false,
        inviteFollowing: false,
        user_id: [],
        emails: [],
        phones: [],
        anonymous: false,
        rtThumbnailPreview: null,
        logo1Preview: null,
        logo2Preview: null,
        logo3Preview: null,
        introPreview: null,
        outroPreview: null,
        recordingPreview: null,
        docPreview: null,
        isDocPdf: false,
        arrayId: [],
      })
    );

    navigate("/roundtable/create");
  };
  
  return (
    <MyContentCard rtData={rtData}>
      <div className="d-flex justify-content-between mTitle">
        <p
          style={{
            fontSize: "1.875rem",
            fontWeight: "bold",
            paddingTop: "8px",
          }}
        >
          {allWords.rt.rt}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <IconButton
            style={{ marginTop: "-7px" }}
            onClick={() => {
              clearNotificationCount("roundtable");

              navigate("/roundtable/notifications");
            }}
            hidden={
              !localStorage?.current_user && localStorage.anonymous_user
                ? true
                : false
            }
          >
            <NotificationsActiveOutlinedIcon
              style={{ fontSize: "2rem", marginTop: "10px" }}
            />
            <small
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50px",
                textAlign: "center",
                verticalAlign: "middle",
                lineHeight: "30px",
                backgroundColor: "#d53512",
                color: "#fff",
                fontSize: "12px",
                fontWeight: "800",
                marginLeft: "-17px",
                marginTop: "-12px",
              }}
              hidden={rtCount === 0 ? true : false}
            >
              {rtCount}
            </small>
          </IconButton>
          <div className="maidan-content-header">
            <div className="newStep">
              <button
                onClick={newRT}
                className="follow-button-small"
                style={{ width: "fit-content", marginTop: "0rem !important" }}
              >
                <img
                  alt=""
                  src={plus_circle}
                  height="20px"
                  width="20px"
                  style={{
                    padding: "0px",
                    margin: "-2px 0px 0px 0px",
                    display: "inline",
                  }}
                />
                &nbsp;
                <span style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                  {allWords.rt.rtNewBtn}
                </span>
              </button>
            </div>
            <ClickAwayListener
              onClickAway={() => {
                setIsOpen(false);
              }}
            >
              <div
                style={{
                  marginLeft: "10px",
                  position: "relative",
                }}
              >
                <SearchInput
                  label="maidan"
                  className="barSearch"
                  onKeyDown={(e) => {
                    handleSearch(e);
                  }}
                  onClick={() => setIsOpen(true)}
                />
                {isOpen && (
                  <>
                    {recent_searches && recent_searches.length > 0 && (
                      <Wrapper>
                        <h4>Recent Search</h4>
                        {recent_searches.map((item) => {
                          return (
                            <SearchItem
                              onClick={() => {
                                navigate(`/search?search_term=${item}`, {
                                  replace: true,
                                });
                              }}
                            >
                              <img src={recentIcon} alt="" />
                              <span
                                style={{
                                  visibility: "hidden",
                                  userSelect: "none",
                                }}
                              >
                                a
                              </span>
                              <small style={{ fontSize: "18px" }}>{item}</small>
                            </SearchItem>
                          );
                        })}
                      </Wrapper>
                    )}
                  </>
                )}
              </div>
            </ClickAwayListener>
          </div>
        </div>
      </div>
      <div className="rtTabStep">
        <button
          className={selectedTab === 3 ? "RTtabButtonActive" : "RTtabButton"}
          // style={{ width: "auto" }}
          onClick={() => {
            if (!window.location.pathname.includes("all")) {
              setRTData((prev) => ({
                ...prev,
                [selectedTab]: [],
              }));
            }
            navigate("/roundtable/all");
          }}
        >
          {allWords.rt.label1}
        </button>{" "}
        {/* &emsp; &emsp; */}
        <button
          className={
            selectedTab === 1 ? "RTtabButtonLiveActive" : "RTtabButtonLive"
          }
          // style={{ width: "5rem" }}
          onClick={() => {
            if (!window.location.pathname.includes("live")) {
              setRTData((prev) => ({
                ...prev,
                [selectedTab]: [],
              }));
            }
            navigate("/roundtable/live");
          }}
        >
          {allWords.rt.label2}
        </button>
        {/* &emsp;&emsp; */}
        <button
          className={selectedTab === 2 ? "RTtabButtonActive" : "RTtabButton"}
          onClick={() => {
            if (!window.location.pathname.includes("upcoming")) {
              setRTData((prev) => ({
                ...prev,
                [selectedTab]: [],
              }));
            }
            navigate("/roundtable/upcoming");
          }}
        >
          {allWords.rt.label3}
        </button>
        {/* &emsp;&emsp; */}
        <button
          className={selectedTab === 0 ? "RTtabButtonActive" : "RTtabButton"}
          onClick={() => {
            if (!localStorage.current_user && localStorage.anonymous_user) {
              setModalOpen(true);
              setModalMsg(allWords.misc.pages.prelog);
              return;
            }

            if (!window.location.pathname.includes("mine")) {
              setRTData((prev) => ({
                ...prev,
                [selectedTab]: [],
              }));
            }
            navigate("/roundtable/mine");
          }}
        >
          {allWords.rt.label4}
        </button>
      </div>
      <div className="event_container" onScroll={handleScroll}>
        <br />
        {selectedTab === 0 && (
          <>
            <TabContainer>
              {loading ? <Spinner /> : <MineRT rtData={rtData} />}
              {rtData?.length === 0 && !has_error && !loading && (
                <NoTables img={globalImages.si_rt_empty} />
              )}
              {has_error && <ErrorDiv error_message={error_message} />}
            </TabContainer>
          </>
        )}
        {selectedTab === 1 && (
          <TabContainer>
            {loading ? (
              <Spinner />
            ) : (
              <Grid container>
                <h1 id="page-title" style={{ display: "none" }}>
                  {allWords.misc.pindiscussion}
                </h1>
                {rtData &&
                  rtData.length > 0 &&
                  rtData.map((item) => (
                    <Grid
                      item
                      xl={3}
                      lg={4}
                      sm={6}
                      xs={12}
                      style={{ padding: "5px" }}
                      key={item?._id}
                    >
                      <RTListingCard
                        broadcast_destination={item.broadcast_destination}
                        listingDisplay
                        displayValue={"space-between"}
                        speakers={item?.speakers}
                        moderator={item?.moderator}
                        timestamp={item?.time}
                        rt_details={item}
                        style={GetBorderColor(item)}
                        req_visitor_count={item?.req_visitor_count}
                        cardfooter
                        rt_nature={item?.open_to_all}
                        upcoming={item?.upcoming_flag}
                        past={item?.happened_flag}
                        live={item?.active_flag}
                        viewer_count={
                          item?.active_flag === true
                            ? item?.["viewer_count"]
                            : ""
                        }
                        join_count={
                          item?.happened_flag === true
                            ? item?.["join_count"]
                            : 0
                        }
                        was_invited={item?.was_invited}
                        rt_type={item.r_type}
                        request_status={
                          item?.invite_requested || item.was_invited
                        }
                        rt_id={item?._id}
                        owner_details={item?.owner}
                        title={item?.name}
                        cover_img={
                          item?.media?.length > 0
                            ? `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${item?.owner?.user_id}/roundtable/${item?.["_id"]}/profile/${item?.["media"]?.[0]?.["metadata"]?.["tempFilename"]}`
                            : undefined
                        }
                        rec_owner_flag={
                          item?.recording?.[0]?.owner_flag === 1 ? true : false
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
                            : null
                        }
                        description={item?.description}
                        category={item?.category}
                        ext={
                          item?.media_recording?.length > 0
                            ? item?.media_recording?.[0]?.["metadata"]?.["ext"]
                            : null
                        }
                        user_type={item?.moderator?.user_type}
                      />
                    </Grid>
                  ))}
              </Grid>
            )}
            {rtData?.length === 0 && !has_error && !loading && (
              <NoTables img={globalImages.si_rt_empty} />
            )}
            {has_error && <ErrorDiv error_message={error_message} />}
            <HasMore />
          </TabContainer>
        )}
        {selectedTab === 2 && (
          <TabContainer>
            {loading ? (
              <Spinner />
            ) : (
              <Grid container>
                <h1 id="page-title" style={{ display: "none" }}>
                  {allWords.misc.comingrt}
                </h1>
                {rtData &&
                  rtData.length > 0 &&
                  rtData?.map((item) => (
                    <Grid
                      item
                      xl={3}
                      lg={4}
                      sm={6}
                      xs={12}
                      style={{ padding: "5px" }}
                      key={item?._id}
                    >
                      <RTListingCard
                        listingDisplay
                        broadcast_destination={item.broadcast_destination}
                        displayValue={"space-between"}
                        style={GetBorderColor(item)}
                         rt_id={item._id}
                        cardImg
                        cover_img={
                          item?.media?.length > 0
                            ? `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${item?.owner?.user_id}/roundtable/${item?.["_id"]}/profile/${item?.["media"]?.[0]?.["metadata"]?.["tempFilename"]}`
                            : undefined
                        }
                        mod_cover_img={
                          item?.media?.length > 0
                            ? `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${item?.owner?.user_id}/roundtable/${item?.["_id"]}/profile/${item?.["media"]?.[0]?.["metadata"]?.["tempFilename"]}`
                            : undefined
                        }
                        title={item.name}
                        timestamp={item.time}
                        rt_type={item.r_type}
                        rt_nature={item.open_to_all}
                        invitees_count={
                          item?.["invite_count"] - item?.["rejected_count"]
                        }
                        moderator={item?.moderator}
                        speakers={item?.speakers}
                        reminder_status={item.reminder_set || item.was_invited}
                        bodyRow
                        cardCenter
                        centerRow
                        upcoming
                        cardHr
                        cardfooter
                        request_status={
                          item?.invite_requested || item.was_invited
                        }
                        was_invited={item?.was_invited}
                        request_access={
                          !item.owner_flag ||
                          !item.moderator_flag ||
                          !item.speaker_flag
                        }
                        invitation_code={item?.roundtable_code}
                        owner_details={item?.owner}
                        req_visitor_count={item?.req_visitor_count}
                        rec_owner_flag={
                          item?.recording?.[0]?.owner_flag === 1 ? true : false
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
                        rt_details={item}
                        media_recording={null}
                        description={item?.description}
                        category={item?.category}
                        ext={
                          item?.media_recording?.length > 0
                            ? item?.media_recording?.[0]?.["metadata"]?.["ext"]
                            : null
                        }
                        user_type={item?.moderator?.user_type}
                      />
                    </Grid>
                  ))}
              </Grid>
            )}
            {rtData?.length === 0 && !has_error && !loading && (
              <NoTables img={globalImages.si_rt_empty} />
            )}
            {has_error && <ErrorDiv error_message={error_message} />}
            <HasMore />
          </TabContainer>
        )}

        {selectedTab === 3 && (
          <TabContainer>
            {loading ? (
              <Spinner />
            ) : (
              <Grid container>
                <h1 id="page-title" style={{ display: "none" }}>
                  Check Out Engaging RoundTables
                </h1>
                {rtData &&
                  rtData.length > 0 &&
                  rtData
                    ?.sort((a, b) => {
                      return Number(b.active_flag) - Number(a.active_flag);
                    })
                    ?.map((item) => (
                      <Grid
                        item
                        xl={3}
                        lg={4}
                        sm={6}
                        xs={12}
                        style={{ padding: "5px" }}
                        key={item?._id}
                        >
                    
                        <RTListingCard
                          broadcast_destination={item.broadcast_destination}
                          listingDisplay
                          displayValue={"space-between"}
                          style={GetBorderColor(item)}
                            rt_id={item?._id}
                          cardImg
                          cover_img={ThumbnailImage(item)}
                          mod_cover_img={ThumbnailImage(item)}
                          title={item?.name}
                          timestamp={item?.time}
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
                              : null
                          }
                          description={item?.description}
                          category={item?.category}
                          user_views_count={item?.user_views_count}
                          ext={
                            item?.media_recording?.length > 0
                              ? item?.media_recording?.[0]?.["metadata"]?.[
                                  "ext"
                                ]
                              : null
                          }
                          user_type={item?.moderator?.user_type}
                        />
                      </Grid>
                    ))}
              </Grid>
            )}
            {rtData?.length === 0 && !has_error && !loading && (
              <NoTables img={globalImages.si_rt_empty} />
            )}
            {has_error && <ErrorDiv error_message={error_message} />}
            <HasMore />
          </TabContainer>
        )}
      </div>
      <PreloginComp
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        icon={<img src={RoundTableIconActive} alt="" width={40} height={40} />}
        title={modalMsg}
        description={""}
      />
    </MyContentCard>
  );
};

export default MaidanContent;
