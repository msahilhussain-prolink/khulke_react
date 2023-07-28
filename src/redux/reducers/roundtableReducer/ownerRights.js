import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: null,
  loading: false,
  error: null,
  document: null,
};

const ownerRightsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.OWNER_RIGHTS_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.OWNER_RIGHTS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case actionTypes.OWNER_RIGHTS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default ownerRightsReducer;
