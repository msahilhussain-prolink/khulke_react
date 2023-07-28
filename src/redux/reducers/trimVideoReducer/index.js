import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const audioTrimReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.VIDEO_TRIM_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.VIDEO_TRIM_SUCCESS:
      return {
        ...state,
        data: action.payload,
        loading: false,
      };
    case actionTypes.VIDEO_TRIM_FAIL:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export default audioTrimReducer;
