import axios from "axios";
import { REACT_APP_BASE_URL_FOR_USER } from "../constants/env";
import { auto_login_continue } from "../utils/utils";

// **GET URL META DATA
export const urlMetaData = async(target_url) => {
  const data = JSON.stringify({
    target_url: target_url,
  });

  return await axios({
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_USER}/${
      localStorage.anonymous_user ? "anonymous/" : ""
    }get_meta_data/`,
    headers: {
      Authorization: `Bearer ${
        localStorage.access || JSON.parse(localStorage.anonymous_user).token
      }`,
      "Content-Type": "application/json",
    },
    data: data,
  })
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status === 401) {
        return await auto_login_continue(() => {
          urlMetaData(target_url);
        });
      }
    });
};
