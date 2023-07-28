import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: null,
  loading: false,
  error: null,
  document: null,
};

const deleteRtReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.DELETE_RT_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.DELETE_RT_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case actionTypes.DELETE_RT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default deleteRtReducer;
