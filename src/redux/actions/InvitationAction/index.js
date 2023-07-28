import { getInvitation } from "../../../apis/invitationPopApi";
import * as actionTypes from "../actionTypes";

// ** GET INVITATION POP UP
export const getInvitationStart = () => {
  return {
    type: actionTypes.INVITATION_POP_START,
  };
};

export const getInvitationSuccess = (data) => {
  return {
    type: actionTypes.INVITATION_POP_SUCCESS,
    payload: data,
  };
};

export const getInvitationFail = (err) => {
  return {
    type: actionTypes.INVITATION_POP_FAIL,
    payload: err,
  };
};

export const getInvitationData = () => {
  return async (dispatch) => {
    dispatch(getInvitationStart());
    getInvitation()
      .then((res) => {
        dispatch(getInvitationSuccess(res.data));
      })
      .catch((err) => {
        dispatch(getInvitationFail("Somethings went wrong! try again."));
      });
  };
};
