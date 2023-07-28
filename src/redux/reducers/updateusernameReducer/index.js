import * as actionTypes from "../../actions/updateusernameAction";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const updateusernameReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_SEARCH_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.GET_SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case actionTypes.GET_SEARCH_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
export default updateusernameReducer;
