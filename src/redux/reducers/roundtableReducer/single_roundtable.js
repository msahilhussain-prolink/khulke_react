import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: null,
  loading: false,
  error: null,
  document: null,
};

const roundtableSingleReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_RT_SINGLE_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.GET_RT_SINGLE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case actionTypes.GET_RT_SINGLE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case actionTypes.GET_RT_SINGLE_RESET: 
      return {
        ...state,
        data: null,
        loading: false,
        error: null,
      }
    case actionTypes.SET_RT_DOCUMENT: {
      return {
        ...state,
        document: action.data,
      };
    }
    default:
      return state;
  }
};

export default roundtableSingleReducer;
