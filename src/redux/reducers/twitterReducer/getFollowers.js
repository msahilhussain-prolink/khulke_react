import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: null,
  error: null,
  loading: false,
};

const getTwFolReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_TWFOL_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.GET_TWFOL_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case actionTypes.GET_TWFOL_FAIL:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    default:
      return state;
  }
};

export default getTwFolReducer;
