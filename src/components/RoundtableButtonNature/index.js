import React from "react";

// Components
import { allWords } from "../../App";
import MemoConfidentialIcon from "../IconsComponents/ConfidentialBased";
import MemoGlobeBased from "../IconsComponents/GlobeBased";
import MemoPrivacyIcon from "../IconsComponents/PrivateBased";

export default function RoundtableButtonNature(props) {
  const { rt_nature, setRTNature } = props;
  return (
    <div className="d-flex  mt-2 rt-button-nature-div">
      <button
        className={rt_nature === "public" ? "torbtn toggle" : "torbtn"}
        onClick={() => {
          setRTNature("public");
        }}
        style={{ marginRight: "15px" }}
      >
        <MemoGlobeBased
          color={rt_nature === "public" ? "#fff" : "#63779c"}
          width="22px"
          height="22px"
        />
        &nbsp;
        <span
          className={rt_nature === "public" ? "#fff" : "#63779c"}
          style={{ fontSize: "14px" }}
        >
          {allWords.createRT.optPub}
        </span>
      </button>

      <button
        className={rt_nature === "private" ? "torbtn toggle" : "torbtn"}
        onClick={() => {
          setRTNature("private");
        }}
        style={{ marginRight: "15px" }}
      >
        <MemoPrivacyIcon
          color={rt_nature === "private" ? "#fff" : "#63779c"}
          width="27px"
          height="27px"
        />
        &nbsp;
        <span
          className={rt_nature === "private" ? "#fff" : "#63779c"}
          style={{ fontSize: "14px" }}
        >
          {allWords.createRT.optPriv}
        </span>
      </button>

      <button
        className={rt_nature === "secret" ? "torbtn toggle" : "torbtn"}
        onClick={() => {
          setRTNature("secret");
        }}
        hidden={window.location.origin === "https://khulke.com" ? true : false}
      >
        <MemoConfidentialIcon
          color={rt_nature === "secret" ? "#fff" : "#63779c"}
          width="25px"
          height="25px"
        />
        &nbsp;
        <span
          className={rt_nature === "secret" ? "#fff" : "#63779c"}
          style={{ fontSize: "14px" }}
        >
          {allWords.createRT.optConfi}
        </span>
      </button>
    </div>
  );
}
