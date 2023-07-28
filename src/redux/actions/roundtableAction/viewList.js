import { getViewList } from "../../../apis/roundatbleAPI";
import * as actionTypes from "../actionTypes";

export const getViewListStart = () => {
  return {
    type: actionTypes.VIEW_LIST_START,
  };
};

export const getViewListSuccess = (data) => {
  return {
    type: actionTypes.VIEW_LIST_SUCCESS,
    payload: data,
  };
};

export const getViewListFail = (err) => {
  return {
    type: actionTypes.VIEW_LIST_FAIL,
    payload: err,
  };
};

export const ViewListData = (data) => {
  return (dispatch) => {
    dispatch(getViewListStart());
    getViewList(data)
      .then((res) => {
        dispatch(getViewListSuccess(res));
      })
      .catch((err) => {
        dispatch(getViewListFail(err));
      });
  };
};
