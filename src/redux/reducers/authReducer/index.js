import * as actionTypes from "../../actions/actionTypes";
const userInitialState = {
  data: {},
  error: null,
  tokens: null,
};

const userReducer = (state = userInitialState, action) => {
  switch (action.type) {
    case actionTypes.REGISTER_USER_START:
      return {
        ...state,
      };
    case actionTypes.REGISTER_USER_FAIL:
      return {
        ...state,
        data: {},
        error: action.payload,
      };
    case actionTypes.REGISTER_USER_SUCCESS:
      return {
        ...state,
        data: action.payload,
        error: false,
      };
    default:
      return state;
  }
};

export default userReducer;
