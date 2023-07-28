import * as React from "react";

function SvgComponent(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
      <defs>
        <style>
          {
            ".prefix__b{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round}"
          }
        </style>
      </defs>
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        className="prefix__b"
        d="M2.999 9.75h4.5v9.75h-4.5a.75.75 0 01-.75-.75V10.5a.75.75 0 01.75-.75z"
      />
      <path
        className="prefix__b"
        d="M7.499 9.75l3.75-7.5a3 3 0 013 3V7.5h5.8a1.5 1.5 0 011.488 1.686l-1.125 9a1.5 1.5 0 01-1.487 1.314H7.499"
      />
    </svg>
  );
}

export default SvgComponent;
