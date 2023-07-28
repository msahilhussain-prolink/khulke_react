import { CancelOutlined } from "@material-ui/icons";
import { Button, Grid, IconButton } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { allWords } from "../../App";
import { POST_API_BASE_URL } from "../../constants/env";
import logger from "../../logger";
import { addReplyPost, getPostData } from "../../redux/actions/postAction";
import ToastHandler from "../../utils/ToastHandler";
import AudioIcon from "../IconsComponents/AudioIcon";
import CommentIcon from "../IconsComponents/CommentIcon";
import DocsIcon from "../IconsComponents/DocsIcon";
import PhotoIcon from "../IconsComponents/PhotoIcon";
import VideoIcon from "../IconsComponents/VideoIcon";
import Post from "../Post";
import AudioContainer from "../Post/AddPostDialog/AudioContainer";
import DocsContainer from "../Post/AddPostDialog/DocsContainer";
import EditImage from "../Post/AddPostDialog/EditImage";
import ImageContainer from "../Post/AddPostDialog/ImageContainer";
import VideoContainer from "../Post/AddPostDialog/VideoContainer";
import UserListInput from "../UserListInput/userListInput";
import UserProfile from "../UserProfile";
import { PostBtn, ReplyDiv } from "./style";
import "./style.css";

const Reply = ({
  circulate_user,
  post_id,
  title,
  imgData,
  username,
  postReply,
  setPostReply,
  videoFile,
  docsFile,
  audioFile,
  loading,
  name,
  formatted_created_at,
  likeCount,
  like_self,
  dislike_self,
  post_circulated_count,
  totalComment,
  setLike,
  setLikeCount,
  post_media,
  pdf,
  ppt,
  excel,
  doc,
  user_id,
  parentType,
  GetAllPostDataProfile,
  src,
  setUserAction,
}) => {
  const replyData = useSelector((state) => state.post.replyData);

  const dispatch = useDispatch();
  const inputRef = useRef();
  const [textInput, setTextInput] = useState("");
  const [textCount, setTextCount] = useState(0);
  const [xlFile, setXlFile] = useState(null);
  const [wordFile, setWordFile] = useState(null);
  const [pptFile, setPptFile] = useState(null);
  const [editImage, setEditImage] = useState(false);
  const [imgArray, setImgArray] = useState([]);
  const [imgUpload, setImgUpload] = useState([]);
  const [videoDuration, setVideoDuration] = useState(null);
  const [startVideoTime, setStartVideoTime] = useState(0);
  const [endVideoTime, setEndVideoTime] = useState(0);
  const [imageSrc, setImageSrc] = useState({
    index: null,
    url: null,
    file: null,
  });
  const editImageRef = useRef();
  const [videoFilePath, setVideoFilePath] = useState(null);
  const [quoteVideoFile, setQuoteVideoFile] = useState(null);
  const [docsFilePath, setDocsFilePath] = useState(null);
  const [quoteDocsFile, setQuoteDocsFile] = useState(null);
  const [audioFilePath, setAduioFilePath] = useState(null);
  const [replyAudioFile, setQuoteAduioFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [imageCaption1, setImageCaption1] = useState("");
  const [imageCaption2, setImageCaption2] = useState("");
  const [imageCaption3, setImageCaption3] = useState("");
  const [imageCaption4, setImageCaption4] = useState("");
  const [audioDuration, setAudioDuration] = useState(0);
  const [startAudioTime, setStartAudioTime] = useState(0);
  const [endAudioTime, setEndAudioTime] = useState(0);
  const [replyFlg, setReplyFlg] = useState(false);
  const allPostData = useSelector((state) => state.post.posts);

  let current_user = "";
  try {
    current_user = JSON.parse(
      localStorage.current_user || localStorage.anonymous_user
    );
  } catch (err) {}

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

    if (!videoFile) {
      ToastHandler("warn", "Please select video.");
      return false;
    }
    if (!videoFile.name.match(/\.(mp4|MP4)$/)) {
      ToastHandler("warn", allWords.misc.toastMsg.invalidVideoFormat);
      return false;
    }

    if (videoFile) {
      let size = e.target.files[0].size;
      if (Math.round(size / 1024) > 256000) {
        ToastHandler("warn", "Upload a video file less than 250 MB.");
        return false;
      }
    }
    setAduioFilePath(null);
    setDocsFilePath(null);
    setImgArray([]);
    if (e.target.files) {
      setQuoteVideoFile(e.target.files[0]);
      setVideoFilePath(URL.createObjectURL(e.target.files[0]));
    }

    setEditImage(false);
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
          e.target.value = null;
          return false;
        }
      }
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
      }
    } else {
      ToastHandler("warn", allWords.misc.toastMsg.only4ImageAllowed);
    }
  };

  const handleDocsChange = (e) => {
    setVideoFilePath(null);
    setAduioFilePath(null);
    setImgArray([]);
    const docfile = e.target.files[0];
    let filePath = docfile?.name;

    // Allowing file type
    let allowedExtensions = /(\.pdf|\.xls|\.xlsx|\.doc|\.docx|\.ppt|\.pptx)$/i;
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
  };

  const handleReply = () => {
    setLike(false);
    setLikeCount(0);
    let formData = new FormData();

    let str = textInput.replace(/"/g, '\\"');

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
        formData.append(
          "message",
          `{"type":"COMMENT","post_id":"${post_id}","text":"${str}","parent_type":"POST","usernames":"[]"}`
        );
      } else {
        formData.append(
          "message",
          `{"type":"COMMENT","post_id":"${post_id}","text":"${textInput}","parent_type":"POST","usernames":"[]"}`
        );
      }
    } else if ((imgArray.length > 0 && textInput) || imgArray.length > 0) {
      if (imgArray.length === 1) {
        if (textInput.includes('"')) {
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"IMAGE","text":"${str}","caption":["${imageCaption1}"],"tags":[""],"file_type":["IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST","usernames":"[]"}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"IMAGE","text":"${textInput}","caption":["${imageCaption1}"],"tags":[""],"file_type":["IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST","usernames":"[]"}`
          );
        }

        formData.append("image", imgArray[0].file);
      }
      if (imgArray.length === 2) {
        if (textInput.includes('"')) {
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"IMAGE","text":"${str}","caption":["${imageCaption1}","${imageCaption2}"],"tags":[""],"file_type":["IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST","usernames":"[]"}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"IMAGE","text":"${textInput}","caption":["${imageCaption1}","${imageCaption2}"],"tags":[""],"file_type":["IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST","usernames":"[]"}`
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
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"IMAGE","text":"${str}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST","usernames":"[]"}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"IMAGE","text":"${textInput}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST","usernames":"[]"}`
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
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"IMAGE","text":"${str}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}","${imageCaption4}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST","usernames":"[]"}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"IMAGE","text":"${textInput}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}","${imageCaption4}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST","usernames":"[]"}`
          );
        }

        for (let i in imgArray) {
          formData.append("image", imgArray[i].file);
        }
      }
    } else if ((audioFilePath && textInput) || audioFilePath) {
      if (replyAudioFile.size / 10 ** 6 > 250) {
        return ToastHandler(
          "warn",
          "Upload a audio file less than 250 MB with maximum duration as 2min 30sec."
        );
      }
      if (audioDuration > 150) {
        return ToastHandler(
          "warn",
          allWords.misc.toastMsg.audioLengthValidation
        );
      }

      if (textInput.includes('"')) {
        formData.append(
          "message",
          `{"type":"COMMENT","post_id":"${post_id}","media_type":"AUDIO","text":"${str}","caption":[""],"tags":[""],"file_type":["AUDIO"],"start_duration":["${startAudioTime}"],"end_duration":["${endAudioTime}"],"duration":["${audioDuration}"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST"}`
        );
      } else {
        formData.append(
          "message",
          `{"type":"COMMENT","post_id":"${post_id}","media_type":"AUDIO","text":"${textInput}","caption":[""],"tags":[""],"file_type":["AUDIO"],"start_duration":["${startAudioTime}"],"end_duration":["${endAudioTime}"],"duration":["${audioDuration}"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST"}`
        );
      }

      formData.append("audio", replyAudioFile);
    } else if ((videoFilePath && textInput) || videoFilePath) {
      if (videoDuration > 150) {
        return ToastHandler(
          "warn",
          "Max. duration for Video should be 2min 30sec only."
        );
      }

      if (textInput.includes('"')) {
        formData.append(
          "message",
          `{"type":"COMMENT","post_id":"${post_id}","media_type":"VIDEO","text":"${str}","caption":[""],"tags":[""],"file_type":["VIDEO"],"start_duration":["${startVideoTime}"],"end_duration":["${endVideoTime}"],"duration":["${videoDuration}"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST"}`
        );
      } else if (parentType === "SNIPPET" && textInput.includes('"')) {
        formData.append(
          "message",
          `{"type":"COMMENT","post_id":"${post_id}","media_type":"VIDEO","text":"${textInput}","caption":[""],"tags":[""],"file_type":["VIDEO"],"start_duration":["${startVideoTime}"],"end_duration":["${endVideoTime}"],"duration":["${videoDuration}"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"],"parent_type":"SNIPPET"}`
        );
        formData.append("video", quoteVideoFile);
      } else {
        formData.append(
          "message",
          `{"type":"COMMENT","post_id":"${post_id}","media_type":"VIDEO","text":"${textInput}","caption":[""],"tags":[""],"file_type":["VIDEO"],"start_duration":["${startVideoTime}"],"end_duration":["${endVideoTime}"],"duration":["${videoDuration}"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST"}`
        );
      }

      formData.append("video", quoteVideoFile);
    } else if ((docsFilePath && textInput) || docsFilePath) {
      if (xlFile) {
        if (textInput.includes('"')) {
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"XLS","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["XLS"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST","usernames":"[]"}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"XLS","text":"${textInput}","caption":["${caption}"],"tags":[""],"file_type":["XLS"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST","usernames":"[]"}`
          );
        }

        formData.append("doc", xlFile);
      } else if (quoteDocsFile) {
        if (textInput.includes('"')) {
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"PDF","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["PDF"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST","usernames":"[]"}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"PDF","text":"${textInput}","caption":["${caption}"],"tags":[""],"file_type":["PDF"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST","usernames":"[]"}`
          );
        }

        formData.append("doc", quoteDocsFile);
      } else if (wordFile) {
        if (textInput.includes('"')) {
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"DOC","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["DOC"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST","usernames":"[]"}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"COMMENT","post_id":"${post_id}","media_type":"DOC","text":"${textInput}","caption":["${caption}"],"tags":[""],"file_type":["DOC"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST","usernames":"[]"}`
          );
        }

        formData.append("doc", wordFile);
      }
    }

    dispatch(
      addReplyPost(formData, parentType, (err) => {
        if (err) {
          return logger.error(err);
        }
        ToastHandler("sus", "Your post has been created");
      })
    );
    setPostReply(false);
    setReplyFlg(true);
    setUserAction((prev) => !prev);
  };

  const handleCrop = () => {
    editImageRef.current?.setCroppedImage();
    setEditImage(false);
  };

  const handleInputChange = (e) => {
    let urlRegex = /(((https?:\/\/)|(www\.))[^/\W*/]+)/g;
    if (e.target.value.match(urlRegex)) {
      let newArr = e.target.value.split(" ");
      newArr.filter((item, index) => {
        if (
          newArr.length === 1
            ? urlRegex.test(item)
            : urlRegex.test(newArr[index + 1])
        ) {
          if (e.key === "Backspace") {
            setTextCount(textCount - 4);
          } else {
            setTextCount(textCount + 4);
          }
        } else {
          if (e.key === "Backspace") {
            setTextCount(textCount - 1);
          } else {
            setTextCount(textCount + 1);
          }
        }
      });
    } else {
      let val = e.target.value;

      if (val.length > 300) {
        val = val.slice(0, 300);
        setTextInput(val);
        setTextCount(val.length);
      } else {
        setTextInput(val);
        setTextCount(val.length);
      }
    }
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

  const getSinglePost = async () => {
    let data = new FormData();
    data.append("type", "COMMENT");

    const config = {
      method: "post",
      url: `${POST_API_BASE_URL}/post/${post_id}`,
      headers: {
        "device-type": "android",
        "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
      },
      data: data,
    };

    axios(config).then().catch();
  };

  useEffect(() => {
    if (replyFlg) {
      if (replyData && replyData?.code === 200) {
        setReplyFlg(false);
        if (window.location.pathname.includes("/profile")) {
          GetAllPostDataProfile(true);
        } else {
          dispatch(getPostData(20));
        }
        getSinglePost();
        allPostData?.data?.old_post?.filter((val) => {
          if (val?.post_id === replyData?.data?.post[0].post_id) {
            setPostReply(true);
          }
        });
      }
    }
  }, [replyData]);

  //   console.log("test123456", audioFile,
  // pdf,
  // ppt,
  // doc,
  // docsFile,
  // excel,
  // imgData,
  // videoFile,
  // formatted_created_at,
  // src
  // )

  return (
    <Dialog
      open={postReply}
      // onClose={() => setPostReply(false)}
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
          <p style={{ fontWeight: "bold" }}>{allWords.misc.repply}</p>
          <div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.1, opacity: 0.8 }}
            >
              <IconButton
                onClick={() => {
                  setPostReply(false);
                }}
                style={{ width: 50, height: 50 }}
              >
                <CancelOutlined />
              </IconButton>
            </motion.div>
          </div>
        </div>
      </DialogTitle>
      <DialogContent style={{ padding: "20px 10px" }}>
        <ReplyDiv style={{ paddingLeft: "0" }} className="custom_left_space">
          <div className="reply_header">
            <div>
              <CommentIcon style={{ marginRight: "0.2rem", maxLength: 16 }} />
              <p>{allWords.misc.livert.reply}</p>
              <Link
                to={`/profile/${username}/posts`}
                style={{ textDecoration: "none", marginLeft: "0.2rem" }}
              >
                @{username}
              </Link>
            </div>
            <hr />
          </div>
          <div className="reply_body">
            {/* {title && !videoFile && !audioFile && !docsFile && !imgData && ( */}
            <Post
              post_media={post_media}
              post_id={post_id}
              hideIconContainer
              circulate_user={circulate_user}
              username={username}
              name={name}
              title={title}
              videoFile={videoFile ? videoFile : ""}
              audioFile={audioFile ? audioFile : ""}
              docsFile={docsFile ? docsFile : ""}
              imgData={imgData ? imgData : []}
              pdf={pdf ? pdf : ""}
              ppt={ppt ? ppt : ""}
              excel={excel ? excel : ""}
              doc={doc ? doc : ""}
              src={src ? src : ""}
              formatted_created_at={
                formatted_created_at ? formatted_created_at : ""
              }
              // audio={audio?audio:""}
              className={"post_card"}
              totalLike={likeCount}
              like_self={like_self}
              dislike_self={dislike_self}
              post_circulated_count={post_circulated_count}
              totalComment={totalComment}
              noShowReplyLine={true}
            />

            <div className="reply_input_container">
              <UserProfile
                username={current_user?.["username"]}
                borderRadius="8px"
              />
              <UserListInput
                className="post-area"
                name="reply post"
                refs={inputRef}
                placeholder={allWords.misc.livert.writqu}
                maxLength={300}
                value={textInput}
                onChange={(e) => {
                  let val = e.target.value;
                  setTextInput(val);
                  handleInputChange(e);

                  inputRef.current.style.height =
                    Math.min(inputRef.current.scrollHeight, 300) + "px";
                }}
                style={{ marginLeft: "0.4rem" }}
                listDirection="bottom"
              />
              {textCount >= 0 && textCount <= 300 ? 300 - textCount : 300}/{300}
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
                setAudioDuration={setAudioDuration}
                setStartAudioTime={setStartAudioTime}
                setEndAudioTime={setEndAudioTime}
                audioFile={replyAudioFile}
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
                    setVideoDuration={setVideoDuration}
                    setStartVideoTime={setStartVideoTime}
                    setEndVideoTime={setEndVideoTime}
                    setCaption={setCaption}
                    videoFile={quoteVideoFile}
                    showCaption
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
                      {imgArray.length >= 1 && (
                        <Grid item md={12} key={item}>
                          <ImageContainer
                            imageCaption={imageCaptionPropHandler(index)}
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
        {!editImage && (
          <div className="reply_footer">
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
                  <PostBtn onClick={handleReply}>
                    {allWords.misc.repply}
                  </PostBtn>
                </>
              )}
            </div>
          </div>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default Reply;
