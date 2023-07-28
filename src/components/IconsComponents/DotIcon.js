import * as React from "react";

function DotIcon(props) {
  return (
    <svg
      data-name="Group 19545"
      width="1em"
      height="1em"
      viewBox="0 0 36 36"
      {...props}
    >
      <path data-name="Path 15262" d="M0 0h36v36H0z" fill="rgba(0,0,0,0)" />
      <circle
        data-name="Ellipse 925"
        cx={1.5}
        cy={1.5}
        r={1.5}
        transform="translate(16.5 16.5)"
        fill="rgba(0,0,0,0)"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        data-name="Ellipse 926"
        cx={1.5}
        cy={1.5}
        r={1.5}
        transform="translate(16.5 27)"
        fill="rgba(0,0,0,0)"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        data-name="Ellipse 927"
        cx={1.5}
        cy={1.5}
        r={1.5}
        transform="translate(16.5 6)"
        fill="rgba(0,0,0,0)"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MemoDotIcon = React.memo(DotIcon);
export default MemoDotIcon;
