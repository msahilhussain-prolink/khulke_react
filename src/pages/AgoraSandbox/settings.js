import AgoraRTC from "agora-rtc-sdk-ng";
import { createInstance } from "agora-rtm-sdk";
import { AGORA_APP_ID } from "../../constants/env";

let rt_details = localStorage.join_rt;

rt_details = rt_details ? JSON.parse(rt_details) : {};

if (process.env.NODE_ENV === "production") {
  AgoraRTC.setLogLevel(4);
}
const appId = AGORA_APP_ID;
export const channel_token = rt_details?.token;
export const config = {
  mode: "live",
  codec: "h264",
  appId: appId,
  token: channel_token,
};

let temp_warned_list = {};
let temp_blocked_list = {};
if (rt_details?.warn_array?.length > 0) {
  rt_details?.warn_array?.forEach((item) => {
    temp_warned_list[item] = item;
  });
}
if (rt_details?.blocked_array?.length > 0) {
  rt_details?.blocked_array?.forEach((item) => {
    temp_blocked_list[item] = item;
  });
}
export const moderator = rt_details?.moderator;
export var speakers = rt_details?.speakers;
export const blocked_list = temp_blocked_list;
export const warned_list = temp_warned_list;
export const rt_id = rt_details?.rt_id;
export var role = rt_details?.role;
export const uid = rt_details?.uid;
export const fullname = rt_details?.name;
export const rt_name = rt_details?.rt_name;
export const rt_type = rt_details?.rt_type;
export const useClient = AgoraRTC.createClient(config);
// export const MicrophoneAndCameraTracks = createMicrophoneAndCameraTracks({},{frameRate:25});
export const channelName = rt_details?.channelName || rt_id;
export const open_to_all = rt_details?.open_to_all;

//RTM
export const useClient_RTM = createInstance(AGORA_APP_ID, {
  enableLogUpload: false,
});

export const screenClient = AgoraRTC.createClient({
  ...config,
  codec: "vp8",
});

export const setSpeakers = (speaker) => (speakers = speaker);

export const setRole = (rol) => {
  role = rol;
};

export var handRaisedUsers;
export const setHandRaisedUsers = (val) => {
  handRaisedUsers = val;
};

//videoEncoderConfig
export const ONE_SPEAKERS = { frameRate: 30, height: 720, width: 1280 };
export const TWO_SPEAKERS = { frameRate: 30, height: 680, width: 720 };
export const MORE_THAN_TWO_SPEAKERS = {
  frameRate: 30,
  height: 360,
  width: 480,
};
