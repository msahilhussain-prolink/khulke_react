import axios from "axios";
import { REACT_APP_BASE_URL_FOR_USER } from "../constants/env";
import { auto_login_continue } from "../utils/utils";

export const getProfile = async({ username }) => {
  const data = {
    username: username,
  };
const anonymous_user = JSON.parse(localStorage.getItem("anonymous_user"));
  const current_user = JSON.parse(localStorage.getItem("current_user"));
  if (data.username) {
  const config = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_USER}${
      current_user ? "/profile/" : "/anonymous/user_profile/"
    }`,
    headers: {
      Authorization: `Bearer ${
        current_user ? localStorage.access: anonymous_user?.["token"]
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
        await auto_login_continue(() => getProfile({ username }));
      }
      return res;
    });
  }
};

export async function profilePhoto({ username, size }) {
  const anonymous_user = JSON.parse(localStorage.getItem("anonymous_user"));
  const current_user = JSON.parse(localStorage.getItem("current_user"));

  const config = {
    method: "get",
    url: `${REACT_APP_BASE_URL_FOR_USER}/profile-photo/${username}/${size}/`,
    headers: {
      Authorization: `Bearer ${
        current_user ? localStorage.access : anonymous_user?.["token"]
      }`,
    },
    responseType: "blob",
  };

    return await axios(config).then().catch(async(e) => {
    const res = e.response;
    if (!res)
      return;
    if (res.status === 401) {
      await auto_login_continue(() => profilePhoto({ username }));
    }
    return await res;
});
}
