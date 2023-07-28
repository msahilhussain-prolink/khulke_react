import axios from "axios";
import { REACT_APP_BASE_URL_FOR_USER } from "../constants/env";

export const universalUA = async({ handle, type }) => {
  let data = JSON.stringify({
    handle,
    type,
  });

  return await axios
    .post(`${REACT_APP_BASE_URL_FOR_USER}/user-action/`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
        "Content-Type": "application/json",
      },
    })
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status === 401) {
        return await auto_login_continue(() => {
          universalUA({ handle, type });
        });
      }
    });
};
