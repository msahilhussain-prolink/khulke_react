import {
  Dialog as MyDialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import Button from "@mui/material/Button";
import { allWords } from "../../../App";

export default function WildcardConfirmation(props) {
  //props destructuring here
  const { open, confirm, discard } = props;

  return (
    <>
      <MyDialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: "10px",
            maxHeight: "450px",
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          <h3 style={{ textAlign: "center" }}>{allWords.misc.pages.beaw}</h3>
        </DialogTitle>
        <DialogContent>
          {/* <DialogContentText id="alert-dialog-description"> */}
          <h6 style={{ textAlign: "center" }}>{allWords.misc.pages.beawild}</h6>
          {/* </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              style={{
                minWidth: 300,
                minHeight: 60,
                border: "1px solid red",
              }}
              onClick={discard}
            >
              {allWords.misc.no}
            </Button>
            <Button
              style={{
                minWidth: 300,
                minHeight: 60,
                marginTop: "1rem",
                backgroundColor: "black",
                color: "white",
              }}
              onClick={confirm}
            >
              {allWords.misc.yes}
            </Button>
          </div>
        </DialogActions>
      </MyDialog>
    </>
  );
}
