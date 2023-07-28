import React, { useEffect, useState } from "react";
import { Grid, IconButton } from "@mui/material";
import { MainDiv, Avatar, Input, IconContainer, AddPostBtn } from "./style";
import CircularProgress from "@mui/material/CircularProgress";
import AudioIcon from "../../IconsComponents/AudioIcon";
import DocsIcon from "../../IconsComponents/DocsIcon";
import PhotoIcon from "../../IconsComponents/PhotoIcon";
import VideoIcon from "../../IconsComponents/VideoIcon";

import ImageContainer from "./ImageContainer";
import VideoContainer from "./VideoContainer";
import AudioContainer from "./AudioContainer";
import DocsContainer from "./DocsContainer";

import EditAudio from "./EditAudio";
import EditVideo from "./EditVideo";
import EditImage from "./EditImage";
import { allWords } from "../../../App";
import { useDispatch, useSelector } from "react-redux";

import { addPostData } from "../../../redux/actions/postAction";
import ToastHandler from "../../../utils/ToastHandler";

const AddPostDialog = ({ setAddPost, setDialogTitle }) => {
  const [editAudio, setEditAudio] = useState(false);
  const [editVideo, setEditVideo] = useState(false);
  const [editImage, setEditImage] = useState(false);
  const textLength = 300;
  const [textCount, setTextCount] = useState(0);
  const [imgArray, setImgArray] = useState([]);
  const [indexValue, setIndexValue] = useState(null);
  const [imageSrc, setImageSrc] = useState({
    index: null,
    url: null,
    file: null,
  });
  const [videoFilePath, setVideoFilePath] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [docsFilePath, setDocsFilePath] = useState(null);
  const [docsFile, setDocsFile] = useState(null);
  const [audioFilePath, setAduioFilePath] = useState(null);
  const [audioFile, setAduioFile] = useState(null);

  const [textInput, setTextInput] = useState("");
  const [value, setValue] = useState(0);

  const [imgUpload, setImgUpload] = useState([]);
  const dispatch = useDispatch();

  const allPostData = useSelector((state) => state.post.posts);
  const post_res = useSelector((state) => state.post.post_res);
  const addPostLoading = useSelector((state) => state.post.loading);

  const handleVideoChange = (e) => {
    setAduioFilePath(null);
    setDocsFilePath(null);
    setImgArray([]);
    if (e.target.files) {
      setVideoFile(e.target.files[0]);
      setVideoFilePath(URL.createObjectURL(e.target.files[0]));
    }

    setEditImage(false);
    setEditVideo(false);
    setEditAudio(false);
  };

  const handleImageChange = (e) => {
    setVideoFilePath(null);
    setDocsFilePath(null);
    setAduioFilePath(null);

    const imageFile = e.target.files[0];
    const images = e.target.files;
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
  };

  const handleDocsChange = (e) => {
    setImgArray([]);
    setAduioFilePath(null);
    setVideoFilePath(null);
    if (e.target.files[0]) {
      setDocsFile(e.target.files[0]);
      setDocsFilePath(URL.createObjectURL(e.target.files[0]));
    }

    setEditImage(false);
    setEditVideo(false);
    setEditAudio(false);
  };

  const handleAudioChange = (e) => {
    setImgArray([]);
    setDocsFilePath(null);
    setVideoFilePath(null);
    if (e.target.files) {
      setAduioFile(e.target.files[0]);
      setAduioFilePath(URL.createObjectURL(e.target.files[0]));
    }

    setEditImage(false);
    setEditVideo(false);
    setEditAudio(false);
  };

  const handleInputChange = (e) => {
    setTextInput(e.target.value);
    setValue(value + 1);
    setTextCount(e.target.value.length);
  };

  const handlePostSubmit = async () => {
    const formData = new FormData();
    let str = textInput.replace(/"/g, '\\"');
    if (textInput) {
      if (textInput.includes('"')) {
        formData.append("message", `{"type":"TEXT","text":"${str}"}`);
      } else {
        formData.append("message", `{"type":"TEXT","text":"${textInput}"}`);
      }
    } else if (imgUpload.length > 0 || textInput) {
      if (textInput.includes('"')) {
        formData.append(
          "message",
          `{"type":"POST","media_type":"IMAGE","text":"${str}","caption":[""],"tags":[""],"file_type":["IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
        );
      } else {
        formData.append(
          "message",
          `{"type":"POST","media_type":"IMAGE","text":"${textInput}","caption":[""],"tags":[""],"file_type":["IMAGE"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"],"usernames":"[]"}`
        );
      }

      formData.append("image", imgUpload[0].file);
    } else if (videoFilePath || textInput) {
      if (textInput.includes('"')) {
        formData.append(
          "message",
          `{"type":"POST","media_type":"VIDEO","text":"${str}","caption":[""],"tags":[""],"file_type":["VIDEO"],"start_duration":["0"],"end_duration":["13"],"duration":["13"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"]}`
        );
      } else {
        formData.append(
          "message",
          `{"type":"POST","media_type":"VIDEO","text":"${textInput}","caption":[""],"tags":[""],"file_type":["VIDEO"],"start_duration":["0"],"end_duration":["13"],"duration":["13"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"]}`
        );
      }

      formData.append("video", videoFile);
    } else if (docsFilePath || textInput) {
      if (textInput.includes('"')) {
        formData.append(
          "message",
          `{"type":"POST","media_type":"PDF","text":"${str}","caption":[""],"tags":[""],"file_type":["PDF"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
        );
      } else {
        formData.append(
          "message",
          `{"type":"POST","media_type":"PDF","text":"${textInput}","caption":[""],"tags":[""],"file_type":["PDF"],"start_duration":[null],"end_duration":[null],"duration":[null],"trim":[null],"is_snap":["false"],"is_recorded":["false"]}`
        );
      }

      formData.append("doc", docsFile);
    } else if (audioFilePath || textInput) {
      if (textInput.includes('"')) {
        formData.append(
          "message",
          `{"type":"POST","media_type":"AUDIO","text":"${str}","caption":[""],"tags":[""],"file_type":["AUDIO"],"start_duration":["0"],"end_duration":["9"],"duration":["9"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"]}`
        );
      } else {
        formData.append(
          "message",
          `{"type":"POST","media_type":"AUDIO","text":"${textInput}","caption":[""],"tags":[""],"file_type":["AUDIO"],"start_duration":["0"],"end_duration":["9"],"duration":["9"],"trim":["true"],"is_snap":["false"],"is_recorded":["false"]}`
        );
      }

      formData.append("audio", audioFile);
    }

    dispatch(addPostData(formData));
  };

  useEffect(() => {
    setDialogTitle(allWords.misc.addPoste);
    if (post_res) {
      setAddPost(false);
      allPostData?.data?.old_post?.filter((val) => {
        if (val?.post_id === post_res[0]?.post_id) {
          setAddPost(true);
        }
      });
    }
  }, [post_res]);

  const initial = JSON.parse(localStorage.getItem("current_user"))[
    "username"
  ][0].toUpperCase();
  const dp = `https://via.placeholder.com/300x300/66B984/FFFFFF?text=${initial}`;

  return (
    <>
      <MainDiv>
        {editImage || editVideo || editAudio ? (
          <>
            {editImage && (
              <EditImage
                indexValue={indexValue}
                imgArray={imgArray}
                setImgArray={setImgArray}
                imageSrc={imageSrc}
                setImageSrc={setImageSrc}
                setEditImage={setEditImage}
                setDialogTitle={setDialogTitle}
              />
            )}
            {editVideo && (
              <EditVideo
                setEditVideo={setEditVideo}
                setDialogTitle={setDialogTitle}
              />
            )}
            {editAudio && (
              <EditAudio
                setEditAudio={setEditAudio}
                setDialogTitle={setDialogTitle}
              />
            )}
          </>
        ) : (
          <>
            <div className="input_container">
              <Avatar src={dp} />
              <Input
                placeholder="Write something."
                onChange={handleInputChange}
                maxLength={300}
              />
              <p style={{ margin: 0, opacity: "0.6" }}>
                {textLength - textCount}/{300}
              </p>
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
                        <Grid item md={6} key={index}>
                          <ImageContainer
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
                <>
                  <DocsContainer docsFilePath={docsFilePath} />
                </>
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
            </Grid>

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
                  <input type="file" hidden onChange={handleDocsChange} />
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

              {addPostLoading ? (
                <>
                  <CircularProgress
                    style={{ color: "#66B984", width: 40, height: 40 }}
                  />
                </>
              ) : (
                <>
                  <AddPostBtn onClick={handlePostSubmit}>{allWords.th.post}</AddPostBtn>
                </>
              )}
            </IconContainer>
          </>
        )}
      </MainDiv>
    </>
  );
};

export default AddPostDialog;
