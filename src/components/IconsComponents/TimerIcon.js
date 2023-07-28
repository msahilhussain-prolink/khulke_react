import * as React from "react";
function TimerIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1rem"
      height="1rem"
      viewBox="0 0 12 12"
    >
      <g fill="none" data-name="Group 19542" transform="translate(0 .064)">
        <path d="M0 0H13.958V13.958H0z" data-name="Rectangle 2859"></path>
        <circle
          cx="4.798"
          cy="4.798"
          r="4.798"
          stroke="#aebdd3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          data-name="Ellipse 919"
          transform="translate(2.181 2.181)"
        ></circle>
        <path
          stroke="#aebdd3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          d="M0 2.159L2.159 0"
          data-name="Line 927"
          transform="translate(6.979 4.82)"
        ></path>
        <path
          stroke="#aebdd3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          d="M0 0L2.617 0"
          data-name="Line 928"
          transform="translate(5.67 .436)"
        ></path>
      </g>
    </svg>
  );
}
const MemoTimerIcon = React.memo(TimerIcon);
export default MemoTimerIcon;
