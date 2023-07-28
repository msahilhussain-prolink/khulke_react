import React from "react";

import NetworkSvg from "../../assets/icons/network.svg";
import Spinner from "../Spinner";

export default function MessageDiv({ type = "nodata", error_message }) {
  return (
    <div className="container-fluid text-center my-5">
      {type === "nodata" && <img src={NetworkSvg} alt="" />}
      {type === "error" && (
        <small
          className="warn-text"
          style={{ visibility: "hidden", userSelect: "none" }}
        >
          {error_message}
        </small>
      )}
      {type === "loading" && <Spinner />}
    </div>
  );
}
