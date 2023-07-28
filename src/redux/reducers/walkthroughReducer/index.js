import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: {},
};
const walkthroughReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.WALKTHROUGH_START:
      return {
        ...state,
      };
    case actionTypes.WALKTHROUGH_SUCCESS:
      return {
        ...state,
        data: action.payload,
      };
    case actionTypes.WALKTHROUGH_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default walkthroughReducer;
