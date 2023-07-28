import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import App from "./defaultPages/App";

import * as serviceWorker from "./serviceWorker";
import { CometChat } from "@cometchat-pro/chat";
import { COMETCHAT_CONSTANTS } from "../../../constants/env";

import reducer from "./store/reducer";

import "./index.scss";
import "./style.css";
import logger from "../../../logger";

const store = createStore(reducer, compose(applyMiddleware(thunk)));

var appID = COMETCHAT_CONSTANTS.APP_ID;
var region = COMETCHAT_CONSTANTS.REGION;

let MyApp = () => {
  let [start, setStart] = React.useState(false);

  React.useEffect(() => {
    let appSetting = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(region)
      .build();
    CometChat.init(appID, appSetting).then(
      () => {
        logger.info("Initialization completed successfully");
        setTimeout(() => {
          setStart(true);
        }, 2000);
      },
      (error) => {
        logger.error("Initialization failed with error:", error);
        setStart(false);
      }
    );
  }, []);

  return <>{start ? <App /> : <></>}</>;
};

export default MyApp;

// localStorage.clear();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
