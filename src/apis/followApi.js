import axios from "axios";
import { POST_API_BASE_URL, REACT_APP_DEVICE_TYPE } from "../constants/env";

//* UNIVERSAL SEARCH  { url, follow_data }
export const getfollow = async({ which, username }) => {
  let config = {
    method: "get",
    url: `${POST_API_BASE_URL}/details-paginate?type=${which}&skip=0&username=${username}`,
    headers: {
      "device-type": REACT_APP_DEVICE_TYPE,
      "user-id": JSON.parse(
        localStorage.current_user || localStorage.anonymous_user
      )["_id"],
    },
  };

  return await axios(config).then().catch();
};
