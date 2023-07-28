import React from "react";

export default function ErrorDiv({ error_message }) {
  return (
    <div className="text-center container mt-5">
      <small className="warn-text">{error_message}</small>
    </div>
  );
}
