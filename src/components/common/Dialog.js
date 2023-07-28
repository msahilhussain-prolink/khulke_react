import React from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { CancelOutlined } from "@material-ui/icons";

const PopUp = (props) => {
  const { title, children, open, setOpen, hiddenHeader } = props;

  return (
    <Dialog
      open={open}
      maxWidth="md"
      onClose={() => {
        setOpen();
        setOpen(false);
      }}
      PaperProps={{
        style: { borderRadius: 16 },
      }}
    >
      {!hiddenHeader && (
        <DialogTitle>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p style={{ fontWeight: "bold" }}>{title}</p>
            <div>
              <IconButton
                onClick={() => {
                  setOpen(false);
                }}
                style={{ width: 50, height: 50 }}
              >
                <CancelOutlined />
              </IconButton>
            </div>
          </div>
        </DialogTitle>
      )}

      <DialogContent className="dialog-content">{children}</DialogContent>
    </Dialog>
  );
};

export default PopUp;
