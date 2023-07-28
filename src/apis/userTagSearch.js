import axios from "axios";

import { POST_API_BASE_URL, REACT_APP_DEVICE_TYPE } from "../constants/env";

export const userTagSearch = async({ search_term }) => {
  const FormData = require("form-data");
  const data = new FormData();
  data.append("search_term", "@" + search_term);

  const config = {
    method: "post",
    url: `${POST_API_BASE_URL}/user-search`,
    headers: {
      "device-type": REACT_APP_DEVICE_TYPE,
      "user-id": JSON.parse(
        localStorage.current_user || localStorage.anonymous_user
      )["_id"],
    },
    data: data,
  };

  return await axios(config).then().catch();
};
