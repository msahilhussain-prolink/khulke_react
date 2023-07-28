import { deleteLogoVideos } from "../../../apis/roundatbleAPI";
import * as actionTypes from "../actionTypes";

export const delLogoVideoStart = () => {
  return {
    type: actionTypes.DEL_LOGO_VIDEOS_START,
  };
};

export const delLogoVideoSuccess = (data) => {
  return {
    type: actionTypes.DEL_LOGO_VIDEOS_SUCCESS,
    payload: data,
  };
};

export const delLogoVideoFail = (err) => {
  return {
    type: actionTypes.DEL_LOGO_VIDEOS_FAIL,
    payload: err,
  };
};

export const delLogoVideoData = (data) => {
  return (dispatch) => {
    dispatch(delLogoVideoStart());
    deleteLogoVideos(data)
      .then((res) => {
        dispatch(delLogoVideoSuccess(res));
      })
      .catch((err) => {
        dispatch(delLogoVideoFail(err));
      });
  };
};
