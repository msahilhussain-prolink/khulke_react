import { CircularProgress, MenuItem } from "@material-ui/core";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  POST_API_BASE_URL,
  REACT_APP_DEVICE_TYPE,
} from "../../../../constants/env";
import { rt_id } from "../../../../pages/AgoraSandbox/settings";
import { ConsentData } from "../../../../redux/actions/roundtableAction";
import ToastHandler from "../../../../utils/ToastHandler";
import { ToggleHandSelf } from "../ApiCalls/Audience/ControlHand";
import { deleteAllMessage } from "../ApiCalls/Audience/ControlMessage";
import ConfirmatioNmodal from "../ConfirmationModal";
import { allWords } from "../../../../App";
export default function ModAdminRaiseHandOptions(props) {
  //props destructuring here
  const {
    setOpenMessages,
    id,
    setUsers,
    username,
    message_id,
    rtm_channel,
    handle_wildcard_removal,
    handleClose,
  } = props;

  //state selectors here
  const wc_uids = useSelector((state) => state.HeaderData.data);
  const liveUser = useSelector((state) => state.roundtable.liveUser);
  const consent = useSelector((state) => state.roundtable.consent);

  //states here
  const [loading, setLoading] = useState({
    wildcard: false,
    message: false,
    dismiss: false,
    delete: false,
  });

  const [wildcard, setWildcard] = useState(false);

  const [openConfirmation, setOpenConfirmation] = useState(false);

  //constants here
  const dispatch = useDispatch();

  //effects here
  useEffect(() => {
    setWildcard(wc_uids.wc_uids.includes(username));
  }, [wc_uids, username]);

  //functions here
  const lowerHand = async () => {
    setLoading({ ...loading, dismiss: true });
    const deleted = await deleteAllMessage({
      roundtable_id: rt_id,
      user_id: id,
    });

    if (!deleted) {
      return ToastHandler("dan", "Some unexpected error occured, try again.");
    }
    const response = await ToggleHandSelf(id);
    if (!response) return;
    setLoading({ ...loading, dismiss: false });
    rtm_channel?.sendMessage({
      text: `wildcard_req_dismiss||${username}`,
    });
    setUsers((prev) => prev.filter((elem) => elem.action_on !== id));
    setOpenMessages(false);
  };

  // TODO: Not removing this function as this will be used in future
  async function addAsWildCardMessage() {
    setLoading({ ...loading, message: true });
    let thisData = new FormData();
    thisData.append("message_id", message_id);
    thisData.append("roundtable_id", rt_id);
    thisData.append("username", username);

    let config = {
      method: "POST",
      url: `${POST_API_BASE_URL}/round-table/wildcard-message`,
      headers: {
        "device-type": REACT_APP_DEVICE_TYPE,
        "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
      },
      data: thisData,
    };

    try {
      const resu = await axios(config);
    } catch (error) {
      ToastHandler("dan", allWords.misc.pages.facingDiffi);
    }
    setLoading({ ...loading, message: false });
  }

  // TODO : This function will be used in future to delete message by admin mod function here
  //   const deleteMessage = async () => {
  //   setLoading({ ...loading, delete: true });

  //   const response = await deleteSingleMessage(message_id);
  //   setLoading({ ...loading, delete: false });

  //   if (!response) return;
  //   setMessageData((prev) => prev.filter((elem) => elem._id !== message_id));
  // };

  const addAsWildcardPanelist = () => {
    rtm_channel.sendMessage({
      text: `reqwildcard||${username}`,
    });
    dispatch(ConsentData([...consent, username]));
  };

  return (
    <>
      <MenuItem
        onClick={() => {
          handleClose();
          if (!wildcard) {
            if (!liveUser.includes(username)) {
              return ToastHandler(
                "info",
                allWords.misc.pages.cantaddw
              );
            }

            if (consent.includes(username)) {
              return ToastHandler("info", "Wildcard consent already sent.");
            }

            return addAsWildcardPanelist();
          }

          handle_wildcard_removal(username);
        }}
      >
        {wildcard ? allWords.misc.rmfromwild : allWords.misc.text_wilduser}
        {loading.wildcard && (
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
      </MenuItem>

      <MenuItem
        onClick={() => {
          setOpenConfirmation(true);
        }}
      >
        Dismiss
        {loading.dismiss && (
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
      </MenuItem>

      <ConfirmatioNmodal
        modalState={openConfirmation}
        closeModal={() => setOpenConfirmation(false)}
        confirmed={lowerHand}
      />
    </>
  );
}
