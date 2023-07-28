import React from "react";
import styled from "styled-components";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { motion } from "framer-motion";
import { IconButton } from "@material-ui/core";
import { CancelOutlined } from "@material-ui/icons";
import { MOBILE_VIEW } from "../../../constants/env";
import { allWords } from "../../../App";

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
  // width: 200px;
  height: 50px;
  outline: none;
  border-radius: 5px;
  color: ${(props) => (props.primary ? props.theme.color.primary : "white")};
  background-color: ${(props) =>
    props.bgColor ? props.theme.color.secondary : "white"};
  border: 2px solid
    ${(props) =>
      props.primary ? props.theme.color.primary : props.theme.color.secondary};

  @media only screen and (max-width: 768px) {
    width: 120px;
  }

  @media only screen and (min-width: 769px) {
    width: 200px;
  }
`;

const DiscardDialog = ({ setDiscard, setAddPost }) => {
  return (
    <Dialog
      open={true}
      PaperProps={{
        style: {
          borderRadius: "1rem",
        },
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
              <IconButton
                onClick={() => {
                  setDiscard(false);
                  setAddPost(true);
                }}
                style={{ width: 50, height: 50 }}
              >
                <CancelOutlined />
              </IconButton>
            </motion.div>
          </div>
        </div>
      </DialogTitle>
      <DialogContent>
        <Container>
          <p style={{ fontWeight: 600 }}>{allWords.misc.ays}</p>
          <div
            className="btn_container d-flex"
            style={{ justifyContent: "flex-start" }}
          >
            <Button
              primary
              onClick={() => {
                setDiscard(false);
                setAddPost(false);
                localStorage.removeItem("text_data");
              }}
            >
              {MOBILE_VIEW
                ? allWords.misc.review.discard.y.split(",")[0]
                : allWords.misc.review.discard.y}
            </Button>
            <Button
              bgColor
              onClick={() => {
                setDiscard(false);
                setAddPost(true);
              }}
              style={{ marginLeft: "20px" }}
            >
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
