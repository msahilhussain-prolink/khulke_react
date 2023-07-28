import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { performUserActionData } from "../../redux/actions/userActionsAction";
import AccountLeftSideBar from "../../components/AccountLeftsideBar";
import { REACT_APP_BASE_URL_FOR_USER } from "../../constants/env";
import axios from "axios";
import Spinner from "../../components/Spinner";
import Back from "../../assets/icons/back.svg";
import { Link, useNavigate } from "react-router-dom";
import SettingsHeader from "../../components/SettingsHeader";
import {
  MainDiv,
  LeftDiv,
  RightDiv,
  CenterDiv,
  Title,
  CardContainer,
} from "./style";
import { auto_login_continue, moengageEvent } from "../../utils/utils";
import Header from "../../components/Header";
import { MetaTagsGenerator } from "../../utils/MetaTagsGenerator";
import { metaData } from "../../constants/StaticPagesMetaTags";
import UserProfile from "../../components/UserProfile";
import { allWords } from "../../App"

const Blocked_Accounts = () => {
  const dispatch = useDispatch();

  const [blocked_users, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const getBlockedUsers = () => {
    var config = {
      method: "get",
      url: `${REACT_APP_BASE_URL_FOR_USER}/setting/get-blocked-accounts/`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
      },
    };

    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setBlockedUsers(response.data.data[0].users);
          moengageEvent("View Page", "ALL", {
            URL: `${window.location.origin}/${window.location.pathname}`,
          });
        }
        setLoading(false);
      })
      .catch(async function (error) {
        const res = error.response;
        if (!res) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.status === 401) {
          return await auto_login_continue(getBlockedUsers);
        }
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    getBlockedUsers();
  }, []);
  const unblockUser = (handle) => {
    let data = {
      handle: handle,
      type: "unblock",
    };
    dispatch(performUserActionData(data));
    let temp = [...blocked_users];
    temp = temp.filter((item) => item.username !== handle);
    setBlockedUsers(temp);
  };

  return (
    <>
      <MetaTagsGenerator metaTags={metaData["blocked-accounts"]} />
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
            <SettingsHeader page_header="Blocked Users" />
            <CardContainer>
              <div className="user_suggestion_container">
                {error && (
                  <div className="container-fluid text-center">
                    <p className="warn-text"></p>
                  </div>
                )}
                {loading && <Spinner />}
                {blocked_users?.length > 0 ? (
                  blocked_users?.map((item, key) => {
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
                            unblockUser(item.username);
                          }}
                          className="follow-button-small"
                        >
                          {allWords.misc.pages.blocked.Unblock}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="container text-center mt-5">
                    <h6 className="text-success"> {allWords.misc.pages.blocked.nouserblock}</h6>
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

export default Blocked_Accounts;
