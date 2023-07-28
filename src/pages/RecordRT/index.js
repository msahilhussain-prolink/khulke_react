import React, { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "agora-rtc-sdk-ng";
import { createInstance } from "agora-rtm-sdk";
import VideoGrid from "./VideoGrid";
import {
  AGORA_APP_ID,
  REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1,
  REACT_APP_BASE_URL_FOR_USER,
  RECORDING_PASSWORD,
  RECORDING_USERNAME,
  STATIC_TOKEN,
} from "../../constants/env";
import axios from "axios";
import { auto_login_continue, get_encrypted_password } from "../../utils/utils";
// import { useClient_RTM } from "../AgoraSandbox/settings";
import logger from "../../logger";
// import { useClient_RTM } from "../AgoraSandbox/settings";

const RecortRT = () => {
  const url_params = new URL(window.location.href);
  const channelName = url_params.searchParams.get("rt-id");

  const [users, setUsers] = useState([]);
  const [rt_data, setRTData] = useState(null);
  const [initiated, setInitiated] = useState(false);
  const [rtm_channel, setRTMChannel] = useState(null);

  const usersRef = useRef();
  usersRef.current = users;
  // agora configration
  const config = {
    mode: "live",
    codec: "h264",
    appId: AGORA_APP_ID,
    token: rt_data?.data?.[0]?.agora_token,
  };

  const useClient_RTM = createInstance(AGORA_APP_ID, {
    enableLogUpload: false,
  });

  const useClient = createClient(config);
  const client = useClient;

  const getSingleRTData = (token) => {
    var config = {
      method: "get",
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1}/get-single-roundtable/${channelName}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios(config)
      .then(function (response) {
        setRTData(response.data);
      })
      .catch(async (e) => {
        const res = e.response;
        if (!res) return;

        if (res.status === 401) {
          return await auto_login_continue(() =>
            getSingleRTData(localStorage.getItem("access"))
          );
        }
      });
  };

  const getUserToken = async () => {
    const password = await get_encrypted_password(RECORDING_PASSWORD);
    var data = JSON.stringify({
      username: RECORDING_USERNAME,
      password,
    });
    var config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/auth/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: STATIC_TOKEN,
      },
      data: data,
    };

    axios(config).then(function (response) {
      localStorage.setItem("current_user", JSON.stringify(response.data));
      localStorage.setItem("access", response.data.access);
      getSingleRTData(response.data.access);
    });
  };

  const getRTMToken = async () => {
    var configuration = {
      method: "get",
      url: `${REACT_APP_BASE_URL_FOR_USER}/agora_rtm_token`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
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
      .catch();
  };

  useEffect(() => {
    getUserToken();
  }, []);

  function handleUserAddEvents(user) {
    setUsers((prevUsers) => {
      if (!prevUsers.find((elem) => elem.uid === user.uid)) {
        return [...prevUsers, user];
      } else {
        return [...prevUsers];
      }
    });
  }

  useEffect(async () => {
    if (!channelName || !client) return;
    let init = async (name) => {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);

        if (mediaType === "audio") {
          user.audioTrack.play();
        }

        handleUserAddEvents(user);
      });

      client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "audio") {
          if (user.audioTrack) user.audioTrack.stop();
          handleUserAddEvents(user);
        }
        if (mediaType === "video") {
          handleUserAddEvents(user);
        }
      });

      client.on("user-left", (user) => {
        let temp = [...usersRef.current];
        let newUsers = temp.filter((User) => User.uid !== user.uid);
        setUsers(newUsers);
      });

      client.on("user-joined", (user) => {
        handleUserAddEvents(user);
      });

      try {
        await client.join(config.appId, name, config.token, RECORDING_USERNAME);
        setInitiated(true);
      } catch (error) {}
    };

    if (initiated) return;

    await getRTMToken();

    useClient_RTM
      .login({
        token: JSON.parse(localStorage.rtm_token)["rmttokens"],
        uid: RECORDING_USERNAME,
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

    init(channelName);

    return () => {
      try {
        rtm_channel.leave();
        useClient_RTM.logout();
      } catch (err) {}
    };
  }, [channelName, client]);

  return (
    <VideoGrid
      users={users}
      moderator={rt_data?.data?.[0]?.moderator.username}
      panelists={rt_data?.data?.[0]?.speakers}
      rt_data={rt_data}
      end_time={rt_data?.data?.[0]?.end}
      rtm_channel={rtm_channel}
      useClient_RTM={useClient_RTM}
    />
  );
};

export default RecortRT;
