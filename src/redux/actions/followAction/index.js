import { getfollow } from "../../../apis/followApi";
import * as actionTypes from "../actionTypes";
//* UNIVERSAL FOLLOW
export const getFollowStart = () => {
  return {
    type: actionTypes.GET_FOLLOW_START,
  };
};

export const getFollowSuccess = (data) => {
  return {
    type: actionTypes.GET_FOLLOW_SUCCESS,
    payload: data,
  };
};

export const getFollowFail = (err) => {
  return {
    type: actionTypes.GET_FOLLOW_FAIL,
    payload: err,
  };
};

export const getFollowData = (data) => {
  return (dispatch) => {
    dispatch(getFollowStart());
    getfollow(data)
      .then((res) => {
        dispatch(getFollowSuccess(res.data));
      })
      .catch((err) => {
        dispatch(getFollowFail(err));
      });
  };
};
