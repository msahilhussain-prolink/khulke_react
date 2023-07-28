import * as React from "react";

function ConfidentialBased({ color, width = "30", height = "30" }) {
  return (
    <svg
      id="Group_21132"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      data-name="Group 21132"
      fontSize="1.4rem"
      style={{ strokeWidth: "4" }}
      viewBox="0 0 30 30"
    >
      <path fill="none" d="M0 0H30V30H0z" data-name="Rectangle 5602"></path>
      <rect
        width="20.625"
        height="15"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        data-name="Rectangle 5603"
        rx="2"
        transform="translate(4.687 10.313)"
      ></rect>
      <path
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M10.78 10.313V6.094a4.219 4.219 0 018.438 0v4.219"
        data-name="Path 21291"
      ></path>
    </svg>
  );
}
const MemoConfidentialIcon = React.memo(ConfidentialBased);
export default MemoConfidentialIcon;
