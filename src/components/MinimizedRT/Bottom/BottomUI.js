import { Grid, IconButton } from "@mui/material";
import { useEffect, useImperativeHandle, useState, forwardRef } from "react";
import { useSelector } from "react-redux";
import {
  BORDER_RADIUS,
  MODERATOR_ROLE,
  PANELIST_ROLE,
  SPEAKER_ROLE,
  VIDEO_RT,
  WILDCARD_ROLE,
} from "../Constants";
import Controls from "./Controls";
import RtInfo from "./RtInfo";
import LeaveIcon from "../../../assets/icons/close web.svg";

export default forwardRef(function BottomUi({ leaveChannel, setTime }, ref) {
  //states here
  const [role, setRole] = useState();
  const [wc_uids, setWcUids] = useState([]);
  const [mod, setMod] = useState();
  const [panel, setPanel] = useState([]);

  //store selectors
  const rt_data = useSelector((state) => state.minimizedData.rt_data);
  const client = useSelector((state) => state.minimizedData.client);
  const channel = useSelector((state) => state.minimizedData.channel);
  const initialPanel = useSelector((state) => state.minimizedData.panelist);
  const initialWCUids = useSelector((state) => state.minimizedData.wc_uids);

  //functions here
  const calculateRole = (id) => {
    if (mod === id) {
      return MODERATOR_ROLE;
    } else if (panel.includes(id)) {
      return PANELIST_ROLE;
    } else if (wc_uids.includes(id)) {
      return WILDCARD_ROLE;
    } else {
      return "";
    }
  };

  //event handler

  const userPublishedEvent = async (user, mediaType) => {
    if (
      !panel.includes(user.uid) &&
      user.uid !== mod &&
      !wc_uids.includes(user.uid)
    ) {
      setWcUids((prev) => [...prev, user.uid]);
    }
  };

  const ChannelMessageEvents = async (message) => {
    const data = message.text.split("||");

    if (!data) return;

    if (data[0] === "rejected") {
      if (data[1] !== client.uid) return;
      setRole("");
    }
  };

  useEffect(() => {
    if (!client) return;

    const moderator = rt_data?.moderator?.username;

    setMod(moderator);

    setWcUids(initialWCUids || []);

    const panelist = initialPanel?.map((item) => item.username);

    setPanel(panelist || []);
  }, [client, initialPanel, initialWCUids]);

  useEffect(() => {
    client.on("user-published", userPublishedEvent);

    //cleanup function

    return () => {
      client?.off("user-published", userPublishedEvent);
    };
  }, [client]);

  useEffect(() => {
    if (!client) return;
    if (calculateRole(client.uid)) {
      setRole(SPEAKER_ROLE);
    } else {
      setRole("");
    }
  }, [panel, wc_uids, mod, client]);

  useEffect(() => {
    if (!channel) return;

    channel.on("ChannelMessage", ChannelMessageEvents);

    //cleanup function
    return () => {
      channel.off("ChannelMessage", ChannelMessageEvents);
    };
  }, [channel]);

  //function to be called in parent to update child state directly
  useImperativeHandle(ref, () => ({
    updateWcUids(uid) {
      setWcUids((prev) => [...prev, uid]);
    },
  }));

  return (
    <Grid
      container
      justifyContent={"space-between"}
      style={{
        backgroundColor: "#f0f4f8",
        borderBottomLeftRadius: BORDER_RADIUS,
        borderBottomRightRadius: BORDER_RADIUS,
        padding: "10px 30px",
      }}
      alignItems={"center"}
    >
      <Grid item xs={role === SPEAKER_ROLE ? 8 : 11}>
        <RtInfo role={role} leaveChannel={leaveChannel} setTime={setTime} />
      </Grid>
      {role === SPEAKER_ROLE && (
        <Grid item xs={3}>
          <Controls video={rt_data?.rt_type === VIDEO_RT} />
        </Grid>
      )}
      <Grid item xs={1}>
        <IconButton
          onClick={leaveChannel}
          style={{
            padding: "0px",
          }}
        >
          <img
            src={LeaveIcon}
            style={{
              maxWidth: "40px",
            }}
            alt=""
          />
        </IconButton>
      </Grid>
    </Grid>
  );
});
