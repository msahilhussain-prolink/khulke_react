import axios from "axios";
import { REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1 } from "../../../../../constants/env";
import { rt_id } from "../../../../../pages/AgoraSandbox/settings";
import { auto_login_continue } from "../../../../../utils/utils";

export const GetUserMessages = async (user_id) => {
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

    return response.data.data;
  } catch (e) {
    const response = e.response;
    if (!response) return false;

    if (response.status === 401) {
      return await auto_login_continue(GetUserMessages);
    }
    return false;
  }
};
