import { addNotification } from "../../../apis/notificationApi";
import * as actionTypes from "../actionTypes";

export const interactionRequest = () => {
  return {
    type: actionTypes.INTERACTION_REQUEST,
  };
};

export const interactionSuccess = (data) => {
  return {
    type: actionTypes.INTERACTION_SUCCESS,
    payload: data,
  };
};

export const interactionFail = (err) => {
  return {
    type: actionTypes.INTERACTION_FAIL,
    payload: err,
  };
};

export const interactionDispatch = (data) => {
  return (dispatch) => {
    dispatch(interactionRequest());
    addNotification(data)
      .then((res) => {
        dispatch(interactionSuccess(res.data));
      })
      .catch((err) => {
        dispatch(interactionFail(err.data));
      });
  };
};
