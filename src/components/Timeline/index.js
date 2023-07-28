import React from "react";
import "./style.css";
import { Link } from "react-router-dom";
const Timeline = ({ status }) => {
  return (
    <div
      style={{ position: "relative", pointerEvents: "none" }}
      className="col-sm-6 col-md-6 col-lg-6"
    >
      <div className="container-fluid">
        <hr className="timeline-dash" />
      </div>
      <span className="d-flex" style={{ position: "absolute", top: "52%" }}>
        <Link style={{ textDecoration: "none", cursor: "alias" }} to="#">
          <small
            style={{ padding: "3px 8.3px" }}
            className={`mx-3 ${status["step-1"]}-step`}
          >
            1
          </small>
        </Link>
        <Link style={{ textDecoration: "none", cursor: "alias" }} to="#">
          <small className={`mx-3 ${status["step-2"]}-step`}>2</small>
        </Link>
        <Link style={{ textDecoration: "none", cursor: "alias" }} to="#">
          <small className={`mx-3 ${status["step-3"]}-step`}>3</small>
        </Link>
      </span>
    </div>
  );
};

export default Timeline;
