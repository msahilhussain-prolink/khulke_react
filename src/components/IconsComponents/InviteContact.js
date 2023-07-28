import React from "react";

function InviteIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      data-name="Group 21235"
      viewBox="0 0 22 22"
      {...props}
    >
      <path fill="none" d="M0 0H24V24H0z" data-name="Rectangle 5639"></path>
      <circle
        cx="3.75"
        cy="3.75"
        r="3.75"
        fill="none"
        stroke="#aebdd3"
        strokeMiterlimit="10"
        strokeWidth="1"
        data-name="Ellipse 1400"
        transform="translate(8.25 7.5)"
      ></circle>
      <path
        fill="none"
        stroke="#aebdd3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M5.982 18.691a6.753 6.753 0 0112.038 0"
        data-name="Path 21322"
      ></path>
      <path
        fill="none"
        stroke="#aebdd3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M0 0L4.5 0"
        data-name="Line 1002"
        transform="translate(16.5 5.25)"
      ></path>
      <path
        fill="none"
        stroke="#aebdd3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M0 0L0 4.5"
        data-name="Line 1003"
        transform="translate(18.75 3)"
      ></path>
      <path
        fill="none"
        stroke="#aebdd3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M20.888 10.58a8.991 8.991 0 11-7.469-7.469"
        data-name="Path 21323"
      ></path>
    </svg>
  );
}

const MemoInviteFriends = React.memo(InviteIcon);
export default MemoInviteFriends;
