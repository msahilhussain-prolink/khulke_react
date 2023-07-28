import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: null,
  loading: false,
  error: null,
  document: null,
};

const requestAccessReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.REQUEST_ACCESS_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.REQUEST_ACCESS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case actionTypes.REQUEST_ACCESS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default requestAccessReducer;
