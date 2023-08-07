import { makeStyles } from "@material-ui/core/styles";
import { CancelOutlined } from "@material-ui/icons";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Grid, IconButton } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { motion } from "framer-motion";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { allWords } from "../../../App";
import PollIcon from "../../../assets/icons/poll_icon.svg";
import { POST_API_BASE_URL } from "../../../constants/env";
import logger from "../../../logger";
import { addPostData, getPostData } from "../../../redux/actions/postAction";
import ToastHandler from "../../../utils/ToastHandler";
import AudioIcon from "../../IconsComponents/AudioIcon";
import DocsIcon from "../../IconsComponents/DocsIcon";
import PhotoIcon from "../../IconsComponents/PhotoIcon";
import VideoIcon from "../../IconsComponents/VideoIcon";
import PollFormContainer from "../../PollFormContainer";
import PreloginComp from "../../PreLoginComp";
import UserListInput from "../../UserListInput/userListInput";
import UserProfile from "../../UserProfile";
import "../style.css";
import AudioContainer from "./AudioContainer";
import DocsContainer from "./DocsContainer";
import EditImage from "./EditImage";
import ImageContainer from "./ImageContainer";
import {AddPostBtn, IconContainer, MainDiv, VidErrorDiv} from "./style";
import VideoContainer from "./VideoContainer";

const useStyles = makeStyles((theme) => ({
  paper: {
    [theme.breakpoints.down("sm")]: {
      width: "97%",
      margin: 0,
    },
    [theme.breakpoints.up("sm")]: {
      width: "80%",
      maxWidth: "550px",
      margin: "0 auto",
    },
  },
}));

const Button = styled.button`
  width: 200px;
  height: 50px;
  outline: none;
  border-radius: 5px;
  color: ${(props) => (props.primary ? props.theme.color.primary : "white")};
  background-color: ${(props) =>
    props.bgColor ? props.theme.color.secondary : "white"};
  border: 2px solid
    ${(props) =>
      props.primary ? props.theme.color.primary : props.theme.color.secondary};
`;

const AddPostDialog = ({
  open,
  setAddPost,
  setDialogTitle,
  setDiscard,
  setDayDuration,
  setHourDuration,
  setMsgFlag,
  parentType = "",
}) => {
  const [state, setState] = useState(false);
  const [startAudioTime, setStartAudioTime] = useState(0);
  const [endAudioTime, setEndAudioTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [startVideoTime, setStartVideoTime] = useState(0);
  const [endVideoTime, setEndVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(null);
  const [xlFile, setXlFile] = useState(null);
  const [wordFile, setWordFile] = useState(null);
  const [pptFile, setPptFile] = useState(null);
  const [editVideo, setEditVideo] = useState(false);
  const [editImage, setEditImage] = useState(false);
  const [imageCaption1, setImageCaption1] = useState("");
  const [imageCaption2, setImageCaption2] = useState("");
  const [imageCaption3, setImageCaption3] = useState("");
  const [imageCaption4, setImageCaption4] = useState("");
  const [imgArray, setImgArray] = useState([]);
  const [captionLength, setCaptionLength] = useState(0);
  const [imageSrc, setImageSrc] = useState({
    index: null,
    url: null,
    file: null,
  });
  const [disable, setDisable] = useState(false);
  const [videoFilePath, setVideoFilePath] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [docsFilePath, setDocsFilePath] = useState(null);
  const [docsFile, setDocsFile] = useState(null);
  const [audioFilePath, setAduioFilePath] = useState(null);
  const [audioFile, setAduioFile] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [value, setValue] = useState(0);
  const [caption, setCaption] = useState("");
  const [textCount, setTextCount] = useState(0);
  const dispatch = useDispatch();
  const allPostData = useSelector((state) => state.post.posts);
  const post_res = useSelector((state) => state.post.post_res);
  const addPostLoading = useSelector((state) => state.post.loading);
  const [pollState, setPollState] = useState(false);
  const editImageRef = useRef();
  const [pollData, setPollData] = useState({
    option: [],
    duration: "",
  });
  const [state_data, setStateData] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [videoError, setVideoError] = useState("");

  const classes = useStyles();

  const imageCaptionPropHandler = (index) => {
    if (index === 0) {
      return imageCaption1;
    }
    if (index === 1) {
      return imageCaption2;
    }
    if (index === 2) {
      return imageCaption3;
    }
    if (index === 3) {
      return imageCaption4;
    }
  };

  const handleVideoChange = (e) => {
    const videoFile = e.target.files[0];
    window.URL = window.URL || window.webkitURL;

    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);
    };
    video.src = URL.createObjectURL(e.target.files[0]);

    if (videoFile) {
      let size = e.target.files[0].size;
      if (["K3","BKK"].includes(parentType) && Math.round(size / 1024) >  512000 ) {
        ToastHandler("warn", "Upload a video file less than 500 MB.");
        setState(false);
        return false;
      }

      if (!["K3","BKK"].includes(parentType) && Math.round(size / 1024) > 256000) {
        ToastHandler("warn", "Upload a video file less than 250 MB.");
        setState(false);
        return false;
      }
    }
    if (!videoFile) {
      ToastHandler("warn", "Please select video.");
      return false;
    }
    if (!videoFile.name.match(/\.(mp4|MP4)$/)) {
      ToastHandler("warn", allWords.misc.toastMsg.invalidVideoFormat);
      return false;
    }
    setAduioFilePath(null);
    setDocsFilePath(null);
    setImgArray([]);
    setPollState(false);

    if (e.target.files) {
      setVideoFile(e.target.files[0]);
      setVideoFilePath(URL.createObjectURL(e.target.files[0]));
    }

    setEditImage(false);
    setEditVideo(false);

    e.target.value = null;
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    if (!imageFile) {
      ToastHandler("warn", "Please select image.");
      return false;
    }
    if (!imageFile.name.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG)$/)) {
      ToastHandler("warn", allWords.misc.toastMsg.invalidImgFormat);
      return false;
    }
    if (imageFile) {
      for (let i = 0; i < e.target.files.length; i++) {
        let size = e.target.files[i].size;
        if (Math.round(size / 1024) > 1024 * 15) {
          ToastHandler("warn", "Upload an image less than 15 MB.");
          setState(false);
          e.target.value = null;
          return false;
        }
      }
    }
    setVideoFilePath(null);
    setDocsFilePath(null);
    setAduioFilePath(null);
    setPollState(false);

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
      }
    } else {
      ToastHandler("warn", allWords.misc.toastMsg.only4ImageAllowed);
    }

    setEditImage(false);

    e.target.value = null;
  };

  const handleDocsChange = (e) => {
    setDisable(false);
    setVideoFilePath(null);
    setAduioFilePath(null);
    setImgArray([]);
    setState(true);
    setPollState(false);
    const docfile = e.target.files[0];
    let filePath = docfile.name;

    // Allowing file type
    let allowedExtensions = /(\.pdf|\.xls|\.xlsx|\.doc|\.docx|\.ppt|\.pptx)$/i;
    if (!allowedExtensions.exec(filePath)) {
      ToastHandler(
        "warn",
        "Invalid file format. Please upload pdf, doc, ppt, xlx files."
      );
      setState(false);
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
        setState(false);
        return false;
      }
      setDocsFilePath(URL.createObjectURL(e.target.files[0]));
    }
    if (docfile.name.match(/(\.pdf|\.PDF)$/i)) {
      setDocsFile(e.target.files[0]);
      setXlFile(null);
      setWordFile(null);
      setPptFile(null);
    } else if (docfile.name.match(/(\.xls|\.xlsx|\.XLS|\.XLSX)$/i)) {
      setXlFile(e.target.files[0]);
      setDocsFile(null);
      setWordFile(null);
      setPptFile(null);
    } else if (docfile.name.match(/(\.doc|\.docx|\.DOC|\.DOCX)$/i)) {
      setWordFile(e.target.files[0]);
      setDocsFile(null);
      setXlFile(null);
      setPptFile(null);
    } else if (docfile.name.match(/(\.ppt|\.pptx|\.PPT|\.PPTX)$/i)) {
      setPptFile(e.target.files[0]);
      setDocsFile(null);
      setWordFile(null);
      setXlFile(null);
    }

    e.target.value = null;
  };

  const handleAudioChange = (e) => {
    setImgArray([]);
    setDocsFilePath(null);
    setVideoFilePath(null);
    setPollState(false);

    const audiofile = e.target.files[0];

    if (!audiofile) {
      ToastHandler("warn", "Please select audio.");
      return false;
    }
    if (!audiofile.name.match(/\.(mp3)$/)) {
      ToastHandler("warn", allWords.misc.toastMsg.invalidAudioFormat);
      return false;
    }

    if (e.target.files) {
      setAduioFile(e.target.files[0]);
      setAduioFilePath(URL.createObjectURL(e.target.files[0]));
    }

    setEditImage(false);
    setEditVideo(false);

    e.target.value = null;
  };

  const handlePostSubmit = async () => {
    localStorage.removeItem("text_data");
    const formData = new FormData();

    const str1 = textInput.replace(/"/g, '\\"');
    const str2 = textInput.replace(/(?:\r\n|\r|\n)/g, " <br />");

    if (
      textInput.trim() === "" &&
      !imgArray.length > 0 &&
      !docsFilePath &&
      !audioFilePath &&
      !videoFilePath
    ) {
      ToastHandler("warn", allWords.misc.entersomeval);
      return;
    }

    // for snip it
    if (parentType === "SNIPPET" && !videoFilePath) {
      return ToastHandler("warn", "Enter video for Snip-It");
    }

    //K3
    if (parentType === "K3" && !videoFilePath) {
       return ToastHandler("warn", "Enter video for Khabri Ke Khabre");
    }
    //bol khulke 
    if (parentType === "BKK" && !videoFilePath) {
       return ToastHandler("warn", "Enter video for Bol Khul Ke");
    }

    if (
      textInput &&
      !imgArray.length > 0 &&
      !docsFilePath &&
      !audioFilePath &&
      !videoFilePath
    ) {
      if (textInput.includes('"')) {
        formData.append("message", `{"type":"TEXT","text":"${str1}"}`);
      } else if (textInput.includes("\n")) {
        formData.append("message", `{"type":"TEXT","text":"${str2}"}`);
      } else {
        formData.append("message", `{"type":"TEXT","text":"${textInput}"}`);
      }
    } else if ((imgArray.length > 0 && textInput) || imgArray.length > 0) {
      if (imgArray.length === 1) {
        if (textInput.includes('"')) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${str1}","caption":["${imageCaption1}"],"tags":[""],"file_type":["IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
        } else if (textInput.includes("\n")) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${str2}","caption":["${imageCaption1}"],"tags":[""],"file_type":["IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${textInput}","caption":["${imageCaption1}"],"tags":[""],"file_type":["IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
        }

        formData.append("image", imgArray[0].file);
      }
      if (imgArray.length === 2) {
        if (textInput.includes('"')) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${str1}","caption":["${imageCaption1}","${imageCaption2}"],"tags":[""],"file_type":["IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
        } else if (textInput.includes("\n")) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${str2}","caption":["${imageCaption1}","${imageCaption2}"],"tags":[""],"file_type":["IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${textInput}","caption":["${imageCaption1}","${imageCaption2}"],"tags":[""],"file_type":["IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
        }

        for (let i in imgArray) {
          formData.append("image", imgArray[i].file);
        }
      }
      if (imgArray.length === 3) {
        if (textInput.includes('"')) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${str1}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
        } else if (textInput.includes("\n")) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${str2}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${textInput}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
        }

        for (let i in imgArray) {
          formData.append("image", imgArray[i].file);
        }
      }
      if (imgArray.length === 4) {
        if (textInput.includes('"')) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${str1}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}","${imageCaption4}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
        } else if (textInput.includes("\n")) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${str2}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}","${imageCaption4}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${textInput}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}","${imageCaption4}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
        }

        for (let i in imgArray) {
          formData.append("image", imgArray[i].file);
        }
      }
    } else if ((videoFilePath && textInput) || videoFilePath) {
      if (!["K3","BKK"].includes(parentType) && videoDuration > 150) {
        return ToastHandler(
          "warn",
          "Max. duration for Video should be 2min 30sec only."
        );
      }

      if (["K3","BKK"].includes(parentType) && videoDuration > 180) {
        setVideoError(allWords.misc.toastMsg.videoLength3min);
        return ;
      }

      if (textInput.includes('"')) {
        formData.append(
          "message",
          `{"type":"POST","media_type":"VIDEO","text":"${str1}","caption":["${caption}"],"tags":[""],"file_type":["VIDEO"],"start_duration":["${
            startVideoTime || endVideoTime ? startVideoTime : null
          }"],"end_duration":["${
            endVideoTime ? endVideoTime : null
          }"],"duration":["${
            videoDuration ? videoDuration : null
          }"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"]}`
        );
      } else if (textInput.includes("\n")) {
        formData.append(
          "message",
          `{"type":"POST","media_type":"VIDEO","text":"${str2}","caption":["${caption}"],"tags":[""],"file_type":["VIDEO"],"start_duration":["${
            startVideoTime || endVideoTime ? startVideoTime : null
          }"],"end_duration":["${
            endVideoTime ? endVideoTime : null
          }"],"duration":["${
            videoDuration ? videoDuration : null
          }"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"]}`
        );
      } else if (["SNIPPET","K3","BKK"].includes(parentType)) {
        formData.append(
          "message",
          `{"type":"${parentType === "SNIPPET" ? "SNIPPET" : parentType === "K3" ? "K3_POST" : "BKK_POST"}","media_type":"VIDEO","text":"${str1}","caption":["${caption}"],"tags":[""],"file_type":["VIDEO"],"start_duration":["${
            startVideoTime || endVideoTime ? startVideoTime : null
          }"],"end_duration":["${endVideoTime ? endVideoTime : null}"],"duration":["${
            videoDuration ? videoDuration : null
          }"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"]}`
        );
      }else {
        formData.append(
          "message",
          `{"type":"POST","media_type":"VIDEO","text":"${textInput}","caption":["${caption}"],"tags":[""],"file_type":["VIDEO"],"start_duration":["${
            startVideoTime || endVideoTime ? startVideoTime : null
          }"],"end_duration":["${
            endVideoTime ? endVideoTime : null
          }"],"duration":["${
            videoDuration ? videoDuration : null
          }"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"]}`
        );
      }
      formData.append("video", videoFile);

    } else if ((docsFilePath && textInput) || docsFilePath) {
      if (xlFile) {
        if (textInput.includes('"')) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"XLS","text":"${str1}","caption":["${caption}"],"tags":[""],"file_type":["XLS"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
        } else if (textInput.includes("\n")) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"XLS","text":"${str2}","caption":["${caption}"],"tags":[""],"file_type":["XLS"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"POST","media_type":"XLS","text":"${textInput}","caption":["${caption}"],"tags":[""],"file_type":["XLS"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
        }

        formData.append("doc", xlFile);
      } else if (docsFile) {
        if (textInput.includes('"')) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"PDF","text":"${str1}","caption":["${caption}"],"tags":[""],"file_type":["PDF"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
        } else if (textInput.includes("\n")) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"PDF","text":"${str2}","caption":["${caption}"],"tags":[""],"file_type":["PDF"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"POST","media_type":"PDF","text":"${textInput}","caption":["${caption}"],"tags":[""],"file_type":["PDF"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
        }

        formData.append("doc", docsFile);
      } else if (wordFile) {
        if (textInput.includes('"')) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"DOC","text":"${str1}","caption":["${caption}"],"tags":[""],"file_type":["DOC"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
        } else if (textInput.includes("\n")) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"DOC","text":"${str2}","caption":["${caption}"],"tags":[""],"file_type":["DOC"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"POST","media_type":"DOC","text":"${textInput}","caption":["${caption}"],"tags":[""],"file_type":["DOC"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
        }

        formData.append("doc", wordFile);
      } else if (pptFile) {
        if (textInput.includes('"')) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"PPTX","text":"${str1}","caption":["${caption}"],"tags":[""],"file_type":["PPTX"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
        } else if (textInput.includes("\n")) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"PPTX","text":"${str2}","caption":["${caption}"],"tags":[""],"file_type":["PPTX"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"POST","media_type":"PPTX","text":"${textInput}","caption":["${caption}"],"tags":[""],"file_type":["PPTX"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
        }

        formData.append("doc", pptFile);
      }
    } else if ((audioFilePath && textInput) || audioFilePath) {
      if (audioFile.size / 10 ** 6 > 250)
        return ToastHandler(
          "warn",
          "Upload a audio file less than 250 MB with maximum duration as 2min 30sec."
        );

      if (audioDuration > 150)
        return ToastHandler(
          "warn",
          allWords.misc.toastMsg.audioLengthValidation
        );

      if (textInput.includes('"')) {
        formData.append(
          "message",
          `{"type":"POST","media_type":"AUDIO","text":"${str1}","caption":["${caption}"],"tags":[""],"file_type":["AUDIO"],"start_duration":["${
            startAudioTime || endAudioTime ? startAudioTime : null
          }"],"end_duration":["${
            endAudioTime ? endAudioTime : null
          }"],"duration":["${
            audioDuration ? audioDuration : null
          }"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"]}`
        );
      } else if (textInput.includes("\n")) {
        formData.append(
          "message",
          `{"type":"POST","media_type":"AUDIO","text":"${str2}","caption":["${caption}"],"tags":[""],"file_type":["AUDIO"],"start_duration":["${
            startAudioTime || endAudioTime ? startAudioTime : null
          }"],"end_duration":["${
            endAudioTime ? endAudioTime : null
          }"],"duration":["${
            audioDuration ? audioDuration : null
          }"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"]}`
        );
      } else {
        formData.append(
          "message",
          `{"type":"POST","media_type":"AUDIO","text":"${textInput}","caption":["${caption}"],"tags":[""],"file_type":["AUDIO"],"start_duration":["${
            startAudioTime || endAudioTime ? startAudioTime : null
          }"],"end_duration":["${
            endAudioTime ? endAudioTime : null
          }"],"duration":["${
            audioDuration ? audioDuration : null
          }"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"]}`
        );
      }

      formData.append("audio", audioFile);
    }

    dispatch(
      addPostData(formData, parentType, ({ err, data }) => {
        if (err) {
          return logger.info(err);
        }
        const postId = data?.[0]?.post_id;
        ToastHandler("sus", () => (
          <CreatedPostToast
            postId={postId}
            isParentType={parentType}
          />
        ));
        setAddPost(false);
      })
    );

    if (parentType === "SNIPPET") {
      setAddPost(false);
      ToastHandler("info", allWords.misc.toastMsg.postUploadingWait);
    }

     if (parentType === "K3") {
       setAddPost(false);
       ToastHandler("info", allWords.misc.toastMsg.postUploadingWait);
     }
    
    if (parentType === "BKK") {
       setAddPost(false);
       ToastHandler("info", allWords.misc.toastMsg.postUploadingWait);
     }
  };

  useEffect(() => {
    setDialogTitle(allWords.misc.addPoste);
    if (post_res) {
      dispatch(getPostData(20));
      allPostData?.data?.old_post?.filter((val) => {
        if (val?.post_id === post_res[0]?.post_id) {
          setAddPost(true);
        }
      });
    }
  }, [post_res]);

  const inputRef = useRef("");

  function onCaptionChange(e, index) {
    setCaptionLength(e.target.value.length);
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

  function onDeleteCaption(e, index) {
    if (index === 0) {
      setImageCaption1(imageCaption2);
      setImageCaption2(imageCaption3);
      setImageCaption3(imageCaption4);
      return setImageCaption4("");
    }
    if (index === 1) {
      setImageCaption1(imageCaption1);
      setImageCaption2(imageCaption3);
      setImageCaption3(imageCaption4);
      return setImageCaption4("");
    }
    if (index === 2) {
      setImageCaption1(imageCaption1);
      setImageCaption2(imageCaption2);
      setImageCaption3(imageCaption4);
      return setImageCaption4("");
    }
    if (index === 3) {
      setImageCaption1(imageCaption1);
      setImageCaption2(imageCaption2);
      setImageCaption3(imageCaption3);
      return setImageCaption4("");
    }

    if (imgArray.length < 1) {
      setImageCaption1("");
      setImageCaption2("");
      setImageCaption3("");
      setImageCaption4("");
    }
  }

  const handleCrop = () => {
    editImageRef.current?.setCroppedImage();
    setEditImage(false);
  };

  // poll toggle
  const handlePollToggle = async () => {
    setPollState(!pollState);
    setVideoFilePath(null);
    setDocsFilePath(null);
    setAduioFilePath(null);
    setImgArray([]);
  };

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
      ToastHandler("warn", allWords.misc.entersomeval);
      return;
    }

    if (textInput === "") {
      ToastHandler("warn", "Kindly provide the question for the Poll.");
      return;
    }

    if (state_data?.length === 2) {
      if (
        (state_data?.[0]?.["length"] !== 0 &&
          state_data?.[1]?.["length"] === 0) ||
        (state_data?.[0]?.["length"] === 0 &&
          state_data?.[1]?.["length"] !== 0) ||
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

    let str = "";
    if (textInput.includes('"')) {
      str = textInput.replace(/"/g, '\\"');
    } else if (textInput.includes("\n")) {
      str = textInput.replace(/(?:\r\n|\r|\n)/g, " <br /> ");
    } else {
      str = textInput;
    }

    const data = new FormData();
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

    const config = {
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
          if (window.location.pathname === "/home") {
            setDayDuration(Number(pollData.duration[0]));
            setHourDuration(Number(pollData.duration[2]));
            //
          }
        }
        dispatch(getPostData(20));
        setAddPost(false);
      })
      .catch();
  };

  return (
    <>
      <Dialog
        classes={{paper: classes.paper}}
        open={open}
        PaperProps={{
          style: {
            borderRadius: "1rem",
            // width: 550,
            overflowY: "unset",
            // height: "20rem",
          },
        }}
      >
        <DialogTitle>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p style={{fontWeight: "bold"}}>
              {parentType === "SNIPPET"
                ? allWords.th.snipit
                : parentType === "K3"
                ? allWords.K3.create
                : parentType === "BKK"
                ? allWords.bkk.create
                : allWords.th.post}
            </p>
            <div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.1, opacity: 0.8 }}
              >
                <IconButton
                  onClick={() => {
                    setDiscard(true);
                    if (["SNIPPET", "K3","BKK"].includes(parentType)) {
                      setMsgFlag({title: "", flag: false});
                    }
                  }}
                >
                  <CancelOutlined />
                </IconButton>
              </motion.div>
            </div>
          </div>
        </DialogTitle>
        <DialogContent
          style={{
            overflowY: "scroll",
            paddingBottom: videoError ? "": "0"
          }}
        >
          <MainDiv>
            {editImage ? (
              <>
                <EditImage
                  imageSrc={imageSrc}
                  style={{
                    width: "100%",
                  }}
                  setImgArray={setImgArray}
                  ref={editImageRef}
                />
              </>
            ) : (
              <>
                <div className="input_container">
                    <UserProfile
                     borderRadius= "50%"
                     height= "46px"
                     width= "46px"
                    username={
                      JSON.parse(
                        localStorage.current_user || localStorage.anonymous_user
                      )?.["username"]
                    }
                  />

                  <div
                    style={{
                      width: "26.4rem",
                      marginLeft: "0.2rem",
                      height: "9rem",
                      borderRadius: "8px",
                      padding: "1px",
                      marginBottom: "1rem",
                    }}
                  >
                    <UserListInput
                      name="add dialog"
                      placeholder={
                        parentType === "K3" ? allWords.K3.description
                          : parentType === "BKK" ? allWords.bkk.description
                            : allWords.th.placeholder
                        }
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
                          charCount = txt.length - allLinksSize + allLinks.length * 4;
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
                            charCount = charCount + allLinksSize - allLinks.length * 4;
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
                        {textCount >= 0 && textCount <= 300 ? 300 - textCount : 300}/300
                      </p>
                  </div>
                </div>

                <Grid container spacing={2} className="main_container">
                  {videoFilePath && (
                    <Grid item md={12}>
                      <VideoContainer
                        setVideoDuration={setVideoDuration}
                        setStartVideoTime={setStartVideoTime}
                        setEndVideoTime={setEndVideoTime}
                        setCaption={setCaption}
                        showCaption
                        controls
                        editVideo={editVideo}
                        src={videoFilePath}
                        videoFilePath={videoFilePath}
                        setVideoFilePath={setVideoFilePath}
                        setEditVideo={setEditVideo}
                        setDialogTitle={setDialogTitle}
                        videoDuration={videoDuration}
                        videoFile={videoFile}
                        setState={setState}
                        endVideoTime={endVideoTime}
                        parentType={parentType}
                        setVideoError={setVideoError}
                      />
                    </Grid>
                  )}
                  {imgArray.length > 0 && (
                    <>
                      {imgArray.map((item, index) => {
                        return (
                          <>
                            <Grid
                              item
                              md={imgArray.length < 2 ? 12 : 6}
                              style={index < 2 ? {paddingTop: "0"} : {}}
                              key={item}
                            >
                              <ImageContainer
                                captionLength={captionLength}
                                onCaptionChange={(e) => onCaptionChange(e, index)}
                                onDeleteCaption={(e) => onDeleteCaption(e, index)}
                                imageCaption={imageCaptionPropHandler(index)}
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
                          </>
                        );
                      })}
                    </>
                  )}
                  {docsFilePath && (
                    <div
                      style={{
                        marginTop: "1rem",
                        marginLeft: "1rem",
                        width: "100%",
                      }}
                    >
                      <DocsContainer
                        showCaption
                        docsFilePath={docsFilePath}
                        handle
                        docsFile={docsFile?.name}
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
                          setAudioDuration={setAudioDuration}
                          setStartAudioTime={setStartAudioTime}
                          setEndAudioTime={setEndAudioTime}
                          setCaption={setCaption}
                          showCaption
                          user
                          audioFilePath={audioFilePath}
                          setAduioFilePath={setAduioFilePath}
                          startAudioTime={startAudioTime}
                          endAudioTime={endAudioTime}
                          isPlaying
                          setState={setState}
                          audioFile={audioFile}
                        />
                      )}
                    </>
                  )}
                  {/* poll  view*/}
                  {pollState && (
                    <div style={{marginTop: "1rem"}}>
                      <PollFormContainer
                        setPollData={setPollData}
                        setStateData={setStateData}
                      />
                    </div>
                  )}
                </Grid>
              </>
            )}
          </MainDiv>
        </DialogContent>
        {videoError && <VidErrorDiv>{videoError}</VidErrorDiv>}
        <DialogActions>
          {editImage && (
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                gap: "2rem",
                alignItems: "center",
              }}
            >
              <Button
                primary
                onClick={() => {
                  setEditImage(false);
                  setDialogTitle(allWords.misc.addPoste);
                }}
              >
                {allWords.misc.cancel}
              </Button>
              <Button bgColor onClick={handleCrop}>
                {allWords.misc.save}
              </Button>
            </div>
          )}
          {!editImage && (
            <IconContainer>
              <div className="d-flex add_post_all_icons_div">
                {/* videos */}
                &emsp;
                <IconButton
                  variant="contained"
                  component="label"
                  className="add_post_video_icon"
                >
                  <VideoIcon />
                  <input
                    type="file"
                    accept="video/*"
                    hidden
                    onChange={handleVideoChange}
                  />
                </IconButton>{" "}
                <>&emsp;</>
                {/* images */}
                <IconButton
                  variant="contained"
                  component="label"
                  hidden={["SNIPPET", "K3","BKK"].includes(parentType)}
                >
                  <PhotoIcon />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleImageChange}
                  />
                </IconButton>
                <>&emsp;</>
                {/* docs */}
                <IconButton
                  variant="contained"
                  component="label"
                  hidden={["SNIPPET", "K3","BKK"].includes(parentType)}
                >
                  <DocsIcon />
                  <input
                    type="file"
                    accept=".doc,.docx,.pdf,.xlsx,.xls,.ppt,.pptx"
                    hidden
                    onChange={handleDocsChange}
                  />
                </IconButton>
                <>&emsp;</>
                {/* audio */}
                <IconButton
                  variant="contained"
                  component="label"
                  hidden={["SNIPPET", "K3","BKK"].includes(parentType)}
                >
                  <input type="file" accept="audio/*" hidden onChange={handleAudioChange} />
                  <AudioIcon />
                </IconButton>
                <>&emsp;</>
                {/* poll icon */}
                <IconButton
                  variant="contained"
                  onClick={handlePollToggle}
                  hidden={["SNIPPET", "K3","BKK"].includes(parentType)}
                  className="add_post_poll_icon"
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
              </div>
              {addPostLoading ? (
                <>
                  <CircularProgress
                    style={{ color: "#66B984", width: 40, height: 40 }}
                  />
                </>
              ) : (
                <AddPostBtn
                  disabled={disable}
                  style={{ marginRight: "1.6rem" }}
                  type="submit"
                  onClick={() => {
                    if (
                      localStorage.anonymous_user &&
                      !localStorage.current_user
                    )
                      return setModalOpen(true);

                    if (pollState) {
                      handlePollSubmit();
                      setMsgFlag({ title: "Poll", flag: true });
                    } else {
                      handlePostSubmit();
                      if (
                        textInput.trim() === "" &&
                        !imgArray.length > 0 &&
                        !docsFilePath &&
                        !audioFilePath &&
                        !videoFilePath
                      ) {
                        setMsgFlag({ title: "", flag: false });
                      } else setMsgFlag({ title: "Post", flag: true });
                    }
                  }}
                >
                  {allWords.th.post}
                </AddPostBtn>
              )}
            </IconContainer>
          )}
        </DialogActions>
      </Dialog>
      <PreloginComp
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        icon={
          <AddCircleIcon
            color={"success"}
            style={{
              width: "40px",
              height: "40px",
            }}
          />
        }
        title={allWords.th.prelogMessagePost}
        description={""}
      />
    </>
  );
};

const CreatedPostToast = ({ postId, isParentType }) => {
  const toastClickHandler = () => {};
  return (
    <div>
      <span>
        {isParentType === "SNIPPET" ? allWords.misc.created_snip_success :
          isParentType === "K3" ? allWords.misc.created_khabar_success :
            isParentType === "BKK" ? allWords.misc.created_bol_success :
              allWords.misc.created_post_success}
      </span>
      {/* { (postId && isSnippet) && <span style={{textDecoration: "underline", display: 'inline-block', marginLeft: '5px', lineHeight:'10px'}} onClick={toastClickHandler}>{allWords.misc.livert.view}</span>} */}
    </div>
  );
};

export default AddPostDialog;
