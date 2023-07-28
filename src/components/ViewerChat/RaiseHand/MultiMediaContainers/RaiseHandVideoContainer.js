import { Grid } from "@mui/material";
import { useState } from "react";
import VideoContainer from "../../../Post/AddPostDialog/VideoContainer";

export default function RaiseHandVideoContainer(props) {
  // Props destructuring here
  const { video, setvideo } = props;

  //usestates here
  const [editVideo, setEditVideo] = useState(false);

  return (
    <>
      <Grid item xs={12}>
        <VideoContainer
          setVideoDuration={(val) => {
            setvideo({ ...video, duration: val });
          }}
          setEditVideo={setEditVideo}
          videoFilePath={video.url}
          setVideoFilePath={(val) => {
            setvideo({ ...video, url: val });
          }}
          setShowVideo={(val) => {
            if (!val) setvideo();
          }}
          setStartVideoTime={(val) => {
            setvideo({ ...video, start: val });
          }}
          setEndVideoTime={(val) => {
            setvideo({ ...video, end: val });
          }}
          videoFile={video.file}
          editVideo={editVideo}
          src={video.url}
          controls={!editVideo}
          hideEdit={true}
        />
      </Grid>
    </>
  );
}
