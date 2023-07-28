import { Grid } from "@material-ui/core";
import { useEffect } from "react";

export default function AgoraVideoPlayer({
  videoTrack,
  style,
  fit,
  test,
  ...props
}) {
  useEffect(() => {
    const vedioPlayer = async () => {
      if (!videoTrack) return;
      try {
        await videoTrack.play(videoTrack._ID, { fit: fit || "contain" });
      } catch (e) {
        console.error("Could not play videotrack as ", e.message, { e });
      }
    };

    vedioPlayer();
  }, [videoTrack, videoTrack?.isPlaying, fit]);

  return (
    <Grid
      container
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
      {...props}
    >
      <Grid
        item
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
        id={videoTrack?._ID}
      >
        {props.children && props.children}
      </Grid>
    </Grid>
  );
}
