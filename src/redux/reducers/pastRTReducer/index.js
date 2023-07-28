import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  pastrt: [],
  error: null,
  loading: false,
};

const pastRTReducer = (state = initialState, action) => {
  switch (action.type) {
    // ** GET INTEREST
    case actionTypes.GET_PASTRT_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.GET_PASTRT_SUCCESS:
      return {
        ...state,
        pastrt: action.payload,
        loading: false,
      };
    case actionTypes.GET_PASTRT_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default pastRTReducer;
