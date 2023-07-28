import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: null,
  error: null,
};

const interactionReducer = (state = initialState, action) => {
  switch (action.type) {
  case actionTypes.INTERACTION_REQUEST:
    return {
      ...state,
    };
  case actionTypes.INTERACTION_SUCCESS: {
    return {
      data: action.payload,
    };
  }
  case actionTypes.INTERACTION_FAIL:
    return {
      ...state,
      error: action.payload,
    };

  default:
    return state;
  }
};

export default interactionReducer;
