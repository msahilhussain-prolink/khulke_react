import { videoTrim } from "../../../apis/trimVideo";
import * as actionTypes from "../actionTypes";

export const videoTrimStart = () => {
  return {
    type: actionTypes.VIDEO_TRIM_START,
  };
};

export const videoTrimSuccess = (data) => {
  return {
    type: actionTypes.VIDEO_TRIM_SUCCESS,
    payload: data,
  };
};

export const videoTrimFail = (err) => {
  return {
    type: actionTypes.VIDEO_TRIM_FAIL,
    payload: err,
  };
};

export const getVideoTrim = (formData) => {
  return async (dispatch) => {
    dispatch(videoTrimStart());
    videoTrim(formData)
      .then((res) => {
        dispatch(videoTrimSuccess(res.data));
      })
      .catch((err) => {
        dispatch(videoTrimFail("error"));
      });
  };
};
