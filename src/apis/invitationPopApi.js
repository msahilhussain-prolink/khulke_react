import axios from "axios";
import {
  REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1,
  REACT_APP_BASE_URL_FOR_ROUNDTABLE_V2,
} from "../constants/env";
import { auto_login_continue } from "../utils/utils";

export const getInvitation = async () => {
  return await axios
    .get(
      `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V2}/invitation-list?limit=10&offset=0`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
      }
    )
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status === 401) {
        return await auto_login_continue(getInvitation);
      }
      return res;
    });
};

export const rejectAcceptInv = ({ url, token, rt_id, role }) => {
  const FormData = require("form-data");
  const data = new FormData();
  data.append(
    "data",
    JSON.stringify({ confirmation_token: token, rt_id: rt_id, role: role })
  );

  const config = {
    method: "post",
    url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1}/round-table-${url}/`,
    headers: {
      Authorization: `Bearer ${localStorage.access}`,
    },
    data: data,
  };

  axios(config)
    .then()
    .catch(async function (err) {
      const response = err.response;
      if (response.status === 401) {
        return await auto_login_continue(() => rejectAcceptInv(url));
      }
    });
};
