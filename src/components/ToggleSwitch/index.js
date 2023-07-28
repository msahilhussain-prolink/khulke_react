import { React } from "react";
import "./style.css";
const ToggleSwitch = ({ onToggle, isToggled }) => {
  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={isToggled} onChange={onToggle} />
      <span className="switch" />
    </label>
  );
};

export default ToggleSwitch;
