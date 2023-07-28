import AudienceRaiseChat from "./Audience/AudienceChat";
import ModAdminRaiseChat from "./ModAdmin/ModAdminRaiseChat";
import { motion } from "framer-motion";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IconButton, Modal } from "@mui/material";
import HandLowIcon from "../../../assets/icons/raisehand.svg";
import HandRaisedIcon from "../../../assets/icons/hand_requested.svg";
import { GetRaisedHandUsers } from "./ApiCalls/AdminMod/ControlHand";
import { rt_id, uid } from "../../../pages/AgoraSandbox/settings";
import {
  GetRaisedMessages,
  GetUserRaisedHand,
  ToggleHandSelf,
} from "./ApiCalls/Audience/ControlHand";
import { deleteAllMessage } from "./ApiCalls/Audience/ControlMessage";
import { useDispatch, useSelector } from "react-redux";
import { SetShowRaiseHand } from "../../../redux/actions/roundtableAction/RaiseHandToggle";
import ToastHandler from "../../../utils/ToastHandler";
import PreloginComp from "../../PreLoginComp";

export default function RaiseHand(props) {
  //props destructuring here
  const {
    role,
    rtm_channel,
    handle_wildcard_removal,
    disabledChat,
    showHand,
    setShowHand = () => {},
    msg = "",
  } = props;

  //constants here
  const dispatch = useDispatch();

  //useStates here
  const [raiseHandChat, setRaiseHandChat] = useState(false);
  const [handRaisedParent, setHandRaisedParent] = useState(false);
  // const [showHand, setShowHand] = useState(false);
  const [style, setStyle] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  //store selectors here
  const fullScr = useSelector((state) => state.fullScreen.full);

  const raiseHandRef = useCallback(
    (node) => {
      if (node !== null) {
        const elem = node.getBoundingClientRect();

        if (window.innerWidth < 768) {
          return setStyle({
            top: `10%`,
            right: `6%`,
          });
        }

        setStyle({
          top: `${elem.top + 75}px`,
          right: `calc(100% - ${elem.right - 5}px)`,
        });

        const onresizeEvent = () => {
          const elem = node.getBoundingClientRect();

          setStyle({
            top: `${elem.top + 75}px`,
            right: `calc(100% - ${elem.right - 5}px)`,
          });
        };

        window.addEventListener("resize", onresizeEvent);
        return () => {
          window.removeEventListener("resize", onresizeEvent);
        };
      }
    },
    [fullScr]
  );

  //audience chat useStates here
  const [messageData, setMessageData] = useState([]);
  const [raisedHand, setRaisedHand] = useState(false);

  //admin-mod chat  useStates here
  const [users, setUsers] = useState();
  const [unseenUserMessages, setUnseenUserMessages] = useState([]);
  const [showMessages, setShowMessages] = useState(false);
  const [activeUser, setActiveUser] = useState();

  //admin-mod chat useRefs here
  const activeUserRef = useRef();
  const showMessagesRef = useRef();
  const usersRef = useRef();
  activeUserRef.current = activeUser;
  showMessagesRef.current = showMessages;
  usersRef.current = users;

  //functions defined here
  const func = async () => {
    let raiseHand = await GetRaisedHandUsers();
    if (!raiseHand) return;

    if (raiseHand.length > 0) {
      setShowHand(true);
      setHandRaisedParent(true);
    }
    if (raiseHand.length === 0) setShowHand(false);

    setUsers(raiseHand);

    if (role === "audience") setShowHand(true);
  };

  //audienceChat functions defined here

  const raiseHand = async () => {
    let response = await ToggleHandSelf();
    if (response) setRaisedHand(!raisedHand);
    rtm_channel.sendMessage({
      text: "wildcard_raise_hand||",
    });
    return response;
  };

  //Api call to get the data for the current users previous raiseHand
  const GetCurrentRaisedHand = async () => {
    let raiseHand = await GetUserRaisedHand();

    setRaisedHand(raiseHand);
    setHandRaisedParent(raiseHand);
    const response = await GetRaisedMessages();

    if (!response) return;

    setMessageData(response);
  };

  //lower user hand on wildcard req dismissed
  const lowerHandOnWildcardReqDismiss = async (item) => {
    const deleted = await deleteAllMessage({
      roundtable_id: rt_id,
      user_id: item.action_on,
    });

    if (!deleted) {
      // return alert("Some unexpected error occured, try again");
      return ToastHandler("dan", "Some unexpected error occured, try again");
    }

    const response = await ToggleHandSelf(item.action_on);
    if (!response) return;
    setUsers((prev) =>
      prev.filter((elem) => {
        return elem.action_on !== item.action_on;
      })
    );
    rtm_channel?.sendMessage({
      text: `wildcard_req_dismiss||${item.username}`,
    });
  };

  //Useeffects here
  useEffect(() => {
    if (role === "audience") {
      setShowHand(true);
      return GetCurrentRaisedHand();
    }
    func();
  }, [role]);

  useEffect(() => {
    if (
      (!role.includes("admin") && !role.includes("moderator")) ||
      !rtm_channel
    )
      return;

    const wildcardRHEvent = (message) => {
      if (message.text !== "wildcard_raise_hand||") return;
      func();
    };

    const wildcardMSEvent = (message) => {
      if (message.text.split("||")[0] !== "wildcard_msg_sent") return;
      setHandRaisedParent(true);
      setUnseenUserMessages([
        ...unseenUserMessages,
        message.text.split("||")[1],
      ]);
    };

    rtm_channel?.on("ChannelMessage", wildcardRHEvent);

    rtm_channel?.on("ChannelMessage", wildcardMSEvent);

    return () => {
      rtm_channel?.off("ChannelMessage", wildcardRHEvent);
      rtm_channel?.off("ChannelMessage", wildcardMSEvent);
    };
  }, [rtm_channel, role]);

  useEffect(() => {
    if (role !== "audience" || !rtm_channel) return;

    const wildcardRD = (message) => {
      const { text } = message;
      if (text.split("||")[0] !== "wildcard_req_dismiss") return;

      if (text.split("||")[1] === uid) {
        setHandRaisedParent(false);
        setRaiseHandChat(false);
        setRaisedHand(false);
        ToastHandler(
          "warn",
          "Your content is not proper for current discussion."
        );
      }
    };

    rtm_channel?.on("ChannelMessage", wildcardRD);

    return () => {
      rtm_channel?.off("ChannelMessage", wildcardRD);
    };
  }, [role, rtm_channel]);

  useEffect(() => {
    if (!role.includes("moderator") || !rtm_channel) return;

    const wildcardEvent = async (message) => {
      const { text } = message;
      const data = text.split("||");
      const key = data[0];

      if (
        key !== "rejwildcard" &&
        key !== "wcautodismiss" &&
        key !== "accwildcard"
      )
        return;

      const username = data[1];

      const item = usersRef.current?.find((elem) => elem.username === username);

      if (!item) return;

      await lowerHandOnWildcardReqDismiss(item);

      if (
        activeUserRef.current?.username !== username &&
        showMessagesRef.current
      )
        return;
      setActiveUser();
      setShowMessages(false);
    };
    rtm_channel?.on("ChannelMessage", wildcardEvent);

    return () => {
      rtm_channel?.off("ChannelMessage", wildcardEvent);
    };
  }, [role, rtm_channel]);

  useEffect(() => {
    if (!role.includes("admin") && !role.includes("moderator")) return;

    if (users?.length === 0) {
      setRaiseHandChat(false);
      setShowHand(false);
    }
  }, [role, users]);

  //useeffect to position the raisehand chat

  useEffect(() => {
    dispatch(SetShowRaiseHand(showHand));
  }, [showHand]);

  const markUp = useMemo(() => {
    return (
      <>
        {(role === "audience" ||
          role.includes("admin") ||
          role.includes("moderator")) &&
          showHand && (
            <div
              className="raise-hand-parent-div"
              style={{ display: "initial" }}
            >
              <motion.div
                // whileHover={{ scale: 1.1, opacity: 0.8 }}
                style={{
                  position: "relative",
                }}
              >
                <IconButton
                  onClick={() => {
                    if (
                      !localStorage.current_user &&
                      localStorage.anonymous_user
                    )
                      return setModalOpen(true);

                    setRaiseHandChat(!raiseHandChat);
                    if (raisedHand || role !== "audience") return;
                    raiseHand();
                  }}
                  className="raise-hand-btn"
                  style={{
                    width: props.width ? props.width : "46px",
                    height: "66px",
                  }}
                  disabled={disabledChat}
                  ref={raiseHandRef}
                >
                  {handRaisedParent ? (
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
                  <span style={{ fontSize: "16px", color: "#000" }}>
                    {msg !== "" ? <>&nbsp; {msg} </> : ""}
                  </span>
                </IconButton>
                <Modal
                  onClose={() => {
                    setRaiseHandChat(false);
                  }}
                  open={raiseHandChat}
                >
                  <div
                    className="custom_hand"
                    style={{
                      ...style,
                      backgroundColor: "white",
                      height: "fit-content",
                      borderRadius: "10px",
                      width: "30%",
                      margin: "auto",
                      // marginTop: "20px",
                      // marginRight: "150px",
                      position: "absolute",
                    }}
                  >
                    {role === "audience" ? (
                      <AudienceRaiseChat
                        setHandRaisedParent={setHandRaisedParent}
                        rtm_channel={rtm_channel}
                        messageData={messageData}
                        setMessageData={setMessageData}
                        raisedHand={raisedHand}
                        setRaisedHand={setRaisedHand}
                      />
                    ) : (
                      <ModAdminRaiseChat
                        setHandRaisedParent={setHandRaisedParent}
                        rtm_channel={rtm_channel}
                        handle_wildcard_removal={handle_wildcard_removal}
                        users={users}
                        setUsers={setUsers}
                        unseenUsersMessages={unseenUserMessages}
                        setUnseenUserMessages={setUnseenUserMessages}
                        showMessages={showMessages}
                        setShowMessages={setShowMessages}
                        activeUser={activeUser}
                        setActiveUser={setActiveUser}
                      />
                    )}
                  </div>
                </Modal>
              </motion.div>
            </div>
          )}
        <PreloginComp
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          icon={<img src={HandRaisedIcon} alt="" width={40} height={40} />}
          title={"To Raise hand, Login or sign up to Khul Ke"}
          description={""}
        />
      </>
    );
  }, [
    raiseHandChat,
    role,
    handRaisedParent,
    handle_wildcard_removal,
    rtm_channel,
    showHand,
    disabledChat,
    raisedHand,
    users,
    messageData,
    unseenUserMessages,
    showMessages,
    activeUser,
    modalOpen,
  ]);

  return markUp;
}
