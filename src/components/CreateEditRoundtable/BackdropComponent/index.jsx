import { Backdrop, CircularProgress, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { rtBackdrop } from "../styles";
import "./style.css";

export default function BackdropComponent() {
  const backdropFlag = useSelector(
    (state) => state.createEditRoundtable.backdropFlag
  );
  const rtType = useSelector((state) => state.createEditRoundtable.rtType);
  return (
    <Backdrop sx={rtBackdrop} open={backdropFlag}>
      <div className="backdropDiv">
        <CircularProgress color="inherit" />
        <Typography className="backdropTypo">
          {rtType === "recorded"
            ? "Please do not close your browser while we are uploading file."
            : "Confirming your RoundTable"}
        </Typography>
      </div>
    </Backdrop>
  );
}
