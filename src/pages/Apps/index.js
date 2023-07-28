import React, { useEffect, useState } from "react";
import { REACT_APP_BASE_URL_FOR_USER } from "../../constants/env";
import AccountLeftSideBar from "../../components/AccountLeftsideBar";
import axios from "axios";
import Twitter from "../../assets/icons/Group 18355.svg";
import SettingsHeader from "../../components/SettingsHeader";
import Spinner from "../../components/Spinner";
import {
  MainDiv,
  LeftDiv,
  RightDiv,
  CenterDiv,
  TwitterTxt,
  TwitterDiv,
} from "./style";
import { auto_login_continue } from "../../utils/utils";
import { allWords } from "../../App";

const ConnectApps = () => {
  const [tw_status, setTWStatus] = useState(false);
  const [se_message_text, setSEMessageText] = useState("");
  const current_user = JSON.parse(localStorage.getItem("current_user"));
  useEffect(() => {
    try {
      if (
        current_user.twitter?.is_authorized ||
        sessionStorage.onboard_twitter_data
      ) {
        setTWStatus(true);
      }
    } catch (err) {}
  }, []);
  const revokeAccess = () => {};
  const saveTwitterToken = (url) => {
    const url_search_params = new URL(window.location.href);
    let oauth_token = url_search_params.searchParams.get("oauth_token");
    let oauth_verifier = url_search_params.searchParams.get("oauth_verifier");
    var data = JSON.stringify({
      oauth_verifier,
      oauth_token,
    });

    var config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/save-twitter-token-web/`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          let temp = JSON.parse(localStorage.getItem("current_user"));
          temp["twitter"] = { is_authorized: true };
          localStorage.removeItem("current_user");
          localStorage.setItem("current_user", JSON.stringify(temp));
          window.location.replace(url);
        } else {
          if (
            localStorage.getItem("is_new") == "true" ||
            localStorage.getItem("is_new") == true
          ) {
            sessionStorage.setItem("twitter_fail", true);
            window.location.replace(url);
          } else if (
            response.status == 252 &&
            response.data.message.includes("already")
          ) {
            setSEMessageText("This twitter handle is already registered!");
          } else {
            setSEMessageText(allWords.th.suggested.error);
          }
        }
      })
      .catch(async (e) => {
        const response = e.response;
        if (!response) return;
        if (response.status === 401) {
          return await auto_login_continue(() => saveTwitterToken(url));
        }
      });
  };

  const saveOnboardData = () => {
    const url_search_params = new URL(window.location.href);
    const oauth_token = url_search_params.searchParams.get("oauth_token");
    const oauth_verifier = url_search_params.searchParams.get("oauth_verifier");

    var data = JSON.stringify({
      oauth_verifier,
      oauth_token,
    });
    var config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/generate-twitter_id-web/`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then((res) => {
        if (res.status === 200) {
          sessionStorage.setItem(
            "onboard_twitter_data",
            JSON.stringify(res.data)
          );
          window.location.replace("/step-4");
        }
      })
      .catch((err) => {});
  };
  useEffect(() => {
    setSEMessageText("");
    if (
      localStorage.getItem("is_new") === "true" ||
      localStorage.getItem("is_new") === true
    ) {
      saveTwitterToken("/invite");
    } else if (
      localStorage.getItem("is_new") === "false" ||
      localStorage.getItem("is_new") === false
    ) {
      saveTwitterToken("/invite_friends");
    } else {
      if (localStorage.getItem("is_new") === "/step-4") {
        saveOnboardData();
      }
    }
  }, []);

  const getTwitterCallback = () => {
    var config = {
      method: "get",
      url: `${REACT_APP_BASE_URL_FOR_USER}/access_contacts/`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
      },
    };

    axios(config)
      .then(function (response) {
        localStorage.setItem("is_new", false);
        window.location.replace(response.data.redirect_url);
      })
      .catch(async (e) => {
        const response = e.response;
        if (!response) return;
        if (response.status === 401) {
          return await auto_login_continue(getTwitterCallback);
        }
      });
  };

  return (
    <>
      {localStorage.is_new === "true" ||
      localStorage.is_new === true ||
      localStorage.is_new === "/step-4" ? (
        <div style={{ marginTop: "25rem" }}>
          <Spinner />
        </div>
      ) : (
        <MainDiv>
          <LeftDiv>
            <AccountLeftSideBar />
          </LeftDiv>
          <CenterDiv>
            <div style={{ marginLeft: "3rem" }}>
              <SettingsHeader page_header="Applications" />
              <TwitterDiv>
                <img src={Twitter} style={{ marginTop: "3rem" }} />
                <div>
                  <TwitterTxt>Twitter</TwitterTxt>
                </div>
                <div style={{ textAlign: "-webkit-center" }}>
                  <p style={{ width: "47%", textAlign: "center" }}>
                    Post or send DMs on Twitter to your network there.
                  </p>
                </div>
                <div className="text-center">
                  <small className="warn-text">{se_message_text}</small>
                </div>
                <div>
                  {tw_status ? (
                    <button
                      className="btn primary-btn-blk"
                      onClick={revokeAccess}
                      style={{ width: "70%", marginBottom: "4rem" }}
                    >
                      {" "}
                      REVOKE ACCESS{" "}
                    </button>
                  ) : (
                    <button
                      className="btn primary-btn-blk"
                      onClick={getTwitterCallback}
                      style={{ width: "70%", marginBottom: "4rem" }}
                    >
                      {" "}
                      CONNECT TO TWITTER{" "}
                    </button>
                  )}
                </div>
              </TwitterDiv>
            </div>
          </CenterDiv>
          <RightDiv></RightDiv>
        </MainDiv>
      )}
    </>
  );
};

export default ConnectApps;
