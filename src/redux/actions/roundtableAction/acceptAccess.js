import { acceptAccess } from "../../../apis/roundatbleAPI";
import * as actionTypes from "../actionTypes";

export const accessAcceptStart = () => {
  return {
    type: actionTypes.ACCEPT_ACCESS_START,
  };
};

export const accessAcceptSuccess = (data) => {
  return {
    type: actionTypes.ACCEPT_ACCESS_SUCCESS,
    payload: data,
  };
};

export const accessAcceptFail = (err) => {
  return {
    type: actionTypes.ACCEPT_ACCESS_FAIL,
    payload: err,
  };
};

export const accessAcceptData = (data) => {
  return (dispatch) => {
    dispatch(accessAcceptStart());
    acceptAccess(data)
      .then((res) => {
        dispatch(accessAcceptSuccess(res));
      })
      .catch((err) => {
        dispatch(accessAcceptFail(err));
      });
  };
};
