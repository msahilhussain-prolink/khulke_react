import axios from "axios";
import { NOTIFICATION_URL,REACT_APP_DEVICE_TYPE } from "../constants/env";

export const addNotification = async({page, limit}) => {
  const config = {
    method: "post",
    url: `${NOTIFICATION_URL}`,
    headers: {
      "device-type": REACT_APP_DEVICE_TYPE,
      "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
    },
    data: {
      page: page,
      limit: limit
    },
  };
  return await axios(config).then().catch();
};