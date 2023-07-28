import * as React from "react";

function AppsIcon(props) {
  return (
    <svg
      data-name="Group 21131"
      width="1em"
      height="1em"
      viewBox="0 0 30 30"
      {...props}
    >
      <path data-name="Rectangle 5597" fill="none" d="M0 0h30v30H0z" />
      <path
        data-name="Rectangle 5598"
        fill="none"
        stroke="#63779C"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.625 5.625h7.5v7.5h-7.5z"
      />
      <path
        data-name="Rectangle 5599"
        fill="none"
        stroke="#63779C"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.875 5.625h7.5v7.5h-7.5z"
      />
      <path
        data-name="Rectangle 5600"
        fill="none"
        stroke="#63779C"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.625 16.875h7.5v7.5h-7.5z"
      />
      <path
        data-name="Rectangle 5601"
        fill="none"
        stroke="#63779C"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.875 16.875h7.5v7.5h-7.5z"
      />
    </svg>
  );
}

const MemoAppsIcon = React.memo(AppsIcon);
export default MemoAppsIcon;
