import { Grid } from "@material-ui/core";
import AgoraVideoPlayer from "../../components/AgoraVideoPlayer/AgoraVideoPlayer";
import UserProfile from "../../components/UserProfile";
import { POST_API_BASE_URL } from "../../constants/env";

export default function RecordSharedScreen({ screenUser, screenTrack, role }) {
  return (
    <Grid
      container
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <AgoraVideoPlayer
        videoTrack={screenTrack}
        style={{
          width: "100%",
          height: "100%",
        }}
        fit={"contain"}
      />
      <Grid
        item
        style={{
          width: "300px",
          height: "200px",
          position: "absolute",
          bottom: "0px",
          left: "0px",
          border: "2px solid black",
          borderRadius: "10px",
        }}
      >
        {screenUser?.videoTrack ? (
          <AgoraVideoPlayer
            style={{
              width: "100%",
              height: "100%",
            }}
            videoTrack={screenUser.videoTrack}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#161f3a",
            }}
          >
            <UserProfile
              username={screenUser?.uid}
              id={`${screenUser?.uid}`}
              boxShadow="1px 2px 1px #eee"
              maxWidth="50px"
              height="50px"
              width="100px"
              borderRadius="50%"
            />
          </div>
        )}

        {role}
      </Grid>
    </Grid>
  );
}
