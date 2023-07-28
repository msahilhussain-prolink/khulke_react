import { editUsername } from "../../../apis/editUsernameAPI";
import { moengageEvent } from "../../../utils/utils";
import * as actionTypes from "../actionTypes";

// ** GET POST
export const editUserActionStart = () => {
  return {
    type: actionTypes.EDIT_USER_ACTION_START,
  };
};

export const editUserActionSuccess = (data) => {
  return {
    type: actionTypes.EDIT_USER_ACTION_SUCCESS,
    payload: data,
  };
};

export const editUserActionFail = (err) => {
  return {
    type: actionTypes.EDIT_USER_ACTION_FAIL,
    payload: err,
  };
};

export const editUserActionData = (data) => {
  return (dispatch) => {
    dispatch(editUserActionStart());
    editUsername(data)
      .then((res) => {
        if (res?.status === 200) {
          moengageEvent("Update Username", "User", {
            Username: data?.edit_usernames,
          });
        }
        dispatch(editUserActionSuccess(res.data));
      })
      .catch((err) => {
        dispatch(editUserActionFail(err));
      });
  };
};
