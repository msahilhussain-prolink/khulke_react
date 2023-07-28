import * as React from "react";

function SupportIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      data-name="Group 21149"
      viewBox="0 0 24 24"
      {...props}
    >
      <path fill="none" d="M0 0H24V24H0z" data-name="Rectangle 5611"></path>
      <circle
        cx="9"
        cy="9"
        r="9"
        fill="none"
        stroke="#63779c"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        data-name="Ellipse 1362"
        transform="translate(3 3)"
      ></circle>
      <circle
        cx="3.75"
        cy="3.75"
        r="3.75"
        fill="none"
        stroke="#63779c"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        data-name="Ellipse 1363"
        transform="translate(8.25 8.25)"
      ></circle>
      <path
        fill="none"
        stroke="#63779c"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M3.712 3.712L0 0"
        data-name="Line 990"
        transform="translate(5.636 5.636)"
      ></path>
      <path
        fill="none"
        stroke="#63779c"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M0 3.712L3.712 0"
        data-name="Line 991"
        transform="translate(14.652 5.636)"
      ></path>
      <path
        fill="none"
        stroke="#63779c"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M0 0L3.712 3.712"
        data-name="Line 992"
        transform="translate(14.652 14.652)"
      ></path>
      <path
        fill="none"
        stroke="#63779c"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M3.712 0L0 3.712"
        data-name="Line 993"
        transform="translate(5.636 14.652)"
      ></path>
    </svg>
  );
}

const MemoSupportIcon = React.memo(SupportIcon);

export default MemoSupportIcon;
