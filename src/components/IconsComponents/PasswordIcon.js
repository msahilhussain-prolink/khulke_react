import * as React from "react";

function PasswordIcon(props) {
  return (
    <svg
      data-name="Group 21132"
      width="1em"
      height="1em"
      viewBox="0 0 30 30"
      {...props}
    >
      <path data-name="Rectangle 5602" fill="none" d="M0 0h30v30H0z" />
      <rect
        data-name="Rectangle 5603"
        width={20.625}
        height={15}
        rx={2}
        transform="translate(4.687 10.313)"
        fill="none"
        stroke="#63779C"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        data-name="Path 21291"
        d="M10.78 10.313V6.094a4.219 4.219 0 018.438 0v4.219"
        fill="none"
        stroke="#63779C"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MemoPasswordIcon = React.memo(PasswordIcon);
export default MemoPasswordIcon;
