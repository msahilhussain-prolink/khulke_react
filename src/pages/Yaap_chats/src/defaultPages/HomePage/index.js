import React from "react";
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";

import { Link, Navigate } from "react-router-dom";
import { connect } from "react-redux";

import { wrapperStyle } from "./style";

import * as actions from "../../store/action";
class HomePage extends React.Component {
  render() {
    let authRedirect = null;
    if (!this.props.isLoggedIn) {
      let geekUID = JSON.parse(localStorage.current_user)._id;
      authRedirect = <Navigate to={"/yapp/login?uid=" + geekUID} />;
    }

    return (
      <div css={wrapperStyle()}>
        {authRedirect || <Navigate to='/yapp/embedded-app' />}
      </div>
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
    onLogout: () => dispatch(actions.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
