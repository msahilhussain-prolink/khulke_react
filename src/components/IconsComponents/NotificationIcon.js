import * as React from "react";

function SvgComponent(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} {...props}>
      <defs>
        <style>
          {
            ".prefix__b{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round}"
          }
        </style>
      </defs>
      <path fill="none" d="M0 0h30v30H0z" />
      <path
        className="prefix__b"
        d="M6.586 12.187a8.415 8.415 0 1116.828.106v.832c0 4.2.878 6.633 1.652 7.964a.937.937 0 01-.806 1.411H5.74a.937.937 0 01-.806-1.411c.774-1.331 1.652-3.767 1.652-7.964zM11.25 22.5v.938a3.75 3.75 0 007.5 0V22.5"
      />
    </svg>
  );
}

export default SvgComponent;
