import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: null,
  error: null,
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.NOTIFICATION_START:
      return {
        ...state,
      };
    case actionTypes.NOTIFICATION_SUCCESS:
      return {
        data: action.payload,
      };
    case actionTypes.NOTIFICATION_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default notificationReducer;
