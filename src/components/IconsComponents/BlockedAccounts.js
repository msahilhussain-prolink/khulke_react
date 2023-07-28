import * as React from "react";

function BlockedAccounts(props) {
  return (
    <svg
      data-name="Group 21136"
      width="1em"
      height="1em"
      viewBox="0 0 30 30"
      {...props}
    >
      <path data-name="Rectangle 5606" fill="none" d="M0 0h30v30H0z" />
      <path
        data-name="Line 987"
        fill="none"
        stroke="#63779C"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M24.261 13.949l3.977 3.977"
      />
      <path
        data-name="Line 988"
        fill="none"
        stroke="#63779C"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M28.239 13.949l-3.977 3.977"
      />
      <circle
        data-name="Ellipse 1359"
        cx={7.031}
        cy={7.031}
        r={7.031}
        transform="translate(5.625 4.688)"
        fill="none"
        stroke="#63779C"
        strokeMiterlimit={10}
      />
      <path
        data-name="Path 21298"
        d="M2.603 23.437a13.126 13.126 0 0120.108 0"
        fill="none"
        stroke="#63779C"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MemoBlockedAccounts = React.memo(BlockedAccounts);
export default MemoBlockedAccounts;
