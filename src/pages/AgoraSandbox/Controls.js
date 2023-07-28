import { useState, useEffect, useRef } from "react";
import {
  channelName,
  config,
  open_to_all,
  rt_name,
  rt_type,
  screenClient,
  uid,
} from "./settings";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import "./style.css";
import { Button } from "@mui/material";
import PresentToAllIcon from "@mui/icons-material/PresentToAll";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useDispatch, useSelector } from "react-redux";
import { getRTSingleData } from "../../redux/actions/roundtableAction/single_roundtable";
import { useLocation } from "react-router-dom";
import { UpdateLiveRTClient } from "../../redux/actions/minimizedRoundtable";
import Volume from "./Volume";
import { moengageEvent } from "../../utils/utils";
import logger from "../../logger";

export default function Controls(props) {
  const {
    tracks,
    audio_status,
    video_status,
    setAudioStatus,
    setVideoStatus,
    rtm_channel,
    role,
    current_user,
    client,
    start_time,
    rt_id,
    setModeratorHasJoined,
    handleTrackPublish,
    volume,
    setVolume,
    fullScreenHeader,
    disableButton,
    setDisableButtons,
    setTrackState = () => {},
    trackState,
    showControls,
    single_rt_data,
    ready,
    start
  } = props;

  const { state: expandedState } = useLocation();
  const expandedAgoraData = useSelector((state) => state.minimizedData.data);
  
  const [VideoStatusBeforeScreenShared, setVideoStatusBeforeScreenShared] =
    useState(false);

  const VideoStatusBeforeScreenSharedRef = useRef();
  VideoStatusBeforeScreenSharedRef.current = VideoStatusBeforeScreenShared;

  const [audio_btn, setAudioBtn] = useState(
    expandedState?.expanded ? expandedAgoraData?.tracks?.[0]?.enabled : true
  );
  const [video_btn, setVideoBtn] = useState(
    expandedState?.expanded ? expandedAgoraData?.tracks?.[1]?.enabled : true
  );

  const mic_btn = useRef("");
  const cam_btn = useRef("");

  const [screenSharing, setScreenSharing] = useState(
    expandedState?.expanded
      ? expandedAgoraData?.localScreentrack
        ? true
        : false
      : false
  );
  const [localScreentrack, setLocalScreenTrack] = useState(
    expandedState?.expanded
      ? expandedAgoraData?.localScreentrack
        ? expandedAgoraData?.localScreentrack
        : undefined
      : undefined
  );

  const [localScreenAudiotrack, setLocalScreenAudioTrack] = useState(
    expandedState?.expanded
      ? expandedAgoraData?.localScreenAudiotrack
        ? expandedAgoraData?.localScreenAudiotrack
        : undefined
      : undefined
  );

  useEffect(() => {
    setAudioBtn(audio_status);
    setVideoBtn(video_status);
    setTrackState({ audio: audio_status, video: video_status });
  }, [audio_status, video_status]);

  let dispatch = useDispatch();

  const [videoDisable, setDisableVideo] = useState(false);

  const [moderator, setModerator] = useState(false);
  const localScreenTrackref = useRef();
  localScreenTrackref.current = localScreentrack;

  const localScreenAudioTrackref = useRef();
  localScreenAudioTrackref.current = localScreenAudiotrack;

  const videoStatusRef = useRef();
  videoStatusRef.current = video_status;

  //useSelector calls here
  const has_broadcasted = useSelector((state) => state.single_rt.data);

  //event listeners here
  useEffect(() => {
    dispatch(UpdateLiveRTClient({ localScreentrack }));
    dispatch(UpdateLiveRTClient({ localScreenAudiotrack }));
    localScreentrack?.on("track-ended", () => {
      localScreenTrackref.current?.close();
      localScreenAudioTrackref.current?.close();
      setScreenSharing(false);
      screenClient.unpublish(localScreentrack);
      setLocalScreenTrack();
      setLocalScreenAudioTrack();
      screenClient.leave();
    });
  }, [localScreentrack, localScreenAudiotrack]);

  useEffect(() => {
    dispatch(UpdateLiveRTClient({ screenClient }));
  }, [screenClient]);

  useEffect(() => {
    if (!videoDisable) return;
    setVideoStatus(false);
  }, [videoDisable]);

  useEffect(() => {
    if (!client) return;
    client?.on("user-joined", (user) => {
      if (
        user.uid ===
        JSON.parse(localStorage.getItem("join_rt"))["moderator"]["username"]
      ) {
        setModerator(true);
        setModeratorHasJoined(true);
      }
    });
    if (
      client.uid ===
      JSON.parse(localStorage.getItem("join_rt"))["moderator"]["username"]
    ) {
      setModerator(true);
      setModeratorHasJoined(true);
    }
  }, [client]);


  useEffect(() => {
    const data = {
      rt_id,
      token:
        localStorage.access || JSON.parse(localStorage.anonymous_user).token,
    };
    dispatch(getRTSingleData(data));
  }, []);

  useEffect(() => {
    if (!has_broadcasted) return;

    if (has_broadcasted?.data?.[0]?.broadcast_live_flag) {
      setModerator(true);
      setModeratorHasJoined(true);
    }
  }, [has_broadcasted]);

  useEffect(() => {
    const func = async () => {
      let timeElapsed =
        (new Date().getTime() - new Date(start_time)?.getTime()) / 60000;

      if (moderator && timeElapsed > 0 && disableButton) {
        setDisableButtons(false);
        await tracks?.[0].setEnabled(true);
        setAudioBtn(true);
        setAudioStatus(true);
        setTrackState({ audio: true, video: false });
        if (rt_type === "VIDEO_STREAMING") {
          await tracks?.[1].setEnabled(true);
          setVideoBtn(true);
          setVideoStatus(true);

          setTrackState({ audio: true, video: true });
        }
        handleTrackPublish("publish");
      }
    };

    if (!expandedState?.expanded) {
      func();
    }
  }, [moderator]);

  useEffect(() => {
    if (!audio_btn) {
      try {
        document.querySelector(`#${current_user.username}`).style.boxShadow =
          "0px 0px 0px white";
      } catch (err) {}
    }
  }, [audio_btn]);

  const mute = async (type) => {
    if (type === "audio") {
      await tracks?.[0].setEnabled(!trackState.audio);
      setTrackState((ps) => {
        setAudioStatus(!ps.audio);
        setAudioBtn(!ps.audio);
        return { ...ps, audio: !ps.audio };
      });

      // window.Moengage?.track_event("mic action", {
      //   username: JSON.parse(
      //     localStorage.current_user || localStorage.anonymous_user
      //   ).username,
      //   userid: JSON.parse(
      //     localStorage.current_user || localStorage.anonymous_user
      //   )._id,
      //   rt_id: rt_id,
      //   status: audio_status ? "mute" : "unmute",
      // });
    } else if (type === "video") {
      try {
        await tracks?.[1].setEnabled(!trackState.video);
      } catch (e) {
        console.error("could not enable video track due to ", e.message, { e });
      }

      setTrackState((ps) => {
        setVideoStatus(!ps.video);
        setVideoBtn(!ps.video);
        return { ...ps, video: !ps.video };
      });
      // window.Moengage?.track_event("camera action", {
      //   username: JSON.parse(
      //     localStorage.current_user || localStorage.anonymous_user
      //   ).username,
      //   userid: JSON.parse(
      //     localStorage.current_user || localStorage.anonymous_user
      //   )._id,
      //   rt_id: rt_id,
      //   status: video_status ? "off camera" : "on camera",
      // });
    }
  };

  const audioVideoEvent = (message, memberId, messagePros) => {
    const data = message.text.split("||");
    if (
      data[1] ===
      JSON.parse(localStorage.current_user || localStorage.anonymous_user)[
        "username"
      ]
    ) {
      if (data[0] === "audio") {
        if (!mic_btn.current) return mute("audio");
        mic_btn.current.click();
      } else if (data[0] === "video") {
        if (!cam_btn.current) return mute("video");
        cam_btn.current.click();
      }
    }
  };

  useEffect(() => {
    if (!rtm_channel) return;

    rtm_channel?.on("ChannelMessage", audioVideoEvent);

    return () => {
      rtm_channel?.off("ChannelMessage", audioVideoEvent);
    };
  }, [rtm_channel]);

  //optimizations

  useEffect(() => {
    //all functions here
    const userPublishedHandler = (user, mediaType) => {
      if (user.uid.split("-")[1] !== "screen" || !localScreenTrackref.current) {
        return;
      }

      if (mediaType === "video") {
        if (user.uid.split("-")[0] !== uid && localScreenTrackref.current) {
          logger.info({
            user: user.uid.split("-")[0],
            uid,
            localScreenTrackref: localScreenTrackref.current,
          });
          localScreenTrackref.current?.close();
          localScreenAudioTrackref.current?.close();
          screenClient.unpublish(localScreentrack);
          screenClient.leave();
          setLocalScreenTrack();
          setLocalScreenAudioTrack();
          setScreenSharing(false);
          return screenClient;
        }
      }
    };

    const userPublishedHandlerTracks = async (e,user, mediaType) => {
      if (
        user.uid.split("-")[1] === "screen" &&
        user.uid.split("-")[0] !== client.uid
      ) {
        setVideoStatusBeforeScreenShared(videoStatusRef.current);
        await tracks[1].setEnabled(false);
        setTrackState((ps) => {
          setVideoStatus(false);
          setVideoBtn(false);
          return { ...ps, video: false };
        });
        setDisableVideo(true);
      }
    };

    const userLeftHandler = async (user, mediaType) => {
      if (
        user.uid.split("-")[1] === "screen" &&
        user.uid.split("-")[0] !== client.uid
      ) {
        setDisableVideo(false);
        await tracks[1].setEnabled(VideoStatusBeforeScreenSharedRef.current);
        setTrackState((ps) => {
          setVideoStatus(VideoStatusBeforeScreenSharedRef.current);
          setVideoBtn(VideoStatusBeforeScreenSharedRef.current);
          return { ...ps, video: VideoStatusBeforeScreenSharedRef.current };
        });
      }
    };

    const userLeftHandlerScreenClient = (user) => {
      if (user.uid === uid) {
        screenClient.unpublish(localScreentrack);
        localScreenTrackref.current?.close();
        localScreenAudioTrackref.current?.close();
        screenClient.leave();
        setLocalScreenTrack();
        setScreenSharing(false);
      }
    };

    client.on("user-published", userPublishedHandler);
    client.on("user-published", userPublishedHandlerTracks);
    client.on("user-left", userLeftHandler);
    screenClient.on("user-left", userLeftHandlerScreenClient);

    return () => {
      client.off("user-published", userPublishedHandler);
      client.off("user-published", userPublishedHandlerTracks);
      client.off("user-left", userLeftHandler);
      screenClient.off("user-left", userLeftHandlerScreenClient);
    };
  }, [client, screenClient]);

  //removing existing screen sharing if any new person started sharing their screen

  useEffect(() => {
    if (!tracks || !role) return;

    const func = async () => {
      if (role === "admin" || role === "audience" || role === "host") {
        if (role === "host") {
          if (rt_type === "VIDEO_STREAMING") {
            setAudioBtn(
              expandedState?.expanded
                ? expandedAgoraData?.tracks?.[0]?.enabled
                : true
            );
            setVideoBtn(
              expandedState?.expanded
                ? expandedAgoraData?.tracks?.[1]?.enabled
                : true
            );
          } else if (rt_type === "AUDIO_STREAMING") {
            setAudioBtn(tracks?.[0]?.enabled);
          }
        } else if (
          !expandedState?.expanded &&
          (role === "audience" || role === "admin")
        ) {
          await tracks?.[0]?.setEnabled(false);
          setAudioBtn(false);
          await tracks?.[1]?.setEnabled(false);
          setVideoBtn(false);
        }
      } else {
        if (rt_type === "AUDIO_STREAMING") {
          await tracks[1]?.setEnabled(false);
          setVideoBtn(false);
        }
      }
    };

    func();
  }, [role, tracks]);

  const shareScreen = () => {
    setScreenSharing(!screenSharing);

    if (screenSharing && !localScreentrack) {
      return;
    }

    //ending screensharing//
    if (screenSharing && localScreentrack) {
      screenClient.unpublish(localScreentrack);
      localScreentrack.close();
      screenClient.leave();
      setScreenSharing(false);
      setLocalScreenTrack();
      return screenClient;
    }

    async function startScreenCall() {
      if (role !== "audience" && role !== "admin") {
        await screenClient.setClientRole(
          role !== "audience" && role !== "admin" ? "host" : "audience",
          (e) => {
            if (!e) {
            } else {
            }
          }
        );

        const screenTrack = await AgoraRTC.createScreenVideoTrack({}, "auto");

        await screenClient.join(
          config.appId,
          channelName,
          config.token,
          `${uid}-screen`
        );

        await screenClient.publish(screenTrack);
        setLocalScreenTrack(screenTrack.length ? screenTrack[0] : screenTrack);
        setLocalScreenAudioTrack(
          screenTrack.length ? screenTrack[1] : undefined
        );
        return screenClient;
      } else return screenClient;
    }

    startScreenCall()
      .then((videoClient) => {
        moengageEvent("Screen Share", "RoundTable", {
          RoundTableID: rt_id,
          Name: rt_name,
          "K Type": rt_type,
          "K SubType": open_to_all,
          "Audience Interaction": 0,
        });
      })
      .catch((e) => {
        setScreenSharing(false);
        //screenClient.unpublish(localScreentrack);
        screenClient.leave();
        setLocalScreenTrack();
        setLocalScreenAudioTrack();
      });
  };

  return (
    <div className={`parent-controls ${showControls ? "show" : ""}`}>
      {single_rt_data?.data?.[0]?.["r_type"] !== "RECORDING_BASED" && (
        <>
          { tracks?.length !== 0 && ready && start && (
            <>
              {role !== "audience" && role !== "admin" && (
                <div className={`controls-container`}>
                  {rt_type !== "AUDIO_STREAMING" && (
                    <Button
                      ref={cam_btn}
                      onClick={() => mute("video")}
                      disabled={videoDisable || disableButton}
                      className="video-btn"
                    >
                      {video_btn ? (
                        <VideocamIcon className="video-icon" />
                      ) : (
                        <VideocamOffIcon className="video-icon" />
                      )}
                    </Button>
                  )}
                  <Button
                    ref={mic_btn}
                    onClick={() => mute("audio")}
                    disabled={disableButton}
                    className="mic-btn"
                  >
                    {audio_btn ? (
                      <MicIcon className="mic-icon" />
                    ) : (
                      <MicOffIcon className="mic-icon" />
                    )}
                  </Button>

                  <Button
                    onClick={() => {
                      shareScreen();
                    }}
                    disabled={disableButton}
                    className="cshare-btn"
                  >
                    {screenSharing ? (
                      <CancelPresentationIcon className="share-icon" />
                    ) : (
                      <PresentToAllIcon className="share-icon" />
                    )}
                  </Button>
                  <div className="volume-container">
                    <Volume volume={volume} setVolume={setVolume} style={{ padding: "6px" }} />
                  </div>
                </div>
              )}
             </>
          )}
        </>)}
        
      <div className="right-icons">
        {/* <Button className="settings-icon">
          <SettingsOutlinedIcon />
        </Button> */}
        <img
          alt=""
          src={fullScreenHeader}
          onClick={() => dispatch({type: "full"})}
          className="full-screen-icon"
        />
      </div>
    </div>
  );
}