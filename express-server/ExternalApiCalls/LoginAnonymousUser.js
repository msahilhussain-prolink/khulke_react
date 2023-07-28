import axios from "axios";
import {
  REACT_APP_BASE_URL_FOR_USER,
  STATIC_TOKEN,
  UpdateAnonymousData,
} from "../EnvFiles/Env.js";

export const fetchAnonymousUser = async () => {
  const ip_address =
    Math.floor(Math.random() * 255) +
    1 +
    "." +
    Math.floor(Math.random() * 255) +
    "." +
    Math.floor(Math.random() * 255) +
    "." +
    Math.floor(Math.random() * 255);

  const config = {
    url: `${REACT_APP_BASE_URL_FOR_USER}/anonymous_user_entry/`,
    method: "POST",
    data: {
      deviceinfo: {
        device_name: "express-server",
        platform: "express-meta-tag",
        platform_version: "v1",
        app_version: "1",
        ip_address,
      },
    },
    headers: { Authorization: STATIC_TOKEN },
  };

  const response = await axios(config);

  if (response.status === 200) {
    const data = response.data.data[0];
    UpdateAnonymousData(data);
    return true;
  }

  return false;
};
