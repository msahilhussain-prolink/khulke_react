import * as React from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { Grid, Typography } from "@mui/material";
import { allWords } from "../App"

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbars({
  open,
  redirectUrl,
  handleClose,
}) {
  const appPackageName = navigator.userAgent.match(/android/i)
    ? "com.khulke.app"
    : "com.loktantramediatech.khulke";
  const intentUrl = `intent://${redirectUrl?.split("://")[1]
    }#Intent;scheme=https;package=${appPackageName};end`;
  const storeUrl = navigator.userAgent.match(/android/i)
    ? `https://play.google.com/store/apps/details?id=${appPackageName}`
    : `https://apps.apple.com/in/app/khul-ke-social-networking-app/id1590836834`;

  const handleRedirectClick = () => {
    if (navigator.userAgent.match(/android/i)) {
      try {
        // Try to launch the app using the intent URL  window.location.href = intentUrl;
        window.location.href = intentUrl;
      } catch (error) {
        // If the app is not installed, redirect to the Play Store  window.location.href = storeUrl;
        window.location.href = storeUrl;
      }
    } else if (navigator.userAgent.match(/iphone|ipad|ipod/i)) {
      window.location.href = redirectUrl;

      setTimeout(() => {
        window.location.href = storeUrl;
      }, 1000);
    }
  };

  return (
    <Stack spacing={0} sx={{ width: "100%" }}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Grid sx={{ width: "100%", background: "rgb(102, 185, 132)", p: 1 }}>
          <Typography
            sx={{ fontSize: "1.1rem", fontWeight: "600", color: "#fff" }}
          >
            {allWords.misc.continueonBrowser}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Typography
              components="link"
              variant="h6"
              sx={{
                fontSize: "1.1rem",
                fontWeight: "700",
                color: "rgb(102, 185, 132)",
                cursor: "pointer",
                "&:hover": {
                  fontWeight: "800",
                },
                backgroundColor: "#fff",
                borderRadius: "10px",
                padding: "1px 5px",
              }}
              onClick={handleRedirectClick}
            >
              {allWords.misc.openinApp}
            </Typography>
            <Typography
              components="link"
              variant="h6"
              sx={{
                fontSize: "1.1rem",
                fontWeight: "700",
                color: "#fff",
                cursor: "pointer",
                textDecoration: "underline",
                "&:hover": {
                  fontWeight: "800",
                },
              }}
              onClick={handleClose}
            >
              {allWords.misc.stayinbroweser}
            </Typography>
          </Stack>
        </Grid>
      </Snackbar>
    </Stack>
  );
}
