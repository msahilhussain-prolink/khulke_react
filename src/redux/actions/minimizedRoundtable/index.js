export const MINIMIZEROUNDTABLE = "MINIMIZEROUNDTABLE";

export const MinimizeRoundtable = (data) => ({
  data,
  type: MINIMIZEROUNDTABLE,
});

export const EXPANDROUNDTABLE = "EXPANDROUNDTABLE";

export const ExpandRoundtable = (data) => ({
  type: EXPANDROUNDTABLE,
  data,
});

export const UPDATE_LIVE_RT_CLIENT = "UPDATE_LIVE_RT_CLIENT";

export const UpdateLiveRTClient = (data) => ({
  type: UPDATE_LIVE_RT_CLIENT,
  data,
});
