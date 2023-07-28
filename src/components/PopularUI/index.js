import React, { useEffect, useRef, useState } from "react";
import ListingParticipants from "../RTListingCard/ListingParticipants";
import RTImg from "../RTListingCard/RTImg";
import "./style.css";
import { auto_login_continue, moengageEvent } from "../../utils/utils";
import axios from "axios";
import {
  REACT_APP_BASE_URL_FOR_ROUNDTABLE,
  REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1,
} from "../../constants/env";
import ToastHandler from "../../utils/ToastHandler";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { rtActionData } from "../../redux/actions/roundtableAction/rtAction";

export default function PopularUI(props) {
  const {
    title,
    live,
    past,
    is_cancelled,
    join_count,
    timestamp,
    rec_owner_flag,
    rec_start_flag,
    rec_end_flag,
    rt_type,
    rt_nature,
    rt_id,
    moderator,
    speakers,
    viewer_count,
    upcoming,
    invitees_count,
    other_count,
    item,
    cover_img,
    media_recording,
    user_views_count,
    ext,
    owner_details,
    rt_details,
    showParticipants = false,
  } = props;

  const rtAction = useSelector((state) => state.rtActionRed.data);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [muteFlag, setMuteFlag] = useState(false);
  const [joinFlg, setJoinFlg] = useState(false);
  const [time, setTime] = useState(0);

  const videoElem = useRef();
  let timer = "";

  function playVid() {
    videoElem?.current?.play();
    timer = setInterval(() => {
      setTime(Math.round(videoElem?.current?.currentTime));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }

  function pauseVid() {
    videoElem?.current?.pause();
    window?.hls?.detachMedia();
  }

  const agora_join = (blocked_array = [], warn_array = []) => {
    let rt_details = item;
    let role = null;
    if (rt_details.speaker_flag) {
      if (rt_details.owner_flag) {
        role = "admin-panellist";
      } else {
        role = "panellist";
      }
    } else if (rt_details.moderator_flag) {
      if (rt_details.owner_flag) {
        role = "admin-moderator";
      } else {
        role = "moderator";
      }
    } else if (rt_details.owner_flag) {
      if (rt_details.moderator_flag) {
        role = "admin-moderator";
      } else {
        role = "admin";
      }
    } else {
      role = "audience";
    }
    localStorage.removeItem("join_rt");
    localStorage.setItem(
      "join_rt",
      JSON.stringify({
        uid: JSON.parse(
          localStorage.current_user || localStorage.anonymous_user
        )?.username,
        rt_id: rt_id,
        moderator: moderator,
        speakers: speakers,
        name: JSON.parse(
          localStorage.current_user || localStorage.anonymous_user
        )?.name,
        channelName: rt_details.agora_channel,
        token: rt_details.agora_token,
        rt_name: rt_details.name,
        rt_type: rt_details.r_type,
        start: rt_details.start,
        end: rt_details.end,
        viewer_count: rt_details.viewer_count,
        role: role,
        blocked_array: blocked_array,
        warn_array: warn_array,
        owner: rt_details.owner,
      })
    );

    if (localStorage.join_rt) {
      window.location.replace("/roundtable/join");
    }
  };

  useEffect(() => {
    if (joinFlg) {
      if (rtAction && rtAction?.data?.status === 200) {
        agora_join(
          rtAction?.data?.data?.[0]?.blocked,
          rtAction?.data?.data?.[0]?.warn
        );
        moengageEvent("Join", "RoundTable", {
          RoundTableID: rt_id,
          Name: title,
          "K Type": rt_type,
          "K SubType": rt_nature,
          "Audience Interaction": 0,
        });
      } else {
        if (rtAction && rtAction?.data?.status === 253) {
          if (
            res.data.message !== "You're not allowed to join this RoundTable."
          ) {
            if (
              res.data.message === "This round table has been ended by Owner"
            ) {
              ToastHandler("warn", "This RoundTable has been ended by Owner");
            } else {
              ToastHandler("warn", res.data.message);
            }
          }
        }
      }
    }
  }, [rtAction]);

  const joinRT = async () => {
    dispatch(rtActionData({ rt_id: rt_id, action: "JOIN" }));
    setJoinFlg(true);
  };

  async function playIncrement1() {
    navigate(`/roundtable/recorded/${rt_id}`);
  }

  return (
    <>
      <div
        className="popular"
        style={{
          display: "flex",
          justifyContent: "center",
          cursor: "pointer",
          backgroundColor: "white",
          borderRadius: "10px",
          height: "fit-content",
        }}
        onClick={(e) => {
          if (!e.target.id.includes("button")) {
            if (live) {
              joinRT();
            }
            if (past) {
              playIncrement1();
            }
          }
        }}
        onMouseOver={() => {
          setMuteFlag(true);
          setTimeout(playVid, 3000);
        }}
        // onMouseOut={pauseVid}
        onMouseLeave={() => {
      
          setMuteFlag(false);
          pauseVid()
        }}
      >
        <div className="popular_card">
          <RTImg
            rt_details={rt_details}
            owner_details={owner_details}
            cover_img={cover_img}
            title={title}
            media_recording={media_recording}
            live={live}
            past={past}
            is_cancelled={is_cancelled}
            join_count={join_count}
            listingDisplay
            popular
            timestamp={timestamp}
            rec_owner_flag={rec_owner_flag}
            rec_start_flag={rec_start_flag}
            rec_end_flag={rec_end_flag}
            rt_nature={rt_nature}
            rt_type={rt_type}
            muteFlag={muteFlag}
            rt_id={rt_id}
            videoElem={videoElem}
            joinRT={joinRT}
            playIncrement1={playIncrement1}
            ext={ext}
            time={time}
            id={rt_id}
          />
          {showParticipants && (
            <div className="popularHide">
              <ListingParticipants
                moderator={moderator}
                speakers={speakers}
                past={past}
                viewer_count={viewer_count}
                live={live}
                upcoming={upcoming}
                invitees_count={invitees_count}
                join_count={join_count}
                rt_type={rt_type}
                other_count={other_count}
                user_views_count={user_views_count}
                timestamp={timestamp}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
