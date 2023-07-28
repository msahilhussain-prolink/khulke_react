import React from "react";

const NoUsers = ({ type }) => {
  return (
    <div className="container-fluid text-center mb-5 pt-2">
      <small className="text-muted">No {type} have joined yet!</small>
    </div>
  );
};

export default NoUsers;
