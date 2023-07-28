import  {getRTByCategories } from "../../../apis/mineRTApi";
import * as actionTypes from "../actionTypes";

export const getMineRTListRequest = () => {
  return {
    type: actionTypes.MINE_RT_LISTING_REQUEST,
  };
};

export const getMineRTListSuccess = (data) => {
  return {
    type: actionTypes.MINE_RT_LISTING_SUCCESS,
    payload: data,
  };
};

export const getMineRTListFail = (err) => {
  return {
    type: actionTypes.MINE_RT_LISTING_FAIL,
    payload: err,
  };
};



export const getMineRTListData = (data) => {
  return (dispatch) => {
    dispatch(getMineRTListRequest());
    getRTByCategories(data)
      .then((res) => {
        dispatch(getMineRTListSuccess(res));
      })
      .catch((err) => {
        dispatch(getMineRTListFail(err));
      });
  };
};

