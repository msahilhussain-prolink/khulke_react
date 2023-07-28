import React from "react";
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Global } from "@emotion/react";
import "./style.css";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";

import { CometChatAvatar } from "../../cometchat-pro-react-ui-kit/CometChatWorkspace/src";
import { COMETCHAT_CONSTANTS } from "../../../../../constants/env";

import {
  wrapperStyle,
  errorStyle,
  titleStyle,
  subtitleStyle,
  userContainerStyle,
  userWrapperStyle,
  thumbnailWrapperStyle,
  uidWrapperStyle,
  inputWrapperStyle,
  loginBtn,
} from "./style";

import { loaderStyle } from "./loader";

import * as actions from "../../store/action";
import { CometChat } from "@cometchat-pro/chat";
import { CenterDiv, MainDiv } from "../../../../../global_styles/global_style";
import LeftSideBar from "../../../../../components/LeftSideBar";

class KitchenSinkApp extends React.PureComponent {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
  }

  componentDidMount() {
    const search = window.location.search;
    const uid = new URLSearchParams(search).get("uid");

    this.login(uid);
  }

  fallbackOnError =  () => {
    window.location.href = '/roundtable/all'
  }

  login = (uid) => {
    if (!uid) {
      uid = this.myRef.current.value;
    }

    localStorage.setItem("geek_UID", uid);

    this.uid = uid;
    this.props.onLogin(this.uid, COMETCHAT_CONSTANTS.AUTH_KEY, this.fallbackOnError);
  };

  render() {
    let loader = null;
    // if (this.props.loading) {
    loader = <div className='loader'></div>;
    // }

    let errorMessage = null;
    if (this.props.error) {
      errorMessage = <p css={errorStyle()}>{this.props.error.message}</p>;
    }

    let authRedirect = null;
    if (this.props.isLoggedIn) {
      authRedirect = <Navigate to={"/yapp/embedded-app"} />;
    }

    return (
      <MainDiv>
        {/* <LeftDiv> */}
        {/* <div
          style={{
            marginLeft: "3rem",
            marginRight: "20px",
          }}
        > */}
        {/* <LeftSideBar /> */}
        {/* </div> */}
        {/* </LeftDiv> */}
        <CenterDiv
          style={{ overflowY: "clip", maxWidth: "921px", width: "921px" }}
        >
          <React.Fragment>
            <div css={wrapperStyle()}>
              {authRedirect}
              {loader}
            </div>
          </React.Fragment>
        </CenterDiv>
      </MainDiv>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.yapp.loading,
    error: state.yapp.error,
    isLoggedIn: state.yapp.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (uid, authKey, cb) => dispatch(actions.auth(uid, authKey, cb)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(KitchenSinkApp);
