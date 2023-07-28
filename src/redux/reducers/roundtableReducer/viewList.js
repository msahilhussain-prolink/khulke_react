import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: null,
  loading: false,
  error: null,
  document: null,
};

const viewListReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.VIEW_LIST_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.VIEW_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case actionTypes.VIEW_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default viewListReducer;
