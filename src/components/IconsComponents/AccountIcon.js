import * as React from "react";

function AccountIcon(props) {
  return (
    <svg
      data-name="Group 21129"
      width="1em"
      height="1em"
      viewBox="0 0 30 30"
      {...props}
    >
      <path data-name="Rectangle 5595" fill="none" d="M0 0h30v30H0z" />
      <circle
        data-name="Ellipse 1357"
        cx={7.5}
        cy={7.5}
        r={7.5}
        transform="translate(7.5 3.75)"
        fill="none"
        stroke="#63779C"
        strokeMiterlimit={10}
      />
      <path
        data-name="Path 21289"
        d="M3.632 25.311a13.129 13.129 0 0122.737 0"
        fill="none"
        stroke="#63779C"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MemoAccountIcon = React.memo(AccountIcon);
export default MemoAccountIcon;
