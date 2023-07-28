import * as React from "react";

function GlobeBased({ color, width = "30", height = "30" }) {
  return (
    <svg
      id="Group_19614"
      data-name="Group 19614"
      width={width}
      height={height}
      fontSize="1.4rem"
      style={{ strokeWidth: "4" }}
      viewBox="0 0 60 60"
    >
      <path data-name="Rectangle 2886" fill="none" d="M0 0h60v60H0z" />
      <circle
        data-name="Ellipse 947"
        cx={22.5}
        cy={22.5}
        r={22.5}
        transform="translate(7.5 7.5)"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        data-name="Path 15292"
        d="M50.195 39.931l-12.723-7.825a1.875 1.875 0 00-.732-.261l-5.348-.721a1.875 1.875 0 00-1.963 1.095l-3.211 7.2a1.875 1.875 0 00.336 2.036l4.406 4.766a1.875 1.875 0 01.464 1.629l-.9 4.64"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        data-name="Path 15293"
        d="M15.224 13.032l-2.1 4.957a1.875 1.875 0 00-.029 1.388l2.693 7.188a1.875 1.875 0 001.362 1.175l5.023 1.08a1.875 1.875 0 011.294 1.016l.892 1.843a1.875 1.875 0 001.688 1.058h3.148"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        data-name="Path 15294"
        d="M35.732 8.238l2.183 3.918a1.875 1.875 0 01-.379 2.3l-6.307 5.7a1.875 1.875 0 01-.351.251L28.015 22a1.875 1.875 0 01-.906.234h-5a1.875 1.875 0 00-1.728 1.147l-1.952 4.633"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MemoGlobeBased = React.memo(GlobeBased);
export default MemoGlobeBased;
