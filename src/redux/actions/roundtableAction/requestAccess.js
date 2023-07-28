import { requestAccess } from "../../../apis/roundatbleAPI";
import * as actionTypes from "../actionTypes";

export const requestAccessStart = () => {
  return {
    type: actionTypes.REQUEST_ACCESS_START,
  };
};

export const requestAccessSuccess = (data) => {
  return {
    type: actionTypes.REQUEST_ACCESS_SUCCESS,
    payload: data,
  };
};

export const requestAccessFail = (err) => {
  return {
    type: actionTypes.REQUEST_ACCESS_FAIL,
    payload: err,
  };
};

export const requestAccessData = (data) => {
  return (dispatch) => {
    dispatch(requestAccessStart());
    requestAccess(data)
      .then((res) => {
        dispatch(requestAccessSuccess(res));
      })
      .catch((err) => {
        dispatch(requestAccessFail(err));
      });
  };
};
