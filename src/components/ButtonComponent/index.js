import React from "react";
import "./style.css";

const ButtonComponent = ({
  btnIcon,
  btnText = "Please enter text",
  btnFunction = () => {
    alert("Please enter btn function");
  },
  propStyles = {},
  disabled = false,
}) => {
  return (
    <button
      disabled={disabled}
      className={disabled ? "btnComp disabled-button" : "btnComp"}
      style={propStyles}
      onClick={btnFunction}
    >
      {btnIcon ? btnIcon : null}
      <p className="btnCompText">{btnText}</p>
    </button>
  );
};

export default ButtonComponent;
