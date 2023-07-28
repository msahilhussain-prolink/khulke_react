import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data : {}
};
const editUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.EDIT_USER_ACTION_START:
      return {
        ...state,
      };
    case actionTypes.EDIT_USER_ACTION_SUCCESS:
      return {
        ...state,
        data: action.payload,
      };
    case actionTypes.EDIT_USER_ACTION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default editUserReducer;
