import React from "react";
import { HrLine } from "./style";
import { allWords } from "../../App";

export default function Confirmation({ label, dialog }) {
  return (
    <div className="mt-4 mb-4" style={{ width: "100%" }}>
      <div className="text-center">
        <span className="text-muted modpan_label">{label}</span>
      </div>{" "}
      <div className="text-center mb-4" style={{ marginTop: "0.813rem" }}>
        <small className="text-muted">{allWords.misc.cawaited}</small>
      </div>
      <HrLine />
    </div>
  );
}
