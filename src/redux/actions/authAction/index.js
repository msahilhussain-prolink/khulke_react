import { userRegister, userGetToken } from "../../../apis/authApi";
import logger from "../../../logger";
import * as actionTypes from "../actionTypes";
import TagManager from "react-gtm-module";

function gtmEventWithCode() {
  logger.info("backend verified registration");
  TagManager.dataLayer({
    dataLayer: {
      event: "sign-up event",
      category: "Sign-up",
      action: "Step4",
      label: "backend verified registration",
    },
  });
}

export const registerUserSuccess = (data) => {
  gtmEventWithCode();
  return {
    type: actionTypes.REGISTER_USER_SUCCESS,
    payload: data,
  };
};

export const registerUserStart = () => {
  return {
    type: actionTypes.REGISTER_USER_START,
  };
};

export const registerUserFail = (err) => {
  return {
    type: actionTypes.REGISTER_USER_FAIL,
    payload: err,
  };
};

export function getUserRegister(data) {
  return function (dispatch) {
    registerUserStart();
    userRegister(data)
      .then((response) => {
        dispatch(registerUserSuccess(response.data));
      })
      .catch((error) => {
        dispatch(registerUserFail({ status: 500 }));
      });
  };
}

export const obtainTokenSuccess = (data) => {
  return {
    type: actionTypes.OBTAIN_TOKEN_SUCCESS,
    payload: data,
  };
};

export const obtainTokenStart = () => {
  return {
    type: actionTypes.OBTAIN_TOKEN_START,
  };
};

export const obtainTokenFail = (err) => {
  return {
    type: actionTypes.OBTAIN_TOKEN_FAIL,
    payload: err,
  };
};

export function getInitialToken(data) {
  return function (dispatch) {
    obtainTokenStart();
    userGetToken(data)
      .then((response) => {
        dispatch(obtainTokenSuccess(response.data));
      })
      .catch((error) => {
        dispatch(obtainTokenFail({ status: 401 }));
      });
  };
}
