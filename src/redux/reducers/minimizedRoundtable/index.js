import * as actionTypes from "../../actions/actionTypes";
import {
  EXPANDROUNDTABLE,
  MINIMIZEROUNDTABLE,
  UPDATE_LIVE_RT_CLIENT,
} from "../../actions/minimizedRoundtable";

const initialState = {
  rt_data: null,
  minimized: false,
};

const MinimizedRoundtableReducer = (state = initialState, action) => {
  const type = action.type;
  const data = action.data;
  switch (type) {
    case MINIMIZEROUNDTABLE:
      return {
        ...state,
        rt_data: data,
        minimized: true,
        data: {},
      };
    case EXPANDROUNDTABLE:
      return {
        rt_data: {},
        data,
        minimized: false,
      };
    case UPDATE_LIVE_RT_CLIENT:
      return {
        ...state,
        ...data,
      };
    default:
      return state;
  }
};

export default MinimizedRoundtableReducer;
