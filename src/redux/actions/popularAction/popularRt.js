import { getPopularRTs } from "../../../apis/popular";
import * as actionTypes from "../actionTypes";

// ** GET PAST RT DATA
export const getPopularStart = () => {
  return {
    type: actionTypes.GET_POPULAR_START,
  };
};

export const getPopularSuccess = (data) => {
  return {
    type: actionTypes.GET_POPULAR_SUCCESS,
    payload: data,
  };
};

export const getPopularFail = (err) => {
  return {
    type: actionTypes.GET_POPULAR_FAIL,
    payload: err,
  };
};

export const getPopularData = () => {
  return async (dispatch) => {
    dispatch(getPopularStart());
    getPopularRTs()
      .then((res) => {
        dispatch(getPopularSuccess(res.data));
      })
      .catch((err) => {
        dispatch(getPopularFail("Somethings went wrong! try again."));
      });
  };
};
