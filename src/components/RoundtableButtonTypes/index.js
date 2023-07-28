import React from "react";
import { allWords } from "../../App";

// Components
import MemoAudioBased from "../IconsComponents/AudioBased";
import MemoVideoBased from "../IconsComponents/VideoBased";
import InfoIcon from "../InfoIcon";

export default function RoundtableButtonTypes(props) {
  const { rt_type, setRTType } = props;
  return (
    <div className="my-4">
      <small className="mt-2 rt-strong-labels-gray">
        {allWords.createRT.type}
        <span>
          <InfoIcon
            infoTitle2={allWords.createRT.iBtn.line1}
            infoTitle3={allWords.createRT.iBtn.line2}
            infoTitle4={allWords.createRT.iBtn.line3}
          />
        </span>
      </small>

      {/* Types of Roundtable Buttons  */}
      <div className="d-flex mt-3 " style={{ width: "100%" }}>
        <button
          className={rt_type === "video" ? "torbtn toggle" : "torbtn"}
          style={{ width: "190px", padding: "2px 20px", marginRight: "1rem" }}
          onClick={() => {
            setRTType("video");
          }}
        >
          <MemoVideoBased
            color={rt_type === "video" ? "#fff" : "#63779c"}
            width="20px"
            height="20px"
            marginTop="0px"
          />
          <span
            className={rt_type === "text" ? "#fff" : "#63779c"}
            style={{ fontSize: "14px" }}
          >
            &nbsp; {allWords.createRT.videoBtn}
          </span>
        </button>

        <button
          className={rt_type === "audio" ? "torbtn toggle" : "torbtn"}
          style={{
            width: "190px",
            padding: "2px 20px",
            marginRight: "1rem",
          }}
          onClick={() => {
            setRTType("audio");
          }}
        >
          <MemoAudioBased
            color={rt_type === "audio" ? "#fff" : "#63779c"}
            width="20px"
            height="20px"
            marginTop="0px"
          />
          <span
            className={rt_type === "text" ? "#fff" : "#63779c"}
            style={{ fontSize: "14px" }}
          >
            &nbsp; {allWords.createRT.audioBtn}
          </span>
        </button>
      </div>
    </div>
  );
}
