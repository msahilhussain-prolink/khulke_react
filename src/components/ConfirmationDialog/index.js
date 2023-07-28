import { Dialog, DialogContent, Typography } from "@mui/material";
import React from "react";
import { allWords } from "../../App";

export default function ConfirmationDialog({
  open,
  setOpen,
  msg,
  custom_yes,
  custom_no,
  label = "",
  labelYes = "",
  labelNo = "",
}) {
  return (
    <>
      <Dialog
        open={open}
        maxWidth="md"
        onClose={() => {
          setOpen();
          setOpen(false);
        }}
      >
        <DialogContent
          style={{
            minWidth: window.screen.width <= 768 ? "100%" : 550,
          }}
        >
          <div className="text-center confirmation-dialog-div">
            <Typography
              sx={{
                fontSize: "1.5rem",
              }}
            >
              {msg}
            </Typography>
            <div className="d-flex justify-content-between mt-5">
              <button
                className="confirmation-dialog-button"
                size="medium"
                onClick={custom_yes}
                style={{
                  backgroundColor: "#54b798",
                }}
              >
                {label !== "create_dialog" ? allWords.misc.yes : labelYes}
              </button>
              <button
                className="confirmation-dialog-button"
                size="medium"
                style={{
                  backgroundColor: "#F15B29",
                }}
                onClick={custom_no}
              >
                {label !== "create_dialog" ? allWords.misc.no : labelNo}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
