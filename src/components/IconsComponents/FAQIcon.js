import * as React from "react";

function FAQIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      data-name="Group 21146"
      viewBox="0 0 25 25"
      {...props}
    >
      <path fill="none" d="M0 0H24V24H0z" data-name="Rectangle 5609"></path>
      <circle
        cx="9"
        cy="9"
        r="9"
        fill="none"
        stroke="#63779c"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        data-name="Ellipse 1360"
        transform="translate(3 3)"
      ></circle>
      <circle
        cx="1.125"
        cy="1.125"
        r="1.125"
        fill="#63779c"
        data-name="Ellipse 1361"
        transform="translate(10.875 15.75)"
      ></circle>
      <path
        fill="none"
        stroke="#63779c"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M11.999 13.496v-.75a2.625 2.625 0 10-2.624-2.62"
        data-name="Path 21302"
      ></path>
    </svg>
  );
}
const MemoFAQIcon = React.memo(FAQIcon);
export default MemoFAQIcon;
