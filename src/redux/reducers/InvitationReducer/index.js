import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: [],
  error: null,
  loading: false,
};

const invitationReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INVITATION_POP_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.INVITATION_POP_SUCCESS:
      return {
        ...state,
        data: action.payload,
        loading: false,
      };
    case actionTypes.INVITATION_POP_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default invitationReducer;
