import { rt_type } from "./settings";
import MicOffIcon from "@material-ui/icons/MicOff";
import { POST_API_BASE_URL } from "../../constants/env";
import ModeratorContols from "./ModeratorControls";
import SpeakerNames from "./SpeakerNames";
import AgoraVideoPlayer from "../../components/AgoraVideoPlayer/AgoraVideoPlayer";
import UserProfile from "../../components/UserProfile";
import { allWords } from "../../App";

export default function UserTile(props) {
  const {
    user,
    track,
    audio_status,
    moderator,
    wc_uids,
    stage_uids,
    self,
    role,
    moderatorActions,
    handle_wildcard_removal,
    showModeratorControls,
    miniScreen,
    user_type = "default",
  } = props;

  if (!user && !track) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          color: "white",
        }}
      >
        {allWords.misc.pages.loading}
      </div>
    );
  }

  const NoVideo = () => {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          color: "white",
          backgroundColor: "#161f3a",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <UserProfile
          username={user.uid}
          id={`${user.uid}`}
          boxShadow="1px 2px px red"
          height="50px"
          width="50px"
          borderRadius="50%"
        />
      </div>
    );
  };

  const mainBox = () => {
    if (rt_type !== "VIDEO_STREAMING") {
      return NoVideo();
    }

    if (
      rt_type === "VIDEO_STREAMING" &&
      ((!self && !track) || (self && !track?._enabled))
    ) {
      return NoVideo();
    }

    if (rt_type === "VIDEO_STREAMING" && track) {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <AgoraVideoPlayer
            style={{
              width: "100%",
              height: "100%",
            }}
            videoTrack={track}
          />
        </div>
      );
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {mainBox()}
      <span
        style={{
          position: "absolute",
          left: "5px",
          bottom: "5px",
          fontSize: "10px",
          color: "white",
        }}
      >
        <SpeakerNames
          wc_uids={wc_uids}
          moderator={moderator}
          userid={user.uid}
          stage_uids={stage_uids}
          roleSize="8px"
          nameSize="10px"
          user_type={user_type}
        />
      </span>
      {!audio_status && !miniScreen && (
        <span
          style={{
            position: "absolute",
            bottom: "5px",
            right: "5px",
            color: "white",
          }}
        >
          <MicOffIcon
            style={{
              fontSize: "21px",
            }}
          />
        </span>
      )}
      {showModeratorControls && !miniScreen && (
        <ModeratorContols
          user_uid={user.uid}
          mic_status={audio_status}
          wc_uids={wc_uids}
          handle_wildcard_removal={handle_wildcard_removal}
          moderatorActions={moderatorActions}
          role={role}
          customStyle={{
            position: "absolute",
            top: "10px",
            right: "0px",
          }}
        />
      )}
    </div>
  );
}
