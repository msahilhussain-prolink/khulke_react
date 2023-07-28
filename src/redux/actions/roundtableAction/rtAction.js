import { RtAction } from "../../../apis/roundatbleAPI";
import * as actionTypes from "../actionTypes";

export const rtActionStart = () => {
  return {
    type: actionTypes.RT_ACTION_START,
  };
};

export const rtActionSuccess = (data) => {
  return {
    type: actionTypes.RT_ACTION_SUCCESS,
    payload: data,
  };
};

export const rtActionFail = (err) => {
  return {
    type: actionTypes.RT_ACTION_FAIL,
    payload: err,
  };
};

export const rtActionData = (data) => {
  return (dispatch) => {
    dispatch(rtActionStart());
    RtAction(data)
      .then((res) => {
        dispatch(rtActionSuccess(res));
      })
      .catch((err) => {
        dispatch(rtActionFail(err));
      });
  };
};
