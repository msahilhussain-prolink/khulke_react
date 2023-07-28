import axios from "axios";
import { POST_API_BASE_URL } from "../constants/env";

export const audioTrim = async(formData) => {
  return await axios({
    method: "post",
    url: `${POST_API_BASE_URL}/post-media`,
    headers: {
      "device-type": "android",
      "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
    },
    data: formData,
  })
    .then()
    .catch();
};
