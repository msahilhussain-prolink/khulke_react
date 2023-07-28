import { createEditRt } from "../../../apis/roundatbleAPI";
import * as actionTypes from "../actionTypes";
import moment from "moment";

export const getCreateEditRtStart = () => {
  return {
    type: actionTypes.CREATE_EDIT_RT_START,
  };
};

export const getCreateEditRtSuccess = (data) => {
  return {
    type: actionTypes.CREATE_EDIT_RT_SUCCESS,
    payload: data,
  };
};

export const getCreateEditRtFail = (err) => {
  return {
    type: actionTypes.CREATE_EDIT_RT_FAIL,
    payload: err,
  };
};

export const createEditData = (data) => {
  return (dispatch) => {
    dispatch(getCreateEditRtStart());
    createEditRt(data)
      .then((res) => {
        dispatch(getCreateEditRtSuccess(res));
      })
      .catch((err) => {
        dispatch(getCreateEditRtFail(err));
      });
  };
};
