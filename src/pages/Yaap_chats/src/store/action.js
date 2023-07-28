import * as actionTypes from "./actionTypes";
import { CometChat } from "@cometchat-pro/chat";
import { messaging } from "../../../../push_firebase";
import { COMETCHAT_CONSTANTS } from "../../../../constants/env";
import logger from "../../../../logger";
export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const loadSDK = () => {
  return {
    type: actionTypes.LOAD_SDK_START,
    sdkLoading: true,
  };
};

export const authSuccess = (user) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    user: user,
    isLoggedIn: true,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const logoutSuccess = () => {
  let geekUID = localStorage.getItem("geek_UID");

  return {
    type: actionTypes.AUTH_LOGOUT,
    authRedirectPath: "/login?uid=" + geekUID,
  };
};

export const logout = () => {
  return (dispatch) => {
    CometChat.logout().then(dispatch(logoutSuccess()));
  };
};

export const auth = (uid, authKey, cb) => {
  return (dispatch) => {
    dispatch(authStart());
    logger.info(CometChat.isInitialized());
    logger.info(uid);
    logger.info(authKey);

    var appID = COMETCHAT_CONSTANTS.APP_ID;
    var region = COMETCHAT_CONSTANTS.REGION;

    let appSetting = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(region)
      .build();

    CometChat.init(appID, appSetting).then(
      () => {
        logger.info("Initialization completed successfully");
      },
      (error) => {
        logger.error("Initialization failed with error:", error);
        this.setState({ ...this.state, start: false });
      }
    );

    CometChat.login(uid, authKey)
      .then(async (user) => {
        logger.info("uid", uid);
        logger.info("authKey", authKey);
        CometChat.getLoggedinUser().then((user) => logger.info(user?.name));
        // Change the page title
        // document.title = uid + " logged in";
        // Fetch the FCM Token
        let FCM_TOKEN = await messaging.getToken().catch((err) => {
          logger.error("error in getting FCM token", err);
        });
        logger.info("FCM_TOKEN", FCM_TOKEN);
        await CometChat.registerTokenForPushNotification(FCM_TOKEN).catch(
          (error) => {
            logger.error("error in registerTokenForPushNotification", error);
          }
        );
        logger.info("3. Registered FCM Token");

        if (user) {
          dispatch(authSuccess(user));
        } else {
          dispatch(authFail(user));
        }
      })
      .catch((error) => {
        logger.error("CometChatLogin Failed", error);
        logger.error("line 101 of action.js");
        if(error.code === 'ERR_UID_NOT_FOUND'){
          cb()
        }
        auth(uid, authKey);
        // dispatch(authFail(error));
        // dispatch(authFail(error));
      });
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    CometChat.getLoggedinUser()
      .then((user) => {
        if (user) {
          dispatch(authSuccess(user));
        } else {
          dispatch(authFail(user));
        }
      })
      .catch((error) => {
        dispatch(authFail(error));
      });
  };
};

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path,
  };
};
