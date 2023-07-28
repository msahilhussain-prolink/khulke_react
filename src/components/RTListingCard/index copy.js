import clsx from "clsx";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Styles
import "./style.css";

// Components
import { allWords } from "../../App";
import PreloginModal from "../PreloginModal";
import DescComp from "./DescComp";
import ListingButtons from "./ListingButtons";
import ListingParticipants from "./ListingParticipants";
import NotificationMsg from "./NotificationMsg";
import RTImg from "./RTImg";
import ShareComponent from "./ShareComponent";
import GetBorderColor from "../../utils/RTListType";
import ThumbnailImage from "../ThumbnailImage";

export default function RTListingCard(props) {
  const {
    speakers,
    moderator,
    viewer_count,
    timestamp,
    rt_details,
    rt_nature,
    upcoming,
    past,
    live,
    was_invited,
    is_cancelled,
    rt_type,
    reminder_status,
    request_status,
    rt_id,
    owner_details,
    title,
    rec_end_flag,
    rec_owner_flag,
    rec_start_flag,
    notificationDisplay,
    listingDisplay,
    owner_flag,
    last_requested_user,
    accepted_count,
    rejected_count,
    invite_by,
    has_accepted,
    has_rejected,
    has_removed,
    audience_flag,
    moderator_flag,
    speaker_flag,
    nt_id,
    acr,
    rt_name,
    invitation_token,
    invitees_count,
    join_count,
    awesomeDisplay,
    media_recording,
    description,
    category,
    user_views_count,
    cardfooter,
    req_visitor_count,
    ext,
    style,
    broadcast_destination,
  } = props;

  const navigate = useNavigate();
  const [accept, setAccept] = useState(false);
  const [reject, setReject] = useState(false);
  const [muteFlag, setMuteFlag] = useState(false);
  const [dotOpen, setDotOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [time, setTime] = useState(0);
  const [checkMuteFlag, setCheckMuteFlag] = useState(false);
  const open = Boolean(anchorEl);

  let current_user = null;
  try {
    current_user = JSON.parse(
      localStorage.current_user || localStorage.anonymous_user
    );
  } catch (err) {}

  //   useRef
  const videoElem = useRef();
  let timer = "";

  function playVid() {
    if (checkMuteFlag) {
      setMuteFlag(false);
      return setCheckMuteFlag(false);
    }
    videoElem?.current?.play();
    timer = setInterval(() => {
      setTime(Math.round(videoElem?.current?.currentTime));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }

  function pauseVid() {
    setMuteFlag(false);
    setCheckMuteFlag(true);
    // videoElem?.current?.pause();
    // window?.hls?.detachMedia();
  }

  return (
    <div
      style={{
        cursor: "pointer",
        borderRadius: "10px",
        background: "white",
        flexDirection: window.screen.width < 768 ? "column" : "",
      }}
      onMouseOver={() => {
        setMuteFlag(true);
        setTimeout(playVid, 2000);
      }}
      onMouseLeave={() => {
        // setMuteFlag(false);
        pauseVid();
      }}
    >
      {notificationDisplay && (
        <>
          {window.screen.width < 768 && (
            <div>
              <NotificationMsg
                owner_flag={owner_flag}
                last_requested_user={last_requested_user}
                accepted_count={accepted_count}
                rejected_count={rejected_count}
                invite_by={invite_by}
                has_removed={has_removed}
                has_accepted={has_accepted}
                has_rejected={has_rejected}
                moderator_flag={moderator_flag}
                speaker_flag={speaker_flag}
                audience_flag={audience_flag}
                nt_id={nt_id}
                past={past}
                acr={acr}
                rt_name={rt_name}
                rt_nature={rt_nature}
                rt_id={rt_id}
                invitation_token={invitation_token}
                speakers={speakers}
                moderator={moderator}
                rt_details={rt_details}
                accept={accept}
                setAccept={setAccept}
                reject={reject}
                setReject={setReject}
                top
              />
            </div>
          )}
        </>
      )}
      <div
        className={clsx({
          ["listing_card"]: listingDisplay,
          ["notification_card"]: notificationDisplay,
          ["awesome_card"]: awesomeDisplay,
        })}
        style={style || {}}
      >
        <div
          className={clsx({
            ["notification_div"]: notificationDisplay,
          })}
          style={notificationDisplay ? GetBorderColor(rt_details) : {}}
        >
          <RTImg
            cover_img={ThumbnailImage(rt_details)}
            past={past}
            title={title}
            live={live}
            upcoming={upcoming}
            rt_nature={rt_nature}
            rt_type={rt_type}
            rec_end_flag={rec_end_flag}
            rec_owner_flag={rec_owner_flag}
            rec_start_flag={rec_start_flag}
            join_count={join_count}
            is_cancelled={is_cancelled}
            timestamp={timestamp}
            media_recording={media_recording}
            owner_details={owner_details}
            rt_id={rt_id}
            muteFlag={muteFlag}
            setMuteFlag={setMuteFlag}
            videoElem={videoElem}
            rt_details={rt_details}
            listingDisplay={listingDisplay}
            moderator={moderator}
            speakers={speakers}
            navigate={navigate}
            reminder_status={reminder_status}
            reject={reject}
            accept={accept}
            has_accepted={has_accepted}
            acr={acr}
            was_invited={was_invited}
            request_status={request_status}
            time={time}
            setTime={setTime}
            pauseVid={pauseVid}
            ext={ext}
            id={rt_id}
            broadcast_destination={broadcast_destination}
          />

          <div
            onClick={(e) => {
              if (
                owner_details?.["username"] === current_user?.["username"] ||
                (moderator?.["username"] === current_user?.["username"] &&
                  moderator?.["m_type"] === "co-owner")
              ) {
                if (!e.target.id.includes("button") && open === false) {
                  navigate(
                    {
                      pathname: "/roundtable",
                      search: `?id=${rt_id}`,
                    },
                    {
                      state: {
                        rt_details_value: "details_page",
                        rt_details: rt_details,
                      },
                    }
                  );
                }
              } else {
                if (!window.location.pathname.includes("success")) {
                  if (!e.target.id.includes("button") && open === false) {
                    setDotOpen(true);
                  }
                }
              }
            }}
          >
            <div className="card_text">
              <p className="rt_tags">{title}</p>
            </div>

            {/* Participants div */}
            <ListingParticipants
              moderator={moderator}
              speakers={speakers}
              timestamp={timestamp}
              user_type={owner_details?.user_type}
            />

            {/* Views and Share Button */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <div>
                <p className="viewers_count">
                  {past === true ? (
                    <>
                      {user_views_count} {allWords.misc.views}
                    </>
                  ) : (
                    <>
                      {live && (
                        <div className="d-flex">
                          {viewer_count}
                          <>
                            &nbsp;
                            {rt_type === "RECORDING_BASED" ? (
                              <>
                                {media_recording?.[0]?.["metadata"]?.[
                                  "ext"
                                ].toLowerCase() === "mp3" ? (
                                  <p>{allWords.misc.liste}</p>
                                ) : (
                                  <p>{allWords.misc.watch}</p>
                                )}
                              </>
                            ) : (
                              <>
                                {rt_type === "AUDIO_STREAMING" ? (
                                  <p>{allWords.misc.liste}</p>
                                ) : (
                                  <>
                                    {rt_type === "VIDEO_STREAMING" && (
                                      <p>{allWords.misc.watch}</p>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </>
                        </div>
                      )}
                      {awesomeDisplay && upcoming === true ? (
                        <span style={{ marginLeft: "-5px" }}>
                          0 {allWords.misc.attending}
                        </span>
                      ) : (
                        <>
                          {upcoming && (
                            <>
                              {invitees_count > 0
                                ? "+" + invitees_count + allWords.misc.attending
                                : invitees_count + allWords.misc.attending}
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </p>
              </div>

              <ShareComponent
                rt_id={rt_id}
                rt_nature={rt_nature}
                start={rt_details?.time?.start || rt_details?.start}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                open={open}
                title={title}
                rt_type={rt_type}
              />
            </div>
            <ListingButtons
              cardfooter={cardfooter}
              rt_details={rt_details}
              req_visitor_count={req_visitor_count}
              rt_id={rt_id}
            />
          </div>
        </div>
        {notificationDisplay && (
          <>
            {window.screen.width < 768 && (
              <div>
                <NotificationMsg
                  past={past}
                  owner_flag={owner_flag}
                  acr={acr}
                  rt_name={rt_name}
                  speaker_flag={speaker_flag}
                  audience_flag={audience_flag}
                  moderator_flag={moderator_flag}
                  rt_id={rt_id}
                  invitation_token={invitation_token}
                  setAccept={setAccept}
                  setReject={setReject}
                  speakers={speakers}
                  moderator={moderator}
                  rt_nature={rt_nature}
                  bottom
                />
              </div>
            )}
            {window.screen.width >= 768 && (
              <div className="d-flex" style={{ width: "100%" }}>
                <span className="vertical_line"></span>
                <NotificationMsg
                  owner_flag={owner_flag}
                  last_requested_user={last_requested_user}
                  accepted_count={accepted_count}
                  rejected_count={rejected_count}
                  invite_by={invite_by}
                  has_removed={has_removed}
                  has_accepted={has_accepted}
                  has_rejected={has_rejected}
                  moderator_flag={moderator_flag}
                  speaker_flag={speaker_flag}
                  audience_flag={audience_flag}
                  nt_id={nt_id}
                  past={past}
                  acr={acr}
                  rt_name={rt_name}
                  rt_nature={rt_nature}
                  rt_id={rt_id}
                  invitation_token={invitation_token}
                  speakers={speakers}
                  moderator={moderator}
                  rt_details={rt_details}
                  accept={accept}
                  setAccept={setAccept}
                  reject={reject}
                  setReject={setReject}
                  bottom
                  top
                />
              </div>
            )}
          </>
        )}
      </div>
      <br />
      {window.screen.width < 768 && (
        <>
          <hr style={{ color: "#989898", opacity: "1" }} />
        </>
      )}

      <PreloginModal
        open={dotOpen}
        setOpen={setDotOpen}
        header={allWords.misc.rtDetails}
        container={
          <DescComp
            description={description}
            category={category}
            rt_details={rt_details}
            current_user={current_user}
          />
        }
      />
    </div>
  );
}

