import React from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";

import { CancelOutlined } from "@material-ui/icons";

const MuteDialog = (props) => {
  const { title, children, open, setOpen } = props;

  return (
    <Dialog
      open={open}
      width={window.screen.width <= 768 ? "100%" : "20rem"}
      onClose={() => {
        setOpen();
        setOpen(false);
      }}
    >
      <DialogTitle>
        <div
          style={{
            display: "flex",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          {/* <p style={{ visibility: "hidden", userSelect: "none" }}>aaaa</p> */}{" "}
          &emsp;
          <p style={{ fontWeight: "bold" }}>{title}</p>
          {/* <p style={{ visibility: "hidden", userSelect: "none" }}>aaaa</p> */}{" "}
          &emsp;
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
      <DialogContent
        style={{ minWidth: window.screen.width <= 768 ? "100%" : 380 }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default MuteDialog;
