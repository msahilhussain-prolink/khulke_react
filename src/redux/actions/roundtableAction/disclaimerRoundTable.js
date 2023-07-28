// import { SingleRoundTable } from "../../../apis/roundatbleAPI";
import { DisclaimerRoundTable } from "../../../apis/roundatbleAPI";
import logger from "../../../logger";
import * as actionTypes from "../actionTypes";

export const getDisclaimerRTStart = (data) => {
  logger.info("getDisclaimerRTStart", data);
  return {
    type: actionTypes.GET_RT_DISCLAIMER_START,
  };
};

export const getDisclaimerRTSuccess = (data) => {
  logger.info("GET_RT_DISCLAIMER_SUCCESS Data", data);
  return {
    type: actionTypes.GET_RT_DISCLAIMER_SUCCESS,
    payload: data,
  };
};

export const getDisclaimerRTFail = (err) => {
  logger.info("GET_RT_DISCLAIMER_ERROR Data", err);
  return {
    type: actionTypes.GET_RT_DISCLAIMER_FAIL,
    payload: err,
  };
};

export const getDisclaimerRTData = (data) => {
  return (dispatch) => {
    dispatch(getDisclaimerRTStart(data));
    DisclaimerRoundTable(data)
      .then((res) => {
        dispatch(getDisclaimerRTSuccess(res?.data));
      })
      .catch((err) => {
        dispatch(getDisclaimerRTFail(err));
      });
  };
};