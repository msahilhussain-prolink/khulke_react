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
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z"
      />
      <rect
        className="prefix__b"
        width={12}
        height={12}
        rx={2}
        transform="translate(3.569 6)"
      />
    </svg>
  );
}

export default SvgComponent;
