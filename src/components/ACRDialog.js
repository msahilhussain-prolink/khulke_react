import React, { useState, useEffect } from "react";
import { REACT_APP_BASE_URL_FOR_ROUNDTABLE } from "../constants/env";
import axios from "axios";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AppBar from "@mui/material/AppBar";
import styled from "styled-components";
import Spinner from "./Spinner";
import { auto_login_continue } from "../utils/utils";
import Nothing from "./common/Noting";
import CommonPerson from "./common/CommonPerson";
import { allWords } from "../App";

const ACRDialog = ({ data }) => {
  const MyContentCard = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 4px;
    padding: 0rem;
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
        /* display: none; */
      }
    }
  `;

  const [selectedTab, setSelectedTab] = useState(0);
  const FirstTabContainer = styled.div``;
  const SecondTabContainer = styled.div``;
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState([]);
  const [accepted_limit, setAcceptedLimit] = useState(10);
  const [accepted_skip, setAcceptedSkip] = useState(0);
  const [rejected, setRejected] = useState([]);
  const [rejected_limit, setRejectedLimit] = useState(10);
  const [rejected_skip, setRejectedSkip] = useState(0);

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 50;
    if (bottom && !loading) {
      if (selectedTab === 0) {
        setAcceptedLimit(accepted_limit + 10);
        setAcceptedSkip(accepted_skip + 10);
      } else {
        setRejectedLimit(rejected_limit + 10);
        setRejectedSkip(rejected_skip + 10);
      }
    }
  };

  function getAudience() {
    setLoading(true);
    let local_limit = 0;
    let local_skip = 0;
    let local_type = "accept";
    if (selectedTab === 0) {
      local_limit = accepted_limit;
      local_skip = accepted_skip;
    } else {
      local_limit = rejected_limit;
      local_skip = rejected_skip;
      local_type = "reject";
    }

    const config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/get-accept-reject-audience/${data._id}`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
      },
      data: {
        limit: local_limit,
        skip: local_skip,
        type: local_type,
      },
    };

    axios(config)
      .then(async function (response) {
        if (response.status === 200) {
          if (selectedTab === 0) {
            setAccepted(response.data.data);
          } else {
            setRejected(response.data.data);
          }
        }
      })
      .catch(async (e) => {
        const response = e.response;
        if (!response) return;
        if (response.status === 401) {
          return await auto_login_continue(getAudience);
        }
      });
    setLoading(false);
  }
  useEffect(() => {
    getAudience();
  }, [selectedTab]);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
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
          aria-label="RoundTable ARC"
        >
          <Tab
            label="Accepted"
            style={{
              width: "50%",
              backgroundColor: "transparent",
              textTransform: "capitalize",
              color: "black",
              fontWeight: "bold",
              borderBottom: "1px solid lightgray",
            }}
          />
          <Tab
            label="Rejected"
            style={{
              width: "50%",
              backgroundColor: "transparent",
              textTransform: "capitalize",
              color: "black",
              fontWeight: "bold",
              borderBottom: "1px solid lightgray",
            }}
          />
        </Tabs>
      </AppBar>
      <div className="event_container" onScroll={handleScroll}>
        {selectedTab === 0 && (
          <FirstTabContainer>
            <div className="mb-5 pt-2">
              {accepted.length > 0 &&
                accepted.map((item) => {
                  return <CommonPerson key={item} person={item} />;
                })}
            </div>
            {accepted.length === 0 && <Nothing msg={allWords.misc.livert.nothingToShow} />}
            {loading && <Spinner />}
          </FirstTabContainer>
        )}
        {selectedTab === 1 && (
          <SecondTabContainer>
            <div className="mb-5 pt-2">
              {rejected.length > 0 &&
                rejected.map((item) => {
                  return <CommonPerson key={item} person={item} />;
                })}
            </div>
            {rejected.length === 0 && <Nothing msg={allWords.misc.livert.nothingToShow} />}
            {loading && <Spinner />}
          </SecondTabContainer>
        )}
      </div>
    </MyContentCard>
  );
};

export default ACRDialog;
