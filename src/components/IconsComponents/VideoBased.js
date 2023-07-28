import * as React from "react";

function VideoBased({
  color,
  width = "0.8rem",
  height = "0.8rem",
  fontSize = "1.3rem",
  marginTop = "0.1rem",
}) {
  return (
    <svg
      id="Group_19605"
      width={width}
      height={height}
      fontSize={fontSize}
      style={{ strokeWidth: "6", marginTop: marginTop }}
      viewBox="0 0 53.5 32.875"
    >
      <g data-name="Group 19605">
        <path
          data-name="Path 15288"
          d="M2.375.499h30a7.5 7.5 0 017.5 7.5v22.5A1.875 1.875 0 0138 32.374H8a7.5 7.5 0 01-7.5-7.5v-22.5A1.875 1.875 0 012.375.499z"
          fill="none"
        />
        <path
          data-name="Path 15289"
          d="M2.375.499h30a7.5 7.5 0 017.5 7.5v22.5A1.875 1.875 0 0138 32.374H8a7.5 7.5 0 01-7.5-7.5v-22.5A1.875 1.875 0 012.375.499z"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          data-name="Path 15290"
          d="M39.875 12.687L53 5.187v22.5l-13.125-7.5"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

const MemoVideoBased = React.memo(VideoBased);
export default MemoVideoBased;
