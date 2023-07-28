import * as React from "react";

function MuteDialog(props) {
  return (
    <svg
      data-name="Group 21133"
      width="1em"
      height="1em"
      viewBox="0 0 30 30"
      {...props}
    >
      <path data-name="Rectangle 5604" fill="none" d="M0 0h30v30H0z" />
      <path
        data-name="Path 21292"
        d="M9.375 19.688H3.75a.937.937 0 01-.938-.938v-7.5a.937.937 0 01.938-.937h5.625l8.437-6.563v22.5z"
        fill="none"
        stroke="#66B984"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        data-name="Line 981"
        fill="none"
        stroke="#66B984"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M28.125 12.188L22.5 17.813"
      />
      <path
        data-name="Line 982"
        fill="none"
        stroke="#66B984"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M28.125 17.813L22.5 12.188"
      />
      <path
        data-name="Line 983"
        fill="none"
        stroke="#66B984"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.375 10.313v9.375"
      />
    </svg>
  );
}

const MemoMuteDialog = React.memo(MuteDialog);
export default MemoMuteDialog;
