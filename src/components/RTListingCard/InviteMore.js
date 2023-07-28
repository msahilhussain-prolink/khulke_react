import React, { useState } from "react";
import axios from "axios";

// Constants
import { REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1 } from "../../constants/env";

// Assets
import CheckWhite from "../../assets/icons/check_white.svg";

// Style
import "./style.css";
// Utils
import { auto_login_continue } from "../../utils/utils";
import RTDialogs from "./RTDialogs";
import ToastHandler from "../../utils/ToastHandler";
import { allWords } from "../../App";

export default function InviteMore(props) {
  const {
    past,
    owner_flag,
    acr,
    rt_name,
    speaker_flag,
    audience_flag,
    moderator_flag,
    rt_id,
    invitation_token,
    setAccept,
    setReject,
    speakers,
    moderator,
    rt_nature,
  } = props;

  // Local State
  const [acr_dialog, setAcrDialog] = useState(false);
  const [invite_followers, setInviteFollowers] = useState(false);
  const [invite_followings, setInviteFollowings] = useState(false);
  const [search_invite, setSearchInvite] = useState(false);
  const [visitor_id, setVisitorId] = useState([]);
  const [email, setEmail] = useState([]);
  const [phone, setPhone] = useState([]);
  const [resEmail, setResEmail] = useState([]);
  const [resPhone, setResPhone] = useState([]);

  const handleClickOpen = () => () => {
    setSearchInvite(true);
  };

  const performCTA = (url) => {
    const FormData = require("form-data");
    let data = new FormData();
    let role = "moderator";
    if (speaker_flag) {
      role = "speakers";
    } else if (audience_flag) {
      role = "audience";
    }
    data.append(
      "data",
      JSON.stringify({
        confirmation_token: invitation_token,
        rt_id: rt_id,
        role: role,
      })
    );

    const config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1}/round-table-${url}/`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
      },
      data: data,
    };

    axios(config)
      .then(async function (response) {
        if (response.status === 200) {
          setAcrDialog(true);
          if (url === "confirm") {
            setAccept(true);
          }
        } else {
          setAcrDialog(true);
          if (url === "reject") {
            setReject(true);
          }
        }
      })
      .catch(async (e) => {
        const response = e.response;
        if (!response) return;

        if (response.status === 401) {
          return await auto_login_continue(() => performCTA(url));
        }
      });
  };

  const inviteFollower = (field) => {
    let data = null;
    try {
      data = JSON.stringify({
        data: [
          {
            roundtable_id: rt_id,
            followers: field === "follower" ? true : false,
            following: field === "following" ? true : false,
            user_id: visitor_id,
            emails: email,
            phones: phone,
          },
        ],
      });

      const config = {
        method: "post",
        url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1}/invite-visitors/`,
        headers: {
          Authorization: `Bearer ${localStorage.access}`,
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then(async function (response) {
          if (response.status === 200) {
            setResPhone([...response?.data?.data?.[0]?.phones]);
            setResEmail([...response?.data?.data?.[0]?.emails]);
            if (
              response?.data?.data?.[0]?.followers === true ||
              response?.data?.data?.[0]?.following === true ||
              visitor_id?.length > 0 ||
              resEmail?.length !== email?.length ||
              resPhone?.length !== phone?.length
            ) {
              ToastHandler("sus", "Successfully Invited.");
            }
          }
        })
        .catch(async (e) => {
          const response = e.response;
          if (!response) return;
          if (response.status === 401) {
            return await auto_login_continue(() => inviteFollower(field));
          }
        });
    } catch (error) {
      return;
    }
  };

  return (
    <div id="invite_more_button">
      {!past && !owner_flag && (
        <div className="n_invite" id="n_invite_button">
          {window.screen.width < 768 && (
            <hr style={{ color: "#989898", opacity: "1", marginTop: "40px" }} />
          )}
          <div className="d-flex invite_more_button" id="invite_more_button">
            {rt_nature !== "secret" && (
              <div className="d-flex foll_btns">
                <div>
                  <button
                    id="followers_button"
                    onClick={() => {
                      inviteFollower("follower");
                      setInviteFollowers(true);
                    }}
                    disabled={invite_followers === false ? false : true}
                    className="mt-3 align-items-center followers_btn1"
                    style={{ height: !invite_followers ? "4rem" : "5rem" }}
                  >
                    {!invite_followers ? (
                      <span style={{ color: "black" }}>
                        {allWords.misc.inviteFollow}
                      </span>
                    ) : (
                      <div>
                        <span style={{ fontSize: "14px", color: "black" }}>
                          {allWords.misc.inviteFollow}
                        </span>
                        &nbsp;
                        <img
                          className="msg_img"
                          src={CheckWhite}
                          alt=""
                          style={{ marginTop: "0px" }}
                        />
                      </div>
                    )}
                  </button>
                </div>

                <div>
                  <button
                    id="followings_button"
                    onClick={() => {
                      inviteFollower("following");
                      setInviteFollowings(true);
                    }}
                    disabled={invite_followings === false ? false : true}
                    className="mt-3 align-items-center followings_btn1"
                    style={{ height: !invite_followings ? "4rem" : "5rem" }}
                  >
                    {!invite_followings ? (
                      <span style={{ color: "black" }}>
                        {" "}
                        Invite those you follow{" "}
                      </span>
                    ) : (
                      <div>
                        <span style={{ fontSize: "13px", color: "black" }}>
                          Invite those &nbsp;&nbsp;you follow
                        </span>{" "}
                        &nbsp;
                        <img
                          className="msg_img"
                          src={CheckWhite}
                          alt=""
                          style={{ marginTop: "0px" }}
                        />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div>
              <button
                id="search_invites_button"
                onClick={handleClickOpen("paper")}
                className="mt-3 align-items-center search_invite_btn1"
                style={{
                  marginLeft: rt_nature !== "secret" ? "" : "118px",
                }}
              >
                <span>
                  {allWords.th.searPlaceholder} &amp; {allWords.misc.pg4.invite}{" "}
                </span>
              </button>
            </div>
          </div>

          <div>
            {acr_dialog === false && (
              <>
                <div
                  className="container-fluid mt-3 px-1"
                  style={{ textAlign: "center" }}
                >
                  <>
                    {acr === true ? (
                      <>
                        <hr
                          style={{
                            marginTop: "2rem",
                            border: "1px solid #E4E9F0",
                            opacity: "100%",
                          }}
                        />
                        <small
                          style={{
                            fontSize:
                              window.screen.width < 768 ? "14px" : "12px",
                          }}
                        >
                          You have been invited as&nbsp;
                          {speaker_flag && (
                            <b>{allWords.misc.livert.panelist}</b>
                          )}
                          {audience_flag && <b>AUDIENCE</b>}
                          {moderator_flag && <b>{allWords.misc.livert.mod}</b>}
                          &nbsp;for the RoundTable <b>{rt_name}</b>.{" "}
                        </small>
                        <br />
                        <div className="mt-4">
                          <button
                            id="accept_button"
                            className="accept_btn"
                            onClick={() => {
                              performCTA("confirm");
                            }}
                          >
                            {allWords.misc.accept}
                          </button>
                          &nbsp; &nbsp;
                          <button
                            id="reject_button"
                            className="reject_btn"
                            onClick={() => {
                              performCTA("reject");
                              setReject(true);
                            }}
                          >
                            {allWords.misc.reject}
                          </button>
                        </div>
                      </>
                    ) : (
                      <lottie-player
                        src="https://assets5.lottiefiles.com/temporary_files/PH5YkW.json"
                        background="transparent"
                        speed="1"
                        style={{
                          width: "300px",
                          height: "100px",
                          marginLeft: "34px",
                          marginTop: "3rem",
                        }}
                        loop
                        autoplay
                      />
                    )}
                  </>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {window.screen.width >= 768 && (
        <>
          {(past || owner_flag) && (
            <>
              <lottie-player
                src="https://assets3.lottiefiles.com/private_files/lf30_llpflzsi.json"
                background="transparent"
                speed="1"
                style={{ width: "250px", height: "250px" }}
                loop
                autoplay
              />
            </>
          )}
        </>
      )}

      <RTDialogs
        search_invite={search_invite}
        setSearchInvite={setSearchInvite}
        speakers={speakers}
        moderator={moderator}
        setVisitorId={setVisitorId}
        inviteFollower={inviteFollower}
        setEmail={setEmail}
        setPhone={setPhone}
      />
    </div>
  );
}
