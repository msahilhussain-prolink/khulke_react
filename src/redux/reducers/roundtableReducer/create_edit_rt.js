import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const createEditRtReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CREATE_EDIT_RT_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.CREATE_EDIT_RT_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case actionTypes.CREATE_EDIT_RT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default createEditRtReducer;
