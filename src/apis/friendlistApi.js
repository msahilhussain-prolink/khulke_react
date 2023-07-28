import axios from "axios";
import { REACT_APP_BASE_URL_FOR_USER } from "../constants/env";
import { auto_login_continue } from "../utils/utils";

// ** GET FRIEND LIST API

export const getFriendList = async({ interests, access, limit = 10, skip = 0 }) => {
  let data = {};

  if (localStorage.current_user && !localStorage.anonymous_user) {
    data["data"] = interests["data"];
  }
  data = {
    limit: limit,
    skip: skip,
  };
  let config = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_USER}/${
      localStorage.current_user && !localStorage.anonymous_user
        ? "searchuser/"
        : "anonymous/user-suggestion/"
    }`,
    headers: {
      Authorization: `Bearer ${
        localStorage.current_user && !localStorage.anonymous_user
          ? access
          : JSON.parse(localStorage.getItem("anonymous_user"))["token"]
      }`,
      "Content-Type": "application/json",
    },
    data: data,
  };
  return await axios(config)
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status === 401) {
        return await auto_login_continue(() => {
          return getFriendList({
            interests,
            access: localStorage.getItem("access"),
            limit,
            skip,
          });
        });
      }
      return res;
    });
};
