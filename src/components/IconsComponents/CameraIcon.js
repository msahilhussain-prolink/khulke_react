import * as React from "react";

function SvgComponent(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
      <defs>
        <style>
          {
            ".prefix__b{fill:none;stroke:#63779c;stroke-linecap:round;stroke-linejoin:round}"
          }
        </style>
      </defs>
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        className="prefix__b"
        d="M5 7h1a2 2 0 002-2 1 1 0 011-1h6a1 1 0 011 1 2 2 0 002 2h1a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2"
      />
      <circle
        className="prefix__b"
        cx={3}
        cy={3}
        r={3}
        transform="translate(8.736 10)"
      />
    </svg>
  );
}

export default SvgComponent;
