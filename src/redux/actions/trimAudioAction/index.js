import { audioTrim } from "../../../apis/trimAudio";
import * as actionTypes from "../actionTypes";

export const audioTrimStart = () => {
  return {
    type: actionTypes.AUDIO_TRIM_START,
  };
};

export const audioTrimSuccess = (data) => {
  return {
    type: actionTypes.AUDIO_TRIM_SUCCESS,
    payload: data,
  };
};

export const audioTrimFail = (err) => {
  return {
    type: actionTypes.AUDIO_TRIM_FAIL,
    payload: err,
  };
};

export const getAudioTrim = (formData) => {
  return async (dispatch) => {
    dispatch(audioTrimStart());
    audioTrim(formData)
      .then((res) => {
        dispatch(audioTrimSuccess(res.data.data));
      })
      .catch((err) => {
        dispatch(audioTrimFail("error"));
      });
  };
};
