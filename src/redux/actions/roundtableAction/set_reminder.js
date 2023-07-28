import { SetRTReminder } from "../../../apis/roundatbleAPI";
import * as actionTypes from "../actionTypes";

export const getRTReminderStart = () => {
  return {
    type: actionTypes.GET_RT_REMINDER_START,
  };
};

export const getRTReminderSuccess = (data) => {
  return {
    type: actionTypes.GET_RT_REMINDER_SUCCESS,
    payload: data,
  };
};

export const getRTReminderFail = (err) => {
  return {
    type: actionTypes.GET_RT_REMINDER_FAIL,
    payload: err,
  };
};

export const getRTReminderData = (data) => {
  return (dispatch) => {
    dispatch(getRTReminderStart());
    SetRTReminder(data)
      .then((res) => {
        dispatch(getRTReminderSuccess(res.data));
      })
      .catch((err) => {
        dispatch(getRTReminderFail(err));
      });
  };
};
