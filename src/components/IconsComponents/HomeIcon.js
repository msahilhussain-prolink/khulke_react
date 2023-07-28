import * as React from "react";

function SvgComponent(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={21.625}
      height={22.3}
      {...props}
    >
      <path
        d="M13.624 20.862v-5.626a.937.937 0 00-.937-.937h-3.75a.937.937 0 00-.937.938v5.625a.937.937 0 01-.937.938H1.438a.938.938 0 01-.938-.938V10.027a.937.937 0 01.307-.694L10.181.809a.937.937 0 011.261 0l9.376 8.524a.938.938 0 01.307.694v10.835a.937.937 0 01-.938.938h-5.625a.937.937 0 01-.937-.937z"
        fill="#66b984"
        stroke="currentColor"
        // strokeLinecap="round"
        // strokeLinejoin="round"
      />
    </svg>
  );
}

export default SvgComponent;
