import {
  Button,
  Grid,
  IconButton,
  Modal,
  TextareaAutosize,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { rt_id, uid } from "../../../../pages/AgoraSandbox/settings";
import MediaPost from "../AddMediaPost";
import { sendTextOnlyMessage } from "../ApiCalls/Audience/ControlMessage";
import RaiseHandMessage from "../RaiseHandMessage";
import {
  GetRaisedMessages,
  ToggleHandSelf,
} from "../ApiCalls/Audience/ControlHand";
import Skeleton from "@mui/material/Skeleton";
import HandLowIcon from "../../../../assets/icons/raisehand.svg";
import HandRaisedIcon from "../../../../assets/icons/hand_requested.svg";
import ToastHandler from "../../../../utils/ToastHandler";
import { AddCircleOutline } from "@material-ui/icons";
import { allWords } from "../../../../App";
export default function AudienceRaiseChat(props) {
  //props here
  const {
    setHandRaisedParent,
    rtm_channel,
    messageData,
    setMessageData,
    raisedHand,
    setRaisedHand,
  } = props;

  //useStates defined here
  const [mediaPost, setMediaPost] = useState(false);
  const [raising, setRaising] = useState(false);

  const [sendingMessage, setSendingMessage] = useState(false);

  //api functions here
  const raiseHand = async () => {
    //temporary blocking lower hand feature for audience
    if (raisedHand) return;

    setRaising(true);
    let response = await ToggleHandSelf();
    setRaising(false);
    if (response) setRaisedHand(!raisedHand);
    rtm_channel.sendMessage({
      text: "wildcard_raise_hand||",
    });
    return response;
  };

  const submitRaiseHandMessage = async (e) => {
    e.preventDefault();

    if (!e.target.message.value) {
      return ToastHandler("warn", "Message can not be empty.");
    }

    if (messageData.length > 4) {
      return ToastHandler("warn", "You can send maximum of 5 messages only.");
    }

    let raise = "";

    if (!raisedHand) {
      raise = await raiseHand();
    }

    if (!raise && !raisedHand) return;

    setSendingMessage(true);

    const apiData = {
      roundtable_id: rt_id,
      message: e.target.message.value,
      panel: "audience",
      chat_type: "wildcardchat",
      file_type: "",
    };

    const response = await sendTextOnlyMessage(apiData);

    setSendingMessage(false);
    if (!response) return;

    if (response.data.length === 0) {
      return ToastHandler("warn", response.message);
    }
    rtm_channel.sendMessage({
      text: "wildcard_msg_sent||" + uid,
    });
    setMessageData((prev) => [...prev, response.data[0]]);
    e.target.message.value = "";
  };

  //sideEffects here

  useEffect(() => {
    setHandRaisedParent(raisedHand);
    const func = async () => {
      if (raisedHand) {
        const response = await GetRaisedMessages();
        if (!response) return;
        setMessageData(response);
        return;
      }

      setMessageData([]);
    };

    func();
  }, [raisedHand, setHandRaisedParent, setMessageData]);

  return (
    <>
      <Grid
        item
        xs={12}
        style={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#f5f5f5",
          borderRadius: "10px 10px 0px 0px",
          alignItems: "center",
        }}
      >
        <Typography
          style={{
            fontSize: "1.05rem",
            fontWeight: "bold",
            fontFamily: "'Work Sans',sans-serif",
            padding: "10px 20px",
          }}
        >
          {allWords.misc.livert.raisehand}
        </Typography>
        <IconButton onClick={raiseHand} disabled={raising}>
          {raising ? (
            <Skeleton
              animation="wave"
              variant="rectangular"
              width={"20px"}
              height={"30px"}
              style={{
                borderRadius: "2px",
              }}
            />
          ) : raisedHand ? (
            <img
              src={HandRaisedIcon}
              style={{
                height: "50px",
                width: "30px",
              }}
              alt="hand_icon"
            />
          ) : (
            <img
              src={HandLowIcon}
              style={{
                height: "50px",
                width: "30px",
              }}
              alt="hand_icon"
            />
          )}
        </IconButton>
      </Grid>

      <Grid
        container
        style={{
          padding: "10px 5px",
        }}
        alignItems="flex-end"
      >
        <Grid
          container
          style={{
            height: "60vh",
            overflowY: "auto",
            padding: "10px 20px",
          }}
          justifyContent={"right"}
          direction="column"
        >
          {messageData.length === 0 ? (
            <Grid
              item
              xs={12}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              {allWords.misc.livert.rhp}
            </Grid>
          ) : (
            <Grid container>
              {messageData.map((elem) => {
                return (
                  <Grid
                    key={elem}
                    item
                    style={{
                      height: "fit-content",
                      marginLeft: "auto",
                      width: "100%",
                      display: "flex",
                      justifyContent: "right",
                    }}
                  >
                    <RaiseHandMessage
                      setMessageData={setMessageData}
                      item={elem}
                      setRaisedHand={setRaisedHand}
                      rtm_channel={rtm_channel}
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Grid>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid
            item
            xs={2}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={() => {
                if (messageData.length > 4) {
                  return ToastHandler(
                    "warn",
                    "You can send maximum of 5 messages only."
                  );
                }
                setMediaPost(true);
              }}
            >
              <AddCircleOutline />
            </IconButton>
          </Grid>

          <Grid item xs={10}>
            <form onSubmit={submitRaiseHandMessage}>
              <Grid container alignItems={"center"}>
                <Grid
                  item
                  xs={9}
                  style={{
                    position: "relative",
                  }}
                >
                  <TextareaAutosize
                    className="raise-hand-textbox"
                    placeholder="Write your question here"
                    minRows={2}
                    maxRows={2}
                    style={{
                      resize: "none",
                      width: "100%",
                      outline: "none",
                      border: "none",
                      height: "60px",
                      paddingTop: "20px",
                    }}
                    onChange={(e) => {
                      if (e.target.value.length > 300)
                        return (e.target.value = e.target.value.slice(0, 300));
                    }}
                    name="message"
                  />
                  {/* <Typography
                    variant="p"
                    style={{
                      position: "absolute",
                      right: "0px",
                      bottom: "0px",
                    }}
                  >
                    300/300
                  </Typography> */}
                </Grid>
                <Grid item xs={3}>
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      padding: " 10px",
                      borderRadius: "5px",
                      position: "relative",
                    }}
                    type="submit"
                    disabled={sendingMessage}
                  >
                    {sendingMessage && (
                      <CircularProgress
                        size={24}
                        sx={{
                          color: "white",
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          marginTop: "-12px",
                          marginLeft: "-12px",
                        }}
                      />
                    )}
                    {allWords.misc.livert.send}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Grid>
      <Modal
        onClose={() => {
          setMediaPost(false);
        }}
        open={mediaPost}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MediaPost
          setMediaPost={setMediaPost}
          setMessageData={setMessageData}
          raisedHand={raisedHand}
          setRaisedHand={setRaisedHand}
          rtm_channel={rtm_channel}
        />
      </Modal>
    </>
  );
}
