import * as React from "react";

function PrivacyBased({ color, width = "35", height = "35" }) {
  return (
    <svg
      id="Group_21565"
      data-name="Group 21565"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fontSize="1.4rem"
      style={{ strokeWidth: "4" }}
      viewBox="0 0 16 16"
    >
      <rect
        id="Rectangle_2857"
        data-name="Rectangle 2857"
        width="16"
        height="16"
        fill="none"
      />
      <path
        id="Rectangle_2886"
        data-name="Rectangle 2886"
        d="M0,0H12V12H0Z"
        transform="translate(2 2)"
        fill="none"
      />
      <g
        id="Group_21677"
        data-name="Group 21677"
        transform="translate(7.5 12.5)"
      >
        <circle
          id="Ellipse_948"
          data-name="Ellipse 948"
          cx="6"
          cy="6"
          r="6"
          transform="translate(-5.5 -10.5)"
          fill="none"
          stroke={color}
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
        />
        <circle
          id="Ellipse_949"
          data-name="Ellipse 949"
          cx="2.5"
          cy="2.5"
          r="2.5"
          transform="translate(-2 -7.5)"
          fill="none"
          stroke={color}
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
        />
        <path
          id="Path_15295"
          data-name="Path 15295"
          d="M14.954,39.961a4.5,4.5,0,0,1,8.025,0"
          transform="translate(-18.466 -40)"
          fill="none"
          stroke={color}
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
        />
      </g>
    </svg>
  );
}
const MemoPrivacyIcon = React.memo(PrivacyBased);
export default MemoPrivacyIcon;
