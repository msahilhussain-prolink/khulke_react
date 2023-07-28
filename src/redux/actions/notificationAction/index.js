import { universalNotifications } from "../../../apis/fbasenotificationsAPI";
import * as actionTypes from "../actionTypes";
//* UNIVERSAL NOTIFICATIONS
export const notificationsStart = () => {
  return {
    type: actionTypes.NOTIFICATION_START,
  };
};

export const notificationsSuccess = (data) => {
  return {
    type: actionTypes.NOTIFICATION_SUCCESS,
    payload: data,
  };
};

export const notificationsFail = (err) => {
  return {
    type: actionTypes.NOTIFICATION_FAIL,
    payload: err,
  };
};

export const notificationsState = (data) => {
  return (dispatch) => {
    dispatch(notificationsStart());
    dispatch(notificationsSuccess(universalNotifications(data)));
    // .then((res) => {
    //   dispatch(notificationsSuccess(res));
    // })
    // .catch((err) => {
    //   dispatch(notificationsFail(err));
    // });
  };
};
