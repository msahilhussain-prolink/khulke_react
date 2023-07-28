import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: null,
  loading: false,
  error: null,
  document: null,
};

const rtActionReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RT_ACTION_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.RT_ACTION_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case actionTypes.RT_ACTION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default rtActionReducer;
