import { logoVideos } from "../../../apis/roundatbleAPI";
import * as actionTypes from "../actionTypes";

export const logoVideoStart = () => {
  return {
    type: actionTypes.LOGO_VIDEOS_START,
  };
};

export const logoVideoSuccess = (data) => {
  return {
    type: actionTypes.LOGO_VIDEOS_SUCCESS,
    payload: data,
  };
};

export const logoVideoFail = (err) => {
  return {
    type: actionTypes.LOGO_VIDEOS_FAIL,
    payload: err,
  };
};

export const logoVideoData = (data) => {
  return (dispatch) => {
    dispatch(logoVideoStart());
    logoVideos(data)
      .then((res) => {
        dispatch(logoVideoSuccess(res));
      })
      .catch((err) => {
        dispatch(logoVideoFail(err));
      });
  };
};
