import React from "react";
import styled from "styled-components";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { motion } from "framer-motion";
import { IconButton } from "@material-ui/core";
import { CancelOutlined } from "@material-ui/icons";
import { allWords } from "../../../App";
import { MOBILE_VIEW } from "../../../constants/env";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  .btn_container {
    margin-top: 1rem;
    width: 100%;
    display: flex;
    // justify-content: space-between;
  }
`;

const Button = styled.button`
  width: 200px;
  height: 50px;
  outline: none;
  border-radius: 5px;
  color: ${(props) => (props.primary ? props.theme.color.primary : "white")};
  background-color: ${(props) =>
    props.bgColor ? props.theme.color.secondary : "white"};
  border: 2px solid
    ${(props) =>
      props.primary ? props.theme.color.primary : props.theme.color.secondary};
`;

const DiscardDialog = ({ open, close, confirm }) => {
  return (
    <Dialog
      open={open}
      PaperProps={{
        style: { borderRadius: "1rem" },
      }}
    >
      <DialogTitle>
        {" "}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontWeight: "bold" }}>{allWords.th.disTitle}</p>
          <div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.1, opacity: 0.8 }}
            >
              <IconButton onClick={close} style={{ width: 50, height: 50 }}>
                <CancelOutlined />
              </IconButton>
            </motion.div>
          </div>
        </div>
      </DialogTitle>
      <DialogContent>
        <Container>
          <p>{allWords.misc.ays}</p>
          <div className="btn_container">
            <Button primary onClick={confirm}>
              {MOBILE_VIEW
                ? allWords.misc.review.discard.y.split(",")[0]
                : allWords.misc.review.discard.y}
            </Button>
            <Button bgColor onClick={close} style={{ marginLeft: "20px" }}>
              {MOBILE_VIEW
                ? allWords.misc.review.discard.n.split(",")[0]
                : allWords.misc.review.discard.n}
            </Button>
          </div>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default DiscardDialog;
