import axios from "axios";

import { POST_API_BASE_URL } from "../constants/env";

export const visitorSearch = async({ search_term, rt_id }) => {
  const FormData = require("form-data");
  const data = new FormData();
  data.append("search_term", search_term);
  data.append("limit", "10");
  data.append("page", "visitors");
  data.append("rt_id", rt_id);

  const config = {
    method: "post",
    url: `${POST_API_BASE_URL}/round-table/exclusive-search`,
    headers: {
      "device-type": "android",
      "user-id": JSON.parse(
        localStorage.current_user || localStorage.anonymous_user
      )["_id"],
    },
    data: data,
  };

  return await axios(config).then().catch();
};
