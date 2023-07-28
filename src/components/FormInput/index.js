import React from "react";
import "./style.css";

const FormInput = ({
  reference,
  emotion = "",
  children,
  custom_class = "",
  custom_styles = {},
}) => {
  return (
    <div
      ref={reference}
      className={`form-control-div${emotion} ${custom_class}`}
      style={custom_styles}
    >
      {children}
    </div>
  );
};

export default FormInput;
