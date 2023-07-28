import React from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { CancelOutlined } from "@material-ui/icons";

const PopUp = (props) => {
  const { title, children, open, setOpen, onCloseBtnClick } = props;

  return (
    <Dialog
      style={{
        maxHeight: title == "RoundTable" ? "" : "50rem",
        overflowY: "scroll",
      }}
      open={open}
      maxWidth="md"
      onClose={() => {
        setOpen();
        setOpen(true);
      }}
    >
      <DialogTitle>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontWeight: "bold" }}>{title}</p>
          <div id="cross_div_button">
            <motion.div
              id="cross_motion_button"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.1, opacity: 0.8 }}
            >
              <IconButton
                id="close_button"
                onClick={onCloseBtnClick}
                style={{ width: 50, height: 50 }}
              >
                <CancelOutlined id="cross_icon_button" />
              </IconButton>
            </motion.div>
          </div>
        </div>
      </DialogTitle>
      <DialogContent
        style={{ minWidth: window.screen.width < 768 ? 300 : 550 }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default PopUp;
