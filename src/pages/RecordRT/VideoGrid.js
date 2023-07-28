// import { AgoraVideoPlayer } from "agora-rtc-react";
import { Grid } from "@material-ui/core";
import { POST_API_BASE_URL } from "../../constants/env";
import { useEffect, useRef, useState } from "react";
import RecordSharedScreen from "./RecordSharedScreen";
import AgoraVideoPlayer from "../../components/AgoraVideoPlayer/AgoraVideoPlayer";
// import KhulKeLogo from "../../assets/icons/KhulKe_logo.svg";
import "./videoGrid.css";
import UserProfile from "../../components/UserProfile";
import { globalImages } from "../../assets/imagesPath/images";
import moment from "moment";

export default function Video(props) {
  const {
    users,
    moderator,
    panelists,
    rt_data,
    end_time,
    rtm_channel,
    useClient_RTM,
  } = props;

  const [screenSharing, setScreenSharing] = useState(false);
  const [screenUser, setScreenUser] = useState();
  const [screenTrack, setScreenTrack] = useState();
  const [logoCount, setLogoCount] = useState(0);
  const [logoUrl, setLogoUrl] = useState([]);
  const [showIntro, setShowIntro] = useState(false);
  const [showLabel, setShowLabel] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [endDur, setEndDur] = useState(15);
  const [rtEndTime, setRtEndTime] = useState("");
  const [data, setData] = useState([]);
  const [te, setTe] = useState(0);
  const vgRef = useRef(null);
  const vRef1 = useRef(null);

  const endtime_local_ref = useRef();
  endtime_local_ref.current = rtEndTime;

  function getTimeRemaining(end_time) {
    var timeout = new Date(end_time).getTime();
    var now = new Date().getTime();
    const total = timeout - now;
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return {
      total,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  //EFFECTS HERE

  const endTimeEvent = (message, _memberId) => {
    const data = message.text.split("||");
    console.log({ rtss: data });
    setData(data);
  };

  useEffect(() => {
    if (!rtm_channel) return;

    rtm_channel?.on("ChannelMessage", endTimeEvent);

    return () => {
      rtm_channel?.off("ChannelMessage", endTimeEvent);
    };
  }, [rtm_channel]);

  useEffect(() => {
    if (rt_data?.data?.[0]?.["outro_url"] !== undefined) {
      if (data?.length > 0) {
        if (data[0] === "ownerendrt") {
          if (rt_data?.data?.[0]?.["outro_url"] !== undefined) {
            setShowIntro(true);
            setVideoUrl(rt_data?.data?.[0]?.["outro_url"]);
            setShowLabel("OUTRO");
          } else setShowIntro(false);
        }

        if (data[0] === "renewself") {
          setRtEndTime(
            moment(
              new Date(endtime_local_ref.current).getTime() +
                Number(data[2]) * 60000
            )
              .local()
              .format()
              .split("+")[0]
          );
        }
      }

      if (data[0] !== "ownerendrt" && data[0] !== "renewself") {
        if (
          moment(new Date(rt_data?.data?.[0]?.["end"])).diff(
            new Date(rt_data?.data?.[0]?.["start"]),
            "seconds"
          ) < 1
        ) {
          setShowIntro(true);
          setVideoUrl(rt_data?.data?.[0]?.["outro_url"]);
          setShowLabel("OUTRO");
        }
      }
    }
  }, [data, rt_data]);

  useEffect(() => {
    if (rt_data) {
      let temp_data = rt_data?.data?.[0];

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

      let timeElapsed = 0;
      const timer = setInterval(() => {
        timeElapsed =
          (new Date().getTime() -
            new Date(rt_data?.data?.[0]?.["start"])?.getTime()) /
          1000;

        setTe(timeElapsed);
      }, 1000);

      if (rt_data?.data?.[0]?.["intro_url"] !== undefined) {
        if (Math.round(te) > -1) {
          if (Math.round(te) < Math.round(endDur) + 1) {
            setShowIntro(true);
            setVideoUrl(rt_data?.data?.[0]?.["intro_url"]);
            setShowLabel("INTRO");
          } else {
            setShowIntro(false);
            setVideoUrl("");
            setShowLabel("");
          }
        }
      }

      return () => {
        clearInterval(timer);
      };
    }
  }, [rt_data, endDur]);

  const startTimer = (end_time) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(end_time);

    if (total >= 0) {
      if (hours < 10) {
        hours = "0" + String(hours);
      }
      if (minutes < 10) {
        minutes = "0" + String(minutes);
      }
      if (seconds < 10) {
        seconds = "0" + String(seconds);
      }
    }

    setRtEndTime(hours + ":" + minutes + ":" + seconds);
  };

  console.log({ rtEndTime, data });
  useEffect(() => {
    var id = "";
    id = setInterval(() => {
      startTimer(end_time);
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [end_time]);

  useEffect(() => {
    if (!users) return;
    const screen = users.find((elem) => elem.uid.split("-")[1] === "screen");
    if (screen) {
      setScreenSharing(true);
      setScreenTrack(screen.videoTrack);
      setScreenUser(
        users.find((elem) => elem.uid === screen.uid.split("-")[0])
      );
    } else {
      setScreenSharing(false);
      setScreenTrack();
      setScreenUser();
    }
  }, [users]);

  const calculateStyles = (index) => {
    let height;
    let width;

    const rows = users.length > 2 ? 2 : 1;

    height = `${100 / rows}%`;

    if (users.length === 1) {
      width = "100%";

      return { width, height };
    }

    if (users.length <= 4) {
      width = `50%`;

      return { width, height };
    }

    if (users.length > 4) {
      width = "33.33%";

      return { width, height };
    }
  };

  const showRole = (user) => {
    return (
      <p
        style={{
          color: "white",
          position: "absolute",
          zIndex: 99999,
          bottom: "5px",
          left: "5px",
          backgroundColor: "grey",
          padding: "2px 5px",
          borderRadius: "2px",
        }}
      >
        @{user.uid}
        {moderator === user.uid
          ? " [MODERATOR]"
          : panelists?.find(
              (val) => val.username === user.uid && val.type === "NORMAL"
            )
          ? " [PANELIST]"
          : " [WILDCARD]"}
      </p>
    );
  };

  return (
    <>
      <Grid
        container
        style={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "#191919",
        }}
        justifyContent="center"
        alignItems="center"
      >
        <Grid
          container
          style={{
            aspectRatio: "16/9",
            height: "100%",
            borderRadius: "10px",
            width: "auto",
            maxWidth: "100%",
            border: "1px solid black",
            position: "relative",
          }}
          justifyContent="center"
          alignItems="center"
        >
          {/* <img
          alt=""
          src={globalImages.logo}
          style={{
            position: "absolute",
            right: "15px",
            top: "15px",
            maxWidth: "50px",
            zIndex: "1",
          }}
        /> */}
          {/* MultiLogo absolute positioned Div */}
          <>
            {/* top right */}
            <img
              id="logo1"
              src={logoUrl?.[0]?.["logo2"]}
              style={{
                position: "absolute",
                right: "15px",
                top: "15px",
                maxWidth: "50px",
                zIndex: "1",
              }}
              hidden={logoCount === 0 ? true : false}
              alt=""
            />
            {/* top left */}
            <img
              id="logo1"
              src={logoUrl?.[1]?.["logo3"]}
              style={{
                position: "absolute",
                left: "15px",
                top: "15px",
                maxWidth: "50px",
                zIndex: "1",
              }}
              hidden={logoCount === 0 || logoCount === 1 ? true : false}
              alt=""
            />
            {/* bottom left */}
            <img
              id="logo1"
              src={logoUrl?.[2]?.["logo1"]}
              style={{
                position: "absolute",
                left: "15px",
                bottom: "120px",
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
            {/* bottom right */}
            <img
              id="logo1"
              src={globalImages.logo}
              style={{
                position: "absolute",
                right: "15px",
                bottom: "15px",
                maxWidth: "50px",
                zIndex: "1",
              }}
              // hidden={logoCount === 0 ? true : false}
              alt=""
            />
          </>

          {showIntro === true ? (
            <>
              <div className="ioContainer">
                <video
                  muted
                  preload
                  autoPlay
                  id="video_id_button"
                  className="ioVideoClass"
                  src={`${videoUrl}#t=${0},${endDur}`}
                  ref={vgRef}
                  // controls
                  onEnded={() => {
                    setShowIntro(false);
                    setShowLabel("");
                    setEndDur(0);
                    if (showLabel === "OUTRO") {
                      rtm_channel.leave();
                      useClient_RTM.logout();
                    }
                  }}
                  onLoadedMetadata={() => {
                    const video = vgRef.current;
                    if (!video) return;
                    setEndDur(video?.duration);
                  }}
                />
                <div className="txtCenter"> {showLabel} </div>
              </div>
            </>
          ) : (
            <>
              {screenSharing && screenUser && screenTrack && (
                <RecordSharedScreen
                  screenUser={screenUser}
                  screenTrack={screenTrack}
                  role={showRole(screenUser)}
                />
              )}

              {users.length > 0 &&
                !screenSharing &&
                users.map((user, index) => {
                  if (user.videoTrack) {
                    return (
                      <Grid
                        item
                        style={{
                          ...calculateStyles(index + 1),
                          position: "relative",
                          border: "1px solid #959591",
                        }}
                        key={user.uid}
                      >
                        <AgoraVideoPlayer
                          videoTrack={user.videoTrack}
                          key={user.uid}
                          style={{
                            height: "100%",
                            width: "100%",
                          }}
                        />

                        {showRole(user)}
                      </Grid>
                    );
                  } else {
                    return (
                      <Grid
                        item
                        style={{
                          backgroundColor: "#161f3a",
                          ...calculateStyles(index + 1),
                          position: "relative",
                          border: "1px solid #959591",
                          background: "#191919",
                        }}
                        key={user.uid}
                      >
                        <Grid
                          container
                          justifyContent="center"
                          alignItems="center"
                          style={{
                            height: "100%",
                            width: "100%",
                          }}
                        >
                          <Grid item>
                            <UserProfile
                              username={user?.uid}
                              height="120px"
                              width="120px"
                              borderRadius="100%"
                              objectFit="contain"
                            />
                          </Grid>
                        </Grid>
                        {showRole(user)}
                      </Grid>
                    );
                  }
                })}
            </>
          )}
        </Grid>
      </Grid>

      {rtEndTime <= "00:00:17" &&
        rt_data?.data?.[0]?.["outro_url"] !== undefined && (
          <video
            id="ovideo_id_button"
            className="ioVideoClass"
            src={`${rt_data?.data?.[0]?.["outro_url"]}`}
            ref={vRef1}
            muted
            hidden
            style={{ display: "none" }}
            onLoadedMetadata={() => {
              const video = vRef1.current;
              if (!video) return;
              setEndDur(video?.duration);
            }}
          />
        )}
    </>
  );
}
