import { onImageDocChange } from "../../../apis/roundatbleAPI";
import * as actionTypes from "../actionTypes";

export const imageChangeStart = () => {
  return {
    type: actionTypes.IMAGE_CHANGE_START,
  };
};

export const imageChangeSuccess = (data) => {
  return {
    type: actionTypes.IMAGE_CHANGE_SUCCESS,
    payload: data,
  };
};

export const imageChangeFail = (err) => {
  return {
    type: actionTypes.IMAGE_CHANGE_FAIL,
    payload: err,
  };
};

export const imageDocChangeData = (data) => {
  return (dispatch) => {
    dispatch(imageChangeStart());
    onImageDocChange(data)
      .then((res) => {
        dispatch(imageChangeSuccess(res));
      })
      .catch((err) => {
        dispatch(imageChangeFail(err));
      });
  };
};
