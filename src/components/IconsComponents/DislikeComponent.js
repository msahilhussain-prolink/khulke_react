import * as React from "react";

function SvgComponent(props) {
  return (
    <svg
      data-name="Component 13 \u2013 1"
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      {...props}
    >
      <path data-name="Rectangle 2596" fill="none" d="M0 0h24v24H0z" />
      <path
        data-name="Path 13944"
        d="M2.999 14.25h4.5V4.5h-4.5a.75.75 0 00-.75.75v8.25a.75.75 0 00.75.75z"
        fill="rgba(17,20,28,0.36)"
        stroke="#11141c"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        data-name="Path 13945"
        d="M7.499 14.25l3.75 7.5a3 3 0 003-3V16.5h5.8a1.5 1.5 0 001.488-1.686l-1.125-9A1.5 1.5 0 0018.925 4.5H7.499"
        fill="rgba(17,20,28,0.36)"
        stroke="#11141c"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default SvgComponent;
