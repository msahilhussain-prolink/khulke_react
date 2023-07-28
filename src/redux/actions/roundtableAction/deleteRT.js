import { deleteRT } from "../../../apis/roundatbleAPI";
import * as actionTypes from "../actionTypes";

export const deleteRtStart = () => {
  return {
    type: actionTypes.DELETE_RT_START,
  };
};

export const deleteRtSuccess = (data) => {
  return {
    type: actionTypes.DELETE_RT_SUCCESS,
    payload: data,
  };
};

export const deleteRtFail = (err) => {
  return {
    type: actionTypes.DELETE_RT_FAIL,
    payload: err,
  };
};

export const deleteRtData = (data) => {
  return (dispatch) => {
    dispatch(deleteRtStart());
    deleteRT(data)
      .then((res) => {
        dispatch(deleteRtSuccess(res));
      })
      .catch((err) => {
        dispatch(deleteRtFail(err));
      });
  };
};
