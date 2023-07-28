import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Grid } from "@material-ui/core";
import UserTile from "./UserTile";
import ScrollZoom from "./ScrollZoomScreen";
import AgoraVideoPlayer from "../../components/AgoraVideoPlayer/AgoraVideoPlayer";
import { allWords } from "../../App"

export default function SharedScreen(props) {
  const {
    users,
    role,
    rt_type,
    moderator,
    wc_uids,
    stage_uids,
    client,
    moderatorActions,
    handle_wildcard_removal,
    tracks,
    audio_status,
    miniScreen,
  } = props;
  const [user, setUser] = useState();
  const [screenUser, setScreenUser] = useState();
  const [usersList, setUsersList] = useState();
  const videoContainerRef = useRef();
  const trackref = useRef();
  trackref.current = screenUser?.videoTrack;

  useEffect(() => {
    if (!usersList) {
      return;
    }
    usersList.forEach((element) => {
      if (element.uid.split("-")[1] === "screen") {
        setScreenUser(element);
        usersList.forEach((elem) => {
          if (element.uid.split("-")[0] === elem.uid) {
            setUser(elem);
          }
        });
      }
    });
  }, [usersList]);

  useLayoutEffect(() => {
    setUsersList([...users, client]);
  }, [users]);

  useEffect(() => {
    if (!videoContainerRef.current || !client || !user) return;

    if (screenUser && screenUser.videoTrack && client.uid !== user.uid) {
      ScrollZoom(videoContainerRef.current, 2, 0.2);
    }
  }, [videoContainerRef, screenUser, screenUser?.videoTrack, client, user]);

  return (
    <Grid
      container
      style={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        display: "flex",
        backgroundColor: "#161f3a",
        borderRadius: "8px",
        position: "relative",
        justifyContent: "center",
      }}
    >
      <Grid
        item
        style={{
          overflow: "hidden",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        ref={videoContainerRef}
      >
        {screenUser && screenUser.videoTrack && client?.uid !== user?.uid ? (
          <AgoraVideoPlayer
            style={{
              width: "100%",
              height: "100%",
              transition: "all",
            }}
            fit="contain"
            videoTrack={screenUser.videoTrack}
          />
        ) : !screenUser ? (
          <h1
            style={{
              color: "white",
              textAlign: "center",
            }}
          >
            Waiting for Shared Screen
          </h1>
        ) : (
          <h1
            style={{
              color: "white",
              textAlign: "center",
            }}
          >
            {allWords.misc.pages.screenshared}
          </h1>
        )}
      </Grid>
      <Grid
        item
        style={{
          position: "absolute",
          bottom: "0px",
          left: "0px",
          width: "150px",
          height: "100px",
          backgroundColor: "rgb(22, 31, 58)",
          border: "2px solid black",
          borderRadius: "5px",
        }}
      >
        <UserTile
          user={user?.uid === client?.uid ? client : user}
          track={user?.uid === client?.uid ? tracks[1] : user?.videoTrack}
          rt_type={rt_type}
          audio_status={
            user?.uid === client?.uid ? audio_status : user?.audioTrack
          }
          moderator={moderator}
          wc_uids={wc_uids}
          stage_uids={stage_uids}
          self={client?.uid === user?.uid}
          showModeratorControls={
            (client?.uid === user?.uid &&
              !role.includes("moderator") &&
              !role.includes("panellist")) ||
            (role.includes("moderator") && client?.uid !== user?.uid)
          }
          role={role}
          moderatorActions={moderatorActions}
          handle_wildcard_removal={handle_wildcard_removal}
          miniScreen={miniScreen}
          user_type={user?.user_type}
        />
      </Grid>
    </Grid>
  );
}
