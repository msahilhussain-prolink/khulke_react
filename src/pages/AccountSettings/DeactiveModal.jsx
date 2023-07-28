import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import axios from "axios";
import { REACT_APP_BASE_URL_FOR_USER } from "../../constants/env.js";
import ToastHandler from "../../utils/ToastHandler";
import logoutUser from "../../apis/logoutUser";
import { moengageEvent } from "../../utils/utils.js";
import { allWords } from "../../App";
import logger from "../../logger/index.js";

const style = {
  position: "absolute",
  top: "45%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 480,
  bgcolor: "background.paper",
  border: "2px solid #d2d2d2",
  boxShadow: 24,
  //   height: "250px",
  p: 4,
  borderRadius: "12px",
};

export default function BasicModal({ open, handleOpen, handleClose }) {
  const [secondScreen, setSecondScreen] = React.useState(false);

  React.useEffect(() => {
    if (secondScreen) {
      setTimeout(() => {
        logoutUser();
      }, 2000);
    }
    // return () => {}
  }, [secondScreen]);

  async function deactivateFunc(e) {
    e.preventDefault();
    let data = JSON.stringify({
      user_id: JSON.parse(localStorage.getItem("current_user"))["_id"],
      platform: "web",
      device_name: "",
      platform_version:
        navigator?.userAgentData?.platform || "Windows Fallback",
    });

    let url = `${REACT_APP_BASE_URL_FOR_USER}/setting/account-deactivate/`;
    var config = {
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
      data,
    };

    try {
      let result = await axios(config);
      if (result.data.status == 200) {
        if (result.data.message == allWords.misc.deactiveModal.desuccess) {
          setSecondScreen(true);
          moengageEvent("Deactivate Account", "User");
        } else if ((result.data.message = "Your Account already deactivated")) {
          await ToastHandler("dan", result.data.message);
          // handleClose(false);
        }
      } else {
        ToastHandler("dan", "something went wrong");
      }
    } catch (error) {
      logger.error(error);
      ToastHandler("dan", "something went wrong");
    }
  }

  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {secondScreen ? (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 2rem",
                fontSize: "1.2rem",
                fontFamily: "Work Sans",
              }}
            >
              {allWords.misc.deactiveModal.desuccess}
            </div>
          ) : (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {allWords.misc.deactiveModal.areyousure}
              </Typography>
              <div
                style={{
                  //   border: "1px solid red",
                  display: "flex",
                  justifyContent: "space-around",
                  paddingTop: "3rem",
                }}
              >
                <Stack spacing={2} direction="row">
                  <Button
                    onClick={(e) => deactivateFunc(e)}
                    variant="contained"
                    sx={{
                      padding: "0.6rem 3rem",
                      background: "#54B798",
                      color: "white",
                      width: "40%",
                    }}
                  >
                    {allWords.misc.deactiveModal.yes}
                  </Button>
                  <Link
                    to={"/account_settings"}
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        padding: "0.6rem 3rem",
                        background: "#F15B29",
                        color: "white",
                        textDecoration: "none",
                      }}
                    >
                      {allWords.misc.deactiveModal.no}
                    </Button>
                  </Link>
                </Stack>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}
