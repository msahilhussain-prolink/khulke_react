import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { allWords } from "../../App";
import { liveRTExtended, updateExtendDialog } from "../../redux/actions/LiveRT";
import { useDispatch } from "react-redux";

const ExtendRTNotifications = ({
  rtExtended = false,
  timer,
  isShowButton = false,
}) => {
  const dispatch = useDispatch();
  const [notiMsg, setnotiMsg] = useState("");

  useEffect(() => {
    if (rtExtended) {
      setnotiMsg(allWords.misc.livert.ext);
      setTimeout(() => {
        dispatch(liveRTExtended(false));
      }, 5000);
    } else {
      setnotiMsg(allWords.misc.livert.end);
    }
  }, []);

  const extendClick = () => {
    dispatch(updateExtendDialog(true));
  };
  return (
    <Grid
      container
      style={{
        width: "100%",
      }}
      justifyContent="center"
      alignItems="center"
      background="blue"
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        height="100px"
        style={{
          background: `${!rtExtended ? "#F26632" : "#F2C318"}`,
          padding: "15px",
          margin: "5px",
          borderRadius: "6px",
        }}
      >
        <Grid item xs={12}>
          <Typography
            variant="h3"
            style={{
              textAlign: "center",
              font: "normal normal normal 13px/16px Work Sans",
              color: `${!rtExtended ? "#fff" : "#000"}`,
            }}
          >
            {notiMsg}
          </Typography>

          <Typography
            variant="h3"
            style={{
              textAlign: "center",
              font: "normal normal bold 20px/41px Work Sans",
              color: `${!rtExtended ? "#fff" : "#000"}`,
            }}
          >
            {" "}
            {timer} {rtExtended && "mins"}
          </Typography>
          {!rtExtended && isShowButton && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button className="addExntendBtn" onClick={extendClick}>
                {allWords.misc.livert.extentTime}
              </button>
            </div>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ExtendRTNotifications;
