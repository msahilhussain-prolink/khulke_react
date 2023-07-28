import * as React from "react";

function TextBased({ color }) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 44.125 44.125"
      fontSize="1.1rem"
      style={{ strokeWidth: "2" }}
    >
      <g data-name="Group 19601">
        <path
          data-name="Path 15281"
          d="M21.125 30.5h-7.5V23L30.5 6.125l7.5 7.5z"
          fill="none"
        />
        <path
          data-name="Path 15282"
          d="M21.125 30.5h-7.5V23L36.125.5l7.5 7.5z"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          data-name="Line 944"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M30.5 6.125l7.5 7.5"
        />
        <path
          data-name="Path 15283"
          d="M41.75 21.125V41.75a1.875 1.875 0 01-1.875 1.875h-37.5A1.875 1.875 0 01.5 41.75V4.25a1.875 1.875 0 011.875-1.875H23"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

const MemoTextBased = React.memo(TextBased);
export default MemoTextBased;
