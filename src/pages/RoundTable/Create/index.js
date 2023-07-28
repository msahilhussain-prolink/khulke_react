import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

// Redux
import { createEditData } from "../../../redux/actions/roundtableAction/create_edit_rt";

// Components
import FormInput from "../../../components/FormInput";
import ConfirmButton from "../../../components/ConfirmButton";
import RoundtableButtonTypes from "../../../components/RoundtableButtonTypes";
import RoundtableButtonNature from "../../../components/RoundtableButtonNature";
import CreateModPan from "./CreateModPan";
import RTDuration from "../../../components/RTDuration";
import InfoIcon from "../../../components/InfoIcon";
import UploadImageComp from "../../../components/UploadImageComp";
import UploadRecVideo from "../../../components/UploadRecVideo";

// Style
import "./style.css";
import "./create.css";

// Utils
import ToastHandler from "../../../utils/ToastHandler";
import { REACT_APP_BASE_URL_CLOUDFRONT } from "../../../constants/env";
import { allWords } from "../../../App";
import { moengageEvent } from "../../../utils/utils";

export const popperSx = {
  "& .MuiButtonBase-root": {
    fontWeight: "bold",
    fontSize: "14px",
    width: "40px",
  },
  "& .MuiButtonBase-root.Mui-disabled": {
    border: "transparent",
  },
  "& .MuiPaper-root": {
    borderRadius: "10px",
    marginLeft: "100px",
    marginTop: "10px",
  },
  "& .MuiIconButton-sizeSmall.MuiIconButton-edgeEnd, .MuiIconButton-sizeSmall.MuiIconButton-edgeStart":
    {
      border: "1px solid #e4e9f0",
    },
  "& .MuiButtonBase-root.MuiPickersDay-root.Mui-selected": {
    color: "#fff",
    backgroundColor: "#66b984",
    fontWeight: "bold",
    border: "1px solid var(--muted-gray-color)",
    borderRadius: "10px",
  },
  "& .MuiButtonBase-root.MuiPickersDay-root:not(.Mui-selected):not(.Mui-disabled)":
    {
      // border: "1px solid var(--muted-gray-color)",
      borderRadius: "10px",
    },
  "& .MuiTypography-root": {
    fontWeight: "bold",
    color: "#63779c",
    marginLeft: "3px",
  },
};

export default forwardRef(function Newroundtable(props, ref) {
  const {
    url_rt_id,
    // setProgress,
    is_created,
    setIsCreated,
    wip_rt_id,
    setWIPRTId,
    setSendData,
    sendData,
    setProgressOne,
    created_at,
    setCreatedAt,
    parsed_data,
    setParsedData,
    setOwnerName,
    durationHr,
    setDurationHr,
    durationMin,
    setDurationMin,
    handleDurHr,
    handleDurMin,
    dateValue,
    setDateValue,
    timeValue,
    setTimeValue,
    getHoursMinutes,
    navigate,
    location,
    schedule,
    setSchedule,
    disableRecord,
    imageUrls,
    setImageUrl,
    image_name,
    imgValidation,
    onImageChange,
    onDocImageDelete,
    setImgDelFlag,
    recordVideoUrls,
    setRecordVideoUrls,
    recordDel,
    setRecordDel,
    recVid,
    setRecVid,
    vidValidation,
    setProgressName,
    recVidRef,
    loc,
    current_user,
  } = props;

  const dispatch = useDispatch();

  // Global state
  const create_edit_rt_data = useSelector((state) => state.create_edit_rt.data);

  // Local State
  const [title_message, setTitleMessage] = useState("");
  const [time_message, setTimeMessage] = useState([]);
  const [final_message, setFinalMessage] = useState("");
  const [title, setTitle] = useState("");
  const [anon_opt, setAnonOpt] = useState(false);
  const [is_valid, setIsValid] = useState(false);
  const [description, setDescription] = useState("");
  const [current_month, setCurrentMonth] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [proceed, setProceed] = useState(false);
  // Toggle for Type of Roundtable
  const [rt_type, setRTType] = useState(location?.state?.rtTypes);
  const [rt_nature, setRTNature] = useState("public");
  const [desWordsLeft, setDesWordsLeft] = useState(0);
  const [desWords, setDesWords] = useState(0);
  const [description_error, setDescriptionError] = useState("");
  const [chars_left, setCharsLeft] = useState(0);
  // const [created_at, setCreatedAt] = useState("");
  const [toggle, setToggle] = useState(false);
  const [speakers, setSpeakers] = useState([]);
  const [host, setHost] = useState("");
  const [host_name, setHostName] = useState("");
  const [m_type, setMType] = useState(false);
  const [bio, setBio] = useState("");
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState([]);
  const [followers, setFollowers] = useState(false);
  const [followings, setFollowings] = useState(false);
  const [user_id, setUserId] = useState([]);
  const [past_rt_id, setPastRtId] = useState([]);
  const [email_list, setEmailList] = useState([]);
  const [phone_list, setPhoneList] = useState([]);

  const [moderator, setModerator] = useState("");
  const [moderator_bio, setModeratorBio] = useState("");
  const [selected, setSelected] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const [mod_bio_words, setModBioWords] = useState(0);
  const [panelist, setPanelist] = useState("");
  const [panelist_bio, setPanelistBio] = useState("");
  const [pan_selected, setPanSelected] = useState([]);
  const [pan_bio_words, setPanBioWords] = useState(0);

  const [endTimeValue, setEndTimeValue] = useState(sendData?.["end_time"]);
  const [customStartTime, setCustomStartTime] = useState(
    sendData?.["start_time"] === undefined
      ? moment(parsed_data?.start).local()
      : sendData?.["start_time"]
  );

  // useRef
  const desIntro = useRef("");
  const titleRef = useRef();
  const title_ref = useRef("");
  const time_ref = useRef("");
  const final_ref = useRef("");
  const start_record_ref = useRef();
  const datePicker = useRef();

  let date_obj = new Date();

  useEffect(() => {
    if (url_rt_id || wip_rt_id) {
      setIsUpdate(true);
      setIsValid(true);
      let temp_data = parsed_data;
      if (sendData?.["name"] !== undefined) {
        setTitle(sendData?.["name"]);
      } else {
        setTitle(temp_data?.name);
      }

      if (sendData?.["description"] !== undefined) {
        setDescription(sendData?.["description"]);
      } else {
        setDescription(temp_data?.description);
      }

      if (sendData?.["start_recording"] !== undefined) {
        setToggle(sendData?.["start_recording"] === 1 ? false : true);
      } else {
        setToggle(temp_data?.recording?.[0]?.owner_flag === 1 ? false : true);
      }

      if (sendData?.["open_to_all"] !== undefined) {
        setRTNature(sendData?.["open_to_all"]);
      } else {
        setRTNature(temp_data?.open_to_all);
      }

      if (sendData?.["date"] === undefined) {
        setDateValue(
          moment(new Date(temp_data?.start)).local().format("YYYY-MM-DD")
        );
      }

      if (sendData?.["speakers"] !== undefined) {
        setSpeakers(sendData?.["speakers"]);
      } else {
        setSpeakers(temp_data?.speakers);
      }

      if (sendData?.["host"] !== undefined) {
        setHost(sendData?.["host"]);
      } else {
        setHost(temp_data?.moderator?.username);
      }

      if (sendData?.["m_type"] !== undefined) {
        setMType(sendData?.["m_type"]);
      } else {
        setMType(temp_data?.moderator?.m_type);
      }

      if (sendData?.["host_name"] !== undefined) {
        setHostName(sendData?.["host_name"]);
      } else {
        setHostName(temp_data?.moderator?.name);
      }

      if (sendData?.["bio"] !== undefined) {
        setBio(sendData?.["bio"]);
      } else {
        setBio(temp_data?.moderator?.bio);
      }

      if (sendData?.["category"] !== undefined) {
        setCategory(sendData?.["category"]);
      } else {
        setCategory(temp_data?.category);
      }

      if (sendData?.["tags"] !== undefined) {
        setTags(sendData?.["tags"]);
      } else {
        setTags(temp_data?.tags);
      }

      if (sendData?.["r_type"] !== undefined) {
        if (sendData?.["r_type"].toLowerCase() === "audio_streaming") {
          setRTType("audio");
        } else if (sendData?.["r_type"].toLowerCase() === "video_streaming") {
          setRTType("video");
        }
      } else {
        if (temp_data?.r_type === "AUDIO_STREAMING") {
          setRTType("audio");
        } else if (temp_data?.r_type === "VIDEO_STREAMING") {
          setRTType("video");
        }
      }

      if (sendData?.["anonymous"] !== undefined) {
        setAnonOpt(sendData?.["anonymous"]);
      } else {
        setAnonOpt(temp_data?.owner?.anonymous_flag);
      }

      if (sendData?.["followers"] !== undefined) {
        setFollowers(sendData?.["followers"]);
      } else {
        setFollowers(temp_data?.followers);
      }

      if (sendData?.["following"] !== undefined) {
        setFollowings(sendData?.["following"]);
      } else {
        setFollowings(temp_data?.following);
      }

      if (sendData?.["user_id"] !== undefined) {
        setUserId(sendData?.["user_id"]);
      } else {
        setUserId(temp_data?.user_id);
      }

      if (sendData?.["email_list"] !== undefined) {
        setEmailList(sendData?.["email_list"]);
      } else {
        setEmailList(temp_data?.email_list);
      }

      if (sendData?.["phone_list"] !== undefined) {
        setPhoneList(sendData?.["phone_list"]);
      } else {
        setPhoneList(temp_data?.phone_list);
      }

      if (sendData?.["past_rtid"] !== undefined) {
        setPastRtId(sendData?.["past_rtid"]);
      } else {
        setPastRtId(temp_data?.past_rtid);
      }
      if (sendData?.["start_time"] === undefined) {
        setTimeValue(moment(temp_data?.start).local());
      }

      if (
        parsed_data?.["end"] !== undefined &&
        parsed_data?.["start"] !== undefined
      ) {
        if (sendData?.["durationHr"] === undefined) {
          let { hours, minutes, days } = getHoursMinutes(
            parsed_data?.["end"]?.split("+")?.[0],
            parsed_data?.["start"]?.split("+")?.[0]
          );

          handleDurHr({
            label:
              days === 1 ? 24 : hours > 0 ? hours + " Hours" : hours + " Hour",
            value: days === 1 ? 24 : hours,
          });
          handleDurMin({
            label: minutes > 0 ? minutes + " Minutes" : minutes + " Minute",
            value: minutes,
          });
        }
      }

      if (sendData?.["schedule"] !== undefined) {
        setSchedule(sendData?.["schedule"]);
      } else {
        setSchedule(true);
      }

      if (parsed_data) {
        setCurrentMonth(
          moment(new Date(temp_data?.start)).local().format("MMM")
        );

        setCreatedAt(temp_data?.created_at);
      }

      if (timeValue["_i"] === "Invalid Date") {
        setTimeValue(moment(new Date(temp_data?.start)).local());
      }

      if (temp_data?.r_type === "RECORDING_BASED") {
        setSelected({
          label: temp_data?.["moderator"]?.["username"],
          value: temp_data?.["moderator"]?.["name"],
        });
        setModeratorBio(temp_data?.["moderator"]?.["bio"]);
        setSelectedId(temp_data?.["moderator"]?.["user_id"]);
        setPanelist(temp_data?.["speakers"]?.[0]?.["name"]);
        setPanelistBio(temp_data?.["speakers"]?.[0]?.["bio"]);
        setRecordVideoUrls(
          `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${temp_data?.owner?.user_id}/roundtable/${url_rt_id}/recording/${temp_data?.["media_recording"]?.[0]?.["metadata"]?.["tempFilename"]}`
        );
      }
    } else {
      if (sendData?.length === 0) {
        handleDurHr({
          label: `0 ${allWords.misc.livert.h}`,
          value: "0",
        });
        handleDurMin({
          label: `30 ${allWords.misc.livert.m}`,
          value: "30",
        });
      }

      if (disableRecord === true) {
        setTitle(sendData?.["name"]);
        setDescription(sendData?.["description"]);
        setSchedule(sendData?.["schedule"]);
        setSelected({
          label: sendData?.["moderator"]?.["username"],
          value: sendData?.["moderator"]?.["name"],
        });
        setModeratorBio(sendData?.["moderator"]?.["bio"]);
        setSelectedId(sendData?.["host_id"]);
        setPanelist(
          sendData?.["speakers"]?.[0]?.["speaker_name"] == undefined
            ? ""
            : sendData?.["speakers"]?.[0]?.["speaker_name"]
        );
        setPanelistBio(sendData?.["speakers"]?.[0]?.["bio"]);
        setRTType(sendData?.["r_type"]);
        setIsValid(true);
      }
    }
  }, [sendData, parsed_data]);

  useEffect(() => {
    if (location?.state?.rt_page === "record") {
      if (recordVideoUrls?.length === 0) return setIsValid(false);

      if (recordVideoUrls?.length === 0 && titleRef?.current?.value?.length > 0)
        return setIsValid(true);
    }
  }, [location]);

  useEffect(() => {
    if (url_rt_id) {
      if (description !== "") {
        const des = description?.split(" ");
        setDesWords(des?.length);
      }
    }
  }, [description]);

  const createRT = async () => {
    let date = moment(date_obj).format("MM/DD/YYYY hh:mm A");
    // Validation for time
    let customDate = null;
    let customTime = null;
    if (schedule !== false) {
      customDate = moment(new Date(dateValue)).format("MM/DD/YYYY");
      customTime = moment(new Date(timeValue)).format("hh:mm A");
    } else {
      customDate = moment(new Date()).format("MM/DD/YYYY");
      customTime = moment(new Date()).add(1, "minute").format("hh:mm A");
    }
    let customDateTime = customDate.concat(" ").concat(customTime);

    // Validation for Duration
    let endTime = null;
    endTime = moment(new Date(customDateTime))
      .add(parseInt(durationHr?.["hr_value"]?.["label"]), "hours")
      .add(parseInt(durationMin?.["min_value"]?.["label"]), "minutes")
      .format("MM/DD/YYYY hh:mm A");

    if (!url_rt_id && !wip_rt_id) {
      if (moment(customDateTime).isBefore(date_obj, "hours")) {
        time_ref.current.classList = ["warn-text"];
        setTimeMessage("Start time can not be in the past.");
        return;
      } else if (moment(customDateTime).isBefore(date_obj, "minutes")) {
        time_ref.current.classList = ["warn-text"];
        setTimeMessage("Start time can not be in the past.");
        return;
      } else {
        time_ref.current.classList = [""];
        setProgressOne(1);
        setTimeMessage("");
      }
    } else {
      if (
        moment(new Date(customDateTime)).isBefore(new Date(created_at), "hours")
      ) {
        time_ref.current.classList = ["warn-text"];
        setTimeMessage("Start time can not be in the past.");
        setProgressOne(0);
        return;
      } else if (
        moment(new Date(customDateTime)).isBefore(
          new Date(created_at),
          "minutes"
        )
      ) {
        time_ref.current.classList = ["warn-text"];
        setTimeMessage("Start time can not be in the past.");
        setProgressOne(0);
        return;
      } else {
        time_ref.current.classList = [""];
        setProgressOne(1);
        setTimeMessage("");
      }
    }

    if (
      Math.abs(
        moment(new Date(endTime)).diff(new Date(customDateTime), "minutes")
      ) < 29
    ) {
      time_ref.current.classList = ["warn-text"];
      setTimeMessage("Duration cannot be less than 30 Minutes.");
      return;
    }

    if (
      Math.abs(
        moment(new Date(endTime)).diff(
          new Date(customDateTime),
          "hours",
          "minutes"
        )
      ) > 24
    ) {
      time_ref.current.classList = ["warn-text"];
      setTimeMessage("Duration cannot be more than 24 Hours.");
      return;
    }

    if (customDateTime === date) {
      if (schedule === false) {
        setCustomStartTime(
          moment(new Date(timeValue)).add(1, "minute").format("hh:mm A")
        );
        setEndTimeValue(moment(endTime).add(1, "minute").format("hh:mm A"));
      } else if (schedule === true) {
        time_ref.current.classList = ["warn-text"];
        setTimeMessage("Start time can not be same as current time.");
        setProgressOne(0);
        return;
      }
    }

    let url = "create-rt";

    let data = {
      name: title,
      date: moment(dateValue).format("l"),
      // Reference For UTC
      start_time: moment
        .utc(new Date(customDateTime))
        .format("yyyy-MM-DDTHH:mm:ss+00:00"),
      end_time:
        customDateTime === date
          ? moment
              .utc(new Date(endTime))
              .add(1, "minute")
              .format("yyyy-MM-DDTHH:mm:ss+00:00")
          : moment.utc(new Date(endTime)).format("yyyy-MM-DDTHH:mm:ss+00:00"),
      anonymous: anon_opt,
      visibility: rt_nature,
      open_to_all: rt_nature,
      description: description,
      r_type: rt_type === "text" ? `${rt_type}_based` : `${rt_type}_streaming`,
      start_recording: 1,
    };

    let data1 = {
      durationHr: parseInt(durationHr?.["hr_value"]?.["label"]),
      durationMin: parseInt(durationMin?.["min_value"]?.["label"]),
      schedule: schedule,
      speakers: speakers,
      host: host,
      host_name: host_name,
      bio: bio,
      tags: tags,
      category: category,
      followers: followers,
      following: followings,
      user_id: user_id,
      past_rtid: past_rt_id,
      email_list: email_list,
      phone_list: phone_list,
      user_data: sendData?.["user_data"],
      image_filename: sendData?.["imageUrls"],
      image_upload_name:
        sendData?.["image_upload_name"] !== undefined
          ? sendData?.["image_upload_name"]
          : parsed_data?.["media"]?.[0]?.["metadata"]?.["tempFilename"],
      doc_filename:
        sendData?.["doc_filename"] === undefined
          ? []
          : sendData?.["doc_filename"],
      document_upload_name:
        sendData?.["document_upload_name"] === undefined
          ? ""
          : sendData?.["document_upload_name"],
      previous_document: sendData?.["previous_document"],
      doc_target_files:
        sendData?.["doc_target_files"] === undefined
          ? null
          : sendData?.["doc_target_files"],
      host_id: sendData?.["host_id"],
      m_type: m_type,
    };
    if (url_rt_id) {
      data["roundtable_id"] = url_rt_id;
      if (wip_rt_id) {
        navigate("/roundtable/create/moderator-panelist");
      } else {
        navigate(`/roundtable/edit/moderator-panelist/${url_rt_id}`);
      }
    } else if (is_created && wip_rt_id) {
      data["roundtable_id"] = wip_rt_id;
    }

    if (!url_rt_id) {
      if (sendData?.length === 0) {
        dispatch(createEditData({ url: url, data: data }));
      } else {
        navigate("/roundtable/create/moderator-panelist");
      }
      setProceed(true);
    }
    setSendData({ ...data, ...data1 });
    setProgressOne(1);
  };

  useEffect(() => {
    if (create_edit_rt_data && proceed === true) {
      if (create_edit_rt_data.status === 200) {
        setTimeMessage("");
        setTitleMessage("");
        setFinalMessage("");
        setIsCreated(true);
        setWIPRTId(create_edit_rt_data?.data?.data?.[0]?.["_id"]);
        setCreatedAt(create_edit_rt_data?.data?.data?.[0]?.["created_at"]);
        setOwnerName(
          create_edit_rt_data?.data?.data?.[0]?.["owner"]?.["user_id"] ===
            JSON.parse(
              localStorage.current_user || localStorage.anonymous_user
            )?.["_id"]
            ? JSON.parse(
                localStorage.current_user || localStorage.anonymous_user
              )?.["username"]
            : ""
        );

        let k_type = "";

        moengageEvent("Create", "RoundTable", {
          RoundTableID: create_edit_rt_data?.data?.data?.[0]?.["_id"],
          Name: create_edit_rt_data?.data?.data?.[0]?.["name"],
          "K Type": create_edit_rt_data?.data?.data?.[0]?.["r_type"],
          "K SubType": create_edit_rt_data?.data?.data?.[0]?.["open_to_all"],
          "Audience Interaction": 0,
        });
        navigate("/roundtable/create/moderator-panelist");
      } else {
        if (create_edit_rt_data?.status === 253) {
          if (
            create_edit_rt_data?.data?.message ===
            "Start time of the roundtable has to be at least 30 minutes from now."
          ) {
            navigate("/roundtable/create/moderator-panelist");
          }
          time_ref.current.classList = ["warn-text"];
          try {
            setTimeMessage(create_edit_rt_data?.data?.message?.message);
          } catch (err) {
            setTimeMessage("Duration can not be less than 30 minutes");
          }
        } else {
          time_ref.current.classList = ["warn-text"];
          setTimeMessage("");
        }
        if (create_edit_rt_data?.status === 252) {
          final_ref.current.classList = ["warn-text"];
          setFinalMessage(create_edit_rt_data?.data?.message);
        }
      }
    }
  }, [create_edit_rt_data]);

  useImperativeHandle(ref, () => ({
    saveData() {
      let data = {
        name: title,
        date: moment(dateValue).format("DD/MM/YYYY"),
        start_time: customStartTime,
        end_time: endTimeValue,
        schedule: schedule,
        durationHr: parseInt(durationHr?.["hr_value"]?.["label"]),
        durationMin: parseInt(durationMin?.["min_value"]?.["label"]),
        anonymous: anon_opt,
        visibility: rt_nature,
        open_to_all: rt_nature,
        description: description,
        r_type:
          rt_type === "text" ? `${rt_type}_based` : `${rt_type}_streaming`,
        start_recording: toggle === false ? 1 : 0,
        speakers: speakers,
        host: host,
        host_name: host_name,
        bio: bio,
        category: category,
        followers: followers,
        following: followings,
        user_id: user_id,
        past_rtid: past_rt_id,
        email_list: email_list,
        phone_list: phone_list,
        tags: tags,
        user_data: sendData?.["user_data"],
        image_filename: sendData?.["imageUrls"],
        image_upload_name:
          sendData?.["image_upload_name"] !== undefined
            ? sendData?.["image_upload_name"]
            : parsed_data?.["media"]?.[0]?.["metadata"]?.["tempFilename"],
        doc_filename:
          sendData?.["doc_filename"] === undefined
            ? []
            : sendData?.["doc_filename"],
        document_upload_name:
          sendData?.["document_upload_name"] === undefined
            ? ""
            : sendData?.["document_upload_name"],
        previous_document: sendData?.["previous_document"],
        doc_target_files:
          sendData?.["doc_target_files"] === undefined
            ? null
            : sendData?.["doc_target_files"],
        host_id: sendData?.["host_id"],
        m_type: sendData?.["m_type"],
      };

      setSendData(data);
    },
  }));

  const handleWordLimit = (e) => {
    // if (e?.target?.value?.match(/[\w\d\’\'-]+/gi)?.length > 250) {
    //   return;
    // }
    let text = desIntro.current.value.split(" ").slice(0, 250).join(" ");

    let trimmeddesc = text.trim();
    setDescription(text);

    if (trimmeddesc.includes("\n")) {
      trimmeddesc = trimmeddesc.replace(/\s*\n+/g, "");
    }

    setDesWordsLeft(trimmeddesc.split(" ").length);

    let trimmedRealValue = e.target.value.trim().split(" ");
    if (trimmedRealValue.length > 250) {
      return setDescriptionError(allWords.misc.textError.more_than_250);
    } else if (trimmedRealValue.length < 250) {
      setDescriptionError("");
    }

    const des = description.split(" ");
    setDesWords(des.length);
  };

  useEffect(() => {
    if (url_rt_id || location?.state?.rt_page === "record") {
      if (description) {
        const des = description.split(" ");
        setDesWords(des.length);
      }
    }
  }, [description]);

  useEffect(() => {
    if (url_rt_id || location?.state?.rt_page === "record") {
      if (panelist_bio) {
        const des = panelist_bio.split(" ");
        setPanBioWords(des.length);
      }
    }
  }, [panelist_bio]);

  useEffect(() => {
    if (url_rt_id || location?.state?.rt_page === "record") {
      if (moderator_bio) {
        const des = moderator_bio.split(" ");
        setModBioWords(des.length);
      }
    }
  }, [moderator_bio]);

  const createRecRT = async () => {
    if (titleRef.current.value.length === 0)
      return ToastHandler("warn", allWords.misc.livert.enterValidTitle);

    if (recVidRef?.current === null)
      return ToastHandler("warn", allWords.misc.livert.enterRecordedRT);

    // Temporary comment for 02 Jan 2023 release
    let customDate = null;
    let customTime = null;
    if (schedule !== false) {
      customDate = moment(new Date(dateValue)).format("MM/DD/YYYY");
      customTime = moment(new Date(timeValue)).format("hh:mm A");
    } else {
      customDate = moment(new Date()).format("MM/DD/YYYY");
      customTime = moment(new Date()).add(1, "minute").format("hh:mm A");
    }
    let customDateTime = customDate.concat(" ").concat(customTime);

    let start_time = moment
      .utc(new Date(customDateTime))
      .format("yyyy-MM-DDTHH:mm:ss+00:00");

    let end_time = moment
      .utc(new Date(customDateTime))
      .add(recVidRef?.current?.duration, "seconds")
      .add(5, "seconds")
      .format("yyyy-MM-DDTHH:mm:ss+00:00");

    // let start_time = moment
    //   .utc(new Date())
    //   .subtract(recVidRef?.current?.duration, "seconds")
    //   .subtract(1, "minute")
    //   .format("yyyy-MM-DDTHH:mm:ss+00:00");

    // let end_time = moment
    //   .utc(new Date())
    //   // .subtract(10, "minutes")
    //   .format("yyyy-MM-DDTHH:mm:ss+00:00");

    let hr_diff = Math.floor(
      moment.duration(recVidRef?.current?.duration, "seconds").asHours()
    );

    let min_diff = Math.floor(
      moment.duration(recVidRef?.current?.duration, "seconds").asMinutes()
    );

    let data = {
      date: moment(dateValue).format("l"),
      name: title,
      description: description,
      schedule: schedule,
      speakers:
        panelist === ""
          ? []
          : [
              {
                speaker_id: 1,
                speaker_fullname: panelist,
                speaker_name: panelist,
                index: 1,
                bio: panelist_bio,
                has_confirmed: 0,
                type: "NORMAL",
              },
            ],
      anonymous: false,
      start_time: start_time,
      end_time: end_time,
      durationHr: hr_diff,
      durationMin: min_diff,
      owner: {
        user_id: JSON.parse(localStorage?.current_user)?.["_id"],
        username: JSON.parse(localStorage?.current_user)?.["username"],
        name: JSON.parse(localStorage?.current_user)?.["name"],
      },
      moderator: {
        user_id: selectedId,
        username:
          selected.length === 0
            ? JSON.parse(localStorage?.current_user)?.["username"]
            : selected?.["label"],
        name:
          selected.length === 0
            ? JSON.parse(localStorage?.current_user)?.["name"]
            : selected?.["value"],
        m_type: "moderator",
        bio: moderator_bio,
      },
      r_type:
        sendData?.length !== 0
          ? rt_type
          : recVidRef?.current?.tagName === "VIDEO"
          ? "VIDEO_STREAMING"
          : "AUDIO_STREAMING",
      open_to_all: "public",
      videoDur: recVidRef?.current?.duration,
    };

    setParsedData(data);
    // setDateValue(new Date());
    setSendData(data);

    handleDurHr({
      label: hr_diff + " " + allWords.misc.livert.h,
      value: hr_diff,
    });
    handleDurMin({
      label: min_diff + " " + allWords.misc.livert.m,
      value: min_diff,
    });

    setProgressName("confirm");
    if (!url_rt_id) {
      navigate("/roundtable/create/review", { state: { rt_record: true } });
    } else {
      navigate(`/roundtable/edit/review/${url_rt_id}`);
    }
  };

  return (
    <section>
      {/* Types of Roundtable  */}
      {loc !== "record" && (
        <RoundtableButtonTypes rt_type={rt_type} setRTType={setRTType} />
      )}

      {/* Add Title  */}
      <div>
        <small className="rt-strong-labels-gray">
          {allWords.createRT.addTitle}{" "}
          <span>
            <InfoIcon
              infoTitle3={allWords.createRT.addTitleIbtn.firstLine}
              infoTitle4={allWords.createRT.addTitleIbtn.secondLine}
            />
          </span>
          {" "}
        </small>
        <FormInput
          emotion={title_message.length !== 0 ? "-alert" : ""}
          custom_styles={{ padding: "0.5rem 0.7rem" }}
        >
          <input
            type="text"
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim() === "") {
                title_ref.current.classList = ["warn-text"];
                setTitleMessage(allWords.misc.ttlcantEmpty);
                setIsValid(false);
              } else {
                title_ref.current.classList = ["text-success"];
                setTitleMessage("");
                setIsValid(true);
              }
              setCharsLeft(titleRef.current.value.length);
            }}
            maxLength={"50"}
            value={title}
            placeholder={allWords.createRT.addTitlePlaceholder}
            ref={titleRef}
          />
        </FormInput>
        <div className="d-flex justify-content-between">
          <small ref={title_ref}>{title_message}</small>
          <p style={{ textAlign: "right", marginBottom: "0rem" }}>
            {title?.length || chars_left}/50
          </p>
        </div>
      </div>

      {/* Description  */}
      <div>
        <small className="rt-strong-labels-gray">
          {allWords.createRT.descTitle}
          <span>
            <InfoIcon
              infoTitle3={allWords.createRT.descIBtn.one}
              infoTitle4={allWords.createRT.descIBtn.two}
            />
          </span>
        </small>
        <div>
          <div className="introCount">
            <textarea
              ref={desIntro}
              style={{
                border: "none",
                width: "100%",
                outline: "none",
                resize: "none",
                backgroundColor: "transparent",
              }}
              rows="7"
              wrap="soft"
              onChange={(e) => {
                if (e.target.value.split(" ").length < 251) {
                  setDescription(e.target.value);
                }

                handleWordLimit(e);
              }}
              onKeyPress={(e) => {
                if (
                  e.target.value.split(" ").length >= 250 &&
                  (e.key === " " || e.key === "Enter")
                ) {
                  e.preventDefault();
                }
              }}
              value={description}
              maxLength="2000"
              placeholder={allWords.misc.addDescplaceholder}
            />
            <p style={{ textAlign: "right", marginBottom: "0rem" }}>
              {desIntro.current.value === "" && desWordsLeft === 1
                ? 0
                : desWordsLeft || desWords || "0"}
              /250
            </p>
          </div>
        </div>
        <div className="my-3">
          <small className="warn-text">{description_error}</small>
        </div>
      </div>

      {/* Auto Record */}
      {/* TODO: Will be required in future */}
      {/* {loc !== "record" && (
        <div className="d-flex">
          <div className="mb-3" style={{ marginTop: "20px" }}>
            <small className="rt-strong-labels-gray">
              {allWords.createRT.recTitle}{" "}
              <InfoIcon
                infoTitle2={allWords.createRT.recIBtn.one}
                infoTitle3={allWords.createRT.recIBtn.two}
                infoTitle4={allWords.createRT.recIBtn.three}
              />
            </small>
          </div>
          &emsp;&emsp;&emsp;
          <div className="record-btn-container">
            <label className="record-switch btn-record-switch">
              <input
                ref={start_record_ref}
                type="checkbox"
                name="auto_record"
                id="auto_record"
                value={toggle}
                checked={toggle}
                onChange={(e) => {
                  setToggle(e.target.checked);
                }}
              />
              <label
                for="auto_record"
                data-on={allWords.misc.recOff}
                data-off={allWords.misc.recOn}
                className="btn-record-switch-inner"
              ></label>
            </label>
          </div>
        </div>
      )} */}

      <RTDuration
        dateValue={dateValue}
        setDateValue={setDateValue}
        timeValue={timeValue}
        setTimeValue={setTimeValue}
        datePicker={datePicker}
        durationHr={durationHr}
        setDurationHr={setDurationHr}
        durationMin={durationMin}
        setDurationMin={setDurationMin}
        handleDurHr={handleDurHr}
        handleDurMin={handleDurMin}
        url_rt_id={url_rt_id}
        wip_rt_id={wip_rt_id}
        schedule={schedule}
        setSchedule={setSchedule}
        disableRecord={disableRecord}
        location={location}
      />

      <div className="container-fluid mt-2">
        <small ref={time_ref}>{time_message}</small>
      </div>

      {loc !== "record" && (
        <>
          {/* Nature of Roundtable  */}
          <div className="mt-4">
            <small className="rt-strong-labels-gray">
              {allWords.createRT.natureOfRt}{" "}
              <span>
                <InfoIcon
                  infoTitle2={allWords.createRT.natureIBtn.one}
                  infoTitle3={allWords.createRT.natureIBtn.two}
                  infoTitle4={allWords.createRT.natureIBtn.three}
                  infoTitle5={allWords.createRT.natureIBtn.four}
                />
              </span>
            </small>
            <RoundtableButtonNature
              rt_nature={rt_nature}
              setRTNature={setRTNature}
            />
          </div>
          <br />

          {/* Keep Me Anonymous */}
          <div
            className="mb-4"
            hidden={
              window.location.origin === "https://khulke.com" ? true : false
            }
          >
            <input
              type="checkbox"
              style={{ padding: "5.5rem", border: "1px solid lightgray" }}
              checked={anon_opt}
              onChange={(e) => {
                setAnonOpt(e.target.checked);
              }}
            />
            <div
              style={{
                cursor: "pointer",
                userSelect: "none",
                display: "inline",
                marginLeft: "0.5rem",
                fontSize: "14px",
                fontWeight: "bold",
              }}
              onClick={() => {
                setAnonOpt(!anon_opt);
              }}
            >
              {allWords.createRT.keepAnonTitle}{" "}
              <span>
                <InfoIcon infoTitle2={allWords.createRT.keepAnonI} />
              </span>
            </div>
          </div>
        </>
      )}

      {location?.state?.rt_page === "record" && (
        <>
          <CreateModPan
            moderator={moderator}
            setModerator={setModerator}
            moderator_bio={moderator_bio}
            setModeratorBio={setModeratorBio}
            selected={selected}
            setSelected={setSelected}
            mod_bio_words={mod_bio_words}
            setModBioWords={setModBioWords}
            panelist={panelist}
            setPanelist={setPanelist}
            panelist_bio={panelist_bio}
            setPanelistBio={setPanelistBio}
            pan_selected={pan_selected}
            setPanSelected={setPanSelected}
            pan_bio_words={pan_bio_words}
            setPanBioWords={setPanBioWords}
            setIsValid={setIsValid}
            setSelectedId={setSelectedId}
            url_rt_id={url_rt_id}
            current_user={current_user}
          />
          <div className="d-flex imgRecVid">
            <UploadImageComp
              url_rt_id={url_rt_id}
              rt_id={!url_rt_id ? wip_rt_id : url_rt_id}
              imageUrls={imageUrls}
              setImageUrl={setImageUrl}
              image_name={image_name}
              imgValidation={imgValidation}
              onImageChange={onImageChange}
              onDocImageDelete={onDocImageDelete}
              setImgDelFlag={setImgDelFlag}
              label="record"
            />

            <UploadRecVideo
              recordVideoUrls={recordVideoUrls}
              setRecordVideoUrls={setRecordVideoUrls}
              recordDel={recordDel}
              setRecordDel={setRecordDel}
              recVid={recVid}
              setRecVid={setRecVid}
              vidValidation={vidValidation}
              recVidRef={recVidRef}
              url_rt_id={url_rt_id}
            />
          </div>
        </>
      )}

      <div className="my-3">
        <small className="warn-text">{final_message}</small>
      </div>

      <ConfirmButton
        is_valid={is_valid}
        onclick={() => {
          if (loc !== "record") {
            createRT();
          } else {
            createRecRT();
          }
        }}
      />
    </section>
  );
});
