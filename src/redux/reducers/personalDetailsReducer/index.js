import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: {},
  error: null,
  loading: false,
};

const personalDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    // ** GET INTEREST
    case actionTypes.GET_PERSONALDETAIL_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.GET_PERSONALDETAIL_SUCCESS: 
      return {
        ...state,
        data: action.payload,
        loading: false,
      };
    case actionTypes.GET_PERSONALDETAIL_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default personalDetailsReducer;
