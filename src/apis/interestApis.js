import axios from "axios";
import { REACT_APP_BASE_URL_FOR_USER } from "../constants/env";
import { auto_login_continue } from "../utils/utils";

// ** GET INTEREST API
export const getInterest = async() => {
  return await axios
    .get(`${REACT_APP_BASE_URL_FOR_USER}/view_interest/`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access"),
      },
    })
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status === 401) {
        return await auto_login_continue(getInterest);
      }
      return res;
    });
};

// ** UPDATE INTEREST API
export const updateInterest = (send_data) => {
  return axios
    .post(`${REACT_APP_BASE_URL_FOR_USER}/update_interest/`, send_data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access"),
      },
    })
    .then()
    .catch(async (e) => {
      const res = e.response;
      if (!res) return;
      if (res.status === 401) {
        return await auto_login_continue(() => {
          updateInterest(send_data);
        });
      }
      return res;
    });
};
