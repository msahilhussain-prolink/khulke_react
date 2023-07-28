import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";

// Material UI
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IconButton } from "@mui/material";
import WithoutImage from "../../assets/images/WithoutImage.svg";

// Constants
import {
  REACT_APP_BASE_URL_CLOUDFRONT,
  REACT_APP_BASE_URL_FOR_ROUNDTABLE,
} from "../../constants/env";

// Style
import { TimeImg } from "./style";
import "./style.css";

// Assets
import Viewers from "../../assets/icons/Group 19646.svg";

// Components
import AddUserInteraction from "../../components/AddUserInteraction";
import M3U8Player from "../../components/M3U8Player";
import RTPollComponent from "../../components/RTPollComponent";
import RTProfile from "../../components/RTProfile";
import ViewerReply from "../../components/ViewerReply";
import AllPosts from "../AgoraSandbox/AudienceInteraction/AllPosts";
import PastPost from "./PastPost";
import RTScroll from "./RTScroll";

// Redux
import { allWords } from "../../App";
import logger from "../../logger";
import { moengageEvent } from "../../utils/utils";
import { AspectRatio, Box } from "@mui/joy";

export default function PastCenter(props) {
  const {
    rt_data,
    rt_id,
    current_user,
    setVideoTimer,
    setLoading,
    recommendData,
    hideSection,
    setHideSection,
    hideFull,
    setHideFull,
    like,
    setLike,
    dislike,
    setDislike,
    removeAction,
    cover_img,
    interactionData,
    getLikeDislikeCount,
    btnDisable,
    setBtnDisable,
    videoElem,
    audioElem,
  } = props;

  // Local State;
  const [chatReply, setChatReply] = useState(false);
  const [replyingId, setReplyingId] = useState();
  const [day_duration, setDayDuration] = useState("");
  const [hour_duration, setHourDuration] = useState("");
  const [total, setTotal] = useState("");
  const [hideRt, setHideRT] = useState(true);
  const [videoData, setVideoData] = useState("");
  const [ext, setExt] = useState("");
  const [pollFlag, setPollFlag] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  let errorData = "";

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });

  useEffect(() => {
    rt_data.forEach((items) => {
      if (items?.media_recording?.length > 0) {
        const media = items?.media_recording?.find((item) =>
          item?.metadata?.ext.includes("m3u8")
            ? item?.metadata?.ext.includes("m3u8")
            : item?.metadata?.mimeType.includes("video") ||
              item?.metadata?.mimeType.includes("audio")
        );
        setVideoData(media?.metadata.tempFilename);
        setExt(media?.metadata.mimeType);
        setLoading(false);
      } else {
        errorData = "This RoundTable is not recorded.";
      }
    });
  }, [rt_data]);

  function moenFunc() {
    moengageEvent("View", "RoundTable", {
      RoundTableID: rt_id,
      Name: rt_data?.[0]?.["name"],
      "K Type": rt_data?.[0]?.["r_type"],
      "K SubType": rt_data?.[0]?.["open_to_all"],
      "Audience Interaction": 0,
    });
  }

  const increaseViewerCount = async () => {
    let token;
    let urlcheck;

    if (localStorage.getItem("access")) {
      token = localStorage.getItem("access");
      urlcheck = `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/modify_viewer_count/`;
    }

    if (JSON.parse(localStorage.getItem("anonymous_user"))) {
      token = JSON.parse(localStorage.getItem("anonymous_user"))["token"];
      urlcheck = `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/anonymous/modify_viewer_count/`;
    }

    moenFunc();
    var config = {
      method: "POST",
      url: urlcheck,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: {
        rt_id: rt_id,
      },
    };

    try {
      const res = await axios(config);
      if (!res.status == 200) {
        logger.info("viewer count could not increase due to ", res.data);
      }
    } catch (e) {
      logger.info("viewer count could not increase due to ", e.message);
    }
  };

  return (
    <>
      <div className="mainGrid">
        <div
          className="innerMain"
          style={{
            display: hideFull ? "none" : "",
          }}
        >
          <div className="leftSide1">
            {videoData ? (
              <>
                {!ext?.includes("audio") ? (
                  <M3U8Player
                  src={`${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${rt_data?.[0]?.owner?.user_id}/roundtable/${rt_id}/recording/${videoData}`}
                    increaseViewerCount={increaseViewerCount}
                    rt_data={rt_data?.[0]}
                    current_user={current_user}
                    videoElem={videoElem}
                    setVideoTimer={setVideoTimer}
                    setLoading={setLoading}
                    className="video_player"
                    setHideRT={setHideRT}
                    hideRt={hideRt}
                    owner_details={rt_data?.[0]?.owner}
                    open_to_all={rt_data?.[0]?.open_to_all}
                    id="past_video"
                  />
                ) : (
                  <div className="audioDiv">
                    {cover_img ? (
                      <Box
                        sx={{
                          width: "100%",
                          borderRadius: "10px 10px 0px 0px",
                          p: 0,
                        }}
                      >
                        <AspectRatio
                          objectFit="contain"
                          sx={{ borderRadius: "10px 10px 0px 0px" }}
                        >
                          <img
                            alt=""
                            src={cover_img}
                            onError={() => {
                              setCImg(undefined);
                            }}
                          />
                        </AspectRatio>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          borderRadius: "10px 10px 0px 0px",
                        }}
                      >
                        <AspectRatio
                          objectFit="contain"
                          sx={{ borderRadius: "10px 10px 0px 0px" }}
                        >
                          <div>
                            <img
                              alt=""
                              src={WithoutImage}
                              onError={() => {
                                setCImg(undefined);
                              }}
                            />
                            <div className="rt_img_p">
                              <p>{title}</p>
                            </div>
                          </div>
                        </AspectRatio>
                      </Box>
                    )}

                    <audio
                      className="audio_player"
                     src={`${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${rt_data?.[0]?.owner?.user_id}/roundtable/${rt_id}/recording/${videoData}`}
                      autoPlay={true}
                      preload
                      controls={hideRt}
                      onContextMenu={(e) => e.preventDefault()}
                      ref={audioElem}
                      onLoadedData={() => {
                        setLoading(false);
                        setVideoTimer(audioElem.current.duration);
                        setTimeout(increaseViewerCount, 5000);
                      }}
                      onPlaying={() => {
                        setHideRT(true);
                      }}
                      onEnded={() => {
                        setHideRT(false);
                      }}
                      controlsList={
                        rt_data?.[0]?.owner?.username !== current_user.username
                          ? "nodownload"
                          : ""
                      }
                    />
                  </div>
                )}
                <RTScroll
                  recommendData={recommendData}
                  hideRt={hideRt}
                  rt_id={rt_id}
                  ext={ext}
                  videoElem={
                    ext?.includes("application/x-mpegURL")
                      ? videoElem
                      : ext?.includes("video")
                      ? videoElem
                      : audioElem
                  }
                />
              </>
            ) : (
              ""
            )}
            {errorData && <h5>{errorData}</h5>}
          </div>

          <RTProfile
            hideSection={hideSection}
            hideFull={hideFull}
            rt_data={rt_data}
            rt_id={rt_id}
            like={like}
            setLike={setLike}
            dislike={dislike}
            setDislike={setDislike}
            removeAction={removeAction}
            getLikeDislikeCount={getLikeDislikeCount}
            btnDisable={btnDisable}
            setBtnDisable={setBtnDisable}
            windowWidth={windowWidth}
          />
        </div>

        <div
          className={
            hideFull === true
              ? "rightSide pastMain hideFullT"
              : hideSection === true
              ? "rightSide pastMain hideSectionT"
              : "rightSide pastMain hideSectionF"
          }
          style={{
            // position: "relative",
            mt:
              windowWidth < 1200
                ? windowWidth >= 768 && windowWidth < 1200
                  ? "10px !important"
                  : 10
                : 0,
          }}
        >
          <div
            className="pastPanel d-flex"
            // style={{
            //   backgroundColor:
            //     windowWidth <= 768
            //       ? hideSection === false
            //         ? "#E4E9F0"
            //         : "#fff"
            //       : "#E4E9F0",
            // }}
          >
            <strong
              style={{
                color: "black",
                fontSize: "20px",
                minWidth: "fit-content",
              }}
            >
              <TimeImg
                className="mobViewAud"
                src={Viewers}
                style={{
                  marginLeft: "2px",
                  marginRight: "5px",
                }}
              />

              {allWords.misc.livert.interac}
            </strong>

            <div className="audBtns">
              <IconButton
                onClick={() => {
                  setHideFull(!hideFull);
                  setHideSection(false);
                }}
              >
                <AspectRatioIcon />
              </IconButton>

              <IconButton
                onClick={() => {
                  setHideSection(!hideSection);
                  setHideFull(false);
                }}
              >
                <ExpandMoreIcon
                  style={
                    hideSection || hideFull
                      ? { transform: "rotate(-180deg)", transition: "0.2s" }
                      : { transform: "rotate(0deg)", transition: "0.2s" }
                  }
                />
              </IconButton>
            </div>
          </div>

          <div
            className="pastAudInt"
            // style={{
            //   backgroundColor:
            //     windowWidth <= 768
            //       ? hideSection === false
            //         ? "#E4E9F0"
            //         : "#fff"
            //       : "#E4E9F0",
            //   height:
            //     hideFull === true ? "92vh" : hideSection === true ? "100%" : "",
            // }}
          >
            {windowWidth >= 992 ? (
              <AllPosts
                interactionData={interactionData}
                past={true}
                current_user={current_user}
                chatReply={chatReply}
                setChatReply={setChatReply}
                setReplyingId={setReplyingId}
                replyingId={replyingId}
                rt_id={rt_id}
                single_rt_data={rt_data}
              />
            ) : (
              <>
                {hideFull === true ? (
                  <>
                    <AllPosts
                      interactionData={interactionData}
                      past={true}
                      current_user={current_user}
                      chatReply={chatReply}
                      setChatReply={setChatReply}
                      setReplyingId={setReplyingId}
                      replyingId={replyingId}
                      rt_id={rt_id}
                      single_rt_data={rt_data}
                    />
                  </>
                ) : (
                  <>
                    {hideSection === false ? (
                      <>
                        <PastPost interactionData={interactionData} />
                      </>
                    ) : (
                      <AllPosts
                        interactionData={interactionData}
                        past={true}
                        current_user={current_user}
                        chatReply={chatReply}
                        setChatReply={setChatReply}
                        setReplyingId={setReplyingId}
                        replyingId={replyingId}
                        rt_id={rt_id}
                        single_rt_data={rt_data}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>
          <div
            style={{
              position: "absolute",
              left: "0.75rem",
              bottom: "4.375rem",
              width: "24rem",
              height: "auto",
              maxHeight: "37rem",
              overflowY: "scroll",
            }}
            hidden={
              windowWidth <= 1200
                ? hideFull === true
                  ? false
                  : hideSection === false
                  ? true
                  : false
                : false
            }
          >
            {interactionData
              ?.filter((item) => item?.is_deleted !== 1)
              ?.filter((item) => item?.muted !== 1)
              ?.filter((item) =>
                moment(new Date(item?.polling_data?.["start_date"])).isAfter(
                  moment(new Date(rt_data?.[0]?.["end"]))
                )
              )
              ?.map((item, ind) => (
                <div key={item?.post_id}>
                  {item?.type === "POLL_ROUNDTABLE" ? (
                    <RTPollComponent
                      indexVal={ind}
                      username={item?.username}
                      userId={item?.user_id}
                      name={item?.name}
                      polling_data={item?.polling_data}
                      type={item?.type}
                      current_user={current_user}
                      pollExpireTime={new Date(item?.polling_data?.end_date)}
                      day_duration={day_duration}
                      hour_duration={hour_duration}
                      post_id={item?.post_id}
                      rt_id={rt_id}
                      posted_at={item?.posted_at}
                      single_rt_data={rt_data}
                      total={total}
                      setTotal={setTotal}
                      setPollFlag={setPollFlag}
                    />
                  ) : (
                    ""
                  )}
                </div>
              ))}
          </div>

          <div
            className={
              hideFull === false
                ? hideSection === false
                  ? "hideSecT"
                  : "hideSecF"
                : "hideFF"
            }
            style={{
              position: "absolute",
              bottom: "0",
              // left: "8px",
              right: "0",
              width: "100%",
            }}
          >
            <AddUserInteraction
              rt_id={rt_id}
              // mute_id={mute_id}
              username={current_user.username}
              current_user={current_user}
              single_rt_data={rt_data}
              setDayDuration={setDayDuration}
              setHourDuration={setHourDuration}
              total={total}
            />
          </div>
          {chatReply && replyingId && <ViewerReply {...replyingId} />}
        </div>
      </div>
    </>
  );
}
