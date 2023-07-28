import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  interest: [],
  error: null,
  loading: false,
};

const interestReducer = (state = initialState, action) => {
  switch (action.type) {
    // ** GET INTEREST
    case actionTypes.GET_INTEREST_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.GET_INTEREST_SUCCESS:
      return {
        ...state,
        interest: action.payload,
        loading: false,
      };
    case actionTypes.GET_INTEREST_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    // ** UPDATE INTEREST
    case actionTypes.UPDATE_INTEREST_START:
      return {
        ...state,
      };
    case actionTypes.UPDATE_INTEREST_SUCCESS:
      return {
        ...state,
        interest: action.payload,
      };
    case actionTypes.UPDATE_INTEREST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default interestReducer;
