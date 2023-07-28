import * as React from "react";

function DocumentIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      data-name="Group 19633"
      viewBox="0 0 60 60"
      {...props}
    >
      <path fill="none" d="M0 0H60V60H0z" data-name="Rectangle 2899"></path>
      <path
        fill="none"
        stroke="#63779c"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M46.875 52.5h-33.75a1.875 1.875 0 01-1.875-1.875V9.375A1.875 1.875 0 0113.125 7.5h22.5L48.75 20.625v30a1.875 1.875 0 01-1.875 1.875z"
        data-name="Path 15300"
      ></path>
      <path
        fill="none"
        stroke="#63779C"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M35.625 7.5v13.125h13.127"
        data-name="Path 15301"
      ></path>
    </svg>
  );
}
const MemoDocumentIcon = React.memo(DocumentIcon);
export default MemoDocumentIcon;
