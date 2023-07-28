/* eslint-disable default-case */
import { CircularProgress, Grid, Typography } from "@mui/material";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allWords } from "../../App";
import RTHeader from "../../components/RTHeader";
import {
  IS_ANDROID_OR_IOS,
  POST_API_BASE_URL,
  REACT_APP_BASE_URL_FOR_USER,
} from "../../constants/env";
import { blockUser } from "./apicalls";
import Controls from "./Controls";
import {
  channelName,
  config,
  fullname,
  moderator,
  MORE_THAN_TWO_SPEAKERS,
  ONE_SPEAKERS,
  role,
  rt_id,
  rt_name,
  rt_type,
  setRole,
  setSpeakers,
  speakers,
  TWO_SPEAKERS,
  uid,
  useClient,
  useClient_RTM,
} from "./settings";
import Video from "./Video";

import { LiveUsers } from "../../redux/actions/roundtableAction";
import { getRTSingleData } from "../../redux/actions/roundtableAction/single_roundtable";
import { auto_login_continue, moengageEvent } from "../../utils/utils";
import { removeSelfWildcard, removeWildcard, warnUser } from "./apicalls";

import { useLocation, useNavigate } from "react-router-dom";
import CustomizedSnackbars from "../../components/Snackbar.component";
import logger from "../../logger";
import {
  ExpandRoundtable,
  UpdateLiveRTClient,
} from "../../redux/actions/minimizedRoundtable";
import ToastHandler from "../../utils/ToastHandler";
import { MetaTagsGenerator } from "../../utils/MetaTagsGenerator";
import { rtActionData } from "../../redux/actions/roundtableAction/rtAction";
import {
  getLiveRTExtended,
  getLiveRTTimer,
} from "../../redux/reducers/liveRTReducer";
import { isSpeakerAccess } from "../../utils/LiveRtUtils";

export default function VideoCall(props) {
  const [rttime, setRtTime] = useState("");

  //states received when roundtable was expanded
  const { state: expandedState } = useLocation();
  const expandedAgoraData = useSelector((state) => state.minimizedData.data);
  const minimized = useSelector((state) => state.minimizedData.minimized);
  const rtAction = useSelector((state) => state.rtActionRed.data);
  const minimizedRef = useRef();

  minimizedRef.current = minimized;
  const client = expandedState?.expanded
    ? expandedAgoraData?.client
    : useClient;
  const [initiated, setInitiated] = useState(false);
  let current_user = null;
  let rtm_token = null;
  let stage_uids = [];

  stage_uids = stage_uids?.map((item) => {
    return item.username;
  });
  stage_uids.push(moderator?.username);

  let speakers_uids = [];
  speakers_uids = speakers?.map((item) => {
    return item.username;
  });

  try {
    current_user = JSON.parse(
      localStorage.current_user || localStorage.anonymous_user
    );

    rtm_token = JSON.parse(localStorage.rtm_token).rmttokens;
  } catch (err) {
    window.location.replace("/");
  }
  const { setInCall, end_time, start_time } = props;

  const [endtime_local, setLocalET] = useState(end_time);
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  const [audio_status, setAudioStatus] = useState(
    expandedState?.expanded ? expandedAgoraData?.tracks?.[0]?.enabled : true
  );
  const [video_status, setVideoStatus] = useState(
    expandedState?.expanded ? expandedAgoraData?.tracks?.[1]?.enabled : true
  );
  const [time_up, setTimeup] = useState(false);
  const [live_count, setLiveCount] = useState(0);
  const [show_viewers, setShowViewers] = useState(true);
  const [rtm_channel, setRTMChannel] = useState(null);
  const [all_members, setAllMembers] = useState([]);
  // const [wildcards, setWildcards] = useState([]);
  const [local_role, setLocalRole] = useState(role);

  const [wc_openDialog, setWCOpenDialog] = useState(false);
  const [ready, setReady] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [permissionError, setPermissionError] = useState({
    error: false,
    msg: "",
  });

  const [post_id_list, setPostIdList] = useState([]);
  //local state to handle initial role joiner
  const [gotSpeakers, setGotSpeakers] = useState(false);

  // local states from video.js starts here
  const [wc_uids, setWCUids] = useState([]);
  const [viewers, setViewers] = useState([]);

  const [mod_pan_list, setModPanList] = useState([]);

  // Mute Audience

  const [mute_msg, setMuteMsg] = useState(null);
  const [mute_id, setMuteId] = useState([]);
  const [mute_username, setMuteUsername] = useState([]);
  const [mute_interaction, setMuteInteraction] = useState([]);
  const [shareProgress, setShareProgress] = useState(false);
  const [leaveflg, setLeaveFlg] = useState(false);
  const [introDisable, setIntroDisable] = useState(false);

  // Wildcard Panelist

  const [localConsent, setConsent] = useState([]);
  const consent = useSelector((state) => state.roundtable.consent);

  const [open, setOpen] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");

  //states for controlling volume of all speakers
  const [volume, setVolume] = useState(
    expandedState?.expanded ? expandedAgoraData?.volume : 100
  );

  const volumeRef = useRef();
  volumeRef.current = volume;

  // local states from video.js ends here

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const single_rt_data = useSelector((state) => state.single_rt.data);

  const [moderatorHasJoined, setModeratorHasJoined] = useState(false);

  const moderatorHasJoinedRef = useRef();
  moderatorHasJoinedRef.current = moderatorHasJoined;

  const usersRef = useRef();
  usersRef.current = users;

  const tracksRef = useRef();
  tracksRef.current = tracks;

  const muteUserRef = useRef();
  muteUserRef.current = mute_username;

  const muteIdRef = useRef();
  muteIdRef.current = mute_id;

  const interactionDataref = useRef();
  interactionDataref.current = mute_interaction;

  useEffect(() => {
    if (shareProgress) {
      if (rtAction && rtAction?.data?.status == 200) {
        setShareProgress(false);
        setRedirectUrl(rtAction?.data?.data?.[0]?.url);
      }
    }
    if (leaveflg) {
      if (rtAction && rtActionData?.data?.status === 200) {
        agoraLeave();
      }
    }
  }, [rtAction]);

  const callDeepLink = async () => {
    dispatch(rtActionData({ rt_id: rt_id, action: "SHARE" }));
    setShareProgress(true);
  };

  useEffect(() => {
    if (IS_ANDROID_OR_IOS && redirectUrl === "") {
      callDeepLink();
    }
  }, []);

  const channelMessageEvents = async (message) => {
    if (minimizedRef.current) return;
    const data = message.text.split("||");
    if (data[0] === "rt_mute_post") {
      if (data[1] === client.uid) {
        ToastHandler("info", "You are muted by Moderator.");
      }
      setMuteUsername([...muteUserRef.current]);
      setMuteId([...muteIdRef.current, data[1]]);
      setMuteMsg(data[2]);
    } else if (data[0] === "rt_unmute_post") {
      if (data[1] === client.uid) {
        ToastHandler("info", "You are unmuted by Moderator.");
      }
      let temp = [...muteUserRef.current];
      temp = temp.filter((elem) => data[1] !== elem?.username);
      setMuteUsername(temp);
      let temp_id = [...muteIdRef.current];
      temp_id = temp_id.filter((elem) => data[1] !== elem);
      setMuteId(temp_id);
      setMuteMsg(data[2]);
    }

    if (data[0] === `wcautodismiss`) {
      if (
        role === "admin-moderator" ||
        role === "admin-panellist" ||
        role === "moderator"
      ) {
        ToastHandler("info", "Not taken any action by wildcard.");
      }
    }
    if (data[0] === `accwildcard`) {
      if (role === "admin-moderator" || role === "moderator") {
        // ToastHandler(
        //   "info",
        //   "Wildcard accepted."
        // );
        // handleListChange("add", data[1]);
      }
      // handleListChange("add", data[1]);
      // setWildcards((prev) => {
      //   let structure = {
      //     name: user_uid,
      //     username: user_uid,end
      //     email: user_uid,
      //     user_id: user_uid,
      //     is_wildcard: true,
      //     warn: false,
      //     mute: false,
      //     block: false,
      //   };
      //   return [...prev, structure];
      // });
    }
    if (data[0] === `rejwildcard`) {
      if (role === "admin-moderator" || role === "moderator") {
        ToastHandler("info", "@" + data[1] + " " + "wildcard rejected");
      }
    }

    if (data[0] === `ownerendrt`) {
      ToastHandler("info", "This RoundTable has been ended by Owner.");
      leaveChannel(true);
    }

    if (data[0] === "block") {
      if (data[1] === current_user.username) {
        handleListChange("remove", data[1]); //wildcard list handling
        blockUser(rt_id, leaveChannel);
      }
    } else if (data[0] === "accepted") {
      handleListChange("add", data[1]);
      if (data[1] === current_user.username) {
        setLocalRole("host");
        setRole("host");
        await client.setClientRole("host");
        if (rt_type === "AUDIO_STREAMING") {
          if (tracksRef.current[0]) await tracksRef.current[0].setEnabled(true);
          if (tracksRef.current[1])
            await tracksRef.current[1].setEnabled(false);
        } else if (rt_type === "VIDEO_STREAMING") {
          if (tracksRef.current[0]) await tracksRef.current[0].setEnabled(true);
          if (tracksRef.current[1]) await tracksRef.current[1].setEnabled(true);
        }
        if (tracksRef.current.length !== 0) {
          await client.unpublish();
          handleTrackPublish("publish");
        } else {
          try {
            const temp = await AgoraRTC.createMicrophoneAndCameraTracks(
              {},
              { encoderConfig: { frameRate: 30, height: 720, width: 1280 } }
            );

            await client.unpublish();
            setTracks((prev) => {
              if (prev) {
                prev?.[0]?.setEnabled(false);
                prev?.[1]?.setEnabled(false);
              }
              return temp;
            });

            setReady(true);
          } catch (e) {
            // alert(
            //   "For the best experience of RoundTable, please give Khul Ke access to your camera & microphone."
            // );
            ToastHandler(
              "info",
              "For the best experience of RoundTable, please give Khul Ke access to your camera & microphone."
            );
            return;
          }
        }

        setUsers((prev) => {
          return [...prev];
        });
      }
    } else if (data[0] === "rejected") {
      //THIS IS WIP
      handleListChange("remove", data[1]);

      if (data[1] === current_user.username) {
        // setWildcards((prevUsers) => {
        //   return prevUsers.filter((User) => User.uid !== data[1]);
        // });
        try {
          if (tracksRef.current[0])
            await tracksRef.current[0].setEnabled(false);
          if (tracksRef.current[1])
            await tracksRef.current[1].setEnabled(false);
        } catch (err) {}
        await client.unpublish();
        try {
          await client.setClientRole("audience");
        } catch (err) {}
        setLocalRole("audience");
        setUsers((prev) => {
          return [...prev];
        });
      }
    }
  };

  const ChannelMemberCountUpdatedEvent = (memberCount) => {
    if (minimizedRef.current) return;
    rtm_channel.getMembers().then((memberNames) => {
      setAllMembers(memberNames);
      //TODO: Get owner details from all pages and decrement count by one if owner is not a part of the panel
      let show_count = 0;
      let difference = memberNames.filter(
        (x) => !stage_uids.includes(x) && !speakers_uids.includes(x)
      );

      show_count = difference.length; //Changed as requested by client
      setLiveCount(memberCount); //show_count);
    });
  };

  const getRTMToken = async () => {
    var configuration = {
      method: "get",
      url: `${REACT_APP_BASE_URL_FOR_USER}/${
        localStorage.anonymous_user
          ? "anonymous/agora-token"
          : "agora_rtm_token"
      }`,
      headers: {
        Authorization: `Bearer ${
          localStorage.access || JSON.parse(localStorage.anonymous_user).token
        }`,
      },
    };
    await axios(configuration)
      .then(async function (response) {
        if (response.status === 200) {
          localStorage.setItem("rtm_token", JSON.stringify(response.data));
        } else {
          getRTMToken();
        }
      })
      .catch(async function (error) {
        const response = error.response;
        if (!response)
          return localStorage.setItem("rtm_token", "error getting rtm token");
        if (response.status === 401) {
          return await auto_login_continue(getRTMToken);
        }
        localStorage.setItem("rtm_token", "error getting rtm token");
      });
  };

  async function handleTrackPublish(action) {
    if (minimized) return;

    let timeElapsed =
      (new Date().getTime() - new Date(start_time)?.getTime()) / 60000;

    console.log(
      action,
      timeElapsed,
      moderatorHasJoinedRef.current,
      "yeh call bhi hua ======",
      rt_type,
      isSpeakerAccess(role)
    );
    if (rt_type === "AUDIO_STREAMING") {
      if (action === "publish") {
        await client.setClientRole("host");
        if (
          (timeElapsed > 0 && moderatorHasJoinedRef.current) ||
          isSpeakerAccess(role)
        ) {
          await tracksRef.current[0].setEnabled(true);
          if (tracksRef.current[1].enabled) {
            await tracksRef.current[1].setEnabled(false);
          }

          if (tracksRef.current[0].enabled) {
            try {
              await client.publish(tracksRef.current[0]);
            } catch (error) {
              logger.error(error);
            }
          }
        }
        setAudioStatus(true);
      } else {
        await tracksRef.current[0].setEnabled(false);
        await client.unpublish(tracksRef.current[0]);
      }
    } else if (rt_type === "VIDEO_STREAMING") {
      if (action === "publish") {
        await client.setClientRole("host");
        if (
          (timeElapsed > 0 && moderatorHasJoinedRef.current) ||
          isSpeakerAccess(role)
        ) {
          await tracksRef.current[0].setEnabled(true);
          await tracksRef.current[1].setEnabled(true);
          if (tracksRef.current[0].enabled && tracksRef.current[1].enabled) {
            try {
              await client.publish([
                tracksRef.current[0],
                tracksRef.current[1],
              ]);
            } catch (error) {
              logger.error(error);
            }
          }
        }
        setAudioStatus(true);
        setVideoStatus(true);
      } else {
        await tracksRef.current[0].setEnabled(false);
        await tracksRef.current[1].setEnabled(false);
        await client.unpublish(tracksRef.current[0], tracksRef.current[1]);
      }
    }

    if (timeElapsed < 0 || !moderatorHasJoinedRef.current) {
      await tracksRef.current[0].setEnabled(false);
      await tracksRef.current[1].setEnabled(false);
      setAudioStatus(false);
      setVideoStatus(false);
    }
  }

  async function handleUserAddEvents(user) {
    setUsers((prevUsers) => {
      if (!prevUsers.includes(user)) {
        return [...prevUsers, user];
      } else {
        return [...prevUsers];
      }
    });
  }

  useEffect(() => {
    if (!localStorage.join_rt) {
      return navigate("/roundtable/all", { replace: true });
    }
    dispatch(
      getRTSingleData({
        rt_id,
        token:
          localStorage.getItem("access") ||
          JSON.parse(localStorage.anonymous_user).token,
      })
    );
  }, []);

  useEffect(() => {
    if (!single_rt_data || !single_rt_data.data) return;
    let data = single_rt_data.data[0];

    if (!data) return;

    let rt_join = JSON.parse(localStorage.getItem("join_rt"));
    rt_join = { ...rt_join, speakers: data.speakers, end: data.end };

    setLocalET(data.end);

    data.speakers.map((elem) => {
      if (elem.username === rt_join.uid && elem.type === "WILDCARD") {
        rt_join = { ...rt_join, role: "host" };
        setRole("host");
        setLocalRole("host");
      }
      return elem;
    });

    const isSpeaker =
      data.speakers.find((elem) => elem.username === rt_join.uid) ||
      rt_join.moderator.username === rt_join.uid;

    if (!isSpeaker && !wc_uids.includes(rt_join.uid)) {
      setRole(rt_join.role === "admin" ? "admin" : "audience");
      setLocalRole(rt_join.role === "admin" ? "admin" : "audience");
    }

    localStorage.setItem("join_rt", JSON.stringify(rt_join));

    setSpeakers(data.speakers);
    setWCUids(
      data.speakers
        .filter((elem) => elem.type === "WILDCARD")
        ?.map((elem) => elem.username)
    );

    setGotSpeakers(true);

    let temp_mute_array = [];
    let temp_mute = [];
    data?.mute_array?.map((item) => temp_mute_array.push(item.username));
    data?.mute_array?.map((item) =>
      item?.username !== undefined ? temp_mute.push(item) : ""
    );
    setMuteId(temp_mute_array);
    setMuteUsername(temp_mute);
  }, [single_rt_data]);

  useEffect(() => {
    if (!all_members) return;

    dispatch(LiveUsers(all_members));
  }, [all_members]);

  useEffect(() => {
    if (!gotSpeakers) return;
    let init = async (name) => {
      client.on("user-published", async (user, mediaType) => {
        if (minimizedRef.current) return;
        try {
          if (
            user.uid === client.uid ||
            user.uid.split("-")[0] === client.uid
          ) {
            return;
          }
          await client.subscribe(user, mediaType);
        } catch (e) {
          console.error(
            "occured in videocall while subsribing to upcoming stream",
            { error: e, message: e.message, user, mediaType }
          );
        }
        if (mediaType === "video") {
          handleUserAddEvents(user);
        }
        if (mediaType === "audio") {
          user.audioTrack?.setVolume(volumeRef.current);
          user.audioTrack?.play();
          handleUserAddEvents(user);
        }
      });

      client.on("user-left", (user) => {
        if (minimizedRef.current) return;
        // setWildcards((prev) => {
        //   return [
        //     ...new Set(
        //       [...prev].filter((speaker) => {
        //         if (speaker.username !== user.uid) {
        //           return speaker;
        //         }
        //       })
        //     ),
        //   ];
        // });

        let temp = [...usersRef.current];

        let newUsers = temp.filter((User) => User.uid !== user.uid);

        setUsers(newUsers);
      });

      client.on("user-info-updated", (user) => {
        if (minimizedRef.current) return;
        try {
          document.querySelector(`#${user}`).style.boxShadow =
            "0px 0px 0px white";
        } catch (err) {}

        setUsers((prevUsers) => {
          return [...prevUsers];
        });
      });

      client.on("user-joined", (user) => {
        if (minimizedRef.current) return;

        // let wildcard_user_joined = speakers.find((elem) => {
        //   return elem.username === user.uid && elem.type === "WILDCARD";
        // });

        handleUserAddEvents(user);

        // if (!wildcard_user_joined) return;

        // let structure = {
        //   name: user.uid,
        //   username: user.uid,
        //   email: user.uid,
        //   user_id: user.uid,
        //   is_wildcard: true,
        //   warn: false,
        //   mute: false,
        //   block: false,
        // };

        // setWildcards((prev) => [...prev, structure]);
      });

      client.enableAudioVolumeIndicator();

      if (expandedState?.expanded) return setStart(true);

      try {
        await client.join(config.appId, name, config.token, uid);
        await client.setClientRole(
          local_role !== "audience" && local_role !== "admin"
            ? "host"
            : "audience",
          (e) => {
            if (!e) {
            } else {
            }
          }
        );
      } catch (error) {
        logger.error("error 2 occured", { error });
      }
      if (
        tracks?.length &&
        ready &&
        local_role !== "audience" &&
        local_role !== "admin"
      ) {
        handleTrackPublish("publish");
      }

      setStart(true);

      await getRTMToken();
      logger.info(
        "trying to login using this rmttokens",
        JSON.parse(localStorage.rtm_token)["rmttokens"],
        "and this UID",
        uid,
        channelName
      );

      useClient_RTM
        .login({
          token: JSON.parse(localStorage.rtm_token)["rmttokens"],
          uid: uid,
        })
        .then(() => {
          let channel = useClient_RTM.createChannel(channelName);
          channel.join().then(() => {
            setRTMChannel(channel);
          });
        })
        .catch((e) => {
          logger.error("Error occured while logging in to agora rtm channel ", {
            e,
            message: e.message,
          });
        });
      setInitiated(true);
    };

    try {
      if (
        (role === "audience" ||
          role === "admin" ||
          (ready &&
            tracks?.length &&
            role !== "audience" &&
            role !== "admin")) &&
        !initiated
      ) {
        init(channelName);
      }
    } catch (error) {}
  }, [channelName, client, ready, tracks, role, local_role, gotSpeakers]);

  useEffect(() => {
    if (!useClient) return;

    dispatch(UpdateLiveRTClient({ client: useClient }));
  });

  useEffect(() => {
    dispatch(
      UpdateLiveRTClient({
        panelist: mod_pan_list.filter((item) => {
          return item.username !== moderator.username;
        }),
      })
    );
  }, [mod_pan_list]);

  useEffect(() => {
    dispatch(UpdateLiveRTClient({ wc_uids }));
  }, [wc_uids]);

  useEffect(() => {
    if (!useClient_RTM) return;

    //connection broke with rtm

    //possible new connection states
    const ABORTED = "ABORTED";
    const DISCONNECTED = "DISCONNECTED";
    const RECONNECTING = "RECONNECTING";

    //possible reasons for state change
    const BANNED_BY_SERVER = "BANNED_BY_SERVER";
    const INTERRUPTED = "INTERRUPTED";
    const LOGIN_FAILURE = "LOGIN_FAILURE";
    const LOGIN_TIMEOUT = "LOGIN_TIMEOUT";
    const REMOTE_LOGIN = "REMOTE_LOGIN";
    const TOKEN_EXPIRED = "TOKEN_EXPIRED";

    //For more newState and reason values please check agora documentation https://docs.agora.io/en/Real-time-Messaging/API%20Reference/RTM_web/v1.5.0/interfaces/rtmevents.rtmclientevents.html#connectionstatechanged

    const connectionStateChangedEvent = (newState, reason) => {
      if (
        newState !== ABORTED &&
        newState !== DISCONNECTED &&
        newState !== RECONNECTING
      )
        return;

      if (newState === RECONNECTING && reason === INTERRUPTED) {
        setTimeout(() => {
          if (useClient_RTM.connectionState === RECONNECTING) {
            // alert(
            //   "Could not establish connection with RTM. Please check your network"
            // );
            ToastHandler(
              "info",
              "Could not establish connection with RTM. Please check your network."
            );
            return leaveChannel(false);
          }
        }, 60000);
        return;
      }

      switch (reason) {
        case BANNED_BY_SERVER:
          ToastHandler("warn", "You have been banned by RTM server");
          leaveChannel();
          break;
        case INTERRUPTED:
          ToastHandler(
            "warn",
            "Could not establish connection with RTM, request interrupted."
          );
          leaveChannel();
          break;
        case LOGIN_FAILURE:
          ToastHandler("warn", "Could not login to RTM channel.");
          leaveChannel();
          break;
        case LOGIN_TIMEOUT:
          ToastHandler("warn", "Login Timedout.");
          leaveChannel();
          break;
        case REMOTE_LOGIN:
          ToastHandler("dan", `${allWords.misc.toastMsg.multipleLoginError}`);
          setTimeout(() => {
            leaveChannel();
          }, 5000);
          break;
        case TOKEN_EXPIRED:
          ToastHandler("dan", `${allWords.misc.toastMsg.sessionExpired}`);
          leaveChannel();
          break;
      }
    };

    useClient_RTM.on("ConnectionStateChanged", connectionStateChangedEvent);

    return () => {
      useClient_RTM.off("ConnectionStateChanged", connectionStateChangedEvent);
    };
  }, [useClient_RTM]);

  useEffect(() => {
    if (!tracks) return;

    dispatch(UpdateLiveRTClient({ tracks }));
  }, [tracks]);

  useEffect(() => {
    if (!useClient_RTM) return;
    dispatch(UpdateLiveRTClient({ useClient_RTM }));
  });

  useEffect(() => {
    if (!rtm_channel) return;

    dispatch(UpdateLiveRTClient({ channel: rtm_channel }));
  }, [rtm_channel]);

  useEffect(() => {
    if (!users) return;

    dispatch(UpdateLiveRTClient({ users }));
  }, [users]);

  useEffect(() => {
    if (!volume) return;
    dispatch(UpdateLiveRTClient({ volume }));
  }, [volume]);

  useEffect(() => {
    if (expandedState?.expanded) return;
    dispatch(ExpandRoundtable());
  }, [expandedState]);

  useEffect(() => {
    if (expandedState?.expanded) return;
    const handleTrackPermission = async () => {
      if (
        local_role &&
        local_role !== "audience" &&
        local_role !== "admin" &&
        !tracks?.length &&
        !ready
      ) {
        try {
          if (minimizedRef.current) return;
          const [microphoneTrack, cameraTrack] =
            await AgoraRTC.createMicrophoneAndCameraTracks(
              {},
              { encoderConfig: { frameRate: 30, height: 720, width: 1280 } }
            );

          setReady(true);
          setTracks((prev) => {
            if (prev) {
              prev?.[0]?.setEnabled(false);
              prev?.[1]?.setEnabled(false);
            }
            return [microphoneTrack, cameraTrack];
          });
        } catch (e) {
          if ((e.code = "PERMISION_DENIED")) {
            setPermissionError({
              error: true,
              msg: "For the best experience of RoundTable, please give Khul Ke access to your camera & microphone.",
            });
          } else if (e.code === "NOT_READABLE") {
            setPermissionError({
              error: true,
              msg: allWords.misc.pages.camerataken,
            });
          }
        }
      }
    };
    handleTrackPermission();
  }, [local_role]);

  async function handleListChange(action, user_uid) {
    try {
      if (action === "add") {
        // setWildcards((prev) => {
        //   let structure = {
        //     name: user_uid,
        //     username: user_uid,
        //     email: user_uid,
        //     user_id: user_uid,
        //     is_wildcard: true,
        //     warn: false,
        //     mute: false,
        //     block: false,
        //   };
        //   if (!prev.find((elem) => elem.username === user_uid))
        //     return [...prev, structure];
        //   return prev;
        //});
      } else if (action === "remove") {
        // setWildcards((prev) => {
        //   return [
        //     ...new Set(
        //       [...prev].filter((speaker) => {
        //         return speaker.username !== user_uid;
        //       })
        //     ),
        //   ];
        // });
        setSpeakers(speakers.filter((elem) => elem.username !== user_uid));
        setUsers((prev) => prev.filter((elem) => elem.uid !== user_uid));
      }
    } catch (err) {}
  }

  const leaveRT = async () => {
    dispatch(rtActionData({ rt_id: rt_id, action: "LEAVE" }));
    setLeaveFlg(true);
  };

  async function agoraLeave() {
    await client.leave();
    try {
      await rtm_channel.leave();
      await useClient_RTM.logout();
    } catch (err) {}
    client.removeAllListeners();
    if (tracks) {
      if (tracks.length === 2) {
        tracksRef.current[0].close();
        tracksRef.current[1].close();
      } else if (tracks.length === 1) {
        tracksRef.current[tracks.length - 1].close();
      } else {
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

  const [showIntro, setShowIntro] = useState(false);
  const [showLabel, setShowLabel] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [showVideo, setShowVideo] = useState(false);

  // exit fullScreen function
  function closeFullscreen() {
    // if (window.innerHeight == window.screen.height) {
    //   if (document.exitFullscreen) {
    //     document.exitFullscreen();
    //   } else if (document.webkitExitFullscreen) {
    //     /* Safari */
    //     document.webkitExitFullscreen();
    //   } else if (document.msExitFullscreen) {
    //     /* IE11 */
    //     document.msExitFullscreen();
    //   }
    // }

    dispatch({ type: "notFull" });

    // to fix black screen issue on toggle of fullscreen
    if (document) {
      document?.exitFullscreen();
      /* Safari */
      document?.webkitExitFullscreen();
      /* IE11 */
      document?.msExitFullscreen();
    }
  }

  async function leaveChannel(leave = false, reason = "") {
    try {
      moenEvent();
      await leaveRT();
    } catch (err) {
      moenEvent();
      await agoraLeave();
    }

    // window.Moengage?.track_event("Leave RoundTable", {
    //   username: JSON.parse(localStorage.current_user || localStorage.anonymous_user).username,
    //   userid: JSON.parse(localStorage.current_user || localStorage.anonymous_user)._id,
    //   rt_id: JSON.parse(localStorage.getItem("join_rt")).rt_id,
    //   Status: "success",
    // });

    if (leave === true) {
      setShowVideo(true);
    } else {
      window.location.replace("/roundtable/all");
      if (fullScrc) {
        closeFullscreen();
      }
      setStart(false);
      setInCall(false);
    }
  }

  useEffect(() => {
    if (showVideo === true) {
      if (single_rt_data?.data?.[0]?.["outro_url"] !== undefined) {
        setShowIntro(true);
        setVideoUrl(single_rt_data?.data?.[0]?.["outro_url"]);
        setShowLabel("OUTRO");
      } else if (single_rt_data?.data?.[0]?.["outro_url"] === undefined) {
        window.location.replace("/roundtable/all");
        if (fullScrc) {
          closeFullscreen();
        }
        setStart(false);
        setInCall(false);
      }
    }
  }, [showVideo, single_rt_data]);

  // window.addEventListener("unload", (ev) => {
  //   ev.preventDefault();
  //   try {
  //     leaveChannel();
  //   } catch (err) {}
  // });

  useEffect(() => {
    if (time_up) {
      ToastHandler("info", "RoundTable Ended.");
      leaveChannel(true);
    }
  }, [time_up]);

  // Functions from video.js starts here
  //TODO: Merge with showSymbols
  // function showWCSymbols(action, peer) {
  //   if (action === "warn123") {
  //     setWildcards((prev) => {
  //       let target_index = prev.findIndex((person) => person.username === peer);
  //       if (target_index !== -1) {
  //         let was_warned = true; //!temp_mpl[target_index].warn; //true
  //         prev[target_index].warn = was_warned;
  //         return [...prev];
  //       }
  //     });
  //   }
  // }

  function showSymbols(action, peer) {
    //TODO: Take list and setter function as params

    const temp_mpl = [...mod_pan_list];
    const target_index = temp_mpl.findIndex(
      (person) => person.username === peer
    );
    if (action === "warn123") {
      if (target_index !== -1) {
        temp_mpl[target_index].warn = true;
        setModPanList(temp_mpl);
      }
      if (
        peer ===
        JSON.parse(localStorage.current_user || localStorage.anonymous_user)[
          "username"
        ]
      ) {
        warnUser(rt_id);
      }
    } else if (action === "block") {
      if (target_index !== -1) {
        temp_mpl[target_index].block = true;
        setModPanList(temp_mpl);
      }
    }
  }

  const moderatorActions = async (action, peerId, type) => {
    rtm_channel
      .sendMessage({
        text: action + "||" + peerId,
      })
      .then(async () => {
        if (action === "rejected") {
          setWCUids((prev) => prev.filter((elem) => elem !== peerId));
        }

        if (action === "accepted") {
          setWCUids((prev) => [...prev, peerId]);
          logger.info("wc_uids updated accepted");
        }

        if (!role.includes("moderator")) {
          // setWildcards((prevUsers) => {
          //   return prevUsers?.filter((User) => User.uid !== peerId);
          // });
          setViewers((prevViewers) => {
            let temp = users.map((elem) => elem.uid);
            if (!prevViewers.includes(peerId) && temp.includes(peerId)) {
              return [...prevViewers, peerId];
            } else {
              return prevViewers;
            }
          });
          if (rt_type === "AUDIO_STREAMING" && peerId === uid) {
            client.unpublish(tracksRef.current[0]);
          } else if (rt_type === "VIDEO_STREAMING" && peerId === uid) {
            await client.unpublish(tracksRef.current[0], tracksRef.current[1]);
          }
          try {
            if (peerId === uid) {
              if (tracksRef.current[0])
                await tracksRef.current[0].setEnabled(false);
              if (tracksRef.current[1])
                await tracksRef.current[1].setEnabled(false);

              setTracks((prev) => {
                if (prev) {
                  prev[0]?.setEnabled(false);
                  prev[1]?.setEnabled(false);
                }
                return [];
              });
            }
          } catch (err) {}
          // if moderator action is rejected
          if (action === "rejected") {
            // if wildcard is remove himself
            if (local_role === "host" || local_role === "panellist") {
              try {
                await client.unpublish(tracks);
                setLocalRole("audience");
                await client.setClientRole("audience");
              } catch (err) {
                logger.error("error 3 occured");
              }
            }
            setTracks((prev) => {
              if (prev) {
                prev?.[0]?.setEnabled(false);
                prev?.[1]?.setEnabled(false);
              }
              return [];
            });

            setReady(false);
          }
          //
          setUsers((prev) => {
            return [...prev];
          });
        }
        // if (type) {
        //   showWCSymbols(action, peerId);
        // } else {
        //   showSymbols(action, peerId);
        // }
      })
      .catch((err) => {});
  };

  async function handle_wildcard_removal(user_uid) {
    moderatorActions("rejected", user_uid, true);
    // let remove_wc = [...wildcards].filter((item) => {
    //   return item.username !== user_uid;
    // });
    handleListChange("remove", user_uid);
    setViewers((prevViewers) => {
      let temp = users.map((elem) => elem.uid);
      if (prevViewers.includes(user_uid) || !temp.includes(user_uid))
        return prevViewers;

      return [...prevViewers, user_uid];
    });

    // setWildcards(remove_wc);

    if (role.includes("moderator")) {
      removeWildcard(rt_id, user_uid);
    } else {
      removeSelfWildcard(rt_id);
      if (tracks?.[0]) {
        await tracksRef.current[0]?.setEnabled(false);
        await client.unpublish(tracksRef.current[0]);
      }
      if (tracks?.[1]) {
        await tracksRef.current[1]?.setEnabled(false);
        await client.unpublish(tracksRef.current[1]);
      }
      await client.setClientRole("audience");
      setTracks((prev) => {
        if (prev) {
          prev[0]?.setEnabled(false);
          prev[1]?.setEnabled(false);
        }
        return [];
      });
    }
  }
  // Functions from video.js ends here

  const muteUser = (action, u_id, username) => {
    var FormData = require("form-data");
    var data = new FormData();
    data.append("user_id", username);

    let config = {
      method: "put",
      url: `${POST_API_BASE_URL}/round-table/${action}/${rt_id}`,
      headers: {
        "device-type": "android",
        "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        if (response.data.code === 200) {
          if (response?.data?.data?.status === false) {
            rtm_channel?.sendMessage({
              text: `rt_unmute_post||${username}||${u_id}`,
            });
            setMuteUsername((prevState) => {
              return prevState.filter((item) => item?.user_id !== u_id);
            });

            setMuteId((prevState) => {
              return prevState.filter((item) => item !== username);
            });
            setMuteMsg(u_id);
          } else {
            rtm_channel?.sendMessage({
              text: `rt_mute_post||${username}||${u_id}`,
            });
            setMuteUsername((prevState) => {
              return [...prevState, { username: username, user_id: u_id }];
            });
            setMuteId((prevState) => {
              return [...prevState, username];
            });
            setMuteMsg(u_id);
          }

          dispatch(
            getRTSingleData({
              rt_id,
              token:
                localStorage.getItem("access") ||
                JSON.parse(localStorage.anonymous_user).token,
            })
          );
        }
      })
      .catch();
  };
  //for moderator
  // recieving rejected message - remove recieved user id

  // //for self wildcard

  // reieving accepted message- add recieved user id
  // recieving rejected message - remove recieved user id

  // //for others
  // reieving accepted message- add recieved user id
  // recieving rejected message - remove recieved user id

  //handlewildcard add remove events
  const HandleWcUidUpdates = (message) => {
    const data = message.text.split("||");

    if (data[0] === "rejected") {
      setWCUids((prev) => prev.filter((elem) => elem !== data[1]));
      logger.info("wc_uids updated rejected");
    }

    if (data[0] === "accepted") {
      setWCUids((prev) => [...prev, data[1]]);
      logger.info("wc_uids updated accepted");
    }
  };

  // Handle Mute Unmute Audience
  // useEffect(() => {
  //   rtm_channel?.on("ChannelMessage", channelMessageEventsMuteUnmute);
  // }, [rtm_channel]);

  useEffect(() => {
    if (!expandedState?.expanded || !expandedAgoraData) return;
    setTracks(expandedAgoraData?.tracks);
    setUsers(expandedAgoraData?.allUsers);
    if (!rtm_channel) return setRTMChannel(expandedAgoraData.channel);
    setReady(true);
  }, [expandedAgoraData, expandedState, rtm_channel]);

  useEffect(() => {
    if (!rtm_channel) return;

    rtm_channel.on("ChannelMessage", channelMessageEvents);
    rtm_channel.on("ChannelMessage", HandleWcUidUpdates);
    rtm_channel.on("MemberCountUpdated", ChannelMemberCountUpdatedEvent);
    rtm_channel.getMembers().then((memberNames) => {
      setAllMembers(memberNames);
    });

    return () => {
      if (!rtm_channel) return;
      rtm_channel.off("ChannelMessage", channelMessageEvents);
      rtm_channel.off("MemberCountUpdated", ChannelMemberCountUpdatedEvent);
      rtm_channel.off("ChannelMessage", HandleWcUidUpdates);
    };
  }, [rtm_channel]);

  //useEffect for changing audio playback volume of all speakers
  useEffect(() => {
    if (!users) return;

    users.forEach((elem) => {
      if (!elem.audioTrack) return;

      if (volume || volume === 0) {
        elem.audioTrack.setVolume(volume);
      }
    });
  }, [volume, users]);

  useEffect(() => {
    if (tracks?.[1] && tracks?.[1].enabled) {
      tracks?.[1].setEncoderConfiguration(
        users.length + 1 === 1
          ? ONE_SPEAKERS
          : users.length + 1 === 2
          ? TWO_SPEAKERS
          : MORE_THAN_TWO_SPEAKERS
      );
    }
  }, [tracks?.[1]?.enabled, users]);

  const memoizedVideoContainer = useMemo(() => {
    return (
      <Video
        ready={ready}
        start={start}
        setModeratorHasJoined={setModeratorHasJoined}
        handleTrackPublish={handleTrackPublish}
        rt_id={rt_id}
        tracks={tracks}
        client_uid={uid}
        client_name={fullname}
        client={client}
        rt_type={rt_type}
        role={local_role}
        users={users}
        viewer_count={live_count}
        audio_status={audio_status}
        video_status={video_status}
        rtm_channel={rtm_channel}
        show_viewers={show_viewers}
        all_members={all_members}
        // wildcards={wildcards}
        setWCList={handleListChange}
        // setWildcards={setWildcards}
        setLocalRole={setLocalRole}
        setUsers={setUsers}
        wc_openDialog={wc_openDialog}
        setWCOpenDialog={setWCOpenDialog}
        post_id_list={post_id_list}
        setPostIdList={setPostIdList}
        start_time={start_time}
        wc_uids={wc_uids}
        // setWCUids={setWCUids}
        // showWCSymbols={showWCSymbols}
        showSymbols={showSymbols}
        moderatorActions={moderatorActions}
        handle_wildcard_removal={handle_wildcard_removal}
        viewers={viewers}
        setViewers={setViewers}
        mod_pan_list={mod_pan_list}
        setModPanList={setModPanList}
        muteUser={muteUser}
        mute_msg={mute_msg}
        setMuteMsg={setMuteMsg}
        mute_id={mute_id}
        mute_username={mute_username}
        setMuteUsername={setMuteUsername}
        setMuteInteraction={setMuteInteraction}
        setMuteId={setMuteId}
        localConsent={localConsent}
        setConsent={setConsent}
        consent={consent}
        setReady={setReady}
        setTracks={setTracks}
        rt_name={rt_name}
        setAudioStatus={setAudioStatus}
        setVideoStatus={setVideoStatus}
        volume={volume}
        setVolume={setVolume}
        single_rt_data={single_rt_data}
        rttime={rttime}
        setStart={setStart}
        setInCall={setInCall}
        setTimeup={setTimeup}
        showIntro={showIntro}
        setShowIntro={setShowIntro}
        showLabel={showLabel}
        setShowLabel={setShowLabel}
        videoUrl={videoUrl}
        setVideoUrl={setVideoUrl}
        closeFullscreen={closeFullscreen}
        rtTypeBased={single_rt_data?.data?.[0]?.["r_type"]}
        setIntroDisable={setIntroDisable}
      />
    );
  }, [
    volume,
    setVolume,
    rt_name,
    setAudioStatus,
    setVideoStatus,
    rt_id,
    tracks,
    uid,
    fullname,
    client,
    rt_type,
    local_role,
    users,
    live_count,
    audio_status,
    video_status,
    rtm_channel,
    show_viewers,
    all_members,
    handleListChange,
    setLocalRole,
    setUsers,
    wc_openDialog,
    setWCOpenDialog,
    post_id_list,
    setPostIdList,
    start_time,
    wc_uids,
    showSymbols,
    moderatorActions,
    handle_wildcard_removal,
    viewers,
    setViewers,
    mod_pan_list,
    setModPanList,
    muteUser,
    setMuteMsg,
    mute_msg,
    mute_id,
    mute_username,
    setMuteUsername,
    setMuteInteraction,
    setMuteId,
    localConsent,
    setConsent,
    consent,
    setReady,
    setTracks,
    ready,
    start,
    local_role,
    setModeratorHasJoined,
    handleTrackPublish,
  ]);

  // full Screen--------------------------
  const fullScrc = useSelector((state) => state.fullScreen.full);
  const was_extended = useSelector(getLiveRTExtended);
  const rtTimer = useSelector(getLiveRTTimer);

  const fully = useCallback(() => {
    let elem = document.body;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE11 */
      elem.msRequestFullscreen();
    }
  }, []);

  useEffect(() => {
    if (fullScrc) {
      fully();
    }
  }, [fullScrc, fully]);
  // -----------------------------------------

  // const FURT = useSelector((state) => state.followUnfollowInRT);
  // Following logic-----------------------------------

  async function callFollowingFunc() {
    if (!localStorage.current_user) return;

    let userdata = JSON.parse(
      localStorage.getItem("current_user") || localStorage.anonymous_user
    );
    let config = {
      method: "get",
      url: `${POST_API_BASE_URL}/details-paginate?type=following&skip=0&username=${userdata.username}`,
      headers: {
        "device-type": "android",
        "user-id": userdata._id,
      },
    };
    try {
      let data = await axios(config);
      // setFollowingUn(data.data?.data);
      dispatch({
        type: "following",
        payload: data.data?.data.map((i) => i.username),
      });
    } catch (error) {
      logger.error(error);
      ToastHandler("dan", allWords.misc.somethingwrong);
    }
  }

  useEffect(() => {
    callFollowingFunc();
  }, []);
  // -------------------------------------------------------

  return (
    <>
      {open && (
        <CustomizedSnackbars
          open={open}
          handleClose={() => {
            setOpen(false);
          }}
          redirectUrl={redirectUrl}
        />
      )}
      <div
        style={{ width: "100%" }}
        className="rt-video-call-div"
        id="mainRtCont"
      >
        {single_rt_data?.data?.length && (
          <MetaTagsGenerator
            metaTags={{
              title: `${single_rt_data?.data[0]?.metadata?.og_title}`,
              description: `${single_rt_data?.data[0]?.metadata?.description}`,
              keywords: `${single_rt_data?.data[0]?.metadata?.keywords?.join(
                ""
              )}`,
            }}
          />
        )}
        <RTHeader
          client={client}
          role={local_role}
          rt_name={rt_name}
          leaveChannel={leaveChannel}
          panelChat={local_role !== "audience" ? true : false}
          star={local_role !== "audience" ? true : false}
          endtime={endtime_local}
          viewer_count={live_count}
          setTimeup={setTimeup}
          rtm_channel={rtm_channel}
          show_viewers={show_viewers}
          setShowViewers={setShowViewers}
          post_id_list={post_id_list}
          setPostIdList={setPostIdList}
          start_time={start_time}
          wc_uids={wc_uids}
          handle_wildcard_removal={handle_wildcard_removal}
          mod_pan_list={mod_pan_list}
          mute_msg={mute_msg}
          setMuteMsg={setMuteMsg}
          mute_username={mute_username}
          localConsent={localConsent}
          setConsent={setConsent}
          consent={consent}
          volume={volume}
          setVolume={setVolume}
          setRtTime={setRtTime}
          rt_id={rt_id}
          isRecording={single_rt_data?.data?.[0]?.recording?.[0]?.owner_flag}
          typeOfRT={single_rt_data?.data?.[0]?.open_to_all}
          rtTypeBased={single_rt_data?.data?.[0]?.["r_type"]}
          muteUser={muteUser}
        />

        {/* {time_up && (
          <div className="container-fluid text-center p-5 mt-4">
            <h3 className="text-muted">
              This roundtable has ended! Redirection in progress ...{" "}
            </h3>
            <br />
            <Spinner />
          </div>
        )} */}
        {/* {!time_up && ( */}
        <div
          // className="container-fluid"
          style={{
            position: "relative",
            marginTop:
              fullScrc && !was_extended && rtTimer > "00:05:00"
                ? "67px"
                : "3.5rem",
            // border: "2px solid black"
          }}
        >
          {single_rt_data?.data?.[0]?.["r_type"] !== "RECORDING_BASED" && (
            <>
              {tracks?.length !== 0 && ready && !fullScrc && start && (
                <Controls
                  introDisable={introDisable}
                  tracks={tracks}
                  setStart={setStart}
                  setInCall={setInCall}
                  audio_status={audio_status}
                  video_status={video_status}
                  setAudioStatus={setAudioStatus}
                  setVideoStatus={setVideoStatus}
                  rtm_channel={rtm_channel}
                  show_viewers={show_viewers}
                  role={local_role}
                  current_user={current_user}
                  client={client}
                  start_time={start_time}
                  rt_id={rt_id}
                  setModeratorHasJoined={setModeratorHasJoined}
                  handleTrackPublish={handleTrackPublish}
                  volume={volume}
                  setVolume={setVolume}
                />
              )}
            </>
          )}

          {(start &&
            tracks &&
            local_role !== "audience" &&
            local_role !== "admin" &&
            ready) ||
          ((local_role === "audience" || local_role === "admin") && start) ? (
            memoizedVideoContainer
          ) : (
            <Grid container justifyContent="center">
              {role !== "audience" &&
              (!tracks || !ready) &&
              permissionError.error ? (
                <Typography color="red" textAlign="center">
                  {permissionError.msg}
                </Typography>
              ) : (
                <CircularProgress />
              )}
            </Grid>
          )}
        </div>
        {/* )}  */}
      </div>
    </>
  );
}
