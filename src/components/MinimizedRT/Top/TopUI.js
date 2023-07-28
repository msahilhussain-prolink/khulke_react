import { IconButton } from "@material-ui/core";
import { Grid } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ExpandRoundtable,
  UpdateLiveRTClient,
} from "../../../redux/actions/minimizedRoundtable";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Speaker from "./Speaker";
import {
  BORDER_RADIUS,
  MODERATOR_ROLE,
  PANELIST_ROLE,
  WILDCARD_ROLE,
} from "../Constants";
import NameAndRole from "./NameAndRole";

import { addWildcard } from "../../../pages/AgoraSandbox/apicalls";
import SharedScreen from "../../../pages/AgoraSandbox/SharedScreen";
import ToastHandler from "../../../utils/ToastHandler";
import {
  MORE_THAN_TWO_SPEAKERS,
  ONE_SPEAKERS,
  rt_id,
  TWO_SPEAKERS,
} from "../../../pages/AgoraSandbox/settings";
import IntroOutroVideo from "../../IntroOutroVideo";
import RecordedRTVideo from "../../RecordedRTVideo";
import logger from "../../../logger";

export default forwardRef(function TopUi(
  {
    leaveChannel,
    showIntro,
    setShowIntro,
    showLabel,
    setShowLabel,
    videoUrl,
    setVideoUrl,
    single_rt_data,
    time,
    start,
  },
  ref
) {
  let current_user = null;
  try {
    current_user =
      JSON.parse(localStorage.getItem("current_user")) ||
      JSON.parse(localStorage.anonymous_user);
  } catch (err) {
    logger.info(" no current User");
  }

  //local states here
  const [height, setHeight] = useState("max");

  //speaker states
  const [wc_uids, setWcUids] = useState([]);
  const [mod, setMod] = useState();
  const [panel, setPanel] = useState([]);
  const [toggleUser, setToggleUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [renderState, setRenderState] = useState(false);
  const [updatedUsers, setUpdatedUsers] = useState(false);
  const [sharingScreen, setSharingScreen] = useState(false);
  const [endDur, setEndDur] = useState(15);
  const [introStart, setIntroStart] = useState(0);

  //constants here
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //store state selectors
  const rt_data = useSelector((state) => state.minimizedData.rt_data);
  const channel = useSelector((state) => state.minimizedData.channel);
  const client = useSelector((state) => state.minimizedData.client);
  const tracks = useSelector((state) => state.minimizedData.tracks);
  const useClient_RTM = useSelector(
    (state) => state.minimizedData.useClient_RTM
  );
  const Allusers = useSelector((state) => state.minimizedData.users);
  const volume = useSelector((state) => state.minimizedData.rt_data.volume);
  const localScreentrack = useSelector(
    (state) => state.minimizedData.localScreentrack
  );
  const localScreenAudiotrack = useSelector(
    (state) => state.minimizedData.localScreenAudiotrack
  );

  const screenClient = useSelector((state) => state.minimizedData.screenClient);
  const initialPanel = useSelector((state) => state.minimizedData.panelist);
  const initialWCUids = useSelector((state) => state.minimizedData.wc_uids);
  //do not remove this, it is used to cause re rendering whenever video or audio tracks State is changed
  const tracksState = useSelector((state) => state.minimizedData.tracksState);
  //speakeres refs
  //refs
  const vRef = useRef(null);

  const usersRef = useRef();
  usersRef.current = users;

  const toggleUserRef = useRef();
  toggleUserRef.current = toggleUser;

  const allUsersref = useRef();
  allUsersref.current = Allusers;

  const tracksRef = useRef();
  tracksRef.current = tracks;

  const modRef = useRef();
  modRef.current = mod;

  const panelRef = useRef();
  panelRef.current = panel;

  const wc_uidRef = useRef();
  wc_uidRef.current = wc_uids;

  const volumeRef = useRef();
  volumeRef.current = volume;

  const location = useLocation();

  //event handlers
  const expandRT = () => {
    localStorage.setItem("join_rt", JSON.stringify(rt_data));
    dispatch(
      ExpandRoundtable({
        rt_data,
        channel,
        client,
        tracks,
        allUsers: users,
        useClient_RTM,
        localScreentrack,
        localScreenAudiotrack,
        screenClient,
        volume,
      })
    );

    navigate("/roundtable/join", {
      state: {
        expanded: true,
        expandedFrom: location.pathname,
      },
    });
  };

  const introFunc = () => {
    let timeElapsed =
      (new Date().getTime() - new Date(start)?.getTime()) / 1000;
    if (timeElapsed <= 5 || timeElapsed >= endDur + 5) return;
    const startIntroAt = timeElapsed - 5;

    setShowIntro(true);
    setVideoUrl(single_rt_data?.data?.[0]?.["intro_url"]);
    setShowLabel("INTRO");

    setIntroStart(startIntroAt);
  };

  const outroFunc = () => {
    if (single_rt_data?.data?.[0]?.["outro_url"] !== undefined && time !== undefined && time !== null) {
      let t = time <= "00:00:00";
      if (t === false) {
        setShowIntro(false);
        setVideoUrl("");
        setShowLabel("");
      } else if (t !== false) {
        setShowIntro(true);
        setVideoUrl(single_rt_data?.data?.[0]?.["outro_url"]);
        setShowLabel("OUTRO");
      }
    }
  };

  const toggleHeight = () => {
    if (height === "max") {
      setHeight("min");
    } else {
      setHeight("max");
    }
    introFunc();
    outroFunc();
  };

  useEffect(() => {
    if (!channel) return;

    //event handler functions here
    const ChannelMessageEvents = async (message) => {
      const data = message.text.split("||");

      if (!data) return;

      if (data[0] === "ownerendrt") {
        ToastHandler("info", "Roundtable has been ended by " + data[1]);
        leaveChannel(true);
      }
    };

    channel.on("ChannelMessage", ChannelMessageEvents);

    //clenaup function here
    return () => {
      channel?.off("ChannelMessage", ChannelMessageEvents);
    };
  }, [channel]);

  //speakeres effects here
  useEffect(() => {
    if (!client) return;

    const moderator = rt_data?.moderator?.username;

    setMod(moderator);

    setWcUids(initialWCUids || []);
    const panelist = initialPanel?.map((item) => item.username);
    setPanel(panelist || []);
  }, [client, initialPanel, initialWCUids]);

  useEffect(() => {
    if (!client) return;

    //event handler functions
    const userPublishedEvent = async (user, mediaType) => {
      if (
        !panel.includes(user.uid) &&
        user.uid !== mod &&
        !wc_uids.includes(user.uid)
      ) {
        setWcUids((prev) => [...prev, user.uid]);
      }

      await client.subscribe(user, mediaType);

      if (mediaType === "audio") {
        if (volume || volume === 0) {
          user.audioTrack.setVolume(volumeRef.current);
        }
        user.audioTrack.play();
      }

      setUsers((prev) => {
        const alreadyPresent = prev.find((elem) => elem.uid === user.uid);

        if (alreadyPresent) return prev;

        return [...prev, user];
      });
    };

    const userLeftEvent = (user) => {
      setUsers((prev) => prev.filter((elem) => elem.uid !== user.uid));
      if (user.uid === toggleUser?.uid && !user.length == 0) {
        return setToggleUser(
          users.find((elem) => elem.uid !== toggleUser?.uid)
        );
      }

      if (calculateRole(client.uid)) {
        return setToggleUser(client);
      }

      setToggleUser();
    };

    const userJoinedEvent = (user) => {
      setUsers((prev) => {
        const alreadyPresent = prev.find((elem) => elem.uid === user.uid);

        if (alreadyPresent) return prev;

        return [...prev, user];
      });
    };

    const userInforUpdatedEvent = (user) => {
      setRenderState((prev) => !prev);
      setTimeout(() => {
        setRenderState((prev) => !prev);
      }, [1000]);
    };

    client.on("user-published", userPublishedEvent);

    client.on("user-left", userLeftEvent);

    client.on("user-joined", userJoinedEvent);

    client.on("user-info-updated", userInforUpdatedEvent);

    //cleanup function

    return () => {
      client?.off("user-published", userPublishedEvent);

      client?.off("user-left", userLeftEvent);

      client?.off("user-joined", userJoinedEvent);

      client?.off("user-info-updated", userInforUpdatedEvent);
    };
  }, [client]);

  useEffect(() => {
    if (!Allusers && !updatedUsers) return;
    setUsers(Allusers);
    setUpdatedUsers(true);
  }, [Allusers]);

  useEffect(() => {
    if (!users || toggleUser) {
      return;
    }

    if (calculateRole(client.uid)) {
      return setToggleUser(client);
    }

    setToggleUser(users[0]);
  }, [users, panel, wc_uids, mod]);

  useEffect(() => {
    client.enableAudioVolumeIndicator();
    client.on("volume-indicator", (volumes) => {
      const res = Math.max.apply(
        Math,
        volumes.map(function (o) {
          return o.level > 0 && o.level;
        })
      );
      if (res !== -Infinity) {
        const finding = volumes.find((i) => i.level === res);
        if (finding && finding.level > 0) {
          const loudestUser =
            usersRef.current.find((elem) => elem.uid === finding.uid) ||
            (client.uid === finding.uid && client);

          if (loudestUser?.uid === toggleUserRef.current.uid) {
            return;
          }

          setToggleUser(loudestUser);
        }
      } else {
        if (calculateRole(client.uid)) {
          return setToggleUser(client);
        } else {
          setToggleUser(usersRef.current[0]);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (!channel) return;

    const ChannelMessageEvents = async (message) => {
      const data = message.text.split("||");

      if (!data) return;

      if (
        data[0] === "accwildcard" &&
        calculateRole(client.uid) === MODERATOR_ROLE
      ) {
        addWildcard(rt_data.rt_id, data[1]);
        channel.sendMessage({ text: `accepted||${data[1]}` });
      }

      if (data[0] === `accepted`) {
        setWcUids((prev) => [...prev, data[1]]);
      }

      if (data[0] === `rejwildcard`) {
        if (calculateRole(client.uid) === MODERATOR_ROLE) {
          ToastHandler("info", `@${data[1]}  wildcard rejected`);
        }

        setWcUids((prev) => prev.filter((elem) => elem !== data[1]));
        setUsers((prev) => prev.filter((elem) => elem.uid !== data[1]));
      }

      if (data[0] === "rejected") {
        setWcUids((prev) => prev.filter((elem) => elem !== data[1]));
        setUsers((prev) => prev.filter((elem) => elem.uid !== data[1]));

        if (data[1] !== client.uid) return;
        try {
          await client.unpublish();
          tracksRef.current?.[0]?.close();
          tracksRef.current?.[1]?.close();
          await client.setClientRole("audience");
          dispatch(UpdateLiveRTClient({ tracks: undefined }));
        } catch (e) {
          console.error(e, e.message, "in TopUi.js upon removing wildcard");
        }
      }

      if (data[0] === "wcautodismiss") {
        if (calculateRole(client.uid) === MODERATOR_ROLE) {
          ToastHandler("info", "Not taken any action by wildcard.");
        }
      }
    };

    channel.on("ChannelMessage", ChannelMessageEvents);

    return () => {
      channel.off("ChannelMessage", ChannelMessageEvents);
    };
  }, [channel]);

  useEffect(() => {
    if (!updatedUsers) return;

    const screenUser = users.find(
      (elem) => elem.uid.split("-")[1] === "screen"
    );

    setSharingScreen(screenUser ? true : false);

    dispatch(UpdateLiveRTClient({ users: users }));
  }, [users]);

  useEffect(() => {
    if (tracks?.[1] && tracks?.[1]?.enabled) {
      tracks[1].setEncoderConfiguration(
        users.length + 1 === 1
          ? ONE_SPEAKERS
          : users.length + 1 === 2
          ? TWO_SPEAKERS
          : MORE_THAN_TWO_SPEAKERS
      );
    }
  }, [users, tracks?.[1]?.enabled]);

  //speakeres functions here

  //functions here
  const calculateRole = (id) => {
    if (modRef.current === id) {
      return MODERATOR_ROLE;
    } else if (panelRef.current.includes(id)) {
      return PANELIST_ROLE;
    } else if (wc_uidRef.current.includes(id)) {
      return WILDCARD_ROLE;
    } else {
      return "";
    }
  };

  //function to be called in parent to update child state directly
  useImperativeHandle(ref, () => ({
    updateWcUids(uid) {
      setWcUids((prev) => [...prev, uid]);
    },
  }));

  useEffect(() => {
    let timeElapsed =
      (new Date().getTime() - new Date(start)?.getTime()) / 60000;

    const handleIntro = () => {
      let timeElapsed =
        (new Date().getTime() - new Date(start)?.getTime()) / 60000;

      const timer = setTimeout(() => {
        if (single_rt_data?.data?.[0]?.["intro_url"] !== undefined) {
          setShowIntro(true);
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
        handleIntro();
      }, [timeOut * 1000]);

      return;
    }

    if (timeElapsed * 60 < 5 && timeElapsed > 0) {
      handleIntro();
    }
  }, []);

  useEffect(() => {
    if (single_rt_data?.data?.[0]?.["intro_url"] !== undefined) {
      introFunc();
    }
  }, []);

  useEffect(() => {
    outroFunc();
  }, [time]);

  return (
    <>
      <Grid
        container
        style={{
          position: "relative",
        }}
      >
        <Grid
          container
          justifyContent={"space-between"}
          style={
            height === "max"
              ? {
                  position: "absolute",
                  top: "0px",
                  zIndex: "2",
                }
              : {
                  backgroundColor: "#161f3a",
                  borderTopLeftRadius: BORDER_RADIUS,
                  borderTopRightRadius: BORDER_RADIUS,
                }
          }
        >
          <Grid item>
            <IconButton onClick={expandRT}>
              <OpenInFullIcon
                style={{
                  color: "white",
                }}
              />
            </IconButton>
          </Grid>
          {toggleUser && height !== "max" && (
            <Grid
              item
              style={{
                display: "flex",
                flexGrow: "1",
              }}
            >
              <NameAndRole
                role={calculateRole(toggleUser.uid)}
                name={toggleUser.uid}
                style={{
                  position: "relative",
                  top: "0px",
                  left: "0px",
                  justifyContent: "center",
                }}
              />
            </Grid>
          )}

          <Grid
            item
            sx={{
              marginLeft: "auto",
            }}
          >
            <IconButton onClick={toggleHeight}>
              {height === "max" ? (
                <ExpandMoreIcon
                  style={{
                    color: "white",
                  }}
                />
              ) : (
                <ExpandLessIcon
                  style={{
                    color: "white",
                  }}
                />
              )}
            </IconButton>
          </Grid>
        </Grid>
        {/* {height === "max" && ( */}
        <Grid item xs={12} style={{ display: height !== "max" ? "none" : "" }}>
          {single_rt_data?.data?.[0]?.["r_type"] === "RECORDING_BASED" ? (
            <>
              <RecordedRTVideo
                single_rt_data={single_rt_data}
                rt_id={single_rt_data?.data?.[0]?.["_id"]}
                current_user={current_user}
                minimized={true}
                volume={volume}
                ownerId={single_rt_data?.data?.[0]?.owner?.user_id}
              />
            </>
          ) : (
            <>
              {showIntro === true ? (
                <>
                  <IntroOutroVideo
                    introStart={introStart}
                    setShowIntro={setShowIntro}
                    videoUrl={videoUrl}
                    showLabel={showLabel}
                    setShowLabel={setShowLabel}
                    setEndDur={setEndDur}
                    endDur={endDur}
                    mini={true}
                  />
                </>
              ) : (
                <>
                  {sharingScreen ? (
                    <Grid
                      sx={{
                        aspectRatio: "16/9",
                      }}
                    >
                      <SharedScreen
                        users={users}
                        role={calculateRole(client.uid)}
                        rt_type={rt_data.rt_type}
                        moderator={{ username: mod }}
                        wc_uids={wc_uids}
                        stage_uids={panel}
                        client={client}
                        tracks={tracks}
                        miniScreen={true}
                      />
                    </Grid>
                  ) : (
                    <Speaker
                      users={users}
                      setUsers={setUsers}
                      calculateRole={calculateRole}
                      toggleUser={toggleUserRef.current}
                    />
                  )}
                </>
              )}
            </>
          )}
        </Grid>
        {/* )} */}
      </Grid>

      {time <= "00:00:17" &&
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
    </>
  );
});
