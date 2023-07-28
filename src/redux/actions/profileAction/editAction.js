import moment from "moment";
import { editDetails } from "../../../apis/editDetailsApi";
import { moengageEvent } from "../../../utils/utils";
import * as actionTypes from "../actionTypes";

// ** GET POST
export const editDetailsStart = () => {
  return {
    type: actionTypes.EDIT_DETAILS_START,
  };
};

export const editDetailsSuccess = (data) => {
  return {
    type: actionTypes.EDIT_DETAILS_SUCCESS,
    payload: data,
  };
};

export const editDetailsFail = (err) => {
  return {
    type: actionTypes.EDIT_DETAILS_FAIL,
    payload: err,
  };
};

export const editDetailsData = (data) => {
  return (dispatch) => {
    dispatch(editDetailsStart());
    editDetails(data)
      .then((res) => {
        if (res?.status === 200) {
          let date = moment(new Date()).format("YYYY-MM-DD");
          moengageEvent("Update  Profile", "User", {
            Name: res?.data?.data?.name,
            Age: moment(date).diff(res?.data?.data?.date_of_birth, "years"),
            DOB: res?.data?.data?.date_of_birth,
          });
        }
        dispatch(editDetailsSuccess(res.data));
      })
      .catch((err) => {
        dispatch(editDetailsFail(err));
      });
  };
};
