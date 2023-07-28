import env from "../Env/EnvCreds.json";
//!DEV
export const REACT_APP_BASE_URL = env.REACT_APP_BASE_URL;
const REACT_APP_USER_ONBOARDING_URL = env.REACT_APP_USER_ONBOARDING_URL;
//roundtable url
export const REACT_APP_BASE_URL_FOR_ROUNDTABLE =
  env.REACT_APP_BASE_URL_FOR_ROUNDTABLE;
export const REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1 =
  env.REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1;
export const REACT_APP_BASE_URL_FOR_ROUNDTABLE_V2 =
  env.REACT_APP_BASE_URL_FOR_ROUNDTABLE_V2;
//node API URL
export const POST_API_BASE_URL = env.POST_API_BASE_URL;
//user onboarding url
export const REACT_APP_BASE_URL_FOR_USER = `${REACT_APP_USER_ONBOARDING_URL}/user`;
export const REACT_APP_BASE_URL_FOR_USER_V1 = `${REACT_APP_USER_ONBOARDING_URL}/user/v1`;
export const REACT_APP_BASE_URL_FOR_NOTIFICATION = `${REACT_APP_USER_ONBOARDING_URL}/notifications`;
export const LOGIN_URL = `${REACT_APP_BASE_URL_FOR_USER}/auth/`;
export const LOGIN_URL_V1 = `${REACT_APP_BASE_URL_FOR_USER_V1}/auth/`;
export const PUBLIC_TOKEN_URL = `${REACT_APP_BASE_URL_FOR_USER}/get-pu-access/`;
//upload url
export const PANELIST_CHAT_API = env.PANELIST_CHAT_API;
export const RT_MEDIA_URL = `${PANELIST_CHAT_API}/upload_media/`;
export const REACT_APP_DEVICE_TYPE = env.REACT_APP_DEVICE_TYPE;
export const REACT_APP_VAPID_ID = env.REACT_APP_VAPID_ID;
export const AGORA_APP_ID = env.AGORA_APP_ID;
export const REACT_APP_BASE_URL_CLOUDFRONT = env.REACT_APP_BASE_URL_CLOUDFRONT;
export const RECORDING_USERNAME = env.RECORDING_USERNAME;
export const RECORDING_PASSWORD = env.RECORDING_PASSWORD;
export const gtmIdString = env.gtmIdString;
export const STATIC_TOKEN = env.STATIC_TOKEN;
export const MAINTAINANCE_URL = env.MAINTAINANCE_URL;
export const MAINTAINANCE_KEY = env.MAINTAINANCE_KEY;
//for notification
export const NOTIFICATION_URL = env.NOTIFICATION_URL;
export const MEET_UP_BASE_URL = env.MEET_UP_BASE_URL;
//for all environments
export var PUBLIC_TOKEN = "";
export const updatePublicToken = (val) => {
  PUBLIC_TOKEN = val;
};
export const ENCRYPTED_PASSWORD_KEY = "8iuz98128";

export const COMETCHAT_CONSTANTS = {
  APP_ID: env.APP_ID,
  REGION: env.REGION,
  AUTH_KEY: env.AUTH_KEY,
};
export const MOBILE_VIEW = window.screen.width <= 768;
export const TABLET_VIEW = window.screen.width < 1200;

export const APP_LINKS = env.APP_LINKS;

export const IS_ANDROID_OR_IOS =
  navigator.userAgent.match(/android/i) ||
  navigator.userAgent.match(/iphone|ipad|ipod/i)
    ? true
    : false;

export const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
