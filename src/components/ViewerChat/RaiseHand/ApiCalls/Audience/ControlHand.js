import axios from "axios";
import {
  REACT_APP_BASE_URL_FOR_ROUNDTABLE,
  REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1,
} from "../../../../../constants/env";
import {
  open_to_all,
  rt_id,
  rt_name,
  rt_type,
  uid,
} from "../../../../../pages/AgoraSandbox/settings";
import ToastHandler from "../../../../../utils/ToastHandler";
import { auto_login_continue, moengageEvent } from "../../../../../utils/utils";
import { allWords } from "../../../../../App"

const user_id = JSON.parse(
  localStorage?.current_user || localStorage?.anonymous_user
)?._id;

const ToggleHandSelf = async (id) => {
  const apiData = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.access}`,
    },
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/audience/hand-raise/${rt_id}/`,
    data: id ? { user_id: id } : { user_id },
  };
  try {
    await axios(apiData);
    moengageEvent("Raise Hand", "RoundTable", {
      RoundTableID: rt_id,
      Name: rt_name,
      "K Type": rt_type,
      "K SubType": open_to_all,
      "Audience Interaction": 1,
    });
    return true;
  } catch (e) {
    const res = e.response;
    if (!res) {
      ToastHandler("dan", allWords.misc.pages.facingDiffi);
      return false;
    }

    if (res.status === 401) {
      return await auto_login_continue(() => ToggleHandSelf(id));
    }

    ToastHandler("dan", allWords.misc.pages.facingDiffi);
    return false;
  }
};

const GetUserRaisedHand = async () => {
  if (!localStorage.current_user && localStorage.anonymous_user) return;
  const apiData = {
    method: "POST",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/get_actions_data/`,
    data: {
      action: "hand-raise",
      rt_id: rt_id,
    },
    headers: {
      Authorization: `Bearer ${localStorage.access}`,
    },
  };

  try {
    const response = await axios(apiData);

    const raisedHandUsers = response.data.data;
    let user = raisedHandUsers.find((elem) => elem.username === uid);
    if (user) return true;
    return false;
  } catch (e) {
    const response = e.response;
    if (!response) return false;

    if (response.status === 401) {
      return await auto_login_continue(GetUserRaisedHand);
    }
    return false;
  }
};

const GetRaisedMessages = async () => {
  if (!localStorage.current_user && localStorage.anonymous_user) return;
  const apiData = {
    method: "POST",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1}/get_rountable_actions_message/`,
    headers: {
      Authorization: `Bearer ${localStorage.access}`,
    },
    data: {
      roundtable_id: rt_id,
      user_id,
      chat_type: "wildcardchat",
    },
  };

  try {
    const response = await axios(apiData);

    return response.data.data.filter(
      (elem) => elem.chat_type === "WILDCARDCHAT" && elem.username === uid
    );
  } catch (e) {
    const response = e.response;
    if (!response) return false;

    if (response.status === 401) {
      return await auto_login_continue(GetRaisedMessages);
    }
    return false;
  }
};

export { ToggleHandSelf, GetUserRaisedHand, GetRaisedMessages };
