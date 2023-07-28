import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Components
import CommonHeader from "../../components/CommonHeader";
import RightSideBar from "../../components/RightSideBar";
import RoundTableTimeline from "../../components/RoundTableTImeline";
import CustomizedSnackbars from "../../components/Snackbar.component";
import Categories from "./Categories";
import ConfirmRoundTable from "./Confirm";
import Newroundtable from "./Create";
import Invite from "./Invite";
import ModPan from "./ModeratorandPanelist";
import RTAwesome from "./RTAwesome";

// Style
import { CenterDiv, MainDiv, RightDiv } from "./style";

// Constants
import {
  IS_ANDROID_OR_IOS,
  REACT_APP_BASE_URL_CLOUDFRONT,
  REACT_APP_BASE_URL_FOR_ROUNDTABLE,
  RT_MEDIA_URL,
} from "../../constants/env";

// Utils
import ToastHandler from "../../utils/ToastHandler";
import { auto_login_continue, validDocType } from "../../utils/utils";

// Data
import { allowed_extensions } from "../../data";

// Assets
import { allWords } from "../../App";
import DocsDefaultPng from "../../assets/images/docs_default.png";
import ExcelIcon from "../../assets/images/excel_bg_icon.png";
import PdfSVG from "../../assets/images/PDF_file_icon.svg";
import PptIcon from "../../assets/images/powerpoint-icon.png";
import PptVG from "../../assets/images/ppt_doc.png";
import DocIcon from "../../assets/images/word_bg_icon.png";
import WordSVG from "../../assets/images/word_doc.png";
import ExcelSVG from "../../assets/images/xls_doc.png";

const RoundTable = ({ progress }) => {
  // global state
  const rtDocument = useSelector((state) => state.single_rt.document);
  const roundtableID = useSelector(
    (state) => state.create_edit_rt.data?.data?.data?.[0]?.["_id"]
  );
  const rtAction = useSelector((state) => state.rtActionRed.data);

  const current_user = JSON.parse(
    localStorage.current_user || localStorage.anonymous_user
  );

  const location = useLocation();

  const [url_params, setUrlParams] = useState(new URL(window.location.href));
  const [url_rt_id, setURLRTId] = useState(
    url_params.searchParams.get("id")
      ? url_params.searchParams.get("id")
      : location?.state?.type !== "create"
      ? url_params.pathname.split("/").pop()
      : ""
  );

  //Timeline Navigation
  const [progress_name, setProgressName] = useState("");
  const [progress_one, setProgressOne] = useState(0);
  const [progress_two, setProgressTwo] = useState(0);
  const [progress_three, setProgressThree] = useState(0);
  const [progress_four, setProgressFour] = useState(0);
  const [parsed_data, setParsedData] = useState(location?.state?.rt_details);

  //RT Creation Edgecase handling
  const [is_created, setIsCreated] = useState(false);
  const [created_rtid, setCreatedID] = useState(null);
  const [wip_rt_id, setWIPRTId] = useState(null);
  const [sendData, setSendData] = useState(
    url_params.searchParams.get("id") === null
      ? []
      : location?.state?.rt_details
  );
  const [created_at, setCreatedAt] = useState("");
  const [transferRightFlag, setTransferRightFlag] = useState(false);
  const [owner_flag, setOwnerFlag] = useState({
    flag: false,
    text: "",
  });
  const [ownerName, setOwnerName] = useState("");
  // Image Variables
  const [images, setImages] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [image_name, setImageName] = useState("");
  const [imageUrls, setImageUrl] = useState([]);
  const [imgUpFlag, setImgUpFlag] = useState(false);
  const [imgDelFlag, setImgDelFlag] = useState(false);
  const [img, setImg] = useState([]);
  // Doc Variables
  const [docName, setDocName] = useState([]);
  const [docs, setDocs] = useState([]);
  const [document_name, setDocumentName] = useState("");
  const [previous_document, setPreviousDocument] = useState("");
  const [doc_target_files, setDocTargetFiles] = useState(null);
  const [docUpFlag, setDocUpFlag] = useState(false);
  const [docDelFlag, setDocDelFlag] = useState(false);
  const [docImg, setDocImg] = useState([]);
  const [DocSvg, setDocSvg] = useState();
  const [pdf, setPdf] = useState(false);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [durationHr, setDurationHr] = useState({
    label: `0 ${allWords.misc.livert.h}`,
    value: "0",
  });
  const [durationMin, setDurationMin] = useState({
    label: `30 ${allWords.misc.livert.m}`,
    value: "30",
  });

  // Multiple Logos
  const [logoUrls1, setLogoUrl1] = useState([]);
  const [logoDelFlag1, setLogoDelFlag1] = useState(false);
  const [logo1, setLogo1] = useState([]);

  const [logoUrls2, setLogoUrl2] = useState([]);
  const [logoDelFlag2, setLogoDelFlag2] = useState(false);
  const [logo2, setLogo2] = useState([]);

  const [logoUrls3, setLogoUrl3] = useState([]);
  const [logoDelFlag3, setLogoDelFlag3] = useState(false);
  const [logo3, setLogo3] = useState([]);

  // Intro video1
  const [ivideoUrls, setiVideoUrl] = useState([]);
  const [ividDelFlag, setiVidDelFlag] = useState(false);
  const [ivid, setiVid] = useState([]);

  // Outro video1
  const [ovideoUrls, setOVideoUrl] = useState([]);
  const [ovidDelFlag, setOVidDelFlag] = useState(false);
  const [ovid, setOVid] = useState([]);

  // Recording Video
  const [recordVideoUrls, setRecordVideoUrls] = useState([]);
  const [recordDel, setRecordDel] = useState(false);
  const [recVid, setRecVid] = useState([]);

  const [open, setOpen] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");

  const [dateValue, setDateValue] = useState(
    moment(new Date()).add(30, "minutes")
  );
  const [timeValue, setTimeValue] = useState(
    moment(new Date()).add(30, "minutes")
  );
  const [schedule, setSchedule] = useState(true);
  const [disableRecord, setDisableRecord] = useState(false);
  const [loc, setLoc] = useState("not_record");
  const [shareProgress, setShareProgress] = useState(false);

  const navigate = useNavigate();

  // useRef
  const recVidRef = useRef(null);

  useEffect(() => {
    if (location?.state?.rt_page === "record") {
      setSchedule(false);
      setDisableRecord(true);
    }
  }, [location]);

  function handleDurMin(min_value) {
    setDurationMin({ min_value });
  }

  function handleDurHr(hr_value) {
    setDurationHr({ hr_value });

    if (parseInt(hr_value?.label) === 24) {
      handleDurMin({
        label: `0 ${allWords.misc.livert.m}`,
        value: "0",
      });
    } else if (parseInt(hr_value?.label) === 0) {
      handleDurMin({
        label: `30 ${allWords.misc.livert.m}`,
        value: "30",
      });
    }
  }

  const new_rt_ref = useRef("");

  useEffect(() => {
    if (shareProgress) {
      if (rtAction && rtAction?.data?.status == 200) {
        setShareProgress(false);
        setRedirectUrl(rtAction?.data?.data?.[0]?.url);
      }
    }
  }, [rtAction]);

  const callDeepLink = async () => {
    dispatch(rtActionData({ rt_id: rt_id, action: "SHARE" }));
    setShareProgress(true);
  };

  useEffect(() => {
    if (
      IS_ANDROID_OR_IOS &&
      url_params.searchParams.get("id") &&
      redirectUrl === ""
    ) {
      callDeepLink();
    }

    setLoc(location?.state?.rt_page);
  }, []);

  useEffect(() => {
    if (url_rt_id) {
      setIsCreated(true);
    }
  }, []);

  useEffect(() => {
    if (parsed_data === undefined) {
      if (url_params.pathname.includes("edit")) {
        navigate(`/roundtable?id=${url_params.pathname.split("/")[4]}`);
      }
    }
  }, [parsed_data, url_params]);

  useEffect(() => {
    if (location?.state?.rt_details !== undefined) {
      setSendData(location?.state?.rt_details);
    }
  }, [location]);

  useEffect(() => {
    if (url_rt_id && !wip_rt_id) {
      if (parsed_data) {
        if (imgDelFlag !== true) {
          if (parsed_data?.["media"]?.length === 0) {
            setImageUrl("");
          }

          if (parsed_data?.["media"]?.length > 0) {
            setImageUrl(
              `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${parsed_data?.["owner"]?.["user_id"]}/roundtable/${parsed_data?.["_id"]}/profile/${parsed_data?.["media"]?.[0]?.["metadata"]?.["tempFilename"]}`
            );
            setImageName(
              parsed_data?.["media"]?.[0]?.["metadata"]?.["tempFilename"]
            );
          }
        }
        if (logoDelFlag1 !== true) {
          if (parsed_data?.["org_logo_url"]) {
            setLogoUrl1(parsed_data?.["org_logo_url"]);
          }
        }
        if (logoDelFlag2 !== true) {
          if (parsed_data?.["brand_logo_url"]) {
            setLogoUrl2(parsed_data?.["brand_logo_url"]);
          }
        }
        if (logoDelFlag3 !== true) {
          if (parsed_data?.["sub_brand_logo_url"]) {
            setLogoUrl3(parsed_data?.["sub_brand_logo_url"]);
          }
        }
        if (ividDelFlag !== true) {
          if (parsed_data?.["intro_url"]) {
            setiVideoUrl(parsed_data?.["intro_url"]);
          }
        }
        if (ovidDelFlag !== true) {
          if (parsed_data?.["outro_url"]) {
            setOVideoUrl(parsed_data?.["outro_url"]);
          }
        }
      }
    }
  }, [parsed_data, sendData]);

  const imgValidation = (e, title) => {
    const imgFile = e.target.files[0];
    if (imgFile) {
      if (title === "image") {
        if (Math.round(imgFile?.size / 1024) > 1024 * 15) {
          ToastHandler("warn", "Upload an image less than 15 MB.");
          e.target.value = null;
          return false;
        }
      } else {
        if (Math.round(imgFile?.size / 1024) > 1024 * 1) {
          ToastHandler("warn", "Upload an image less than 1 MB.");
          e.target.value = null;
          return false;
        }
      }
    }
    if (!imgFile?.name.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG)$/)) {
      ToastHandler("warn", allWords.misc.toastMsg.invalidImgFormat);
      return false;
    }
    if (title === "image") {
      setImages([imgFile]);
      setImg(imgFile);
      if (e.target.files) {
        setImageUrl(URL.createObjectURL(e.target.files[0]));
      }
    } else if (title === "logo1") {
      setLogo1(imgFile);
      if (e.target.files) {
        setLogoUrl1(URL.createObjectURL(e.target.files[0]));
      }
    } else if (title === "logo2") {
      setLogo2(imgFile);
      if (e.target.files) {
        setLogoUrl2(URL.createObjectURL(e.target.files[0]));
      }
    } else if (title === "logo3") {
      setLogo3(imgFile);
      if (e.target.files) {
        setLogoUrl3(URL.createObjectURL(e.target.files[0]));
      }
    }
  };

  const onImageChange = (rt_id, imgFile) => {
    try {
      var reader = new FileReader();
      reader.onloadend = function () {
        var FormData = require("form-data");
        var data = new FormData();
        data.append("image", imgFile);
        data.append("roundtable_id", rt_id);

        var config = {
          method: "post",
          url: `${RT_MEDIA_URL}`,
          headers: {
            Authorization: `Bearer ${localStorage.access}`,
            "Content-Type": "multipart/form-data",
          },
          data: data,
        };
        setUploadingFiles(true);
        axios(config)
          .then(async (res) => {
            let image_link = res.data.data[0];
            let image_link_spilt = image_link.split("/");
            setImageName(image_link_spilt[8]);
            setUploadingFiles(false);
          })
          .catch(async (e) => {
            const res = e.response;

            if (!res) return;
            if (res.status === 401) {
              return await auto_login_continue(() => onImageChange(e));
            }
            setUploadingFiles(false);
          });
      };
      reader.readAsDataURL(imgFile);
    } catch (err) {
      return;
    }
  };

  const onDocImageDelete = (rt_id, fileName, file) => {
    let data = null;

    data = {
      roundtable_id: !url_rt_id ? rt_id : url_rt_id,
      file_name: fileName,
    };

    var config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/delete-media/`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios(config)
      .then(async (res) => {
        if (res.status === 200) {
          if (file === "image") {
            setImageName("");
            setImageUrl("");
          } else {
            setDocumentName("");
            setDocName([]);
          }
        }
      })
      .catch(async (e) => {
        const res = e.response;
        if (!res) return;
        if (res.status === 401) {
          return await auto_login_continue(onDocImageDelete);
        }
      });
  };

  useEffect(() => {
    if (rtDocument) {
      const dataurl = rtDocument;

      function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(","),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
      }

      const document = dataURLtoBlob(dataurl);

      if (document.type === "application/pdf") {
        setDocImg(DocsDefaultPng);
        setDocs([{ type: "application/pdf" }]);
        setDocSvg(PdfSVG);
        setPdf(true);
      } else if (
        document.type === "application/msword" ||
        document.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setDocImg(DocIcon);
        setDocSvg(WordSVG);
      } else if (
        document.type === "application/vnd.ms-powerpoint" ||
        document.type ===
          "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ) {
        setDocImg(PptIcon);
        setDocSvg(PptVG);
      } else if (
        document.type === "application/vnd.ms-excel" ||
        document.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setDocImg(ExcelIcon);
        setDocSvg(ExcelSVG);
      }
      setDocs([document]);

      // setDocName(doc_filename);
    }
  }, []);

  const docValidation = (e) => {
    const docFile = e.target.files[0];
    let filePath = docFile?.name;
    if (!docFile) {
      ToastHandler("warn", "Please select documents.");
      return false;
    }
    // Allowing file type
    var allowedExtensions = /(\.pdf|\.xls|\.xlsx|\.doc|\.docx|\.ppt|\.pptx)$/i;
    if (!allowedExtensions.exec(filePath)) {
      ToastHandler(
        "warn",
        "Invalid file format. Please upload pdf, doc, ppt, xlx files."
      );
      e.target.value = null;
      return false;
    }
    if (e.target.files[0]) {
      let size = e.target.files[0].size;
      if (Math.round(size / 1024) > 1024 * 15) {
        ToastHandler("warn", "Upload a file less than 15 MB.");
        e.target.value = null;
        return false;
      }
    }

    if (
      docFile.type === "application/msword" ||
      docFile.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      setDocImg(DocIcon);
      setDocSvg(WordSVG);
      setPdf(false);
    } else if (
      docFile.type === "application/vnd.ms-powerpoint" ||
      docFile.type ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      setDocImg(PptIcon);
      setDocSvg(PptVG);
      setPdf(false);
    } else if (
      docFile.type === "application/vnd.ms-excel" ||
      docFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setDocImg(ExcelIcon);
      setDocSvg(ExcelSVG);
      setPdf(false);
    } else {
      setDocImg(DocsDefaultPng);
      if (docFile.type === "application/pdf") {
        setDocSvg(PdfSVG);
        setPdf(true);
      }
    }

    setDocName(docFile.name);

    const is_valid_document = validDocType(docFile.name, allowed_extensions);

    if (!is_valid_document || ![...e.target.files]) {
      ToastHandler("warn", "Please select valid documents.");
      setDocImg(null);
      return false;
    } else {
      setDocs([...e.target.files]);
      setDocTargetFiles(e.target.files[0]);
    }
  };

  const onDocChange = (e, rt_id) => {
    try {
      setDocDelFlag(true);

      var reader = new FileReader();
      reader.onloadend = function () {
        var FormData = require("form-data");
        var data = new FormData();
        data.append("doc", e);
        data.append("roundtable_id", rt_id);

        var config = {
          method: "post",
          url: `${RT_MEDIA_URL}`,
          headers: {
            Authorization: `Bearer ${localStorage.access}`,
            "Content-Type": "multipart/form-data",
          },
          data: data,
        };
        setUploadingFiles(true);
        axios(config)
          .then(async (res) => {
            let image_link = res.data.data[0];
            let image_link_spilt = image_link.split("/");
            setDocumentName(image_link_spilt[8]);
            setUploadingFiles(false);
          })
          .catch(async (e) => {
            const res = e.response;
            if (!res) {
              return setUploadingFiles(false);
            }
            if (res.status === 401) {
              return await auto_login_continue(() => onDocChange(e));
            }
            setUploadingFiles(false);
          });
      };
      reader.readAsDataURL(e);
    } catch (err) {
      return;
    }
  };

  const vidValidation = (e, title, duration) => {
    const videoFile = e.target.files[0];
    if (!videoFile) {
      ToastHandler("warn", "Please select video.");
      return false;
    }

    if (title === "record") {
      if (!videoFile.name.match(/\.(mp4|MP4|mp3|MP3)$/)) {
        ToastHandler("warn", allWords.misc.toastMsg.invalidVidAudFormat);
        return false;
      }
    } else {
      if (!videoFile.name.match(/\.(mp4|MP4)$/)) {
        ToastHandler("warn", allWords.misc.toastMsg.invalidVideoFormat);
        return false;
      }
    }

    if (title === "intro") {
      setiVid(videoFile);
      if (e.target.files) {
        setiVideoUrl(URL.createObjectURL(e.target.files[0]));
      }
    } else if (title === "outro") {
      setOVid(videoFile);
      if (e.target.files) {
        setOVideoUrl(URL.createObjectURL(e.target.files[0]));
      }
    } else if (title === "record") {
      setRecVid(videoFile);
      if (e.target.files) {
        setRecordVideoUrls(URL.createObjectURL(e.target.files[0]));
      }
    }
  };

  function getHoursMinutes(endTime, startTime) {
    var timeout = new Date(endTime).getTime();
    var now = new Date(startTime).getTime();
    const total = timeout - now;
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return {
      hours,
      minutes,
      days,
    };
  }

  const handleClose = () => {
    setOpen(false);
  };

  function getHeaderTitle() {
    const isReviewTitle =
      !url_params.searchParams.get("id") && progress === "step5";
    const rtType = location?.state?.rt_details?.r_type;

    if (isReviewTitle) {
      return allWords.misc.review.title;
    }

    if (rtType === "RECORDING_BASED") {
      return allWords.misc.recrte;
    }

    return allWords.th.rt;
  }

  return (
    <>
      {open && (
        <CustomizedSnackbars
          open={open}
          handleClose={handleClose}
          redirectUrl={redirectUrl}
        />
      )}
      <MainDiv
        style={{
          height:
            !localStorage.current_user && localStorage.anonymous_user
              ? "80vh"
              : "100vh",
        }}
      >
        <CenterDiv style={{ padding: "0 , 20px" }}>
          <div
            className={
              progress === "step5" || progress === "step7"
                ? "d-flex justify-content-between"
                : "d-flex justify-content-between mb-4"
            }
          >
            <CommonHeader
              origin="/roundtable/all"
              title={getHeaderTitle()}
              progressH={progress}
              progress_one={progress_one}
              progress_name={progress_name}
              progress_two={progress_two}
              progress_three={progress_three}
              progress_four={progress_four}
            />

            {progress === "step4" && (
              <Link
                to="#"
                onClick={() => {
                  setSendData(sendData);
                  // setProgress("step5");
                }}
                style={{
                  color: "#63779C",
                  fontWeight: "bold",
                  height: "2rem",
                  marginTop: "25px",
                  display: "none",
                }}
              >
                {allWords.misc.skip}
              </Link>
            )}
            {progress === "step3" && (
              <Link
                to="#"
                onClick={() => {
                  setSendData(sendData);
                  // setProgress("step4");
                }}
                style={{
                  color: "#63779C",
                  fontWeight: "bold",
                  height: "2rem",
                  marginTop: "25px",
                  display: "none",
                }}
              >
                {allWords.misc.skip}
              </Link>
            )}
          </div>

          {loc !== "record" && (
            <>
              {progress !== "step5" &&
                progress !== "step6" &&
                progress !== "step7" && (
                  <RoundTableTimeline
                    // setProgress={setProgress}
                    progress={progress}
                    url_rt_id={url_rt_id}
                    setSendData={setSendData}
                    sendData={sendData}
                    wip_rt_id={wip_rt_id}
                    created_rtid={created_rtid}
                    new_rt_ref={new_rt_ref}
                    progress_one={progress_one}
                    progress_two={progress_two}
                    progress_three={progress_three}
                    progress_four={progress_four}
                    navigate={navigate}
                  />
                )}
            </>
          )}

          <section>
            {progress === "step1" && (
              <Newroundtable
                url_rt_id={url_rt_id}
                navigate={navigate}
                // setProgress={setProgress}
                is_created={is_created}
                setIsCreated={setIsCreated}
                wip_rt_id={wip_rt_id}
                setWIPRTId={setWIPRTId}
                setSendData={setSendData}
                sendData={sendData}
                ref={new_rt_ref}
                setProgressOne={setProgressOne}
                created_at={created_at}
                setCreatedAt={setCreatedAt}
                parsed_data={parsed_data}
                setParsedData={setParsedData}
                setOwnerName={setOwnerName}
                durationHr={durationHr}
                setDurationHr={setDurationHr}
                durationMin={durationMin}
                setDurationMin={setDurationMin}
                handleDurHr={handleDurHr}
                handleDurMin={handleDurMin}
                dateValue={dateValue}
                setDateValue={setDateValue}
                timeValue={timeValue}
                setTimeValue={setTimeValue}
                getHoursMinutes={getHoursMinutes}
                location={location}
                url_params={url_params}
                schedule={schedule}
                setSchedule={setSchedule}
                disableRecord={disableRecord}
                imageUrls={imageUrls}
                setImageUrl={setImageUrl}
                image_name={image_name}
                imgValidation={imgValidation}
                onImageChange={onImageChange}
                onDocImageDelete={onDocImageDelete}
                setImgDelFlag={setImgDelFlag}
                recordVideoUrls={recordVideoUrls}
                setRecordVideoUrls={setRecordVideoUrls}
                recordDel={recordDel}
                setRecordDel={setRecordDel}
                recVid={recVid}
                setRecVid={setRecVid}
                vidValidation={vidValidation}
                setProgressName={setProgressName}
                recVidRef={recVidRef}
                loc={loc}
                current_user={current_user}
              />
            )}
            {progress === "step2" && (
              <ModPan
                wip_rt_id={wip_rt_id || roundtableID}
                wip_id_flag={!!wip_rt_id}
                url_rt_id={url_rt_id}
                navigate={navigate}
                // setProgress={setProgress}
                setSendData={setSendData}
                sendData={sendData}
                ref={new_rt_ref}
                setProgressTwo={setProgressTwo}
                parsed_data={parsed_data}
                setParsedData={setParsedData}
                transferRightFlag={transferRightFlag}
                setTransferRightFlag={setTransferRightFlag}
                owner_flag={owner_flag}
                setOwnerFlag={setOwnerFlag}
                ownerName={ownerName}
                current_user={current_user}
                getHoursMinutes={getHoursMinutes}
                handleDurHr={handleDurHr}
                handleDurMin={handleDurMin}
                durationHr={durationHr}
                durationMin={durationMin}
                location={location}
                url_params={url_params}
                progress_name={progress_name}
                setDateValue={setDateValue}
                setTimeValue={setTimeValue}
              />
            )}
            {progress === "step3" && (
              <Categories
                // setProgress={setProgress}
                progress={progress}
                url_rt_id={url_rt_id}
                navigate={navigate}
                wip_rt_id={wip_rt_id || roundtableID}
                wip_id_flag={!!wip_rt_id}
                setSendData={setSendData}
                sendData={sendData}
                ref={new_rt_ref}
                setProgressThree={setProgressThree}
                parsed_data={parsed_data}
                setParsedData={setParsedData}
                image_name={image_name}
                setImageName={setImageName}
                imageUrls={imageUrls}
                setImageUrl={setImageUrl}
                images={images}
                setImages={setImages}
                uploadingFiles={uploadingFiles}
                setUploadingFiles={setUploadingFiles}
                imgValidation={imgValidation}
                onImageChange={onImageChange}
                onDocImageDelete={onDocImageDelete}
                setImgUpFlag={setImgUpFlag}
                setImgDelFlag={setImgDelFlag}
                categories={categories}
                setCategories={setCategories}
                tags={tags}
                setTags={setTags}
                progress_name={progress_name}
                docName={docName}
                setDocName={setDocName}
                doc_target_files={doc_target_files}
                setDocTargetFiles={setDocTargetFiles}
                docs={docs}
                setDocs={setDocs}
                document_name={document_name}
                setDocumentName={setDocumentName}
                previous_document={previous_document}
                setPreviousDocument={setPreviousDocument}
                rtDocument={rtDocument}
                docUpFlag={docUpFlag}
                setDocUpFlag={setDocUpFlag}
                docDelFlag={docDelFlag}
                setDocDelFlag={setDocDelFlag}
                docValidation={docValidation}
                onDocChange={onDocChange}
                docImg={docImg}
                setDocImg={setDocImg}
                DocSvg={DocSvg}
                setDocSvg={setDocSvg}
                url_params={url_params}
                logoUrls1={logoUrls1}
                setLogoUrl1={setLogoUrl1}
                logoUrls2={logoUrls2}
                setLogoUrl2={setLogoUrl2}
                logoUrls3={logoUrls3}
                setLogoUrl3={setLogoUrl3}
                setLogoDelFlag1={setLogoDelFlag1}
                setLogoDelFlag2={setLogoDelFlag2}
                setLogoDelFlag3={setLogoDelFlag3}
                ivideoUrls={ivideoUrls}
                setiVideoUrl={setiVideoUrl}
                vidValidation={vidValidation}
                setiVidDelFlag={setiVidDelFlag}
                ovideoUrls={ovideoUrls}
                setOVideoUrl={setOVideoUrl}
                setOVidDelFlag={setOVidDelFlag}
                setLogo1={setLogo1}
                setLogo2={setLogo2}
                setLogo3={setLogo3}
                setiVid={setiVid}
                setOVid={setOVid}
              />
            )}
            {progress === "step4" && (
              <Invite
                // setProgress={setProgress}
                url_rt_id={url_rt_id}
                navigate={navigate}
                setURLRTId={setURLRTId}
                setSendData={setSendData}
                sendData={sendData}
                wip_rt_id={wip_rt_id || roundtableID}
                wip_id_flag={!!wip_rt_id}
                ref={new_rt_ref}
                setProgressName={setProgressName}
                progress_name={progress_name}
                setCreatedID={setCreatedID}
                parsed_data={parsed_data}
                setParsedData={setParsedData}
                setProgressFour={setProgressFour}
                url_params={url_params}
              />
            )}
            {progress === "step5" && (
              <ConfirmRoundTable
                // setProgress={setProgress}
                rtType={loc}
                progress={progress}
                url_rt_id={url_rt_id}
                navigate={navigate}
                setURLRTId={setURLRTId}
                sendData={sendData}
                setSendData={setSendData}
                wip_rt_id={wip_rt_id || roundtableID}
                wip_id_flag={!!wip_rt_id}
                progress_name={progress_name}
                parsed_data={parsed_data}
                setParsedData={setParsedData}
                transferRightFlag={transferRightFlag}
                setTransferRightFlag={setTransferRightFlag}
                owner_flag={owner_flag}
                setOwnerFlag={setOwnerFlag}
                ownerName={ownerName}
                categories={categories}
                setCategories={setCategories}
                tags={tags}
                setTags={setTags}
                durationHr={durationHr}
                setDurationHr={setDurationHr}
                durationMin={durationMin}
                setDurationMin={setDurationMin}
                handleDurHr={handleDurHr}
                handleDurMin={handleDurMin}
                dateValue={dateValue}
                setDateValue={setDateValue}
                timeValue={timeValue}
                setTimeValue={setTimeValue}
                imageUrls={imageUrls}
                setImageUrl={setImageUrl}
                // images={images}
                setImages={setImages}
                imgValidation={imgValidation}
                onImageChange={onImageChange}
                onDocImageDelete={onDocImageDelete}
                imgUpFlag={imgUpFlag}
                setImgUpFlag={setImgUpFlag}
                imgDelFlag={imgDelFlag}
                setImgDelFlag={setImgDelFlag}
                docName={docName}
                setDocName={setDocName}
                doc_target_files={doc_target_files}
                setDocTargetFiles={setDocTargetFiles}
                docs={docs}
                setDocs={setDocs}
                document_name={document_name}
                setDocumentName={setDocumentName}
                previous_document={previous_document}
                setPreviousDocument={setPreviousDocument}
                rtDocument={rtDocument}
                docUpFlag={docUpFlag}
                setDocUpFlag={setDocUpFlag}
                docDelFlag={docDelFlag}
                setDocDelFlag={setDocDelFlag}
                onDocChange={onDocChange}
                docImg={docImg}
                setDocImg={setDocImg}
                DocSvg={DocSvg}
                setDocSvg={setDocSvg}
                pdf={pdf}
                setPdf={setPdf}
                docValidation={docValidation}
                img={img}
                progress_one={progress_one}
                progress_two={progress_two}
                logoUrls1={logoUrls1}
                setLogoUrl1={setLogoUrl1}
                logoUrls2={logoUrls2}
                setLogoUrl2={setLogoUrl2}
                logoUrls3={logoUrls3}
                setLogoUrl3={setLogoUrl3}
                logoDelFlag1={logoDelFlag1}
                setLogoDelFlag1={setLogoDelFlag1}
                logoDelFlag2={logoDelFlag2}
                setLogoDelFlag2={setLogoDelFlag2}
                logoDelFlag3={logoDelFlag3}
                setLogoDelFlag3={setLogoDelFlag3}
                ivideoUrls={ivideoUrls}
                setiVideoUrl={setiVideoUrl}
                vidValidation={vidValidation}
                ividDelFlag={ividDelFlag}
                setiVidDelFlag={setiVidDelFlag}
                ovideoUrls={ovideoUrls}
                setOVideoUrl={setOVideoUrl}
                ovidDelFlag={ovidDelFlag}
                setOVidDelFlag={setOVidDelFlag}
                logo1={logo1}
                setLogo1={setLogo1}
                logo2={logo2}
                setLogo2={setLogo2}
                logo3={logo3}
                setLogo3={setLogo3}
                ivid={ivid}
                setiVid={setiVid}
                ovid={ovid}
                setOVid={setOVid}
                disableRecord={disableRecord}
                recVid={recVid}
                recordVideoUrls={recordVideoUrls}
                setRecordVideoUrls={setRecordVideoUrls}
                recVidRef={recVidRef}
                setRecVid={setRecVid}
                setDisableRecord={setDisableRecord}
                recordDel={recordDel}
                setRecordDel={setRecordDel}
                getHoursMinutes={getHoursMinutes}
              />
            )}
            {progress === "step6" && (
              <RTAwesome
                // setProgress={setProgress}
                wip_rt_id={wip_rt_id || roundtableID}
                wip_id_flag={!!wip_rt_id}
                url_rt_id={url_rt_id}
                navigate={navigate}
                setProgressName={setProgressName}
                progress_name={progress_name}
                sendData={sendData}
                parsed_data={parsed_data}
                imageUrls={imageUrls}
                schedule={schedule}
              />
            )}
          </section>
        </CenterDiv>
        <RightDiv>
          <RightSideBar />
        </RightDiv>
      </MainDiv>
    </>
  );
};

export default RoundTable;
