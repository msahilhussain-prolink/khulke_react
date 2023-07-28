import { universalSearch } from "../../../apis/searchApi";
import * as actionTypes from "../actionTypes";
//* UNIVERSAL SEARCH
export const getSearchStart = () => {
  return {
    type: actionTypes.GET_SEARCH_START,
  };
};

export const getSearchSuccess = (data) => {
  return {
    type: actionTypes.GET_SEARCH_SUCCESS,
    payload: data,
  };
};

export const getSearchFail = (err) => {
  return {
    type: actionTypes.GET_SEARCH_FAIL,
    payload: err,
  };
};

export const getSearchData = (data) => {
  return (dispatch) => {
    dispatch(getSearchStart());
    universalSearch(data)
      .then((res) => {
        dispatch(getSearchSuccess(res));
      })
      .catch((err) => {
        dispatch(getSearchFail(err));
      });
  };
};
