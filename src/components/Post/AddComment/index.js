import React, { useEffect, useRef, useState } from "react";
import { IconButton, Grid, Button,DialogActions ,CircularProgress,Dialog,DialogTitle,DialogContent} from "@mui/material";
import { MainContainer, AddPostBtn } from "./style";
import { motion } from "framer-motion";
import AudioIcon from "../../IconsComponents/AudioIcon";
import DocsIcon from "../../IconsComponents/DocsIcon";
import PhotoIcon from "../../IconsComponents/PhotoIcon";
import VideoIcon from "../../IconsComponents/VideoIcon";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import Post from "../index";
import { quotePost, getPostData } from "../../../redux/actions/postAction";
import ImageContainer from "../AddPostDialog/ImageContainer";
import AudioContainer from "../AddPostDialog/AudioContainer";
import VideoContainer from "../AddPostDialog/VideoContainer";
import DocsContainer from "../AddPostDialog/DocsContainer";
import EditImage from "../AddPostDialog/EditImage";
import ToastHandler from "../../../utils/ToastHandler";
import { CancelOutlined } from "@material-ui/icons";
import UserProfile from "../../UserProfile";
import { allWords } from "../../../App";

const AddComment = ({ user_id, post_id, title, name, username, imgData, addComment, setAddComment, videoFile, docsFile,
  audioFile,pdf,loading,circulateLoading,formatted_created_at,totalComment,post_circulated_count,
  like_self, dislike_self, likeCount, circulate_user, post_media, ppt, excel, doc,
  type,polling_data,GetAllPostDataProfile,src,
}) => {
  const circulateData = useSelector((state) => state.post.circulateData);
  const quoteData = useSelector((state) => state.post);

  const inputRef = useRef();
  const [state, setState] = useState(false);
  const [caption, setCaption] = useState("");
  const [comment, setComment] = useState("");
  const [value, setValue] = useState(0);
  const [textCount, setTextCount] = useState(0);
  const [textInput, setTextInput] = useState("");
  const [xlFile, setXlFile] = useState(null);
  const [wordFile, setWordFile] = useState(null);
  const [editImage, setEditImage] = useState(false);
  const [pptFile, setPptFile] = useState(null);
  const [imgArray, setImgArray] = useState([]);
  const [imageSrc, setImageSrc] = useState({
    index: null,
    url: null,
    file: null,
  });
  const editImageRef = useRef();
  const [videoDuration, setVideoDuration] = useState(null);
  const [videoFilePath, setVideoFilePath] = useState(null);
  const [quoteVideoFile, setQuoteVideoFile] = useState(null);
  const [docsFilePath, setDocsFilePath] = useState(null);
  const [quoteDocsFile, setQuoteDocsFile] = useState(null);
  const [audioFilePath, setAduioFilePath] = useState(null);
  const [quoteAudioFile, setQuoteAduioFile] = useState(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [startAudioTime, setStartAudioTime] = useState(0);
  const [endAudioTime, setEndAudioTime] = useState(0);
  const [startVideoTime, setStartVideoTime] = useState(0);
  const [endVideoTime, setEndVideoTime] = useState(0);
  const dispatch = useDispatch();
  const [imageCaption1, setImageCaption1] = useState([]);
  const [imageCaption2, setImageCaption2] = useState("");
  const [imageCaption3, setImageCaption3] = useState("");
  const [imageCaption4, setImageCaption4] = useState("");
  const allPostData = useSelector((state) => state.post.posts);
  const [cirQuoteFlg, setCirQuoteFlg] = useState(false);

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
        ToastHandler(
          "warn",
          "Upload a video file less than 250 MB with maximum duration as 2min 30sec."
        );
        setState(false);
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
          setState(false);
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
    setState(true);
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

  const handleCrop = () => {
    editImageRef.current?.setCroppedImage();
    setEditImage(false);
  };

  const handleComment = (e) => {
    const textInput = e.target.value;
    setComment(textInput);
  };

  const handleInputChange = (e) => {
    const urlRegex = /(((https?:\/\/)|(www\.))[^/\W*/]+)/g;
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
function handleQuoteSubmit() {
    let formData = new FormData();
      const str = comment.replace(/"/g, '\\"');

    if (textInput === "" &&!imgArray.length > 0 &&!docsFilePath &&!audioFilePath &&!videoFilePath &&
      !localStorage.getItem("input_text")
    ) {ToastHandler("warn", allWords.misc.entersomeval);}
    if (
      comment ||imgArray.length > 0 ||quoteAudioFile ||quoteVideoFile ||
      quoteDocsFile ||xlFile ||wordFile ||pptFile
    ) {
      if (
        comment &&
        !imgArray.length > 0 &&
        !quoteAudioFile &&
        !quoteVideoFile &&
        !quoteDocsFile &&
        !xlFile &&
        !wordFile &&
        !pptFile
      ) {
        if (comment.includes('"')) {
          formData.append(
            "message",
            `{"type":"REQUOTE","post_id":"${post_id}","text":"${str}","parent_type":"POST"}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"REQUOTE","post_id":"${post_id}","text":"${comment}","parent_type":"POST"}`
          );
        }
      } else if ((imgArray.length > 0 && comment) || imgArray.length > 0) {
        if (imgArray.length === 1) {
          if (comment.includes('"')) {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"IMAGE","text":"${str}","caption":["${imageCaption1}"],"tags":[""],"file_type":["IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST"}`
            );
          } else {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"IMAGE","text":"${comment}","caption":["${imageCaption1}"],"tags":[""],"file_type":["IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST"}`
            );
          }

          formData.append("img", imgArray[0].file);
        }

        if (imgArray.length === 2) {
          if (comment.includes('"')) {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"IMAGE","text":"${str}","caption":["${imageCaption1}","${imageCaption2}"],"tags":[""],"file_type":["IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST"}`
            );
          } else {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"IMAGE","text":"${comment}","caption":["${imageCaption1}","${imageCaption2}"],"tags":[""],"file_type":["IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST"}`
            );
          }

          for (let i in imgArray) {
            formData.append("image", imgArray[i].file);
          }
        }

        if (imgArray.length === 3) {
          if (comment.includes('"')) {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"IMAGE","text":"${str}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST"}`
            );
          } else {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"IMAGE","text":"${comment}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST"}`
            );
          }

          for (let i in imgArray) {
            formData.append("image", imgArray[i].file);
          }
        }
        if (imgArray.length === 4) {
          if (comment.includes('"')) {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"IMAGE","text":"${str}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}","${imageCaption4}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST"}`
            );
          } else {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"IMAGE","text":"${comment}","caption":["${imageCaption1}","${imageCaption2}","${imageCaption3}","${imageCaption4}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST"}`
            );
          }

          for (let i in imgArray) {
            formData.append("image", imgArray[i].file);
          }
        }
      } else if ((videoFilePath && comment) || videoFilePath) {
        if (videoDuration > 150) {
          return ToastHandler(
            "warn",
            "Max. duration for Video should be 2min 30sec only."
          );
        }

        if (comment.includes('"')) {
          const str = comment.replace(/"/g, '\\"');
          formData.append(
            "message",
            `{"type":"REQUOTE","post_id":"${post_id}","media_type":"VIDEO","text":"${str}","caption":[""],"tags":[""],"file_type":["VIDEO"],"start_duration":["${startVideoTime}"],"end_duration":["${endVideoTime}"],"duration":["${videoDuration}"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST"}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"REQUOTE","post_id":"${post_id}","media_type":"VIDEO","text":"${comment}","caption":[""],"tags":[""],"file_type":["VIDEO"],"start_duration":["${startVideoTime}"],"end_duration":["${endVideoTime}"],"duration":["${videoDuration}"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST"}`
          );
        }

        formData.append("video", quoteVideoFile);
      } else if ((docsFilePath && comment) || docsFilePath) {
        if (xlFile) {
          if (textInput.includes('"')) {
            const str = textInput.replace(/"/g, '\\"');
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"XLS","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["XLS"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"], "parent_type":"POST"}`
            );
          } else {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"XLS","text":"${textInput}","caption":["${caption}"],"tags":[""],"file_type":["XLS"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"], "parent_type":"POST"}`
            );
          }

          formData.append("doc", xlFile);
        } else if (quoteDocsFile) {
          if (textInput.includes('"')) {
            const str = textInput.replace(/"/g, '\\"');
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"PDF","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["PDF"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"], "parent_type":"POST"}`
            );
          } else {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"PDF","text":"${textInput}","caption":["${caption}"],"tags":[""],"file_type":["PDF"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"], "parent_type":"POST"}`
            );
          }

          formData.append("doc", quoteDocsFile);
        } else if (wordFile) {
          if (textInput.includes('"')) {
            const str = textInput.replace(/"/g, '\\"');
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"DOC","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["DOC"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST"}`
            );
          } else {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"DOC","text":"${textInput}","caption":["${caption}"],"tags":[""],"file_type":["DOC"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST"}`
            );
          }

          formData.append("doc", wordFile);
        } else if (pptFile) {
          if (textInput.includes('"')) {
            const str = textInput.replace(/"/g, '\\"');
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"PPTX","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["PPTX"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"], "parent_type":"POST"}`
            );
          } else {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"PPTX","text":"${textInput}","caption":["${caption}"],"tags":[""],"file_type":["PPTX"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"], "parent_type":"POST"}`
            );
          }

          formData.append("doc", pptFile);
        }
      } else if ((audioFilePath && comment) || audioFilePath) {
        if (audioFile.size / 10 ** 6 > 250) {
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

        if (comment.includes('"')) {
          formData.append(
            "message",
            `{"type":"REQUOTE","post_id":"${post_id}","media_type":"AUDIO","text":"${str}","caption":[""],"tags":[""],"file_type":["AUDIO"],"start_duration":["${startAudioTime}"],"end_duration":["${endAudioTime}"],"duration":["${audioDuration}"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST"}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"REQUOTE","post_id":"${post_id}","media_type":"AUDIO","text":"${comment}","caption":[""],"tags":[""],"file_type":["AUDIO"],"start_duration":["${startAudioTime}"],"end_duration":["${endAudioTime}"],"duration":["${audioDuration}"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"],"parent_type":"POST"}`
          );
        }

        formData.append("audio", quoteAudioFile);
      }
      dispatch(quotePost(formData, username, user_id));
      setAddComment(false);
      setCirQuoteFlg(true);
    }
  }
    useEffect(() => {
    if (cirQuoteFlg) {
      if (circulateData) {
        if (window.location.pathname.includes("/profile")) {
          GetAllPostDataProfile(true);
        } else {
          dispatch(getPostData(20));
        }
        setAddComment(false);

        allPostData?.data?.old_post?.filter((val) => {
          if (circulateData?.count_self === val?.circulate_self) {
            setAddComment(true);
          }
        });
      }

      if (quoteData) {
        if (window.location.pathname.includes("/profile")) {
          GetAllPostDataProfile(true);
        } else {
          dispatch(getPostData(20));
        }
        allPostData?.data?.old_post?.filter((val) => {
          if (val?.post_id === quoteData?.post[0]?.post_id) {
            setAddComment(true);
          }
        });
      }
    }
  }, [circulateData, quoteData]);
     console.log("title123",title ,videoFile ,audioFile,docsFile ,imgData)
  return (
    <Dialog
      open={addComment}
      onClose={() => setAddComment(false)}
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
          <p style={{ fontWeight: "bold" }}>{allWords.misc.livert.quote}</p>
          <div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.1, opacity: 0.8 }}
            >
              <IconButton
                onClick={() => {
                  setAddComment(false);
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
        <MainContainer>
          <div className="input_container">
            <UserProfile
              username={
                JSON.parse(
                  localStorage.current_user || localStorage.anonymous_user
                )?.["username"]
              }
            />
            <textarea
              className="post-area"
              ref={inputRef}
              placeholder={allWords.misc.livert.writqu}
              onChange={(e) => {
                if (textCount <= 300) {
                  setTextInput(e.target.value);
                }
                setValue(value + 1);
                  handleInputChange(e);
                handleComment(e);
                inputRef.current.style.height = "";
                inputRef.current.style.height =
                  Math.min(inputRef.current.scrollHeight, 300) + "px";
              }}
              maxLength={300}
            />
            <p>
              {textCount >= 0 && textCount <= 300 ? 300 - textCount : 300}/{300}
            </p>
          </div>
          <div className="post_container">
            {/* {title && !videoFile && !audioFile && !docsFile && !imgData && ( */}
              <Post
                hideIconContainer
                requote_type={type}
                polling_data={polling_data}
                requote_post_id={post_id}
                circulate_user={circulate_user}
                username={username}
                name={name}
                title={title?title:""}

                audioFile={audioFile?audioFile:""}
                pdf={pdf?pdf:""}
                ppt={ppt?ppt:""}
                doc={doc?doc:""}
                docsFile={docsFile?docsFile:""}
                excel={excel?excel:""}
                imgData={imgData?imgData:[]}
                videoFile={videoFile?videoFile:""}
                // video={video?video:""}
                formatted_created_at={formatted_created_at?formatted_created_at:""}
                // audio={audio?audio:""}
                src={src?src:""}

                className={"post_card"}
                totalLike={likeCount}
                like_self={like_self}
                dislike_self={dislike_self}
                post_circulated_count={post_circulated_count}
                totalComment={totalComment}
                post_media={post_media}
              />
          </div>
            <Grid
            container
            spacing={2}
            className="main_container"
            style={{ marginTop: "1rem" }}
          >
            {audioFilePath && (
              <AudioContainer
                user
                audioFilePath={audioFilePath}
                setAduioFilePath={setAduioFilePath}
                setAudioDuration={setAudioDuration}
                setStartAudioTime={setStartAudioTime}
                setEndAudioTime={setEndAudioTime}
                audioFile={quoteAudioFile}
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
                    videoFile={quoteVideoFile}
                  />
                </Grid>
              </>
            )}
           {imgArray && !editImage && (
              <>
                {imgArray.map((item, index) => {
                  return (
                    <>
                      {imgArray.length >= 1 && (
                        <Grid item md={12} key={item}>
                          <ImageContainer
                            imageCaption={imageCaptionPropHandler(index)}
                            onCaptionChange={(e) => onCaptionChange(e, index)}
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
          </Grid>
        </MainContainer>
      </DialogContent>
        <DialogActions>
        {editImage && (
          <div
            style={{ display: "flex", width: "100%", margin: "auto", justifyContent: "center", gap: "2rem", alignItems: "center",}}
          >
            <Button
              primary
              variant="outlined"
              onClick={() => {
                setEditImage(false);
              }}
              size="large"
              style={{
                backgroundColor: "transparent", color: "#66b984", border: "2px solid #66b984",
                borderRadius: "5px", width: "200px", height: "50px",
              }}
            >
              {allWords.misc.cancel}
            </Button>
            <Button
              size="large"
              variant="contained"
              onClick={handleCrop}
              style={{  backgroundColor: "black",color: "white",border: "none",
                borderRadius: "5px",width: "200px",height: "50px",
              }}
            >
              {allWords.misc.save}
            </Button>
          </div>
        )}
        {!editImage && (
          <div
            className="post_quote_icon_container"
            style={{ marginTop: "2rem" }}
          >
            <div>
              {/* videos */}
              <IconButton variant="contained" component="label">
                <VideoIcon />
                <input type="file" accept="video/*" hidden
                  onChange={handleVideoChange}
                />
              </IconButton>
              {/* images */}
              <IconButton variant="contained" component="label">
                <PhotoIcon />
                <input type="file" accept="image/*" multiple
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
             {loading || circulateLoading ? (
              <>
                <CircularProgress
                  style={{ color: "#66B984", width: 40, height: 40 }}
                />
              </>
            ) : (
              <>
                <AddPostBtn onClick={handleQuoteSubmit}>
                  {allWords.th.post}
                </AddPostBtn>
              </>
            )}
          </div>
        )}
      </DialogActions>
    </Dialog>
  );
};
export default AddComment;
