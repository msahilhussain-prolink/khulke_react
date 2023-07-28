import React from "react";
import {
  Dialog,
  DialogContent,
  Hidden,
  IconButton,
  Typography,
} from "@mui/material";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { MOBILE_VIEW } from "../../constants/env";
import { CancelOutlined } from "@material-ui/icons";
import { allWords } from "../../App";

export default function PreloginModal(props) {
  const {
    open,
    setOpen,
    src,
    component,
    btn_component,
    txt1,
    txt2,
    setLoginComp,
    setSignupComp,
    header,
    container,
    extraComp,
  } = props;

  const navigate = useNavigate();
  const redirectToMeet = localStorage?.getItem("redirectToMeet");

  const closePreLogin = () => {
    setOpen(false);
    setLoginComp(false);
    setSignupComp(false);
    if (extraComp) {
      navigate("/roundtable/all");
    }
  };

  return (
    <>
      <Dialog
        open={open}
        maxWidth="sm"
        onClose={() => {
          if (extraComp || redirectToMeet === "true") return;
          setOpen(false);
        }}
        PaperProps={{
          style: {
            borderRadius: "0.8rem",
            minWidth: MOBILE_VIEW
              ? "90%"
              : header !== undefined
              ? "670px"
              : "550px",
            maxWidth: MOBILE_VIEW
              ? "90%"
              : header !== undefined
              ? "670px"
              : "600px",
            height: "fit-content",
            margin: MOBILE_VIEW ? "auto" : "",
          },
        }}
      >
        {extraComp}
        <DialogContent
          style={{
            maxWidth:
              header === undefined
                ? txt1 !== "Log in or sign up to interact."
                  ? "430px"
                  : "450px"
                : "",
            minWidth: MOBILE_VIEW
              ? 0
              : header === "RoundTable Details"
              ? 670
              : 450,
            margin: MOBILE_VIEW ? 0 : "auto",
            overflowX: "hidden",
            overflowY: MOBILE_VIEW ? "auto" : "hidden",
            width: "100%",
          }}
        >
          <div
            id="close_div_button"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p style={{ fontWeight: "bold", fontSize: "24px" }}>{header}</p>
            {redirectToMeet !== "true" && (
              <IconButton
                id="close_button"
                onClick={closePreLogin}
                className={"icon_button"}
              >
                <CancelOutlined id="cross_icon_button" />
              </IconButton>
            )}
          </div>
          {container}
          <div className="text-center container-fluid px-3 pb-3">
            <div style={{ textAlign: "-webkit-center" }}>{src}</div>
            <div
              style={{
                textAlign: "left",
                marginLeft: MOBILE_VIEW
                  ? 0
                  : txt1 === allWords.misc.pages.prelogin.mtext
                  ? "0rem"
                  : "0",
                width: MOBILE_VIEW
                  ? "100%"
                  : txt1 === allWords.misc.pages.prelogin.mtext
                  ? "100%"
                  : "100%",
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  textAlign:
                    txt1 === allWords.misc.pages.prelogin.mtext
                      ? "start"
                      : "center",
                  width: MOBILE_VIEW
                    ? "100%"
                    : txt1 === allWords.misc.pages.prelogin.mtext
                    ? "100%"
                    : "100%",
                }}
              >
                {txt1}
              </Typography>
              <Typography
                sx={{
                  fontSize: "1rem",
                  width: "22rem",
                  paddingTop: "8px",
                }}
              >
                {txt2}
              </Typography>

              {component}

              {btn_component}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
