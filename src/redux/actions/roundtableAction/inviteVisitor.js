import { invite_visitor } from "../../../apis/roundatbleAPI";
import * as actionTypes from "../actionTypes";

export const getINVITEVISITORStart = () => {
  return {
    type: actionTypes.INVITE_VISITOR_START,
  };
};

export const getINVITEVISITORSuccess = (data) => {
  return {
    type: actionTypes.INVITE_VISITOR_SUCCESS,
    payload: data,
  };
};

export const getINVITEVISITORFail = (err) => {
  return {
    type: actionTypes.INVITE_VISITOR_FAIL,
    payload: err,
  };
};

export const inviteVisitorData = (data) => {
  return (dispatch) => {
    dispatch(getINVITEVISITORStart());
    invite_visitor(data)
      .then((res) => {
        dispatch(getINVITEVISITORSuccess(res));
      })
      .catch((err) => {
        dispatch(getINVITEVISITORFail(err));
      });
  };
};
