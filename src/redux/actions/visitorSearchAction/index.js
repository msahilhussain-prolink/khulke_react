import { visitorSearch } from "../../../apis/visitorSearchApi";
import * as actionTypes from "../actionTypes";

export const getVisitorSearchStart = () => {
  return {
    type: actionTypes.GET_VISITORSEARCH_START,
  };
};

export const getVisitorSearchSuccess = (data) => {
  return {
    type: actionTypes.GET_VISITORSEARCH_SUCCESS,
    payload: data,
  };
};

export const getVisitorSearchFail = (err) => {
  return {
    type: actionTypes.GET_VISITORSEARCH_FAIL,
    payload: err,
  };
};

export const getVisitorSearch = (data) => {
  return (dispatch) => {
    dispatch(getVisitorSearchStart());
    visitorSearch(data)
      .then((res) => {
        dispatch(getVisitorSearchSuccess(res.data));
      })
      .catch((err) => {
        dispatch(getVisitorSearchFail(err));
      });
  };
};
