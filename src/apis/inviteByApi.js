import axios from "axios";
import { REACT_APP_BASE_URL_FOR_NOTIFICATION } from "../constants/env";
import { auto_login_continue } from "../utils/utils";

export const getInviteeBy = async({ nt_id, skip }) => {
  const data = JSON.stringify({
    nt_id: nt_id,
    skip: skip,
    limit: 15,
  });

  const config = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_NOTIFICATION}/get_invited_by_list/`,
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
      if (res.status !== 401) return res;
      return await auto_login_continue(() => {
        return getInviteeBy({ nt_id, skip });
      });
    });
};
