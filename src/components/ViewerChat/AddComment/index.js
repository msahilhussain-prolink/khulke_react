import React, { useRef, useState } from "react";
import { IconButton, Grid, Button } from "@mui/material";
import { MainContainer, AddPostBtn } from "./style";
import CircularProgress from "@mui/material/CircularProgress";
import DocsIcon from "../../IconsComponents/DocsIcon";
import PhotoIcon from "../../IconsComponents/PhotoIcon";
import { useDispatch, useSelector } from "react-redux";
import { quotePost } from "../../../redux/actions/RTuserInteractionAction";
import ImageContainer from "../AddCommentDialog/ImageContainer";
import AudioContainer from "../AddCommentDialog/AudioContainer";
import VideoContainer from "../AddCommentDialog/VideoContainer";
import DocsContainer from "../AddCommentDialog/DocsContainer";
import ViewersChat from "../index";
import EditImage from "../../Post/AddPostDialog/EditImage";
import ToastHandler from "../../../utils/ToastHandler";
import UserProfile from "../../UserProfile";
import { allWords } from "../../../App";
import logger from "../../../logger";

const AddComment = ({
  post_id,
  title,
  name,
  username,
  imgData,
  setAddComment,
  videoFile,
  docsFile,
  audioFile,
  pdf,
  setCirculate,
  formatted_created_at,
  totalComment,
  cmt_circulated_count,
  like_self,
  dislike_self,
  likeCount,
  circulate_user,
  post_media,
  ppt,
  doc,
  excel,
  type,
  polling_data,
}) => {
  // Global Style
  const quoteLoading = useSelector((state) => state.rtPost.loading);
  const circulateLoading = useSelector((state) => state.rtPost.loading);

  const [caption, setCaption] = useState("");
  const [comment, setComment] = useState("");
  const [value, setValue] = useState(0);
  const [textCount, setTextCount] = useState(0);
  const [textInput, setTextInput] = useState("");
  const [xlFile, setXlFile] = useState(null);
  const [wordFile, setWordFile] = useState(null);
  const [editImage, setEditImage] = useState(false);
  const [imgArray, setImgArray] = useState([]);
  const [imgUpload, setImgUpload] = useState([]);
  const [imageSrc, setImageSrc] = useState({
    index: null,
    url: null,
    file: null,
  });
  const [videoFilePath, setVideoFilePath] = useState(null);
  const [quoteVideoFile, setQuoteVideoFile] = useState(null);
  const [docsFilePath, setDocsFilePath] = useState(null);
  const [quoteDocsFile, setQuoteDocsFile] = useState(null);
  const [audioFilePath, setAduioFilePath] = useState(null);
  const [quoteAudioFile, setQuoteAduioFile] = useState(null);
  const [pptFile, setPptFile] = useState(null);

  // useRef
  const editImageRef = useRef();
  const inputRef = useRef();

  const dispatch = useDispatch();
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
      ToastHandler("warn", allWords.misc.toastMsg.invalidImgFormat);
      return false;
    }

    setCirculate(allWords.misc.livert.quote);
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
    let filePath = docfile.name;

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

  const handleComment = (e) => {
    const textInput = e.target.value;
    setComment(textInput);
    setCirculate(allWords.misc.livert.quote);
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

  function handleQuoteSubmit() {
    let formData = new FormData();

    let str = comment.replace(/"/g, '\\"');
    let str1 = textInput.replace(/(?:\r\n|\r|\n)/g, " <br /> ");

    if (textInput.length > 300) {
      return ToastHandler("warn", "Maximum length of 300 characters allowed.");
    }

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
      comment ||
      imgArray.length > 0 ||
      quoteAudioFile ||
      quoteVideoFile ||
      quoteDocsFile ||
      wordFile ||
      xlFile ||
      pptFile
    ) {
      if (
        comment &&
        !imgArray.length > 0 &&
        !quoteAudioFile &&
        !quoteVideoFile &&
        !quoteDocsFile &&
        !wordFile &&
        !xlFile &&
        !pptFile
      ) {
        if (comment.includes('"')) {
          formData.append(
            "message",
            `{"type":"REQUOTE","post_id":"${post_id}","text":"${str}","parent_type":"ROUNDTABLE"}`
          );
        } else if (textInput.includes("\n")) {
          formData.append(
            "message",
            `{"type":"REQUOTE","post_id":"${post_id}","text":"${str1}","parent_type":"ROUNDTABLE"}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"REQUOTE","post_id":"${post_id}","text":"${comment}","parent_type":"ROUNDTABLE"}`
          );
        }
      } else if ((imgArray.length > 0 && comment) || imgArray.length > 0) {
        if (imgArray.length === 1) {
          if (comment.includes('"')) {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"IMAGE","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
            );
          } else if (textInput.includes("\n")) {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"IMAGE","text":"${str1}","caption":["${caption}"],"tags":[""],"file_type":["IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
            );
          } else {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"IMAGE","text":"${comment}","caption":["${caption}"],"tags":[""],"file_type":["IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
            );
          }
          formData.append("img", imgArray[0].file);
        }

        if (imgArray.length === 2) {
          if (comment.includes('"')) {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"IMAGE","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
            );
          } else if (textInput.includes("\n")) {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"IMAGE","text":"${str1}","caption":["${caption}"],"tags":[""],"file_type":["IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
            );
          } else {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"IMAGE","text":"${comment}","caption":["${caption}"],"tags":[""],"file_type":["IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
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
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"IMAGE","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
            );
          } else if (textInput.includes("\n")) {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"IMAGE","text":"${str1}","caption":["${caption}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
            );
          } else {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"IMAGE","text":"${comment}","caption":["${caption}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
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
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"IMAGE","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
            );
          } else if (textInput.includes("\n")) {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"IMAGE","text":"${str1}","caption":["${caption}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
            );
          } else {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"IMAGE","text":"${comment}","caption":["${caption}"],"tags":[""],"file_type":["IMAGE","IMAGE","IMAGE","IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
            );
          }

          for (let i in imgArray) {
            formData.append("image", imgArray[i].file);
          }
        }
      } else if ((videoFilePath && comment) || videoFilePath) {
        if (comment.includes('"')) {
          formData.append(
            "message",
            `{"type":"REQUOTE","post_id":"${post_id}","media_type":"VIDEO","text":"${str}","caption":[""],"tags":[""],"file_type":["VIDEO"],"start_duration":["0"],"end_duration":["6"],"duration":["6"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
          );
        } else if (textInput.includes("\n")) {
          formData.append(
            "message",
            `{"type":"REQUOTE","post_id":"${post_id}","media_type":"VIDEO","text":"${str1}","caption":[""],"tags":[""],"file_type":["VIDEO"],"start_duration":["0"],"end_duration":["6"],"duration":["6"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"REQUOTE","post_id":"${post_id}","media_type":"VIDEO","text":"${comment}","caption":[""],"tags":[""],"file_type":["VIDEO"],"start_duration":["0"],"end_duration":["6"],"duration":["6"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
          );
        }

        formData.append("video", quoteVideoFile);
      } else if ((docsFilePath && comment) || docsFilePath) {
        if (xlFile) {
          if (textInput.includes('"')) {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"XLS","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["XLS"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
            );
          } else if (textInput.includes("\n")) {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"XLS","text":"${str1}","caption":["${caption}"],"tags":[""],"file_type":["XLS"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
            );
          } else {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"XLS","text":"${textInput}","caption":["${caption}"],"tags":[""],"file_type":["XLS"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
            );
          }

          formData.append("doc", xlFile);
        } else if (quoteDocsFile) {
          if (textInput.includes('"')) {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"PDF","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["PDF"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
            );
          } else if (textInput.includes("\n")) {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"PDF","text":"${str1}","caption":["${caption}"],"tags":[""],"file_type":["PDF"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
            );
          } else {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"PDF","text":"${textInput}","caption":["${caption}"],"tags":[""],"file_type":["PDF"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
            );
          }

          formData.append("doc", quoteDocsFile);
        } else if (wordFile) {
          if (textInput.includes('"')) {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"PPTX","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["PPTX"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
            );
          } else if (textInput.includes("\n")) {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"PPTX","text":"${str1}","caption":["${caption}"],"tags":[""],"file_type":["PPTX"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
            );
          } else {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"PPTX","text":"${textInput}","caption":["${caption}"],"tags":[""],"file_type":["PPTX"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
            );
          }

          formData.append("doc", wordFile);
        } else if (pptFile) {
          if (textInput.includes('"')) {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"PPTX","text":"${str}","caption":["${caption}"],"tags":[""],"file_type":["PPTX"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
            );
          } else if (textInput.includes("\n")) {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"PPTX","text":"${str1}","caption":["${caption}"],"tags":[""],"file_type":["PPTX"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
            );
          } else {
            formData.append(
              "message",
              `{"type":"REQUOTE","post_id":"${post_id}","media_type":"PPTX","text":"${textInput}","caption":["${caption}"],"tags":[""],"file_type":["PPTX"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
            );
          }

          formData.append("doc", pptFile);
        }
      } else if ((audioFilePath && comment) || audioFilePath) {
        if (comment.includes('"')) {
          formData.append(
            "message",
            `{"type":"REQUOTE","post_id":"${post_id}","media_type":"AUDIO","text":"${str}","caption":[""],"tags":[""],"file_type":["AUDIO"],"start_duration":["0"],"end_duration":["9"],"duration":["9"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
          );
        } else if (textInput.includes("\n")) {
          formData.append(
            "message",
            `{"type":"REQUOTE","post_id":"${post_id}","media_type":"AUDIO","text":"${str1}","caption":[""],"tags":[""],"file_type":["AUDIO"],"start_duration":["0"],"end_duration":["9"],"duration":["9"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
          );
        } else {
          formData.append(
            "message",
            `{"type":"REQUOTE","post_id":"${post_id}","media_type":"AUDIO","text":"${comment}","caption":[""],"tags":[""],"file_type":["AUDIO"],"start_duration":["0"],"end_duration":["9"],"duration":["9"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"],"parent_type":"ROUNDTABLE"}`
          );
        }

        formData.append("audio", quoteAudioFile);
      }
      dispatch(
        quotePost(formData, (err) => {
          if (err) {
            return logger.error(err);
          }
          setAddComment(false);
        })
      );
    }
  }

  return (
    <>
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
            value={textInput}
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
            maxLength={textCount === 0 ? 300 : ""}
          />
          <p>
            {textCount >= 0 && textCount <= 300 ? 300 - textCount : 300}/{300}
          </p>
        </div>
        <div className="post_container">
          {title && !videoFile && !audioFile && !docsFile && !imgData && (
            <ViewersChat
              requote_type={type}
              polling_data={polling_data}
              requote_post_id={post_id}
              hideIconContainer
              circulate_user={circulate_user}
              username={username}
              name={name}
              raw_text={title}
              className={"post_card"}
              totalLike={likeCount}
              like_self={like_self}
              dislike_self={dislike_self}
              cmt_circulated_count={cmt_circulated_count}
              totalComment={totalComment}
              formatted_created_at={formatted_created_at}
            />
          )}

          {audioFile && title ? (
            <>
              <ViewersChat
                requote_type={type}
                polling_data={polling_data}
                requote_post_id={post_id}
                hideIconContainer
                circulate_user={circulate_user}
                raw_text={title}
                username={username}
                name={name}
                audio
                audioFile={audioFile}
                className={"post_card"}
                totalLike={likeCount}
                like_self={like_self}
                dislike_self={dislike_self}
                cmt_circulated_count={cmt_circulated_count}
                totalComment={totalComment}
                formatted_created_at={formatted_created_at}
              />
            </>
          ) : (
            <>
              {audioFile && (
                <ViewersChat
                  requote_type={type}
                  polling_data={polling_data}
                  requote_post_id={post_id}
                  hideIconContainer
                  circulate_user={circulate_user}
                  username={username}
                  name={name}
                  audio
                  audioFile={audioFile}
                  className={"post_card"}
                  totalLike={likeCount}
                  like_self={like_self}
                  dislike_self={dislike_self}
                  cmt_circulated_count={cmt_circulated_count}
                  totalComment={totalComment}
                  formatted_created_at={formatted_created_at}
                />
              )}
            </>
          )}

          {pdf && title ? (
            <ViewersChat
              requote_type={type}
              polling_data={polling_data}
              requote_post_id={post_id}
              post_media={post_media}
              hideIconContainer
              circulate_user={circulate_user}
              title={title}
              username={username}
              name={name}
              pdf
              docsFile={docsFile}
              className={"post_card"}
              totalLike={likeCount}
              like_self={like_self}
              dislike_self={dislike_self}
              cmt_circulated_count={cmt_circulated_count}
              totalComment={totalComment}
              formatted_created_at={formatted_created_at}
            />
          ) : (
            <>
              {pdf && (
                <ViewersChat
                  requote_type={type}
                  polling_data={polling_data}
                  requote_post_id={post_id}
                  post_media={post_media}
                  hideIconContainer
                  circulate_user={circulate_user}
                  username={username}
                  name={name}
                  pdf
                  docsFile={docsFile}
                  className={"post_card"}
                  totalLike={likeCount}
                  like_self={like_self}
                  dislike_self={dislike_self}
                  cmt_circulated_count={cmt_circulated_count}
                  totalComment={totalComment}
                  formatted_created_at={formatted_created_at}
                />
              )}
            </>
          )}
          {ppt && title ? (
            <ViewersChat
              requote_type={type}
              polling_data={polling_data}
              requote_post_id={post_id}
              post_media={post_media}
              hideIconContainer
              circulate_user={circulate_user}
              title={title}
              username={username}
              name={name}
              ppt
              docsFile={docsFile}
              className={"post_card"}
              totalLike={likeCount}
              like_self={like_self}
              dislike_self={dislike_self}
              cmt_circulated_count={cmt_circulated_count}
              totalComment={totalComment}
              formatted_created_at={formatted_created_at}
            />
          ) : (
            <>
              {ppt && (
                <ViewersChat
                  requote_type={type}
                  polling_data={polling_data}
                  requote_post_id={post_id}
                  post_media={post_media}
                  hideIconContainer
                  circulate_user={circulate_user}
                  username={username}
                  name={name}
                  ppt
                  docsFile={docsFile}
                  className={"post_card"}
                  totalLike={likeCount}
                  like_self={like_self}
                  dislike_self={dislike_self}
                  cmt_circulated_count={cmt_circulated_count}
                  totalComment={totalComment}
                  formatted_created_at={formatted_created_at}
                />
              )}
            </>
          )}
          {doc && title ? (
            <ViewersChat
              requote_type={type}
              polling_data={polling_data}
              requote_post_id={post_id}
              post_media={post_media}
              hideIconContainer
              circulate_user={circulate_user}
              title={title}
              username={username}
              name={name}
              doc
              docsFile={docsFile}
              className={"post_card"}
              totalLike={likeCount}
              like_self={like_self}
              dislike_self={dislike_self}
              cmt_circulated_count={cmt_circulated_count}
              totalComment={totalComment}
              formatted_created_at={formatted_created_at}
            />
          ) : (
            <>
              {doc && (
                <ViewersChat
                  requote_type={type}
                  polling_data={polling_data}
                  requote_post_id={post_id}
                  post_media={post_media}
                  hideIconContainer
                  circulate_user={circulate_user}
                  username={username}
                  name={name}
                  doc
                  docsFile={docsFile}
                  className={"post_card"}
                  totalLike={likeCount}
                  like_self={like_self}
                  dislike_self={dislike_self}
                  cmt_circulated_count={cmt_circulated_count}
                  totalComment={totalComment}
                  formatted_created_at={formatted_created_at}
                />
              )}
            </>
          )}
          {excel && title ? (
            <ViewersChat
              requote_type={type}
              polling_data={polling_data}
              requote_post_id={post_id}
              post_media={post_media}
              hideIconContainer
              circulate_user={circulate_user}
              title={title}
              username={username}
              name={name}
              excel
              docsFile={docsFile}
              className={"post_card"}
              totalLike={likeCount}
              like_self={like_self}
              dislike_self={dislike_self}
              cmt_circulated_count={cmt_circulated_count}
              totalComment={totalComment}
              formatted_created_at={formatted_created_at}
            />
          ) : (
            <>
              {excel && (
                <ViewersChat
                  requote_type={type}
                  polling_data={polling_data}
                  requote_post_id={post_id}
                  post_media={post_media}
                  hideIconContainer
                  circulate_user={circulate_user}
                  username={username}
                  name={name}
                  excel
                  docsFile={docsFile}
                  className={"post_card"}
                  totalLike={likeCount}
                  like_self={like_self}
                  dislike_self={dislike_self}
                  cmt_circulated_count={cmt_circulated_count}
                  totalComment={totalComment}
                  formatted_created_at={formatted_created_at}
                />
              )}
            </>
          )}

          {videoFile && title ? (
            <>
              <ViewersChat
                requote_type={type}
                polling_data={polling_data}
                requote_post_id={post_id}
                hideIconContainer
                circulate_user={circulate_user}
                raw_text={title}
                username={username}
                name={name}
                video
                videoFile={videoFile}
                className={"post_card"}
                formatted_created_at={formatted_created_at}
                totalLike={likeCount}
                like_self={like_self}
                dislike_self={dislike_self}
                cmt_circulated_count={cmt_circulated_count}
                totalComment={totalComment}
              />
            </>
          ) : (
            <>
              {videoFile && (
                <ViewersChat
                  requote_type={type}
                  polling_data={polling_data}
                  requote_post_id={post_id}
                  hideIconContainer
                  circulate_user={circulate_user}
                  username={username}
                  name={name}
                  video
                  videoFile={videoFile}
                  className={"post_card"}
                  totalLike={likeCount}
                  like_self={like_self}
                  dislike_self={dislike_self}
                  cmt_circulated_count={cmt_circulated_count}
                  totalComment={totalComment}
                  formatted_created_at={formatted_created_at}
                />
              )}
            </>
          )}
          {imgData && title ? (
            <>
              <ViewersChat
                requote_type={type}
                polling_data={polling_data}
                requote_post_id={post_id}
                hideIconContainer
                circulate_user={circulate_user}
                raw_text={title}
                username={username}
                name={name}
                imgData={imgData}
                className={"post_card"}
                formatted_created_at={formatted_created_at}
                totalLike={likeCount}
                like_self={like_self}
                dislike_self={dislike_self}
                cmt_circulated_count={cmt_circulated_count}
                totalComment={totalComment}
              />
            </>
          ) : (
            <>
              {imgData && (
                <ViewersChat
                  requote_type={type}
                  polling_data={polling_data}
                  requote_post_id={post_id}
                  hideIconContainer
                  circulate_user={circulate_user}
                  username={username}
                  name={name}
                  imgData={imgData}
                  className={"post_card"}
                  totalLike={likeCount}
                  like_self={like_self}
                  dislike_self={dislike_self}
                  cmt_circulated_count={cmt_circulated_count}
                  totalComment={totalComment}
                  formatted_created_at={formatted_created_at}
                />
              )}
            </>
          )}
        </div>

        <Grid container spacing={2} className="main_container">
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
                      <Grid item md={12} key={item}>
                        <ImageContainer
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
                        <Grid item md={6} key={item}>
                          <ImageContainer
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
                      <Grid item md={6} key={item}>
                        <ImageContainer
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

        <div className="icon_container" style={{ marginTop: "2rem" }}>
          {!editImage && (
            <>
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
              </div>
              {quoteLoading || circulateLoading ? (
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
            </>
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
        </div>
      </MainContainer>
    </>
  );
};

export default AddComment;
