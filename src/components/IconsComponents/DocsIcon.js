import * as React from "react";

function SvgComponent(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        d="M15 7l-6.5 6.5a2.121 2.121 0 003 3L18 10a4.243 4.243 0 10-6-6l-6.5 6.5a6.364 6.364 0 009 9L21 13"
        stroke="#63779c"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default SvgComponent;
