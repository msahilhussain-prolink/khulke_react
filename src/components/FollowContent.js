import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Material UI
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AppBar from "@mui/material/AppBar";
import styled from "styled-components";

// Constants
import { REACT_APP_BASE_URL_FOR_USER } from "../constants/env";

// Components
import ListComponent from "./ListComponent";

// Utils
import { auto_login_continue, moengageEvent } from "../utils/utils";
import { allWords } from "../App";

const FirstTabContainer = styled.div``;

const SecondTabContainer = styled.div``;

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
const CardContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 0.3rem;
  margin-top: 0.5rem;
  overflow: hidden;

  .user_suggestion_container {
    width: 100%;
    height: 92%;
    margin-left: auto;
    margin-right: auto;
  }

  .p_container {
    color: #63779c;
    font-size: 13px;
    font-weight: 600;
  }
`;

const FollowContent = ({
  followingUser,
  setCurated,
  limit,
  setLimit,
  loading,
  getFollow,
  follow_tab,
  username,
  selectedTab,
}) => {
  const navigate = useNavigate();

  const follow_unfollow_driver = async (handle, type, id) => {
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
            IdOth: id,
            UsernameOth: handle,
          });

          let temp_solution = [...followingUser];
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
          return await auto_login_continue(() => {
            follow_unfollow_driver(handle, type);
          });
        }
      });
  };

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 30;

    if (bottom && !loading) {
      setLimit(limit + 15);
    }
  };

  return (
    <MyContentCard>
      <AppBar
        position="static"
        elevation={0}
        style={{ backgroundColor: "white" }}
        className="stickySticker"
      >
        <Tabs
          value={selectedTab}
          // onChange={handleChange}
          aria-label="simple tabs example"
          className="stickySticker"
        >
          <Tab
            onClick={() => {
              getFollow("following");
              navigate(`/profile/${username}/followings`);
            }}
            label={allWords.profile.btnFollowing}
            style={{
              width: "50%",
              textTransform: "capitalize",
              borderBottom: "1px solid lightgray",
              backgroundColor: "transparent",
              color: selectedTab === 0 ? "black" : "#AEBDD3",
              fontWeight: "bold",
            }}
          />
          <Tab
            onClick={() => {
              getFollow("followers");

              navigate(`/profile/${username}/followers`);
            }}
            label={allWords.profile.btnFollowers}
            style={{
              width: "50%",
              textTransform: "capitalize",
              borderBottom: "1px solid lightgray",
              backgroundColor: "transparent",
              color: selectedTab === 1 ? "black" : "#AEBDD3",
              fontWeight: "bold",
            }}
          />
        </Tabs>
      </AppBar>
      <div className="event_container" onScroll={handleScroll}>
        {selectedTab === 0 && (
          <FirstTabContainer>
            <CardContainer>
              {/* <p className="p_container"> Followers </p> */}
              <div className="user_suggestion_container">
                {followingUser.length > 0 ? (
                  <ListComponent
                    render_points={followingUser}
                    btn_fucntion={follow_unfollow_driver}
                    type={"follow"}
                    need_badge={false}
                    div_border={false}
                  />
                ) : (
                  <div className="text-center">
                    <small className="text-muted">
                      {allWords.misc.youarenotflw}
                    </small>
                  </div>
                )}
              </div>
            </CardContainer>
          </FirstTabContainer>
        )}
        {selectedTab === 1 && (
          <SecondTabContainer>
            <CardContainer>
              <div className="user_suggestion_container">
                {followingUser.length > 0 ? (
                  <ListComponent
                    render_points={followingUser}
                    btn_fucntion={follow_unfollow_driver}
                    type={"follow"}
                    need_badge={false}
                    div_border={false}
                  />
                ) : (
                  <div className="text-center">
                    <small className="text-muted">{allWords.misc.youhavenofollowers}</small>
                  </div>
                )}
              </div>
            </CardContainer>
          </SecondTabContainer>
        )}
      </div>
    </MyContentCard>
  );
};

export default FollowContent;
