import { getPopular, getPopularShows } from "../../../apis/popular";
import * as actionTypes from "../actionTypes";

// ** GET PAST RT DATA
export const getPopularShowStart = () => {
  return {
    type: actionTypes.GET_POPULAR_SHOW_START,
  };
};

export const getPopularShowSuccess = (data) => {
  return {
    type: actionTypes.GET_POPULAR_SHOW_SUCCESS,
    payload: data,
  };
};

export const getPopularShowFail = (err) => {
  return {
    type: actionTypes.GET_POPULAR_SHOW_FAIL,
    payload: err,
  };
};

export const getPopularShowData = () => {
  return async (dispatch) => {
    dispatch(getPopularShowStart());
    getPopularShows()
      .then((res) => {
        dispatch(getPopularShowSuccess(res.data));
      })
      .catch((err) => {
        dispatch(getPopularShowFail("Somethings went wrong! try again."));
      });
  };
};
