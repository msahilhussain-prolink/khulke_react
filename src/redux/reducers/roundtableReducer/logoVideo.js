import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const logoVideoReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGO_VIDEOS_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.LOGO_VIDEOS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case actionTypes.LOGO_VIDEOS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default logoVideoReducer;
