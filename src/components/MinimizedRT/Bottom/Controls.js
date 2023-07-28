import { Grid, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { UpdateLiveRTClient } from "../../../redux/actions/minimizedRoundtable";
import { useState, useEffect } from "react";
import cameraWeb from "../../../assets/icons/camera web.svg";
import cameraWebDisabled from "../../../assets/icons/camera web disabled.svg";
import micWeb from "../../../assets/icons/mic web.svg";
import micWebDisabled from "../../../assets/icons/mic web disabled.svg";

export default function Controls({ video: videoRt }) {
  //local states
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);

  //store selectors
  const tracks = useSelector((state) => state.minimizedData.tracks);
  const channel = useSelector((state) => state.minimizedData.channel);

  //constants here
  const dispatch = useDispatch();

  //functions here
  const toggleVideo = async () => {
    await tracks[1].setEnabled(!video);
    dispatch(
      UpdateLiveRTClient({
        tracksState: { video: !video, audio: audio },
      })
    );
    setVideo((prev) => !prev);
  };

  const toggleAudio = async () => {
    if (!tracks?.[0]) return;
    await tracks?.[0].setEnabled(!audio);
    UpdateLiveRTClient({
      tracksState: { video: video, audio: !audio },
    });
    setAudio((prev) => !prev);
  };

  //effects here
  useEffect(() => {
    setVideo(tracks?.[1]?.enabled || false);
    setAudio(tracks?.[0]?.enabled || false);
  }, [tracks]);

  useEffect(() => {
    if (!channel) return;

    channel.on("ChannelMessage", async (message) => {
      const data = message.text.split("||");

      if (!data) return;

      if (data[0] === "audio") {
        toggleAudio();
      }
    });
  }, [channel]);

  return (
    <Grid container justifyContent={"space-evenly"}>
      <Grid item>
        <IconButton
          onClick={toggleAudio}
          style={{
            padding: "0px",
          }}
        >
          {audio ? (
            <img
              src={micWeb}
              style={{
                maxWidth: "40px",
              }}
            />
          ) : (
            <img
              src={micWebDisabled}
              style={{
                maxWidth: "40px",
              }}
            />
          )}
        </IconButton>
      </Grid>
      {tracks?.[1] && videoRt && (
        <Grid item>
          <IconButton
            onClick={toggleVideo}
            style={{
              padding: "0px",
            }}
          >
            {video ? (
              <img
                src={cameraWeb}
                style={{
                  maxWidth: "40px",
                }}
              />
            ) : (
              <img
                src={cameraWebDisabled}
                style={{
                  maxWidth: "40px",
                }}
              />
            )}
          </IconButton>
        </Grid>
      )}
    </Grid>
  );
}
