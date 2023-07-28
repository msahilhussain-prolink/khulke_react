import { updateUsername } from "../../../apis/changeusernameAPI";
import * as actionTypes from "../actionTypes";
//* UNIVERSAL SEARCH
export const updateUsernameStart = () => {
  return {
    type: actionTypes.UPDATE_USER_NAME_START,
  };
};

export const updateUsernameSuccess = (data) => {
  return {
    type: actionTypes.UPDATE_USER_NAME_SUCCESS,
    payload: data,
  };
};

export const updateUsernameFail = (err) => {
  return {
    type: actionTypes.UPDATE_USER_NAME_FAIL,
    payload: err,
  };
};

export const getUsernameData = (data) => {
  return (dispatch) => {
    dispatch(updateUsernameStart());
    updateUsername(data)
      .then((res) => {
        dispatch(updateUsernameSuccess(res));
      })
      .catch((err) => {
        dispatch(updateUsernameFail(err));
      });
  };
};
