import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const bookmarReducer = (state = initialState, action) => {
  switch (action.type) {
    // ** POST Bookmark
    case actionTypes.BOOKMARK_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.BOOKMARK_SUCCESS:
      return {
        ...state,
        data: action.payload,
        loading: false,
      };
    case actionTypes.BOOKMARK_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default bookmarReducer;
