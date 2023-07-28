import * as React from "react";

function SvgComponent(props) {
    return (
        <svg
            data-name="Component 12 \u2013 1"
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            {...props}
        >
            <path data-name="Rectangle 2596" fill="none" d="M0 0h24v24H0z" />
            <path
                data-name="Path 13944"
                d="M2.999 9.75h4.5v9.75h-4.5a.75.75 0 01-.75-.75V10.5a.75.75 0 01.75-.75z"
                fill="#A3A9BA"
                stroke="#4E5A7B"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                data-name="Path 13945"
                d="M7.499 9.75l3.75-7.5a3 3 0 013 3V7.5h5.8a1.5 1.5 0 011.488 1.686l-1.125 9a1.5 1.5 0 01-1.487 1.314H7.499"
                fill="#A3A9BA"
                stroke="#4E5A7B"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default SvgComponent;
