import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: null,
  error: null,
};

const firebaseTokenReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TOKEN_START:
      return {
        ...state,
      };
    case actionTypes.TOKEN_SUCCESS:
      return {
        data: action.payload,
      };
    case actionTypes.TOKEN_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default firebaseTokenReducer;
