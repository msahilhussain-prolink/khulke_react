import * as React from "react";

function SvgComponent(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} {...props}>
      <defs>
        <style>
          {
            ".prefix__a{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round}"
          }
        </style>
      </defs>
      <path
        className="prefix__a"
        d="M10.788 20.613a8.443 8.443 0 0012.268 4.457l2.914.833a.7.7 0 00.869-.869l-.833-2.914a8.44 8.44 0 00-6.8-12.732"
      />
      <path fill="none" d="M0 0h30v30H0z" />
      <path
        className="prefix__a"
        d="M3.993 16.497a8.434 8.434 0 112.951 2.951l-2.914.833a.7.7 0 01-.869-.869l.833-2.914z"
      />
    </svg>
  );
}

export default SvgComponent;
