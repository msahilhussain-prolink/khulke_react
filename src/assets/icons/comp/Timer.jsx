import React from "react";

const Timer = ({
    height = '28',
    width = '28',
    color = "#000"
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="Group_24527"
      data-name="Group 24527"
      width={height}
      height={width}
      viewBox="0 0 28 28"
    >
      <g
        id="Icon_feather-clock"
        data-name="Icon feather-clock"
        transform="translate(4 4)"
      >
        <path
          id="Path_21828"
          data-name="Path 21828"
          d="M23,13A10,10,0,1,1,13,3,10,10,0,0,1,23,13Z"
          transform="translate(-3 -3)"
          fill="none"
          stroke={color}
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
        <path
          id="Path_21829"
          data-name="Path 21829"
          d="M18,9v6l4,2"
          transform="translate(-8 -5)"
          fill="none"
          stroke={color}
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
      </g>
      <rect
        id="Rectangle_2913"
        data-name="Rectangle 2913"
        width="28"
        height="28"
        fill="none"
      />
    </svg>
  );
};

export default Timer;
