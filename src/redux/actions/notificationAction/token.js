import { actionToken } from "../../../apis/fbasenotificationsAPI";
import * as actionTypes from "../actionTypes";
//* FIREBASE TOKENS
export const tokensStart = () => {
  return {
    type: actionTypes.TOKEN_START,
  };
};

export const tokensSuccess = (data) => {
  return {
    type: actionTypes.TOKEN_SUCCESS,
    payload: data,
  };
};

export const tokensFail = (err) => {
  return {
    type: actionTypes.TOKEN_FAIL,
    payload: err,
  };
};

export const tokensState = (data) => {
  return (dispatch) => {
    dispatch(tokensStart());
    actionToken(data)
      .then((res) => {
        dispatch(tokensSuccess(res));
      })
      .catch((err) => {
        dispatch(tokensFail(err));
      });
  };
};
