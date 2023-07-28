import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import bell from "../../assets/gif/bell.gif";
import success from "../../assets/gif/success.gif";

import "./style.css";
import { Grid } from "@mui/material";
import ButtonComponent from "../ButtonComponent";
import axios from "axios";
import { auto_login_continue } from "../../utils/utils";
import { REACT_APP_BASE_URL_FOR_NOTIFICATION } from "../../constants/env";
import { useDispatch } from "react-redux";
import { ExpandRoundtable } from "../../redux/actions/minimizedRoundtable";
import { allWords } from "../../App"

const SimpleModalComponent = ({
  openPopup,
  setOpenPopup,
  leaveChannel,
  rtId,
  isMinimized = false,
}) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    borderRadius: "10px",
    p: 2,
  };

  // true - defaultui of bell , false - newui with success msg
  const [ui, setUi] = useState(true);

  const dispatch = useDispatch();

  const setRecordingNotification = async (rtId) => {
    let data = JSON.stringify({
      rtId,
    });

    let config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_NOTIFICATION}/notify-me`,
      data: data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    };

    return await axios(config)
      .then((res) => res)
      .catch(async (err) => {
        const res = err.response;
        if (!res) return;
        if (res.status === 401) {
          return await auto_login_continue(setRecordingNotification(rtId));
        }
        return res;
      });
  };

  const btnOneHandler = () => {
    setRecordingNotification(rtId).then((res) => {
      setUi(false);
    });

    setTimeout(() => {
      setOpenPopup(false);
      setUi(true);
      leaveChannel(false);
      if (isMinimized) {
        dispatch(ExpandRoundtable());
      }
    }, 5000);
  };

  const btnTwoHandler = () => {
    leaveChannel(false);
    if (isMinimized) {
      dispatch(ExpandRoundtable());
    }
  };

  const uiOneToShow = () => (
    <div>
      <Box sx={style} className="simpleModalMain">
        <Grid container className="justify-content-center">
          <img src={bell} alt="bell-icon" className="rtBell" />
        </Grid>
        <Typography id="modal-modal-description" className="modalText">
          {allWords.misc.receivenotiq}
        </Typography>
        <Grid container className="btnMainModal">
          <ButtonComponent btnText={allWords.misc.livert.notifyMe} btnFunction={btnOneHandler} />
        </Grid>
        <Grid container className="justify-content-center mt-2">
          <p className="skipBtn" onClick={btnTwoHandler}>
            {allWords.misc.skip}
          </p>
        </Grid>
      </Box>
    </div>
  );

  const uiTwoToShow = () => (
    <div>
      <Box sx={style} className="simpleModalMain">
        <Grid container className="justify-content-center">
          <img src={success} alt="success-icon" style={{ width: "15rem" }} />
          <Typography color="#fff" fontSize="24px" textAlign="center">
            {allWords.misc.greatline}
          </Typography>
        </Grid>
      </Box>
    </div>
  );

  return (
    <div>
      <Modal
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {ui ? uiOneToShow() : uiTwoToShow()}
      </Modal>
    </div>
  );
};

export default SimpleModalComponent;
