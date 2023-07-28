import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: [],
  error: null,
  loading: false,
};

const rejectAcceptReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.REJECT_ACCEPT_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.REJECT_ACCEPT_SUCCESS:
      return {
        ...state,
        data: action.payload,
        loading: false,
      };
    case actionTypes.REJECT_ACCEPT_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default rejectAcceptReducer;
