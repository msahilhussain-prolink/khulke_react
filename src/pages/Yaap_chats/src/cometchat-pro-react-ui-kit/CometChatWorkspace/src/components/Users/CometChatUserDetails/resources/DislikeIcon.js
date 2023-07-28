import React from "react";

const DislikeIcon = ({
    width = "14.402",
    height = "13.749",
    color = "#bc0000",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 14.402 13.749"
    >
      <path
        id="thumb_down_FILL0_wght400_GRAD0_opsz48"
        d="M44.454,216h7.631v8.8l-4.778,4.95-.67-.533a.517.517,0,0,1-.155-.241,1.206,1.206,0,0,1-.052-.378v-.172L47.2,224.8H42.066a1.057,1.057,0,0,1-1.031-1.031v-1.406a1.283,1.283,0,0,0-.026-.252.413.413,0,0,1,.026-.249l2.165-4.984a1.447,1.447,0,0,1,.509-.621A1.26,1.26,0,0,1,44.454,216Zm6.6,1.031H44.231l-2.165,5.139v1.6h6.41l-.911,4.279,3.489-3.678Zm0,7.338v0Zm1.031.43v-1.031h2.286v-6.737H52.085V216H55.4v8.8Z"
        transform="translate(-41 -216)"
        fill={color}
      />
    </svg>
  );
};

export default DislikeIcon;
