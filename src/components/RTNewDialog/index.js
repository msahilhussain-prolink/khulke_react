import { Dialog, DialogContent, Typography } from "@mui/material";
import React from "react";

// Lang
import { allWords } from "../../App";

// Components
import MemoAudioBased from "../IconsComponents/AudioBased";
import MemoVideoBased from "../IconsComponents/VideoBased";

// Assets
import RecordIcon from "../../assets/icons/recorded_icon.svg";
import InfoIcon from "../InfoIcon";

export default function RTNewDialog(props) {
  const { newOpen, setNewOpen, navigate } = props;
  return (
    <Dialog
      open={newOpen}
      maxWidth="md"
      onClose={() => {
        setNewOpen();
        setNewOpen(false);
      }}
      PaperProps={{
        style: { borderRadius: "1.25rem" },
      }}
    >
      <DialogContent className="dialog-content">
        <div className="container-fluid p-1">
          <small className="rt-new-dialog-title">
            {allWords.rt.popupTitle}
          </small>

          <div className="d-flex mt-4">
            <Typography style={{ fontWeight: "bold", fontSize: "16px" }}>
              {allWords.rt.label2}
            </Typography>
            <InfoIcon
              infoTitle2="You can do audio or video live session on your selected schedule time"
              width="15px"
              height="15px"
              mt="5px"
            />
          </div>

          <div className="d-flex mt-1 mb-2 rt-new-dialog-btns">
            <button
              className="torbtn"
              style={{
                width: "140px",
                padding: "2px 20px",
                marginRight: "1rem",
              }}
              onClick={() => {
                navigate("/roundtable/create", {
                  state: {
                    rt_page: "not_record",
                    rtTypes: "video",
                    type: "create",
                  },
                });
              }}
            >
              <MemoVideoBased
                color="#63779c"
                width="20px"
                height="20px"
                marginTop="0px"
              />
              <span className="#63779c" style={{ fontSize: "14px" }}>
                &nbsp; {allWords.rt.opt1}
              </span>
            </button>

            <button
              className="torbtn"
              style={{
                width: "140px",
                padding: "2px 20px",
                marginRight: "1rem",
              }}
              onClick={() => {
                navigate("/roundtable/create", {
                  state: {
                    rt_page: "not_record",
                    rtTypes: "audio",
                    type: "create",
                  },
                });
              }}
            >
              <MemoAudioBased
                color="#63779c"
                width="20px"
                height="20px"
                marginTop="0px"
              />
              <span className="#63779c" style={{ fontSize: "14px" }}>
                &nbsp; {allWords.rt.opt2}
              </span>
            </button>
          </div>

          <div className="d-flex mt-4 mb-1">
            <Typography style={{ fontWeight: "bold", fontSize: "16px" }}>
              {allWords.rt.opt3}
            </Typography>
            <InfoIcon
              infoTitle2="You can upload your recorded audio/video session and stream that on your selected schedule time"
              width="15px"
              height="15px"
              mt="5px"
            />
          </div>

          <button
            className="torbtn"
            style={{
              width: "auto",
              padding: "2px 20px",
              marginRight: "1rem",
            }}
            onClick={() => {
              navigate("/roundtable/create", {
                state: { rt_page: "record", rtTypes: "", type: "create" },
              });
            }}
          >
            <img src={RecordIcon} alt="" />
            <span className="#63779c" style={{ fontSize: "14px" }}>
              &nbsp;{allWords.rt.opt1 + "/" + allWords.rt.opt2}
            </span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
