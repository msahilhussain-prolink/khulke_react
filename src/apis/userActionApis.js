import axios from "axios";
import { POST_API_BASE_URL, REACT_APP_DEVICE_TYPE } from "../constants/env";

export const unmuteUser = async({ username, url }) => {
  return await axios
    .post(`${POST_API_BASE_URL}/user/akshay05/unmuted`, {
      headers: {
        "device-type": REACT_APP_DEVICE_TYPE,
        "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
      },
    })
    .then()
    .catch();
};
