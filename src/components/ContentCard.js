import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  REACT_APP_BASE_URL_CLOUDFRONT,
  REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1,
  REACT_APP_BASE_URL_FOR_ROUNDTABLE,
} from "../constants/env";
import styled from "styled-components";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AppBar from "@mui/material/AppBar";
import rt_default_image from "./../assets/images/rt_default_hires.png";
import EventCardSmall from "./EventCardSmall";
import Spinner from "../components/Spinner";
import { auto_login_continue } from "../utils/utils";
import { allWords } from "../App";
import Nothing from "./common/Noting";
import NoTables from "./ResponseData/NoTable";

const MyContentCard = styled.div`
  width: 100%;
  height: 26rem;
  border-radius: 10px;
  border: 1px solid #e4e9f0;
  padding: 12px 1rem;
  padding: 1rem;
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

  .css-1aquho2-MuiTabs-indicator {
    background-color: #ed4d29 !important;
  }
  .css-1h9z7r5-MuiButtonBase-root-MuiTab-root.Mui-selected {
    color: black;
    font-weight: bold;
  }
  .event_container {
    margin-top: 0.5rem;
    width: 100%;
    height: 92%;
    ${({ hasData }) => hasData <= 1 && "overflow: hidden;"}
    ${({ hasData }) => hasData > 1 && "overflow-y: scroll;"}
    
    ::-webkit-scrollbar {
      width: 0.3em;
    }

    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    }

    ::-webkit-scrollbar-thumb {
      background-color: darkgrey;
      outline: 1px solid lightgray;
    }
  }
`;

const FirstTabContainer = styled.div``;

const SecondTabContainer = styled.div``;

const ContentCard = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const [limit, setLimit] = useState(10);
  const [rtData, setRTData] = useState(null);
  const [rtLoading, setRTLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const skip = 0;

  useState(() => {
    paginateRT();
  }, [limit, skip]);

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 50;
    if (bottom) {
      setLimit(limit + 10);
    }
  };

  async function paginateRT() {
    let access = null;

    const anonymous_user = JSON.parse(localStorage.getItem("anonymous_user"));

    access = localStorage.access || anonymous_user.token;

    let tab_hash = {
      0: "active",
      1: "upcoming",
    };
    let data = {
      type: tab_hash[selectedTab],
      limit: limit,
      skip: skip,
    };
    let config = {
      method: "post",
      url: `${
        anonymous_user
          ? REACT_APP_BASE_URL_FOR_ROUNDTABLE
          : REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1
      }${anonymous_user ? "/anonymous" : ""}/paginate/`,
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    };
    await axios(config)
      .then((res) => {
        if (res.status === 200) {
          setRTData(res.data);
        }
      })
      .catch((err) => {
        const res = err.response;

        if (res.status === 401) {
          return auto_login_continue(paginateRT);
        }
      });
    setRTLoading(false);
  }

  useEffect(() => {
    paginateRT();
  }, [selectedTab]);

  useEffect(() => {
    if (rtLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [rtLoading]);

  const hasData = rtData && rtData?.data?.length;
  return (
    <MyContentCard hasData={hasData}>
      <AppBar
        position="static"
        elevation={0}
        style={{ backgroundColor: "transparent" }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          aria-label="Your RoundTable Tabs"
        >
          <Tab
            label={allWords.profile.contentCardRight.opt1}
            style={{
              width: "50%",
              textTransform: "capitalize",
              color: selectedTab === 0 ? "black" : "#AEBDD3",
              fontWeight: "bold",
              borderBottom: "1px solid lightgray",
            }}
          />
          <Tab
            label={allWords.profile.contentCardRight.opt2}
            style={{
              width: "50%",
              textTransform: "capitalize",
              color: selectedTab === 1 ? "black" : "#AEBDD3",
              fontWeight: "bold",
              borderBottom: "1px solid lightgray",
            }}
          />
        </Tabs>
      </AppBar>
      <div className="event_container" onScroll={handleScroll}>
        {selectedTab === 0 && (
          <FirstTabContainer>
            {loading ? (
              <Spinner />
            ) : (
              <>
                {rtData &&
                  rtData?.data.map((item) => (
                    <div key={item?._id}>
                      <EventCardSmall
                        rt_id={item._id}
                        cardImg
                        cover_img={
                          item.media.length > 0
                            ? `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${item.owner.user_id}/roundtable/${item["_id"]}/profile/${item["media"][0]["metadata"]["tempFilename"]}`
                            : rt_default_image
                        }
                        title={item.name}
                        timestamp={item.time}
                        rt_type={item.r_type}
                        rt_nature={item.open_to_all}
                        viewer_count={item.viewer_count}
                        moderator={item.moderator}
                        speakers={item.speakers}
                        reminder_status={item.reminder_set || item.was_invited}
                        rt_details={item}
                        cardfooter
                        bottomHr
                        live
                        request_status={item.was_invited}
                        request_access={
                          !item.owner_flag ||
                          !item.moderator_flag ||
                          !item.speaker_flag
                        }
                        invitation_code={item.roundtable_code}
                        owner_details={item.owner}
                      />
                    </div>
                  ))}

                {rtData && rtData?.data?.length === 0 && (
                  <Nothing msg={allWords.profile.contentCardRight.noRT} />
                )}
              </>
            )}
          </FirstTabContainer>
        )}
        {selectedTab === 1 && (
          <SecondTabContainer>
            {loading ? (
              <Spinner />
            ) : (
              <>
                {rtData &&
                  rtData?.data?.map((item) => (
                    <div key={item?._id}>
                      <EventCardSmall
                        rt_id={item._id}
                        cardImg
                        cover_img={
                          item.media.length > 0
                            ? `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${item.owner.user_id}/roundtable/${item["_id"]}/profile/${item["media"][0]["metadata"]["tempFilename"]}`
                            : rt_default_image
                        }
                        title={item.name}
                        timestamp={item.time}
                        rt_type={item.r_type}
                        rt_nature={item.open_to_all}
                        viewer_count={item.viewer_count}
                        moderator={item.moderator}
                        speakers={item.speakers}
                        reminder_status={item.reminder_set || item.was_invited}
                        upcoming
                        cardfooter
                        bottomHr
                        request_status={item.was_invited}
                        request_access={
                          !item.owner_flag ||
                          !item.moderator_flag ||
                          !item.speaker_flag
                        }
                        invitation_code={item.roundtable_code}
                        owner_details={item.owner}
                      />
                    </div>
                  ))}
                {rtData && rtData?.data?.length === 0 && <NoTables />}
              </>
            )}
          </SecondTabContainer>
        )}
      </div>
    </MyContentCard>
  );
};

const MemoContentCard = React.memo(ContentCard);
export default MemoContentCard;
