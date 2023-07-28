import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

import React, { useEffect, useState } from "react";
import { returnMinString, returnSecondString } from "../../../utils/timeutils";
import { isNaN } from "lodash";

const TimerLoader = ({ timerLoaderRef }) => {
  const [showLoader, setShowLoader] = useState(false);
  const [timer, settimer] = useState(14);

  useEffect(() => {
    const timerInt = setInterval(() => {
      if (showLoader) {
        settimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }
    }, 1000);
    return () => {
      clearInterval(timerInt);
    };
  }, [showLoader]);

  useEffect(() => {
    if (timer === 1) {
      setTimeout(() => {
        setShowLoader(false);
      }, 1000);
    }
  }, [timer]);

  useEffect(() => {
    if (timerLoaderRef.current) {
      const timeRemaining = returnMinString(
        timerLoaderRef.current?.timeRemaining
      );
      const timeSecRemaining = returnSecondString(
        timerLoaderRef.current?.timeRemaining
      );
      if (
        timeRemaining === 0 &&
        timeSecRemaining < 16 &&
        timer &&
        !showLoader
      ) {
        settimer(timeSecRemaining);
        setShowLoader(true);
      }
    }
  }, [timerLoaderRef.current?.timeRemaining]);

  const time = Math.round(
    returnSecondString(timerLoaderRef.current?.timeRemaining)
  );

  return (
    <>
      {showLoader && (
        <Backdrop
          sx={{
            position: "absolute",
            color: "#fff",
            zIndex: (theme) => 998,
            opacity: "0.5",
            '& .MuiBackdrop-root': {
              opacity: "0.5 !important"
            }
          }}
          open={true}
          onClick={() => {}}
        >
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
              variant="determinate"
              value={(timer / 15) * 100}
              sx={{
                height: "40vh !important",
                width: "40vh !important",
                color: "#fff",
                "& .MuiCircularProgress-root": {
                  opacity: "1 !important",
                  background: "black",
                  borderRadius: "50%"
                }
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {timer > 1 ? (
                <Typography
                  variant="caption"
                  component="div"
                  color="#fff"
                  sx={{ fontSize: "2.5rem", fontWeight: "600" }}
                >
                  {`${isNaN(time) ? timer :time}`}
                </Typography>
              ) : (
                <Typography
                  variant="caption"
                  component="div"
                  color="red"
                  sx={{ fontSize: "2.5rem", fontWeight: "600" }}
                >
                  Going LIVE
                </Typography>
              )}
            </Box>
          </Box>
        </Backdrop>
      )}
    </>
  );
};

export default TimerLoader;
