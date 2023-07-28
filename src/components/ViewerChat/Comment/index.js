import React, { useState, useRef, useEffect } from "react";
import { Button, Grid, IconButton } from "@mui/material";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import { MainDiv, IconContainer, AddPostBtn } from "./style";
import DocsIcon from "../../IconsComponents/DocsIcon";
import PhotoIcon from "../../IconsComponents/PhotoIcon";
import ImageContainer from "./ImageContainer";
import VideoContainer from "./VideoContainer";
import AudioContainer from "./AudioContainer";
import DocsContainer from "./DocsContainer";

import EditVideo from "./EditVideo";
import EditImage from "../../Post/AddPostDialog/EditImage";

import PollIcon from "../../../assets/icons/poll_icon.svg";

import { useDispatch, useSelector } from "react-redux";
import { addVisitorCommentData } from "../../../redux/actions/visitorCommentAction";
import { POST_API_BASE_URL } from "../../../constants/env";
import axios from "axios";
import moment from "moment";
import PollFormContainer from "../../PollFormContainer";
import ToastHandler from "../../../utils/ToastHandler";
import UserProfile from "../../UserProfile";
import { allWords } from "../../../App";
import UserListInput from "../../UserListInput/userListInput";

import logger from "../../../logger";
const Comment = ({
  setComment,
  rt_id,
  setDayDuration,
  setHourDuration,
  setModalOpen,
  single_rt_data,
  total,
  interactionData,
  rttime,
}) => {
  const has_broadcasted = useSelector((state) => state.single_rt.data);

  const [textCount, setTextCount] = useState(0);
  const textLength = 300;
  const [editVideo, setEditVideo] = useState(false);
  const [editImage, setEditImage] = useState(false);

  const [imgArray, setImgArray] = useState([]);

  const [imageSrc, setImageSrc] = useState({
    index: null,
    url: null,
    file: null,
  });

  const [imageCaption1, setImageCaption1] = useState([]);
  const [imageCaption2, setImageCaption2] = useState("");
  const [imageCaption3, setImageCaption3] = useState("");
  const [imageCaption4, setImageCaption4] = useState("");
  const [videoFilePath, setVideoFilePath] = useState(null);
  const [docsFilePath, setDocsFilePath] = useState(null);
  const [audioFilePath, setAduioFilePath] = useState(null);

  const [textInput, setTextInput] = useState("");
  const [value, setValue] = useState(0);
  const [caption, setCaption] = useState("");

  const [imgUpload, setImgUpload] = useState([]);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [quoteDocsFile, setQuoteDocsFile] = useState(null);
  const [xlFile, setXlFile] = useState(null);
  const [wordFile, setWordFile] = useState(null);
  const [pptFile, setPptFile] = useState(null);
  const [pollDur, setPollDur] = useState([]);

  // Polling related Local States
  const [pollState, setPollState] = useState(false);
  const [pollData, setPollData] = useState({
    option: [],
    duration: "",
  });
  const [state_data, setStateData] = useState([]);

  //useRef here
  const editImageRef = useRef();

  useEffect(() => {
    let temp_poll = [];
    interactionData
      ?.filter((item) => item?.is_deleted !== 1)
      ?.filter((item) => item?.muted !== 1)
      ?.map((item) =>
        item?.polling_data?.duration !== undefined
          ? temp_poll.push(item?.polling_data)
          : ""
      );
    setPollDur(temp_poll);
  }, [interactionData]);

  //functions here
  const handleCrop = () => {
    editImageRef.current?.setCroppedImage();
    setEditImage(false);
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];

    if (!imageFile) {
      ToastHandler("warn", "Please select image.");
      return false;
    }
    if (!imageFile.name.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/)) {
      ToastHandler(
        "warn",
        allWords.misc.toastMsg.invalidImgFormat
      );
      return false;
    }

    if (imageFile) {
      for (let i = 0; i < e.target.files.length; i++) {
        let size = e.target.files[i].size;
        if (Math.round(size / 1024) > 1024 * 15) {
          handleClickOpen();

          ToastHandler("warn", "Upload an image less than 15 MB.");

          e.target.value = null;
          return false;
        }
      }
    }
    setVideoFilePath(null);
    setDocsFilePath(null);
    setAduioFilePath(null);
    const images = e.target.files;
    if (images.length <= 4) {
      if (imgArray.length === 4) {
        ToastHandler("warn", allWords.misc.toastMsg.only4ImageAllowed);
      } else {
        if (e.target.files) {
          const file = Array.from(e.target.files).map((file) => {
            return {
              file: file,
              url: URL.createObjectURL(file),
            };
          });
          setImgArray((prevImg) => prevImg.concat(file));
        }
        imgArray.push(...e.target.files);
      }
    } else {
      ToastHandler("warn", allWords.misc.toastMsg.only4ImageAllowed);
    }

    setEditImage(false);

    e.target.value = null;
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDocsChange = (e) => {
    setVideoFilePath(null);
    setAduioFilePath(null);
    setImgArray([]);
    const docfile = e.target.files[0];
    let filePath = docfile?.name;

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
    if (!docfile) {
      ToastHandler("warn", "Please select documents.");
      return false;
    }

    if (e.target.files[0]) {
      let size = e.target.files[0].size;

      if (Math.round(size / 1024) > 1024 * 15) {
        ToastHandler("warn", "Upload a file less than 15 MB.");
        return false;
      }
      setDocsFilePath(URL.createObjectURL(e.target.files[0]));
    }
    if (docfile.name.match(/(\.pdf|\.PDF)$/i)) {
      setQuoteDocsFile(e.target.files[0]);
      setXlFile(null);
      setWordFile(null);
      setPptFile(null);
    } else if (docfile.name.match(/(\.xls|\.xlsx|\.XLS|\.XLSX)$/i)) {
      setXlFile(e.target.files[0]);
      setQuoteDocsFile(null);
      setWordFile(null);
      setPptFile(null);
    } else if (docfile.name.match(/(\.doc|\.docx|\.DOC|\.DOCX)$/i)) {
      setWordFile(e.target.files[0]);
      setQuoteDocsFile(null);
      setXlFile(null);
      setPptFile(null);
    } else if (docfile.name.match(/(\.ppt|\.pptx|\.PPT|\.PPTX)$/i)) {
      setPptFile(e.target.files[0]);
      setQuoteDocsFile(null);
      setWordFile(null);
      setXlFile(null);
    }

    e.target.value = null;
  };

  const handleInputChange = (e) => {
    setTextInput(e.target.value);
    setValue(value + 1);
    setTextCount(e.target.value.length);
  };

  const handleSubmit = async () => {
    let current_username = JSON.parse(localStorage.getItem("current_user"))[
      "username"
    ];
    let formData = new FormData();
    const localtextInput = textInput.replace(/(?:\r\n|\r|\n)/g, " <br> ");

    let str = localtextInput?.replace(/"/g, '\\"');

    if (localtextInput && !imgArray.length > 0 && !docsFilePath) {
      if (localtextInput.includes('"')) {
        formData.append(
          "message",
          `{"room":"${rt_id}","text":"${str}","sent_by":"${current_username}","sent_by_name":"${current_username}","message_sender_type":"audience","actor_flag":"audience"}`
        );
      } else {
        formData.append(
          "message",
          `{"room":"${rt_id}","text":"${localtextInput}","sent_by":"${current_username}","sent_by_name":"${current_username}","message_sender_type":"audience","actor_flag":"audience"}`
        );
      }
    } else if ((imgArray.length > 0 && localtextInput) || imgArray.length > 0) {
      if (imgArray.length === 1) {
        if (localtextInput.includes('"')) {
          formData.append(
            "message",
            `{"room":"${rt_id}","name":"indal.jpg","sent_by":"${current_username}","sent_by_name":"${current_username}","message_sender_type":"audience","type":"round_table","media_type":"IMAGE","mime_type":"image/jpeg","caption":"","tags":"","text":"${str}"}`
          );
          formData.append(
            "media_details",
            `{"type":"ROUNDTABLE","media_type":"IMAGE","tags":[""],"caption":["${imageCaption1}"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"temp_id":"Mue8LnklB5"}`
          );
        } else {
          formData.append(
            "message",
            `{"room":"${rt_id}","name":"indal.jpg","sent_by":"${current_username}","sent_by_name":"${current_username}","message_sender_type":"audience","type":"round_table","media_type":"IMAGE","mime_type":"image/jpeg","caption":"","tags":"","text":"${localtextInput}"}`
          );
          formData.append(
            "media_details",
            `{"type":"ROUNDTABLE","media_type":"IMAGE","tags":[""],"caption":["${imageCaption1}"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"temp_id":"Mue8LnklB5"}`
          );
        }

        formData.append("image", imgArray[0].file);
      }
      if (imgArray.length === 2) {
        if (localtextInput.includes('"')) {
          formData.append(
            "message",
            `{"room":"${rt_id}","name":"indal.jpg","sent_by":"${current_username}","sent_by_name":"${current_username}","message_sender_type":"audience","type":"round_table","media_type":"IMAGE","mime_type":"image/jpeg","caption":"","tags":"","text":"${str}"}`
          );
          formData.append(
            "media_details",
            `{"type":"ROUNDTABLE","media_type":"IMAGE","tags":[""],"caption":["${imageCaption1}","${imageCaption2}"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"temp_id":"Mue8LnklB5"}`
          );
        } else {
          formData.append(
            "message",
            `{"room":"${rt_id}","name":"indal.jpg","sent_by":"${current_username}","sent_by_name":"${current_username}","message_sender_type":"audience","type":"round_table","media_type":"IMAGE","mime_type":"image/jpeg","caption":"","tags":"","text":"${localtextInput}"}`
          );
          formData.append(
            "media_details",
            `{"type":"ROUNDTABLE","media_type":"IMAGE","tags":[""],"caption":["${imageCaption1}","${imageCaption2}"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"temp_id":"Mue8LnklB5"}`
          );
        }

        for (let i in imgArray) {
          formData.append("image", imgArray[i].file);
        }
      }
      if (imgArray.length === 3) {
        if (localtextInput.includes('"')) {
          formData.append(
            "message",
            `{"room":"${rt_id}","name":"indal.jpg","sent_by":"${current_username}","sent_by_name":"${current_username}","message_sender_type":"audience","type":"round_table","media_type":"IMAGE","mime_type":"image/jpeg","caption":"","tags":"","text":"${str}"}`
          );
          formData.append(
            "media_details",
            `{"type":"ROUNDTABLE","media_type":"IMAGE","tags":[""],"caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"temp_id":"Mue8LnklB5"}`
          );
        } else {
          formData.append(
            "message",
            `{"room":"${rt_id}","name":"indal.jpg","sent_by":"${current_username}","sent_by_name":"${current_username}","message_sender_type":"audience","type":"round_table","media_type":"IMAGE","mime_type":"image/jpeg","caption":"","tags":"","text":"${localtextInput}"}`
          );
          formData.append(
            "media_details",
            `{"type":"ROUNDTABLE","media_type":"IMAGE","tags":[""],"caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"temp_id":"Mue8LnklB5"}`
          );
        }

        for (let i in imgArray) {
          formData.append("image", imgArray[i].file);
        }
      }
      if (imgArray.length === 4) {
        if (localtextInput.includes('"')) {
          formData.append(
            "message",
            `{"room":"${rt_id}","name":"indal.jpg","sent_by":"${current_username}","sent_by_name":"${current_username}","message_sender_type":"audience","type":"round_table","media_type":"IMAGE","mime_type":"image/jpeg","caption":"","tags":"","text":"${str}"}`
          );
          formData.append(
            "media_details",
            `{"type":"ROUNDTABLE","media_type":"IMAGE","tags":[""],"caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}","${imageCaption4}"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"temp_id":"Mue8LnklB5"}`
          );
        } else {
          formData.append(
            "message",
            `{"room":"${rt_id}","name":"indal.jpg","sent_by":"${current_username}","sent_by_name":"${current_username}","message_sender_type":"audience","type":"round_table","media_type":"IMAGE","mime_type":"image/jpeg","caption":"","tags":"","text":"${textInput}"}`
          );
          formData.append(
            "media_details",
            `{"type":"ROUNDTABLE","media_type":"IMAGE","tags":[""],"caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}","${imageCaption4}"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"temp_id":"Mue8LnklB5"}`
          );
        }

        for (let i in imgArray) {
          formData.append("image", imgArray[i].file);
        }
      }
    } else if ((docsFilePath && localtextInput) || docsFilePath) {
      if (xlFile) {
        if (localtextInput.includes('"')) {
          formData.append(
            "message",
            `{"room":"${rt_id}","name":"indal.jpg","sent_by":"${current_username}","sent_by_name":"${current_username}","message_sender_type":"audience","type":"round_table","media_type":"XLS","caption":"","tags":"","text":"${localtextInput}"}`
          );
          formData.append(
            "media_details",
            `{"type":"ROUNDTABLE","media_type":"XLS","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["XLS"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
        } else {
          formData.append(
            "message",
            `{"room":"${rt_id}","name":"indal.jpg","sent_by":"${current_username}","sent_by_name":"${current_username}","message_sender_type":"audience","type":"round_table","media_type":"XLS","caption":"","tags":"","text":"${localtextInput}"}`
          );
          formData.append(
            "media_details",
            `{"type":"ROUNDTABLE","media_type":"XLS","text":"${localtextInput}","caption":["${caption}"],"tags":[""],"file_type":["XLS"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
        }

        formData.append("doc", xlFile);
      } else if (quoteDocsFile) {
        if (localtextInput.includes('"')) {
          formData.append(
            "message",
            `{"room":"${rt_id}","name":"indal.jpg","sent_by":"${current_username}","sent_by_name":"${current_username}","message_sender_type":"audience","type":"round_table","media_type":"PDF","caption":"","tags":"","text":"${localtextInput}"}`
          );
          formData.append(
            "media_details",
            `{"type":"ROUNDTABLE","media_type":"PDF","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["PDF"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
        } else {
          formData.append(
            "message",
            `{"room":"${rt_id}","name":"indal.jpg","sent_by":"${current_username}","sent_by_name":"${current_username}","message_sender_type":"audience","type":"round_table","media_type":"PDF","caption":"","tags":"","text":"${localtextInput}"}`
          );
          formData.append(
            "media_details",
            `{"type":"ROUNDTABLE","media_type":"PDF","text":"${localtextInput}","caption":["${caption}"],"tags":[""],"file_type":["PDF"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
        }

        formData.append("doc", quoteDocsFile);
      } else if (wordFile) {
        if (localtextInput.includes('"')) {
          formData.append(
            "message",
            `{"room":"${rt_id}","name":"indal.jpg","sent_by":"${current_username}","sent_by_name":"${current_username}","message_sender_type":"audience","type":"round_table","media_type":"DOC","caption":"","tags":"","text":"${localtextInput}"}`
          );
          formData.append(
            "media_details",
            `{"type":"ROUNDTABLE","media_type":"DOC","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["DOC"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST"}`
          );
        } else {
          formData.append(
            "message",
            `{"room":"${rt_id}","name":"indal.jpg","sent_by":"${current_username}","sent_by_name":"${current_username}","message_sender_type":"audience","type":"round_table","media_type":"DOC","caption":"","tags":"","text":"${localtextInput}"}`
          );
          formData.append(
            "media_details",
            `{"type":"ROUNDTABLE","media_type":"DOC","text":"${localtextInput}","caption":["${caption}"],"tags":[""],"file_type":["DOC"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST"}`
          );
        }

        formData.append("doc", wordFile);
      } else if (pptFile) {
        if (localtextInput.includes('"')) {
          formData.append(
            "message",
            `{"room":"${rt_id}","name":"indal.jpg","sent_by":"${current_username}","sent_by_name":"${current_username}","message_sender_type":"audience","type":"round_table","media_type":"PPTX","caption":"","tags":"","text":"${localtextInput}"}`
          );
          formData.append(
            "media_details",
            `{"type":"ROUNDTABLE","media_type":"PPTX","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["PPTX"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST"}`
          );
        } else {
          formData.append(
            "message",
            `{"room":"${rt_id}","name":"indal.jpg","sent_by":"${current_username}","sent_by_name":"${current_username}","message_sender_type":"audience","type":"round_table","media_type":"PPTX","caption":"","tags":"","text":"${localtextInput}"}`
          );
          formData.append(
            "media_details",
            `{"type":"ROUNDTABLE","media_type":"PPTX","text":"${localtextInput}","caption":["${caption}"],"tags":[""],"file_type":["PPTX"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST"}`
          );
        }

        formData.append("doc", pptFile);
      }
    }

    dispatch(addVisitorCommentData(formData));
    setComment(false);
  };
  function onCaptionChange(e, index) {
    if (index === 0) {
      setImageCaption1(e.target.value);
    }
    if (index === 1) {
      setImageCaption2(e.target.value);
    }
    if (index === 2) {
      setImageCaption3(e.target.value);
    }
    if (index === 3) {
      setImageCaption4(e.target.value);
    }
  }

  const inputRef = useRef("");

  // POLLING IN AUDIENCE INTERACTION
  const handlePollSubmit = () => {
    if (
      textInput === "" &&
      !imgArray.length > 0 &&
      !docsFilePath &&
      !audioFilePath &&
      !videoFilePath &&
      !localStorage.getItem("input_text") &&
      String(pollData.option[0]) === "undefined" &&
      String(pollData.option[1]) === "undefined"
    ) {
      ToastHandler("warn", allWords.misc.entersomevals);
      return;
    }

    if (textInput === "") {
      ToastHandler("warn", "Kindly provide the question for the Poll.");
      return;
    }

    if (state_data?.length === 2) {
      if (
        state_data?.[0]?.["length"] === 0 ||
        state_data?.[1]?.["length"] === 0
      ) {
        ToastHandler("warn", "Minimum 2 options should be there for Poll.");
      }
    } else {
      if (
        state_data?.[0]?.["length"] === 0 ||
        state_data?.[1]?.["length"] === 0 ||
        state_data?.[2]?.["length"] === 0 ||
        state_data?.[3]?.["length"] === 0
      ) {
        ToastHandler("warn", "Kindly fill the option or delete that.");
      }
    }

    if (
      Number(pollData.duration[0]) === 0 &&
      Number(pollData.duration[2]) === 0 &&
      Number(pollData.duration[4]) === 0
    ) {
      ToastHandler("warn", "Duration cannot be empty.");
      return;
    }

    if (has_broadcasted?.data?.[0]?.["active_flag"] === true) {
      if (
        Number(pollData.duration.split("d")[0]) >
          Number(rttime?.split(":")[0]) ||
        Number(pollData.duration.split("d")[1].split("h")[0]) >
          Number(rttime?.split(":")[0]) ||
        Number(pollData.duration.split("h")[1].split("m")[0]) >
          Number(rttime?.split(":")[1])
      )
        return ToastHandler(
          "warn",
          "Duration cannot be greater than RoundTable Duration."
        );

      if (pollDur?.length === 2) {
        return ToastHandler("warn", "There will be only two polls.");
      }
    }

    var str = "";
    if (textInput.includes('"')) {
      str = textInput.replace(/"/g, '\\"');
    } else if (textInput.includes("\n")) {
      str = textInput.replace(/(?:\r\n|\r|\n)/g, " <br /> ");
    } else {
      str = textInput;
    }

    var data = new FormData();
    if (
      state_data?.[0]?.["length"] !== 0 &&
      state_data?.[1]?.["length"] !== 0 &&
      state_data?.[2]?.["length"] === undefined &&
      state_data?.[3]?.["length"] === undefined
    ) {
      data.append(
        "message",
        `{"question":"${str}","option":["${pollData.option[0]}","${
          pollData.option[1]
        }"],"start_date":"${String(
          moment.utc().format()
        )}","duration":"${String(pollData.duration)}"}`
      );
    } else if (
      state_data?.[0]?.["length"] !== 0 &&
      state_data?.[1]?.["length"] !== 0 &&
      state_data?.[2]?.["length"] !== 0 &&
      String(pollData.option[2]) !== "undefined" &&
      state_data?.[3]?.["length"] === undefined
    ) {
      data.append(
        "message",
        `{"question":"${str}","option":["${String(
          pollData.option[0]
        )}","${String(pollData.option[1])}","${String(
          pollData.option[2]
        )}"],"start_date":"${String(
          moment.utc().format()
        )}","duration":"${String(pollData.duration)}"}`
      );
    } else if (
      state_data?.[0]?.["length"] !== 0 &&
      state_data?.[1]?.["length"] !== 0 &&
      state_data?.[2]?.["length"] !== 0 &&
      String(pollData.option[2]) !== "undefined" &&
      state_data?.[3]?.["length"] !== 0 &&
      String(pollData.option[3]) !== "undefined"
    ) {
      data.append(
        "message",
        `{"question":"${str}","option":["${String(
          pollData.option[0]
        )}","${String(pollData.option[1])}","${String(
          pollData.option[2]
        )}","${String(pollData.option[3])}"],"start_date":"${String(
          moment.utc().format()
        )}","duration":"${String(pollData.duration)}"}`
      );
    }

    data.append("type", "ROUNDTABLE");
    data.append("roundtable_id", rt_id);

    var config = {
      method: "post",
      url: `${POST_API_BASE_URL}/post/add-polling-post`,
      headers: {
        "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
        "device-type": "android",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          localStorage.removeItem("input_text");
          setTextInput("");
          setDayDuration(Number(pollData.duration[0]));
          setHourDuration(Number(pollData.duration[2]));
          setPollDur([]);
        }

        setComment(false);
      })
      .catch(function (error) {
        logger.error(error);
      });
  };

  return (
    <>
      <MainDiv>
        {editImage || editVideo ? (
          <>
            {editImage && (
              <Grid container>
                <Grid item xs={12}>
                  <EditImage
                    imageSrc={imageSrc}
                    setImgArray={setImgArray}
                    ref={editImageRef}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "30px",
                      padding: "10px 20px",
                    }}
                  >
                    <Button
                      onClick={() => {
                        setEditImage(false);
                      }}
                      variant="contained"
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        width: "40%",
                        padding: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      {allWords.misc.cancel}
                    </Button>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        width: "40%",
                        padding: "10px",
                        borderRadius: "10px",
                      }}
                      onClick={handleCrop}
                    >
                      {allWords.misc.save}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            )}
            {editVideo && <EditVideo setEditVideo={setEditVideo} />}
          </>
        ) : (
          <>
            <div className="input_container">
              <UserProfile
                username={
                  JSON.parse(
                    localStorage.getItem("current_user") ||
                      localStorage.anonymous_user
                  )?.["username"]
                }
              />
                  <div
                    style={{
                      width: "26.4rem",
                      border: "1px solid #E4E9F0",
                      marginLeft: "1.3rem",
                      height: "9rem",
                      borderRadius: "8px",
                      padding: "10px",
                      marginBottom: "1rem",
                    }}
                  >
                    <UserListInput
                      name="add dialog"
                      placeholder={allWords.th.placeholder}
                      className="post-area addDialogCSs"
                      refs={inputRef}
                      maxLength={textCount === 0 ? 300 : ""}
                      value={textInput}
                      listDirection="bottom"
                      onChange={(e) => {
                        const txt = e.target.value;
                        const urlRegex = /\bhttps?:\/\/\S+/gi;
                        let charCount;

                        const allLinks = txt.match(urlRegex);

                        if (allLinks) {
                          const allLinksSize = allLinks.join("").length;
                          charCount =
                            txt.length - allLinksSize + allLinks.length * 4;
                        } else {
                          charCount = txt.length;
                        }

                        if (charCount <= 300) {
                          setTextCount(charCount);
                        } else {
                          setTextCount(300);
                        }

                        if (charCount <= 300) {
                          setTextInput(e.target.value);
                        } else {
                          if (allLinks) {
                            const allLinksSize = allLinks.join("").length;
                            charCount =
                              charCount + allLinksSize - allLinks.length * 4;
                          } else {
                            charCount = 300;
                          }

                          setTextInput(txt.slice(0, charCount));
                        }

                        setValue(value + 1);

                        if (localStorage.getItem("text_data")) {
                          localStorage.setItem("text_data", e.target.value);
                        }
                      }}
                    />
                    <p style={{ margin: 0, opacity: "0.6", textAlign: "end" }}>
                      {textCount >= 0 && textCount <= 300
                        ? 300 - textCount
                        : 300}
                    </p>
                  </div>
            </div>
            <Grid container spacing={2} className="main_container">
              {videoFilePath && (
                <Grid item md={12}>
                  <VideoContainer
                    controls
                    src={videoFilePath}
                    videoFilePath={videoFilePath}
                    setVideoFilePath={setVideoFilePath}
                    setEditVideo={setEditVideo}
                  />
                </Grid>
              )}
              {imgArray && (
                <>
                  {imgArray.map((item, index) => {
                    imgUpload.push(item);
                    return (
                      <>
                        {imgArray.length === 1 && (
                          <Grid item md={12} key={item}>
                            <ImageContainer
                              onCaptionChange={(e) => onCaptionChange(e, index)}
                              setCaption={setCaption}
                              imageSrc={imageSrc}
                              setImageSrc={setImageSrc}
                              editImage={editImage}
                              setEditImage={setEditImage}
                              imgArray={imgArray}
                              setImgArray={setImgArray}
                              index={index}
                              imgSrc={item}
                            />
                          </Grid>
                        )}

                        {imgArray.length === 2 && (
                          <Grid item md={6} key={item}>
                            <ImageContainer
                              onCaptionChange={(e) => onCaptionChange(e, index)}
                              setCaption={setCaption}
                              imageSrc={imageSrc}
                              setImageSrc={setImageSrc}
                              editImage={editImage}
                              setEditImage={setEditImage}
                              imgArray={imgArray}
                              setImgArray={setImgArray}
                              index={index}
                              imgSrc={item}
                            />
                          </Grid>
                        )}
                        {imgArray.length === 3 && (
                          <Grid item md={6} key={item}>
                            <ImageContainer
                              onCaptionChange={(e) => onCaptionChange(e, index)}
                              setCaption={setCaption}
                              imageSrc={imageSrc}
                              setImageSrc={setImageSrc}
                              editImage={editImage}
                              setEditImage={setEditImage}
                              imgArray={imgArray}
                              setImgArray={setImgArray}
                              index={index}
                              imgSrc={item}
                            />
                          </Grid>
                        )}

                        {imgArray.length === 4 && (
                          <Grid item md={6} key={item}>
                            <ImageContainer
                              onCaptionChange={(e) => onCaptionChange(e, index)}
                              setCaption={setCaption}
                              imageSrc={imageSrc}
                              setImageSrc={setImageSrc}
                              editImage={editImage}
                              setEditImage={setEditImage}
                              imgArray={imgArray}
                              setImgArray={setImgArray}
                              index={index}
                              imgSrc={item}
                            />
                          </Grid>
                        )}
                      </>
                    );
                  })}
                </>
              )}
              {docsFilePath && (
                <div style={{ marginTop: "1rem", width: "100%" }}>
                  <DocsContainer
                    docsFilePath={docsFilePath}
                    docsFile={quoteDocsFile?.name}
                    excelDoc={xlFile?.name}
                    pptDoc={pptFile?.name}
                    wordDoc={wordFile?.name}
                  />
                </div>
              )}
              {audioFilePath && (
                <>
                  {audioFilePath && (
                    <AudioContainer
                      user
                      audioFilePath={audioFilePath}
                      setAduioFilePath={setAduioFilePath}
                    />
                  )}
                </>
              )}

              {pollState && (
                <>
                  <PollFormContainer
                    setPollData={setPollData}
                    setStateData={setStateData}
                  />
                </>
              )}
            </Grid>

            <IconContainer>
              <div>
                {/* images */}
                <IconButton variant="contained" component="label">
                  <PhotoIcon />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleImageChange}
                  />
                </IconButton>
                {/* docs */}
                <IconButton variant="contained" component="label">
                  <DocsIcon />
                  <input
                    type="file"
                    accept=".doc,.docx,.pdf,.xlsx,.xls,.ppt,.pptx"
                    hidden
                    onChange={handleDocsChange}
                  />
                </IconButton>

                {/* poll icon */}
                {(single_rt_data?.[0]?.["owner"]?.["username"] ===
                  JSON.parse(
                    localStorage.current_user || localStorage.anonymous_user
                  )["username"] ||
                  single_rt_data?.[0]?.["moderator"]?.["username"] ===
                    JSON.parse(
                      localStorage.current_user || localStorage.anonymous_user
                    )["username"]) && (
                  <>
                    <IconButton
                      variant="contained"
                      onClick={() => {
                        setPollState(true);
                      }}
                      hidden={pollDur?.length === 2 ? true : false}
                    >
                      <img
                        src={PollIcon}
                        style={{
                          width: "1.4rem",
                          height: "1.4rem",
                        }}
                        alt="poll-icon"
                      />
                    </IconButton>
                  </>
                )}
              </div>

              <AddPostBtn
                onClick={() => {
                  if (
                    !localStorage.current_user &&
                    localStorage.anonymous_user
                  ) {
                    setComment(false);
                    return setModalOpen(true);
                  }

                  if (pollState) {
                    handlePollSubmit();
                  } else {
                    handleSubmit();
                  }
                }}
              >
                {allWords.th.post}
              </AddPostBtn>
            </IconContainer>
          </>
        )}

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            style: { borderRadius: "0.8rem", width: 530, height: 120 },
          }}
        >
          <DialogContent style={{ height: "10px" }}>
            <strong>{"Upload less than 15 MB Image"}</strong>
          </DialogContent>
          <DialogActions>
            <button
              style={{
                fontSize: "12px!important",
                padding: "0.5rem 0.9rem",
                width: "fit-content",
                borderRadius: "4px",
                color: "white",
                height: "fit-content",
                backgroundColor: "black",
                outline: "none",
                border: "none",
              }}
              onClick={handleClose}
            >
              OKAY
            </button>
          </DialogActions>
        </Dialog>
      </MainDiv>
    </>
  );
};

export default Comment;
