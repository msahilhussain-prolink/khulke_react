import { Grid } from "@mui/material";
import { useSelector } from "react-redux";
import AgoraVideoPlayer from "../../AgoraVideoPlayer/AgoraVideoPlayer";
import UserProfile from "../../UserProfile";
import { BORDER_RADIUS, VIDEO_RT } from "../Constants";
import NameAndRole from "./NameAndRole";

export default function Speaker({ calculateRole, toggleUser }) {
  //store selectors here
  const client = useSelector((state) => state.minimizedData.client);
  const tracks = useSelector((state) => state.minimizedData.tracks);

  const rt_data = useSelector((state) => state.minimizedData.rt_data);

  return (
    <Grid
      container
      style={{
        aspectRatio: "16/9",
        backgroundColor: "#161f3a",
        borderTopLeftRadius: BORDER_RADIUS,
        borderTopRightRadius: BORDER_RADIUS,
        position: "relative",
      }}
    >
      <Grid
        item
        xs={12}
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {toggleUser ? (
          (toggleUser.videoTrack ||
            (toggleUser.uid === client.uid && tracks?.[1]?.enabled)) &&
          rt_data.rt_type === VIDEO_RT ? (
            <AgoraVideoPlayer
              style={{
                height: "100%",
                width: "100%",
              }}
              videoTrack={
                toggleUser.uid === client.uid
                  ? tracks?.[1]
                  : toggleUser.videoTrack
              }
            />
          ) : (
            <UserProfile
              username={toggleUser.uid}
              alt={`${toggleUser.uid}'s Avatar`}
              width="100px"
              height="100px"
              borderRadius="50%"
            />
          )
        ) : (
          ""
        )}
      </Grid>
      {toggleUser && (
        <NameAndRole
          role={calculateRole(toggleUser.uid)}
          name={toggleUser.uid}
        />
      )}
    </Grid>
  );
}
