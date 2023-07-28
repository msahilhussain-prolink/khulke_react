import axios from "axios";
import { REACT_APP_BASE_URL_FOR_ROUNDTABLE } from "../../../../../constants/env";
import { rt_id } from "../../../../../pages/AgoraSandbox/settings";
import { auto_login_continue } from "../../../../../utils/utils";

const GetRaisedHandUsers = async () => {
  if (localStorage.anonymous_user && !localStorage.current_user) return;
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
    return raisedHandUsers;
  } catch (e) {
    const response = e.response;
    if (!response) return false;

    if (response.status === 401) {
      return await auto_login_continue(GetRaisedHandUsers);
    }
    return false;
  }
};

export { GetRaisedHandUsers };
