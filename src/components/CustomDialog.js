import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";

const CustomDialog = ({
  open,
  onClose,
  topSection,
  middleSection,
  bottomSection,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: { borderRadius: "0.8rem", width: 600 },
      }}
    >
      {topSection && <DialogTitle>{topSection}</DialogTitle>}
      {middleSection && <DialogContent>{middleSection}</DialogContent>}
      {bottomSection && <DialogActions>{bottomSection}</DialogActions>}
    </Dialog>
  );
};

export default CustomDialog;
