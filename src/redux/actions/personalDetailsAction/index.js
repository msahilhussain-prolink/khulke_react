import getPersonalDetailsApi from "../../../apis/personalDetails";
import * as actionTypes from "../actionTypes";

// ** GET PAST RT DATA
export const getPersonalDetailsRequest = () => {
  return {
    type: actionTypes.GET_PERSONALDETAIL_START,
  };
};

export const getPersonalDetailsSuccess = (data) => {
  return {
    type: actionTypes.GET_PERSONALDETAIL_SUCCESS,
    payload: data,
  };
};

export const getPersonalDetailsFail = (err) => {
  return {
    type: actionTypes.GET_PERSONALDETAIL_FAIL,
    payload: err,
  };
};

export const getPersonalDetailsData = () => {
  return (dispatch) => {
    dispatch(getPersonalDetailsRequest());
    getPersonalDetailsApi()
      .then((res) => {
        dispatch(getPersonalDetailsSuccess(res.data));
      })
      .catch((err) => {
        dispatch(getPersonalDetailsFail(`Somethings went wrong! try again. ${err.message}`));
      });
  };
};
