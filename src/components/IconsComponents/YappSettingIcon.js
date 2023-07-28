import * as React from "react";

function YappSettingIcon(props) {
  return (
    <svg
      data-name="Group 21137"
      width="1em"
      height="1em"
      viewBox="0 0 30 30"
      {...props}
    >
      <path data-name="Rectangle 5607" fill="none" d="M0 0h30v30H0z" />
      <path
        data-name="Path 21299"
        d="M8.389 16.875l-4.639 3.75v-15a.937.937 0 01.938-.938h15a.937.937 0 01.938.938v10.312a.937.937 0 01-.937.938z"
        fill="none"
        stroke="#63779C"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        data-name="Path 21300"
        d="M9.375 16.875v4.687a.937.937 0 00.938.937h11.3l4.639 3.75v-15a.938.938 0 00-.939-.937h-4.688"
        fill="none"
        stroke="#63779C"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MemoYappSettingIcon = React.memo(YappSettingIcon);
export default MemoYappSettingIcon;
