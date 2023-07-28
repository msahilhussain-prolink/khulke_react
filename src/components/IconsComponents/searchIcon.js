import * as React from "react";

function searchIcon(props) {
  return (
    <svg
      data-name="Group 19613"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
    >
      <path data-name="Rectangle 2885" fill="none" d="M0 0h16v16H0z" />
      <path
        data-name="Path 15291"
        d="M13.5 4.495l-7 7-3.5-3.5"
        fill="none"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MemosearchIcon = React.memo(searchIcon);
export default MemosearchIcon;
