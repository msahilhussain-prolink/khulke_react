import * as actionTypes from "../../actions/actionTypes";

const initialState = {};

const rtWithCategoryReducer = (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.RT_LISTING_CATEGORY_REQUEST:
        return {
          ...state,
    };
case actionTypes.RT_LISTING_CATEGORY_SUCCESS: {
  console.log("nxcbvnnxcvbcnxm",action.payload)

        return {
          ...state, data: action.payload?.data?.data,
        };
      }
case actionTypes.RT_LISTING_CATEGORY_FAIL:
        return {
          ...state,
          error: action.payload,
       };
  
default:
  return state;
}
}
export default rtWithCategoryReducer