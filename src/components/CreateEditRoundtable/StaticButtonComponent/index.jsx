import React from "react";
import "./styles.css";

// Used for cancel/create buttons
const StaticButtonComponent = ({
  styles,
  title = "Please provide title",
  onClick,
  disabled = false,
}) => {
  const newTitle = title.toLowerCase();

  return (
    <button
      disabled={disabled}
      type="button"
      className={
        disabled ? "static-create-btn disabled-button" : "static-create-btn"
      }
      value={newTitle}
      onClick={onClick}
      style={styles || null}
    >
      {title}
    </button>
  );
};

export default StaticButtonComponent;
