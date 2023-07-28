import { getProfile } from "../../../apis/profileApi";
import * as actionTypes from "../actionTypes";

export const userProfileStart = () => {
  return {
    type: actionTypes.USER_PROFILE_START,
  };
};

export const userProfileSuccess = (data) => {
  return {
    type: actionTypes.USER_PROFILE_SUCCESS,
    payload: data,
  };
};

export const userProfileFail = (err) => {
  return {
    type: actionTypes.USER_PROFILE_FAIL,
    payload: err,
  };
};

export const userProfileData = (data) => {
  return (dispatch) => {
    dispatch(userProfileStart());
    getProfile(data)
      .then((res) => {
        dispatch(userProfileSuccess(res.data));
      })
      .catch((err) => {
        dispatch(userProfileFail(err));
      });
  };
};
