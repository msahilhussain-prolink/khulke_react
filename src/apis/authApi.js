import axios from "axios";
import {
  ENCRYPTED_PASSWORD_KEY,
  REACT_APP_BASE_URL_FOR_USER,
  STATIC_TOKEN,
} from "../constants/env";

export const userRegister = async (data) => {
  return await axios
    .post(`${REACT_APP_BASE_URL_FOR_USER}/user/register`, data, {
      headers: {
        Authorization: STATIC_TOKEN,
      },
    })
    .then((res) => {
      if (res.status === 201) {
        localStorage.setItem(ENCRYPTED_PASSWORD_KEY, data?.password);
      }
      return res;
    })
    .catch();
};

export const userGetToken = async ({ user_id, password }) => {
  return await axios
    .post(
      `${REACT_APP_BASE_URL_FOR_USER}/auth/`,
      {
        username: user_id,
        password: password,
      },
      {
        headers: {
          Authorization: STATIC_TOKEN,
        },
      }
    )
    .then()
    .catch();
};

export const userDetails = async({ user_id, password }) => {
  return await axios
    .post(
      `${REACT_APP_BASE_URL_FOR_USER}/auth/`,
      {
        username: user_id,
        password: password,
      },
      {
        headers: {
          Authorization: STATIC_TOKEN,
        },
      }
    )
    .then()
    .catch();
};
