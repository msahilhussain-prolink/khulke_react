import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const imageChangeReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.IMAGE_CHANGE_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.IMAGE_CHANGE_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case actionTypes.IMAGE_CHANGE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default imageChangeReducer;
