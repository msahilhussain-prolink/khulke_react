import { getHistoricalMessages } from "../../../apis/historicalMessaging";
import * as actionTypes from "../actionTypes";

export const getHistMessagesStart = () => {
  return {
    type: actionTypes.GET_HIST_MESSAGES_START,
  };
};

export const getHistMessagesSuccess = (data) => {
  return {
    type: actionTypes.GET_HIST_MESSAGES_SUCCESS,
    payload: data,
  };
};

export const getHistMessagesFail = (err) => {
  return {
    type: actionTypes.GET_HIST_MESSAGES_FAIL,
    payload: err,
  };
};

export const getHistoricalMessage = (data) => {
  return (dispatch) => {
    dispatch(getHistMessagesStart());
    getHistoricalMessages(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(getHistMessagesSuccess(res.data.data));
        }
      })
      .catch((err) => {
        dispatch(getHistMessagesFail(err));
      });
  };
};
