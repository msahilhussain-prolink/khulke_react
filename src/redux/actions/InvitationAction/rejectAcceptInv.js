import { getInvitation, rejectAcceptInv } from "../../../apis/invitationPopApi";
import * as actionTypes from "../actionTypes";

export const getRejectAcceptStart = () => {
  return {
    type: actionTypes.REJECT_ACCEPT_START,
  };
};

export const getRejectAcceptSuccess = (data) => {
  return {
    type: actionTypes.REJECT_ACCEPT_SUCCESS,
    payload: data,
  };
};

export const getRejectAcceptFail = (err) => {
  return {
    type: actionTypes.REJECT_ACCEPT_FAIL,
    payload: err,
  };
};

export const rejectAcceptData = (data) => {
  return async (dispatch) => {
    dispatch(getRejectAcceptStart());
    rejectAcceptInv(data)
      .then((res) => {
        dispatch(getRejectAcceptSuccess(res.data));
      })
      .catch((err) => {
        dispatch(getRejectAcceptFail("Somethings went wrong! try again."));
      });
  };
};
