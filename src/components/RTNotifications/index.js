import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Constants
import {
  REACT_APP_BASE_URL_CLOUDFRONT,
  REACT_APP_BASE_URL_FOR_NOTIFICATION,
} from "../../constants/env";

// Assets
import back_button from "../../assets/icons/back.svg";

// Styles
import { CenterDiv, MainDiv, RightDiv } from "../../pages/RoundTable/style.js";
import "./style.css";

// Components
import RightSideBar from "../RightSideBar";
import RTListingCard from "../RTListingCard";
import Spinner from "../Spinner";

// Utils
import { auto_login_continue, moengageEvent } from "../../utils/utils";
import { MetaTagsGenerator } from "../../utils/MetaTagsGenerator";
import { metaData } from "../../constants/StaticPagesMetaTags";
import { allWords } from "../../App";

export default function RTNotifications() {
  const navigate = useNavigate();

  //   Local States
  const [rt_loading, setRTLoading] = useState(true);
  const [rtData, setRTData] = useState([]);
  const [callingApi, setCallingApi] = useState(false);

  useEffect(() => {
    if (!localStorage.current_user && localStorage.anonymous_user)
      return navigate("/roundtable/all");
  }, []);

  const [notification_skip, setNotificationSkip] = useState(0);

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 50;

    if (bottom) {
      setNotificationSkip(notification_skip + 10);
    }
  };

  const getRTNotifications = () => {
    const config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_NOTIFICATION}/v1/round-table/`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        limit: 10,
        skip: notification_skip,
      }),
    };

    setCallingApi(true);

    axios(config)
      .then(function (res) {
        if (res?.status === 200) {
          let temp_rt_data = null;
          let temp = null;
          temp = res?.data?.data?.[0]?.["round_table_upcoming"];

          temp_rt_data = [...rtData, ...temp];

          const unique_arr = temp_rt_data?.filter((element) => {
            const isDuplicate = temp_rt_data?.includes(element?._id);

            if (!isDuplicate) {
              temp_rt_data?.push(element?._id);

              return true;
            }

            return false;
          });

          setRTData(unique_arr);

          setRTLoading(false);

          moengageEvent("View Page", "ALL", {
            URL: `${window.location.origin}/${window.location.pathname}`,
          });
        } else {
          setRTLoading(false);
        }
        setCallingApi(false);
      })
      .catch(async function (err) {
        const res = err.response;
        if (!res) {
          setRTLoading(false);
          return;
        }

        if (res.status === 401) {
          return auto_login_continue(getRTNotifications);
        }

        setCallingApi(true);
        setRTLoading(false);
      });
  };

  useEffect(() => {
    if (callingApi) return;
    getRTNotifications();
  }, [notification_skip]);

  return (
    <>
      <MetaTagsGenerator metaTags={metaData["roundtable/notifications"]} />
      <MainDiv>
        <CenterDiv label="rt_noti">
          <div className="d-flex">
            <img
              style={{ cursor: "pointer", width: "25px", marginTop: "5px" }}
              onClick={() => {
                navigate(-1);
              }}
              src={back_button}
              alt="Go back"
            />
            &emsp;
            <p className="rt_notification">{allWords.rt.notiTitle}</p>
          </div>

          <div className="rt_container" onScroll={handleScroll}>
            {rt_loading && <Spinner />}
            {rtData?.length > 0 &&
              rtData
                ?.sort((a, b) => {
                  return b._id.localeCompare(a._id);
                })
                ?.map((item, index, elements) => (
                  <div key={item?._id} style={{ marginTop: "1rem" }}>
                    <RTListingCard
                      broadcast_destination={item.broadcast_destination}
                      notificationDisplay
                      index={index}
                      style={{ border: "1px solid #E4E9F0" }}
                      rt_id={item?._id}
                      cardImg
                      cover_img={
                        item?.media?.length > 0 &&
                        `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${item?.owner?.user_id}/roundtable/${item?.["_id"]}/profile/${item?.["media"]?.[0]?.["metadata"]?.["tempFilename"]}`
                      }
                      title={item?.name}
                      timestamp={item?.time}
                      rt_type={item?.r_type}
                      rt_nature={item?.open_to_all}
                      join_count={item?.join_count}
                      viewer_count={
                        item?.active_flag === true ? item?.["viewer_count"] : ""
                      }
                      invitees_count={
                        item?.upcoming_flag === true
                          ? item?.["invite_count"] - item?.["rejected_count"]
                          : ""
                      }
                      is_cancelled={item?.is_cancelled}
                      moderator={item?.moderator}
                      speakers={item?.speakers}
                      reminder_status={item.reminder_set}
                      upcoming={item?.upcoming_flag}
                      live={item?.active_flag}
                      past={item?.happened_flag}
                      bodyRow
                      cardCenter
                      cardHr
                      cardfooter
                      centerRow
                      noLeftBtn={
                        item?.active_flag === true ||
                        item?.happened_flag === true
                          ? true
                          : false
                      }
                      rt_details={item}
                      bottomHr={item?.has_confirmed === 0 ? true : false}
                      speaker_flag={item?.speaker_flag}
                      owner_flag={item?.owner_flag}
                      audience_flag={item?.audience_flag}
                      moderator_flag={item?.moderator_flag}
                      invitation_token={item?.invitation_token}
                      rt_name={item?.name}
                      acr={item?.has_confirmed === 0 ? true : false}
                      rejected={!item?.hasOwnProperty("has_confirmed") && true}
                      request_status={item?.was_invited}
                      was_invited={item?.was_invited}
                      invitation_code={item?.roundtable_code}
                      last_requested_user={item?.last_request_user?.username}
                      lru={
                        elements?.[index + 1] !== undefined
                          ? elements?.[index + 1]?.["last_request_user"]?.[
                              "username"
                            ]
                          : " "
                      }
                      accepted_count={item?.accepted_count}
                      rejected_count={item?.rejected_count}
                      owner_details={item?.owner}
                      has_rejected={item?.has_confirmed === 2 ? true : false}
                      has_accepted={item?.has_confirmed === 1 ? true : false}
                      invite_by={item?.invite_by}
                      has_removed={item?.has_confirmed === 3 ? true : false}
                      rec_owner_flag={
                        item?.recording?.[0]?.owner_flag === 1 ? true : false
                      }
                      rec_start_flag={
                        item?.recording?.[0]?.start_recording === 1
                          ? true
                          : false
                      }
                      rec_end_flag={
                        item?.recording?.[0]?.soft_end_recording === 0
                          ? true
                          : false
                      }
                      nt_id={item?.nt_id}
                      media_recording={
                        item?.media_recording?.length > 0
                          ? item?.media_recording
                          : undefined
                      }
                      other_count={item?.other_count}
                      user_views_count={item?.user_views_count}
                      ext={
                        item?.media_recording?.length > 0
                          ? item?.media_recording?.[0]?.["metadata"]?.["ext"]
                          : undefined
                      }
                    />
                  </div>
                ))}
            {rtData.length === 0 && !rt_loading && (
              <div className="container text-center my-5 py-5">
                <small className="text-muted">
                  You have no new RoundTable notifications!
                </small>
              </div>
            )}
          </div>
        </CenterDiv>

        <RightDiv>
          <RightSideBar showRoundtabaleContent />
        </RightDiv>
      </MainDiv>
    </>
  );
}
