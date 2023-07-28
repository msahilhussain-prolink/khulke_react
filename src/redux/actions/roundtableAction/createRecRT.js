import { createRecRT } from "../../../apis/roundatbleAPI";
import * as actionTypes from "../actionTypes";

export const getCreateRecRTStart = () => {
  return {
    type: actionTypes.CREATE_REC_RT_START,
  };
};

export const getCreateRecRTSuccess = (data) => {
  return {
    type: actionTypes.CREATE_REC_RT_SUCCESS,
    payload: data,
  };
};

export const getCreateRecRTFail = (err) => {
  return {
    type: actionTypes.CREATE_REC_RT_FAIL,
    payload: err,
  };
};

export const createRecRtData = (data) => {
  return (dispatch) => {
    dispatch(getCreateRecRTStart());
    createRecRT(data)
      .then((res) => {
        dispatch(getCreateRecRTSuccess(res));
      })
      .catch((err) => {
        dispatch(getCreateRecRTFail(err));
      });
  };
};
