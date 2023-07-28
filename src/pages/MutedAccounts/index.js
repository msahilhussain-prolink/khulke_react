import React, { useEffect, useState } from "react";
import AccountLeftSideBar from "../../components/AccountLeftsideBar";
import axios from "axios";
import { POST_API_BASE_URL, REACT_APP_DEVICE_TYPE } from "../../constants/env";
import { Link, useNavigate } from "react-router-dom";
import SettingsHeader from "../../components/SettingsHeader";
import { MainDiv, LeftDiv, RightDiv, CenterDiv, CardContainer } from "./style";
import Header from "../../components/Header";
import { MetaTagsGenerator } from "../../utils/MetaTagsGenerator";
import { metaData } from "../../constants/StaticPagesMetaTags";
import { moengageEvent } from "../../utils/utils";
import UserProfile from "../../components/UserProfile";
import { allWords } from "../../App"

const Muted_Accounts = () => {
  // eslint-disable-next-line
  const navigate = useNavigate();

  const [muted_users, setMutedUsers] = useState([]);

  const getMutedUsers = () => {
    var config = {
      method: "get",
      url: `${POST_API_BASE_URL}/settings/muted`,
      headers: {
        "device-type": REACT_APP_DEVICE_TYPE,
        "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
      },
    };

    axios(config)
      .then(function (response) {
        let temp = response.data.data["account_details"];
        setMutedUsers(temp);
        moengageEvent("View Page", "ALL", {
          URL: `${window.location.origin}/${window.location.pathname}`,
        });
      })
      .catch();
  };

  useEffect(() => {
    getMutedUsers();
  }, []);

  const unmuteUser = (username, user) => {
    var FormData = require("form-data");
    var data = new FormData();

    var config = {
      method: "post",
      url: `${POST_API_BASE_URL}/user/${username}/unmuted`,
      headers: {
        "device-type": REACT_APP_DEVICE_TYPE,
        "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
      },
      data: data,
    };

    axios(config)
      .then(() => {
        let temp = [...muted_users];
        temp = temp.filter((item) => item.username !== username);
        setMutedUsers(temp);
        moengageEvent("UnMuted Account", "User", {
          IdOth: user,
          UsernameOth: username,
        });
      })
      .catch();
  };


  return (
    <>
      <MetaTagsGenerator metaTags={metaData["muted-accounts"]} />
      <Header />
      <MainDiv>
        <LeftDiv>
          <AccountLeftSideBar />
        </LeftDiv>
        <CenterDiv>
          <div
            style={{
              marginLeft: window.screen.width <= 768 ? "0.5rem" : "",
            }}
          >
            <SettingsHeader page_header="Muted Accounts" />
            <CardContainer>
              <div className="user_suggestion_container">
                {muted_users.length > 0 ? (
                  muted_users.map((item, key) => {
                    return (
                      <div
                        className="d-flex justify-content-between mb-3 mt-2"
                        key={key}
                      >
                        <div className="d-flex">
                          <UserProfile
                            username={item.username}
                            className="avatar"
                          />
                          <small
                            style={{ visibility: "hidden", userSelect: "none" }}
                          >
                            ||
                          </small>
                          <div>
                            <strong>
                              <Link
                                style={{ textDecoration: "none" }}
                                to={`/profile/${item.username}/posts`}
                              >
                                {item.name}
                              </Link>
                            </strong>
                            <br />
                            <small className="text-muted">
                              <Link
                                style={{ textDecoration: "none" }}
                                to={`/profile/${item.username}/posts`}
                              >
                                @{item.username}
                              </Link>
                            </small>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            unmuteUser(item.username, item?.user);
                          }}
                          className="follow-button-small"
                        >
                          {allWords.misc.pages.unmute}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="container text-center mt-5">
                    <h6 className="text-success"> {allWords.misc.pages.nomute}</h6>
                  </div>
                )}
              </div>
            </CardContainer>
          </div>
        </CenterDiv>
        <RightDiv></RightDiv>
      </MainDiv>
    </>
  );
};

export default Muted_Accounts;
