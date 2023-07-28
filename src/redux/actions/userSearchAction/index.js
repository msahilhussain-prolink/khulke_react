import { userTagSearch } from "../../../apis/userTagSearch";
import * as actionTypes from "../actionTypes";

export const getUserSearchStart = () => {
  return {
    type: actionTypes.GET_USERSEARCH_START,
  };
};

export const getUserSearchSuccess = (data) => {
  return {
    type: actionTypes.GET_USERSEARCH_SUCCESS,
    payload: data,
  };
};

export const getUserSearchFail = (err) => {
  return {
    type: actionTypes.GET_USERSEARCH_FAIL,
    payload: err,
  };
};

export const getUserSearch = (data) => {
  return (dispatch) => {
    dispatch(getUserSearchStart());
    userTagSearch(data)
      .then((res) => {
        dispatch(getUserSearchSuccess(res.data));
      })
      .catch((err) => {
        dispatch(getUserSearchFail(err));
      });
  };
};
