import React, { useEffect, useRef, useState } from "react";
import { POST_API_BASE_URL } from "../../../constants/env";
import IconButton from "@mui/material/IconButton";
import { Grid, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { CardContainer, IconContainer, AddPostBtn } from "./style";
import AudioIcon from "../../IconsComponents/AudioIcon";
import DocsIcon from "../../IconsComponents/DocsIcon";
import PhotoIcon from "../../IconsComponents/PhotoIcon";
import VideoIcon from "../../IconsComponents/VideoIcon";
import DocIconSvg from "../../../assets/icons/post_doc_icon.svg";
import AudioIconSvg from "../../../assets/icons/post_audio_icon.svg";
import VideoIconSvg from "../../../assets/icons/post_video_icon.svg";
import ImageIconSvg from "../../../assets/icons/post_image_icon.svg";
import VideoContainer from "../AddPostDialog/VideoContainer";
import ImageContainer from "../AddPostDialog/ImageContainer";
import AudioContainer from "../AddPostDialog/AudioContainer";
import DocsContainer from "../AddPostDialog/DocsContainer";
import EditImage from "../AddPostDialog/EditImage";
import { useDispatch, useSelector } from "react-redux";
import { getPostData, addPostData } from "../../../redux/actions/postAction";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { motion } from "framer-motion";
import styled from "styled-components";
import PollIcon from "../../../assets/icons/poll_icon.svg";
import moment from "moment";
import "./style.css";
import UserListInput from "../../UserListInput/userListInput";
import TagManager from "react-gtm-module";
import axios from "axios";
import PollFormContainer from "../../PollFormContainer";
import DiscardDialog from "../AddPostDialog/DiscardDialog";
import ToastHandler from "../../../utils/ToastHandler";
import AddPostDialog from "../AddPostDialog";
import DiscardDialog1 from "./DiscardDialog";
import { CancelOutlined } from "@material-ui/icons";
import { allWords } from "../../../App";
import UserProfile from "../../UserProfile";
import logger from "../../../logger";

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

const CreatePost = ({ setDayDuration, setHourDuration }) => {
  const [state, setState] = useState(false);
  const [state2, setState2] = useState(false);
  const [openDiscardDialog, setOpenDiscardDialog] = useState(false);
  const [discardDialog, setDiscardDialog] = useState(false);
  const [startAudioTime, setStartAudioTime] = useState(0);
  const [endAudioTime, setEndAudioTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [startVideoTime, setStartVideoTime] = useState(0);
  const [endVideoTime, setEndVideoTime] = useState(0);
  const [editImage, setEditImage] = useState(false);
  const [imageSrc, setImageSrc] = useState({
    index: null,
    url: null,
    file: null,
  });
  const [textInput, setTextInput] = useState("");
  const [caption, setCaption] = useState("");
  const [lengthError, setLengthError] = useState(false);
  const [imageCaption1, setImageCaption1] = useState("");
  const [imageCaption2, setImageCaption2] = useState("");
  const [imageCaption3, setImageCaption3] = useState("");
  const [imageCaption4, setImageCaption4] = useState("");
  const [videoFilePath, setVideoFilePath] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [audioFilePath, setAduioFilePath] = useState(null);
  const [audioFile, setAduioFile] = useState(null);
  const [docsFilePath, setDocsFilePath] = useState(null);
  const [xlFile, setXlFile] = useState(null);
  const [wordFile, setWordFile] = useState(null);
  const [pptFile, setPptFile] = useState(null);
  const [docsFile, setDocsFile] = useState(null);
  const [imgArray, setImgArray] = useState([]);
  const [disable, setDisable] = useState(true);
  const [captionLength, setCaptionLength] = useState(0);
  const [dialogTitle, setDialogTitle] = useState("");
  const [videoDuration, setVideoDuration] = useState(null);
  const [textCount, setTextCount] = useState(0);
  const post_res = useSelector((state) => state.post.post_res);
  const addPostLoading = useSelector((state) => state.post.loading);
  const dispatch = useDispatch();
  const inputRef = useRef();

  const editImageRef = useRef();
  const [pollState, setPollState] = useState(false);
  const [pollData, setPollData] = useState({
    option: [],
    duration: "",
  });
  const [msgFlag, setMsgFlag] = useState(false);
  const [addPost, setAddPost] = useState(false);

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

  useEffect(() => {
    if (textInput) {
      return setDisable(false);
    } else {
      setDisable(true);
    }
  }, [textInput]);

  const handleVideoChange = async (e) => {
    setDisable(false);
    setAduioFilePath(null);
    setDocsFilePath(null);
    setImgArray([]);
    setState(true);
    setState2(true);
    setPollState(false);
    setLengthError(false);

    const videoFile = e.target.files[0];
    window.URL = window.URL || window.webkitURL;

    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);
      if (video.duration > 150) {
        setLengthError(true);
      }
    };
    video.src = URL.createObjectURL(e.target.files[0]);

    if (!videoFile) {
      ToastHandler("warn", "Please select video.");
      setState2(false);
      return false;
    }
    if (!videoFile.name.match(/\.(mp4|MP4)$/)) {
      ToastHandler("warn", allWords.misc.toastMsg.invalidVideoFormat);
      setState(false);
      return false;
    }

    if (videoFile) {
      let size = e.target.files[0].size;

      if (Math.round(size / 1024) > 256000) {
        ToastHandler("warn", "Upload a video file less than 250 MB.");
        setState(false);
        setState2(false);
        return false;
      }
      setVideoFile(e.target.files[0]);
    }

    if (e.target.files) {
      setVideoFile(e.target.files[0]);
      setVideoFilePath(URL.createObjectURL(e.target.files[0]));
    } else {
      setVideoFilePath(null);
    }
    e.target.value = null;
  };

  const handleImageChange = (e) => {
    setDisable(false);
    setVideoFilePath(null);
    setDocsFilePath(null);
    setAduioFilePath(null);
    setState(true);
    setState2(true);
    setPollState(false);

    const imageFile = e.target.files[0];

    if (imageFile) {
      for (let i = 0; i < e.target.files.length; i++) {
        let size = e.target.files[i].size;
        if (Math.round(size / 1024) > 1024 * 15) {
          ToastHandler("warn", "Upload an image less than 15 MB.");
          setState(false);
          setState2(false);
          e.target.value = null;
          return false;
        }
      }
    }

    if (!imageFile) {
      ToastHandler("warn", "Please select image.");
      setState2(false);
      return false;
    }
    if (!imageFile.name.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/)) {
      ToastHandler("warn", allWords.misc.toastMsg.invalidImgFormat);
      setState2(false);
      return false;
    }
    const images = e.target.files;

    if (images.length <= 4) {
      if (imgArray.length === 4) {
        setState(false);

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
        } else {
          setImgArray([]);
        }
      }
    } else {
      setState(false);

      ToastHandler("warn", allWords.misc.toastMsg.only4ImageAllowed);
    }

    e.target.value = null;
  };

  const handleDocsChange = (e) => {
    setDisable(false);
    setVideoFilePath(null);
    setAduioFilePath(null);
    setImgArray([]);
    setState(true);
    setState2(true);
    setPollState(false);

    const docfile = e.target.files[0];
    let filePath = docfile?.name;

    // Allowing file type
    const allowedExtensions =
      /(\.pdf|\.xls|\.xlsx|\.doc|\.docx|\.ppt|\.pptx)$/i;
    if (!allowedExtensions.exec(filePath)) {
      ToastHandler(
        "warn",
        "Invalid file format. Please upload pdf, doc, ppt, xlx files."
      );
      setState2(false);
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
        setState2(false);
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
    setDisable(false);
    setVideoFilePath(null);
    setImgArray([]);
    setDocsFilePath(null);
    setState(true);
    setState2(true);
    setPollState(false);
    const audiofile = e.target.files[0];

    if (!audiofile) {
      ToastHandler("warn", "Please select audio.");
      return false;
    }
    if (!audiofile.name.match(/\.(mp3)$/)) {
      ToastHandler("warn", allWords.misc.toastMsg.invalidAudioFormat);
      setState2(false);
      return false;
    }

    if (e.target.files) {
      setAduioFile(e.target.files[0]);
      setAduioFilePath(URL.createObjectURL(e.target.files[0]));
    } else {
      ToastHandler("warn", "Please select audio.");
    }

    e.target.value = null;
  };

  const handlePostSubmit = () => {
    inputRef.current.style.height = "40px";
    localStorage.removeItem("input_text");
    const formData = new FormData();

    const str1 = textInput.replace(/"/g, '\\"');
    const str2 = textInput.replace(/(?:\r\n|\r|\n)/g, " <br /> ");

    if (
      textInput === "" &&
      !imgArray.length > 0 &&
      !docsFilePath &&
      !audioFilePath &&
      !videoFilePath &&
      !localStorage.getItem("input_text")
    ) {
      ToastHandler("warn", allWords.misc.entersomeval);
    }

    if (
      textInput &&
      !imgArray.length > 0 &&
      !docsFilePath &&
      !audioFilePath &&
      !videoFilePath
    ) {
      setAduioFile(null);

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
          formData.append("image", imgArray[0].file);
        } else if (textInput.includes("\n")) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${str2}","caption":["${imageCaption1}"],"tags":[""],"file_type":["IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
          formData.append("image", imgArray[0].file);
        } else {
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${textInput}","caption":["${imageCaption1}"],"tags":[""],"file_type":["IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
          formData.append("image", imgArray[0].file);
        }
      }
      if (imgArray.length === 2) {
        if (textInput.includes('"')) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${str1}","caption":["${imageCaption1}","${imageCaption2}"],"tags":[""],"file_type":["IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
          for (let i in imgArray) {
            formData.append("image", imgArray[i].file);
          }
        } else if (textInput.includes("\n")) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${str2}","caption":["${imageCaption1}","${imageCaption2}"],"tags":[""],"file_type":["IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
          for (let i in imgArray) {
            formData.append("image", imgArray[i].file);
          }
        } else {
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${textInput}","caption":["${imageCaption1}","${imageCaption2}"],"tags":[""],"file_type":["IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
          for (let i in imgArray) {
            formData.append("image", imgArray[i].file);
          }
        }
      }
      if (imgArray.length === 3) {
        if (textInput.includes('"')) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${str1}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
          for (let i in imgArray) {
            formData.append("image", imgArray[i].file);
          }
        } else if (textInput.includes("\n")) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${str2}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
          for (let i in imgArray) {
            formData.append("image", imgArray[i].file);
          }
        } else {
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${textInput}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
          for (let i in imgArray) {
            formData.append("image", imgArray[i].file);
          }
        }
      }
      if (imgArray.length === 4) {
        if (textInput.includes('"')) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${str1}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}","${imageCaption4}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
          for (let i in imgArray) {
            formData.append("image", imgArray[i].file);
          }
        } else if (textInput.includes("\n")) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${str2}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}","${imageCaption4}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
          for (let i in imgArray) {
            formData.append("image", imgArray[i].file);
          }
        } else {
          formData.append(
            "message",
            `{"type":"POST","media_type":"IMAGE","text":"${textInput}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}","${imageCaption4}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
          );
          for (let i in imgArray) {
            formData.append("image", imgArray[i].file);
          }
        }
      }
    } else if ((videoFilePath && textInput) || videoFilePath) {
      if (videoDuration > 150) {
        ToastHandler(
          "warn",
          "Max. duration for Video should be 2min 30sec only."
        );

        return false;
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
        formData.append("video", videoFile);
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
        formData.append("video", videoFile);
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
        formData.append("video", videoFile);
      }
    } else if ((docsFilePath && textInput) || docsFilePath) {
      if (xlFile) {
        if (textInput.includes('"')) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"XLS","text":"${str1}","caption":["${caption}"],"tags":[""],"file_type":["XLS"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
          formData.append("doc", xlFile);
        } else if (textInput.includes("\n")) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"XLS","text":"${str2}","caption":["${caption}"],"tags":[""],"file_type":["XLS"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
          formData.append("doc", xlFile);
        } else {
          formData.append(
            "message",
            `{"type":"POST","media_type":"XLS","text":"${textInput}","caption":["${caption}"],"tags":[""],"file_type":["XLS"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
          formData.append("doc", xlFile);
        }
      } else if (docsFile) {
        if (textInput.includes('"')) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"PDF","text":"${str1}","caption":["${caption}"],"tags":[""],"file_type":["PDF"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
          formData.append("doc", docsFile);
        } else if (textInput.includes("\n")) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"PDF","text":"${str2}","caption":["${caption}"],"tags":[""],"file_type":["PDF"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
          formData.append("doc", docsFile);
        } else {
          formData.append(
            "message",
            `{"type":"POST","media_type":"PDF","text":"${textInput}","caption":["${caption}"],"tags":[""],"file_type":["PDF"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
          formData.append("doc", docsFile);
        }
      } else if (wordFile) {
        if (textInput.includes('"')) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"DOC","text":"${str1}","caption":["${caption}"],"tags":[""],"file_type":["DOC"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
          formData.append("doc", wordFile);
        } else if (textInput.includes("\n")) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"DOC","text":"${str2}","caption":["${caption}"],"tags":[""],"file_type":["DOC"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
          formData.append("doc", wordFile);
        } else {
          formData.append(
            "message",
            `{"type":"POST","media_type":"DOC","text":"${textInput}","caption":["${caption}"],"tags":[""],"file_type":["DOC"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
          formData.append("doc", wordFile);
        }
      } else if (pptFile) {
        if (textInput.includes('"')) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"PPTX","text":"${str1}","caption":["${caption}"],"tags":[""],"file_type":["PPTX"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
          formData.append("doc", pptFile);
        } else if (textInput.includes("\n")) {
          formData.append(
            "message",
            `{"type":"POST","media_type":"PPTX","text":"${str2}","caption":["${caption}"],"tags":[""],"file_type":["PPTX"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
          formData.append("doc", pptFile);
        } else {
          formData.append(
            "message",
            `{"type":"POST","media_type":"PPTX","text":"${textInput}","caption":["${caption}"],"tags":[""],"file_type":["PPTX"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
          );
          formData.append("doc", pptFile);
        }
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

        formData.append("audio", audioFile);
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

        formData.append("audio", audioFile);
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

        formData.append("audio", audioFile);
      }
    }

    dispatch(
      addPostData(formData, "Post", ({ err }) => {
        if (err) {
          return logger.info(err);
        }
      })
    );
    setMsgFlag(true);

    setImageCaption1("");
    setImageCaption2("");
    setImageCaption3("");
    setImageCaption4("");
    setCaptionLength(0);
    setAduioFile();
    setAduioFilePath();
    setVideoFile();
    setVideoFilePath();
    setTextCount(0);
  };
  useEffect(() => {
    if (post_res) {
      dispatch(getPostData(20));
      setState(false);
      setState2(false);
      setTextInput("");
      setVideoFilePath(null);
      setImgArray([]);
      setDocsFilePath(null);
      setDialogTitle(allWords.misc.addPoste);

      if (msgFlag === true) {
        ToastHandler("sus", allWords.misc.created_post_success);
      }
    }
  }, [post_res]);

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

  useEffect(() => {
    if (localStorage.getItem("input_text")) {
      setDisable(false);
    }
  }, [startAudioTime, endAudioTime, audioDuration]);

  const handleCrop = async () => {
    editImageRef.current?.setCroppedImage();
    setEditImage(false);
  };

  const handlePollToggle = async () => {
    setPollState(!pollState);
    setVideoFilePath(null);
    setDocsFilePath(null);
    setAduioFilePath(null);
    setImgArray([]);
  };

  const [state_data, setStateData] = useState([]);

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
          setTextInput("");
          setDayDuration(Number(pollData.duration[0]));
          setHourDuration(Number(pollData.duration[2]));
        }
        setState2(false);
        dispatch(getPostData(20));

        ToastHandler("sus", "Your poll has been created.");
      })
      .catch(function (error) {
        logger.info(error);
      });
  };

  let current_user = JSON.parse(
    localStorage.current_user || localStorage.anonymous_user
  );

  // gtm events
  function gtmEventVideo() {
    TagManager.dataLayer({
      dataLayer: {
        event: "Townhall post Event",
        category: "Townhall action",
        action: "video",
        label: "Click",
        userID: current_user._id,
      },
    });
  }
  function gtmEventImage() {
    TagManager.dataLayer({
      dataLayer: {
        event: "Townhall post Event",
        category: "Townhall action",
        action: "image",
        label: "Click",
        userID: current_user._id,
      },
    });
  }
  function gtmEventAttachment() {
    TagManager.dataLayer({
      dataLayer: {
        event: "Townhall post Event",
        category: "Townhall action",
        action: "attachment",
        label: "Click",
        userID: current_user._id,
      },
    });
  }
  function gtmEventAudio() {
    TagManager.dataLayer({
      dataLayer: {
        event: "Townhall post Event",
        category: "Townhall action",
        action: "audio",
        label: "Click",
        userID: current_user._id,
      },
    });
  }
  function gtmEventPoll() {
    TagManager.dataLayer({
      dataLayer: {
        event: "Townhall post Event",
        category: "Townhall action",
        action: "poll",
        label: "Click",
        userID: current_user._id,
      },
    });
  }

  const closeModal = () => {
    setImgArray([]);
    setState2(false);
    setEditImage(false);
    setTextInput("");
    setVideoFile(null);
    setVideoFilePath(null);
    setAduioFile(null);
    setAduioFilePath(null);
    setOpenDiscardDialog(false);
    setDocsFile(null);
    setDocsFilePath(null);
    localStorage.removeItem("input_text");
    setImageCaption1("");
    setImageCaption2("");
    setImageCaption3("");
    setImageCaption4("");
  };

  return (
    <>
      <DiscardDialog1
        open={openDiscardDialog}
        close={() => {
          setOpenDiscardDialog(false);
        }}
        confirm={closeModal}
      />
      {discardDialog && (
        <DiscardDialog setDiscard={setDiscardDialog} setAddPost={setAddPost} />
      )}
      {addPost && (
        <AddPostDialog
          open={addPost}
          setAddPost={setAddPost}
          setDialogTitle={setDialogTitle}
          setDiscard={setDiscardDialog}
          setDayDuration={setDayDuration}
          setHourDuration={setHourDuration}
          setMsgFlag={setMsgFlag}
        />
      )}
      <CardContainer className="bg-white createPostStep">
        <div
          className="d-flex"
          style={{
            width: "auto",
            padding: "1rem 1rem 1rem 0.2rem",
            marginBottom: "1rem",
          }}
        >
          <UserProfile
            username={
              JSON.parse(
                localStorage.current_user || localStorage.anonymous_user
              )?.username
            }
          />
          &emsp;
          <div
            className="d-flex cardText"
            onClick={() => {
              setAddPost(true);
            }}
          >
            <Typography className="card_typo">
              {allWords.th.placeholder}
            </Typography>
            <Typography className="card_typo">300</Typography>
          </div>
        </div>

        <IconContainer>
          <div
            className="icon_container"
            style={{ justifyContent: "space-between", marginTop: "-1rem" }}
          >
            {/* videos */}
            <IconButton
              variant="contained"
              component="label"
              // onClick={gtmEventVideo}
              className="videoStep"
            >
              {/* <VideoIcon /> */}
              <img src={VideoIconSvg} alt="" />
              <input
                type="file"
                accept="video/*"
                hidden
                onClick={() => gtmEventVideo()}
                onChange={handleVideoChange}
              />
              &nbsp;
              {window.screen.width >= 768 && (
                <Typography
                  style={{
                    color: "#7A7A7A",
                    fontSize: "1rem",
                    fontWeight: "600",
                  }}
                >
                  {allWords.createRT.videoBtn}
                </Typography>
              )}
            </IconButton>

            {/* images */}
            <IconButton
              variant="contained"
              component="label"
              // onClick={gtmEventImage}
              className="photoStep"
            >
              <img src={ImageIconSvg} alt="" />
              {/* <PhotoIcon /> */}
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onClick={() => gtmEventImage()}
                onChange={handleImageChange}
              />
              &nbsp;
              {window.screen.width >= 768 && (
                <Typography
                  style={{
                    color: "#7A7A7A",
                    fontSize: "1rem",
                    fontWeight: "600",
                  }}
                >
                  {allWords.th.image}
                </Typography>
              )}
            </IconButton>
            {/* docs */}
            <IconButton
              variant="contained"
              component="label"
              className="docStep"
            >
              <img src={DocIconSvg} alt="" />
              {/* <DocsIcon /> */}
              <input
                type="file"
                accept=".doc,.docx,.pdf,.xlsx,.xls,.ppt,.pptx"
                hidden
                onClick={() => gtmEventAttachment()}
                onChange={handleDocsChange}
              />
              &nbsp;
              {window.screen.width >= 768 && (
                <Typography
                  style={{
                    color: "#7A7A7A",
                    fontSize: "1rem",
                    fontWeight: "600",
                  }}
                >
                  {allWords.th.document}
                </Typography>
              )}
            </IconButton>
            {/* audio */}
            <IconButton
              variant="contained"
              component="label"
              className="audioStep"
            >
              <input
                type="file"
                accept="audio/*"
                hidden
                onClick={() => gtmEventAudio()}
                onChange={handleAudioChange}
              />
              <img src={AudioIconSvg} alt="" />
              &nbsp;
              {window.screen.width >= 768 && (
                <Typography
                  style={{
                    color: "#7A7A7A",
                    fontSize: "1rem",
                    fontWeight: "600",
                  }}
                >
                  {allWords.th.audio}
                </Typography>
              )}
              {/* <AudioIcon /> */}
            </IconButton>

            {/* poll icon */}
            <IconButton
              variant="contained"
              onClick={() => {
                gtmEventPoll();
                setState2(true);
                setPollState(true);
              }}
              className="pollStep"
            >
              <img
                src={PollIcon}
                style={{
                  width: "1.4rem",
                  height: "1.4rem",
                }}
                alt="poll-icon"
              />
              &nbsp;
              {window.screen.width >= 768 && (
                <Typography
                  style={{
                    color: "#7A7A7A",
                    fontSize: "1rem",
                    fontWeight: "600",
                  }}
                >
                  {allWords.th.poll}
                </Typography>
              )}
            </IconButton>
          </div>
        </IconContainer>
      </CardContainer>
      {state2 && (
        <Dialog
          open={state2}
          PaperProps={{
            style: { borderRadius: "0.8rem", width: 600 },
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
              <p style={{ fontWeight: "bold" }}>{allWords.th.post}</p>
              <div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.1, opacity: 0.8 }}
                >
                  <IconButton
                    onClick={() => {
                      setOpenDiscardDialog(true);
                    }}
                    style={{ width: 50, height: 50 }}
                  >
                    <CancelOutlined />
                  </IconButton>
                </motion.div>
              </div>
            </div>
          </DialogTitle>

          <DialogContent>
            <Grid
              container
              className="main_container"
              style={{ maxWidth: 600 }}
              spacing={2}
            >
              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  width: "100%",
                  alignItems: "start",
                }}
              >
                {!editImage && (
                  <>
                    &emsp;
                    <UserProfile
                      username={
                        JSON.parse(
                          localStorage.current_user ||
                            localStorage.anonymous_user
                        )?.username
                      }
                    />
                    {/* &emsp; */}
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

                          localStorage.setItem("input_text", e.target.value);
                        }}
                      />
                      <p
                        style={{ margin: 0, opacity: "0.6", textAlign: "end" }}
                      >
                        {textCount >= 0 && textCount <= 300
                          ? 300 - textCount
                          : 300}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {editImage ? (
                <>
                  {editImage && (
                    <EditImage
                      imageSrc={imageSrc}
                      style={{
                        width: "100%",
                      }}
                      setImgArray={setImgArray}
                      ref={editImageRef}
                    />
                  )}
                </>
              ) : (
                <>
                  {videoFilePath && (
                    <Grid
                      item
                      md={12}
                      style={{
                        paddingTop: "0px",
                        paddingBottom: "0px",
                      }}
                    >
                      <VideoContainer
                        setVideoDuration={setVideoDuration}
                        setStartVideoTime={setStartVideoTime}
                        setEndVideoTime={setEndVideoTime}
                        setCaption={setCaption}
                        setLengthError={setLengthError}
                        showCaption
                        controls
                        src={videoFilePath}
                        videoFilePath={videoFilePath}
                        setVideoFilePath={setVideoFilePath}
                        setState={setState}
                        videoDuration={videoDuration}
                        endVideoTime={endVideoTime}
                        videoFile={videoFile}
                        setDialogTitle={setDialogTitle}
                      />
                      {lengthError && (
                        <p style={{ color: "red", marginTop: "10px" }}>
                          {allWords.misc.maxvidoel}
                        </p>
                      )}
                    </Grid>
                  )}

                  {imgArray && (
                    <>
                      {imgArray.map((item, index) => {
                        return (
                          <>
                            <Grid
                              item
                              md={imgArray.length < 2 ? 12 : 6}
                              style={index < 2 ? { paddingTop: "0" } : {}}
                              key={item}
                            >
                              <ImageContainer
                                imageCaption={imageCaptionPropHandler(index)}
                                onCaptionChange={(e) =>
                                  onCaptionChange(e, index)
                                }
                                captionLength={captionLength}
                                onDeleteCaption={(e) =>
                                  onDeleteCaption(e, index)
                                }
                                setState={setState}
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
                    <>
                      <Grid
                        item
                        md={12}
                        style={{
                          paddingTop: "0px",
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
                      </Grid>
                    </>
                  )}
                  {audioFilePath && (
                    <>
                      <Grid item md={12} style={{ paddingTop: 0 }}>
                        <AudioContainer
                          setAudioDuration={setAudioDuration}
                          setStartAudioTime={setStartAudioTime}
                          setEndAudioTime={setEndAudioTime}
                          setCaption={setCaption}
                          showCaption
                          startAudioTime={startAudioTime}
                          endAudioTime={endAudioTime}
                          user
                          audioFilePath={audioFilePath}
                          setAduioFilePath={setAduioFilePath}
                          setState={setState}
                          audioFile={audioFile}
                          isPlaying
                        />
                      </Grid>
                    </>
                  )}
                </>
              )}

              {/* poll  view*/}
              {pollState && (
                <PollFormContainer
                  setPollData={setPollData}
                  setStateData={setStateData}
                />
              )}
            </Grid>
          </DialogContent>

          <DialogActions>
            {!editImage && (
              <IconContainer>
                <div>
                  {/* videos */}
                  <IconButton
                    variant="contained"
                    component="label"
                    style={{ paddingLeft: "30px" }}
                  >
                    <VideoIcon />
                    <input
                      type="file"
                      accept="video/*"
                      hidden
                      onChange={handleVideoChange}
                    />
                  </IconButton>
                  {/* images */}
                  <IconButton
                    variant="contained"
                    component="label"
                    style={{ paddingLeft: "30px" }}
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
                  {/* docs */}
                  <IconButton
                    variant="contained"
                    component="label"
                    style={{ paddingLeft: "30px" }}
                  >
                    <DocsIcon />
                    <input
                      type="file"
                      accept=".doc,.docx,.pdf,.xlsx,.xls"
                      hidden
                      onChange={handleDocsChange}
                    />
                  </IconButton>
                  {/* audio */}
                  <IconButton
                    variant="contained"
                    component="label"
                    style={{ paddingLeft: "30px" }}
                  >
                    <input
                      type="file"
                      accept="audio/*"
                      hidden
                      onChange={handleAudioChange}
                    />
                    <AudioIcon />
                  </IconButton>
                  {/* poll icon */}
                  <IconButton
                    variant="contained"
                    onClick={handlePollToggle}
                    style={{ paddingLeft: "30px" }}
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
                  <>
                    <AddPostBtn
                      // disabled={disable}
                      onClick={() => {
                        if (pollState) {
                          handlePollSubmit();
                        } else {
                          handlePostSubmit();
                        }
                      }}
                    >
                      {allWords.th.post}
                    </AddPostBtn>
                  </>
                )}
              </IconContainer>
            )}

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
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default CreatePost;
