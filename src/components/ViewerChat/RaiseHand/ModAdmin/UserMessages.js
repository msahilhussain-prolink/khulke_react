import { CircularProgress, Grid, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { GetUserMessages } from "../ApiCalls/AdminMod/ControlMessage";
import RaiseHandMessage from "../RaiseHandMessage";

export default function UserMessages(props) {
  //props destructuring here
  const {
    item,
    setOpenMessages,
    setUsers,
    rtm_channel,
    handle_wildcard_removal,
    setUnseenUserMessages,
  } = props;

  //states here
  const [loading, setLoading] = useState(false);
  const [messageData, setMessageData] = useState([]);

  //function here
  const func = async (hideLoader) => {
    if (!hideLoader) setLoading(true);

    let response = await GetUserMessages(item.action_on);
    if (!hideLoader) setLoading(false);
    if (!response) return;
    setMessageData(response);
  };

  //effects here
  useEffect(() => {
    func();
    setUnseenUserMessages((prev) =>
      prev.filter((elem) => elem !== item.username)
    );

    return () => {
      setUnseenUserMessages((prev) =>
        prev.filter((elem) => elem !== item.username)
      );
    };
  }, []);

  const wildcardMsgEvent = (message) => {
    if (
      message.text.split("||")[0] !== "wildcard_msg_sent" &&
      message.text.split("||")[0] !== "wildcard_msg_delete"
    )
      return;

    if (message.text.split("||")[1] === item.username) {
      func(true);
    }
  };

  useEffect(() => {
    if (!rtm_channel) return;

    rtm_channel?.on("ChannelMessage", wildcardMsgEvent);

    return () => {
      rtm_channel?.off("ChannelMessage", wildcardMsgEvent);
    };
  }, [rtm_channel, item]);

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      style={{
        height: "fit-content",
      }}
    >
      {/* <Grid item>
        <Typography variant="p" color="black">
          Raise hand messages by{" "}
          <span
            style={{
              fontWeight: "bold",
            }}
          >
            {item.name}
          </span>
        </Typography>
      </Grid> */}
      <Grid
        item
        style={{
          position: "absolute",
          top: "7px",
          right: "10px",
          zIndex: "100",
        }}
      >
        <IconButton
          onClick={() => {
            setOpenMessages(false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </Grid>

      <Grid
        container
        style={{
          paddingTop: "30px",
          maxWidth: "600px",
        }}
      >
        {loading ? (
          <Grid container justifyContent="center" alignItems={"center"}>
            <CircularProgress />
          </Grid>
        ) : messageData.length === 0 ? (
          <Grid container jsutifyContent="center">
            <Typography variant="p">
              User has only raised hand without any message
            </Typography>
          </Grid>
        ) : (
          messageData.map((item) => (
            <Grid
              item
              style={{
                height: "fit-content",
                marginLeft: "auto",
                width: "100%",
                display: "flex",
                justifyContent: "left",
              }}
            >
              <RaiseHandMessage
                key={item._id}
                item={item}
                setOpenMessages={setOpenMessages}
                setUsers={setUsers}
                rtm_channel={rtm_channel}
                handle_wildcard_removal={handle_wildcard_removal}
                setMessageData={setMessageData}
              />
            </Grid>
          ))
        )}
      </Grid>
    </Grid>
  );
}
