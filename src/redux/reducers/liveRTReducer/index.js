import {
  ACTIVE_WILDCARD_MESSAGE,
  LIVE_RT_EXTENDED,
  RESET_LIVE_RT_TIMER,
  SET_LIVE_RT_TIMER,
  UPDATE_EXTEND_DIALOG,
  UPDATE_RT_EXTENDED_TIME,
} from "../../actions/actionTypes";

const initialState = {
  timer: "00:00:01",
  was_extended: false,
  extendedTime: "5",
  extend_dialog: false,
  wildCardMessageSelected: null,
};

const liveRTReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LIVE_RT_TIMER:
      return {
        ...state,
        timer: action.payload,
      };

    case RESET_LIVE_RT_TIMER:
      return {
        ...state,
        timer: "00:00:01",
      };

    case LIVE_RT_EXTENDED:
      return {
        ...state,
        was_extended: action.payload,
      };

    case UPDATE_RT_EXTENDED_TIME:
      return {
        ...state,
        extendedTime: action.payload,
      };

    case UPDATE_EXTEND_DIALOG:
      return {
        ...state,
        extend_dialog: action.payload,
      };

    case ACTIVE_WILDCARD_MESSAGE: 
      return {
        ...state,
        wildCardMessageSelected: action.payload
        
      }
    default:
      return state;
  }
};

//Selector functions
export const getLiveRTTimer = (state) => state.liveRT.timer;
export const getLiveRTExtended = (state) => state.liveRT.was_extended;
export const getLiveRTExtendedTime = (state) => state.liveRT.extendedTime;
export const getLiveRTDialogExtend = (state) => state.liveRT.extend_dialog;
export const getLiveRTSelectedWildMsg = (state) => state.liveRT.wildCardMessageSelected;

export default liveRTReducer;
