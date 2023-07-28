import { CircularProgress, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { APP_LINKS, IS_ANDROID_OR_IOS } from "../../constants/env";
import { allWords } from "../../App"

export default function UniversalAppPage() {
  const navigate = useNavigate();

  function openApp() {
    window.location.href = APP_LINKS;
  }

  useEffect(() => {
    if (IS_ANDROID_OR_IOS) {
      return openApp();
    }

    return navigate("/");
  }, []);

  return (
    <Grid
      container
      justifyContent={"center"}
      alignItems={"center"}
      height={"100vh"}
    >
      <Grid item xs={12}>
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {allWords.misc.pages.redir}{" "}
          <CircularProgress
            sx={{
              ml: "20px",
            }}
          />
        </Typography>
      </Grid>
    </Grid>
  );
}
