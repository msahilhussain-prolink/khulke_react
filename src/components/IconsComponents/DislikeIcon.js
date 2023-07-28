import * as React from "react";

function SvgComponent(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
      <defs>
        <style>
          {
            ".prefix__b{fill:none;stroke:#aebdd3;stroke-linecap:round;stroke-linejoin:round}"
          }
        </style>
      </defs>
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        className="prefix__b"
        d="M2.999 14.25h4.5V4.5h-4.5a.75.75 0 00-.75.75v8.25a.75.75 0 00.75.75z"
      />
      <path
        className="prefix__b"
        d="M7.499 14.25l3.75 7.5a3 3 0 003-3V16.5h5.8a1.5 1.5 0 001.488-1.686l-1.125-9A1.5 1.5 0 0018.925 4.5H7.499"
      />
    </svg>
  );
}

export default SvgComponent;
