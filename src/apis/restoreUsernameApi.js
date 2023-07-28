import axios from "axios";
import { REACT_APP_BASE_URL_FOR_USER } from "../constants/env";
import { auto_login_continue } from "../utils/utils";

export const restoreUsername = async() => {
  const config = {
    method: "get",
    url: `${REACT_APP_BASE_URL_FOR_USER}/get_restored_user`,
    headers: {
      Authorization: `Bearer ${localStorage.access}`,
    },
  };

  return await axios(config)
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status !== 401) return res;
      return await auto_login_continue(restoreUsername);
    });
};
