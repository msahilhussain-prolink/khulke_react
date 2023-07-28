import { urlMetaData } from "../../../apis/urlMetaDataApi";
import * as actionTypes from "../actionTypes";

// ** get metadata
export const getMetaDataStart = () => {
  return {
    type: actionTypes.METADATA_START,
  };
};

export const getMetaDataSuccess = (data) => {
  return {
    type: actionTypes.METADATA_SUCCESS,
    payload: data,
  };
};

export const getMetaDataFail = (err) => {
  return {
    type: actionTypes.METADATA_FAIL,
    payload: err,
  };
};

export const getMetaData = (target_url) => {
  return async (dispatch) => {
    dispatch(getMetaDataStart());
    urlMetaData(target_url)
      .then((res) => {
        if (res.status === 200) {
          dispatch(getMetaDataSuccess(res.data));
        }
      })
      .catch((err) => {
        dispatch(getMetaDataFail(err));
      });
  };
};
