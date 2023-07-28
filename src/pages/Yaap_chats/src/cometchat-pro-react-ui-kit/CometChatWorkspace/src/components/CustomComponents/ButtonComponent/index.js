import React from "react";
import "./style.css";

const ButtonComponent = ({ btnText, btnHandler }) => {
  return (
    <button className="buttonParent" onClick={btnHandler}>
      {btnText}
    </button>
  );
};

export default ButtonComponent;
