import * as React from "react";

function SvgComponent(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 26.5 23.441"
      stroke="currentColor"
      {...props}
    >
      <path
        d="M1.015 17.074a.757.757 0 00.765-.765v-5.9c2.049 2.049 6.026 3.456 10.706 3.579v8.442a.765.765 0 101.529 0v-8.415c4.68-.153 8.656-1.529 10.706-3.579v5.873a.765.765 0 101.529 0V7.132c0-3.854-5.72-6.882-13-6.882s-13 3.028-13 6.882v9.176a.757.757 0 00.765.766zM13.25 1.779c6.209 0 11.471 2.447 11.471 5.353s-5.262 5.353-11.471 5.353S1.779 10.038 1.779 7.132 7.041 1.779 13.25 1.779z"
        fill="black"
        stroke="currentColor"
        strokeWidth={0.5}
      />
    </svg>
  );
}

export default SvgComponent;
