import axios from "axios";
import { POST_API_BASE_URL, REACT_APP_DEVICE_TYPE } from "../constants/env";

//* UNIVERSAL SEARCH
export const universalSearch = async({ url, search_data }) => {
  let FormData = require("form-data");
  let data = new FormData();
  let search_term = search_data["search_for"];
  let active_tab = search_data["active_tab"];
  let limit = search_data["limit"];
  let skip = search_data["skip"];
  let type = search_data["type"];
  let user_interests = search_data["user_interests"];
  if (url === "user-search") {
    data.append("search_term", search_term);
    data.append("interest", user_interests);
  } else if (url === "search") {
    data.append("search_term", search_term);
    data.append("active_tab", active_tab);
    data.append("limit", limit);
    data.append("skip", skip);
    data.append("type", type);
  }
  return await axios
    .post(`${POST_API_BASE_URL}/${url}`, data, {
      headers: {
        "device-type": REACT_APP_DEVICE_TYPE,
        "user-id": JSON.parse(
          localStorage.getItem("current_user") || localStorage.anonymous_user
        )["_id"],
      },
    })
    .then()
    .catch();
};
