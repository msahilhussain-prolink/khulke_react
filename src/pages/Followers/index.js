import React, { useState, useEffect } from "react";

import "react-placeholder/lib/reactPlaceholder.css";

// **Components
// import LeftSideBar from "../../components/LeftSideBar";
import RightSideBar from "../../components/RightSideBar";
import ProfileHeader from "../../components/ProfileHeader";
import FollowContent from "../../components/FollowContent";
import {
  MainDiv,
  LeftDiv,
  CenterDiv,
  RightDiv,
} from "../../global_styles/global_style.js";
import { REACT_APP_BASE_URL_FOR_USER } from "../../constants/env";
import axios from "axios";
import { auto_login_continue } from "../../utils/utils";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";

const Followers = ({ selectedTab }) => {
  const url_search_params = new URL(window.location.href);

  const [followingUser, setListUser] = useState([]);
  const [limit, setLimit] = useState(15);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  let follow_tab = url_search_params.pathname.split("/")[3];
  let username =
    url_search_params.pathname.split("/")[2] ||
    JSON.parse(localStorage.current_user || localStorage.anonymous_user)?.[
    "username"
    ];

  useEffect(() => {
    if (!localStorage?.current_user && localStorage?.anonymous_user)
      return navigate("/roundtable/all", { replace: true });
  }, []);
  const getFollow = (tab) => {
    var data = JSON.stringify({
      username: username,
      type: tab,
      limit: limit,
      skip: 0,
    });
    let config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/get-all-followers-following/`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    setLoading(true);

    axios(config)
      .then(function (response) {
        let temp = [];
        if (response.status === 252) {
          return setListUser(temp);
        }
        if (response?.data?.["data"] !== undefined) {
          response?.data?.["data"]?.forEach((item) => {
            if (tab === "followers") {
              let structure = {
                user_id: item["_id"],
                profile_photo: null,
                username: item["username"],
                name: item["name"],
                is_following: item["you_follow"],
              };
              temp.push(structure);
            } else if (tab === "following") {
              let structure = {
                user_id: item["_id"],
                profile_photo: null,
                username: item["username"],
                name: item["name"],
                is_following: item["you_follow"],
              };
              temp.push(structure);
            }
          });
        }
        setListUser(temp);
        setLoading(false);
      })
      .catch(async (e) => {
        const res = e.response;
        if (!res) return setLoading(false);
        if (res.status === 401) {
          return await auto_login_continue(() => {
            getFollow(tab);
          });
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    if (follow_tab === "followings") {
      getFollow("following");
    } else {
      getFollow(follow_tab);
    }
  }, [limit]);

  useEffect(() => {
    if (follow_tab === "followings") {
      getFollow("following");
    } else {
      getFollow(follow_tab);
    }
  }, [selectedTab]);

  return (
    <>
      <Header />
      <MainDiv label="follow">
        <CenterDiv label="follow">
          <ProfileHeader
            acc_set
            edit_btn
            follow
            follow_btn
            p_loading={loading}
            p_error={false}
          />
          <FollowContent
            followingUser={followingUser}
            setCurated={setListUser}
            // sendSelectedTab={sendSelectedTab}
            limit={limit}
            setLimit={setLimit}
            loading={loading}
            getFollow={getFollow}
            follow_tab={follow_tab}
            username={username}
            selectedTab={selectedTab}
          />
        </CenterDiv>
        <RightDiv
          style={{ marginLeft: "10px", width: "360px", marginTop: "-0.4rem" }}
        >
          <RightSideBar showRoundtabaleContent />
        </RightDiv>
      </MainDiv>
    </>
  );
};

export default Followers;
