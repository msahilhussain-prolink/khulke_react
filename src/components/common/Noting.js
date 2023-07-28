import React from "react";

export default function Nothing({ msg }) {
  return (
    <div className="container-fluid text-center mb-5 pt-2">
      <small className="text-muted">{msg}</small>
    </div>
  );
}
