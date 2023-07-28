import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const histMessageReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_HIST_MESSAGES_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.GET_HIST_MESSAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case actionTypes.GET_HIST_MESSAGES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default histMessageReducer;
