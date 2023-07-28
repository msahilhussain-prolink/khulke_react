import React, { useEffect, useState, useRef } from "react";
import { POST_API_BASE_URL } from "../../../constants/env";
import { Grid, IconButton, Paper } from "@mui/material";
import { MainDiv, Avatar, Input, IconContainer, AddPostBtn } from "./style";
import CircularProgress from "@mui/material/CircularProgress";
import AudioIcon from "../../IconsComponents/AudioIcon";
import DocsIcon from "../../IconsComponents/DocsIcon";
import PhotoIcon from "../../IconsComponents/PhotoIcon";
import VideoIcon from "../../IconsComponents/VideoIcon";
import PollIcon from "../../../assets/icons/poll_icon.svg";
import ImageContainer from "./ImageContainer";
import VideoContainer from "./VideoContainer";
import AudioContainer from "./AudioContainer";
import DocsContainer from "./DocsContainer";
import EditAudio from "./EditAudio";
import EditVideo from "./EditVideo";
import { useDispatch, useSelector } from "react-redux";
import { getPostData, addPostData } from "../../../redux/actions/postAction";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { motion } from "framer-motion";
import moment from "moment";
import styled from "styled-components";
import EditImage from "./EditImage";
import UserListInput from "../../UserListInput/userListInput";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axios from "axios";
import PollFormContainer from "../../PollFormContainer";
import ToastHandler from "../../../utils/ToastHandler";
import PreloginComp from "../../PreLoginComp";
import { CancelOutlined } from "@material-ui/icons";
import UserProfile from "../../UserProfile";
import { allWords } from "../../../App";

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
}) => {
  const [state, setState] = React.useState(false);
  const [startAudioTime, setStartAudioTime] = useState(0);
  const [endAudioTime, setEndAudioTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [startVideoTime, setStartVideoTime] = useState(0);
  const [endVideoTime, setEndVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(null);
  const [xlFile, setXlFile] = React.useState(null);
  const [wordFile, setWordFile] = React.useState(null);
  const [showVideo, setShowVideo] = React.useState(false);
  const [showAudio, setShowAudio] = React.useState(false);
  const [showImage, setShowImage] = React.useState(false);
  const [showDocs, setShowDocs] = React.useState(false);
  const [pptFile, setPptFile] = React.useState(null);
  const [editAudio, setEditAudio] = React.useState(false);
  const [editVideo, setEditVideo] = React.useState(false);
  const [editImage, setEditImage] = React.useState(false);
  const [imageCaption1, setImageCaption1] = React.useState("");
  const [imageCaption2, setImageCaption2] = React.useState("");
  const [imageCaption3, setImageCaption3] = React.useState("");
  const [imageCaption4, setImageCaption4] = React.useState("");
  const [imgArray, setImgArray] = React.useState([]);
  const [indexValue, setIndexValue] = React.useState(null);
  const [captionLength, setCaptionLength] = useState(0);
  const [imageSrc, setImageSrc] = React.useState({
    index: null,
    url: null,
    file: null,
  });
  const [disable, setDisable] = useState(false);
  const [lengthError, setLengthError] = useState(false);
  const [videoFilePath, setVideoFilePath] = React.useState(null);
  const [videoFile, setVideoFile] = React.useState(null);
  const [docsFilePath, setDocsFilePath] = React.useState(null);
  const [docsFile, setDocsFile] = React.useState(null);
  const [audioFilePath, setAduioFilePath] = React.useState(null);
  const [audioFile, setAduioFile] = React.useState(null);
  const [textInput, setTextInput] = React.useState("");
  const [value, setValue] = React.useState(0);
  const [caption, setCaption] = React.useState("");
  const [textCount, setTextCount] = React.useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const dispatch = useDispatch();
  const allPostData = useSelector((state) => state.post.posts);
  const post_res = useSelector((state) => state.post.post_res);
  const addPostLoading = useSelector((state) => state.post.loading);
  const [image, setImage] = useState(null);
  const [pollState, setPollState] = useState(false);
  const editImageRef = useRef();
  const [pollData, setPollData] = useState({
    option: [],
    duration: "",
  });
  const [state_data, setStateData] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

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

    var video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);
      if (video.duration > 150) {
        setLengthError(true);
        // setDisable(true);
      }
    };
    video.src = URL.createObjectURL(e.target.files[0]);

    if (videoFile) {
      let size = e.target.files[0].size;
      if (Math.round(size / 1024) > 256000) {
        ToastHandler("warn", "Upload a video file less than 250 MB.");
        setState(false);
        return false;
      }
      // setVideoFile(e.target.files[0]);
      // setDocsFilePath(URL.createObjectURL(e.target.files[0]));
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
      setShowVideo(true);
    }

    setEditImage(false);
    setEditVideo(false);
    setEditAudio(false);

    e.target.value = null;
  };

  // if (editVideo) {
  //   setLengthError(false);
  // }
  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    if (!imageFile) {
      //  alert("Please select image.");
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
        // imgArray.push(...e.target.files);
      }
    } else {
      ToastHandler("warn", allWords.misc.toastMsg.only4ImageAllowed);
    }

    setShowImage(true);
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
    var allowedExtensions = /(\.pdf|\.xls|\.xlsx|\.doc|\.docx|\.ppt|\.pptx)$/i;
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
      // setDocsFile(e.target.files[0]);
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
      ToastHandler(
        "warn",
        "Invalid audio file format. Please upload mp3 file."
      );
      return false;
    }

    if (e.target.files) {
      setAduioFile(e.target.files[0]);
      setAduioFilePath(URL.createObjectURL(e.target.files[0]));
    }
    setShowAudio(true);

    setEditImage(false);
    setEditVideo(false);
    setEditAudio(false);

    e.target.value = null;
  };

  const handleInputChange = (e) => {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    let newArr = e.target.value.split(" ");
    let tCount = 0;
    let text = 0;
    newArr.filter((item, index) => {
      if (item.match(urlRegex)) {
        tCount =
          item.match(urlRegex).length * 4 - item.match(urlRegex)[0].length;
      } else {
        text = e.target.value.length;
      }

      setTextCount(text + tCount);
    });
  };

  const handlePostSubmit = async () => {
    localStorage.removeItem("text_data");
    const formData = new FormData();

    if (
      textInput === "" &&
      !imgArray.length > 0 &&
      !docsFilePath &&
      !audioFilePath &&
      !videoFilePath
    ) {
      ToastHandler("warn", allWords.misc.entersomeval);
      return;
    }
    if (
      textInput &&
      !imgArray.length > 0 &&
      !docsFilePath &&
      !audioFilePath &&
      !videoFilePath
    ) {
      if (textInput.includes('"')) {
        var str = textInput.replace(/"/g, '\\"');
        formData.append("message", `{"type":"TEXT","text":"${str}"}`);
      } else if (textInput.includes("\n")) {
        var str = textInput.replace(/(?:\r\n|\r|\n)/g, " <br /> ");
        formData.append("message", `{"type":"TEXT","text":"${str}"}`);
      } else {
        formData.append("message", `{"type":"TEXT","text":"${textInput}"}`);
      }
    } else if ((imgArray.length > 0 && textInput) || imgArray.length > 0) {
      if (imgArray.length === 1) {
        if (textInput.includes('"')) {
          var str = textInput.replace(/"/g, '\\"');
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${str}","caption":["${imageCaption1}"],"tags":[""],"file_type":["IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
        } else if (textInput.includes("\n")) {
          var str = textInput.replace(/(?:\r\n|\r|\n)/g, " <br /> ");
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${str}","caption":["${imageCaption1}"],"tags":[""],"file_type":["IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
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
          var str = textInput.replace(/"/g, '\\"');
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${str}","caption":["${imageCaption1}","${imageCaption2}"],"tags":[""],"file_type":["IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
        } else if (textInput.includes("\n")) {
          var str = textInput.replace(/(?:\r\n|\r|\n)/g, " <br /> ");
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${str}","caption":["${imageCaption1}","${imageCaption2}"],"tags":[""],"file_type":["IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
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
          var str = textInput.replace(/"/g, '\\"');
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${str}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
        } else if (textInput.includes("\n")) {
          var str = textInput.replace(/(?:\r\n|\r|\n)/g, " <br /> ");
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${str}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
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
          var str = textInput.replace(/"/g, '\\"');
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${str}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}","${imageCaption4}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
        } else if (textInput.includes("\n")) {
          var str = textInput.replace(/(?:\r\n|\r|\n)/g, " <br /> ");
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${str}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}","${imageCaption4}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
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
      if (videoDuration > 150) {
        return ToastHandler(
          "warn",
          "Max. duration for Video should be 2min 30sec only."
        );
      }

      if (textInput.includes('"')) {
        var str = textInput.replace(/"/g, '\\"');
        formData.append(
          "message",
          `{"type":"POST","media_type":"VIDEO","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["VIDEO"],"start_duration":["${
            startVideoTime || endVideoTime ? startVideoTime : null
          }"],"end_duration":["${
            endVideoTime ? endVideoTime : null
          }"],"duration":["${
            videoDuration ? videoDuration : null
          }"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"]}`
        );
      } else if (textInput.includes("\n")) {
        var str = textInput.replace(/(?:\r\n|\r|\n)/g, " <br /> ");
        formData.append(
          "message",
          `{"type":"POST","media_type":"VIDEO","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["VIDEO"],"start_duration":["${
            startVideoTime || endVideoTime ? startVideoTime : null
          }"],"end_duration":["${
            endVideoTime ? endVideoTime : null
          }"],"duration":["${
            videoDuration ? videoDuration : null
          }"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"]}`
        );
      } else {
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
          var str = textInput.replace(/"/g, '\\"');
          formData.append(
            "message",
            `{"type":"POST","media_type":"XLS","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["XLS"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
        } else if (textInput.includes("\n")) {
          var str = textInput.replace(/(?:\r\n|\r|\n)/g, " <br /> ");
          formData.append(
            "message",
            `{"type":"POST","media_type":"XLS","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["XLS"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
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
          var str = textInput.replace(/"/g, '\\"');
          formData.append(
            "message",
            `{"type":"POST","media_type":"PDF","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["PDF"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
        } else if (textInput.includes("\n")) {
          var str = textInput.replace(/(?:\r\n|\r|\n)/g, " <br /> ");
          formData.append(
            "message",
            `{"type":"POST","media_type":"PDF","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["PDF"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
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
          var str = textInput.replace(/"/g, '\\"');
          formData.append(
            "message",
            `{"type":"POST","media_type":"DOC","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["DOC"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
        } else if (textInput.includes("\n")) {
          var str = textInput.replace(/(?:\r\n|\r|\n)/g, " <br /> ");
          formData.append(
            "message",
            `{"type":"POST","media_type":"DOC","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["DOC"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
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
          var str = textInput.replace(/"/g, '\\"');
          formData.append(
            "message",
            `{"type":"POST","media_type":"PPTX","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["PPTX"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
        } else if (textInput.includes("\n")) {
          var str = textInput.replace(/(?:\r\n|\r|\n)/g, " <br /> ");
          formData.append(
            "message",
            `{"type":"POST","media_type":"PPTX","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["PPTX"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
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
        var str = textInput.replace(/"/g, '\\"');
        formData.append(
          "message",
          `{"type":"POST","media_type":"AUDIO","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["AUDIO"],"start_duration":["${
            startAudioTime || endAudioTime ? startAudioTime : null
          }"],"end_duration":["${
            endAudioTime ? endAudioTime : null
          }"],"duration":["${
            audioDuration ? audioDuration : null
          }"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"]}`
        );
      } else if (textInput.includes("\n")) {
        var str = textInput.replace(/(?:\r\n|\r|\n)/g, " <br /> ");
        formData.append(
          "message",
          `{"type":"POST","media_type":"AUDIO","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["AUDIO"],"start_duration":["${
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

    dispatch(addPostData(formData, "Snip-It"));
    setAddPost(false);
  };

  useEffect(() => {
    setDialogTitle(allWords.misc.addPoste);
    if (post_res) {
      dispatch(getPostData(20));
      // setAddPost(false);
      allPostData?.data?.old_post?.filter((val) => {
        if (val?.post_id === post_res[0]?.post_id) {
          setAddPost(true);
        }
      });
      // if (msgFlag === true) {

      // }
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

  const handlePaste = () => {
    setDisable(false);
  };

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
        open={open}
        PaperProps={{
          style: { borderRadius: "1rem", width: 600, overflowY: "unset" },
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
            <p style={{ fontWeight: "bold" }}>{allWords.misc.addPoste}</p>
            <div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.1, opacity: 0.8 }}
              >
                <IconButton
                  onClick={() => {
                    setDiscard(true);
                    //setAddPost(false);
                    //localStorage.removeItem("text_data");
                  }}
                  style={{ width: 50, height: 50 }}
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

                {/* {editVideo && (
                  <EditVideo
                    setEditVideo={setEditVideo}
                    editVideo={editVideo}
                    setDialogTitle={setDialogTitle}
                    setStartVideoTime={setStartVideoTime}
                    setEndVideoTime={setEndVideoTime}
                    setVideoDuration={setVideoDuration}
                    setVideoFilePath={setVideoFilePath}
                    videoFilePath={videoFilePath}
                    videoDuration={videoDuration}
                    videoFile={videoFile}
                    setShowVideo={setShowVideo}
                  />
                )} */}
                {/* {editAudio && (
                  <EditAudio
                    setEditAudio={setEditAudio}
                    setDialogTitle={setDialogTitle}
                  />
                )} */}
              </>
            ) : (
              <>
                <div className="input_container">
                  <UserProfile
                    username={
                      JSON.parse(
                        localStorage.current_user || localStorage.anonymous_user
                      )?.["username"]
                    }
                  />
                  {/* <Input
                placeholder="Write your post here.."
                onChange={handleInputChange}
                maxLength={300}
              /> */}
                  <UserListInput
                    name="add dialog"
                    placeholder={allWords.misc.livert.writeplace}
                    className="post-area"
                    refs={inputRef}
                    maxLength={textCount === 0 ? 300 : ""}
                    value={textInput}
                    listDirection="bottom"
                    // onKeyDown={handleInputChange}
                    onChange={(e) => {
                      const txt = e.target.value;
                      const urlRegex = /\bhttps?:\/\/\S+/gi;
                      var charCount;

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
                      inputRef.current.style.height = "";
                      inputRef.current.style.height =
                        Math.min(inputRef.current.scrollHeight, 300) + "px";
                    }}
                  />
                  <p style={{ margin: 0, opacity: "0.6" }}>
                    {textCount >= 0 && textCount <= 300 ? 300 - textCount : 300}
                    /300
                  </p>
                </div>
                {/* {lengthError && (
                  <p style={{ color: "red" }}>
                    Max. duration for video is 2min 30sec only. Kindly trim the
                    video to 2min 30sec.
                  </p>
                )} */}
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
                        setShowVideo={setShowVideo}
                        setDialogTitle={setDialogTitle}
                        videoDuration={videoDuration}
                        videoFile={videoFile}
                        setLengthError={setLengthError}
                        setState={setState}
                        endVideoTime={endVideoTime}
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
                              style={index < 2 ? { paddingTop: "0" } : {}}
                              key={index}
                            >
                              <ImageContainer
                                captionLength={captionLength}
                                onCaptionChange={(e) =>
                                  onCaptionChange(e, index)
                                }
                                onDeleteCaption={(e) =>
                                  onDeleteCaption(e, index)
                                }
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
                                setIndexValue={setIndexValue}
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
                          setEditAudio={setEditAudio}
                          isPlaying
                          setState={setState}
                          audioFile={audioFile}
                        />
                      )}
                    </>
                  )}
                  {/* poll  view*/}
                  {pollState && (
                    <div style={{ marginTop: "1rem" }}>
                      <PollFormContainer
                        setPollData={setPollData}
                        setStateData={setStateData}
                      />
                    </div>
                  )}
                </Grid>
              </>
            )}
            {/* {showImage && <LinearProgress variant="determinate" value={50} />} */}
          </MainDiv>
        </DialogContent>

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
              <div>
                {/* videos */}
                <IconButton variant="contained" component="label">
                  <VideoIcon />
                  <input
                    type="file"
                    accept="video/*"
                    hidden
                    onChange={handleVideoChange}
                  />
                </IconButton>
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
                {/* audio */}
                <IconButton variant="contained" component="label">
                  <input
                    type="file"
                    accept="audio/*"
                    hidden
                    onChange={handleAudioChange}
                  />
                  <AudioIcon />
                </IconButton>
                {/* poll icon */}
                <IconButton variant="contained" onClick={handlePollToggle}>
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
              <AddPostBtn
                disabled={disable}
                type="submit"
                onClick={() => {
                  if (localStorage.anonymous_user && !localStorage.current_user)
                    return setModalOpen(true);

                  if (pollState) {
                    handlePollSubmit();
                    setMsgFlag({ title: "Poll", flag: true });
                  } else {
                    handlePostSubmit();
                    setMsgFlag({ title: "Post", flag: true });
                  }
                }}
              >
                {allWords.th.post}
              </AddPostBtn>
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
        title={"For creating Post, Login or sign up to Khul Ke"}
        description={""}
      />
    </>
  );
};

export default AddPostDialog;
