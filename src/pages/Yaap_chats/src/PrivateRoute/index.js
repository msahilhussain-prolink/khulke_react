import React from "react";
import { connect } from "react-redux";

import { Route, Navigate, Routes } from "react-router-dom";

class PrivateRoute extends React.Component {
  render() {
    if (this.props.isLoggedIn) {
      return (
        <Routes>
          <Route path={""} element={<this.props.component {...this.props} />} />
        </Routes>
      );
    } else {
      let geekUID = JSON.parse(localStorage.getItem("current_user")).user_id;

      return (
        <Navigate
          to={{
            pathname: "/yapp/login",
            search: "?uid=" + geekUID,
            state: { from: this.props.location },
          }}
        />
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.yapp.isLoggedIn,
  };
};

export default connect(mapStateToProps, null)(PrivateRoute);
