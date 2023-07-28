import { invite_panelist } from "../../../apis/roundatbleAPI";
import * as actionTypes from "../actionTypes";

export const getInvitePanelistStart = () => {
  return {
    type: actionTypes.INVITE_PANELIST_START,
  };
};

export const getInvitePanelistSuccess = (data) => {
  return {
    type: actionTypes.INVITE_PANELIST_SUCCESS,
    payload: data,
  };
};

export const getInvitePanelistFail = (err) => {
  return {
    type: actionTypes.INVITE_PANELIST_FAIL,
    payload: err,
  };
};

export const invitePanelistData = (data) => {
  return (dispatch) => {
    dispatch(getInvitePanelistStart());
    invite_panelist(data)
      .then((res) => {
        dispatch(getInvitePanelistSuccess(res));
      })
      .catch((err) => {
        dispatch(getInvitePanelistFail(err));
      });
  };
};
