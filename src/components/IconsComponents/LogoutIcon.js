import * as React from "react";

function LogoutIcon(props) {
  return (
    <svg
      data-name="Group 21150"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path data-name="Rectangle 5612" fill="none" d="M0 0h24v24H0z" />
      <path
        data-name="Path 21305"
        d="M16.314 8.062L20.25 12l-3.936 3.938"
        fill="none"
        stroke="#ed4d29"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        data-name="Line 994"
        fill="none"
        stroke="#ed4d29"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 12h10.497"
      />
      <path
        data-name="Path 21306"
        d="M9.75 20.25H4.5a.75.75 0 01-.75-.75v-15a.75.75 0 01.75-.75h5.25"
        fill="none"
        stroke="#ed4d29"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MemoLogoutIcon = React.memo(LogoutIcon);
export default MemoLogoutIcon;
