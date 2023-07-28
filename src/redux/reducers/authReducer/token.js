import * as actionTypes from "../../actions/actionTypes";
import initialState from "../initialState";

const getTokenReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.OBTAIN_TOKEN_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.OBTAIN_TOKEN_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case actionTypes.OBTAIN_TOKEN_SUCCESS:
      return {
        ...state,
        tokens: action.payload,
      };
    default:
      return state;
  }
};

export default getTokenReducer;
