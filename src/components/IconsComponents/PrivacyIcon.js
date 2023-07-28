import * as React from "react";

function PrivacyIcon(props) {
  return (
    <svg
      data-name="Group 21130"
      width="1em"
      height="1em"
      viewBox="0 0 30 30"
      {...props}
    >
      <path data-name="Rectangle 5596" fill="none" d="M0 0h30v30H0z" />
      <path
        data-name="Path 21290"
        d="M4.687 13.438V6.563a.937.937 0 01.938-.938h18.75a.937.937 0 01.938.938v6.875c0 9.846-8.356 13.107-10.025 13.661a.884.884 0 01-.576 0c-1.669-.554-10.025-3.816-10.025-13.661z"
        fill="none"
        stroke="#63779C"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MemoPrivacyIcon = React.memo(PrivacyIcon);
export default MemoPrivacyIcon;
