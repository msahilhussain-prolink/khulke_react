import MicOffIcon from "@material-ui/icons/MicOff";
import PersonIcon from "@mui/icons-material/Person";
import React, { useCallback, useEffect, useRef, useState } from "react";
import AudienceVolumeController from "../../components/RTHeader/AudienceVolumeController";
import { REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1 } from "../../constants/env";
import "../../pages/Disclaimer/disclaimer.css";
import {
  blocked_list,
  channelName,
  config,
  moderator,
  rt_id,
  screenClient,
  speakers,
  uid,
  warned_list,
} from "./settings";
import { stopBrowserBack } from "./utils";
// bottom icons
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import cancelPresentBottom from "../../assets/icons/cancelPresentBottom.svg";
import cancleFull from "../../assets/icons/cancleFull.svg";
import fullScreenHeader from "../../assets/icons/fullScreenHeaderWhite.svg";
import micOffBottom from "../../assets/icons/micOffBottom.svg";
import micOnBottom from "../../assets/icons/micOnBottom.svg";
import presentBottom from "../../assets/icons/presentBottom.svg";
import rt_block from "../../assets/icons/rt_block.svg";
import mute_icon from "../../assets/icons/rt_muted.svg";
import warn_icon from "../../assets/icons/warn.svg";
import KhulKeLogoVid from "../../assets/video/khulke-logo.mp4";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import { Badge, Button, IconButton } from "@mui/material";
import AddUserInteraction from "../../components/AddUserInteraction";
import ViewerReply from "../../components/ViewerReply";
import { db } from "../../push_firebase";
import ModeratorContols from "./ModeratorControls";
import NoUsers from "./NoUsers";
import NoVideoNew from "./NoVideoNew";
import "./video.css";
import WildMessage from "./WildMessage";
import WildCardPopup from './Core/WildCardPopup'

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useLocation, useNavigate } from "react-router-dom";
import { allWords } from "../../App";
import ChatMenuIcon from "../../assets/icons/post_menu.svg";
import AgoraVideoPlayer from "../../components/AgoraVideoPlayer/AgoraVideoPlayer";
import PreloginComp from "../../components/PreLoginComp";
import RTPollComponent from "../../components/RTPollComponent";
import RaiseHand from "../../components/ViewerChat/RaiseHand";
import { REACT_APP_BASE_URL_FOR_USER } from "../../constants/env";
import { ConsentData } from "../../redux/actions/roundtableAction";
import { getDisclaimerRTData } from "../../redux/actions/roundtableAction/disclaimerRoundTable";
import ReadMoreReadLess from "../../utils/ReadMoreReadLess";
import ToastHandler from "../../utils/ToastHandler";
import {
  auto_login_continue,
  device_info,
  moengageEvent,
} from "../../utils/utils";
import { TimeImg } from "../PastRT/style";
import { addWildcard } from "./apicalls";
import AllPosts from "./AudienceInteraction/AllPosts";
import WildcardConfirmation from "./ConfirmationDialog/WildcardConfirmation";
import PreRtUI from "./PreRtUI";
import SharedScreen from "./SharedScreen";
import SpeakerNames from "./SpeakerNames";
import Volume from "./Volume";
// Assets
import Viewers from "../../assets/icons/Group 19646.svg";
import FullScreenIcon from "@mui/icons-material/ExpandMore";
import IntroOutroVideo from "../../components/IntroOutroVideo";
import RecordedRTVideo from "../../components/RecordedRTVideo";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";

// Comps
import { globalImages } from "../../assets/imagesPath/images";
import RecommendedRT from "../../components/RecommendedRT";
import RTProfile from "../../components/RTProfile";
import UserProfile from "../../components/UserProfile";
import VipComp from "../../components/VipComp";
import logger from "../../logger";
import ExtendRTNotifications from "./ExtendRTNotifications";
import {
  getLiveRTExtended,
  getLiveRTExtendedTime,
  getLiveRTSelectedWildMsg,
  getLiveRTTimer,
} from "../../redux/reducers/liveRTReducer";
import Controls from "./Controls";
import TimerLoader from "./Core/TimerLoader";
import MiniViewRT from "./Core/MiniViewRT";
import { AspectRatio, ExpandMore } from "@material-ui/icons";
import PastPost from "../PastRT/PastPost";
import BroadCastModalPopup from "./Core/BroadCastModalPopup";
import { getGridStyle, isSpeakerAccess } from "../../utils/LiveRtUtils";
import { ReadMorePropsStyle, ReadMoreStyle, textSpanStyles } from "../../components/CreateEditRoundtable/styles";
import ReadMoreComponent from "../../components/CreateEditRoundtable/ReadMoreComponent";
import WildCardMsgIcon from "../../assets/icons/comp/WildCardMsgIcon";

export default function Video(props) {
  const {
    ready,
    start,
    setModeratorHasJoined,
    handleTrackPublish,
    client_uid,
    role,
    rt_type,
    users,
    tracks,
    audio_status,
    video_status,
    client,
    rtm_channel,
    show_viewers,
    viewer_count,
    all_members,
    //wildcards,
    setWCList,
    wc_openDialog,
    setWCOpenDialog,
    post_id_list,
    setPostIdList,
    start_time,
    setTracks,
    setReady,
    wc_uids,
    showSymbols,
    moderatorActions,
    handle_wildcard_removal,
    viewers,
    setViewers,
    mod_pan_list,
    setModPanList,
    wildcard_status,
    setWildcardStatus,
    accepted_cards,
    setAccepted,
    muteUser,
    setMuteMsg,
    mute_msg,
    mute_id,
    setMuteUsername,
    setMuteInteraction,
    setMuteId,
    localConsent,
    setConsent,
    consent,
    setAudioStatus,
    setVideoStatus,
    rt_name,
    volume,
    setVolume,
    single_rt_data,
    rttime,
    showIntro,
    setShowIntro,
    showLabel,
    setShowLabel,
    videoUrl,
    setVideoUrl,
    setStart,
    setInCall,
    closeFullscreen,
    rtTypeBased,
    setIntroDisable,
  } = props;

  const bottomRef = useRef();
  const [stage_uids, setStageUids] = useState([]);
  const [show_self, setShowSelf] = useState(true);
  const [interactionData, setInteractionData] = useState([]);
  const [interactionDataOldLength, setOldInteractionData] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  // const [screenSharing, setScreenSharing] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disableInteraction, setDisableInteraction] = useState(true);

  const [logoCount, setLogoCount] = useState(0);
  const [logoUrl, setLogoUrl] = useState([]);
  const [introStart, setIntroStart] = useState(0);
  const [endDur, setEndDur] = useState(15);

  const vRef = useRef(null);

  //reply popup closes fix
  const [chatReply, setChatReply] = useState(false);
  const [replyingId, setReplyingId] = useState();

  // Poll State
  const [day_duration, setDayDuration] = useState("");
  const [hour_duration, setHourDuration] = useState("");
  const [total, setTotal] = useState("");
  const [pollFlag, setPollFlag] = useState(false);

  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const [removeAction, setRemoveAction] = useState(0);
  const [btnDisable, setBtnDisable] = useState(false);
  const [ownRecommendData, setOwnRecommendData] = useState([]);
  const [modRecommendData, setModRecommendData] = useState([]);
  const [rtDesc, setRtDesc] = useState("");
  const timerLoaderRef = useRef(null);
  const [hideSection, setHideSection] = useState(false);
  const [hideFull, setHideFull] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Redux State
  //for cancelling roundtable if someone joins after 10mins and moderator has not joined
  const has_broadcasted = useSelector((state) => state.single_rt.data);
  // variable showing if toggle is for one user or all
  const checkkkj = useSelector((state) => state.toggleGrid);
  const liveUser = useSelector((state) => state.roundtable.liveUser);
  const was_extended = useSelector(getLiveRTExtended);
  const extendedTime = useSelector(getLiveRTExtendedTime);
  const rtTimer = useSelector(getLiveRTTimer);
  // ------------

  // vars
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // wildcard message data list
  const [wmData, setWmData] = useState([]);

  // height from top for audience interaction
  const [heightFromTop, setHeightFromTop] = useState(null);
  const [audienceInteractionPosition, setAudienceInteractionPosition] =
    useState({
      position: "",
      top: "",
      right: "",
    });
  const [isAudienceInteractionExpanded, setIsAudienceInteractionExpanded] =
    useState(false);

  //local refs here
  const interactionDataref = useRef();
  interactionDataref.current = interactionData;

  const post_id_list_ref = useRef();
  post_id_list_ref.current = post_id_list;

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });

  function recommendRT() {
    const anonymous_user = JSON.parse(localStorage.getItem("anonymous_user"));
    var config = {
      method: "get",
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1}/${
        anonymous_user ? "anonymous/" : ""
      }recommended-rt/${rt_id}`,
      headers: {
        Authorization: `Bearer ${
          localStorage.access || JSON.parse(localStorage.anonymous_user).token
        }`,
      },
    };

    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setOwnRecommendData(response?.data?.data?.[0]?.["owner"]);
          setModRecommendData(response?.data?.data?.[0]?.["moderator"]);
        }
      })
      .catch(function (error) {
        logger.error(error);
      });
  }

  function getLikeDislikeCount() {
    const anonymous_user = JSON.parse(localStorage.getItem("anonymous_user"));

    var config = {
      method: "get",
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1}/${
        anonymous_user ? "anonymous/" : ""
      }check-rt-liked-disliked/${rt_id}`,
      headers: {
        Authorization: `Bearer ${
          !anonymous_user ? localStorage.access : anonymous_user["token"]
        }`,
      },
    };

    setBtnDisable(true);
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setBtnDisable(false);
          if (response?.data?.data?.[0]?.like === 1) {
            setLike(true);
            setRemoveAction(1);
          } else if (response?.data?.data?.[0]?.dislike === 1) {
            setDislike(true);
            setRemoveAction(1);
          } else if (
            response?.data?.data?.[0]?.like === 0 &&
            response?.data?.data?.[0]?.dislike === 0
          ) {
            setLike(false);
            setDislike(false);
            setRemoveAction(0);
          }
        }
      })
      .catch(() => {
        setBtnDisable(false);
      });
  }

  useEffect(() => {
    const localData =
      localStorage.getItem("access") ||
      JSON.parse(localStorage.getItem("anonymous_user"))?.["token"];
    dispatch(
      getDisclaimerRTData({
        token: localData,
      })
    );
    getLikeDislikeCount();
    recommendRT();
  }, []);

  useEffect(() => {
    if (single_rt_data) {
      let temp_data = single_rt_data?.data?.[0];

      if (
        temp_data?.org_logo_url === undefined &&
        temp_data?.brand_logo_url === undefined &&
        temp_data?.sub_brand_logo_url === undefined
      ) {
        setLogoCount(0);
      } else if (
        temp_data?.brand_logo_url === undefined &&
        temp_data?.sub_brand_logo_url === undefined
      ) {
        setLogoCount(1);
        setLogoUrl([
          {
            logo1: temp_data?.org_logo_url,
          },
        ]);
      } else if (temp_data?.sub_brand_logo_url === undefined) {
        setLogoCount(2);
        setLogoUrl([
          {
            logo1: temp_data?.org_logo_url,
          },
          {
            logo2: temp_data?.brand_logo_url,
          },
        ]);
      } else {
        setLogoCount(3);
        setLogoUrl([
          {
            logo1: temp_data?.org_logo_url,
          },
          {
            logo2: temp_data?.brand_logo_url,
          },
          {
            logo3: temp_data?.sub_brand_logo_url,
          },
        ]);
      }

      setRtDesc(temp_data?.["description"]);
    }
  }, [single_rt_data]);

  const disclaimer_rt_data = useSelector((state) => state.disclaimer_rt.data);

  useEffect(() => {
    let timeElapsed =
      (new Date().getTime() - new Date(start_time)?.getTime()) / 60000;

    const handleDisclaimer = () => {
      let timeElapsed =
        (new Date().getTime() - new Date(start_time)?.getTime()) / 60000;

      setShowDisclaimer(true);

      const timer = setTimeout(() => {
        setShowDisclaimer(false);
        if (single_rt_data?.data?.[0]?.["intro_url"] !== undefined) {
          setShowIntro(true);
          setIntroDisable(true);
          setVideoUrl(single_rt_data?.data?.[0]?.["intro_url"]);
          setShowLabel("INTRO");
        }
      }, [(5 - timeElapsed * 60) * 1000]);

      return () => {
        clearTimeout(timer);
      };
    };

    if (timeElapsed < 0) {
      const timeOut = -timeElapsed * 60;

      setTimeout(() => {
        handleDisclaimer();
      }, [timeOut * 1000]);

      return;
    }

    if (timeElapsed * 60 < 5 && timeElapsed > 0) {
      handleDisclaimer();
      return;
    }

    setShowDisclaimer(false);
  }, []);

  useEffect(() => {
    if (single_rt_data?.data?.[0]?.["intro_url"] !== undefined) {
      let timeElapsed =
        (new Date().getTime() - new Date(start_time)?.getTime()) / 1000;

      if (timeElapsed <= 5 || timeElapsed >= endDur + 5) return;

      const startIntroAt = timeElapsed - 5;

      setShowIntro(true);
      setIntroDisable(true);
      setVideoUrl(single_rt_data?.data?.[0]?.["intro_url"]);
      setShowLabel("INTRO");

      setIntroStart(startIntroAt);
    }
  }, []);

  useEffect(() => {
    if (
      single_rt_data?.data?.[0]?.["outro_url"] !== undefined &&
      rttime == "00:00:00"
    ) {
      setShowIntro(true);
      setIntroDisable(true);
      setVideoUrl(single_rt_data?.data?.[0]?.["outro_url"]);
      setShowLabel("OUTRO");
    }
  }, [rttime]);

  let current_user = null;
  try {
    current_user =
      JSON.parse(localStorage.getItem("current_user")) ||
      JSON.parse(localStorage.anonymous_user);
  } catch (err) {
    logger.error(" no current User");
  }

  let filteredWM = wmData.map((i) => i._id);

  useEffect(() => {
    dispatch({ type: "added", payload: filteredWM });
  }, [wmData, dispatch, filteredWM]);

  //Useeffect to check if RT already started or not
  useEffect(() => {
    const cancelRoundtable = async () => {
      try {
        let response = await fetch(
          `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1}/cancel-rt/`,
          {
            body: JSON.stringify({
              device_info: device_info,
              roundtable_id: rt_id,
            }),
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.access}`,
              "content-type": "Application/json",
            },
          }
        );
        response = await response.json();

        if (response.status !== 200) {
          throw new Error(response.message);
        }
      } catch (e) {
        const response = e.response;
        if (!response) {
          ToastHandler("dan", allWords.misc.pages.facingDiffi);
          return;
        }
        if (response.status === 401) {
          return auto_login_continue(cancelRoundtable);
        }

        ToastHandler("dan", allWords.misc.pages.facingDiffi);
      }
      navigate("/roundtable/all", { replace: true });
    };

    let timeElapsed =
      (new Date().getTime() - new Date(start_time)?.getTime()) / 60000;

    if (
      timeElapsed >= 10 &&
      has_broadcasted?.data[0]?.broadcast_live_flag === 1
    ) {
      return;
    }

    if (
      timeElapsed >= 10 &&
      has_broadcasted?.data[0]?.broadcast_live_flag !== 1
    ) {
      ToastHandler(
        "info",
        "Moderator is not present, so this Round Table is cancelled."
      );
      return cancelRoundtable();
    }

    setDisableInteraction(true);
  }, [start_time]);

  useEffect(() => {
    if (
      !mod_pan_list.find((person) => person.username === current_user.username)
    ) {
      setShowSelf(true);
    } else {
      setShowSelf(false);
    }
  }, [mod_pan_list]);

  useEffect(() => {
    if (!rtm_channel) return;

    const channelMessageEventHandler = (message, memberId, messagePros) => {
      const data = message.text.split("||");
      if (data[0] === `reqwildcard`) {
        if (data[1] === current_user.username) setWCOpenDialog(true);
      }
      if (data[0] === `accwildcard`) {
        if (role.includes("moderator")) {
          addWildcard(rt_id, data[1]);
          moderatorActions("accepted", data[1]);
          setWCList("add", data[1]);
        }
      }

      if (
        data[0] === "wcautodismiss" ||
        data[0] === "accwildcard" ||
        data[0] === "rejwildcard"
      ) {
        setConsent((prev) => prev.filter((item) => item !== data[1]));
      }
    };

    rtm_channel.on("ChannelMessage", channelMessageEventHandler);

    return () => {
      rtm_channel.off("ChannelMessage", channelMessageEventHandler);
    };
  }, [rtm_channel]);

  useEffect(() => {
    if (!localConsent) return;

    dispatch(ConsentData(localConsent));
  }, [localConsent]);

  useEffect(() => {
    let temp_mpl = [];
    let temp_su = [];

    speakers.forEach((speaker) => {
      if (speaker.type === "WILDCARD") {
        setWCList("add", speaker.username);
      } else if (speaker.has_confirmed !== 2) {
        temp_mpl.push({
          name: speaker.name,
          username: speaker.username,
          warn: warned_list.hasOwnProperty(speaker.username),
          mute: false,
          block: blocked_list.hasOwnProperty(speaker.username),
          type: speaker.type,
          user_type: speaker.user_type,
        });
        temp_su.push(speaker.username);
      }
    });
    temp_su.push(moderator.username);
    temp_mpl.push({
      name: moderator.name,
      username: moderator.username,
      warn: false,
      mute: false,
      block: false,
      type: "NORMAL", //Change when multi-moderator enhancement is done
    });

    setStageUids(temp_su);
    setModPanList(temp_mpl);
    if (warned_list && warned_list.length > 0) {
      warned_list.map((person) => {
        showSymbols("warn123", person);
      });
    }
    if (blocked_list && blocked_list.length > 0) {
      blocked_list.map((person) => {
        showSymbols("block", person);
      });
    }
  }, [speakers, users]);

  useEffect(() => {
    if (all_members.length > 0) {
      setViewers(
        all_members.filter((item) => {
          if (!stage_uids.includes(item) && !wc_uids.includes(item)) {
            return item;
          }
        })
      );
    }
  }, [all_members, wc_uids]);

  const [test, setTest] = useState(0);
  client.on("volume-indicator", function (result) {
    result.forEach(function (volume) {
      try {
        document.querySelector(`#${volume.uid}`).style.boxShadow =
          "0px 0px " + volume.level * 5 + "px white";
      } catch (err) {
        //Nothing to do here
      }
    });
  });

  stopBrowserBack();

  const [toggleUser, setToggleUser] = useState(null);

  useEffect(() => {
    client.enableAudioVolumeIndicator();
    client.on("volume-indicator", (volumes) => {
      var res = Math.max.apply(
        Math,
        volumes.map(function (o) {
          return o.level > 0 && o.level;
        })
      );
      if (res !== -Infinity) {
        var finding = volumes.find((i) => i.level === res);
        if (finding && finding.level > 0) {
          setToggleUser(finding);
        } else {
          setToggleUser(null);
        }
      } else {
        setToggleUser(null);
      }
    });
  }, []);

  useEffect(() => {
    if (role !== "audience") {
      setTest(users.length + 1);
    } else if (role === "audience" || role.includes("admin")) {
      setTest(users.length);
    }
  }, [users, tracks, role]);

  // Get user interaction panel scrolling
  function scrollMessages() {
    if (document.querySelector(".viewers_chat_container")) {
      document.querySelector(".viewers_chat_container").scrollTop = 0;
    }
  }

  useEffect(() => {
    if (interactionDataOldLength === interactionData.length) return;
    scrollMessages();
  }, [interactionData]);
  // Get user interaction post firebase query
  var userInteractionPost = [];

  useEffect(() => {
    db.collection("roundtable")
      .doc(rt_id)
      .collection("messages")
      .orderBy("created_at", "desc")
      .onSnapshot((snapshot) => {
        userInteractionPost = [];
        let temp_data = [];
        snapshot.forEach((doc) => {
          if (doc.data().round_table_data.moderator_promoted === 1) {
            temp_data.push(doc.data());
          }
          userInteractionPost.push(doc.data());
        });
        setOldInteractionData(interactionDataref?.current.length);
        setInteractionData(userInteractionPost);
        setMuteInteraction(userInteractionPost);
        setWmData(temp_data);
      });
  }, []);

  useEffect(() => {
    //If you want to show waiting for shared screen as soon as remote user clicks on share screen button
    // This has no dependencies
    if (!users.length) {
      setScreenSharing(false);
      return;
    }

    let screenShared = users.some((user) => {
      return user.uid.split("-")[1] === "screen";
    });

    setScreenSharing(screenShared);
  }, [users]);

  const addWildCardSetData = (username, liveUser) => {
    if (consent.includes(username)) {
      ToastHandler("info", allWords.misc.pages.consentsent);
      return;
    }

    if (!liveUser.includes(username)) {
      ToastHandler("info", allWords.misc.pages.cantaddw);
      return;
    }

    const panel = mod_pan_list.filter((item) => {
      return item.username !== moderator.username;
    });

    if (panel.length + wc_uids.length > 4) {
      return ToastHandler("info", allWords.misc.pages.fivespeaker);
    }

    rtm_channel
      .sendMessage({
        text: `reqwildcard||${username}`,
      })
      .then(() => {
        setConsent((prev) => [...prev, username]);
        if (username === current_user.username) {
          setWCOpenDialog(false);
        }
      })
      .catch((err) => {});
  };

  // api call to check following someone
  async function followFromList(user_name) {
    let access;

    const anonymous_user = localStorage.anonymous_user;

    access = localStorage.access || JSON.parse(anonymous_user).token;

    let config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/check_follower_following/`,
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
      data: { user_name: user_name },
    };

    let res;

    try {
      res = await axios(config);
    } catch (e) {
      (async () => {
        const res = e.response;
        if (!res) return;
        if (res.status === 401) {
          return await auto_login_continue(followFromList);
        }
        return res;
      })();
    }
    if (
      res?.data?.status === 253 &&
      res?.data?.message === "user does not exist"
    ) {
      ToastHandler(
        "warn",
        "This audience is exploring RoundTable without login/sign up."
      );
      return false;
    }
    return true;
  }

  const FURT = useSelector((state) => state.followUnfollowInRT.followings);

  async function followSomeone(user) {
    let config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/follow-friends/`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      },
      data: { handle: user, type: "follow" },
    };

    try {
      const response = await axios(config);
      if (response.data.status === 200) {
        dispatch({ type: "following", payload: [...FURT, user] });
      } else if (
        response.data.status === 252 &&
        response.data.data === "User does not exist in user"
      ) {
        ToastHandler(
          "warn",
          "This audience is exploring RoundTable without login/sign up."
        );
      } else {
        ToastHandler("dan", allWords.misc.somethingwrong);
      }
    } catch (error) {
      const response = error.response;
      if (!response) {
        ToastHandler("dan", allWords.misc.somethingwrong);
        return;
      }

      if (response.status == 401)
        return auto_login_continue(() => followSomeone(user));

      ToastHandler("dan", allWords.misc.somethingwrong);
    }
  }

  async function unFollowSomeone(user) {
    let config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/follow-friends/`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      },
      data: { handle: user, type: "unfollow" },
    };
    dispatch({ type: "following", payload: FURT.filter((i) => i !== user) });
    try {
      const response = await axios(config);
      if (response.data.status === 200) {
        let followingFromLS4arr2 = Array.from(
          localStorage.getItem("followings").split(",")
        );
        localStorage.setItem(
          "followings",
          followingFromLS4arr2.filter((i) => i !== user)
        );
      } else {
        ToastHandler("dan", allWords.misc.somethingwrong);
      }
    } catch (error) {
      const response = error.response;
      if (!response) {
        // return  alert("Something went wrong")
        ToastHandler("dan", allWords.misc.somethingwrong);
      }

      if (response.status == 401)
        return auto_login_continue(() => unFollowSomeone(user));

      ToastHandler("dan", allWords.misc.somethingwrong);
    }
  }
  let localData = JSON.parse(localStorage.join_rt);
  // This is the component which is rendering each item/person within participant list.

  const Person = useCallback(
    ({
      person,
      no_hand,
      showDots,
      user_id,
      no_add_wildcard,
      no_remove_wildcard,
      panelist,
      showFollow,
      owner,
      disabledWildcardAddition,
      user_type,
    }) => {
      const [anchorEl, setAnchorEl] = React.useState(null);
      const open = Boolean(anchorEl);
      const handleClick = async (event) => {
        if (!(await followFromList(person?.["username"]))) return;

        setAnchorEl(event.target);
      };
      const handleClose = () => {
        setAnchorEl(null);
      };

      const temp = users
        .filter((elem) => {
          return elem.uid === person.username;
        })
        .map((elem) => {
          return elem.uid;
        });
      temp.push(uid);

      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            position: "relative",
            paddingBottom: "8px",
          }}
        >
          <div className="d-flex justify-content-center">
            <div style={{ position: "relative" }}>
              <UserProfile username={person.username} className="avatar" />

              {temp.includes(person.username) && no_hand && (
                <span
                  className="dot"
                  style={{ position: "absolute", bottom: "0px", right: "-3px" }}
                ></span>
              )}
            </div>
            &emsp;
            <span
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "-5px",
                marginTop: "-5px",
              }}
            >
              <span
                onClick={async () => {
                  if (
                    !localStorage?.current_user &&
                    localStorage.anonymous_user
                  ) {
                    setModalTitle(allWords.misc.pages.logintoview);
                    setModalOpen(true);
                    return;
                  }
                  if (!(await followFromList(person?.["username"]))) return;
                  window.open(`/profile?username=${person.username}`);
                }}
                target="__blank"
                className="Ltooltips"
                style={{
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                <strong
                  style={{
                    textTransform: "capitalize",
                    display: "inline-block",
                    width:
                      person?.username?.length > 15 ? "8rem" : "max-content",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    "&:hover": {
                      color: "black",
                    },
                  }}
                >
                  <span
                    style={{
                      color: "#4f4f4f",
                    }}
                  >
                    @
                  </span>
                  {person.username}
                  <span>
                    <VipComp user_type={user_type} />
                  </span>
                </strong>
                {person?.username?.length > 15 ? (
                  <span className="Ltooltiptext">{person.username}</span>
                ) : null}
              </span>
            </span>
          </div>
          {current_user.username === person.username ? (
            ""
          ) : (
            <div
              style={{
                outline: "none",
                backgroundColor: "white",
                position: "absolute",
                right: "-10px",
                top: "20%",
              }}
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              hidden={
                !localStorage?.current_user && localStorage?.anonymous_user
                  ? true
                  : false
              }
              onClick={(e) => {
                handleClick(e, person?.username);
              }}
            >
              <img alt="" src={ChatMenuIcon} height="24px" width="auto" />
            </div>
          )}
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {showFollow == true && (
              <MenuItem
                style={{
                  minWidth: "185px",
                }}
                disabled={showFollow == true ? false : true}
                onClick={() => {
                  if (
                    !localStorage.current_user &&
                    localStorage.anonymous_user
                  ) {
                    setModalTitle("To Follow , Login or sign up to Khul Ke");
                    setModalOpen(true);
                    return;
                  }
                  followSomeone(person.username);
                }}
              >
                {allWords.misc.livert.follow}
              </MenuItem>
            )}
            {showFollow == false && (
              <MenuItem
                style={{
                  minWidth: "185px",
                }}
                onClick={() => {
                  if (
                    !localStorage.current_user &&
                    localStorage.anonymous_user
                  ) {
                    setModalTitle("To Follow , Login or sign up to Khul Ke");
                    setModalOpen(true);
                    return;
                  }
                  unFollowSomeone(person.username);
                }}
              >
                {allWords.misc.livert.unfollow}
              </MenuItem>
            )}
            {localData.moderator.username === current_user.username &&
              !panelist &&
              owner !== true &&
              !no_add_wildcard && (
                <MenuItem
                  style={{
                    minWidth: "185px",
                  }}
                  disabled={disabledWildcardAddition}
                  // disabled={no_add_wildcard ? true : false}
                  onClick={() => addWildCardSetData(person.username, liveUser)}
                >
                  {/* Add as a Wildcard Panelist */}
                  {allWords.misc.text_wilduser}
                </MenuItem>
              )}
            {localData.moderator.username === current_user.username &&
              !panelist &&
              owner !== true &&
              !no_remove_wildcard && (
                <MenuItem
                  style={{
                    minWidth: "185px",
                    marginLeft: "-4px",
                  }}
                  disabled={disabledWildcardAddition}
                  // disabled={no_remove_wildcard ? true : false}
                  onClick={() => handle_wildcard_removal(user_id)}
                >
                  Remove from Wildcard
                </MenuItem>
              )}
          </Menu>
          <div>
            <div style={{ display: "block" }}>
              {person.mute && (
                <img
                  style={{ height: "16px", width: "16px" }}
                  alt={`You have been muted`}
                  src={mute_icon}
                />
              )}
              {person.warn && (
                <img
                  style={{ height: "16px", width: "16px" }}
                  alt={`You've been warned by the moderator`}
                  src={warn_icon}
                />
              )}
              {person.block && (
                <>
                  &emsp;
                  <img
                    alt={`This user has been blocked by the moderator`}
                    src={rt_block}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      );
    },
    []
  );

  // sending data to redux kk
  useEffect(() => {
    dispatch({
      type: "sendingHeaderData",
      payload: {
        viewer_count,
        show_self,
        role,
        current_user,
        moderator,
        mod_pan_list,
        // wildcards,
        viewers,
        NoUsers,
        wc_uids,
        Person,
        all_members,
      },
    });
  }, [
    dispatch,
    viewer_count,
    show_self,
    role,
    current_user,
    mod_pan_list,
    // wildcards,
    viewers,
    wc_uids,
    all_members,
    Person,
  ]);

  const [wcRequestTimeoutTimer, setWcRequestTimeoutTimer] = useState();

  useEffect(() => {
    if (wc_openDialog) {
      const timer = setTimeout(() => {
        rtm_channel
          .sendMessage({
            text: `wcautodismiss||${current_user.username}`,
          })
          .then(() => {
            setWCOpenDialog(false);
          });
      }, 60000 * 3);

      setWcRequestTimeoutTimer(timer);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [wc_openDialog]);

  /* Handle star marking on posts and show notification to admin and post owner */
  const starPostEvent = (message) => {
    let text = message.text.split("||");
    if (text[0] === "modstarmarkedpost") {
      setPostIdList([...post_id_list_ref.current, text[1]]);

      // setUpdatedStarMessage(!updated );
      let post_data = interactionDataref.current.find(
        (elem) => elem.post_id === text[1]
      );

      if (post_data.username === uid) {
        ToastHandler("info", allWords.misc.livert.starredPost);
      }
    } else if (text[0] === "modunstarmarkedpost") {
      let temp = [...post_id_list_ref.current];
      temp = temp.filter((elem) => text[1] !== elem);
      setPostIdList(temp);
      // setUpdatedStarMessage(!updatedStarMessage);
      let post_data = interactionDataref.current.find(
        (elem) => elem.post_id === text[1]
      );

      if (post_data.username === uid) {
        ToastHandler("info", allWords.misc.livert.unstarredPost);
      }
    }
  };

  useEffect(() => {
    if (!rtm_channel) return;

    rtm_channel?.on("ChannelMessage", starPostEvent);

    return () => {
      rtm_channel?.off("ChannelMessage", starPostEvent);
    };
  }, [rtm_channel]);

  //all local function and event handlers below this

  //--------Wildcard dialog functions start here---------//

  //---wildcard accepted req---//
  const confirmedWildcard = async () => {
    try {
      const temp = await AgoraRTC.createMicrophoneAndCameraTracks(
        {},
        { encoderConfig: { frameRate: 30, height: 720, width: 1280 } }
      );
      setReady(true);
      setTracks(temp);
    } catch (e) {
      if (e.code === "PERMISSION_DENIED") {
        ToastHandler("info", "Permission Required before you can join");
      } else if (e.code === "NOT_READABLE") {
        ToastHandler("warn", allWords.misc.pages.camerataken);
      } else {
        ToastHandler("warn", allWords.misc.pages.cantgetcam);
      }

      return;
    }
    rtm_channel
      .sendMessage({
        text: `accwildcard||${current_user.username}`,
      })
      .then(async () => {
        moengageEvent("Accept Wildcard Panelist", "RoundTable", {
          RoundTableID: rt_id,
          Name: single_rt_data?.data?.[0]?.["name"],
          "K Type": single_rt_data?.data?.[0]?.["r_type"],
          "K SubType": single_rt_data?.data?.[0]?.["open_to_all"],
          "Audience Interaction": 1,
        });
        setWCOpenDialog(false);
      });
    if (wcRequestTimeoutTimer) {
      clearTimeout(wcRequestTimeoutTimer);
    }
  };

  //---wildcard rejected req---//

  const discardWildcard = () => {
    rtm_channel
      .sendMessage({
        text: `rejwildcard||${current_user.username}`,
      })
      .then(() => {
        setWCOpenDialog(false);
      })
      .catch((err) => {});

    if (wcRequestTimeoutTimer) {
      clearTimeout(wcRequestTimeoutTimer);
    }
  };

  //--------Wildcard dialog functions ends here---------//
  const fullScrc = useSelector((state) => state.fullScreen.full);
  const { state: expandedState } = useLocation();
  const expandedAgoraData = useSelector((state) => state.minimizedData.data);

  const [trackState, setTrackState] = useState({
    video: video_status,
    audio: audio_status,
  });

  const [audio_btn, setAudioBtn] = useState(audio_status);
  const [video_btn, setVideoBtn] = useState(video_status);

  useEffect(() => {
    setAudioBtn(audio_status);
    setVideoBtn(video_status);
    setTrackState({ video: video_status, audio: audio_status });
  }, [fullScrc]);

  const mute = async (type) => {
    if (type === "audio") {
      await tracks?.[0].setEnabled(!trackState.audio);
      setTrackState((ps) => {
        setAudioStatus(!ps.audio);
        setAudioBtn(!ps.audio);
        return { ...ps, audio: !ps.audio };
      });
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
    }
  };
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

        const screenTrack = await AgoraRTC.createScreenVideoTrack();

        await screenClient.join(
          config.appId,
          channelName,
          config.token,
          `${uid}-screen`
        );

        await screenClient.publish(screenTrack);
        setLocalScreenTrack(screenTrack);
        return screenClient;
      } else return screenClient;
    }

    startScreenCall()
      .then((videoClient) => {
        moengageEvent("Screen Share", "RoundTable", {
          RoundTableID: rt_id,
          Name: single_rt_data?.data?.[0]?.["name"],
          "K Type": single_rt_data?.data?.[0]?.["r_type"],
          "K SubType": single_rt_data?.data?.[0]?.["open_to_all"],
          "Audience Interaction": 1,
        });
      })
      .catch((e) => {
        setScreenSharing(false);
        screenClient.leave();
        setLocalScreenTrack();
      });
  };
  const [visible, setVisible] = useState(false);
  const [bottomLP, setBottomLP] = useState("20px");
  useEffect(() => {
    if (!fullScrc || !bottomRef.current) {
      return;
    }
    const intName = setTimeout(() => {
      if (!bottomRef.current) return;
      bottomRef.current.style.height = "0px";
      maincontRef.current.style.height = "99vh";
      setBottomLP("20px");
      setVisible(false);
    }, 5000);
    let timeout;
    function mouseEvent() {
      if (timeout) {
        clearTimeout(timeout);
      }
      if (!bottomRef.current) return;
      bottomRef.current.style.height = "3.5rem";
      maincontRef.current.style.height = "92vh";

      setBottomLP("70px");
      setVisible(true);

      timeout = setTimeout(() => {
        if (!bottomRef.current) return;
        bottomRef.current.style.height = "0px";
        maincontRef.current.style.height = "99vh";
        setBottomLP("20px");
        setVisible(false);
      }, 5000);
    }
    window.addEventListener("mousemove", mouseEvent);
    return () => {
      clearTimeout(intName);
      window.removeEventListener("mousemove", mouseEvent);
    };
  }, [fullScrc, bottomRef]);

  const style5 = {
    // height: fullScrc ? "calc(100vh - (4rem+70px))" : "",
    height: "100%",
    backgroundColor: "#121212",
    padding: "0.5rem 0 0.5rem 0",
    width: "100%",
  };
  const style6 = {
    margin: "0px",
    width: "100%",
  };

  const [showTwoSecLogo, setShowTwoSecLogo] = useState(
    expandedState?.expanded ? false : true
  );
  const videoRef = useRef(null);

  const calculateHeightFromTop = () => {
    // const el = document.getElementById("audience-interaction-box");
    const vidEl = document.getElementsByClassName("main-inner-rt")[0];
    const elH = el.offsetHeight;
    setAudienceInteractionPosition(Math.max(0, vidEl ? elH : 0));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowTwoSecLogo(false);
    }, 2700);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (window.innerWidth > 1199) {
      setAudienceInteractionPosition({
        position: "fixed",
        top: "10%",
        right: "0",
      });
    }
  }, [window.innerWidth]);

  const maincontRef = useRef();

  //show controls onHover
  const [showControls, setShowControls] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    resetTimer();
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  const resetTimer = () => {
    clearTimeout(timerRef.current);
    if (showControls) {
      timerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const handleMouseEnter = (e) => {
    setShowControls(true);
    resetTimer();
  };

  const handleMouseLeave = (e) => {
    e.stopPropagation();
    setShowControls(false);
    resetTimer();
  };

  const handleMouseMove = (e) => {
    e.stopPropagation();
    resetTimer();
  };

  const moderatorRef = useRef();
  moderatorRef.current = moderator;

  const [disableButton, setDisableButtons] = useState(false);
  // blocking audio and video 5 mins before the chat starts
  useEffect(() => {
    const func = async () => {
      let timeElapsed =
        (new Date().getTime() - new Date(start_time)?.getTime()) / 60000;

      if (timeElapsed >= 10) return;

      if(!isSpeakerAccess(role)){
        setDisableButtons(true);
        setAudioBtn(false);
        setVideoBtn(false);
        setAudioStatus(false);
        setVideoStatus(false);
        await tracks?.[0].setEnabled(false);
        await tracks?.[1].setEnabled(false);
        setTrackState({ audio: false, video: false });

      }
      if (timeElapsed < 0) {
        const blockUntil = -(timeElapsed * 60 * 1000);

      }
      if (timeElapsed < 0 || isSpeakerAccess(role)) {
        const blockUntil = isSpeakerAccess(role)  ? 0 : -(timeElapsed * 60 * 1000);
        setTimeout(async () => {
          if (!moderatorRef.current) return; //handleModeratorUnavailable();

          setDisableButtons(false);
          await tracks?.[0].setEnabled(true);
          setTrackState({ audio: true, video: false });
          setAudioBtn(true);
          setAudioStatus(true);
          if (rt_type === "VIDEO_STREAMING") {
            await tracks?.[1].setEnabled(true);
            setVideoBtn(true);
            setVideoStatus(true);

            setTrackState({ audio: true, video: true });
          }
          handleTrackPublish("publish");
        }, blockUntil);
      } else {
        return; //handleModeratorUnavailable();
      }
    };

    if (!expandedState?.expanded) {
      func();
    }
  }, []);

  const isShowExtendButton =
    rtTypeBased !== "RECORDING_BASED" &&
    !["audience", "panellist", "host"].includes(role) &&
    (["admin-moderator", "moderator", "admin", "admin-panellist"].includes(
      role
    ) ||
      has_broadcasted?.data?.[0]?.moderator?.m_type === "co-owner");

  const [showMiniRT, setshowMiniRT] = useState(false);
  const selectedWildMsg = useSelector(getLiveRTSelectedWildMsg);
  const [showWildcardInFullscr, setShowWildcardInFullscr] = useState(false);

  const renderRtVideoGrid = (params = {}) => {
    const { miniRT = false } = params;
    return (
      <>
        {/* MultiLogo absolute positioned Div */}
        {!miniRT && (
          <>
            {/* top right */}
            <img
              id="logo1"
              src={logoUrl?.[1]?.["logo2"]}
              style={{
                position: "absolute",
                right: "15px",
                top: "15px",
                maxWidth: "50px",
                zIndex: "1",
              }}
              hidden={logoCount === 0 || logoCount === 1 ? true : false}
              alt=""
            />
            {/* top left */}
            <img
              id="logo1"
              src={logoUrl?.[2]?.["logo3"]}
              style={{
                position: "absolute",
                left: "15px",
                top: "15px",
                maxWidth: "50px",
                zIndex: "1",
              }}
              hidden={
                logoCount === 0 || logoCount === 1 || logoCount === 2
                  ? true
                  : false
              }
              alt=""
            />
          </>
        )}
        {/*Outer container grey border div */}
        {showTwoSecLogo && !miniRT && (
          <div className="twosec-logo-video-parent">
            <video
              style={{
                paddingLeft: "5.4rem",
              }}
              className="twosec-logo-video"
              src={KhulKeLogoVid}
              autoPlay
              muted
            ></video>
          </div>
        )}
        <div
          id={miniRT ? "miniRT-container" : "non-miniRT-container"}
          className="grid-cont-out"
          style={{
            backgroundColor: "#101010",
            padding: fullScrc ? "" : "",
            height:
              rt_type !== "RECORDING_BASED"
                ? fullScrc || miniRT
                  ? "100%"
                  : "calc(100% - 70px)"
                : "95%",
            position: "relative",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          
        {(!miniRT && windowWidth > 768) && <BroadCastModalPopup />}
        {(!miniRT && fullScrc && windowWidth > 768 && wmData.length && showWildcardInFullscr && !selectedWildMsg) && <WildCardPopup wmData={wmData} />}
          {/* bottom left */}
          {!miniRT && (
            <>
              <img
                id="logo1"
                src={logoUrl?.[0]?.["logo1"]}
                style={{
                  position: "absolute",
                  left: "15px",
                  bottom: `${showControls && !fullScrc ? "66px" : "10px"}`,
                  maxWidth: "50px",
                  zIndex: "1",
                }}
                hidden={logoCount === 0 ? true : false}
                alt=""
              />
            </>
          )}
          {/* bottom right */}
          <img
              id="logo1"
              src={globalImages.logo}
              className={`khulke-bottom-right-logo ${
                showControls && !fullScrc ? "show-controls" : ""
              }`}
              alt=""
            />
          {!fullScrc && (
            <Controls
              fullScreenHeader={fullScreenHeader}
              tracks={tracks}
              setStart={setStart}
              setInCall={setInCall}
              audio_status={audio_status}
              video_status={video_status}
              setAudioStatus={setAudioStatus}
              setVideoStatus={setVideoStatus}
              rtm_channel={rtm_channel}
              show_viewers={show_viewers}
              role={role}
              current_user={current_user}
              client={client}
              start_time={start_time}
              rt_id={rt_id}
              setModeratorHasJoined={setModeratorHasJoined}
              handleTrackPublish={handleTrackPublish}
              volume={volume}
              setVolume={setVolume}
              disableButton={disableButton}
              setDisableButtons={setDisableButtons}
              setTrackState={setTrackState}
              trackState={trackState}
              showControls={showControls}
              ready={ready}
              fullScrc={fullScrc}
              start={start}
              single_rt_data={single_rt_data}
            />
          )}
          {disableInteraction &&
          ![
            "admin",
            "moderator",
            "admin-moderator",
            "admin-panellist",
            "panellist",
          ].includes(role) ? null : showDisclaimer ? (
            <div className="disclaimertText">
              <h1>{allWords.misc.pages.distitle}</h1>
              <p>{allWords.misc.pages.disclaimer}</p>
            </div>
          ) : (
            // <>
            //   {!disableInteraction && (
            <>
              {single_rt_data?.data?.[0]?.r_type === "RECORDING_BASED" ? (
                <>
                  <RecordedRTVideo
                    single_rt_data={single_rt_data}
                    rt_id={rt_id}
                    current_user={current_user}
                    fullScrc={fullScrc}
                    volume={volume}
                    showTwoSecLogo={showTwoSecLogo}
                    ownerId={single_rt_data?.data?.[0]?.owner?.user_id}
                    disableInteraction={disableInteraction}
                    closeFullscreen={closeFullscreen}
                  />{" "}
                </>
              ) : (
                <>
                  {showIntro === true ? (
                    <IntroOutroVideo
                      introStart={introStart}
                      setShowIntro={setShowIntro}
                      videoUrl={videoUrl}
                      showLabel={showLabel}
                      endDur={endDur}
                      setEndDur={setEndDur}
                      setShowLabel={setShowLabel}
                      setStart={setStart}
                      setInCall={setInCall}
                      closeFullscreen={closeFullscreen}
                    />
                  ) : (screenSharing) ? (
                    <SharedScreen
                      users={users}
                      role={role}
                      rt_type={rt_type}
                      moderator={moderator}
                      wc_uids={wc_uids}
                      stage_uids={stage_uids}
                      handle_wildcard_removal={handle_wildcard_removal}
                      moderatorActions={moderatorActions}
                      client={client}
                      tracks={tracks}
                      audio_status={audio_status}
                    />
                  ) : checkkkj.showAll || toggleUser == null ? (
                    /* outer container for grid with blue bg */
                    <div
                    style={{
                      display: (!miniRT && showMiniRT) ? "none": "grid",
                    }}
                      className={`grid-cont-out2  div-${
                        role === "admin" ? test - 1 : test
                      }`}
                    >
                      {role !== "audience" && role !== "admin" && (
                        <>
                          {/* what to show when video is on or off */}
                          {video_status &&
                          rt_type === "VIDEO_STREAMING" &&
                          tracks[1]
                            ? //When video is on
                              !showDisclaimer && (
                                <div
                                  className={`agora-cont ${
                                    test === 3 && "teenwala"
                                  }
                              ${test === 2 && "doWala"}
                              ${users.length > 0 ? "halfA" : "fullA"}`}
                                  style={{
                                    position: "relative",
                                    // ...getGridStyle(users, miniRT)
                                  }}
                                >
                                  {/* Agora itself */}
                                  <AgoraVideoPlayer
                                    videoTrack={tracks[1]}
                                    className="agora-itself"
                                    test={test}
                                    fit={"cover"}
                                  />
                                  {/* Icons container outer */}
                                  <div className="icons-cont">
                                    {/* icons container div with width 95% */}
                                    <div
                                      className="icons-cont-inner"
                                      style={{
                                        width: fullScrc ? "98%" : "",
                                      }}
                                    >
                                      {/* person's name & role */}
                                      <SpeakerNames
                                        test={test}
                                        wc_uids={wc_uids}
                                        moderator={moderator}
                                        userid={client_uid}
                                        stage_uids={stage_uids}
                                        roleSize={roleSize}
                                        nameSize={nameSize}
                                      />
                                      {/* mic muted icon appears conditionally*/}
                                      {!audio_status && (
                                        <MicOffIcon
                                          className={`mic-icon ${
                                            showControls && !fullScrc
                                              ? "show-bottom"
                                              : ""
                                          }`}
                                        />
                                      )}
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      position: "absolute",
                                      left: "0.3rem",
                                      top: "0.3rem",
                                    }}
                                  >
                                    {JSON.parse(
                                      localStorage.getItem("join_rt")
                                    )["moderator"]["username"] ===
                                      current_user.username ||
                                    role === "panellist" ? null : (
                                      <ModeratorContols
                                        user_uid={client.uid}
                                        mic_status={
                                          client.audioTrack ? true : false
                                        }
                                        wc_uids={wc_uids}
                                        handle_wildcard_removal={
                                          handle_wildcard_removal
                                        }
                                        moderatorActions={moderatorActions}
                                        role={role}
                                        disableInteraction={disableInteraction}
                                      />
                                    )}
                                  </div>
                                </div>
                              )
                            : // When video is off and role is not audience
                              !showDisclaimer && (
                                <div
                                  className={`${
                                    users.length > 0 ? "halfA" : "fullA"
                                  } ${test === 2 && "doWala"} ${
                                    test === 3 && "teenwala"
                                  } `}

                                  // style={{...getGridStyle(users, miniRT)}}
                                >
                                  <NoVideoNew
                                    user_length={users.length}
                                    stage_uids={stage_uids}
                                    username={client_uid}
                                    wc_uids={wc_uids}
                                    role={role}
                                    test={test}
                                  >
                                    {!audio_status && (
                                      <MicOffIcon
                                        className={`mic-icon ${
                                          showControls && !fullScrc
                                            ? "show-bottom"
                                            : ""
                                        }`}
                                      />
                                    )}
                                    {JSON.parse(
                                      localStorage.getItem("join_rt")
                                    )["moderator"]["username"] ===
                                      current_user.username ||
                                    role === "panellist" ? null : (
                                      <ModeratorContols
                                        user_uid={client.uid}
                                        mic_status={
                                          client.audioTrack ? true : false
                                        }
                                        wc_uids={wc_uids}
                                        handle_wildcard_removal={
                                          handle_wildcard_removal
                                        }
                                        moderatorActions={moderatorActions}
                                        role={role}
                                        disableInteraction={disableInteraction}
                                      />
                                    )}
                                  </NoVideoNew>
                                </div>
                              )}
                        </>
                      )}
                      {/* Mapping over other users */}
                      {users.length > 0 &&
                        users.map((user) => {
                          let layout = users.length >= 1 ? "halfA" : "fullA";

                          // look of grid when role is audience
                          if (
                            (role === "audience" || role === "admin") &&
                            users.length === 1
                          ) {
                            layout = "fullA";
                          }
                          if (
                            (role === "audience" || role === "admin") &&
                            users.length === 3
                          ) {
                            layout = "halfA";
                          }

                          if (user.videoTrack) {
                            return (
                              // when video is on
                              <div
                                className={`koko agora-cont ${layout} ${
                                  test === 3 &&
                                  role === "audience" &&
                                  user.uid === users[0].uid
                                    ? "teenwala"
                                    : ""
                                }  ${test === 2 && "doWala"} ${
                                  role === "admin" && test === 3 && "doWala"
                                }
                                        ${
                                          role === "admin" &&
                                          test === 4 &&
                                          user.uid === users[0].uid &&
                                          "teenwala"
                                        }
                                        `}
                              >
                                <AgoraVideoPlayer
                                  videoTrack={user.videoTrack}
                                  key={user.uid}
                                  className="agora-itself"
                                  test={test}
                                  fit={"cover"}
                                />

                                {/* Icons container outer */}
                                <div className="icons-cont">
                                  {/* icons container div with width 95% */}
                                  <div
                                    className="icons-cont-inner"
                                    style={{
                                      width: fullScrc ? "98%" : "",
                                    }}
                                  >
                                    {/* person's name & role */}
                                    <span>
                                      <SpeakerNames
                                        test={test}
                                        wc_uids={wc_uids}
                                        moderator={moderator}
                                        userid={user.uid}
                                        stage_uids={stage_uids}
                                        roleSize={roleSize}
                                        nameSize={nameSize}
                                      />
                                    </span>
                                    {/* mic muted icon appears conditionally*/}
                                    {!user.audioTrack && (
                                      <MicOffIcon
                                        className={`mic-icon ${
                                          showControls && !fullScrc
                                            ? "show-bottom"
                                            : ""
                                        }`}
                                      />
                                    )}
                                  </div>
                                </div>
                                {/* mod controls which only show when role is mod  */}
                                {role.includes("moderator") && (
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: "0.3rem",
                                      left: "0.3rem",
                                    }}
                                  >
                                    <ModeratorContols
                                      user_uid={user.uid}
                                      mic_status={
                                        user.audioTrack ? true : false
                                      }
                                      wc_uids={wc_uids}
                                      handle_wildcard_removal={
                                        handle_wildcard_removal
                                      }
                                      moderatorActions={moderatorActions}
                                      role={role}
                                      disableInteraction={disableInteraction}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          } else {
                            // When video is off
                            return (
                              <div
                                className={`momo ${layout} ${
                                  test === 3 &&
                                  role === "audience" &&
                                  user.uid === users[0].uid
                                    ? "teenwala"
                                    : ""
                                }  ${test === 2 && "doWala"} ${
                                  role === "admin" && test === 3 && "doWala"
                                } ${
                                  role === "admin" &&
                                  test === 4 &&
                                  user.uid === users[0].uid &&
                                  "teenwala"
                                }`}
                                // className={`${users.length > 1 ? "halfA" : "fullA"}`}
                              >
                                <NoVideoNew
                                  stage_uids={stage_uids}
                                  user_length={users.length}
                                  username={user.uid}
                                  role={role}
                                  wc_uids={wc_uids}
                                  test={test}
                                >
                                  {!user.audioTrack && (
                                    <MicOffIcon
                                      className={`mic-icon ${
                                        showControls && !fullScrc
                                          ? "show-bottom"
                                          : ""
                                      }`}
                                    />
                                  )}

                                  {/* mod control overlay on all user when video is off and only appears when role is mod */}
                                  {role.includes("moderator") && (
                                    // <div style={{border:"1px solid red", position:"absolute", top:"0",left:0}}>
                                    <ModeratorContols
                                      user_uid={user.uid}
                                      mic_status={
                                        user.audioTrack ? true : false
                                      }
                                      wc_uids={wc_uids}
                                      handle_wildcard_removal={
                                        handle_wildcard_removal
                                      }
                                      moderatorActions={moderatorActions}
                                      role={role}
                                      disableInteraction={disableInteraction}
                                    />
                                    // </div>
                                  )}
                                </NoVideoNew>
                              </div>
                            );
                          }
                        })}
                    </div>
                  ) : (
                    // when toggle according to volume is active
                    <>
                      {users.find((j) => j["uid"] === toggleUser["uid"]) ? (
                        rt_type === "VIDEO_STREAMING" &&
                        users.find((j) => j["uid"] === toggleUser["uid"])
                          .videoTrack ? (
                          <>
                            <AgoraVideoPlayer
                              videoTrack={
                                users.find(
                                  (j) => j["uid"] === toggleUser["uid"]
                                ).videoTrack
                              }
                              style={{
                                height: "100%",
                                width: "100%",
                                position: "relative",
                              }}
                              fit={"cover"}
                            >
                              <div
                                className="icons-cont2"
                                style={{
                                  position: "absolute",
                                  bottom: "0.4rem",
                                  left: "0.6rem",
                                  zIndex: 100,
                                  color: "white",
                                }}
                              >
                                <div
                                  className="icons-cont-inner"
                                  style={{
                                    width: fullScrc ? "98%" : "",
                                  }}
                                >
                                  {/* person's name & role */}
                                  <SpeakerNames
                                    test={1}
                                    wc_uids={wc_uids}
                                    moderator={moderator}
                                    userid={toggleUser["uid"]}
                                    stage_uids={stage_uids}
                                    roleSize={roleSize}
                                    nameSize={nameSize}
                                  />
                                </div>
                              </div>
                            </AgoraVideoPlayer>
                          </>
                        ) : (
                          <NoVideoNew
                            stage_uids={stage_uids}
                            user_length={users.length}
                            username={
                              users.find((j) => j["uid"] === toggleUser["uid"])
                                .uid
                            }
                            role={role}
                            wc_uids={wc_uids}
                            toggle={true}
                            style={{
                              height: "100%",
                              width: "100%",
                            }}
                            test={test}
                          ></NoVideoNew>
                        )
                      ) : rt_type === "VIDEO_STREAMING" && video_status ? (
                        <>
                          <AgoraVideoPlayer
                            videoTrack={tracks[1]}
                            style={{
                              height: "100%",
                              width: "100%",
                              position: "relative",
                            }}
                            fit={"cover"}
                          >
                            <div
                              className="icons-cont2"
                              style={{
                                position: "absolute",
                                bottom: "0.4rem",
                                left: "0.6rem",
                                zIndex: 100,
                                color: "white",
                              }}
                            >
                              <div
                                className="icons-cont-inner"
                                style={{
                                  width: fullScrc ? "98%" : "",
                                }}
                              >
                                {/* person's name & role */}
                                <SpeakerNames
                                  test={1}
                                  wc_uids={wc_uids}
                                  moderator={moderator}
                                  userid={toggleUser["uid"]}
                                  stage_uids={stage_uids}
                                  roleSize={roleSize}
                                  nameSize={nameSize}
                                />
                              </div>
                            </div>
                          </AgoraVideoPlayer>
                        </>
                      ) : (
                        <NoVideoNew
                          user_length={users.length}
                          stage_uids={stage_uids}
                          username={client_uid}
                          wc_uids={wc_uids}
                          role={role}
                          toggle={true}
                          test={test}
                        >
                          {JSON.parse(localStorage.getItem("join_rt"))[
                            "moderator"
                          ]["username"] === current_user.username ||
                          !role === "panellist" ||
                          !users.length > 0 ? null : (
                            <ModeratorContols
                              user_uid={client.uid}
                              mic_status={client.audioTrack ? true : false}
                              wc_uids={wc_uids}
                              handle_wildcard_removal={handle_wildcard_removal}
                              moderatorActions={moderatorActions}
                              role={role}
                              disableInteraction={disableInteraction}
                            />
                          )}
                        </NoVideoNew>
                      )}
                      {/* toggle ends here------------------ */}
                    </>
                  )}
                </>
              )}
            </>
          )}
          {isSpeakerAccess(role) && <TimerLoader timerLoaderRef={timerLoaderRef} />}
        </div>
      </>
    );
  };


  useEffect(() => {
    const element = document.getElementById('outerkk1-id');
    const handleScroll = (e) => {
      const parentElement = e.currentTarget;
      const childElement = parentElement.querySelector('#non-miniRT-container');
      if(childElement){
        const {bottom} = childElement?.getBoundingClientRect();
        if(bottom < 85 && !showMiniRT){
          setshowMiniRT(true)
        }else{
          setshowMiniRT(false)
        }
      }
    };

    element.addEventListener('scroll', handleScroll);
    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [])

  const nameSize = windowWidth < 769 ?? "0.75rem"
  const roleSize = windowWidth < 769 ?? "0.75rem";
  

  return (
    <div
      style={{
        height: !visible ? "calc(100vh - 0.2rem)" : "calc(100vh - 4.2rem)",
      }}
    >
      <div
        className={`main-outer-container-rt rtDescription`}
        style={fullScrc ? style5 : style6}
      >
        <div className="d-flex main-inner-rt" style={{ paddingRight: "0px" }}>
          {users && (
            <>
              <div
                ref={maincontRef}
                id="idForFull"
                className="left-panel-container-new"
                style={{
                  position: "relative",
                  height: fullScrc ? "92vh" : "",
                  width: fullScrc ? "100%" : "",
                  marginLeft: !fullScrc && windowWidth > 768 ? "1.15rem" : "",
                }}
              >
                {renderRtVideoGrid()}

                {/* This is wildcard message container below grid */}
                {wmData.length > 0 && !fullScrc && (
                  <div
                    style={{
                      width: fullScrc ? "100%" : "",
                      marginTop: windowWidth > 768 ? "0px" : "10px",
                    }}
                  >
                    <WildMessage wmData={wmData} windowWidth={windowWidth} />
                  </div>
                )}

                {!fullScrc && (
                  <>
                    <RTProfile
                      hideSection={hideSection}
                      hideFull={hideFull}
                      rt_data={single_rt_data?.data}
                      rt_id={rt_id}
                      like={like}
                      setLike={setLike}
                      dislike={dislike}
                      setDislike={setDislike}
                      removeAction={removeAction}
                      getLikeDislikeCount={getLikeDislikeCount}
                      btnDisable={btnDisable}
                      setBtnDisable={setBtnDisable}
                    />
                  </>
                )}

                {fullScrc && (
                  <div
                    className="bottomRow"
                    ref={bottomRef}
                    style={{ position: "relative", zIndex: "999999999" }}
                  >
                    <div className="innerBottomRow">
                      <div className="iconDiv">
                        {rt_type !== "RECORDING_BASED" && (
                          <>
                            {rt_type !== "AUDIO_STREAMING" &&
                              tracks?.length !== 0 &&
                              ready &&
                              start && (
                                <Button
                                  onClick={() => mute("video")}
                                  disabled={disableButton}
                                  style={{ color: "#fff" }}
                                >
                                  {video_btn ? (
                                    <VideocamIcon style={{ color: "#fff" }} />
                                  ) : (
                                    <VideocamOffIcon
                                      style={{ color: "#fff" }}
                                    />
                                  )}
                                </Button>
                              )}
                            {tracks?.length !== 0 && (
                              <div
                                className={`btn${
                                  disableButton ? "disable-div" : ""
                                }`}
                                onClick={() => mute("audio")}
                              >
                                {audio_btn ? (
                                  <img
                                    className="iconB icon3"
                                    src={micOnBottom}
                                    alt=""
                                    style={{ height: "25px" }}
                                  />
                                ) : (
                                  <img
                                    className="iconB icon4"
                                    src={micOffBottom}
                                    alt=""
                                    style={{ height: "25px" }}
                                  />
                                )}
                              </div>
                            )}
                            {tracks?.length !== 0 && (
                              <div
                                className="btn"
                                onClick={() => shareScreen()}
                              >
                                {screenSharing ? (
                                  <img
                                    className="iconB icon5"
                                    src={cancelPresentBottom}
                                    alt=""
                                    style={{ height: "25px" }}
                                  />
                                ) : (
                                  <img
                                    className="iconB icon6"
                                    src={presentBottom}
                                    alt=""
                                    style={{ height: "25px" }}
                                  />
                                )}
                              </div>
                            )}
                          </>
                        )}
                        <div className="btn">
                          <AudienceVolumeController
                            volume={volume}
                            setVolume={setVolume}
                          />
                        </div>

                        {wmData.length > 0 && (
                          <Badge
                            sx={{
                              "& .MuiBadge-badge": {
                                color: "white",
                                backgroundColor: "#EC5A61",
                              },
                            }}
                            badgeContent={wmData.length ?? 0}
                            max={99}
                          >
                            <span onClick={() => setShowWildcardInFullscr((prev) => !prev)} style={{cursor: "pointer"}}>
                            <WildCardMsgIcon />
                            </span>
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div
                      className="iconB icon7"
                      onClick={(e) => closeFullscreen(e)}
                    >
                      <img
                        src={cancleFull}
                        alt=""
                        style={{
                          height: "30px",
                          position: "absolute",
                          right: "2rem",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              {show_viewers && (
                <div
                  className={`border full-viewer rightMain ${
                    windowWidth < 1200
                      ? !hideFull && !hideSection
                        ? "halfVH"
                        : "fullVh"
                      : ""
                  }`}
                  style={{
                    display: fullScrc ? "none" : "flex",
                    flexDirection: "column",
                    position: audienceInteractionPosition.position,
                    right: audienceInteractionPosition.right,
                    position: windowWidth < 769 ? "relative" : "fixed",
                  }}
                  id="audience-interaction-box"
                >
                  {showMiniRT && (
                    <MiniViewRT>
                      {renderRtVideoGrid({ miniRT: true })}
                    </MiniViewRT>
                  )}
                  {rtTimer <= "00:05:00" && !was_extended && (
                    <ExtendRTNotifications
                      rtExtended={was_extended}
                      timer={rtTimer}
                      isShowButton={isShowExtendButton}
                    />
                  )}
                  {was_extended && (
                    <ExtendRTNotifications
                      rtExtended={was_extended}
                      timer={Number(extendedTime?.["timeValue"]?.["value"])}
                    />
                  )}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      width: "100%",
                      height: "100%",
                      // paddingLeft: "8px",
                      // paddingRight: "8px",
                    }}
                  >
                    <div className="audience-panel-line">
                      <div className="audience-interaction-div">
                        <strong style={{ color: "black", fontSize: "20px" }}>
                          {window.innerWidth < 768 ? (
                            <>
                              <TimeImg
                                src={Viewers}
                                style={{
                                  marginLeft: "5px",
                                  marginRight: "5px",
                                }}
                              />
                              &nbsp;
                            </>
                          ) : null}
                          {allWords.misc.livert.interac}
                        </strong>
                      </div>
                      <div className="mobile-audience-interaction justify-content-center align-items-center">
                        {rtTypeBased !== "RECORDING_BASED" && (
                          <RaiseHand
                            role={role}
                            rtm_channel={rtm_channel}
                            handle_wildcard_removal={handle_wildcard_removal}
                            /* disabledChat={disablePanelChat} */
                          />
                        )}
                        <div style={{ marginTop: "-0.5rem" }}>
                          <Volume volume={volume} setVolume={setVolume} />
                        </div>

                        <div className="px-2 videojs-audience">
                          <FullScreenIcon
                            style={
                              isAudienceInteractionExpanded
                                ? { transform: "rotate( 0deg)" }
                                : { transform: "rotate(180deg)" }
                            }
                            onClick={() =>
                              setIsAudienceInteractionExpanded(
                                !isAudienceInteractionExpanded
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                    {!disableInteraction ? (
                      <>
                        <div
                          className={
                            hideFull === true
                              ? "liveRightSide liveMain hideFullTL"
                              : hideSection === true
                              ? "liveRightSide liveMain hideSectionTL"
                              : "liveRightSide liveMain hideSectionFL"
                          }
                          style={{
                            position: "relative",
                            border: "1px solid #dbdcdd",
                            mt:
                              windowWidth < 1200
                                ? windowWidth >= 768 && windowWidth < 1200
                                  ? "10px !important"
                                  : 10
                                : 0,
                          }}
                        >
                          <div className="audience-panel-line d-flex">
                            <h4
                              style={{
                                color: "black",
                                fontSize: "1.095rem",
                                minWidth: "fit-content",
                              }}
                            >
                              <TimeImg
                                className="mobViewAud"
                                src={Viewers}
                                style={{
                                  marginLeft: "2px",
                                  marginRight: "5px",
                                }}
                              />

                              {`${allWords.misc.livert.interac}`}
                            </h4>

                            <div className="audBtns">
                              <IconButton
                                onClick={() => {
                                  setHideFull(!hideFull);
                                  setHideSection(false);
                                }}
                              >
                                <AspectRatio />
                              </IconButton>

                              <IconButton
                                onClick={() => {
                                  setHideSection(!hideSection);
                                  setHideFull(false);
                                }}
                              >
                                <ExpandMore />
                              </IconButton>
                            </div>
                          </div>

                          <div
                            className="liveAudInt"
                            style={{
                              backgroundColor: "#FAFAFA",
                              height:
                                hideFull === true
                                  ? "92vh"
                                  : hideSection === true
                                  ? "57vh"
                                  : "",
                            }}
                          >
                            {windowWidth >= 1200 ? (
                              <AllPosts
                                chatReply={chatReply}
                                setChatReply={setChatReply}
                                replyingId={replyingId}
                                setReplyingId={setReplyingId}
                                current_user={current_user}
                                rtm_channel={rtm_channel}
                                rt_id={rt_id}
                                moderatorActions={moderatorActions}
                                setWCList={setWCList}
                                role={role}
                                all_members={all_members}
                                wc_uids={wc_uids}
                                handle_wildcard_removal={
                                  handle_wildcard_removal
                                }
                                before_star
                                star_viewer
                                post_id_list={post_id_list}
                                setPostIdList={setPostIdList}
                                mod_pan_list={mod_pan_list}
                                interactionData={interactionData}
                                muteUser={muteUser}
                                setMuteMsg={setMuteMsg}
                                mute_msg={mute_msg}
                                mute_id={mute_id}
                                setMuteUsername={setMuteUsername}
                                day_duration={day_duration}
                                hour_duration={hour_duration}
                                single_rt_data={single_rt_data?.data}
                              />
                            ) : (
                              <>
                                {hideFull === true ? (
                                  <>
                                    <AllPosts
                                      chatReply={chatReply}
                                      setChatReply={setChatReply}
                                      replyingId={replyingId}
                                      setReplyingId={setReplyingId}
                                      current_user={current_user}
                                      rtm_channel={rtm_channel}
                                      rt_id={rt_id}
                                      moderatorActions={moderatorActions}
                                      setWCList={setWCList}
                                      role={role}
                                      all_members={all_members}
                                      wc_uids={wc_uids}
                                      handle_wildcard_removal={
                                        handle_wildcard_removal
                                      }
                                      before_star
                                      star_viewer
                                      post_id_list={post_id_list}
                                      setPostIdList={setPostIdList}
                                      mod_pan_list={mod_pan_list}
                                      interactionData={interactionData}
                                      muteUser={muteUser}
                                      setMuteMsg={setMuteMsg}
                                      mute_msg={mute_msg}
                                      mute_id={mute_id}
                                      setMuteUsername={setMuteUsername}
                                      day_duration={day_duration}
                                      hour_duration={hour_duration}
                                      single_rt_data={single_rt_data?.data}
                                    />
                                  </>
                                ) : (
                                  <>
                                    {hideSection === false ? (
                                      <>
                                        <PastPost
                                          interactionData={interactionData}
                                        />
                                      </>
                                    ) : (
                                      <AllPosts
                                        chatReply={chatReply}
                                        setChatReply={setChatReply}
                                        replyingId={replyingId}
                                        setReplyingId={setReplyingId}
                                        current_user={current_user}
                                        rtm_channel={rtm_channel}
                                        rt_id={rt_id}
                                        moderatorActions={moderatorActions}
                                        setWCList={setWCList}
                                        role={role}
                                        all_members={all_members}
                                        wc_uids={wc_uids}
                                        handle_wildcard_removal={
                                          handle_wildcard_removal
                                        }
                                        before_star
                                        star_viewer
                                        post_id_list={post_id_list}
                                        setPostIdList={setPostIdList}
                                        mod_pan_list={mod_pan_list}
                                        interactionData={interactionData}
                                        muteUser={muteUser}
                                        setMuteMsg={setMuteMsg}
                                        mute_msg={mute_msg}
                                        mute_id={mute_id}
                                        setMuteUsername={setMuteUsername}
                                        day_duration={day_duration}
                                        hour_duration={hour_duration}
                                        single_rt_data={single_rt_data?.data}
                                      />
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                          <div
                            style={{
                              position: "absolute",
                              left: "0.75rem",
                              bottom: "4.375rem",
                              width: "24rem",
                              height: "auto",
                              maxHeight: "37rem",
                              overflowY: "scroll",
                            }}
                            hidden={
                              windowWidth <= 1200
                                ? hideFull === true
                                  ? false
                                  : hideSection === false
                                  ? true
                                  : false
                                : false
                            }
                          >
                            {interactionData
                              ?.filter((item) => item?.is_deleted !== 1)
                              ?.filter((item) => item?.muted !== 1)
                              ?.map((item, ind) => (
                                <div key={item?.post_id}>
                                  {item?.type === "POLL_ROUNDTABLE" ? (
                                    <RTPollComponent
                                      indexVal={ind}
                                      username={item?.username}
                                      name={item?.name}
                                      polling_data={item?.polling_data}
                                      type={item?.type}
                                      current_user={current_user}
                                      pollExpireTime={
                                        new Date(item?.polling_data?.end_date)
                                      }
                                      day_duration={day_duration}
                                      hour_duration={hour_duration}
                                      post_id={item?.post_id}
                                      rt_id={rt_id}
                                      posted_at={item?.posted_at}
                                      single_rt_data={single_rt_data?.data}
                                      total={total}
                                      setTotal={setTotal}
                                      userId={item?.user_id}
                                      setPollFlag={setPollFlag}
                                    />
                                  ) : (
                                    ""
                                  )}
                                </div>
                              ))}
                          </div>

                          <div
                            className={
                              hideFull === false
                                ? hideSection === false
                                  ? "hideSecT"
                                  : "hideSecF"
                                : "hideFF"
                            }
                            style={{
                              position: "absolute",
                              bottom: 0,
                              left: "0px",
                              right: "0",
                              width: "100%",
                            }}
                            hidden={disableInteraction}
                          >
                            <AddUserInteraction
                              rt_id={rt_id}
                              mute_id={mute_id}
                              username={current_user.username}
                              current_user={current_user}
                              single_rt_data={single_rt_data?.data}
                              setDayDuration={setDayDuration}
                              setHourDuration={setHourDuration}
                              interactionData={interactionData}
                              total={total}
                              rttime={rttime}
                              heightFromTop={heightFromTop}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <PreRtUI
                        setDisableInteraction={setDisableInteraction}
                        start_time={start_time}
                        client={client}
                        rt_id={rt_id}
                        ref={timerLoaderRef}
                      />
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div
          hidden={hideFull || hideSection || fullScrc}
          className="recommended-rt-container"
        >
          {/* <div
            hidden={
              true
            }
            style={{
              backgroundColor: "#E4E9F0",
              borderRadius: "10px",
              padding: "10px",
              margin: "10px",
              userSelect: "text",
            }}
          >
            <ReadMoreReadLess
              children={rtDesc}
              txtSlice={80}
              txtLength={72}
              txtColorM="#66B984"
              txtColorL="#66B984"
              label="rt"
            />
          </div>
          <br /> */}
          <RecommendedRT recommendData={ownRecommendData} label="owner" />
          {modRecommendData?.length > 0 && (
            <RecommendedRT recommendData={modRecommendData} label="moderator" />
          )}
          <br /> <br />
        </div>
      </div>
      <WildcardConfirmation
        open={wc_openDialog}
        discard={discardWildcard}
        confirm={confirmedWildcard}
      />
      <PreloginComp
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        icon={
          <PersonIcon
            color={"success"}
            style={{
              width: "40px",
              height: "40px",
            }}
          />
        }
        title={modalTitle}
        description={""}
      />

      {rttime <= "00:00:17" &&
        single_rt_data?.data?.[0]?.["outro_url"] !== undefined && (
          <video
            id="ovideo_id_button"
            className="ioVideoClass"
            src={`${single_rt_data?.data?.[0]?.["outro_url"]}`}
            ref={vRef}
            muted
            hidden
            style={{ display: "none" }}
            onLoadedMetadata={() => {
              const video = vRef.current;
              if (!video) return;
              setEndDur(video?.duration);
            }}
          />
        )}

      {chatReply && replyingId && <ViewerReply {...replyingId} />}

      {/* {fullScrc && <div className="bottomRow" ref={bottomRef}
        style={{ position: "relative" }}
      >
        <div className="innerBottomRow">
          <div className="iconDiv">

            {rt_type !== "AUDIO_STREAMING" && (<div
              className="btn"
              onClick={() => mute("video")}

            >
              {video_btn ? <img className="iconB icon1" src={cameraBottom} alt="" style={{ height: "25px" }} /> : <img className="iconB icon2" src={cameraOffBottom} alt="" style={{ height: "25px" }} />}
            </div>)}
            <div
              className="btn"
              onClick={() => mute("audio")}
            >
              {audio_btn ? <img className="iconB icon3" src={micOnBottom} alt="" style={{ height: "25px" }} /> : <img className="iconB icon4" src={micOffBottom} alt="" style={{ height: "25px" }} />}
            </div>
            <div
              className="btn"
              onClick={() => shareScreen()}
            >
              {audio_btn ? <img className="iconB icon5" src={presentBottom} alt="" style={{ height: "25px" }} /> : <img className="iconB icon6" src={cancelPresentBottom} alt="" style={{ height: "25px" }} />}
            </div>
          </div>
        </div>
        <div className="iconB icon7"
          onClick={() => dispatch({ type: "notFull" })}
        ><img src={cancleFull} alt="" style={{ height: "30px", position: "absolute", right: "2rem" }} /></div>
      </div>
      } */}
    </div>
  );
}
