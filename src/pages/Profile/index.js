import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

// **Components
import CustomizedSnackbars from "../../components/Snackbar.component";
import LeftSideBar from "../../components/LeftSideBar";
import RightSideBar from "../../components/RightSideBar";
import ProfileHeader from "../../components/ProfileHeader";
import ProfileCenter from "../../components/ProfileCenter/index";
import Spinner from "../../components/Spinner";
import Header from "../../components/Header";

// Styles
import { MainDiv } from "../../pages/RoundTable/style.js";
//import { CenterDiv, RightDiv } from "./style";
import { RightDiv, CenterDiv } from "../../global_styles/global_style";
import "react-placeholder/lib/reactPlaceholder.css";

// Constants
import {
  IS_ANDROID_OR_IOS,
  REACT_APP_BASE_URL_FOR_USER,
} from "../../constants/env";

// Utils
import { auto_login_continue } from "../../utils/utils";

// Lang
import { allWords } from "../../App";
import logger from "../../logger";

const Profile = ({ origin = "/home", blockUser, selectedTab }) => {
  // URL Params
  const [block, setBlock] = useState(false);
  const url_search_params = new URL(window.location.href);
  let username =
    url_search_params.pathname.split("/")[2] ||
    JSON.parse(localStorage.current_user || localStorage.anonymous_user)[
      "username"
    ];

  const [profile_loading, setProfileLoading] = useState(true);
  const [profile_error, setProfileError] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [user_id, setUserId] = useState("");
  const [open, setOpen] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");

  const getProfileData = async () => {
    var data = JSON.stringify({
      username: username,
    });

    const anonymous_user = JSON.parse(localStorage.getItem("anonymous_user"));
    // profile self
    var config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}${
        anonymous_user ? "/anonymous/user_profile/" : "/profile/"
      }`,
      headers: {
        Authorization: `Bearer ${
          anonymous_user ? anonymous_user?.["token"] : localStorage.access
        }`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        setProfileLoading(false);

        if (response.status === 200) {
          setUserId(response?.data?.data?.["user_other"]?.["_id"]);
          setProfileError(false);
          return;
        }
        if (response.status === 253) {
          return setBlock(true);
        }

        if (
          response.status === 252 &&
          response.data.message === "User does not exist"
        ) {
          setProfileError(true);
          return setNotFound(true);
        }

        setProfileError(true);
        return;
      })
      .catch(async (e) => {
        const res = e.response;
        if (!res) return setProfileError(true);

        if (res.status === 401) {
          return await auto_login_continue(getProfileData);
        }
        setProfileError(true);
      });
  };

  const selfState = useLocation();

  useEffect(() => {
    getProfileData();
  }, [selfState]);

  const shareProfile = async () => {
    var data = JSON.stringify({
      username: username,
    });

    var config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/${
        !localStorage.current_user
          ? "anonymous/share-profile-data-links"
          : "share-user-data-links"
      }`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          localStorage.access || JSON.parse(localStorage.anonymous_user).token
        }`,
      },
      data: data,
    };

    axios(config)
      .then((res) => {
        setRedirectUrl(res?.data?.data?.[0]?.["link"]);
        if (window.innerWidth < 768) {
          return setOpen(true);
        }
        setOpen(false);
      })
      .catch(async (e) => {
        const res = e.response;
        logger.error(res);
      });
  };

  useEffect(() => {
    if (IS_ANDROID_OR_IOS && redirectUrl === "") {
      shareProfile();
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Header />
      {open && (
        <CustomizedSnackbars
          open={open}
          handleClose={handleClose}
          redirectUrl={redirectUrl}
        />
      )}
      <MainDiv
        style={{
          height: "100vh",
        }}
      >
        <CenterDiv
          style={{
            overflowX: "hidden",
          }}
        >
          {profile_loading && <Spinner />}
          {profile_error && !notFound && (
            <div className="text-center">
              <small className="warn-text">{allWords.profile.fallback}</small>
            </div>
          )}
          {!profile_loading && profile_error && notFound && (
            <div className="text-center">
              <small className="warn-text">
                User with username {username} not found! Please try another
                username.
              </small>
            </div>
          )}
          {!profile_loading && !profile_error && (
            <>
              <ProfileHeader
                acc_set
                edit_btn
                follow
                origin={origin}
                follow_btn
                blockUser={block}
                p_loading={profile_loading}
                p_error={profile_error}
              />
              <ProfileCenter
                blockUser={block}
                user_id={user_id}
                selectedTab={selectedTab}
                setBlock={setBlock}
              />
            </>
          )}
        </CenterDiv>
        <RightDiv style={{ marginLeft: "10px" }}>
          <RightSideBar showRoundtabaleContent />
        </RightDiv>
      </MainDiv>
    </>
  );
};

export default Profile;
