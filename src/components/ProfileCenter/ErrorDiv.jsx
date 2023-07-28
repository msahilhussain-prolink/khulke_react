import React from "react";

const ErrorDiv = ({ error_message }) => (
  <div className="text-center container mt-5">
    <small className="warn-text">{error_message}</small>
  </div>
);

ErrorDiv.defaultProps = {
  error_message: ""
};
export default ErrorDiv;