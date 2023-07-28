import { Grid } from "@mui/material";
import { useCallback, useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { REACT_APP_BASE_URL_FOR_ROUNDTABLE } from "../../constants/env";
import BottomUi from "./Bottom/BottomUI";
import TopUi from "./Top/TopUI";
import axios from "axios";
import {
  ExpandRoundtable,
  UpdateLiveRTClient,
} from "../../redux/actions/minimizedRoundtable";
import { auto_login_continue, moengageEvent } from "../../utils/utils";
import WildcardConfirmation from "./Utils/WildcardConfirmation";

import { createMicrophoneAndCameraTracks } from "agora-rtc-sdk-ng";
import { AUDIO_RT, MILISECONDS_TO_MINUTES, VIDEO_RT } from "./Constants";
import dragElement from "./Utils/DraggableDiv";
import ToastHandler from "../../utils/ToastHandler";
import SimpleModalComponent from "../SimpleModalComponent";
import moment from "moment";
import logger from "../../logger";

export default function MinimizedRoundtable() {
  //states here
  const [position, setPosition] = useState({
    bottom: "0px",
    right: "0px",
  });
  const [wildcardReq, setWildcardReq] = useState(false);
  const [consentTimer, setConsentTimer] = useState();
  const [showmVideo, setShowMVideo] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showLabel, setShowLabel] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [time, setTime] = useState("");

  // for leave rt notification popup
  const [showPopup, setShowPopup] = useState(false);

  //constants here
  const dispatch = useDispatch();

  //redux state data
  const minimized = useSelector((state) => state.minimizedData.minimized);
  const client = useSelector((state) => state.minimizedData.client);
  const rt_data = useSelector((state) => state.minimizedData.rt_data);
  const rt_id = rt_data?.rt_id;
  const channel = useSelector((state) => state.minimizedData.channel);
  const useClient_RTM = useSelector(
    (state) => state.minimizedData.useClient_RTM
  );
  const tracks = useSelector((state) => state.minimizedData.tracks);
  const localScreentrack = useSelector(
    (state) => state.minimizedData.localScreentrack
  );
  const screenClient = useSelector((state) => state.minimizedData.screenClient);
  const single_rt_data = useSelector((state) => state.single_rt.data);

  // when user leaves rt, notify popup
  const isRecording = single_rt_data?.data?.[0]?.recording?.[0]?.owner_flag;
  const typeOfRT = single_rt_data?.data?.[0]?.open_to_all;

  //refs here
  const topUiRef = useRef();
  const bottomUiRef = useRef();
  const localScreenTrackref = useRef();
  localScreenTrackref.current = localScreentrack;
  const tracksRef = useRef();
  tracksRef.current = tracks;
  const rtMinimized = useRef();
  rtMinimized.current = minimized;
  //event handler functions
  const ChannelMessageEvents = async (message) => {
    const data = message.text.split("||");

    if (!data) return;

    if (
      data[0] === "reqwildcard" &&
      data[1] === client.uid &&
      rtMinimized.current
    ) {
      setWildcardReq(true);
      const timeout = setTimeout(() => {
        setWildcardReq(false);
        setConsentTimer();
        autoDismiss();
      }, MILISECONDS_TO_MINUTES * 3);

      setConsentTimer(timeout);
    }

    if (
      data[0] === "accepted" &&
      data[1] === client.uid &&
      rtMinimized.current
    ) {
      return upgradeSelfToWildcard();
    }
  };

  const trackEndedEvents = () => {
    dispatch(UpdateLiveRTClient({ localScreentrack: undefined }));
  };

  const handleTracksPublishedEvent = (user, mediaType) => {
    if (user.uid.split("-")[1] !== "screen" || !localScreenTrackref.current) {
      return;
    }

    if (mediaType === "video") {
      if (
        user.uid.split("-")[0] !== client.uid &&
        localScreenTrackref.current
      ) {
        localScreenTrackref.current?.close();
        screenClient.unpublish(localScreenTrackref.current);
        screenClient.leave();
        dispatch(
          UpdateLiveRTClient({
            screenClient: undefined,
            localScreentrack: undefined,
          })
        );
      }
    }
  };

  //effects here
  const minimizedRef = useCallback((node) => {
    if (node !== null) {
      dragElement(node, setPosition);
    }
  }, []);

  useEffect(() => {
    if (!localScreentrack) return;

    localScreentrack.on("track-ended", trackEndedEvents);

    screenClient.on("user-published", handleTracksPublishedEvent);

    if (!minimized) {
      localScreentrack?.off("track-ended", trackEndedEvents);

      screenClient?.off("user-published", handleTracksPublishedEvent);
    }
  }, [localScreentrack, minimized]);

  useEffect(() => {
    if (!channel) return;

    channel.on("ChannelMessage", ChannelMessageEvents);

    if (!minimized) return channel.off("ChannelMessage", ChannelMessageEvents);
  }, [channel, minimized]);

  //functions here
  const handleTracksPublishing = async (localTrack) => {
    if (rt_data?.rt_type === AUDIO_RT) {
      await localTrack[0].setEnabled(true);
      await localTrack[1].setEnabled(false);
      await client.publish(localTrack[0]);
    } else if (rt_data?.rt_type === VIDEO_RT) {
      await localTrack[0].setEnabled(true);
      await localTrack[1].setEnabled(true);
      await client.publish(localTrack);
    } else {
      ToastHandler("info", "Could not published tracks.");
    }
  };

  const upgradeSelfToWildcard = async () => {
    try {
      await client.setClientRole("host");
      await client.unpublish();
    } catch (error) {
      logger.info(error.message, "this is the error");
    }

    try {
      const temp = await createMicrophoneAndCameraTracks(
        {},
        { encoderConfig: { frameRate: 30, height: 720, width: 1280 } }
      );
      if (tracks?.length !== 0) {
        tracks?.[0]?.setEnabled(false);
        tracks?.[1]?.setEnabled(false);
        tracks?.[0]?.close();
        tracks?.[1]?.close();
      }
      dispatch(UpdateLiveRTClient({ tracks: temp }));
      handleTracksPublishing(temp);
    } catch (e) {
      if (e.code === "PERMISSION_DENIED") {
        ToastHandler("info", "Permission Required before you can join.");
      } else if (e.code === "NOT_READABLE") {
        ToastHandler(
          "info",
          allWords.misc.pages.camerataken
        );
      } else {
        ToastHandler("info", allWords.misc.pages.cantgetcam);
        logger.info(e.message);
      }

      return;
    }

    topUiRef.current.updateWcUids(client.uid);
    bottomUiRef.current.updateWcUids(client.uid);
  };

  const discard = () => {
    channel.sendMessage({
      text: `rejwildcard||${client.uid}`,
    });

    setWildcardReq(false);
    if (consentTimer) {
      clearTimeout(consentTimer);
    }
  };

  const autoDismiss = () => {
    channel.sendMessage({
      text: `wcautodismiss||${client.uid}`,
    });

    setWildcardReq(false);
    if (consentTimer) {
      clearTimeout(consentTimer);
    }
  };

  const confirm = async () => {
    channel.sendMessage({
      text: `accwildcard||${client.uid}`,
    });

    setWildcardReq(false);
    clearTimeout(consentTimer);
  };

  const leaveRT = () => {
    const anonymous_user = localStorage.anonymous_user;

    let access;

    access = localStorage.access || JSON.parse(anonymous_user).token;

    const configu = {
      method: "get",
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}${anonymous_user ? "/anonymous" : ""
        }/${rt_id}/leave`,
      headers: {
        Authorization: `Bearer ${access}`,
      },
    };

    axios(configu)
      .then(function (response) {
        if (response.status === 200) {
          agoraLeave();
        }
      })
      .catch(async (e) => {
        const response = e.response;
        if (!response) return;
        if (response.status === 401) {
          return await auto_login_continue(leaveRT);
        }
      });
  };

  async function agoraLeave() {
    await client.leave();
    try {
      await channel.leave();
      await useClient_RTM.logout();
    } catch (err) { }
    client.removeAllListeners();
    if (tracks) {
      if (tracks.length === 2) {
        tracks[0].close();
        tracks[1].close();
      } else if (tracks.length === 1) {
        tracks[tracks.length - 1].close();
      }
    }
  }

  function moenEvent() {
    moengageEvent("Leave", "RoundTable", {
      RoundTableID: rt_id,
      Name: single_rt_data?.data?.[0]?.["name"],
      "K Type": single_rt_data?.data?.[0]?.["r_type"],
      "K SubType": single_rt_data?.data?.[0]?.["open_to_all"],
      "Audience Interaction": 0,
    });
  }

  async function leaveChannel(leave = false) {
    try {
      moenEvent();
      leaveRT();
    } catch (err) {
      moenEvent();
      agoraLeave();
    }

    if (leave === true) {
      setShowMVideo(true);
    } else {
      if (isRecording) {
        if (
          typeOfRT === "public" &&
          localStorage.current_user &&
          !localStorage.anonymous_user
        ) {
          return setShowPopup(true);
        }
        dispatch(ExpandRoundtable());
      } else if (single_rt_data?.data?.[0]?.["r_type"] === "RECORDING_BASED") {
        window.location.replace("/roundtable/all");
      }
    }
  }

  useEffect(() => {
    if (showmVideo === true) {
      if (single_rt_data?.data?.[0]?.["outro_url"] !== undefined) {
        setShowIntro(true);
        setVideoUrl(single_rt_data?.data?.[0]?.["outro_url"]);
        setShowLabel("OUTRO");
      } else if (single_rt_data?.data?.[0]?.["outro_url"] === undefined) {
        dispatch(ExpandRoundtable());
      }
    }
  }, [showmVideo, single_rt_data]);

  //Ui starts here
  if (!minimized) {
    return <></>;
  }

  return (
    <>
      <Grid
        container
        style={{
          width: "500px",
          position: "fixed",
          ...position,
          zIndex: "213210949091",
          cursor: "move",
        }}
        ref={minimizedRef}
        className="mobi_fix"
      >
        <TopUi
          leaveChannel={leaveChannel}
          ref={topUiRef}
          showIntro={showIntro}
          setShowIntro={setShowIntro}
          showLabel={showLabel}
          setShowLabel={setShowLabel}
          videoUrl={videoUrl}
          setVideoUrl={setVideoUrl}
          single_rt_data={single_rt_data}
          time={time}
          start={moment(new Date(single_rt_data?.data?.[0]?.["start"])).local()}
        />
        <BottomUi
          leaveChannel={leaveChannel}
          setTime={setTime}
          ref={bottomUiRef}
        />
      </Grid>
      <WildcardConfirmation
        open={wildcardReq}
        discard={discard}
        confirm={confirm}
      />
      <SimpleModalComponent
        openPopup={showPopup}
        setOpenPopup={setShowPopup}
        leaveChannel={leaveChannel}
        rtId={rt_id}
        isMinimized
      />
    </>
  );
}
