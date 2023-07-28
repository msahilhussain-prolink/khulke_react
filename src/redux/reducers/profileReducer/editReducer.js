import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data : {}
};
const editDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.EDIT_DETAILS_START:
      return {
        ...state,
      };
    case actionTypes.EDIT_DETAILS_SUCCESS:
      return {
        ...state,
        data: action.payload,
      };
    case actionTypes.EDIT_DETAILS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default editDetailReducer;
