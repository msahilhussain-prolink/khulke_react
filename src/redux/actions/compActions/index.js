import {
  DRAWER_FLAG,
  LIVE_RT_STATE,
  SIGN_UP_FLAG,
  TAB_SWITCH_FLAG,
  TOGGLE_WALKTHROUGH_FLAG,
} from "../actionTypes";

export const toggleFlag = (data) => ({
  type: TOGGLE_WALKTHROUGH_FLAG,
  data,
});

export const toggleSignUpFlag = (data) => ({
  type: SIGN_UP_FLAG,
  data,
});

export const tabSwitchFlag = (data) => ({
  type: TAB_SWITCH_FLAG,
  data,
});

export const drawerFlag = (data) => ({
  type: DRAWER_FLAG,
  data,
});

export const liveRTState = (data) => ({
  type: LIVE_RT_STATE,
  data,
});
