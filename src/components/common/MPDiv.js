import React from "react";
import Spinner from "../Spinner";

export default function MPDiv({ action }) {
  return (
    <div className="text-center container-fluid p-5">
      {action === "loading" && <Spinner />}
      {action === "error" && (
        <small className="warn-text">{error_message}</small>
      )}
      {action === "success" && (
        <small className="text-success">Your response has been recorded!</small>
      )}
    </div>
  );
}
