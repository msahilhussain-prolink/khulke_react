import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: null,
  loading: false,
  error: null,
  document: null,
};

const acceptAccessReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ACCEPT_ACCESS_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.ACCEPT_ACCESS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case actionTypes.ACCEPT_ACCESS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default acceptAccessReducer;
