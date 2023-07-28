import React from "react";
import {allWords} from "../../App";
const CaptionInput = ({
  onCaptionChange,
  captionLength,
  captionLength2,
  captionLength3,
  captionLength4,
}) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          marginTop: "0.5rem",
          border: " 1px solid lightgray",
          borderRadius: 5,
        }}
      >
        <input
          placeholder={allWords.th.imgplcHolder}
          onChange={onCaptionChange}
          maxLength={50}
          style={{
            outline: "none",
            border: "none",
            flex: 1,
            padding: "0.5rem",
            minHeight: "50px",
          }}
        />
        <p>{captionLength}</p>
        <p>{captionLength2}</p>
        <p>{captionLength3}</p>
        <p>{captionLength4}</p>
      </div>
    </div>
  );
};

export default CaptionInput;
