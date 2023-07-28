import React from "react";
import { CircularProgress } from "@mui/material";
import { allWords } from "../../App";

export default function confirmButton(props) {
  const { is_valid, onclick, uploadingFiles } = props;
  return (
    <div>
      <button
        className={
          is_valid
            ? `btn primary-btn-blk`
            : `disabled-button btn primary-btn-blk`
        }
        onClick={onclick}
        style={{ width: "50%" }}
        disabled={uploadingFiles}
      >
        {allWords.login.btn}
        {uploadingFiles && <CircularProgress size={20} />}
      </button>
    </div>
  );
}
