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
      <path className="prefix__b" d="M15 8h.01" />
      <rect
        className="prefix__b"
        width={16}
        height={16}
        rx={3}
        transform="translate(4.405 4)"
      />
      <path className="prefix__b" d="M4 15l4-4a2.014 2.014 0 013 0l5 5" />
      <path className="prefix__b" d="M14 14l1-1a2.014 2.014 0 013 0l2 2" />
    </svg>
  );
}

export default SvgComponent;
