import {
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  TextareaAutosize,
  Typography,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useRef, useState } from "react";
import AudioIcon from "../../IconsComponents/AudioIcon";
import DocsIcon from "../../IconsComponents/DocsIcon";
import PhotoIcon from "../../IconsComponents/PhotoIcon";
import VideoIcon from "../../IconsComponents/VideoIcon";
import RaiseHandImageContainer from "./MultiMediaContainers/RaiseHandImageContainer";
import RaiseHandVideoContainer from "./MultiMediaContainers/RaiseHandVideoContainer";
import RaiseHandAudioContainer from "./MultiMediaContainers/RaiseHandAudioContainer";
import RaiseHandDocumentContainer from "./MultiMediaContainers/RaiseHandDocumentContainer";
import { rt_id, uid } from "../../../pages/AgoraSandbox/settings";
import { sendTextOnlyMessage } from "./ApiCalls/Audience/ControlMessage";
import { ToggleHandSelf } from "./ApiCalls/Audience/ControlHand";
import ToastHandler from "../../../utils/ToastHandler";
import UserProfile from "../../UserProfile";
import { LensTwoTone } from "@material-ui/icons";

export default function MediaPost(props) {
  const {
    setMediaPost,
    setMessageData,
    raisedHand,
    setRaisedHand,
    rtm_channel,
  } = props;

  //useStates here
  const [textLength, setTextLength] = useState(0);
  const [img, setImg] = useState([]);
  const [doc, setDoc] = useState();
  const [video, setvideo] = useState();
  const [audio, setAudio] = useState();

  const [loading, setLoading] = useState(false);

  const [editing, setEditing] = useState(false);

  //all input refs here

  const docsInputRef = useRef();
  const videoInputRef = useRef();
  const imageInputRef = useRef();
  const audioInputRef = useRef();

  //Input handler here

  const handleAudioChange = (e) => {
    let audioFile = e.target.files[0];

    if (!audioFile) return;

    if (!audioFile.name.match(/\.(mp3)$/)) {
      ToastHandler(
        "warn",
        "Invalid audio file format. Please upload mp3 file."
      );
      return false;
    }

    setAudio({
      url: URL.createObjectURL(audioFile),
      file: audioFile,
      start: "",
      end: "",
      duration: "",
    });

    resetOtherInputs("audio");
  };

  const handleVideoChange = (e) => {
    let videoFile = e.target.files[0];

    if (!videoFile) return;

    let size = videoFile.size;
    if (Math.round(size / 1024) > 256000) {
      ToastHandler("warn", "Upload a video file less than 250 MB.");
      return false;
    }

    if (!videoFile.name.match(/\.(mp4|MP4)$/)) {
      ToastHandler(
        "warn",
        allWords.misc.toastMsg.invalidVideoFormat
      );
      return false;
    }

    setvideo({
      url: URL.createObjectURL(videoFile),
      file: videoFile,
      start: "",
      end: "",
      duration: "",
    });

    resetOtherInputs("video");
  };

  const handleDocsChange = (e) => {
    let docFile = e.target.files[0];

    if (!docFile) return;

    const filePath = docFile.name;
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

    if (docFile) {
      let size = docFile.size;

      if (Math.round(size / 1024) > 1024 * 15) {
        ToastHandler("warn", "Upload a file less than 15 MB.");
        return false;
      }
    }

    const temp = {
      file: docFile,
      url: URL.createObjectURL(docFile),
      name: filePath,
    };

    if (docFile.name.match(/(\.pdf|\.PDF)$/i)) {
      setDoc({
        type: "pdf",
        ...temp,
      });
    } else if (docFile.name.match(/(\.xls|\.xlsx|\.XLS|\.XLSX)$/i)) {
      setDoc({
        type: "xls",
        ...temp,
      });
    } else if (docFile.name.match(/(\.doc|\.docx|\.DOC|\.DOCX)$/i)) {
      setDoc({
        type: "doc",
        ...temp,
      });
    } else if (docFile.name.match(/(\.ppt|\.pptx|\.PPT|\.PPTX)$/i)) {
      setDoc({
        type: "ppt",
        ...temp,
      });
    }

    resetOtherInputs("docs");
  };
  const handleImageChange = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const imageFile = e.target.files[i];
      if (!imageFile.name.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/)) {
        ToastHandler(
          "warn",
          allWords.misc.toastMsg.invalidImgFormat
        );
        return false;
      }
    }

    const temp = [];

    for (let i = 0; i < e.target.files.length; i++) {
      const imageFile = e.target.files[i];
      const url = URL.createObjectURL(imageFile);
      temp.push({ url, file: imageFile, caption: "" });
    }

    resetOtherInputs("image");

    setImg(temp);
  };

  //state handlers here

  const resetOtherInputs = (val) => {
    switch (val) {
      case "video":
        setImg([]);
        setDoc();
        setAudio();
        imageInputRef.current.value = "";
        docsInputRef.current.value = "";
        audioInputRef.current.value = "";
        break;
      case "image":
        setDoc();
        setAudio();
        setvideo();
        docsInputRef.current.value = "";
        audioInputRef.current.value = "";
        videoInputRef.current.value = "";
        break;
      case "audio":
        setImg([]);
        setDoc();
        setvideo();
        imageInputRef.current.value = "";
        docsInputRef.current.value = "";
        videoInputRef.current.value = "";
        break;
      case "docs":
        setAudio();
        setImg([]);
        setvideo();
        audioInputRef.current.value = "";
        imageInputRef.current.value = "";
        videoInputRef.current.value = "";
        break;
      default:
        break;
    }
  };

  //handle form submit here

  const raiseHand = async () => {
    let response = await ToggleHandSelf();

    if (response) setRaisedHand(!raisedHand);

    rtm_channel?.sendMessage({ text: "wildcard_raise_hand" });

    return response;
  };

  const submitMultiMediaMessage = async (e) => {
    e.preventDefault();
    if (
      !e.target.text.value &&
      !img[0]?.file &&
      !doc?.file &&
      !audio?.file &&
      !video?.file
      ) {
      return ToastHandler("warn", "Can not send empty message.");
    }

    setLoading(true);
    const file = img[0]?.file || doc?.file || audio?.file || video?.file;
    const file_type =
      (img[0]?.file && "img") ||
      (doc?.file && "doc") ||
      (audio?.file && "doc") ||
      (video?.file && "doc");

    const data = {
      roundtable_id: rt_id,
      message: e.target.text.value,
      panel: "audience",
      chat_type: "wildcardchat",
      file_type,
    };

    let raise = "";

    if (!raisedHand) {
      raise = await raiseHand();
    }

    if (!raise && !raisedHand) return;

    let response = await sendTextOnlyMessage(data, file);

    if (!response) return;

    rtm_channel?.sendMessage({
      text: "wildcard_msg_sent||" + uid,
    });

    setMessageData((prev) => [...prev, response.data[0]]);
    setLoading(false);
    setMediaPost(false);
  };

  //effects here
  useEffect(() => {
    if (!video) {
      videoInputRef.current.value = "";
    }

    if (!audio) {
      audioInputRef.current.value = "";
    }

    if (!doc) {
      docsInputRef.current.value = "";
    }

    if (!img) {
      imageInputRef.current.value = "";
    }
  }, [video, audio, doc, img]);

  return (
    <Paper
      elevation={8}
      style={{
        backgroundColor: "white",
        borderRadius: "10px",
        width: "600px",
        padding: "0px 20px",
      }}
    >
      <Grid container justifyContent={"space-between"} alignItems="center">
        <Grid
          item
          style={{
            paddingTop: "10px",
          }}
        >
          <Typography
            style={{
              fontWeight: "bold",
            }}
          >
            Raise Hand
          </Typography>
        </Grid>
        <Grid item>
          <IconButton onClick={() => setMediaPost(false)}>
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
      <form onSubmit={submitMultiMediaMessage}>
        <Grid
          container
          justifyContent={"space-between"}
          alignItems="flex-start"
          style={{
            marginTop: "20px",
            padding: "10px 0px",
          }}
        >
          <Grid item sm={1}>
            <UserProfile
              username={
                JSON.parse(localStorage.getItem("current_user"))?.["username"]
              }
              width="45px"
              height="45px"
              borderRadius="0.5rem"
            />
          </Grid>
          <Grid
            item
            sm={11}
            style={{
              display: "flex",
            }}
          >
            <TextareaAutosize
              style={{
                resize: "none",
                outline: "none",
                border: "none",
                width: "90%",
              }}
              placeholder="Write your content here..."
              className="post-area"
              maxLength={300}
              maxRows={5}
              onChange={(e) => {
                setTextLength(e.target.value.length);
              }}
              name="text"
            ></TextareaAutosize>
            <p style={{ margin: 0, opacity: "0.6", width: "10%" }}>
              {300 - textLength}/{300}
            </p>
          </Grid>
        </Grid>

        <Grid
          container
          style={{
            minHeight: "200px",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {img.length > 0 && (
            <RaiseHandImageContainer
              imgArray={img}
              setImgArray={setImg}
              setEditing={setEditing}
            />
          )}

          {video?.url && (
            <RaiseHandVideoContainer video={video} setvideo={setvideo} />
          )}

          {audio?.url && (
            <RaiseHandAudioContainer audio={audio} setAudio={setAudio} />
          )}

          {doc?.name && (
            <RaiseHandDocumentContainer doc={doc} setDoc={setDoc} />
          )}
        </Grid>

        <Grid
          container
          alignItems="center"
          style={{
            marginTop: "auto",
            paddingBottom: "10px",
            paddingTop: "10px",
          }}
        >
          <Grid item>
            <IconButton
              variant="contained"
              component="label"
              style={{
                width: "45px",
                height: "45px",
              }}
            >
              <PhotoIcon />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
                ref={imageInputRef}
              />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              variant="contained"
              component="label"
              style={{
                width: "45px",
                height: "45px",
              }}
            >
              <VideoIcon />
              <input
                type="file"
                accept="video/*"
                hidden
                onChange={handleVideoChange}
                ref={videoInputRef}
              />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              variant="contained"
              component="label"
              style={{
                width: "45px",
                height: "45px",
              }}
            >
              <DocsIcon />
              <input
                type="file"
                hidden
                onChange={handleDocsChange}
                accept=".doc,.docx,.pdf,.xlsx,.xls,.ppt,.pptx"
                ref={docsInputRef}
              />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              variant="contained"
              component="label"
              style={{
                width: "45px",
                height: "45px",
              }}
            >
              <input
                type="file"
                accept="audio/*"
                hidden
                onChange={handleAudioChange}
                ref={audioInputRef}
              />
              <AudioIcon />
            </IconButton>
          </Grid>
          <Grid
            item
            style={{
              marginLeft: "auto",
            }}
          >
            <Button
              variant="contained"
              style={{
                backgroundColor: "black",
                color: "white",
                borderRadius: "10px",
                padding: "10px 30px",
                position: "relative",
              }}
              type="submit"
              disabled={editing || loading}
            >
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: "white",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-12px",
                    marginLeft: "-12px",
                  }}
                />
              )}
              POST
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
