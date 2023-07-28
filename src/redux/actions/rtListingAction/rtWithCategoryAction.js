import  { getRTListByCategory } from "../../../apis/mineRTApi";
import * as actionTypes from "../actionTypes";

export const getRTListByCategoryRequest = () => {
    return {
      type: actionTypes.RT_LISTING_CATEGORY_REQUEST,
    };
  };
  
  export const getRTListByCategorySuccess = (data) => {
    return {
      type: actionTypes.RT_LISTING_CATEGORY_SUCCESS,
      payload: data,
    };
  };
  
  export const getRTListByCategoryFail = (err) => {
    return {
      type: actionTypes.RT_LISTING_CATEGORY_FAIL,
      payload: err,
    };
  };

  export const getRTListCategoryData = (data) => {
    return (dispatch) => {
      dispatch(getRTListByCategoryRequest());
      getRTListByCategory(data)
        .then((res) => {
            console.log("jdgkjsdhgjkhjkds863583657328658726", res)
          dispatch(getRTListByCategorySuccess(res));
        })
        .catch((err) => {
          dispatch(getRTListByCategoryFail(err));
        });
    };
  };