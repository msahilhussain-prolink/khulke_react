import React from "react";

export default function NoTables({ txt, img, styles }) {
  return (
    <div className="my-5 container-fluid text-center">
      {txt ? (
        <small
          className="warn-text"
          style={{ visibility: "hidden", userSelect: "none" }}
        >
          {txt}
        </small>
      ) : null}
      <img src={img} alt="" style={styles ? styles : null} />
    </div>
  );
}
