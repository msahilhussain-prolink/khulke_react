import React from "react";
import "./style.css";

const ButtonYapp = ({
  btnIcon,
  btnText = "Please enter text",
  btnFunction = () => {
    alert("Please enter btn function");
  },
  propStyles = "",
}) => {
  return (
    <button className="btnComp" style={propStyles} onClick={btnFunction}>
      <p className="btnCompText">{btnText}</p>
      {btnIcon ? <img className="btnIcon" src={btnIcon} alt="icon" /> : null}
    </button>
  );
};

export default ButtonYapp;
