import { RoundTable } from "../../../apis/roundatbleAPI";
import * as actionTypes from "../actionTypes";

export const getRTStart = () => {
  return {
    type: actionTypes.GET_RT_START,
  };
};

export const getRTSuccess = (data) => {
  return {
    type: actionTypes.GET_RT_SUCCESS,
    payload: data,
  };
};

export const getRTFail = (err) => {
  return {
    type: actionTypes.GET_RT_FAIL,
    payload: err,
  };
};

export const getRTData = (data) => {
  return (dispatch) => {
    dispatch(getRTStart());
    RoundTable(data)
      .then((res) => {
        dispatch(getRTSuccess(res.data));
      })
      .catch((err) => {
        dispatch(getRTFail(err));
      });
  };
};

export const ConsentData = (payload) => ({
  type: actionTypes.SET_CONSENT,
  payload,
});

export const LiveUsers = (payload) => ({
  type: actionTypes.SET_LIVE_USER,
  payload,
});
