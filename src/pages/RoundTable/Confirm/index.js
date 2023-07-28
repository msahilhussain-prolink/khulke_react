import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import axios from "axios";
import moment from "moment";
import { allWords } from "../../../App";
// Material UI
import {
  CircularProgress,
  Divider,
  Menu as CustomMenu,
  MenuItem,
} from "@mui/material";
import { ShareOutlined } from "@material-ui/icons";

// Constants
import {
  POST_API_BASE_URL,
  REACT_APP_BASE_URL_CLOUDFRONT,
} from "../../../constants/env";

// Assets
import rt_default_image from "../../../assets/images/rt_default_hires.png";

// Redux
import { getPostData } from "../../../redux/actions/postAction";
import { getRTSingleData } from "../../../redux/actions/roundtableAction/single_roundtable";

// Components
import Dialog from "../../../components/LeftSideBar/Dialog";
import InviteeList from "../../../components/InviteeList";
import ViewList from "../../../components/ViewList";
import RoundTableLabels from "../../../components/RoundTableLabels";
import RoundtableButton from "../../../components/RoundtableButton";
import CategoryTag from "../../../components/CategoryTag";
import DocumentAttachment from "../../../components/DocumentAttachment";
import Participants from "../../../components/Participants";
import RoundTableAction from "../../../components/RoundTableActions";
import ReviewTime from "../../../components/ReviewTime";
import ReviewImg from "../../../components/ReviewImg";
import PreloginComp from "../../../components/PreLoginComp";
import Spinner from "../../../components/Spinner";
import MultipleLogo from "../../../components/MultipleLogo";
import IntroOutro from "../../../components/IntroOutro";
import InfoIcon from "../../../components/InfoIcon";
import UploadRecVideo from "../../../components/UploadRecVideo";

// Utils
import { moengageEvent } from "../../../utils/utils";
import ToastHandler from "../../../utils/ToastHandler";
import ReadMoreReadLess from "../../../utils/ReadMoreReadLess";

// style
import "../Create/style.css";
import "./style.css";
import { Status } from "../../../utils/Constant/moderator";
import { rtActionData } from "../../../redux/actions/roundtableAction/rtAction";

const ConfirmRoundTable = ({
  rtType,
  setProgress,
  url_rt_id,
  setURLRTId,
  sendData,
  setSendData,
  wip_rt_id,
  progress_name,
  parsed_data,
  setParsedData,
  transferRightFlag,
  setTransferRightFlag,
  owner_flag,
  setOwnerFlag,
  ownerName,
  categories,
  setCategories,
  tags,
  setTags,
  durationHr,
  durationMin,
  handleDurHr,
  handleDurMin,
  dateValue,
  setDateValue,
  timeValue,
  setTimeValue,
  imageUrls,
  setImageUrl,
  img,
  setImages,
  imgValidation,
  onImageChange,
  imgUpFlag,
  setImgUpFlag,
  imgDelFlag,
  setImgDelFlag,
  docName,
  setDocName,
  doc_target_files,
  setDocTargetFiles,
  docUpFlag,
  setDocUpFlag,
  docDelFlag,
  setDocDelFlag,
  docValidation,
  onDocChange,
  onDocImageDelete,
  docImg,
  setDocImg,
  DocSvg,
  setDocSvg,
  pdf,
  setPdf,
  docs,
  setDocs,
  navigate,
  progress_one,
  progress_two,
  logoUrls1,
  setLogoUrl1,
  logoUrls2,
  setLogoUrl2,
  logoUrls3,
  setLogoUrl3,
  logoDelFlag1,
  setLogoDelFlag1,
  logoDelFlag2,
  setLogoDelFlag2,
  logoDelFlag3,
  setLogoDelFlag3,
  ivideoUrls,
  setiVideoUrl,
  vidValidation,
  ividDelFlag,
  setiVidDelFlag,
  ovideoUrls,
  setOVideoUrl,
  ovidDelFlag,
  setOVidDelFlag,
  logo1,
  setLogo1,
  logo2,
  setLogo2,
  logo3,
  setLogo3,
  ivid,
  setiVid,
  ovid,
  setOVid,
  disableRecord,
  setDisableRecord,
  recVid,
  recVidRef,
  recordVideoUrls,
  setRecordVideoUrls,
  setRecVid,
  recordDel,
  setRecordDel,
  getHoursMinutes,
  wip_id_flag,
}) => {
  const current_user = JSON.parse(
    localStorage.current_user || localStorage.anonymous_user
  );
  const dispatch = useDispatch();

  // Global State
  const single_rt_data = useSelector((state) => state.single_rt.data);
  const single_rt_error = useSelector((state) => state.single_rt.error);
  const rtAction = useSelector((state) => state.rtActionRed.data);

  // Local state
  const [rt_id, setRTId] = useState(null);
  const request_msg_ref = useRef("");
  const [notification_text, setNotificationText] = useState("");
  const [notify_box, setNotifyBox] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [final_message, setFinalMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(Status.UPCOMING);
  // const [parsed_data, setParsedData] = useState(null);
  const [has_error, setHasError] = useState(false);
  const [img_link, setImgLink] = useState(rt_default_image);
  const [invite_count, setInviteCount] = useState("");
  const [invitation_code, setInvitationCode] = useState("");
  const [request_msg, setRequestMsg] = useState("");
  const [doc_link, setDocLink] = useState("");
  const [mod_doc_link, setModDocLink] = useState("");
  const [transferRights, setOwnerRights] = useState("moderator");
  const [anchorEl, setAnchorEl] = useState(null);
  const [startError, setStartError] = useState(false);
  const [desc, setDesc] = useState("");
  const [copyFlag, setCopyFlag] = useState(false);

  const open = Boolean(anchorEl);
  const location = useLocation();

  useEffect(() => {
    if (url_rt_id) {
      dispatch(
        getRTSingleData({
          rt_id: !url_rt_id ? wip_rt_id : url_rt_id,
          token:
            localStorage.access ||
            JSON.parse(localStorage.anonymous_user).token,
        })
      );

      if (!window.location.pathname.includes("review"))
        return moengageEvent("View Details", "RoundTable", {
          RoundTableID: url_rt_id,
          Name:
            sendData?.["name"] !== undefined
              ? sendData?.["name"]
              : parsed_data?.["name"],
          "K Type":
            sendData?.["r_type"] !== undefined
              ? sendData?.["r_type"]
              : parsed_data?.["r_type"],
          "K SubType":
            sendData?.["open_to_all"] !== undefined
              ? sendData?.["open_to_all"]
              : parsed_data?.["open_to_all"],
          "Audience Interaction": 0,
        });
    }
  }, []);

  useEffect(() => {
    if (copyFlag) {
      if (rtAction && rtAction?.data?.status == 200) {
        navigator.clipboard
          .writeText(rtAction?.data?.data?.[0]?.url)
          .then(function () {
            ToastHandler("sus", allWords.misc.succcopied);
          })
          .catch(function () {
            ToastHandler("dan", "Failed. try again!");
          });
      }
    }
  }, [rtAction]);

  const handleCopy = () => {
    dispatch(rtActionData({ rt_id: url_rt_id ?? wip_rt_id, action: "SHARE" }));
    setCopyFlag(true);
  };

  const checkRestrictedUser = (rtResponse) => {
    if (
      rtResponse?.data &&
      rtResponse?.data[0] &&
      current_user._id !== rtResponse?.data[0]?.owner.user_id
    ) {
      const rtData = _.cloneDeep(rtResponse?.data[0]) ?? {};

      //for confidential RT
      if (rtData?.open_to_all === "secret") {
        return true;
      }

      //for cancelled RT
      if (
        rtData.r_type !== "RECORDING_BASED" &&
        rtData.happened_flag &&
        (rtData.join_count === 0 || rtData.is_cancelled)
      ) {
        return true;
      }
    }

    return false;
  };

  const handleShare = () => {
    let data = new FormData();
    data.append(
      "message",
      `{"type":"TEXT","text":"${window.location.origin}/roundtable?id=${rt_id}"}`
    );

    var config = {
      method: "post",
      url: `${POST_API_BASE_URL}/post-media`,
      headers: {
        "device-type": "android",
        "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        ToastHandler("sus", allWords.misc.succcopied);
        dispatch(getPostData());
      })
      .catch();
  };

  useEffect(() => {
    setRTId(!url_rt_id ? wip_rt_id : url_rt_id);
    // setOwnerRights(sendData?.["m_type"]);
    if (sendData?.["m_type"] !== undefined) {
      setTransferRightFlag(sendData?.["m_type"]);
    } else {
      setTransferRightFlag(
        parsed_data?.moderator?.m_type === "moderator" ? false : true
      );
    }

    if (sendData?.["description"] !== undefined) {
      setDesc(sendData?.["description"]);
    } else {
      setDesc(parsed_data?.["description"]);
    }
    if (sendData?.["image_filename"] !== null) {
      setImgLink(sendData?.["image_filename"]);
    }
    if (sendData?.["end_time"] !== undefined) {
      handleDurHr({
        label: sendData?.["durationHr"] + " " + allWords.misc.livert.h,
        value: sendData?.["durationHr"],
      });
      handleDurMin({
        label: sendData?.["durationMin"] + " " + allWords.misc.livert.m,
        value: sendData?.["durationMin"],
      });
    } else {
      let { hours, minutes, days } = getHoursMinutes(
        parsed_data?.["end"]?.split("+")?.[0],
        parsed_data?.["start"]?.split("+")?.[0]
      );

      handleDurHr({
        label: days === 1 ? 24 : hours > 0 ? hours + " Hours" : hours + " Hour",
        value: days === 1 ? 24 : hours,
      });
      handleDurMin({
        label: minutes > 0 ? minutes + " Minutes" : minutes + " Minute",
        value: minutes,
      });
    }
    if (url_rt_id && !location?.state?.rt_record) {
      setHasError(false);
      setFinalMessage("");
      try {
        let temp_parsed_data = null;

        // if (location?.state?.rt_details === undefined && progress_name === "") {
        if (checkRestrictedUser(single_rt_data)) {
          navigate("/roundtable/all");
        } else if (single_rt_data && single_rt_data?.status === 200) {
          temp_parsed_data = single_rt_data?.data?.[0];
        } else if (
          single_rt_data?.status === 255 &&
          single_rt_data?.message === "list index out of range"
        ) {
          navigate("/roundtable/all");
        }
        //   else if (single_rt_data && single_rt_data?.status !== 200) {
        //     navigate("/roundtable/all", { replace: true });
        //   }
        // } else {
        //   temp_parsed_data = location?.state?.rt_details;
        // }

        setParsedData(temp_parsed_data);

        if (temp_parsed_data && !temp_parsed_data["r_type"]) {
          temp_parsed_data["r_type"] = "VIDEO_STREAMING";
        }

        if (temp_parsed_data?.["r_type"] === "RECORDING_BASED") {
          setDisableRecord(true);
          if (recordDel === false) {
            const media = temp_parsed_data?.media_recording?.find((item) =>
              item?.metadata?.ext.includes("m3u8")
                ? item?.metadata?.ext.includes("m3u8")
                : item?.metadata?.mimeType.includes("video") ||
                  item?.metadata?.mimeType.includes("audio")
            );
            setRecordVideoUrls(
              `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${temp_parsed_data?.owner?.user_id}/roundtable/${rt_id}/recording/${media?.metadata?.tempFilename}`
            );
          }
          let hr_diff = moment(new Date(temp_parsed_data?.["end"])).diff(
            new Date(temp_parsed_data?.["start"]),
            "hours"
          );

          let min_diff = moment(new Date(temp_parsed_data?.["end"])).diff(
            new Date(temp_parsed_data?.["start"]),
            "minutes"
          );

          handleDurHr({
            label: hr_diff + " " + allWords.misc.livert.h,
            value: hr_diff,
          });
          handleDurMin({
            label: min_diff + " " + allWords.misc.livert.m,
            value: min_diff,
          });
        }

        if (temp_parsed_data?.["media"]?.length === 0) {
          setImgLink("");
        }

        if (temp_parsed_data?.["media"]?.length > 0) {
          setImgLink(
            `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${temp_parsed_data?.["owner"]?.["user_id"]}/roundtable/${temp_parsed_data?.["_id"]}/profile/${temp_parsed_data?.["media"]?.[0]["metadata"]?.["tempFilename"]}`
          );

          // setModImgLink(
          //   `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${temp_parsed_data?.["moderator"]?.["user_id"]}/roundtable/${temp_parsed_data?.["_id"]}/profile/${temp_parsed_data?.["media"]?.[0]["metadata"]?.["tempFilename"]}`
          // );
        }

        //to get image  ${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/616e84815183e8ee4db05a07/roundtable/61a898f9a7abc516fc959756/profile/upload_616e84815183e8ee4db05a073241.jpeg

        // setParsedData(temp_parsed_data);

        setInvitationCode(temp_parsed_data?.["roundtable_code"]);

        setInviteCount(temp_parsed_data?.["invite_count"]);

        //Setting timestamp labels
        let local_status = "";
        if (temp_parsed_data?.active_flag) {
          local_status = Status.LIVE;
        } else if (temp_parsed_data?.happened_flag) {
          local_status = Status.PAST;
        } else if (temp_parsed_data?.upcoming_flag) {
          local_status = Status.UPCOMING;
        }
        setStatus(local_status);
      } catch (err) {
        setHasError(false);
      }
    }
    if (single_rt_error) {
      // navigate("/roundtable/all", { replace: true });
    }
  }, [single_rt_error, single_rt_data, parsed_data, sendData]);

  const [modalOpen, setModalOpen] = useState(false);
  const handleClick = (event) => {
    if (!localStorage.current_user && localStorage.anonymous_user) {
      return setModalOpen(true);
    }
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const loadData = async () => {
      // Wait for one second
      await new Promise((r) => setTimeout(r, 1500));
      setLoading((loading) => !loading);
    };

    loadData();
  }, []);

  return (
    <section>
      <Helmet>
        <title>
          Khul Ke | Online RoundTable Discussion | RoundTable Conversations
        </title>
        <meta
          name="title"
          content="Khul Ke | Online RoundTable Discussion | RoundTable Conversations"
        />
        <meta
          name="description"
          content="This virtual RoundTable gives you a platform to voice opinions or engage in interesting conversations. Host audio or video RoundTable that can be in Public, Private, and Confidential mode. Share thoughts, opinions, and observations and ask questions to others during RoundTable."
        />
        <meta
          name="keywords"
          content="roundtable conversation, roundtable discussion, roundtable meeting"
        />
        <meta property="og:type" content="website" />

        {/* og */}
        <meta property="og:title" content="RoundTable Discussions On Khul Ke" />
        <meta
          property="og:description"
          content="This virtual RoundTable gives you a platform to voice opinions or engage in interesting conversations. Host audio or video RoundTable that can be in Public, Private, and Confidential mode. Share thoughts, opinions, and observations and ask questions to others during RoundTable."
        />
        {/* <meta property="og:image" content="" /> */}

        {/* twitter */}
        <meta
          name="twitter:title"
          content="RoundTable Discussions On Khul Ke"
        />
        <meta
          name="twitter:description"
          content="This virtual RoundTable gives you a platform to voice opinions or engage in interesting conversations. Host audio or video RoundTable that can be in Public, Private, and Confidential mode. Share thoughts, opinions, and observations and ask questions to others during RoundTable."
        />
        {/* <meta name="twitter:image" content="" /> */}
      </Helmet>
      <h1 id="page-title" style={{ display: "none" }}>
        RoundTable Discussions On Khul Ke
      </h1>
      {has_error ? (
        <div className="contianer-fluid text-center my-5">
          <small className="warn-text">
            Something went wrong! Try again later!
          </small>
        </div>
      ) : (
        <>
          {loading === true ? (
            <Spinner />
          ) : (
            <>
              <section className="pb-5 confirmScreen">
                <ViewList
                  parsed_data={parsed_data}
                  current_user={current_user}
                  rt_id={rt_id}
                  sendData={sendData}
                />

                <div
                  style={{
                    position: "relative",
                    borderRadius: "10px",
                    textAlign: "center",
                  }}
                >
                  <ReviewImg
                    progress_name={progress_name}
                    imageUrls={imageUrls}
                    setImageUrl={setImageUrl}
                    imgValidation={imgValidation}
                    setImgUpFlag={setImgUpFlag}
                    setImgDelFlag={setImgDelFlag}
                  />

                  <RoundtableButton
                    rt_id={rt_id}
                    parsed_data={parsed_data}
                    status={status}
                    current_user={current_user}
                    setNotifyBox={setNotifyBox}
                    setNotificationText={setNotificationText}
                    setRequestMsg={setRequestMsg}
                    request_msg_ref={request_msg_ref}
                  />
                </div>

                <br />
                <div>
                  <small ref={request_msg_ref} className="warn-text">
                    {request_msg}
                  </small>
                </div>

                {/* Section Div  */}
                <RoundTableLabels
                  rtType={rtType}
                  parsed_data={parsed_data}
                  current_user={current_user}
                  url_rt_id={url_rt_id}
                  wip_rt_id={wip_rt_id}
                  wip_id_flag={wip_id_flag}
                  setURLRTId={setURLRTId}
                  progress_name={progress_name}
                  handleClick={handleClick}
                  rt_id={rt_id}
                  sendData={sendData}
                  setSendData={setSendData}
                  status={status}
                  setStatus={setStatus}
                  navigate={navigate}
                  progress_one={progress_one}
                  disableRecord={disableRecord}
                />
                {/* RT Name */}
                <div className="container-fluid w-100 cRTName">
                  <span
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: "bolder",
                      color: "#161F3A",
                      letterSpacing: 0,
                      // textTransform: "capitalize",
                    }}
                  >
                    {sendData?.["name"] !== undefined
                      ? sendData?.["name"]
                      : parsed_data?.["name"]}
                  </span>
                </div>

                {/* RT Description */}
                {sendData?.["description"] || parsed_data?.["description"] ? (
                  <div
                    className="container-fluid w-100"
                    style={{ padding: "0px 0.22rem" }}
                  >
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--muted-dark-color)",
                        // textTransform: "capitalize",
                      }}
                    >
                      <ReadMoreReadLess
                        children={desc}
                        txtColorM={"#ed4d29"}
                        txtColor={"#11141c"}
                      />
                    </span>
                  </div>
                ) : null}

                {/* Time Div  */}
                <ReviewTime
                  sendData={sendData}
                  parsed_data={parsed_data}
                  status={status}
                  progress_name={progress_name}
                  durationHr={durationHr}
                  durationMin={durationMin}
                  handleDurHr={handleDurHr}
                  handleDurMin={handleDurMin}
                  startError={startError}
                  timeValue={timeValue}
                  setTimeValue={setTimeValue}
                  dateValue={dateValue}
                  setDateValue={setDateValue}
                  ownerName={ownerName}
                  disableRecord={disableRecord}
                />

                {disableRecord === false ? (
                  <>
                    {/* Upload Logos (Max 3 )  */}
                    <h6
                      className="rt-strong-labels"
                      style={{ marginTop: "1.8rem" }}
                    >
                      {allWords.misc.review.logos}{" "}
                      <InfoIcon
                        infoTitle1={allWords.misc.pg3.Recommendation}
                        infoTitle6={allWords.misc.pg3.ll1}
                        infoTitle7={allWords.misc.pg3.ll2}
                        infoTitle8={allWords.misc.pg3.l2}
                        infoTitle9={allWords.misc.pg3.ll4}
                      />
                    </h6>

                    <MultipleLogo
                      url_rt_id={url_rt_id}
                      rt_id={rt_id}
                      imgValidation={imgValidation}
                      logoUrls1={logoUrls1}
                      setLogoUrl1={setLogoUrl1}
                      logoUrls2={logoUrls2}
                      setLogoUrl2={setLogoUrl2}
                      logoUrls3={logoUrls3}
                      setLogoUrl3={setLogoUrl3}
                      setLogoDelFlag1={setLogoDelFlag1}
                      setLogoDelFlag2={setLogoDelFlag2}
                      setLogoDelFlag3={setLogoDelFlag3}
                      progress_name={progress_name}
                      setLogo1={setLogo1}
                      setLogo2={setLogo2}
                      setLogo3={setLogo3}
                    />

                    <IntroOutro
                      url_rt_id={url_rt_id}
                      rt_id={rt_id}
                      ivideoUrls={ivideoUrls}
                      setiVideoUrl={setiVideoUrl}
                      vidValidation={vidValidation}
                      setiVidDelFlag={setiVidDelFlag}
                      ovideoUrls={ovideoUrls}
                      setOVideoUrl={setOVideoUrl}
                      setOVidDelFlag={setOVidDelFlag}
                      progress_name={progress_name}
                      setiVid={setiVid}
                      setOVid={setOVid}
                    />

                    {/* Attachment  */}
                    <DocumentAttachment
                      parsed_data={parsed_data}
                      current_user={current_user}
                      status={status}
                      doc_name={docName}
                      setDocName={setDocName}
                      doc_link={doc_link}
                      setDocLink={setDocLink}
                      mod_doc_link={mod_doc_link}
                      setModDocLink={setModDocLink}
                      pdf={pdf}
                      setPdf={setPdf}
                      progress_name={progress_name}
                      docDelFlag={docDelFlag}
                      setDocDelFlag={setDocDelFlag}
                      docValidation={docValidation}
                      docImg={docImg}
                      setDocImg={setDocImg}
                      DocSvg={DocSvg}
                      setDocSvg={setDocSvg}
                      docs={docs}
                      setDocs={setDocs}
                    />

                    {/* Categories And Tags */}
                    {/* <CategoryTag
                      current_user={current_user}
                      parsed_data={parsed_data}
                      sendData={sendData}
                      status={status}
                      progress_name={progress_name}
                      ownerName={ownerName}
                      categories={categories}
                      setCategories={setCategories}
                      tags={tags}
                      setTags={setTags}
                      wip_rt_id={wip_rt_id}
                    /> */}
                  </>
                ) : (
                  <>
                    <UploadRecVideo
                      recordVideoUrls={recordVideoUrls}
                      setRecordVideoUrls={setRecordVideoUrls}
                      vidValidation={vidValidation}
                      recVidRef={recVidRef}
                      setRecVid={setRecVid}
                      setRecordDel={setRecordDel}
                      parsed_data={parsed_data}
                      current_user={current_user}
                      status={status}
                    />
                  </>
                )}

                {/* Participants */}
                <Participants
                  status={status}
                  parsed_data={parsed_data}
                  progress_name={progress_name}
                  current_user={current_user}
                  setProgress={setProgress}
                  setURLRTId={setURLRTId}
                  rt_id={rt_id}
                  sendData={sendData}
                  setSendData={setSendData}
                  url_rt_id={url_rt_id}
                  transferRights={transferRights}
                  setOwnerRights={setOwnerRights}
                  transferRightFlag={transferRightFlag}
                  setTransferRightFlag={setTransferRightFlag}
                  owner_flag={owner_flag}
                  setOwnerFlag={setOwnerFlag}
                  navigate={navigate}
                  location={location}
                  progress_two={progress_two}
                  wip_rt_id={wip_rt_id}
                  disableRecord={disableRecord}
                />

                {disableRecord === false && (
                  <>
                    {/* Invitees */}
                    <InviteeList
                      invite_count={invite_count}
                      parsed_data={parsed_data}
                      current_user={current_user}
                      url_rt_id={url_rt_id}
                      wip_rt_id={wip_rt_id}
                      progress_name={progress_name}
                    />
                  </>
                )}

                {/* Actions  */}
                <RoundTableAction
                  status={status}
                  progress_name={progress_name}
                  parsed_data={parsed_data}
                  current_user={current_user}
                  url_rt_id={url_rt_id}
                  setHasError={setHasError}
                  rt_id={rt_id}
                  setLoading={setLoading}
                  setFinalMessage={setFinalMessage}
                  setProgress={setProgress}
                  sendData={sendData}
                  invitation_code={invitation_code}
                  wip_rt_id={wip_rt_id}
                  setParsedData={setParsedData}
                  startError={startError}
                  setStartError={setStartError}
                  timeValue={timeValue}
                  setTimeValue={setTimeValue}
                  transferRightFlag={transferRightFlag}
                  categories={categories}
                  tags={tags}
                  dateValue={dateValue}
                  durationHr={durationHr}
                  durationMin={durationMin}
                  onImageChange={onImageChange}
                  imgDelFlag={imgDelFlag}
                  onDocChange={onDocChange}
                  onDocImageDelete={onDocImageDelete}
                  docDelFlag={docDelFlag}
                  doc_target_files={doc_target_files}
                  img={img}
                  navigate={navigate}
                  logo1={logo1}
                  logo2={logo2}
                  logo3={logo3}
                  ivid={ivid}
                  ovid={ovid}
                  logoDelFlag1={logoDelFlag1}
                  logoDelFlag2={logoDelFlag2}
                  logoDelFlag3={logoDelFlag3}
                  ividDelFlag={ividDelFlag}
                  ovidDelFlag={ovidDelFlag}
                  disableRecord={disableRecord}
                  recVid={recVid}
                  setSendData={setSendData}
                  recVidRef={recVidRef}
                />

                <div className="my-3">
                  <small className="warn-text">{final_message}</small>
                </div>
              </section>
            </>
          )}
        </>
      )}

      <Dialog
        title={"RoundTable"}
        open={notify_box}
        setOpen={setNotifyBox}
        onCloseBtnClick={() => {
          setNotifyBox(false);
        }}
      >
        <div className="container text-center py-5">
          <small>
            {" "}
            <strong className="text-muted">{notification_text}</strong>{" "}
          </small>
        </div>
      </Dialog>

      <CustomMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div
          style={{
            width: 200,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <MenuItem
            style={{ width: "100%", padding: "0.5rem", margin: "0" }}
            onClick={handleCopy}
          >
            {loadingState ? <CircularProgress /> : null}{" "}
            {allWords.misc.livert.c}
          </MenuItem>

          <Divider />
          <MenuItem
            style={{ width: "100%", padding: "0.5rem", margin: "0" }}
            onClick={handleShare}
          >
            {/* Share on Townhall */}
            {allWords.misc.postit}
          </MenuItem>
          {/* UNCOMMENT WHEN YAPP IS ACTIVATED */}
          {/* 
          <Divider />
          <MenuItem
            style={{ width: "100%", padding: "0.5rem", margin: "0" }}
            onClick={() => {
              alert("Coming Soon!");
            }}
          >
            Share on yapp
          </MenuItem> */}
        </div>
      </CustomMenu>

      <PreloginComp
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        icon={
          <ShareOutlined
            id="share_icon_button"
            className="icon"
            style={{ width: "40px", height: "40px", color: "#f1c40f" }}
          />
        }
        title={"For sharing RoundTable, Login or sign up to Khul Ke"}
        description={""}
      />
    </section>
  );
};
export default ConfirmRoundTable;
