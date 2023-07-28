import * as actionTypes from "../../actions/actionTypes";

const suggestion = {
  interest: null,
  error: null,
};
const suggestionsReducer = (state = suggestion, action) => {
  switch (action.type) {
    case actionTypes.GET_INTEREST_START:
      return {
        ...state,
      };
    case actionTypes.GET_INTEREST_SUCCESS:
      return {
        ...state,
        interest: action.payload,
      };
    case actionTypes.GET_INTEREST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default suggestionsReducer;
