import {
  CREATE_EDIT_ROUNDTABLE_INITIALIZE,
  CREATE_EDIT_ROUNDTABLE_START,
  CREATE_EDIT_ROUNDTABLE_SUCCESS,
  CREATE_EDIT_ROUNDTABLE_FAIL,
} from "../actionTypes";

export const createEditRoundtableInitialize = (data) => {
  return {
    type: CREATE_EDIT_ROUNDTABLE_INITIALIZE,
    payload: data,
  };
};

export const createEditRoundtableStart = (data) => {
  return {
    type: CREATE_EDIT_ROUNDTABLE_START,
    payload: data,
  };
};
export const createEditRoundtableSuccess = (data) => {
  return {
    type: CREATE_EDIT_ROUNDTABLE_SUCCESS,
    payload: data,
  };
};
export const createEditRoundtableFail = (data) => {
  return {
    type: CREATE_EDIT_ROUNDTABLE_FAIL,
    payload: data,
  };
};
