import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  popular: [],
  error: null,
  loading: false,
};

const popularShowsReducer = (state = initialState, action) => {
  switch (action.type) {
    // ** GET INTEREST
    case actionTypes.GET_POPULAR_SHOW_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.GET_POPULAR_SHOW_SUCCESS:
      return {
        ...state,
        popular: action.payload,
        loading: false,
      };
    case actionTypes.GET_POPULAR_SHOW_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default popularShowsReducer;
