import React, { useEffect } from "react";
import { Navigate, Route, useNavigate } from "react-router-dom";
import RegisterIllustration from "../../assets/images/twitter_connect.png";
// import Khulkelogo from "../../assets/icons/KhulKe_logo.svg";
import twitter_logo from "../../assets/icons/twitter_logo.svg";
import axios from "axios";
import { REACT_APP_BASE_URL_FOR_USER } from "../../constants/env";
import { auto_login_continue } from "../../utils/utils";
import { globalImages } from "../../assets/imagesPath/images";

const ChooseWisely = () => {
  const navigate = useNavigate();
  useEffect(() => {
    //IF this exists, user has already connected their twitter so this page can be skipped.
    if (sessionStorage.getItem("onboard_twitter_data")) {
      navigate("/invite");
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
        localStorage.setItem("is_new", true);
        navigate(response.data.redirect_url);
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
    <section id="pick_friends" className="container mt-5">
      {!localStorage.getItem("access") && (
        <Route path="" element={<Navigate replace to="/" />} />
      )}
      <div className="row" style={{ margin: "0 auto" }}>
        <div className="col-sm-12 col-md-6 col-lg-6 text-center order-second order-md-first order-sm-1">
          <br />
          <img
            src={RegisterIllustration}
            alt="Register with KhulKe"
            className="mt-5 img-fluid"
          />
          <h1 className="primary-heading">Build your network.</h1>
          {/* <p className="secondary-heading">
            Your portal to great conversations
          </p> */}
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6 order-first order-md-second order-lg-1">
          <div className="mb-5" style={{ width: "100%" }}>
            <div className="col-sm-4 col-md-4 col-lg-4 mb-3">
              <img
                src={globalImages.logo}
                height={"100px"}
                width={"100px"}
                alt="KhulKe Logo"
              />
            </div>
          </div>
          <div className="col-sm-12 col-md-10 col-lg-10">
            <h1 className="primary-heading" style={{ width: "inherit" }}>
              Connect with people you already know
            </h1>
            <p className="text-muted-dark" style={{ width: "inherit" }}>
              Check out who you already know on <i>Khul Ke</i>. Without your
              permission we shall not mail them.
            </p>
            <div className="col-lg-10 col-md-10 col-sm-12">
              <button onClick={getTwitterCallback} className="twitter_btn">
                <img src={twitter_logo} alt="Twitter logo" />
                &emsp;Connect using Twitter
              </button>
              {sessionStorage.getItem("twitter_fail") && (
                <div className="my-1">
                  <small className="warn-text">
                    Something went wrong! Try again later!
                  </small>
                </div>
              )}

              <button
                onClick={() => {
                  navigate("/home");
                }}
                className="primary-btn-gray w-100"
              >
                SKIP &amp; PROCEED
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ChooseWisely;
