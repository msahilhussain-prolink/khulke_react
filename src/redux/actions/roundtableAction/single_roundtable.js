import { SingleRoundTable } from "../../../apis/roundatbleAPI";
import * as actionTypes from "../actionTypes";

export const getRTSingleStart = () => {
  return {
    type: actionTypes.GET_RT_SINGLE_START,
  };
};

export const getRTSingleSuccess = (data) => {
  return {
    type: actionTypes.GET_RT_SINGLE_SUCCESS,
    payload: data,
  };
};

export const getRTSingleFail = (err) => {
  return {
    type: actionTypes.GET_RT_SINGLE_FAIL,
    payload: err,
  };
};

export const getRTSingleReset = () => {
  return {
    type: actionTypes.GET_RT_SINGLE_RESET,
  };
};

export const getRTSingleData = (data) => {
  return (dispatch) => {
    dispatch(getRTSingleStart());
    SingleRoundTable(data)
      .then((res) => {
        dispatch(getRTSingleSuccess(res.data));
      })
      .catch((err) => {
        dispatch(getRTSingleFail(err));
      });
  };
};

export const setRtCreationDocument = (data) => ({
  data,
  type: actionTypes.SET_RT_DOCUMENT,
});
