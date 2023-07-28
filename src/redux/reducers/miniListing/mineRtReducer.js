import * as actionTypes from "../../actions/actionTypes";

const initialState = {};

const mineRTListingReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.MINE_RT_LISTING_REQUEST:
      return {
        ...state,
        isError: false
      };
    case actionTypes.MINE_RT_LISTING_SUCCESS:
      return {
        ...state,
        data: action.payload?.data?.data,
        isError: false
      };
    case actionTypes.MINE_RT_LISTING_FAIL: {
      return {
        ...state,
        error: action.payload,
        isError: true
      };
    }
    default:
      return state;
  }
};

export default mineRTListingReducer;
