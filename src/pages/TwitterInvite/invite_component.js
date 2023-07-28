import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput";
// import Khulkelogo from "../../assets/icons/KhulKe_logo.svg";
import { AvatarBadge } from "../../components/ListComponent/AvatarBadge";
import { getTwFol } from "../../redux/actions/twitterAction/getFollowers";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../components/Spinner";
import { REACT_APP_BASE_URL_FOR_USER } from "../../constants/env";
import "./style.css";
import { auto_login_continue } from "../../utils/utils";
import { globalImages } from "../../assets/imagesPath/images";

const InviteFriends = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const current_user = JSON.parse(
    localStorage.current_user || localStorage.anonymous_user
  );
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
  const [is_valid, setIsValid] = useState(false);

  useEffect(() => {
    //Setting invite count
    setMaxInviteCount(
      parseInt(
        JSON.parse(localStorage.getItem("current_user"))["max_invitation_count"]
      )
    );
    //Getting Followers
    setIsLoading(true);
    dispatch(getTwFol());
  }, []);

  useEffect(() => {
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
        setIsValid(true);
      })
      .catch(async function (error) {
        const res = error.response;
        if (!res) {
          return;
        }

        if (res.status) {
          return await auto_login_continue(() =>
            invite_via_twitter(twitter_id)
          );
        }
      });
  };

  return (
    <div className="col-sm-12 col-md-6 col-lg-6 order-first order-md-second order-lg-1">
      <img
        src={globalImages.logo}
        height={"100px"}
        width={"100px"}
        alt="KhulKe Logo"
      />
      <div className="col-sm-12 col-md-10 col-lg-10">
        <div className="mt-2">
          <div className="d-flex justify-content-between">
            <h1 className="primary-heading">Invite Friends</h1>
            <div>
              <small
                className="mr-2 text-success"
                style={{ fontWeight: "bold" }}
              >
                {max_invite_count - invited_count}/{max_invite_count}
              </small>
              <span style={{ fontSize: "0.8rem", visibility: "hidden" }}>
                &emsp;&emsp;&emsp;
              </span>
              {!is_valid && (
                <Link to="/home" className="link-button pl-2">
                  Skip
                </Link>
              )}
            </div>
          </div>
          <p className="text-muted-dark">
            Who's a great potential addition to <i>Khul Ke</i>
          </p>
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

        <div className="friends-list mt-3" style={{ paddingRight: "5%" }}>
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
                    {!item.user_status && (
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
                    )}
                  </>
                );
              })}
        </div>
        {!twitterFollowersErr && (
          <button
            className={
              is_valid ? `btn primary-btn-blk` : `disabled btn primary-btn-blk`
            }
            onClick={() => {
              navigate("/home");
            }}
          >
            CONTINUE
          </button>
        )}
      </div>
    </div>
  );
};

export default InviteFriends;
