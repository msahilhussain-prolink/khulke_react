import { getInterest, updateInterest } from "../../../apis/interestApis";
import * as actionTypes from "../actionTypes";

// ** GET INTEREST
export const getInterestStart = () => {
  return {
    type: actionTypes.GET_INTEREST_START,
  };
};

export const getInterestSuccess = (data) => {
  return {
    type: actionTypes.GET_INTEREST_SUCCESS,
    payload: data,
  };
};

export const getInterestFail = (err) => {
  return {
    type: actionTypes.GET_INTEREST_FAIL,
    payload: err,
  };
};

export const getInterestData = () => {
  return async (dispatch) => {
    dispatch(getInterestStart());
    getInterest()
      .then((res) => {
        dispatch(getInterestSuccess(res.data));
      })
      .catch((err) => {
        dispatch(getInterestFail("Somethings went wrong! try again."));
      });
  };
};

// ** UPDATE INTEREST
export const updateInterestStart = () => {
  return {
    type: actionTypes.UPDATE_INTEREST_START,
  };
};

export const updateInterestSuccess = (data) => {
  return {
    type: actionTypes.UPDATE_INTEREST_SUCCESS,
    payload: data,
  };
};

export const updateInterestFail = (err) => {
  return {
    type: actionTypes.UPDATE_INTEREST_FAIL,
    payload: err,
  };
};

export const updateInterestData = (data) => {
  return async (dispatch) => {
    dispatch(updateInterestStart());
    updateInterest(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(updateInterestSuccess(res.data));
          sessionStorage.setItem("interests", JSON.stringify(res.data));
        }
      })
      .catch((err) => {
        dispatch(updateInterestFail(err));
      });
  };
};
