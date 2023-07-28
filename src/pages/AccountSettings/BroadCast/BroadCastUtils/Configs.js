import axios from "axios";
import {
  GOOGLE_CLIENT_ID,
  REACT_APP_BASE_URL_FOR_USER,
} from "../../../../constants/env";
import YouTubeIcon from "@mui/icons-material/YouTube";

export const PLATFORMS = {
  YOUTUBE: "Google",
};

export const PLATFORM_DETAILS = {
  [PLATFORMS.YOUTUBE]: {
    name: "YOUTUBE",
    shortDisplayName: "Youtube",
    longDisplayName: "Link to Your Youtube",
    icon: <YouTubeIcon color="error" />,
    smallIcon: <YouTubeIcon fontSize="12px" color="error" />,
  },
};

export const BROADCAST_PAGE = {
  VIEW: "VIEW",
  ADD: "ADD",
};

export const getLinkedAccounts = () => {
  const defaultValue = [];

  const currentUser = localStorage.getItem("current_user");

  if (!currentUser) return defaultValue;

  const linkedAccounts = JSON.parse(currentUser).linkedAccounts;

  //temporary untill api changes response to a proper one
  if (!linkedAccounts) return defaultValue;

  const filteredLinkedAccounts = linkedAccounts.filter((item) => {
    return item.Google?.google_username;
  });

  return filteredLinkedAccounts;
};

export const fetchLinkedAccounts = async () => {
  if (!localStorage.current_user && localStorage.anonymous_user) return false;

  const saveAccountsToLocalStorage = (linkedAccounts) => {
    const newCurrentUser = JSON.parse(localStorage.getItem("current_user"));

    localStorage.setItem(
      "current_user",
      JSON.stringify({ ...newCurrentUser, linkedAccounts })
    );
  };

  const access = localStorage.getItem("access");

  try {
    const response = await axios({
      method: "GET",
      url: `${REACT_APP_BASE_URL_FOR_USER}/setting/get-social-accounts/`,
      headers: {
        authorization: `Bearer ${access}`,
      },
    });
    saveAccountsToLocalStorage(response.data.data || []);
    return response.data.data || [];
  } catch (e) {
    console.log("failed to fetch linked accounts");
    return [];
  }
};

const redirectUri =
  typeof window !== "undefined" ? `${window.location.origin}/oauth` : "";

const OAUTH_SCOPES_GOOGLE = {
  YOUTUBE:
    "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/youtube",
};

const GOOGLE_OAUTH_CONFIG = {
  access_type: "offline",
  include_granted_scopes: "false",
  client_id: GOOGLE_CLIENT_ID,
  redirect_uri: redirectUri,
  response_type: "code",
  prompt: "consent",
};

const GOOGLE_OAUTH_YOUTUBE_APIS_CONFIG = {
  ...GOOGLE_OAUTH_CONFIG,
  state: `platform=${PLATFORMS.YOUTUBE}`,
  scope: OAUTH_SCOPES_GOOGLE.YOUTUBE,
};

export const OAUTH_URLS = {
  [PLATFORMS.YOUTUBE]: "https://accounts.google.com/o/oauth2/v2/auth",
};

export const OAUTH_CONFIGS = {
  [PLATFORMS.YOUTUBE]: GOOGLE_OAUTH_YOUTUBE_APIS_CONFIG,
};
