import axios from "axios";
import { REACT_APP_BASE_URL_FOR_USER } from "../constants/env";
import { auto_login_continue, device_info } from "../utils/utils";

// Edit Details
export const editDetails = async ({ access, profile_data }) => {
  let data = {
    device_info: device_info,
    ...profile_data,
  };
  let config = {
    method: "put",
    url: `${REACT_APP_BASE_URL_FOR_USER}/edit_profile/`,
    headers: {
      Authorization: `Bearer ${access}`,
      "Content-Type": "application/json",
    },
    data: data,
  };

  return await axios(config)
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status === 401) {
        return await auto_login_continue(() => {
          return editDetails({
            access: localStorage.getItem("access"),
            profile_data,
          });
        });
      }
      return res;
    });
};
