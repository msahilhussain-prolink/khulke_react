import React from "react";
import { Route, Routes } from "react-router-dom";
import { connect } from "react-redux";
import { createBrowserHistory } from "history";
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";

import PrivateRoute from "../../PrivateRoute";

import KitchenSinkApp from "../../defaultPages/KitchenSinkApp";
import HomePage from "../../defaultPages/HomePage";

import * as actions from "../../store/action";

import {
  CometChatUI,
  CometChatConversationList,
  CometChatConversationListWithMessages,
  CometChatUserList,
  CometChatUserListWithMessages,
  CometChatGroupList,
  CometChatGroupListWithMessages,
  CometChatMessages,
} from "../../cometchat-pro-react-ui-kit/CometChatWorkspace/src";

import { wrapperStyle } from "./style";

import { CometChat } from "@cometchat-pro/chat";
import {
  COMETCHAT_CONSTANTS,
  REACT_APP_BASE_URL,
  REACT_APP_BASE_URL_FOR_USER,
} from "../../../../../constants/env";
import ToastHandler from "../../../../../utils/ToastHandler";
import axios from "axios";
import { onMessageListener } from "../../firebase";
import { messaging } from "../../../../../push_firebase";
import { MetaTagsGenerator } from "../../../../../utils/MetaTagsGenerator";
import { metaData } from "../../../../../constants/StaticPagesMetaTags";
import { device_info, moengageEvent } from "../../../../../utils/utils";
import logger from "../../../../../logger";

const history = createBrowserHistory();

var appID = COMETCHAT_CONSTANTS.APP_ID;
var region = COMETCHAT_CONSTANTS.REGION;

class App extends React.Component {
  state = {
    isLoggedin: false,
    start: false,
  };

  componentDidMount() {
    const LoginUser = async () => {
      const current_user = localStorage.current_user
        ? JSON.parse(localStorage.current_user)
        : undefined;

      const getUserId = async () => {
        try {
          let res;
          if (current_user?.access) {
            res = await axios.post(
              `${REACT_APP_BASE_URL_FOR_USER}/update-device-info-on-app-launch/`,
              {
                device_info: device_info,
              },
              {
                headers: {
                  Authorization: `Bearer ${current_user?.access}`,
                },
              }
            );
          }
          const cur_user = {
            ...JSON.parse(localStorage.getItem("current_user")),
            user_id: res.data?.user_id,
          };

          localStorage.setItem("current_user", JSON.stringify(cur_user));
          moengageEvent("Open", "Yapp");
          moengageEvent("View Page", "ALL", {
            URL: `${window.location.origin}/${window.location.pathname}`,
          });
        } catch (e) {
          // ToastHandler("dan", "Something went wrong");
          return history.back();
        }
      };

      if (!current_user.user_id) {
        await getUserId();
      }

      if (!current_user.is_yapp_user) {
        if (
          REACT_APP_BASE_URL.includes("dev") ||
          REACT_APP_BASE_URL.includes("stage")
        ) {
          ToastHandler(
            "dan",
            "Yapp is available only for limited users on dev/stage env"
          );
          return history.back();
        } else {
          var config = {
            method: "post",

            url: `${REACT_APP_BASE_URL_FOR_USER}/create-yapp-user/`,

            headers: {
              Authorization: `Bearer ${current_user.access}`,
            },
          };

          try {
            const response = await axios(config);
            if (response.status !== 200) {
              if (
                (response.status === 253 &&
                  !response.data?.data?.[0]?.is_yapp_user &&
                  response.data.message.toLowerCase() !==
                    "already a yapp user") ||
                response.status !== 253
              ) {
                ToastHandler("This Feature will be available for you soon");

                return history.back();
              } else {
                localStorage.setItem(
                  "current_user",
                  JSON.stringify({ ...current_user, is_yapp_user: true })
                );
              }
            } else {
              localStorage.setItem(
                "current_user",
                JSON.stringify({ ...current_user, is_yapp_user: true })
              );
            }
          } catch (e) {
            ToastHandler("This Feature will be available for you soon");
            return history.back();
          }
        }
      }

      this.props.getLoggedinUser();
      await messaging
        .getToken((res) => logger.info("FCM_TOken", res))
        .catch((err) => {
          logger.error("error in getting FCM token", err);
        });

      let appSetting = new CometChat.AppSettingsBuilder()
        .subscribePresenceForAllUsers()
        .setRegion(region)
        .build();
      CometChat.init(appID, appSetting).then(
        () => {
          logger.info("Initialization completed successfully");
          setTimeout(() => {
            this.setState({ ...this.state, start: true });
          }, 2000);
        },
        (error) => {
          logger.error("Initialization failed with error:", error);
          this.setState({ ...this.state, start: false });
        }
      );
    };

    LoginUser();
  }

  render() {
    onMessageListener()
      .then((payload) => {
        logger.info(payload);
      })
      .catch((err) => logger.error("failed: ", err));

    let loader = null;
    if (this.props.loading) {
      loader = <div className="loading"></div>;
    }

    return (
      <div css={wrapperStyle()}>
        {/* {loader} */}
        {/* <Router history={history}> */}
        {/* <Switch> */}
        <MetaTagsGenerator metaTags={metaData[""]} />
        <Routes>
          <Route
            path="/embedded-app/*"
            element={<PrivateRoute component={CometChatUI} />}
          />
          <Route
            path="/conversations"
            element={
              <PrivateRoute component={CometChatConversationListWithMessages} />
            }
          />
          <Route
            path="/groups"
            element={
              <PrivateRoute component={CometChatGroupListWithMessages} />
            }
          />
          <Route
            path="/users"
            element={<PrivateRoute component={CometChatUserListWithMessages} />}
          />
          <Route
            path="/conversation-list"
            element={<PrivateRoute component={CometChatConversationList} />}
          />
          <Route
            path="/group-list"
            element={<PrivateRoute component={CometChatGroupList} />}
          />
          <Route
            path="/user-list"
            element={<PrivateRoute component={CometChatUserList} />}
          />
          <Route
            path="/messages"
            element={<PrivateRoute component={CometChatMessages} />}
            chatWithGroup="supergroup"
          />
          <Route
            exact
            path=""
            element={<PrivateRoute component={HomePage} />}
          />
          <Route path="/login" element={<KitchenSinkApp />} />
        </Routes>
        {/* </Switch> */}
        {/* </Router> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.yapp.isLoggedIn,
    loading: state.yapp.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getLoggedinUser: () => dispatch(actions.authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
