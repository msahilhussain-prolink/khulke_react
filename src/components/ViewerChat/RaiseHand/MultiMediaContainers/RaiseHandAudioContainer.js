import { Grid } from "@mui/material";
import { useState } from "react";
import AudioContainer from "../../../Post/AddPostDialog/AudioContainer";

export default function RaiseHandAudioContainer(props) {
  // Props destructuring here
  const { audio, setAudio } = props;

  //usestates here
  const [editAudio, setEditAudio] = useState(false);

  return (
    <>
      <Grid item xs={12}>
        <AudioContainer
          user={true}
          audioFilePath={audio.url}
          setAduioFilePath={(val) => {
            setAudio({ ...audio, url: val });
          }}
          setState={(val) => {
            if (!val) {
              setAudio();
            }
          }}
          setEditAudio={setEditAudio}
          setStartAudioTime={(val) => {
            setAudio({ ...audio, start: val });
          }}
          setEndAudioTime={(val) => {
            setAudio({ ...audio, end: val });
          }}
          setAudioDuration={(val) => {
            setAudio({ ...audio, duration: val });
          }}
          audioFile={audio.file}
          hideEdit={true}
        />
      </Grid>
    </>
  );
}
