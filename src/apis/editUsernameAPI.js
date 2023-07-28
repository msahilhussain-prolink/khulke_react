import axios from "axios";
import { REACT_APP_BASE_URL_FOR_USER } from "../constants/env";
import { auto_login_continue, device_info } from "../utils/utils";

// Edit Details
export const editUsername = async ({
  edit_usernames,
  old_username,
  store_old_username_flag,
  restore_flag,
}) => {
  const data = JSON.stringify({
    device_info: device_info,
    new_username: edit_usernames,
    old_user_name: old_username,
    store_old_username: store_old_username_flag,
    restore_flag: restore_flag,
  });

  const config = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_USER}/edit_username/`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.access}`,
    },
    data: data,
  };

  return await axios(config)
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status === 401) {
        await auto_login_continue(() => {
          return editUsername({
            edit_usernames,
            old_username,
            store_old_username_flag,
            restore_flag,
          });
        });
      }
      return res;
    });
};
