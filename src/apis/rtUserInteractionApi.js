import axios from "axios";
import { POST_API_BASE_URL } from "../constants/env";
import { device_info } from "../utils/utils";

// ** Add Like
export const addLike = async (post_id) => {
  const FormData = require("form-data");
  const data = new FormData();
  data.append("post_id", post_id);
  data.append("type", "LIKE");

  const config = {
    method: "post",
    url: `${POST_API_BASE_URL}/post/${post_id}/LIKE`,
    headers: {
      "device-type": "android",
      "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
    },
    data: data,
  };

  return await axios(config).then().catch();
};

// ** user interaction Add Dislike
export const addDislike = async (post_id) => {
  const FormData = require("form-data");
  const data = new FormData();
  data.append("post_id", post_id);
  data.append("type", "DISLIKE");
  const config = {
    method: "post",
    url: `${POST_API_BASE_URL}/post/${post_id}/DISLIKE`,
    headers: {
      "device-type": "android",
      "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
    },
    data: data,
  };

  return await axios(config).then().catch();
};

// ** Add Reply
export const addReply = async (formData) => {
  const config = {
    method: "post",
    url: `${POST_API_BASE_URL}/post-media`,
    headers: {
      "device-type": "android",
      "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
    },
    data: formData,
  };

  return await axios(config).then().catch();
};
// ** Add Quote
export const addQuote = async (formData) => {
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

  return await axios(config).then().catch();
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

  return await axios(config).then().catch();
};
