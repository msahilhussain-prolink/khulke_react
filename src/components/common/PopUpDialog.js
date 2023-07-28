import React from "react";
import ClearIcon from "@mui/icons-material/Clear";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { CancelOutlined } from "@material-ui/icons";

const PopUpDialog = (props) => {
  const { title, children, open, setOpen } = props;

  return (
    <Dialog
      open={open}
      width={"20rem"}
      onClose={() => {
        setOpen();
        setOpen(false);
      }}
    >
      <DialogTitle>
        <div
          className="d-flex justify-content-between"
          style={{ marginTop: "1rem" }}
        >
          <h4>{title}</h4>
          <div style={{ marginTop: "-10px" }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.1, opacity: 0.8 }}
            >
              <IconButton
                onClick={() => {
                  setOpen(false);
                }}
                style={{ width: 50, height: 50 }}
              >
                <CancelOutlined />
              </IconButton>
            </motion.div>
          </div>
        </div>
      </DialogTitle>
      <DialogContent style={{ minWidth: 380 }}>{children}</DialogContent>
    </Dialog>
  );
};

export default PopUpDialog;
