import axios from "axios";
import {POST_API_BASE_URL} from "../constants/env";
import {auto_login_continue} from "../utils/utils";

const getBKKPostsAPI = async (skip, postId = "", profilePath = "") => {
     const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access") ||
        JSON.parse(localStorage.getItem("anonymous_user"))?.token
        }`,
      "Content-Type": "application/json",
      "device-type": "android",
      "user-id": localStorage.getItem("current_user")
        ? JSON.parse(localStorage.getItem("current_user"))?.["_id"]
        : JSON.parse(localStorage.getItem("anonymous_user"))?.["_id"],
    },
  };

  const data = {
    skip,
    limit: 20,
  };

  if (postId !== "") {
    data["firstPost"] = postId;
  }

  if (profilePath !== "") {
    data["path"] = profilePath;
  }

  try {
    const response = await axios.post(`${POST_API_BASE_URL}/api/exclusive/bkk`, data, config);
    return response;


  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error
      return auto_login_continue(getBKKPostsAPI(skip, postId, profilePath));
    } else {
      // Handle other errors
      throw error;
    }
  }
};

const addBKKPostAPI = async (video, captionVal, startTime, endTime, timeDuration) => {
  try {
    const message = {
      type: "BKK_POST",
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

    const data = {
      video,
      message,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
        "device-type": "android",
        "user-id": JSON.parse(localStorage.getItem("current_user"))._id,
      },
    };

    const response = await axios.post(`${POST_API_BASE_URL}/post-media/`, data, config);
    return response.data;
  } catch (error) {
    if (!error.response) return;
    if (error.response.status === 401) {
      return await auto_login_continue(addBKKPostAPI());
    }
    return error.response.data;
  }
};


export {getBKKPostsAPI, addBKKPostAPI};
