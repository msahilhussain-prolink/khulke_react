import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { POST_API_BASE_URL } from "../../constants/env";
import WelcomeIllustration from "../../assets/images/welcome.svg";
import khulke_logo from "../../assets/icons/KhulKe_logo.svg";
import UserProfile from "../../components/UserProfile";

const Welcome = () => {
  // local state
  const [initials, setInitials] = useState("");

  // variables
  let friend_name = sessionStorage.getItem("invited_by");
  let friend_username = sessionStorage.getItem("invited_by_id");
  let current_user = JSON.parse(localStorage.getItem("current_user"));
  if (!localStorage.getItem("current_user")) {
    window.location.replace("/");
  }

  // Effects
  useEffect(() => {
    if (!friend_name) {
      window.location.replace("/");
    }
    let temp = friend_name.split(" ");
    if (temp.length > 1) {
      setInitials((temp[0][0] + temp[temp.length - 1][0]).toUpperCase());
    } else if (temp.length === 1) {
      setInitials(temp[0][0].toUpperCase());
    } else if (temp.length === 0) {
      setInitials("?");
    }
  }, []);

  return (
    <section id="welcomeScreen">
      <div
        className="col-sm-12 col-md-10 col-lg-10 my-5"
        style={{ position: "relative", margin: "0 auto" }}
      >
        <div className="icon-badge">
          <img src={khulke_logo} alt="KhulKe Logo" />
        </div>
        <div
          className="page-card col-sm-12 col-md-6 col-lg-6 text-center"
          style={{ margin: "0 auto" }}
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
            <p className="page-card-subheading">
              to <i>Khul Ke</i> you are <strong>{friend_name}'s</strong>
              <br /> friend.
            </p>
          </div>
          <div className="text-center p-4">
            <UserProfile
              username={friend_username}
              className="shadow page-card-avatar"
            />
            <br />
            <h6
              style={{ textTransform: "capitalize" }}
              className="page-card-username"
            >
              {friend_name}
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
  );
};

export default Welcome;
