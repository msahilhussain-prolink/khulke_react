import React, { useEffect, useState } from "react";

// ASSETS
import live_recording from "../../assets/gif/live_recording.gif";
import Chat from "../../assets/icons/Group 19541.svg";
import auto_recording from "../../assets/images/auto_recording.jpg";

// COMPONENTS
import MemoAudioBased from "../../components/IconsComponents/AudioBased";
import MemoConfidentialIcon from "../../components/IconsComponents/ConfidentialBased";
import MemoGlobeIcon from "../../components/IconsComponents/GlobeBased";
import MemoPrivacyIcon from "../../components/IconsComponents/PrivateBased";
import MemoVideoBased from "../../components/IconsComponents/VideoBased";

// style
import { ShareOutlined } from "@material-ui/icons";
import { allWords } from "../../App";
import {
  MOBILE_VIEW,
  REACT_APP_BASE_URL_CLOUDFRONT,
} from "../../constants/env";
import { CancelledBtn, CommentsIcon, LiveBtn, PastBtn, UpBtn } from "./style";
import { createEditRoundtableInitialize } from "../../redux/actions/createEditRoundtable";
import { useDispatch } from "react-redux";
import moment from "moment";

export default function RoundTableLabels(props) {
  const {
    rtType,
    parsed_data,
    current_user,
    url_rt_id,
    progress_name,
    handleClick,
    rt_id,
    sendData,
    setSendData,
    status,
    setStatus,
    navigate,
    progress_one,
    wip_rt_id,
    disableRecord,
    wip_id_flag,
  } = props;

  const [open_to_all, setOpenToAll] = useState("");
  const [r_type, setRType] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    try {
      let local_status = "";
      if (parsed_data?.active_flag) {
        local_status = "live";
      } else if (parsed_data?.happened_flag) {
        local_status = "past";
      } else if (
        parsed_data?.upcoming_flag === true ||
        parsed_data?.upcoming_flag === undefined
      ) {
        local_status = "upcoming";
      }
      setStatus(local_status);
      setOpenToAll(
        sendData?.["open_to_all"] !== undefined
          ? sendData?.["open_to_all"]
          : parsed_data?.["open_to_all"]
      );
      setRType(
        sendData?.["r_type"] !== undefined
          ? sendData?.["r_type"]
          : parsed_data?.["r_type"]
      );
    } catch (e) {
      return;
    }
  }, [parsed_data]);

  const clickEdit = () => {
    let moderator_data = {
      _id: parsed_data?.moderator?.user_id,
      label: parsed_data?.moderator?.username,
      value: parsed_data?.moderator?.name,
    };

    let durationHr = 0;

    if (
      Math.round(
        moment(new Date(parsed_data?.end)).diff(
          new Date(parsed_data?.start),
          "minutes"
        )
      ) === 30
    ) {
      durationHr = 0;
    } else {
      durationHr = Math.round(
        moment(new Date(parsed_data?.end)).diff(
          new Date(parsed_data?.start),
          "minutes"
        ) / 60
      );
    }

    dispatch(
      createEditRoundtableInitialize({
        rtType: parsed_data.r_type === "RECORDING_BASED" ? "recorded" : "live",
        rtPlayType:
          parsed_data.r_type === "VIDEO_STREAMING"
            ? "video"
            : parsed_data.r_type === "AUDIO_STREAMING"
            ? "audio"
            : "recorded",
        rtNature: parsed_data.open_to_all,
        rtTopic: parsed_data.name,
        rtDescription: parsed_data.description,
        dateValue: moment(new Date(parsed_data?.start))
          .local()
          .format("YYYY-MM-DD"),
        timeValue: moment(parsed_data?.start).local(),
        urlRtId: url_rt_id,
        wipRtId: null,
        durationHr: {
          label: ` ${durationHr} ${allWords.misc.livert.h}`,
          value: `${durationHr}`,
        },
        durationMin: {
          label: `${Math.round(
            moment(new Date(parsed_data?.end)).diff(
              new Date(parsed_data?.start),
              "minutes"
            ) % 60
          )} ${allWords.misc.livert.m}`,
          value: `${Math.round(
            moment(new Date(parsed_data?.end)).diff(
              new Date(parsed_data?.start),
              "minutes"
            ) % 60
          )}`,
        },
        durationSec: {
          label: `0 ${allWords.misc.livert.m}`,
          value: "0",
        },
        schedule: true,
        rtImage:
          parsed_data?.media?.length > 0
            ? `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${parsed_data?.["owner"]?.["user_id"]}/roundtable/${parsed_data?.["_id"]}/profile/${parsed_data?.["media"]?.[0]?.["metadata"]?.["tempFilename"]}`
            : null,
        rtImageUrl:
          parsed_data?.media?.length > 0
            ? `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${parsed_data?.["owner"]?.["user_id"]}/roundtable/${parsed_data?.["_id"]}/profile/${parsed_data?.["media"]?.[0]?.["metadata"]?.["tempFilename"]}`
            : null,
        logo1: parsed_data.org_logo_url,
        logo2: parsed_data.brand_logo_url,
        logo3: parsed_data.sub_brand_logo_url,
        intro: parsed_data.intro_url,
        outro: parsed_data.outro_url,
        recording: "",
        owner: parsed_data.owner,
        moderator: moderator_data,
        moderatorIntroduction: parsed_data.moderator.bio,
        m_type: parsed_data?.moderator?.m_type === "moderator" ? false : true,
        panelists: parsed_data.speakers.map((el) => {
          return {
            name: {
              _id: el?.user_id,
              label: el?.username,
              value: el?.name,
            },
            introduction: el.bio,
          };
        }),
        rtDoc: `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${parsed_data?.["owner"]?.["user_id"]}/roundtable/${parsed_data?.["_id"]}/document/${parsed_data?.["doc_media"]?.[0]?.["metadata"]?.["tempFilename"]}`,
        inviteFollower: parsed_data?.followers,
        inviteFollowing: parsed_data?.following,
        user_data: [],
        user_id: parsed_data?.userid_list,
        arrayId: parsed_data?.past_rtid,
        emails: parsed_data?.email_list,
        emailList: parsed_data?.email_list,
        phones: parsed_data?.phone_list,
        phoneList: parsed_data?.phone_list,
        anonymous: parsed_data?.owner?.anonymous,
      })
    );
    navigate(`/roundtable/edit/${rt_id}`);
  };

  return (
    <div>
      <div className="row rt-label-div">
        <div
          className="col-sm-6 col-lg-8 col-md-8 rt_type_div"
          style={{ marginTop: "-6px" }}
        >
          <div className="pr-5">
            {!window.location.pathname.includes("review") && (
              <>
                {status === "upcoming" && (
                  <UpBtn
                    style={{
                      padding: "5px 15px",
                      width: "fit-content",
                      height: "fit-content",
                    }}
                  >
                    {allWords.rt.label3}
                  </UpBtn>
                )}
                {status === "live" && (
                  <LiveBtn
                    style={{
                      padding: "5px 15px",
                      width: "fit-content",
                      height: "fit-content",
                    }}
                  >
                    {allWords.rt.label2}
                  </LiveBtn>
                )}
                {status === "past" &&
                  parsed_data?.is_cancelled === 0 &&
                  (parsed_data?.join_count > 0 ||
                    parsed_data?.join_count === undefined) && (
                    <PastBtn
                      style={{
                        padding: "5px 15px",
                        width: "fit-content",
                        height: "fit-content",
                      }}
                    >
                      {allWords.misc.past}
                    </PastBtn>
                  )}
                {status === "past" &&
                  (parsed_data?.is_cancelled === 1 ||
                    parsed_data?.join_count === 0) && (
                    <CancelledBtn
                      style={{
                        padding: "5px 15px",
                        width: "fit-content",
                        height: "fit-content",
                      }}
                    >
                      {allWords.misc.cancel}
                    </CancelledBtn>
                  )}
                &emsp;
              </>
            )}
            {open_to_all === "public" && (
              <>
                <MemoGlobeIcon width="22" height="22" color="red" />
                <span style={{ fontSize: "0.875rem" }} className="text-muted">
                  &nbsp;{allWords.createRT.optPub}
                </span>
              </>
            )}
            {open_to_all === "private" && (
              <>
                <MemoPrivacyIcon width="22" height="22" color="red" />
                <span style={{ fontSize: "0.875rem" }} className="text-muted">
                  &nbsp;{allWords.createRT.optPriv}
                </span>
              </>
            )}
            {/* &nbsp; */}
            {open_to_all === "confidential" ||
              (open_to_all === "secret" && (
                <>
                  <MemoConfidentialIcon width="22" height="22" color="red" />
                  <span style={{ fontSize: "0.875rem" }} className="text-muted">
                    &nbsp;{allWords.createRT.optConfi}
                  </span>
                </>
              ))}
            &emsp;
            {r_type === "TEXT_BASED" && (
              <>
                <CommentsIcon width={"18px"} height={"18px"} src={Chat} />
                &nbsp;
                <span style={{ fontSize: "0.875rem" }} className="text-muted">
                  Chat
                </span>
              </>
            )}
            {r_type?.toLowerCase() === "audio_streaming" && (
              <>
                <MemoAudioBased
                  width={"18px"}
                  height={"18px"}
                  marginTop="0px"
                  color="red"
                />
                &nbsp;
                <span style={{ fontSize: "0.875rem" }} className="text-muted">
                  {allWords.createRT.audioBtn}
                </span>
              </>
            )}
            {r_type?.toLowerCase() === "video_streaming" && (
              <>
                <MemoVideoBased
                  width={"18px"}
                  height={"18px"}
                  marginTop="0px"
                  color="red"
                />
                &nbsp;
                <span style={{ fontSize: "0.875rem" }} className="text-muted">
                  {allWords.rt.opt1}
                </span>
              </>
            )}
            {r_type?.toLowerCase() === "recording_based" && (
              <>
                {parsed_data?.media_recording?.[0]?.["metadata"]?.[
                  "ext"
                ].toLowerCase() === "mp3" ? (
                  <>
                    <MemoAudioBased
                      width={"18px"}
                      height={"18px"}
                      marginTop="0px"
                      color="red"
                    />
                    &nbsp;
                    <span
                      style={{ fontSize: "0.875rem" }}
                      className="text-muted"
                    >
                      {allWords.rt.opt2}
                    </span>
                  </>
                ) : (
                  <>
                    <MemoVideoBased
                      width={"18px"}
                      height={"18px"}
                      marginTop="0px"
                      color="red"
                    />
                    &nbsp;
                    <span
                      style={{ fontSize: "0.875rem" }}
                      className="text-muted"
                    >
                      {allWords.rt.opt1}
                    </span>
                  </>
                )}
              </>
            )}
            &emsp;
            {status === "upcoming" && (
              <>
                {sendData?.["start_recording"] === 0 ? null : (
                  <>
                    {sendData?.["start_recording"] === 1 ||
                    parsed_data?.recording?.[0]?.owner_flag === 1 ? (
                      <>
                        <img
                          id="live_rec"
                          alt="Live Recording"
                          src={auto_recording}
                          width={50}
                          height={50}
                        />
                      </>
                    ) : null}
                  </>
                )}
              </>
            )}
            {status === "live" && (
              <>
                {parsed_data?.recording?.[0]?.soft_end_recording === 0 && (
                  <>
                    {parsed_data?.recording?.[0]?.owner_flag === 1 ? (
                      <img
                        id="live_rec"
                        alt="Live Recording"
                        src={live_recording}
                        width={50}
                        height={50}
                      />
                    ) : (
                      <>
                        {parsed_data?.recording?.[0]?.start_recording === 1 ? (
                          <img
                            id="live_rec"
                            alt="Live Recording"
                            src={live_recording}
                            width={50}
                            height={50}
                          />
                        ) : null}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>{" "}
          <br />
        </div>
        {/* Share And Edit button */}
        <div
          className="col-sm-6 col-lg-4 col-md-4 edit_btn_parent_div"
          style={{ marginBottom: "25px", paddingLeft: "40px" }}
        >
          {parsed_data?.["owner"]?.["user_id"] === current_user?.["_id"] ||
          (parsed_data?.moderator?.m_type === "co-owner" &&
            parsed_data?.moderator?.user_id === current_user?.["_id"]) ||
          wip_rt_id ? (
            <>
              {progress_name !== "review" ? (
                <>
                  {status === "upcoming" ? (
                    <div
                      className="edit_btn_child_div"
                      style={{
                        display: "flex",
                        justifyContent: MOBILE_VIEW ? "end" : "",
                        marginTop: MOBILE_VIEW ? "-3rem" : "0rem",
                        marginLeft: MOBILE_VIEW
                          ? disableRecord === false
                            ? "12rem"
                            : "11rem"
                          : "-2rem",
                      }}
                    >
                      {rtType !== "record" && (
                        <button
                          className="shareBtnRTL"
                          id="share_button"
                          onClick={handleClick}
                          hidden={wip_rt_id ? true : false}
                        >
                          <ShareOutlined
                            id="share_icon_button"
                            className="icon"
                            style={{
                              width: "20px",
                              height: "20px",
                            }}
                          />{" "}
                          {!MOBILE_VIEW && allWords.misc.share}
                        </button>
                      )}
                      <>
                        &emsp;
                        <button
                          id="edit_btn"
                          style={{
                            marginLeft:
                              disableRecord === false
                                ? open_to_all === "confidential" ||
                                  open_to_all === "secret"
                                  ? "5rem"
                                  : "0rem"
                                : "5rem",
                          }}
                          onClick={() => {
                            clickEdit();
                            // if (disableRecord === false) {
                            //   if (url_rt_id) {
                            //     if (wip_rt_id) {
                            //       navigate("/roundtable/create", {
                            //         state: {
                            //           rt_details: sendData,
                            //           rt_page: "not_record",
                            //         },
                            //       });
                            //     } else {
                            //       navigate(`/roundtable/edit/${rt_id}`, {
                            //         state: {
                            //           rt_details:
                            //             progress_one === 0
                            //               ? parsed_data
                            //               : sendData,
                            //           rt_page: "not_record",
                            //         },
                            //       });
                            //     }
                            //   } else {
                            //     navigate("/roundtable/create", {
                            //       state: {
                            //         rt_details: sendData,
                            //       },
                            //     });
                            //   }
                            // } else {
                            //   if (url_rt_id) {
                            //     navigate(`/roundtable/edit/${url_rt_id}`, {
                            //       state: {
                            //         rt_details: sendData,
                            //         rt_page: "record",
                            //         rt_type: "",
                            //       },
                            //     });
                            //   } else {
                            //     navigate("/roundtable/create", {
                            //       state: {
                            //         rt_details: sendData,
                            //         rt_page: "record",
                            //       },
                            //     });
                            //   }
                            //   setSendData(sendData);
                            // }
                          }}
                          hidden={
                            !window.location.pathname.includes("review") &&
                            r_type?.toLowerCase() === "recording_based"
                              ? true
                              : false
                          }
                          className="editbtn"
                        >
                          {allWords.editpanelist}
                          {/* <img /> */}
                        </button>
                      </>
                    </div>
                  ) : (
                    <>
                      <button
                        id="emp_btn"
                        style={{
                          visibility: "hidden",
                          userSelect: "none",
                          height: "1.8rem",
                          width: "6rem",
                        }}
                      ></button>
                      <button
                        id="share_button"
                        onClick={handleClick}
                        className={
                          status === "upcoming"
                            ? "shareBtnRTL"
                            : "shareBtnRTL shareLP"
                        }
                        hidden={
                          open_to_all === "confidential" ||
                          open_to_all === "secret"
                            ? true
                            : false
                        }
                      >
                        <ShareOutlined
                          id="share_icon_button"
                          className="icon"
                          style={{
                            width: "20px",
                            height: "20px",
                          }}
                        />{" "}
                        {allWords.snip.share}
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <button
                    id="emp_btn"
                    style={{
                      visibility: "hidden",
                      userSelect: "none",
                      height: "1.8rem",
                      width: "6rem",
                    }}
                  ></button>
                  <button
                    id="share_button"
                    onClick={handleClick}
                    className={
                      status === "upcoming"
                        ? "shareBtnRTL"
                        : "shareBtnRTL shareLP"
                    }
                    hidden={
                      open_to_all === "confidential" || open_to_all === "secret"
                        ? true
                        : false
                    }
                  >
                    <ShareOutlined
                      id="share_icon_button"
                      className="icon"
                      style={{
                        width: "20px",
                        height: "20px",
                      }}
                    />{" "}
                    {allWords.misc.share}
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <button
                id="emp_btn"
                style={{
                  visibility: "hidden",
                  userSelect: "none",
                  height: "1.8rem",
                  width: "6rem",
                }}
              ></button>
              <button
                id="share_button"
                onClick={handleClick}
                className={
                  status === "upcoming" ? "shareBtnRTL" : "shareBtnRTL shareLP"
                }
                hidden={
                  open_to_all === "confidential" || open_to_all === "secret"
                    ? true
                    : false
                }
              >
                <ShareOutlined
                  id="share_icon_button"
                  className="icon"
                  style={{ width: "20px", height: "20px" }}
                />{" "}
                {allWords.misc.share}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
