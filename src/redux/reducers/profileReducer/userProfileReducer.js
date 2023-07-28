import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: [],
};
const userProfilerReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.USER_PROFILE_START:
      return {
        ...state,
      };
    case actionTypes.USER_PROFILE_SUCCESS:
      return {
        ...state,
        data: action.payload,
      };
    case actionTypes.USER_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default userProfilerReducer;
