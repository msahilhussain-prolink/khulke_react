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
        d="M4.259 16.594a9 9 0 113.147 3.147l-3.108.888a.75.75 0 01-.927-.927l.888-3.108zM9 10.5h6M9 13.5h6"
      />
    </svg>
  );
}

export default SvgComponent;
