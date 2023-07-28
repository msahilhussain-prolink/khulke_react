import axios from "axios";
import { POST_API_BASE_URL, REACT_APP_DEVICE_TYPE } from "../constants/env";

//UPDATE USERNAME
export const updateUsername = async({ username }) => {
  let FormData = require("form-data");
  let data = new FormData();
  data.append("username", username);
  data.append("only_validation", "true");
  return await axios
    .post(`${POST_API_BASE_URL}/settings/username`, data, {
      headers: {
        "device-type": REACT_APP_DEVICE_TYPE,
        "user-id": JSON.parse(sessionStorage.getItem("current_user"))["_id"],
      },
    })
    .then()
    .catch();
};
