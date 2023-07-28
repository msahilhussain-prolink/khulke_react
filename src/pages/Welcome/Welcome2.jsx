import React, { useState, useEffect } from "react";
import khulke_logo from "../../assets/icons/KhulKe_logo.svg";
import WelcomeIllustration from "../../assets/images/welcome.svg";
import { Link } from "react-router-dom";
import { REACT_APP_BASE_URL_FOR_USER } from "../../constants/env";
import axios from "axios";
import { POST_API_BASE_URL } from "../../constants/env";
import Spinner from "../../components/Spinner";
import "./welcome2.css";
import { auto_login_continue } from "../../utils/utils";
import UserProfile from "../../components/UserProfile";
import { allWords } from "../../App";

export default function Welcome2() {
  // useState
  const [friendName, setfriendName] = useState("");
  const [friendUserName, setFriendUserName] = useState(null);
  const [accessTkn, setAccessTkn] = useState(localStorage.getItem("access"));
  const current_user = JSON.parse(localStorage.getItem("current_user"));

  //   API call function to fetch user profile and friend data
  const dataFetchFunc = async () => {
    let data = {
      username: String(current_user.username),
    };

    let config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/profile/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessTkn}`,
      },
      data: data,
    };

    let d4 = await axios(config)
      .then()
      .catch(async (e) => {
        const res = e.response;
        if (!res) return;
        if (res.status === 401) {
          return await auto_login_continue(dataFetchFunc);
        }
      });

    // assigning the friend after making fetch call
    setfriendName(d4.data.data.self_user.added_by_name);
    setFriendUserName(d4.data.data.self_user.added_by_username);
    // moen Event.
    // window.Moengage?.track_event("Waiting stage completion", {
    //   username: JSON.parse(
    //     localStorage.current_user || localStorage.anonymous_user
    //   ).username,
    //   "onboarding type": "invitation code",
    // });
  };

  //   Effects
  useEffect(() => {
    dataFetchFunc();
    // return () => {
    //   second;
    // };
  }, []);

  function updatingStorage() {
    let a = current_user;
    delete a.is_invited;
    a.is_invited = 1;
    localStorage.removeItem("current_user");
    localStorage.setItem("current_user", JSON.stringify(a));
  }

  updatingStorage();

  return (
    <>
      <section id="welcomeScreen">
        <div
          className="col-sm-12 col-md-10 col-lg-10 my-5"
          style={{
            position: "relative",
            margin: "0 auto",
          }}
        >
          <div className="icon-badge">
            <div className="logo-in-waiting">
              <img src={khulke_logo} alt="KhulKe Logo" />
            </div>
          </div>
          <div
            className="page-card col-sm-12 col-md-6 col-lg-6 text-center"
            style={{
              margin: "0 auto",
              width: "466px",
              height: "635px",
              overflow: "hidden",
            }}
          >
            <img
              className="page-card-illustration"
              style={{ height: "auto", width: "35%" }}
              src={WelcomeIllustration}
              alt="You are added to the waiting list!"
            />
            <div className="container mt-5 mb-3">
              <h1 className="primary-heading" style={{ fontSize: "2.5rem" }}>
                Welcome!
              </h1>
              <p
                className="page-card-subheading"
                style={{ fontSize: "1.01rem" }}
              >
                to <i>KhulKe</i> you are{" "}
                {friendName ? (
                  <span style={{ fontWeight: "bolder" }}>
                    <strong>{friendName && friendName}'s</strong>
                  </span>
                ) : (
                  allWords.misc.pages.loading
                )}
                <br /> friend.
              </p>
            </div>
            <div className="text-center p-3">
              <>
                {friendUserName == null ? (
                  <>
                    <Spinner />
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        width: "100px",
                        height: "100px",
                        margin: "auto",
                        objectFit: "contain",
                      }}
                    >
                      <UserProfile
                        username={friendUserName}
                        width="100%"
                        height="100%"
                        className="shadow page-card-avatar"
                      />
                    </div>
                  </>
                )}
              </>
              <br />
              <h6
                style={{ textTransform: "capitalize" }}
                className="page-card-username"
              >
                {/* {friend_name} */}
              </h6>
            </div>

            <div
              className="col-sm-11 col-md-9 col-lg-9 text-center"
              style={{ margin: "0 auto" }}
            >
              <Link to="/interests" className="btn primary-btn-blk ">
                SET UP PROFILE
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
