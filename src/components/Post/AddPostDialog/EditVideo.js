import { Grid } from "@mui/material";
import VideoContainer from "./VideoContainer";

export default function EditVideo(props) {
  const {
    videoFilePath,
    setEndVideoTime,
    setStartVideoTime,
    setVideoDuration,
    videoFile,
    setEditVideo,
    setVideoFilePath,
    setShowVideo,
    editVideo,
    videoDuration,
  } = props;

  return (
    <Grid container className="main_container">
      <Grid item md={12}>
        <VideoContainer
          setVideoDuration={setVideoDuration}
          setStartVideoTime={setStartVideoTime}
          setEndVideoTime={setEndVideoTime}
          showCaption
          controls
          src={videoFilePath}
          videoFilePath={videoFilePath}
          setVideoFilePath={setVideoFilePath}
          setEditVideo={setEditVideo}
          setShowVideo={setShowVideo}
          videoFile={videoFile}
          editVideo={editVideo}
          videiDuration={videoDuration}
        />
      </Grid>
    </Grid>
  );
}
