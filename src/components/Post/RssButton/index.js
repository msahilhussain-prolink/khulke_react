import React from "react";

export default function RssButton(props) {
  const { post_type } = props;
  return (
    <>
      &emsp;
      {post_type === "RSS" && (
        <button
          id="Rt-text-button"
          style={{
            color: "#FFBC00",
            // opacity: "0.5",
            // marginLeft: "1rem",
            backgroundColor: "#FFE8A8",
            borderRadius: "50px",
            border: "rgb(110 247 159 / 28%)",
            padding: "0.4rem",
            paddingTop: "2px",
            paddingBottom: "2px",
            fontSize: "0.8rem",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          News
        </button>
      )}
    </>
  );
}
