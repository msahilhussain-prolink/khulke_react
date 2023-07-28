import axios from "axios";
import {
  PANELIST_CHAT_API,
  REACT_APP_BASE_URL_FOR_ROUNDTABLE,
} from "../../../../../constants/env";
import ToastHandler from "../../../../../utils/ToastHandler";
import { auto_login_continue } from "../../../../../utils/utils";

const sendTextOnlyMessage = async (apiData, file) => {
  const formData = new FormData();
  formData.set("data", JSON.stringify(apiData));

  if (file) {
    formData.set("filedata", file);
  }

  try {
    const response = await axios({
      method: "POST",
      data: formData,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
        "content-type": "multipart/form-data",
      },
      url: `${PANELIST_CHAT_API}/roundtable/v1/messagedoc_upload/`,
    });

    if (response.status !== 200) {
      if (response.data.message) ToastHandler("warn", response.data.message);
      return false;
    }
    return response.data;
  } catch (e) {
    const response = e.response;
    if (!response) return;

    if (response.status === 401) {
      return await auto_login_continue(() =>
        sendTextOnlyMessage(apiData, file)
      );
    }
    return;
  }
};

const deleteSingleMessage = async (message_id) => {
  try {
    const response = await axios({
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/delete_raise_hand_chat_message/`,
      method: "POST",
      data: { message_id },
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
      },
    });

    return true;
  } catch (e) {
    const response = e.response;
    if (!response) return false;
    if (response.status === 401) {
      return await auto_login_continue(() => deleteSingleMessage(message_id));
    }
    return false;
  }
};

const deleteAllMessage = async ({ roundtable_id, user_id }) => {
  try {
    const response = await axios({
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/update_rountable_action_status/`,
      method: "POST",
      data: { roundtable_id, user_id },
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
      },
    });
    return true;
  } catch (e) {
    const response = e.response;
    if (!response) return false;
    if (response.status === 401) {
      return await auto_login_continue(() =>
        deleteAllMessage({ roundtable_id, user_id })
      );
    }
    return false;
  }
};

export { sendTextOnlyMessage, deleteSingleMessage, deleteAllMessage };
