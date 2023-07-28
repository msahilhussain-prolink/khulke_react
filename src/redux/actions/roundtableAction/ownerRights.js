import { ownerRights } from "../../../apis/roundatbleAPI";
import * as actionTypes from "../actionTypes";

export const ownerRightsStart = () => {
  return {
    type: actionTypes.OWNER_RIGHTS_START,
  };
};

export const ownerRightsSuccess = (data) => {
  return {
    type: actionTypes.OWNER_RIGHTS_SUCCESS,
    payload: data,
  };
};

export const ownerRightsFail = (err) => {
  return {
    type: actionTypes.OWNER_RIGHTS_FAIL,
    payload: err,
  };
};

export const ownerRightsData = (data) => {
  return (dispatch) => {
    dispatch(ownerRightsStart());
    ownerRights(data)
      .then((res) => {
        dispatch(ownerRightsSuccess(res));
      })
      .catch((err) => {
        dispatch(ownerRightsFail(err));
      });
  };
};
