import { getInviteeList } from "../../../apis/roundatbleAPI";
import * as actionTypes from "../actionTypes";

export const getInviteeListStart = () => {
  return {
    type: actionTypes.INVITEE_LIST_START,
  };
};

export const getInviteeListSuccess = (data) => {
  return {
    type: actionTypes.INVITEE_LIST_SUCCESS,
    payload: data,
  };
};

export const getInviteeListFail = (err) => {
  return {
    type: actionTypes.INVITEE_LIST_FAIL,
    payload: err,
  };
};
export const getInviteeListLoadingFalse = () => {
  return {
    type: actionTypes.INVITEE_LIST_LOADING_FALSE,
  };
};

export const InviteeListData = (data) => {
  return (dispatch) => {
    dispatch(getInviteeListStart());
    getInviteeList(data)
      .then((res) => {
        if (res.data.data.length > 0) {
          dispatch(getInviteeListSuccess(res));
        }
        dispatch(getInviteeListLoadingFalse());
      })
      .catch((err) => {
        dispatch(getInviteeListFail(err));
      });
  };
};
