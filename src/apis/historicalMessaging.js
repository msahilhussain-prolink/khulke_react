import axios from "axios";
import { REACT_APP_BASE_URL_FOR_ROUNDTABLE } from "../constants/env";
import { auto_login_continue } from "../utils/utils";
export const getHistoricalMessages = async({ rt_id, panel, skip, limit }) => {
  const data = JSON.stringify({
    roundtable_id: rt_id,
    panel: panel,
    skip: skip,
    limit: limit,
  });

  if (!localStorage.current_user && localStorage.anonymous_user) return;

  const config = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/get-chat-history/`,
    headers: {
      Authorization: `Bearer ${localStorage.access}`,
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
          return getHistoricalMessages({ rt_id, panel, skip, limit });
        });
      }
      return res;
    });
};
