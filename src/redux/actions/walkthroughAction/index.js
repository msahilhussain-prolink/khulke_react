import { walkthroughApi } from "../../../apis/walkthroughApi";
import * as actionTypes from "../actionTypes";

export const walkthroughStart = () => {
  return {
    type: actionTypes.WALKTHROUGH_START,
  };
};

export const walkthroughSuccess = (data) => {
  return {
    type: actionTypes.WALKTHROUGH_SUCCESS,
    payload: data,
  };
};

export const walkthroughFail = (err) => {
  return {
    type: actionTypes.WALKTHROUGH_FAIL,
    payload: err,
  };
};

export const walkthroughData = (data) => {
  return (dispatch) => {
    dispatch(walkthroughStart());
    walkthroughApi(data)
      .then((res) => {
        dispatch(walkthroughSuccess(res.data));
      })
      .catch((err) => {
        dispatch(walkthroughFail(err));
      });
  };
};
