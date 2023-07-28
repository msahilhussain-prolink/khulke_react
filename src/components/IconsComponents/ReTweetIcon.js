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
      <path className="prefix__b" d="M18.75 8.25L21 6l-2.25-2.25" />
      <path
        className="prefix__b"
        d="M3 12a6 6 0 016-6h12M5.25 15.75L3 18l2.25 2.25"
      />
      <path className="prefix__b" d="M21 12a6 6 0 01-6 6H3" />
    </svg>
  );
}

export default SvgComponent;
