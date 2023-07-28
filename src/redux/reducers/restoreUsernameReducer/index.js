import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: null,
  loading: false,
  error: null,
  document: null,
};

const restoreUsernameReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RESTORE_USERNAME_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.RESTORE_USERNAME_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case actionTypes.RESTORE_USERNAME_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default restoreUsernameReducer;
