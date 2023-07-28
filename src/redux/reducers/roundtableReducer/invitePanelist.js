import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: null,
  loading: false,
  error: null,
  document: null,
};

const invitePanelistReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INVITE_PANELIST_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.INVITE_PANELIST_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case actionTypes.INVITE_PANELIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default invitePanelistReducer;
