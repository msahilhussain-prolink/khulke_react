import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import FormInput from "../../components/FormInput";
import { AvatarBadge } from "../../components/ListComponent/AvatarBadge";
import { getTwFol } from "../../redux/actions/twitterAction/getFollowers";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../components/Spinner";
import { REACT_APP_BASE_URL_FOR_USER } from "../../constants/env";
// import KhulKeLogo from "../../assets/icons/KhulKe_logo.svg";
import "./style.css";
import { auto_login_continue, moengageEvent } from "../../utils/utils";
import { globalImages } from "../../assets/imagesPath/images";

const InviteFromTwitter = () => {
  const dispatch = useDispatch();
  const current_user = JSON.parse(localStorage.getItem("current_user"));
  const [no_show, setNoShow] = useState(false);

  const twitterFollowers = useSelector((state) => state.twitter.data);
  const twitterFollowersErr = useSelector((state) => state.twitter.error);
  const twitterFollowersLoading = useSelector((state) => state.twitter.loading);

  const [loading, setIsLoading] = useState(true);

  const [invited_count, setInvitedCount] = useState(
    current_user["invitation_count"] || 0
  );
  const [max_invite_count, setMaxInviteCount] = useState(20);
  const [curated, setCurated] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (localStorage.is_new) {
      localStorage.removeItem("is_new");
    }
    //Setting invite count
    setMaxInviteCount(
      parseInt(
        JSON.parse(localStorage.getItem("current_user"))["max_invitation_count"]
      )
    );
    //Getting Followers
    setIsLoading(true);
    dispatch(getTwFol());
    moengageEvent("View Page", "ALL", {
      URL: `${window.location.origin}/${window.location.pathname}`,
    });
  }, []);

  useEffect(() => {
    let tw_status = JSON.parse(
      localStorage.current_user || localStorage.anonymous_user
    )?.twitter;
    if (tw_status === false || tw_status === null) {
      setNoShow(true);
    }
    if (twitterFollowers) {
      setIsLoading(false);
      setCurated(twitterFollowers.data);
    } else if (twitterFollowersErr) {
    } else if (twitterFollowersLoading) {
    }
  }, [twitterFollowers, twitterFollowersErr, twitterFollowersLoading]);

  const invite_via_twitter = (twitter_id) => {
    if (invited_count === max_invite_count) {
      return;
    }
    let temp_curated = [...curated];
    temp_curated.forEach((item) => {
      if (item.twitter_userid === twitter_id) {
        item.inv_status = true;
        return true;
      }
    });
    setCurated(temp_curated);
    current_user["invitation_count"] = invited_count + 1;
    localStorage.removeItem("current_user");
    localStorage.setItem("current_user", JSON.stringify(current_user));
    setInvitedCount(invited_count + 1);
    var data = JSON.stringify({
      twitter_id: String(twitter_id),
    });
    var config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/invitation/invite-new-user`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          localStorage.removeItem("current_user");
          current_user["invitation_count"] = invited_count;
          localStorage.setItem("current_user", JSON.stringify(current_user));
        } else {
        }
      })
      .catch(async function (error) {
        const response = error.response;
        if (!response) return;
        if (response.status === 401) {
          return await auto_login_continue(() =>
            invite_via_twitter(twitter_id)
          );
        }
      });
  };

  return (
    <div className="col-sm-12 col-md-12 col-lg-12">
      {no_show ? (
        <div
          className="container-fluid text-center"
          style={{ marginTop: "10%" }}
        >
          <img
            src={globalImages.logo}
            alt="KhulKe!"
            className="py-5"
            style={{ height: "200px", width: "200px", userSelect: "none" }}
          />
          {/* <p>Connect with Twitter to invite your friends!</p> */}
          <p>Invite Friends Coming Soon !</p>
          <br />
          {/* <div className="container px-5">
            <Link to="/apps" className="btn primary-btn-blk">
              Connect Now
            </Link>
          </div> */}
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between">
            <h5>Invite Friends</h5>
            <small className="mr-2 text-success" style={{ fontWeight: "bold" }}>
              {max_invite_count - invited_count}/{max_invite_count}
            </small>
          </div>
          <FormInput>
            <input
              type="text"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="Search friends"
            />
          </FormInput>
          {twitterFollowersErr && (
            <div
              className="container text-center mt-3"
              style={{ paddingRight: "5%" }}
            >
              <h6 className="warn-text">Something went wrong! Try again later!</h6>
            </div>
          )}

          <div
            className="friends-list mt-3"
            style={{ paddingRight: "5%", maxHeight: "80vh" }}
          >
            {loading ? <Spinner /> : ""}
            {curated?.length > 0 &&
              curated
                .filter((filter_item) => {
                  if (
                    filter_item.twitter_handle.toLowerCase().includes(search) ||
                    filter_item.twitter_name.toLowerCase().includes(search)
                  ) {
                    return filter_item;
                  }
                })
                .map((item, index) => {
                  return (
                    <>
                      <div
                        key={index}
                        className={
                          invited_count < max_invite_count
                            ? `d-flex justify-content-between my-4`
                            : `ban-interact d-flex justify-content-between my-4`
                        }
                      >
                        <div className="d-flex">
                          <AvatarBadge
                            style={{ cursor: "pointer" }}
                            img_src={`https://via.placeholder.com/300x300/66B984/FFFFFF?text=${item.twitter_handle[0].toUpperCase()}`}
                            img_alt="."
                            badge={true}
                          />
                          <small
                            style={{
                              userSelect: "none",
                              visibility: "hidden",
                            }}
                          >
                            &emsp;
                          </small>
                          <div>
                            <strong>{item.twitter_name}</strong>
                            <br />
                            <small className="text-muted">
                              @{item.twitter_handle}
                            </small>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            invite_via_twitter(item.twitter_userid);
                          }}
                          className={
                            !item.inv_status
                              ? `invite-button-small`
                              : `ban-interact invited-button-small`
                          }
                          style={{ marginTop: "0px" }}
                        >
                          {item.inv_status ? `Invited` : "Invite"}
                        </button>
                      </div>
                    </>
                  );
                })}
          </div>
        </>
      )}
    </div>
  );
};

export default InviteFromTwitter;
