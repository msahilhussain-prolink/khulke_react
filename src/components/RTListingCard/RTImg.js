import React, { useEffect, useState } from "react";
import clsx from "clsx";

// Components
import BottomLeftComponent from "./BottomLeftComponent";
import VideoThumbnail from "./VideoThumbnail";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import RTDialogs from "./RTDialogs";
import WithoutImage from "../../assets/images/WithoutImage.svg";

// Style
import "./style.css";

// Utils
import { moengageEvent } from "../../utils/utils";
import ToastHandler from "../../utils/ToastHandler";
import { allWords } from "../../App";
import { useDispatch, useSelector } from "react-redux";
import { rtActionData } from "../../redux/actions/roundtableAction/rtAction";
import AspectRatio from "@mui/joy/AspectRatio";
import { Box } from "@mui/material";
import { flatMap } from "lodash";
import { PLATFORM_DETAILS } from "../../pages/AccountSettings/BroadCast/BroadCastUtils/Configs";
export default function RTImg(props) {
  const {
    cover_img,
    past,
    title,
    live,
    upcoming,
    rt_nature,
    rt_type,
    rec_end_flag,
    rec_owner_flag,
    rec_start_flag,
    timestamp,
    media_recording,
    owner_details,
    rt_id,
    muteFlag,
    setMuteFlag,
    videoElem,
    rt_details,
    listingDisplay,
    popular,
    moderator,
    speakers,
    navigate,
    reminder_status,
    reject,
    accept,
    has_accepted,
    acr,
    was_invited,
    request_status,
    join_count,
    is_cancelled,
    time,
    pauseVid,
    ext,
    id,
    broadcast_destination,
  } = props;

  const rtAction = useSelector((state) => state?.rtActionRed?.data);

  // Local State
  const [c_img, setCImg] = useState(cover_img);
  const [notification_text, setNotificationText] = useState("");
  const [notify_box, setNotifyBox] = useState(false);
  const [set_reminder_status, setReminderStatus] = useState(reminder_status);
  const [set_request_access, setRequestAccess] = useState(request_status);
  const [modalOpen, setModalOpen] = useState(false);
  const [titleType, setTitleType] = useState("");
  const [btnFlag, setBtnFlag] = useState(false);
  const [btnData, setBtnData] = useState({
    type: "",
    msg: "",
  });
  const [joinFlg, setJoinFlg] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const url = window.location.href
  const desiredString = url.substring(url.indexOf('/', url.indexOf("/") + 2) + 1);
  const needUrl = 'roundtable/create/success'

  const dispatch = useDispatch();

  const agora_join = (blocked_array = [], warn_array = []) => {
    let role = null;
    let current_user = JSON.parse(
      localStorage.current_user || localStorage.anonymous_user
    );

    const speakerFlag = rt_details?.["speakers"]?.find((item) =>
      item?.username === current_user?.["username"] ? true : false
    );

    if (speakerFlag) {
      if (rt_details?.["owner"]?.["username"] === current_user?.["username"]) {
        role = "admin-panellist";
      } else {
        role = "panellist";
      }
    } else if (
      rt_details?.["moderator"]?.["username"] === current_user?.["username"]
    ) {
      if (rt_details?.["owner"]?.["username"] === current_user?.["username"]) {
        role = "admin-moderator";
      } else {
        role = "moderator";
      }
    } else if (
      rt_details?.["owner"]?.["username"] === current_user?.["username"]
    ) {
      if (
        rt_details?.["moderator"]?.["username"] === current_user?.["username"]
      ) {
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
        owner: owner_details,
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
            rtAction.data.message !==
            "You're not allowed to join this RoundTable."
          ) {
            if (
              rtAction.data.message ===
              "This round table has been ended by Owner"
            ) {
              setNotifyBox(true);
              setNotificationText("This RoundTable has been ended by Owner");
            } else {
              setNotifyBox(true);
              setNotificationText(rtAction.data.message); //Replace with a dialog popup
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
    // window.location.reload();
  }

  function imgFunction() {
    if (
      (live || upcoming) &&
      (rt_nature === "public" ||
        rt_nature === "secret" ||
        (rt_nature === "private" &&
          was_invited &&
          (request_status || set_request_access)))
    ) {
      joinRT();
    }
    if (past) {
      playIncrement1();
    }
    if (btnFlag === false) {
      if (rt_nature === "public" && upcoming) {
        if (reject === false) {
          if (
            reminder_status ||
            set_reminder_status ||
            accept === true ||
            has_accepted ||
            acr
          ) {
            setBtnFlag(false);
            ToastHandler("info", allWords.rt.upcomingRtInfoToast);
          } else {
            if (!localStorage.current_user && localStorage.anonymous_user) {
              setModalOpen(true);
              setTitleType("set_reminder");
              return;
            }

            setBtnFlag(true);
            setBtnData({
              type: "reminder_set",
              msg: allWords.misc.livert.startRT,
            });
          }
        } else {
          if (!localStorage.current_user && localStorage.anonymous_user) {
            setModalOpen(true);
            setTitleType("set_reminder");
            return;
          }

          setBtnFlag(true);
          setBtnData({
            type: "reminder_set",
            msg: allWords.misc.livert.startRT,
          });
        }
      }
      if (rt_nature === "secret" && upcoming) {
        if (reminder_status || set_reminder_status) {
          setBtnFlag(false);
          ToastHandler("info", allWords.rt.upcomingRtInfoToast);
        } else {
          setBtnFlag(true);
          setBtnData({
            type: "reminder_set",
            msg: allWords.misc.livert.startRT,
          });
        }
      }
      if (rt_nature === "private") {
        if (upcoming && was_invited) {
          if (reject === false) {
            if (
              reminder_status ||
              set_reminder_status ||
              accept === true ||
              has_accepted ||
              acr
            ) {
              setBtnFlag(false);
              ToastHandler("info", allWords.rt.upcomingRtInfoToast);
            } else {
              if (!localStorage.current_user && localStorage.anonymous_user) {
                setModalOpen(true);
                setTitleType("set_reminder");
                return;
              }

              setBtnFlag(true);
              setBtnData({
                type: "reminder_set",
                msg: allWords.misc.livert.startRT,
              });
            }
          } else {
            if (!localStorage.current_user && localStorage.anonymous_user) {
              setModalOpen(true);
              setTitleType("set_reminder");
              return;
            }

            setBtnFlag(true);
            setBtnData({
              type: "reminder_set",
              msg: allWords.misc.livert.startRT,
            });
          }
        }
        if (listingDisplay) {
          if ((upcoming || live) && !was_invited) {
            if (request_status || set_request_access) {
              setBtnFlag(false);
              ToastHandler("info", allWords.createRT.reqSentAlready);
            } else {
              if (!localStorage.current_user && localStorage.anonymous_user) {
                setModalOpen(true);
                setTitleType("request_access");
                return;
              }

              setBtnFlag(true);
              setBtnData({
                type: "request_access",
                msg: allWords.createRT.pvtRTpopUp,
              });
            }
          }
        }
      }
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div
      className="rt_img_div"
      id={id}
      onClick={(e) => {
        if (!e.target.id.includes("button")) {
          imgFunction();
        }
      }}
    >
      {media_recording !== null && (
        <>
          <VideoThumbnail
            media_recording={media_recording}
            owner_details={owner_details}
            rt_id={rt_id}
            muteFlag={muteFlag}
            setMuteFlag={setMuteFlag}
            videoElem={videoElem}
            rt_details={rt_details}
            c_img={c_img ? c_img : cover_img}
            setCImg={setCImg}
            title={title}
            upcoming={upcoming}
            pauseVid={pauseVid}
          />
        </>
      )}

      {cover_img ? (
        <Box sx={{ width: "100%", borderRadius: "10px 10px 0px 0px", p: 0 }}>
          <AspectRatio
            variant="plain"
            objectFit="contain"
            sx={{ borderRadius: "10px 10px 0px 0px" }}
          >
            <img
              alt=""
              src={c_img ? c_img : cover_img}
              onError={() => {
                setCImg(undefined);
              }}
            />
          </AspectRatio>
        </Box>
      ) : (
        <Box sx={{ width: "100%", borderRadius: "10px 10px 0px 0px" }}>
          <AspectRatio
            objectFit="contain"
            sx={{ borderRadius: "10px 10px 0px 0px" }}
          >
            <div>
              <img alt="" src={WithoutImage} />
              <div className="rt_img_p">
                <p>{title}</p>
              </div>
            </div>
          </AspectRatio>
        </Box>
      )}

      <div
        className={clsx("top_right", {
          ["hideTR"]: rt_type === "RECORDING_BASED" && live,
        })}
        style={{
          padding: live ? "5px 15px" : undefined,
          right: muteFlag === true && media_recording !== null ? "45px" : undefined,
        }}
        hidden={
          (rt_type === "RECORDING_BASED" && past) ||
          (past && is_cancelled === 0 && join_count > 0) ||
          (past &&
            is_cancelled === undefined &&
            (join_count === undefined || join_count > 0))
            ? true
            : false
        }
      >
        {live && (
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              alignItems: "center",
            }}
          >
            <lottie-player
              src="https://assets7.lottiefiles.com/packages/lf20_ua3gryvm.json"
              background="transparent"
              speed="0"
              style={{ width: "48px", height: "16px" }}
            />
            {broadcast_destination &&
              owner_details?.username ===
                JSON.parse(localStorage.getItem("current_user"))?.username &&
              broadcast_destination.map(
                (item) => PLATFORM_DETAILS[item].smallIcon
              )}
          </div>
        )}
        {upcoming && (
          <>
            <span
              style={{ color: "#54B798", fontSize: "14px", fontWeight: "600" }}
            >
              {allWords.rt.label3}
            </span>
          </>
        )}

        {rt_type !== "RECORDING_BASED" && (
          <>
            {past && (join_count === 0 || is_cancelled === 1) && (
              <>
                <span
                  style={{
                    color: "#ed4d29",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {allWords.misc.cancelled}
                </span>
              </>
            )}
          </>
        )}
      </div>

      <BottomLeftComponent
        rt_id={rt_id}
        rt_nature={rt_nature}
        rt_type={rt_type}
        upcoming={upcoming}
        live={live}
        rec_owner_flag={rec_owner_flag}
        rec_end_flag={rec_end_flag}
        rec_start_flag={rec_start_flag}
        timestamp={timestamp}
        past={past}
        popular={popular}
        media_recording={media_recording}
        time={time}
        muteFlag={muteFlag}
        ext={ext}
      />

      {/* TODO: Will be used in future */}
      {/* <div className="range-slider" hidden={!past}>
        <RangeSlider duration={videoElem?.current?.duration} time={time} />
      </div> */}

      <RTDialogs
        notify_box={notify_box}
        setNotifyBox={setNotifyBox}
        notification_text={notification_text}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        titleType={titleType}
        setTitleType={setTitleType}
        setReminderStatus={setReminderStatus}
        rt_id={rt_id}
        btnFlag={btnFlag}
        setBtnFlag={setBtnFlag}
        btnData={btnData}
        setRequestAccess={setRequestAccess}
        title={title}
        r_type={rt_type}
        rt_nature={rt_nature}
      />
    </div>
  );
}
