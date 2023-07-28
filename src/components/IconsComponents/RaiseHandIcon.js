import * as React from "react";

function RaisedHandIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width}
      height={props.height}
      data-name="Group 22240"
      viewBox={`0 0 ${props.width} ${props.height}`}
    >
      <path fill="none" d="M0 0H30V30H0z" data-name="Rectangle 6255"></path>
      <path
        fill="rgba(62,150,94,0)"
        d="M40.38 20.219v-1.875a2.344 2.344 0 014.688 0v3.75a2.344 2.344 0 014.688 0v9.844a9.375 9.375 0 01-9.375 9.375c-5.178 0-7.5-2.812-11.317-10.865a2.344 2.344 0 014.059-2.348l2.57 4.451V20.219a2.344 2.344 0 014.688 0z"
        data-name="Path 21629"
        opacity="0.2"
        transform="translate(-25.38 -14.125)"
      ></path>
      <path
        fill={props.fill}
        stroke={props.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M19.687 14.063V7.969a2.344 2.344 0 014.688 0v9.844A9.375 9.375 0 0115 27.188c-5.178 0-7.5-2.812-11.317-10.865a2.344 2.344 0 114.059-2.344l2.57 4.451V6.094a2.344 2.344 0 014.688 0v7.969"
        data-name="Path 21630"
      ></path>
      <path
        fill={props.fill}
        stroke={props.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M19.688 14.063V4.219a2.344 2.344 0 00-4.687 0v9.844"
        data-name="Path 21631"
      ></path>
    </svg>
  );
}

const MemoRaisedHandIcon = React.memo(RaisedHandIcon);
export default MemoRaisedHandIcon;
