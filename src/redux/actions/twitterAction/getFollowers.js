import { getTwitterFollowers } from "../../../apis/twitterApi";
import * as actionTypes from "../actionTypes";

export const getTwFolStart = () => {
  return {
    type: actionTypes.GET_TWFOL_START,
    loading: true,
  };
};

export const getTwFolSuccess = (data) => {
  return {
    type: actionTypes.GET_TWFOL_SUCCESS,
    payload: data,
    loading: false,
  };
};

export const getTwFolFail = (err) => {
  return {
    type: actionTypes.GET_TWFOL_FAIL,
    payload: err,
    loading: false,
  };
};

export const getTwFol = () => {
  return (dispatch) => {
    getTwitterFollowers()
      .then((res) => {
        if (res.status === 200) {
          dispatch(getTwFolSuccess(res.data));
        }
      })
      .catch((err) => {
        dispatch(getTwFolFail(err));
      });
  };
};
