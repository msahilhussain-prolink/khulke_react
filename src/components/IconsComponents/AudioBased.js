import * as React from "react";

function AudioBased({
  color,
  width = "0.8rem",
  height = "0.8rem",
  fontSize = "1.3rem",
  marginTop = "4px",
}) {
  return (
    <svg
      id="Group_19603"
      width={width}
      height={height}
      fontSize={fontSize}
      style={{ strokeWidth: "4", marginTop: marginTop }}
      viewBox="0 -3 46.341 55.75"
    >
      <g data-name="Group 19603">
        <path
          data-name="Path 15284"
          d="M.5 23v13.125a3.75 3.75 0 003.75 3.75H8a3.75 3.75 0 003.75-3.75V26.75A3.75 3.75 0 008 23z"
          fill="none"
        />
        <path
          data-name="Path 15285"
          d="M45.841 23h-7.5a3.75 3.75 0 00-3.75 3.75v9.375a3.75 3.75 0 003.75 3.75h3.75a3.75 3.75 0 003.75-3.75z"
          fill="none"
        />
        <path
          data-name="Path 15286"
          d="M45.841 23h-7.5a3.75 3.75 0 00-3.75 3.75v9.375a3.75 3.75 0 003.75 3.75h3.75a3.75 3.75 0 003.75-3.75V23A22.671 22.671 0 00.5 23v13.125a3.75 3.75 0 003.75 3.75H8a3.75 3.75 0 003.75-3.75V26.75A3.75 3.75 0 008 23H.5"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          data-name="Path 15287"
          d="M45.841 36.125v5.625a7.5 7.5 0 01-7.5 7.5H24.875"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

const MemoAudioBased = React.memo(AudioBased);
export default MemoAudioBased;
