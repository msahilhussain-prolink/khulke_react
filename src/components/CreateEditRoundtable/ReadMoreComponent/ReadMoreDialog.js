import React from "react";

import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import "./style.css";

export default function ReadMoreDialog({
  isReadMore,
  setIsReadMore,
  children,
  dialogTitle,
}) {
  return (
    <Dialog
      open={isReadMore}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          borderRadius: "0.8rem",
        },
      }}
    >
      <DialogTitle>
        <div className="d-flex justify-content-between dialog-title-read">
          <h4>{dialogTitle}</h4>
          <IconButton onClick={() => setIsReadMore(!isReadMore)}>
            <CancelOutlinedIcon />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent>
        <p className="dialog-content-children">{children}</p>
      </DialogContent>
    </Dialog>
  );
}
