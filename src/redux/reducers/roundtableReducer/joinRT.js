import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const joinRTReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.JOIN_RT_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.JOIN_RT_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case actionTypes.JOIN_RT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default joinRTReducer;
