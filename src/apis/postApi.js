import axios from "axios";
import { POST_API_BASE_URL } from "../constants/env";

import { PATHS } from "../utils/Constant/path";
import { device_info } from "../utils/utils";

const getUserData = (username, data) => {
  if (
    username !==
    JSON.parse(localStorage.current_user || localStorage.anonymous_user)[
      "username"
    ]
  ) {
    const params = new URLSearchParams(window.location.search);
    if (!username && !params.get("username")) {
      return data.append("path", `me`);
    }
    return data.append("path", `me/${username || params.get("username")}`);
  }
  return data.append("path", `me`);
};

// ** GET POST
export const getPost = async (limit, skip, username, pathname, type_url) => {
  const data = new FormData();
  data.append("limit", limit);
  data.append("skip", skip || 0);
  if (!localStorage?.current_user && localStorage?.anonymous_user) {
    data.append("anonymous", true);
  }
 if (
    pathname === PATHS.PROFILE ||
    window.location.pathname.includes(PATHS.PROFILE)
  ) {
    getUserData(username, data);
  }
  return await axios
    .post(`${POST_API_BASE_URL}/post-paginate`, data, {
      headers: {
        "device-type": "android",
        "user-id": JSON.parse(
          localStorage.getItem("current_user") || localStorage.anonymous_user
        )["_id"],
      },
    })
   ;
};

// get post - this is being used on townhall call only, as its url is different.
export const getTownhallPost = async (limit, skip, type = "") => {
  const data = new FormData();
  data.append("limit", limit);
  data.append("skip", skip || 0);
  data.append("type", type);

  return await axios
    .post(`${POST_API_BASE_URL}/api/townhall/paginate`, data, {
      headers: {
        "device-type": "android",
        "user-id": JSON.parse(
          localStorage.getItem("current_user") || localStorage.anonymous_user
        )["_id"],
      },
    });
};
// ** Add POST
export const addPost = async (formData) => {
  const newFormData = formData;
  newFormData.append("device_info", JSON.stringify(device_info));
const config = {
    method: "post",
    url: `${POST_API_BASE_URL}/post-media`,
    headers: {
      "device-type": "android",
      "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
    },
    data: newFormData,
  };
return await axios(config);
};
// ** Add Like
export const addLike = async (post_id, type) => {
  const FormData = require("form-data");
  const data = new FormData();
  data.append("post_id", post_id);
  data.append("type", type);
  data.append("device_info", JSON.stringify(device_info));
      const config = {
    method: "post",
    url: `${POST_API_BASE_URL}/api/post/${post_id}/${type}`,
    headers: {
      "device-type": "android",
      "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
    },
    data: data,
  };
 return await axios(config);
};
// ** Add Dislike
export const addDislike = async (post_id) => {
  const FormData = require("form-data");
  const data = new FormData();
  data.append("post_id", post_id);
  data.append("type", "DISLIKE");

  const config = {
    method: "post",
    url: `${POST_API_BASE_URL}/api/post/${post_id}/DISLIKE`,
    headers: {
      "device-type": "android",
      "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
    },
    data: data,
  };
return await axios(config);
};
// ** Add Quote
export const addQuote = async (formData) => {
  const config = {
    method: "post",
    url: `${POST_API_BASE_URL}/post-media/`,
    headers: {
      "device-type": "android",
      "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
    },
    data: formData,
  };
return await axios(config);
};
// ** Add Circulate
export const addCirculate = async (post_id) => {
  const data = new FormData();
  data.append("post_id", post_id);
  data.append("type", "REPOST");
  data.append("device_info", JSON.stringify(device_info));
const config = {
    method: "post",
    url: `${POST_API_BASE_URL}/post/${post_id}/REPOST`,
    headers: {
      "device-type": "android",
      "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
    },
    data: data,
  };

  return await axios(config);
};
// ** Add Reply
export const addReply = async (formData) => {
  const newFormData = formData;
  newFormData.append("device_info", JSON.stringify(device_info));
const config = {
    method: "post",
    url: `${POST_API_BASE_URL}/post-media`,
    headers: {
      "device-type": "android",
      "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
    },
    data: newFormData,
  };
return await axios(config);
};
// ** Post Delete
export const postDelete = async (post_id, is_roundtable) => {
  const data = new FormData();
  data.append("operation_type", "DELETE");
  data.append("device_info", JSON.stringify(device_info));

  if (is_roundtable) {
    data.append("path", "ROUNDTABLE");
    data.append("type", "ROUNDTABLE");
  } else {
    data.append("path", "POST");
    data.append("type", "TEXT");
  }
    return await axios({
    method: "post",
    url: `${POST_API_BASE_URL}/post/${post_id}`,
    headers: {
      "device-type": "android",
      "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
    },
    data: data,
  })
};
// ** Post Mute
export const postMute = async (user_id, post_id) => {
  const data = new FormData();
  data.append("operation_type", "MUTED");
  data.append("user", `${user_id}`);

  return await axios({
    method: "post",
    url: `${POST_API_BASE_URL}/post/${post_id}`,
    headers: {
      "device-type": "android",
      "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
    },
    data: data,
  })
    
};
