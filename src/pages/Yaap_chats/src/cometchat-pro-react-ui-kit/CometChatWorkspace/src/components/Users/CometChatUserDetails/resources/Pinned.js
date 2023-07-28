import React from "react";

const PinnedIcon = ({ width = 9.363, height = 15.604, style = {} }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 9.363 15.604"
      style={style}
    >
      <path
        id="push_pin_FILL0_wght400_GRAD0_opsz48"
        d="M247.685,223.646l1.677,1.5v1.17h-4.1v4.7l-.585.585-.585-.585v-4.7H240v-1.17l1.56-1.5V217.17h-.975V216h8.075v1.17h-.975Zm-6.105,1.5h6.086l-1.151-1.073v-6.9h-3.784v6.9ZM244.623,225.148Z"
        transform="translate(-240 -216)"
      />
    </svg>
  );
};

export default PinnedIcon;
