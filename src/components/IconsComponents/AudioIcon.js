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
      <rect
        className="prefix__b"
        width={5}
        height={7}
        rx={2}
        transform="translate(4 13)"
      />
      <rect
        className="prefix__b"
        width={5}
        height={7}
        rx={2}
        transform="translate(15 13)"
      />
      <path className="prefix__b" d="M4 15v-3a8 8 0 0116 0v3" />
    </svg>
  );
}

export default SvgComponent;
