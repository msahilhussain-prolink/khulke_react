import axios from "axios";
import { POST_API_BASE_URL } from "../constants/env";

// ** POST Bookmark
export const postBookmark = async(post_id) => {
  const FormData = require("form-data");
  const data = new FormData();
  data.append("post_id", post_id);
  data.append("type", "FAVORITE");

  return await axios({
    method: "post",
    url: `${POST_API_BASE_URL}/post/${post_id}/favourite`,
    headers: {
      "device-type": "android",
      "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
    },
    data: data,
  })
    .then()

    .catch();
};
