import { MenuItem } from "@material-ui/core";
import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { uid } from "../../../../pages/AgoraSandbox/settings";
import { ToggleHandSelf } from "../ApiCalls/Audience/ControlHand";
import { deleteSingleMessage } from "../ApiCalls/Audience/ControlMessage";

export default function AudienceRaiseHandOption(props) {
  //props destructuring
  const {
    handleClose,
    setMessageData,
    setRaisedHand,
    message_id,
    rtm_channel,
  } = props;

  //states here
  const [loading, setLoading] = useState({ hand: false, delete: false });

  //functions here

  const deleteSelfMessage = async () => {
    setLoading({ ...loading, delete: true });

    const response = await deleteSingleMessage(message_id);
    setLoading({ ...loading, delete: false });

    if (!response) return;

    rtm_channel?.sendMessage({ text: "wildcard_msg_delete||" + uid });
    setMessageData((prev) => prev.filter((elem) => elem._id !== message_id));
    handleClose();
  };

  const lowerHand = async () => {
    setLoading({ ...loading, hand: true });
    let response = await ToggleHandSelf();
    setLoading({ ...loading, hand: false });

    if (!response) return;
    setRaisedHand(false);
    rtm_channel?.sendMessage({ text: "wildcard_raise_hand||" });
    setMessageData([]);
    handleClose();
  };

  return (
    <>
      <MenuItem
        onClick={deleteSelfMessage}
        disabled={loading.hand || loading.delete}
      >
        {loading.delete && (
          <CircularProgress
            size={24}
            sx={{
              color: "grey",
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "-12px",
              marginLeft: "-12px",
            }}
          />
        )}
        Delete
      </MenuItem>
      {/* <MenuItem onClick={lowerHand} disabled={loading.hand || loading.delete}>
        {loading.hand && (
          <CircularProgress
            size={24}
            sx={{
              color: "grey",
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "-12px",
              marginLeft: "-12px",
            }}
          />
        )}
        Dismiss
      </MenuItem> */}
    </>
  );
}
