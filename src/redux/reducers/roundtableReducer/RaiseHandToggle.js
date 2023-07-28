import { SHOW_RAISE_HAND } from "../../actions/actionTypes";

const initialState = {
  showRaiseHand: false,
};

const RaiseHandReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_RAISE_HAND:
      return {
        ...state,
        showRaiseHand: action.payload,
      };

    default:
      return state;
  }
};

export default RaiseHandReducer;
