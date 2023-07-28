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
        d="M19.711 3.364L2.243 8.291a.75.75 0 00-.117 1.4l8.026 3.8a.75.75 0 01.357.357l3.8 8.026a.75.75 0 001.4-.117l4.927-17.468a.75.75 0 00-.925-.925zM10.394 13.607l4.243-4.243"
      />
    </svg>
  );
}

export default SvgComponent;
