import { universalUA } from "../../../apis/userAction";
import { moengageEvent } from "../../../utils/utils";
import * as actionTypes from "../actionTypes";

export const getUserActionStart = () => {
  return {
    type: actionTypes.GET_USERACTION_START,
  };
};

export const getUserActionSuccess = (data) => {
  return {
    type: actionTypes.GET_USERACTION_SUCCESS,
    payload: data,
  };
};

export const getUserActionFail = (err) => {
  return {
    type: actionTypes.GET_USERACTION_FAIL,
    payload: err,
  };
};

export const getUserActionData = (data) => {
  return (dispatch) => {
    dispatch(getUserActionStart());
    universalUA(data)
      .then((res) => {
        dispatch(getUserActionSuccess(res));
      })
      .catch((err) => {
        dispatch(getUserActionFail(err));
      });
  };
};

export const performUserActionData = (data) => {
  return (dispatch) => {
    dispatch(getUserActionStart());
    universalUA(data)
      .then((res) => {
        moengageEvent("UnBlock Account", "User", { UsernameOth: data.handle });
        dispatch(getUserActionSuccess(res));
      })
      .catch((err) => {
        dispatch(getUserActionFail(err));
      });
  };
};
