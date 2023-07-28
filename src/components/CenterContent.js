import React, { useState, useEffect } from "react";
import ReactPlaceholder from "react-placeholder";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import axios from "axios";

// Styles
import "react-placeholder/lib/reactPlaceholder.css";
import { REACT_APP_BASE_URL_FOR_NOTIFICATION } from "../constants/env";

// Constants
import { metaData } from "../constants/StaticPagesMetaTags";

// Material UI
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AppBar from "@mui/material/AppBar";

// Components
import NetworkCard from "./NetworkCard";
import PostCardPlaceHolder from "../components/PostCardPlaceholder";
import Post from "../components/Post";
import Spinner from "../components/Spinner";

// Utils
import { MetaTagsGenerator } from "../utils/MetaTagsGenerator";
import { auto_login_continue, moengageEvent } from "../utils/utils";
import ToastHandler from "../utils/ToastHandler";

// Apis
import { getPost } from "../apis/postApi";

// Lang
import { allWords } from "../App";
import { PATHS } from "../utils/Constant/path";
import { globalImages } from "../assets/imagesPath/images";
import InteractionContainer from "../pages/Notification/CentralContent/InteractionContainer";
import NoNewNotification from "./NoNewNotification";
import { interactionDispatch } from "../redux/actions/interactionNotificationAction";

const MyContentCard = styled.div`
  width: 100%;
  /* max-width: 768px; */
  height: 100%;
  border-radius: 4px;
  padding: 0rem;
  /* border: 1px solid red; */
  .tab_container {
    padding: 1rem;
    overflow: hidden!important
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
    overflow: hidden;
    overflow-y: scroll;
    ::-webkit-scrollbar {
      width: 5px;
      margin-right: 2px;
      /* display: none; */
    }
  }
`;

const FirstTabContainer = styled.div``;

const SecondTabContainer = styled.div``;

const CenterContent = ({ selectedTab }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const [limit, setLimit] = useState(20);
  let interactionNotification = []
  interactionNotification = useSelector((state) => state.interaction);

  const [page, setPage] = useState(1);
  const [callingApi, setCallingApi] = useState(true);

  useEffect(() => {
    dispatch(interactionDispatch({ page: page, limit: limit }));
  }, [])

  useEffect(() => {
    if (interactionNotification?.data?.data?.length) {
      setCallingApi(false);
    }
  }, []);

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 50;
    if (bottom) {
      if (selectedTab === 0) {
        setLimit(limit + 20);
        setCallingApi(false);
      }
    }
  };
  const [interactionCount, setInteractionCount] = useState(0);
  const [networkCount, setNetworkCount] = useState(0);

  // TODO: Translate to redux
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
          setInteractionCount(
            response?.data?.data?.[0]?.["interaction"] +
            response?.data?.data?.[0]?.["reaction"]
          );
          setNetworkCount(response?.data?.data?.[0]?.["new_followers"]);
        })
        .catch(async function (error) {
          const response = error.response;
          if (!response) return;
          if (response.status === 401) {
            return await auto_login_continue();
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
        setInteractionCount(res?.data?.data?.[0]?.["total_count"]);
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
    if (localStorage?.current_user && !localStorage?.anonymous_user) {
      getNotificationCount();
      moenFunc();
    }
  }, [limit]);


  function moenFunc() {
    if (selectedTab === 0) {
      moengageEvent("View Page", "ALL", {
        URL: `${window.location.origin}/${window.location.pathname}`,
      });
    }
  }

  const IndexToUrl = {
    0: "interaction",
    1: "network",
  };

  return (
    <MyContentCard>
      <MetaTagsGenerator
        metaTags={metaData[`notifications/${IndexToUrl[selectedTab]}`]}
      />
      <AppBar
        position="static"
        elevation={0}
        style={{ backgroundColor: "transparent" }}
      >
        <Tabs
          value={selectedTab}
          aria-label="simple tabs example"
          style={{ width: "100%" }}
        >
          <Tab
            onClick={() => {
              moengageEvent("View Page", "ALL", {
                URL: `${window.location.origin}/${window.location.pathname}`,
              });
              clearNotificationCount("interaction");
              clearNotificationCount("reaction");

              navigate("/notifications/interaction");
            }}
            label={allWords.noti.interaction}
            icon={
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
                }}
                hidden={interactionCount === 0 ? true : false}
              >
                {interactionCount}
              </small>
            }
            iconPosition="end"
            style={{
              width: "50%",
              textTransform: "capitalize",
              borderBottom: "1px solid lightgray",
              color: selectedTab === 0 ? "black" : "#AEBDD3",
              fontWeight: "bold",
              maxWidth: "50%",
              // marginLeft: "20px",
              maxWidth: "50%",
            }}
          />
          <Tab
            onClick={() => {
              moengageEvent("View Page", "ALL", {
                URL: `${window.location.origin}/${window.location.pathname}`,
              });

              navigate("/notifications/network");
            }}
            label={allWords.noti.Net}
            icon={
              <small
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50px",
                  textAlign: "center",
                  verticalAlign: "middle",
                  lineHeight: "26px",
                  backgroundColor: "#d53512",
                  color: "#fff",
                  fontSize: "12px",
                }}
                hidden={networkCount === 0 ? true : false}
              >
                {networkCount}
              </small>
            }
            iconPosition="end"
            style={{
              width: "50%",
              textTransform: "capitalize",
              borderBottom: "1px solid lightgray",
              color: selectedTab === 1 ? "black" : "#AEBDD3",
              fontWeight: "bold",
              maxWidth: "50%",
            }}
          />
        </Tabs>
      </AppBar>
      <div className="event_container"
        onScroll={handleScroll}
      >
        {selectedTab === 0 && (
          <FirstTabContainer>
            <div>
              {!interactionNotification?.data?.data?.length ? (
                <div className="container text-center py-5 my-5">
                  <img
                    src={globalImages.si_notif_empty}
                    alt="empty-notification"
                    width={300}
                  />
                </div>
              ) : (
                <>
                  <InteractionContainer />
                  {callingApi && <Spinner />}
                </>
              )}
            </div>
          </FirstTabContainer>
        )}
        {selectedTab === 1 && (
          <SecondTabContainer>
            <NetworkCard setNetworkCount={setNetworkCount} />
          </SecondTabContainer>
        )}
      </div>
    </MyContentCard>
  );
};

export default CenterContent;
