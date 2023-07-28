import { getPastRT } from "../../../apis/pastRTDataApi";
import * as actionTypes from "../actionTypes";

// ** GET PAST RT DATA
export const getPastRTStart = () => {
  return {
    type: actionTypes.GET_PASTRT_START,
  };
};

export const getPastRTSuccess = (data) => {
  return {
    type: actionTypes.GET_PASTRT_SUCCESS,
    payload: data,
  };
};

export const getPastRTFail = (err) => {
  return {
    type: actionTypes.GET_PASTRT_FAIL,
    payload: err,
  };
};

export const getPastRTData = () => {
  return async (dispatch) => {
    dispatch(getPastRTStart());
    getPastRT()
      .then((res) => {
        dispatch(getPastRTSuccess(res.data));
      })
      .catch((err) => {
        dispatch(getPastRTFail("Somethings went wrong! try again."));
      });
  };
};
