import * as React from "react";

function OrangeTweetIcon(props) {
  return (
    <svg
      data-name="Component 11 \u2013 32"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path data-name="Rectangle 2595" fill="none" d="M0 0h24v24H0z" />
      <path
        data-name="Path 13940"
        d="M18.75 8.25L21 6l-2.25-2.25"
        fill="none"
        stroke="#ed4d29"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        data-name="Path 13941"
        d="M3 12a6 6 0 016-6h12"
        fill="none"
        stroke="#ed4d29"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        data-name="Path 13942"
        d="M5.25 15.75L3 18l2.25 2.25"
        fill="none"
        stroke="#ed4d29"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        data-name="Path 13943"
        d="M21 12a6 6 0 01-6 6H3"
        fill="none"
        stroke="#ed4d29"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MemoOrangeTweetIcon = React.memo(OrangeTweetIcon);
export default MemoOrangeTweetIcon;
