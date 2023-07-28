import { restoreUsername } from "../../../apis/restoreUsernameApi";
import * as actionTypes from "../actionTypes";

export const getRestoreUsernameStart = () => {
  return {
    type: actionTypes.RESTORE_USERNAME_START,
  };
};

export const getRestoreUsernameSuccess = (data) => {
  return {
    type: actionTypes.RESTORE_USERNAME_SUCCESS,
    payload: data,
  };
};

export const getRestoreUsernameFail = (err) => {
  return {
    type: actionTypes.RESTORE_USERNAME_FAIL,
    payload: err,
  };
};

export const restoreUsernameData = (data) => {
  return (dispatch) => {
    dispatch(getRestoreUsernameStart());
    restoreUsername(data)
      .then((res) => {
        dispatch(getRestoreUsernameSuccess(res.data));
      })
      .catch((err) => {
        dispatch(getRestoreUsernameFail(err));
      });
  };
};
