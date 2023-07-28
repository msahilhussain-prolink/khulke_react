import { getFriendList } from "../../../apis/friendlistApi";
import * as actionTypes from "../actionTypes";

// ** GET POST
export const getFriendListStart = () => {
  return {
    type: actionTypes.GET_INTEREST_START,
  };
};

export const getFriendListSuccess = (data) => {
  return {
    type: actionTypes.GET_INTEREST_SUCCESS,
    payload: data,
  };
};

export const getFriendListFail = (err) => {
  return {
    type: actionTypes.GET_INTEREST_FAIL,
    payload: err,
  };
};

export const getFriendListData = (data) => {
  return (dispatch) => {
    dispatch(getFriendListStart());
    getFriendList(data)
      .then((res) => {
        dispatch(getFriendListSuccess(res.data));
      })
      .catch((err) => {
        // dispatch(getFriendListFail(err));
      });
  };
};
