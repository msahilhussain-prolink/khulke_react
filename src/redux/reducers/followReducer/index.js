import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const followReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_FOLLOW_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.GET_FOLLOW_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case actionTypes.GET_FOLLOW_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default followReducer;
