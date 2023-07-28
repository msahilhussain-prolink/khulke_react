import axios from "axios";
import { POST_API_BASE_URL } from "../constants/env";
import { auto_login_continue } from "../utils/utils";

const getSnippets = async (skip, postId = "") => {
  let data = {
    skip,
    limit: 15,
  };

  if (postId !== "") {
    data["firstPost"] = postId;
  }

  let config = {
    method: "post",
    url: `${POST_API_BASE_URL}/get-snippets/`,
    data: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${
        localStorage.getItem("access") ||
        JSON.parse(localStorage.getItem("anonymous_user"))?.token
      }`,
      "Content-Type": "application/json",
      "device-type": "android",
      "user-id": localStorage.getItem("current_user")
        ? JSON.parse(localStorage.getItem("current_user"))?.["_id"]
        : JSON.parse(localStorage.getItem("anonymous_user"))?.["_id"],
    },
  };

  return await axios(config)
    .then()
    .catch(async (err) => {
      const res = err.response;
      if (!res) return;
      if (res.status === 401) {
        return await auto_login_continue(getSnippets());
      }
      return res;
    });
};

const addSnippet = async (
  video,
  captionVal,
  startTime,
  endTime,
  timeDuration
) => {
  const message = {
    type: "SNIPPET",
    media_type: "VIDEO",
    text: captionVal,
    caption: [""],
    tags: [""],
    file_type: ["VIDEO"],
    start_duration: [`${startTime}`],
    end_duration: [`${endTime}`],
    duration: [`${timeDuration}`],
    trim: ["true"],
    is_snap: ["false"],
    is_recorded: ["false"],
  };

  let data = JSON.stringify({
    video,
    message,
  });

  let config = {
    method: "post",
    url: `${POST_API_BASE_URL}/post-media/`,
    data: data,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access")}`,
      "Content-Type": "application/json",
      "device-type": "android",
      "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
    },
  };

  return await axios(config)
    .then((res) => res)
    .catch(async (err) => {
      const res = err.response;
      if (!res) return;
      if (res.status === 401) {
        return await auto_login_continue(addSnippet());
      }
      return res;
    });
};

export { getSnippets, addSnippet };
