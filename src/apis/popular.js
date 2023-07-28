import axios from "axios";
import {
  REACT_APP_BASE_URL_FOR_ROUNDTABLE,
  REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1,
} from "../constants/env";
import { auto_login_continue } from "../utils/utils";

export const getPopularRTs = async() => {
  let config = {
    method: "get",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/anonymous/get-popular-rt/`,
    headers: {
      Authorization:
        "Bearer" + localStorage.current_user && !localStorage.anonymous_user
          ? localStorage.access
          : JSON.parse(localStorage.getItem("anonymous_user"))["token"],
    },
  };
  return await axios(config)
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status === 401) {
        return await auto_login_continue(getPopularRTs);
      }
      return res;
    });
};

export const getPopularShows = async () => {
  let config = {
    method: "get",
    url: `${
      localStorage.current_user && !localStorage.anonymous_user
        ? REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1
        : REACT_APP_BASE_URL_FOR_ROUNDTABLE + "/anonymous"
    }/get-popular-shows/`,
    headers: {
      Authorization: `Bearer ${
        localStorage.current_user && !localStorage.anonymous_user
          ? localStorage.access
          : JSON.parse(localStorage.getItem("anonymous_user"))["token"]
      }`,
    },
  };
  return await axios(config)
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status === 401) {
        return await auto_login_continue(getPopularRTs);
      }
      return res;
    });
};
