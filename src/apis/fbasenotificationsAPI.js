import axios from "axios";
import { REACT_APP_BASE_URL_FOR_USER } from "../constants/env";
import { auto_login_continue } from "../utils/utils";

//* FIREBASE TOKEN
export const actionToken = async({ access, action, token }) => {
  let url;
  let data = {
    "device-id": "web",
    "firebase-token": token,
  };

  if (action === "save") {
    url = "save_firebase/";
    data["device-type"] = "web";
  } else {
    url = "update_device_id/";
  }

  return await axios
    .post(`${REACT_APP_BASE_URL_FOR_USER}/${url}`, data, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    })
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status === 401) {
        return await auto_login_continue(() => {
          return actionToken({
            access: localStorage.getItem("access"),
            action,
            token,
          });
        });
      }
      return res;
    });
};

export const universalNotifications = ({ notification }) => {
  return { notification: notification };
};
