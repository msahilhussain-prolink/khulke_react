import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import "./index.css";
import { globalImages } from "../../../assets/imagesPath/images";
import { Box, Typography } from "@mui/material";
import PreloginComp from "../../../components/PreLoginComp";
import { MEET_UP_BASE_URL } from "../../../constants/env";
import { preRedirectionStyles } from "./preRedirectionStyle";

function PreRedirection() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [hideBox, setHideBox] = useState(false);

  const getUser = () => {
    let current_user = localStorage?.access;
    if (!current_user) {
      setOpen(true);
      setHideBox(true);
      localStorage?.setItem("redirectToMeet", "true");
    } else {
      window.location.replace(
        `${MEET_UP_BASE_URL}/?token=${current_user}&redirect_url=${location?.search}`
      );
      localStorage?.removeItem("redirectToMeet");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="redirectionContainer">
      <Box
        className={hideBox ? "hideContainer" : "animationContainer"}
        boxShadow={3}
      >
        <lottie-player
          src={globalImages.loading}
          background="transparent"
          speed="1"
          style={preRedirectionStyles?.animation}
          loop
          autoplay
        />
        <Typography sx={preRedirectionStyles?.typography}>
          {"Signing In with Khul Ke..."}
        </Typography>
      </Box>
      <PreloginComp
        modalOpen={open}
        setModalOpen={setOpen}
        title={"To Join Khul Ke Meet , Login or sign up to Khul Ke"}
        description={""}
      />
    </div>
  );
}

export default PreRedirection;
