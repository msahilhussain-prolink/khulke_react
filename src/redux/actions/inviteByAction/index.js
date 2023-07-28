import { getInviteeBy } from "../../../apis/inviteByApi";
import * as actionTypes from "../actionTypes";

export const getInviteByStart = () => {
  return {
    type: actionTypes.INVITE_BY_START,
  };
};

export const getInviteBySuccess = (data) => {
  return {
    type: actionTypes.INVITE_BY_SUCCESS,
    payload: data,
  };
};

export const getInviteByFail = (err) => {
  return {
    type: actionTypes.INVITE_BY_FAIL,
    payload: err,
  };
};

export const getInviteByReset = () => {
  return {
    type: actionTypes.INVITE_BY_RESET,
  };
};

export const InviteByData = (data) => {
  return (dispatch) => {
    dispatch(getInviteByStart());
    getInviteeBy(data)
      .then((res) => {
        dispatch(getInviteBySuccess(res));
      })
      .catch((err) => {
        dispatch(getInviteByFail(err));
      });
  };
};
