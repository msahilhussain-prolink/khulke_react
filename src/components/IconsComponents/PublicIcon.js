import * as React from "react";

function PublicIcon(props) {
  return (
    <svg
      data-name="Group 19540"
      width="1em"
      height="1em"
      viewBox="0 0 20 20"
      {...props}
    >
      <path data-name="Rectangle 2857" fill="none" d="M0 0h20v20H0z" />
      <circle
        data-name="Ellipse 918"
        cx={3.125}
        cy={3.125}
        r={3.125}
        transform="translate(6.875 7.813)"
        fill="none"
        stroke="#ed4d29"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        data-name="Path 15255"
        d="M15.312 9.063a4.68 4.68 0 013.75 1.875"
        fill="none"
        stroke="#ed4d29"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        data-name="Path 15256"
        d="M.94 10.938a4.68 4.68 0 013.747-1.875"
        fill="none"
        stroke="#ed4d29"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        data-name="Path 15257"
        d="M5.502 16.874a5 5 0 018.995 0"
        fill="none"
        stroke="#ed4d29"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        data-name="Path 15258"
        d="M4.683 9.065a2.5 2.5 0 112.456-2.969"
        fill="none"
        stroke="#ed4d29"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        data-name="Path 15259"
        d="M12.857 6.093a2.5 2.5 0 112.456 2.969"
        fill="none"
        stroke="#ed4d29"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MemoPublicIcon = React.memo(PublicIcon);
export default MemoPublicIcon;
