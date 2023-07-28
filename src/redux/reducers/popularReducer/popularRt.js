import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  popular: [],
  error: null,
  loading: false,
};

const popularReducer = (state = initialState, action) => {
  switch (action.type) {
    // ** GET INTEREST
    case actionTypes.GET_POPULAR_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.GET_POPULAR_SUCCESS:
      return {
        ...state,
        popular: action.payload,
        loading: false,
      };
    case actionTypes.GET_POPULAR_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default popularReducer;
