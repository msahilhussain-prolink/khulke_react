import axios from "axios";
import {
  ENCRYPTED_PASSWORD_KEY,
  REACT_APP_BASE_URL_FOR_USER,
} from "../constants/env";
import { moengageEvent } from "../utils/utils";
import logger from "../logger";
import { CometChat } from "@cometchat-pro/chat";

const logoutCometChat = async () => {
  return new Promise(async (resolve) => {
    try {
      const user = await CometChat.getLoggedinUser();
      if(user){
        const _resp = await CometChat.logout();
        logger.info("Logout completed successfully =====", _resp);
        resolve({
          success: true,
        });
      }
      resolve({
        success: false,
      });
    } catch (error) {
      logger.info(
        "Logout failed with exception: =====",
        JSON.stringify({ error })
      );
      resolve({
        success: false,
      });
    }
  });
};

export const initiateLogout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("join_rt");
  localStorage.removeItem("rtm_token");
  localStorage.removeItem("text_data");
  localStorage.removeItem("input_text");
  localStorage.removeItem("khulke_recents");
  localStorage.removeItem("message");
  localStorage.removeItem("current_user");
  localStorage.removeItem("wildcards");
  localStorage.removeItem("is_new");
  localStorage.removeItem("followings");
  localStorage.removeItem(ENCRYPTED_PASSWORD_KEY);
  localStorage.removeItem("anonymous_user");
  localStorage.removeItem("joined_rt");
  localStorage.removeItem("activeTab");
  sessionStorage.clear();
  logger.info("cleared session storage");
  window.location.replace("/roundtable/all");
};
const logoutUser = async () => {
  const data = JSON.stringify({
    type: "web",
  });

  const config = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_USER}/setting/logout/`,
    headers: {
      Authorization: `Bearer ${localStorage.access}`, //? Change later when encrypted
      "Content-Type": "application/json",
    },
    data: data,
  };
  localStorage.removeItem("redirect_origin"); //Removing any historical redirects when user logs out.
  await axios(config)
    .then(async (res) => {
      if (res.status === 200) {
        moengageEvent("LogOut", "User");
        const _resp = await logoutCometChat();
        window.Moengage?.destroy_session();
      }
      initiateLogout();
    })
    .catch((err) => {
      initiateLogout();
    });
};

export default logoutUser;
