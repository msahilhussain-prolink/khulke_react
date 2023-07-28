import React from "react";
import "./style.css";
import UserProfile from "../../UserProfile";

const UserComponent = ({ name, username, showUsername = true }) => {
  return (
    <div className="row m-0 p-0 user-comp-parent">
      <div className="col-3 p-0" style={{ width: "3rem", height: "3rem" }}>
        <UserProfile username={username} className="user-comp-profile-img" />
      </div>
      <div className="col-9 ">
        <p className="rt-user-name"> {name} </p>
        {showUsername ? (
          <p className="rt-user-username"> @{username} </p>
        ) : null}
      </div>
    </div>
  );
};

export default UserComponent;
