import React from "react";
import { useDispatch } from "react-redux";
import { toggleSignUpFlag } from "../../redux/actions/compActions";

import { Button, Dialog, DialogContent, Typography } from "@mui/material";

export default function SuccessDialog(props) {
  const { open, setOpen, text1, msg, text2, fromHome = false } = props;

  const dispatch = useDispatch();
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
        <DialogContent style={{ minWidth: 550 }}>
          <div className="text-center container-fluid p-5">
            <div style={{ textAlign: "-webkit-center" }}>
              <lottie-player
                src={
                  fromHome === false
                    ? "https://assets8.lottiefiles.com/temp/lf20_PRvG5R.json"
                    : "https://assets5.lottiefiles.com/packages/lf20_36zspn0e.json"
                }
                background="transparent"
                speed="1"
                style={{ width: "300px", height: "300px", margin: "auto" }}
                loop
                autoplay
              ></lottie-player>
            </div>
            <Typography
              sx={{
                fontSize: "2rem",
                fontWeight: "bold",
              }}
            >
              Congratulations!
            </Typography>
            <Typography
              sx={{
                fontSize: "2rem",
                color: "#ed4d29",
              }}
            >
              {text1}
            </Typography>
            <Typography
              sx={{
                fontSize: "1.5rem",
                padding: fromHome === true ? "1.5rem" : "",
              }}
            >
              {msg}
            </Typography>
            {text2 && (
              <>
                <Typography
                  sx={{
                    fontSize: "1.5rem",
                  }}
                >
                  Your username is secured for next <b>30 days</b>.
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1.5rem",
                  }}
                >
                  You can anytime restore previous username <br /> Within this{" "}
                  <b>30 days</b>.
                </Typography>
              </>
            )}

            {fromHome === true && (
              <Button
                onClick={() => {
                  setOpen(false);
                  dispatch(toggleSignUpFlag(true));
                }}
                style={{
                  height: "fit-Content",
                  width: "80%",
                  backgroundColor: "#1A1A1A",
                  borderRadius: "8px",
                  color: "white",
                  padding: "15px 0px",
                  opacity: "1",
                }}
              >
                OK
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
