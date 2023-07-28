import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: {},
};

const getUserSearch = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SEARCH_DETAILS_START:
      return {
        ...state,
      };
    case actionTypes.SEARCH_DETAILS_SUCCESS:
      return {
        data: action.payload,
      };
    case actionTypes.SEARCH_DETAILS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default getUserSearch;
