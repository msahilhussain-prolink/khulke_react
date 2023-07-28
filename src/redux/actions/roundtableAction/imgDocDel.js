import { onDocImageDelete } from "../../../apis/roundatbleAPI";
import * as actionTypes from "../actionTypes";

export const delImgDocStart = () => {
  return {
    type: actionTypes.DEL_IMAGE_CHANGE_START,
  };
};

export const delImgDocSuccess = (data) => {
  return {
    type: actionTypes.DEL_IMAGE_CHANGE_SUCCESS,
    payload: data,
  };
};

export const delImgDocFail = (err) => {
  return {
    type: actionTypes.DEL_IMAGE_CHANGE_FAIL,
    payload: err,
  };
};

export const delImgDocData = (data) => {
  return (dispatch) => {
    dispatch(delImgDocStart());
    onDocImageDelete(data)
      .then((res) => {
        dispatch(delImgDocSuccess(res));
      })
      .catch((err) => {
        dispatch(delImgDocFail(err));
      });
  };
};
