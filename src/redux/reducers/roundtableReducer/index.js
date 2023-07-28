import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: null,
  loading: false,
  error: null,
  liveUser: [],
  consent: [],
};

const roundtableReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_RT_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.GET_RT_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case actionTypes.GET_RT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case actionTypes.SET_LIVE_USER:
      return {
        ...state,
        liveUser: action.payload,
      };

    case actionTypes.SET_CONSENT:
      return {
        ...state,
        consent: action.payload,
      };

    default:
      return state;
  }
};

export default roundtableReducer;
