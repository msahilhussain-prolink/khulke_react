import * as React from "react";

function MuteAccounts(props) {
  return (
    <svg
      data-name="Group 21134"
      width="1em"
      height="1em"
      viewBox="0 0 30.706 30"
      {...props}
    >
      <path data-name="Rectangle 5605" fill="none" d="M0 0h30v30H0z" />
      <circle
        data-name="Ellipse 1358"
        cx={7.031}
        cy={7.031}
        r={7.031}
        transform="translate(5.625 4.688)"
        fill="none"
        stroke="#63779C"
        strokeMiterlimit={10}
      />
      <path
        data-name="Path 21293"
        d="M2.603 23.437a13.126 13.126 0 0120.108 0"
        fill="none"
        stroke="#63779C"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g
        data-name="Group 21135"
        fill="none"
        stroke="#63779C"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          data-name="Path 21294"
          d="M28.415 15.542a3.742 3.742 0 01-6.235-2.353"
        />
        <path
          data-name="Path 21295"
          d="M27.296 14.312a2.071 2.071 0 01-1.4.54h0a2.079 2.079 0 01-2.076-2.079v-2.288"
        />
        <path data-name="Line 985" d="M25.899 16.523v1.641" />
        <path data-name="Line 986" d="M21.797 8.203L30 17.226" />
        <path
          data-name="Path 21296"
          d="M24.13 8.355a2.077 2.077 0 011.769-.986h0a2.078 2.078 0 012.078 2.079v3.14"
        />
        <path
          data-name="Path 21297"
          d="M29.618 13.189a3.718 3.718 0 01-.233.947"
        />
      </g>
    </svg>
  );
}

const MemoMuteAccounts = React.memo(MuteAccounts);
export default MemoMuteAccounts;
