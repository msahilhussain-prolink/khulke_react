import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const inviteByReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INVITE_BY_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.INVITE_BY_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case actionTypes.INVITE_BY_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case actionTypes.INVITE_BY_RESET: 
      return initialState

    default:
      return state;
  }
};

export default inviteByReducer;
