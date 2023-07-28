import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allWords } from "../../App";
import ReplyIconSVG from "../../assets/icons/reply_icon.svg";
import { REACT_APP_BASE_URL_FOR_USER } from "../../constants/env";
import { addReplyPost } from "../../redux/actions/RTuserInteractionAction";
import DocsIcon from "../IconsComponents/DocsIcon";
import PhotoIcon from "../IconsComponents/PhotoIcon";
import { PostBtn, ReplyDiv } from "./style";

import { CancelOutlined } from "@material-ui/icons";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { Link } from "react-router-dom";
import ToastHandler from "../../utils/ToastHandler";
import { auto_login_continue } from "../../utils/utils";
import AudioContainer from "../Post/AddPostDialog/AudioContainer";
import DocsContainer from "../Post/AddPostDialog/DocsContainer";
import EditImage from "../Post/AddPostDialog/EditImage";
import ImageContainer from "../Post/AddPostDialog/ImageContainer";
import VideoContainer from "../Post/AddPostDialog/VideoContainer";
import PreloginComp from "../PreLoginComp";
import UserProfile from "../UserProfile";
import ViewersChat from "../ViewerChat";
import "../Reply/style.css";

const Reply = ({
  post_id,
  title,
  imgData,
  username,
  setChatReply,
  videoFile,
  docsFile,
  audioFile,
  loading,
  name,
  replyData,
  formatted_created_at,
  likeCount,
  like_self,
  dislike_self,
  totalComment,
  setLike,
  setLikeCount,
  chatReply,
  post_media,
  raw_text,
  ppt,
  excel,
  doc,
  pdf,
  complete_url,
  youtube_url,
}) => {
  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [textInput, setTextInput] = React.useState("");
  const [imageCaption1, setImageCaption1] = React.useState([]);
  const [imageCaption2, setImageCaption2] = React.useState("");
  const [imageCaption3, setImageCaption3] = React.useState("");
  const [imageCaption4, setImageCaption4] = React.useState("");
  const [showVideo, setShowVideo] = React.useState(false);
  const [showAudio, setShowAudio] = React.useState(false);
  const [showImage, setShowImage] = React.useState(false);
  const [showDocs, setShowDocs] = React.useState(false);
  const [textCount, setTextCount] = React.useState(0);
  const [editAudio, setEditAudio] = React.useState(false);
  const [editVideo, setEditVideo] = React.useState(false);
  const [editImage, setEditImage] = React.useState(false);
  const [imgArray, setImgArray] = React.useState([]);
  const [imgUpload, setImgUpload] = React.useState([]);
  const [imageSrc, setImageSrc] = React.useState({
    index: null,
    url: null,
    file: null,
  });
  const editImageRef = useRef();
  const [videoFilePath, setVideoFilePath] = React.useState(null);
  const [replyVideoFile, setReplyVideoFile] = React.useState(null);
  const [docsFilePath, setDocsFilePath] = React.useState(null);
  const [replyDocsFile, setReplyDocsFile] = React.useState(null);
  const [audioFilePath, setAduioFilePath] = React.useState(null);
  const [replyAudioFile, setQuoteAduioFile] = React.useState(null);

  const [indexValue, setIndexValue] = React.useState(null);
  const [caption, setCaption] = React.useState("");
  const inputRef = React.useRef("");
  const allPostData = useSelector((state) => state.post.posts);

  const [state, setState] = React.useState(false);
  const [quoteDocsFile, setQuoteDocsFile] = React.useState(null);
  const [xlFile, setXlFile] = React.useState(null);
  const [wordFile, setWordFile] = React.useState(null);
  const [pptFile, setPptFile] = React.useState(null);

  const handleCrop = () => {
    editImageRef.current?.setCroppedImage();
    setEditImage(false);
  };

  const handleVideoChange = (e) => {
    const videoFile = e.target.files[0];

    if (!videoFile) {
      ToastHandler("warn", "Please select video.");
      return false;
    }
    if (!videoFile.name.match(/\.(mp4|3gp)$/)) {
      ToastHandler("warn", allWords.misc.toastMsg.invalidVideoFormat);
      return false;
    }
    setAduioFilePath(null);
    setDocsFilePath(null);
    setImgArray([]);
    if (e.target.files) {
      setReplyVideoFile(e.target.files[0]);
      setVideoFilePath(URL.createObjectURL(e.target.files[0]));
      setShowVideo(true);
    }

    setEditImage(false);
    setEditVideo(false);
    setEditAudio(false);
  };
  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];

    if (!imageFile) {
      ToastHandler("warn", "Please select image.");
      return false;
    }
    if (!imageFile.name.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/)) {
      ToastHandler("warn", allWords.misc.toastMsg.invalidImgFormat);
      return false;
    }
    setVideoFilePath(null);
    setAduioFilePath(null);
    setDocsFilePath(null);
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
  };

  const handleDocsChange = (e) => {
    setVideoFilePath(null);
    setAduioFilePath(null);
    setImgArray([]);
    setState(true);
    const docfile = e.target.files[0];
    let filePath = docfile?.name;

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
    // if (docfile.name.match(/\.(pdf)$/)) {
    //   setQuoteDocsFile(e.target.files[0]);
    // } else if (docfile.name.match(/\.(xlsx)$/)) {
    //   setXlFile(e.target.files[0]);
    // } else if (docfile.name.match(/\.(xls)$/)) {
    //   setXlFile(e.target.files[0]);
    // } else if (docfile.name.match(/\.(doc)$/)) {
    //   setWordFile(e.target.files[0]);
    // } else if (docfile.name.match(/\.(docx)$/)) {
    //   setWordFile(docfile);
    // }
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

  const handleAudioChange = (e) => {
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
      setQuoteAduioFile(e.target.files[0]);
      setAduioFilePath(URL.createObjectURL(e.target.files[0]));

      setVideoFilePath(null);
      setDocsFilePath(null);
      setImgArray([]);
    } else {
      ToastHandler("warn", "Please select audio.");
    }
    setShowAudio(true);
  };

  const handleReply = () => {
    if (!localStorage.current_user && localStorage.anonymous_user)
      return setModalOpen(true);

    // setLike(false);
    // setLikeCount(0);
    let formData = new FormData();
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

        formData.append(
          "message",
          `{"type":"COMMENT","post_id":"${post_id}","text":"${str}","parent_type":"ROUNDTABLE","usernames":"[]"}`
        );
      } else if (textInput.includes("\n")) {
        var str = textInput.replace(/(?:\r\n|\r|\n)/g, " <br /> ");
        formData.append(
          "message",
          `{"type":"COMMENT","post_id":"${post_id}","text":"${str}","parent_type":"ROUNDTABLE","usernames":"[]"}`
        );
      } else {
        formData.append(
          "message",
          `{"type":"COMMENT","post_id":"${post_id}","text":"${textInput}","parent_type":"ROUNDTABLE","usernames":"[]"}`
        );
      }
    } else if ((imgArray.length > 0 && textInput) || imgArray.length > 0) {
      if (imgArray.length === 1) {
        if (textInput.includes('"')) {
          var str = textInput.replace(/"/g, '\\"');

          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"IMAGE","text":"${str}","caption":["${imageCaption1}"],"tags":[""],"file_type":["IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE","usernames":"[]"}`
          );
        } else if (textInput.includes("\n")) {
          var str = textInput.replace(/(?:\r\n|\r|\n)/g, " <br /> ");
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"IMAGE","text":"${str}","caption":["${imageCaption1}"],"tags":[""],"file_type":["IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE","usernames":"[]"}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"IMAGE","text":"${textInput}","caption":["${imageCaption1}"],"tags":[""],"file_type":["IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE","usernames":"[]"}`
          );
        }

        formData.append("image", imgArray[0].file);
      }
      if (imgArray.length === 2) {
        if (textInput.includes('"')) {
          var str = textInput.replace(/"/g, '\\"');

          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"IMAGE","text":"${str}","caption":["${imageCaption1}","${imageCaption2}"],"tags":[""],"file_type":["IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE","usernames":"[]"}`
          );
        } else if (textInput.includes("\n")) {
          var str = textInput.replace(/(?:\r\n|\r|\n)/g, " <br /> ");
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"IMAGE","text":"${str}","caption":["${imageCaption1}","${imageCaption2}"],"tags":[""],"file_type":["IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE","usernames":"[]"}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"IMAGE","text":"${textInput}","caption":["${imageCaption1}","${imageCaption2}"],"tags":[""],"file_type":["IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE","usernames":"[]"}`
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
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"IMAGE","text":"${str}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE","usernames":"[]"}`
          );
        } else if (textInput.includes("\n")) {
          var str = textInput.replace(/(?:\r\n|\r|\n)/g, " <br /> ");
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"IMAGE","text":"${str}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE","usernames":"[]"}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"IMAGE","text":"${textInput}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE","usernames":"[]"}`
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
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"IMAGE","text":"${str}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}","${imageCaption4}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE","usernames":"[]"}`
          );
        } else if (textInput.includes("\n")) {
          var str = textInput.replace(/(?:\r\n|\r|\n)/g, " <br /> ");
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"IMAGE","text":"${str}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}","${imageCaption4}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE","usernames":"[]"}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"IMAGE","text":"${textInput}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}","${imageCaption4}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE","usernames":"[]"}`
          );
        }

        for (let i in imgArray) {
          formData.append("image", imgArray[i].file);
        }
      }
    } else if ((audioFilePath && textInput) || audioFilePath) {
      if (textInput.includes('"')) {
        var str = textInput.replace(/"/g, '\\"');

        formData.append(
          "message",
          `{"type":"COMMENT","post_id":"${post_id}","media_type":"AUDIO","text":"${str}","caption":[""],"tags":[""],"file_type":["AUDIO"],"start_duration":["0"],"end_duration":["9"],"duration":["9"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
        );
      } else if (textInput.includes("\n")) {
        var str = textInput.replace(/(?:\r\n|\r|\n)/g, " <br /> ");
        formData.append(
          "message",
          `{"type":"COMMENT","post_id":"${post_id}","media_type":"AUDIO","text":"${str}","caption":[""],"tags":[""],"file_type":["AUDIO"],"start_duration":["0"],"end_duration":["9"],"duration":["9"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
        );
      } else {
        formData.append(
          "message",
          `{"type":"COMMENT","post_id":"${post_id}","media_type":"AUDIO","text":"${textInput}","caption":[""],"tags":[""],"file_type":["AUDIO"],"start_duration":["0"],"end_duration":["9"],"duration":["9"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
        );
      }

      formData.append("audio", replyAudioFile);
    } else if ((videoFilePath && textInput) || videoFilePath) {
      if (textInput.includes('"')) {
        var str = textInput.replace(/"/g, '\\"');

        formData.append(
          "message",
          `{"type":"COMMENT","post_id":"${post_id}","media_type":"VIDEO","text":"${str}","caption":[""],"tags":[""],"file_type":["VIDEO"],"start_duration":["0"],"end_duration":["6"],"duration":["6"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
        );
      } else if (textInput.includes("\n")) {
        var str = textInput.replace(/(?:\r\n|\r|\n)/g, " <br /> ");
        formData.append(
          "message",
          `{"type":"COMMENT","post_id":"${post_id}","media_type":"VIDEO","text":"${str}","caption":[""],"tags":[""],"file_type":["VIDEO"],"start_duration":["0"],"end_duration":["6"],"duration":["6"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
        );
      } else {
        formData.append(
          "message",
          `{"type":"COMMENT","post_id":"${post_id}","media_type":"VIDEO","text":"${textInput}","caption":[""],"tags":[""],"file_type":["VIDEO"],"start_duration":["0"],"end_duration":["6"],"duration":["6"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
        );
      }

      formData.append("video", replyVideoFile);
    } else if ((docsFilePath && textInput) || docsFilePath) {
      if (xlFile) {
        if (textInput.includes('"')) {
          var str = textInput.replace(/"/g, '\\"');
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"XLS","text":"${str}","caption":[""],"tags":[""],"file_type":["XLS"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
          );
        } else if (textInput.includes("\n")) {
          var str = textInput.replace(/(?:\r\n|\r|\n)/g, " <br /> ");
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"XLS","text":"${str}","caption":[""],"tags":[""],"file_type":["XLS"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"XLS","text":"${str}","caption":[""],"tags":[""],"file_type":["XLS"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
          );
        }

        formData.append("doc", xlFile);
      } else if (quoteDocsFile) {
        if (textInput.includes('"')) {
          var str = textInput.replace(/"/g, '\\"');
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"PDF","text":"${str}","caption":[""],"tags":[""],"file_type":["PDF"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
          );
        } else if (textInput.includes("\n")) {
          var str = textInput.replace(/(?:\r\n|\r|\n)/g, " <br /> ");
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"PDF","text":"${str}","caption":[""],"tags":[""],"file_type":["PDF"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"PDF","text":"${str}","caption":[""],"tags":[""],"file_type":["PDF"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
          );
        }

        formData.append("doc", quoteDocsFile);
      } else if (wordFile) {
        if (textInput.includes('"')) {
          var str = textInput.replace(/"/g, '\\"');
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"DOC","text":"${str}","caption":[""],"tags":[""],"file_type":["DOC"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
          );
        } else if (textInput.includes("\n")) {
          var str = textInput.replace(/(?:\r\n|\r|\n)/g, " <br /> ");
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"DOC","text":"${str}","caption":[""],"tags":[""],"file_type":["DOC"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"DOC","text":"${str}","caption":[""],"tags":[""],"file_type":["DOC"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
          );
        }

        formData.append("doc", wordFile);
      } else if (pptFile) {
        if (textInput.includes('"')) {
          var str = textInput.replace(/"/g, '\\"');
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"PPTX","text":"${str}","caption":[""],"tags":[""],"file_type":["PPTX"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
          );
        } else if (textInput.includes("\n")) {
          var str = textInput.replace(/(?:\r\n|\r|\n)/g, " <br /> ");
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"PPTX","text":"${str}","caption":[""],"tags":[""],"file_type":["PPTX"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"PPTX","text":"${str}","caption":[""],"tags":[""],"file_type":["PPTX"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
          );
        }

        formData.append("doc", pptFile);
      }
    }

    dispatch(addReplyPost(formData));
    setChatReply(false);
    // dispatch(getPostData(50));
  };

  const handleInputChange = (e) => {
    setTextInput(e.target.value);
    setTextCount(e.target.value.length);
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

  // get meta data
  const getMetaData = async (complete_url) => {
    var data = JSON.stringify({
      target_url: complete_url[0].complete_url,
    });

    var config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/${
        localStorage.anonymous_user
          ? "anonymous/get_meta_data"
          : "get_meta_data/"
      }`,
      headers: {
        Authorization: `Bearer ${
          localStorage.access || JSON.parse(localStorage.anonymous_user).token
        }`,
        "Content-Type": "application/json",
      },
      data: data,
    };
    // setMetadataLoading(true);
    await axios(config)
      .then()
      .catch(async function (error) {
        const res = error.response;
        if (!res) {
          return;
        }

        if (res.status === 401) {
          return await auto_login_continue(() => getMetaData(complete_url));
        }
        // setMetadataLoading(false);
      });
  };

  useEffect(() => {
    if (complete_url) {
      getMetaData(complete_url);
    }
  }, [complete_url]);

  return (
    <Dialog
      open={true}
      onClose={() => {
        setChatReply(false);
      }}
      PaperProps={{
        style: {
          borderRadius: "0.8rem",
          width: 600,
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
          <p style={{ fontWeight: "bold" }}>{allWords.misc.repply}</p>
          <div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.1, opacity: 0.8 }}
            >
              <IconButton
                onClick={() => {
                  setChatReply(false);
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
        <ReplyDiv>
          <div className="reply_header">
            <div>
              <img
                src={ReplyIconSVG}
                alt="reply"
                style={{ width: 25, height: 25, marginRight: "0.2rem" }}
              />
              <p>{allWords.misc.livert.reply}</p>
              <span>
                <Link
                  to={`/profile/${username}/posts`}
                  target="_blank"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  @{username}
                </Link>
              </span>
            </div>
            <hr />
          </div>
          <div className="reply_body">
            {title && !videoFile && !docsFile && !imgData && (
              <ViewersChat
                post_media={post_media}
                post_id={post_id}
                hideIconContainer
                username={username}
                name={name}
                title={title}
                className={"post_card"}
                totalLike={likeCount}
                like_self={like_self}
                dislike_self={dislike_self}
                totalComment={totalComment}
                raw_text={raw_text}
                complete_url={complete_url}
              />
            )}

            {pdf && title ? (
              <ViewersChat
                post_media={post_media}
                post_id={post_id}
                hideIconContainer
                title={title}
                username={username}
                name={name}
                pdf
                docsFile={docsFile}
                className={"post_card"}
                totalLike={likeCount}
                like_self={like_self}
                dislike_self={dislike_self}
                totalComment={totalComment}
              />
            ) : (
              <>
                {pdf && (
                  <ViewersChat
                    post_media={post_media}
                    post_id={post_id}
                    hideIconContainer
                    username={username}
                    name={name}
                    pdf
                    docsFile={docsFile}
                    className={"post_card"}
                    totalLike={likeCount}
                    like_self={like_self}
                    dislike_self={dislike_self}
                    totalComment={totalComment}
                  />
                )}
              </>
            )}
            {ppt && title ? (
              <ViewersChat
                post_media={post_media}
                post_id={post_id}
                hideIconContainer
                // circulate_user={circulate_user}
                title={title}
                username={username}
                name={name}
                ppt
                docsFile={docsFile}
                className={"post_card"}
                totalLike={likeCount}
                like_self={like_self}
                dislike_self={dislike_self}
                totalComment={totalComment}
              />
            ) : (
              <>
                {ppt && (
                  <ViewersChat
                    post_media={post_media}
                    post_id={post_id}
                    hideIconContainer
                    username={username}
                    name={name}
                    ppt
                    docsFile={docsFile}
                    className={"post_card"}
                    totalLike={likeCount}
                    like_self={like_self}
                    dislike_self={dislike_self}
                    totalComment={totalComment}
                  />
                )}
              </>
            )}
            {excel && title ? (
              <ViewersChat
                post_media={post_media}
                post_id={post_id}
                hideIconContainer
                // circulate_user={circulate_user}
                title={title}
                username={username}
                name={name}
                excel
                docsFile={docsFile}
                className={"post_card"}
                totalLike={likeCount}
                like_self={like_self}
                dislike_self={dislike_self}
                totalComment={totalComment}
              />
            ) : (
              <>
                {excel && (
                  <ViewersChat
                    post_media={post_media}
                    post_id={post_id}
                    hideIconContainer
                    username={username}
                    name={name}
                    excel
                    docsFile={docsFile}
                    className={"post_card"}
                    totalLike={likeCount}
                    like_self={like_self}
                    dislike_self={dislike_self}
                    totalComment={totalComment}
                  />
                )}
              </>
            )}
            {doc && title ? (
              <ViewersChat
                post_media={post_media}
                post_id={post_id}
                hideIconContainer
                // circulate_user={circulate_user}
                title={title}
                username={username}
                name={name}
                doc
                docsFile={docsFile}
                className={"post_card"}
                totalLike={likeCount}
                like_self={like_self}
                dislike_self={dislike_self}
                totalComment={totalComment}
              />
            ) : (
              <>
                {doc && (
                  <ViewersChat
                    post_media={post_media}
                    post_id={post_id}
                    hideIconContainer
                    username={username}
                    name={name}
                    doc
                    docsFile={docsFile}
                    className={"post_card"}
                    totalLike={likeCount}
                    like_self={like_self}
                    dislike_self={dislike_self}
                    totalComment={totalComment}
                  />
                )}
              </>
            )}

            {imgData && title ? (
              <ViewersChat
                post_media={post_media}
                post_id={post_id}
                hideIconContainer
                title={title}
                username={username}
                name={name}
                imgData={imgData}
                className={"post_card"}
                formatted_created_at={formatted_created_at}
                totalLike={likeCount}
                like_self={like_self}
                dislike_self={dislike_self}
                totalComment={totalComment}
              />
            ) : (
              <>
                {imgData && (
                  <ViewersChat
                    post_id={post_id}
                    post_media={post_media}
                    hideIconContainer
                    username={username}
                    name={name}
                    imgData={imgData}
                    className={"post_card"}
                    totalLike={likeCount}
                    like_self={like_self}
                    dislike_self={dislike_self}
                    totalComment={totalComment}
                  />
                )}
              </>
            )}

            <div className="reply_input_container">
              <UserProfile
                username={
                  JSON.parse(
                    localStorage.current_user || localStorage.anonymous_user
                  )?.["username"]
                }
              />
              <textarea
                placeholder={allWords.misc.livert.writeplace}
                className="post-area"
                ref={inputRef}
                maxLength={300}
                // onPaste={handlePaste}
                // onInput={handleInputChange2}
                onChange={(e) => {
                  handleInputChange(e);
                  localStorage.setItem("text_data", e.target.value);
                  inputRef.current.style.height = "";
                  inputRef.current.style.height =
                    Math.min(inputRef.current.scrollHeight, 300) + "px";
                }}
              ></textarea>
              {300 - textCount}/{300}
            </div>
          </div>

          <Grid
            container
            spacing={2}
            className="main_container"
            style={{ marginTop: "0.5rem" }}
          >
            {audioFilePath && (
              <AudioContainer
                user
                audioFilePath={audioFilePath}
                setAduioFilePath={setAduioFilePath}
              />
            )}
            {videoFilePath && (
              <>
                <Grid item md={12}>
                  <VideoContainer
                    controls
                    src={videoFilePath}
                    videoFilePath={videoFilePath}
                    setVideoFilePath={setVideoFilePath}
                    setEditVideo={setEditVideo}
                    setShowVideo={setShowVideo}
                  />
                </Grid>
              </>
            )}
            {imgArray && !editImage && (
              <>
                {imgArray.map((item, index) => {
                  imgUpload.push(item);
                  return (
                    <>
                      {imgArray.length === 1 && (
                        <Grid item md={12} key={index}>
                          <ImageContainer
                            onCaptionChange={(e) => onCaptionChange(e, index)}
                            // setState={setState}
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
                        <Grid item md={6} key={index}>
                          <ImageContainer
                            onCaptionChange={(e) => onCaptionChange(e, index)}
                            // setState={setState}
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
                        <>
                          <Grid item md={6} key={index}>
                            <ImageContainer
                              onCaptionChange={(e) => onCaptionChange(e, index)}
                              // setState={setState}
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
                      )}

                      {imgArray.length === 4 && (
                        <Grid item md={6} key={index}>
                          <ImageContainer
                            onCaptionChange={(e) => onCaptionChange(e, index)}
                            // setState={setState}
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
            {imgArray && editImage && (
              <EditImage
                imageSrc={imageSrc}
                style={{
                  width: "100%",
                }}
                setImgArray={setImgArray}
                ref={editImageRef}
              />
            )}
            {docsFilePath && (
              <>
                <DocsContainer
                  docsFilePath={docsFilePath}
                  docsFile={quoteDocsFile?.name}
                  excelDoc={xlFile?.name}
                  pptDoc={pptFile?.name}
                  wordDoc={wordFile?.name}
                />
              </>
            )}
          </Grid>
        </ReplyDiv>
      </DialogContent>

      <DialogActions>
        {!editImage && (
          <div className="reply_footer">
            <div>
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
              <IconButton variant="contained" component="label">
                <DocsIcon />
                <input
                  type="file"
                  accept=".doc,.docx,.pdf,.xlsx,.xls,.ppt,.pptx"
                  hidden
                  onChange={handleDocsChange}
                />
              </IconButton>
            </div>

            <div>
              {loading ? (
                <>
                  <CircularProgress
                    style={{ color: "#66B984", width: 40, height: 40 }}
                  />
                </>
              ) : (
                <>
                  <PostBtn onClick={handleReply}>{allWords.th.post}</PostBtn>
                </>
              )}
            </div>
          </div>
        )}

        {editImage && (
          <div
            style={{
              display: "flex",
              width: "100%",
              margin: "auto",
              justifyContent: "center",
              gap: "2rem",
              alignItems: "center",
            }}
          >
            <Button
              primary
              variant="outlined"
              onClick={() => {
                setEditImage(false);
              }}
              size="large"
              style={{
                backgroundColor: "transparent",
                color: "#66b984",
                border: "2px solid #66b984",
                borderRadius: "5px",
                width: "200px",
                height: "50px",
              }}
            >
              {allWords.misc.cancel}
            </Button>
            <Button
              size="large"
              variant="contained"
              onClick={handleCrop}
              style={{
                backgroundColor: "black",
                color: "white",
                border: "none",
                borderRadius: "5px",
                width: "200px",
                height: "50px",
              }}
            >
              {allWords.misc.save}
            </Button>
          </div>
        )}
      </DialogActions>
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
        title={"To Reply to a Post , Login or sign up to Khul Ke"}
        description={""}
      />
    </Dialog>
  );
};

export default Reply;
