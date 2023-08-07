import { makeStyles } from "@material-ui/core";
import DialogChat from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allWords } from "../../../App";
import { MOBILE_VIEW, PANELIST_CHAT_API } from "../../../constants/env";
import logger from "../../../logger";
import { rt_id } from "../../../pages/AgoraSandbox/settings";
import { getHistoricalMessage } from "../../../redux/actions/rtMessaging/historicalMessaging";
import FormInput from "../../FormInput";
import { CommentDiv } from ".././style";
import MessageArea from "./MessageArea";

const useStyles = makeStyles({
  dialog: {
    position: "absolute",
  },
});

export default function PanelistChat(props) {
  //props destructuring here
  const {
    open,
    handleClose,
    scroll,
    rtm_channel,
    setHasUnread,
    role,
    PanelChatIconRef,
  } = props;

  //refs here
  const descriptionElementRef = useRef(null);
  const message_area_scroller_ref = useRef("");
  const inputRef = useRef();

  //states here
  const [messageData, setMessageData] = useState([]);
  const [message_skip, setMessageSkip] = useState(0);
  const [text, SetText] = useState("");
  const [style, setStyle] = useState({});

  //store data selectors here
  const histMessge_loading = useSelector(
    (state) => state.historicalMessages.loading
  );

  const historical_messages = useSelector(
    (state) => state.historicalMessages.data
  );

  const fullScr = useSelector((state) => state.fullScreen.full);
  const raisehand = useSelector((state) => state.raiseHand.showRaiseHand);

  //refs
  const openRef = useRef();
  openRef.current = open;

  //constants here
  const dispatch = useDispatch();
  let current_user = null;
  let panel = "owner";
  const classes = useStyles();

  //updating value of contants
  if (role.includes("panellist")) {
    panel = "speaker";
  } else if (role.includes("moderator")) {
    panel = "moderator";
  }

  try {
    current_user = JSON.parse(localStorage.getItem("current_user"));
  } catch (err) {
    logger.error("Not found current user in Panelist Chat", err);
  }

  //sideeffects here
  useEffect(() => {
    const descriptionElement = descriptionElementRef.current;

    if (!descriptionElement) return;
  }, [descriptionElementRef]);

  const messagesEvent = (message, _memberId, messagePros) => {
    setMessageData((prevState) => [
      ...prevState,
      { in: message.text, out: "", name: _memberId, time: Date.now() },
    ]);

    if (!openRef.current && !message.text.includes("||")) {
      setHasUnread(true);
    }

    scrollMessages();
  };

  useEffect(() => {
    if (!rtm_channel) return;

    rtm_channel?.on("ChannelMessage", messagesEvent);

    return () => {
      rtm_channel?.off("ChannelMessage", messagesEvent);
    };
  }, [rtm_channel]);

  //Loading Historical messages
  useEffect(() => {
    const data = {
      rt_id: rt_id,
      panel: panel,
      skip: message_skip,
      limit: 100,
    };
    if (!localStorage.current_user && localStorage.anonymous_user) return;
    dispatch(getHistoricalMessage(data));
  }, [message_skip]);

  useEffect(() => {
    if (historical_messages) {
      let data = historical_messages.map((message) => {
        return {
          in: message.username !== current_user.username ? message.message : "",
          out:
            message.username === current_user.username ? message.message : "",
          name: message.username,
          time: message.created_at,
        };
      });
      setMessageData((prev) => {
        return [...prev, ...data];
      });
    }
  }, [historical_messages]);

  useEffect(() => {
    if (open) {
      setHasUnread(false);
    }
  }, [open]);

  //useEfect to position the panelist chat message
  useEffect(() => {
    if (!PanelChatIconRef.current) return;

    const elem = PanelChatIconRef.current.getBoundingClientRect();

    if (MOBILE_VIEW) {
      return setStyle({
        width: "93%",
        margin: "0 auto",
        right: "15px",
        top: `${elem.top + 50}px`,
        borderRadius: "10px",
      });
    }

    setStyle({
      top: `${elem.top + 20 + 10}px`,
      right: `calc(100% - ${elem.right + 30}px)`,
      borderRadius: "10px",
    });

    const onresizeEvent = () => {
      const elem = PanelChatIconRef.current.getBoundingClientRect();

      setStyle({
        top: `${elem.top + 20 + 10}px`,
        right: `calc(100% - ${elem.right + 30}px)`,
        borderRadius: "10px",
      });
    };

    window.addEventListener("resize", onresizeEvent);

    return () => {
      window.removeEventListener("resize", onresizeEvent);
    };
  }, [PanelChatIconRef, raisehand, fullScr]);

  //functions here
  const sendMessages = async () => {
    scrollMessages();

    if (text !== "" || text !== " ") {
      rtm_channel
        .sendMessage({
          text: text,
        })
        .then(() => {
          SetText("");
          inputRef.current.value = "";
          let temp = [...messageData];
          temp.push({
            in: "",
            out: text,
            name: current_user.username,
            time: Date.now(),
          });
          setMessageData(temp);
        })
        .catch((err) => {});
      penelistChat(rt_id, text, panel);
    }
  };

  const penelistChat = (rt_id, text, panel) => {
    const data = new FormData();
    data.append(
      "data",
      `{"roundtable_id": "${rt_id}", "message": "${text}", "panel": "${panel}", "chat_type": "panelistchat", "file_type": ""}`
    );

    const config = {
      method: "post",
      url: `${PANELIST_CHAT_API}/roundtable/v1/messagedoc_upload/`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
      },
      data: data,
    };

    axios(config)
      .then(function (response) {})
      .catch(function (error) {});
  };

  function scrollMessages() {
    try {
      document.querySelector(".message_area_scroller").scrollTop =
        document.querySelector(".message_area_scroller").scrollHeight +
        20000000;
    } catch (err) {}
  }

  return (
    <DialogChat
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      classes={{
        paper: classes.dialog,
      }}
      PaperProps={{
        style: style,
      }}
    >
      <div className="custom_dilog">
        <DialogContent
          dividers={scroll === "paper"}
          style={{
            height: "80vh",
            padding: "16px 5px 16px 10px",
          }}
          className="custom_di"
        >
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
            style={{
              height: "90%",
            }}
          >
            <>
              <div
                className="custom_mobi_height"
                style={{
                  // width: MOBILE_VIEW ? "100%" : 390,
                  // height: MOBILE_VIEW ? "95%" : "100%",
                  display: "flex",
                  flexDirection: "column",
                  padding: "0 0.7rem 0 0.7rem",
                  marginTop: "-5px",
                }}
              >
                <h6 style={{ marginLeft: "0.5rem", fontSize: "1.05rem" }}>
                  {allWords.misc.livert.pchat}
                </h6>

                <MessageArea
                  messageData={messageData}
                  setSkip={setMessageSkip}
                  loading={histMessge_loading}
                  skip={message_skip}
                  message_area_scroller_ref={message_area_scroller_ref}
                />
              </div>
            </>
            <CommentDiv className="d-flex justify-content-between px-2">
              <FormInput
                custom_styles={{
                  border: "none",
                  padding: "4px 0px",
                  zIndex: "9",
                  width: "70%",
                }}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (text.trim() !== "") {
                      sendMessages();
                    }
                  }}
                >
                  <input
                    type="text"
                    style={{ border: "none", width: "20rem" }}
                    placeholder={allWords.yapp.writeMessageHere}
                    onChange={(e) => SetText(e.target.value)}
                    ref={inputRef}
                  />
                </form>
              </FormInput>
              <button
                className={text.trim() === "" ? `disabled-button` : ""}
                style={{
                  padding: "3px 8px",
                  width: "fit-content",
                  backgroundColor: "black",
                  color: "white",
                  outline: "none",
                  border: "none",
                  borderRadius: "8px",
                  height: "45px",
                }}
                onClick={sendMessages}
              >
                {allWords.misc.livert.send}
              </button>
            </CommentDiv>
          </DialogContentText>
        </DialogContent>
      </div>
    </DialogChat>
  );
}
