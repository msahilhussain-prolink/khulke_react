import {
  DRAWER_FLAG,
  SIGN_UP_FLAG,
  TAB_SWITCH_FLAG,
  TOGGLE_WALKTHROUGH_FLAG,
  LIVE_RT_STATE,
} from "../../actions/actionTypes";

const initialState = {
  flag: true,
};

const signUpState = {
  signUpFlag: false,
};

const tabSwitchState = {
  tabFlag: "news",
};

const drawerState = {
  drawFlag: false,
};

const rtState = {
  rt_flag: "LIVE PLAYING",
};

export const compReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_WALKTHROUGH_FLAG:
      return { ...state, flag: action.data };

    default:
      return state;
  }
};

export const signUpFlagReducer = (state = signUpState, action) => {
  switch (action.type) {
    case SIGN_UP_FLAG:
      return { ...state, signUpFlag: action.data };
    default:
      return state;
  }
};

export const tabSwitchReducer = (state = tabSwitchState, action) => {
  switch (action.type) {
    case TAB_SWITCH_FLAG:
      return { ...state, tabFlag: action.data };
    default:
      return state;
  }
};

export const drawerSwitchReducer = (state = drawerState, action) => {
  switch (action.type) {
    case DRAWER_FLAG:
      return { ...state, drawFlag: action.data };
    default:
      return state;
  }
};

export const LiveRTStateReducer = (state = rtState, action) => {
  switch (action.type) {
    case LIVE_RT_STATE:
      return { ...state, rt_flag: action.data };
    default:
      return state;
  }
};
