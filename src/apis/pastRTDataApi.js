import axios from "axios";
import { REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1 } from "../constants/env";
import { auto_login_continue } from "../utils/utils";

// ** GET PAST RT API
export const getPastRT = async() => {
  return await axios
    .get(`${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1}/get-past-roundtables`, {
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
      },
    })
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status === 401) {
        return await auto_login_continue(getPastRT);
      }
      return res;
    });
};
