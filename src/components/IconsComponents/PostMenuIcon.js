import * as React from "react";

const SvgComponent = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} {...props}>
    <defs>
      <style>{".c{fill:#11141c}"}</style>
    </defs>
    <path
      style={{
        fill: "none",
      }}
      d="M0 0h30v30H0z"
    />
    <circle
      cx={11.25}
      cy={11.25}
      r={11.25}
      transform="translate(3.75 3.75)"
      style={{
        stroke: "#11141c",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        fill: "none",
      }}
    />
    <circle
      className="c"
      cx={1.172}
      cy={1.172}
      r={1.172}
      transform="translate(13.828 13.828)"
    />
    <circle
      className="c"
      cx={1.172}
      cy={1.172}
      r={1.172}
      transform="translate(8.203 13.828)"
    />
    <circle
      className="c"
      cx={1.172}
      cy={1.172}
      r={1.172}
      transform="translate(19.453 13.828)"
    />
  </svg>
);

export default SvgComponent;
