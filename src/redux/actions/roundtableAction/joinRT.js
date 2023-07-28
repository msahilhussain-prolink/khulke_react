import { joinRT } from "../../../apis/roundatbleAPI";
import * as actionTypes from "../actionTypes";

export const getJoinRTStart = () => {
  return {
    type: actionTypes.JOIN_RT_START,
  };
};

export const getJoinRTSuccess = (data) => {
  return {
    type: actionTypes.JOIN_RT_SUCCESS,
    payload: data,
  };
};

export const getJoinRTFail = (err) => {
  return {
    type: actionTypes.JOIN_RT_FAIL,
    payload: err,
  };
};

export const joinRTData = (data) => {
  return (dispatch) => {
    dispatch(getJoinRTStart());
    joinRT(data)
      .then((res) => {
        dispatch(getJoinRTSuccess(res.data));
      })
      .catch((err) => {
        dispatch(getJoinRTFail(err));
      });
  };
};
