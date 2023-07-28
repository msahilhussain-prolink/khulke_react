import { Button, Grid, Modal, Typography } from "@mui/material";

import { useState } from "react";

import PlatformSignInButton from "../../pages/AccountSettings/BroadCast/BroadCastUtils/PlatformSignInButton";
import {
  PLATFORMS,
  getLinkedAccounts,
} from "../../pages/AccountSettings/BroadCast/BroadCastUtils/Configs";

export default function BroadCastErrorModal({ open, setOpen }) {
  const [linkedAccounts, setLinkedAccounts] = useState(getLinkedAccounts());

  const filteredLinkedAccounts = linkedAccounts.find((item) => item.Google);

  const linkedAccountsChanges = () => {
    setLinkedAccounts(getLinkedAccounts());
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid
        sx={{
          maxWidth: "30rem",
          width: "100%",
          background: "#FFFFFF 0% 0% no-repeat padding-box",
          boxShadow: "6px 6px 20px #00000034",
          border: "1px solid #FFFFFF4D",
          borderRadius: "16px",
          padding: "1rem 2rem",
        }}
        container
        justifyContent={"center"}
      >
        {!filteredLinkedAccounts?.Google?.google_username ? (
          <>
            <Grid item>
              <lottie-player
                src="https://assets3.lottiefiles.com/private_files/lf30_iynlqgqh.json"
                background="transparent"
                speed="1"
                style={{ width: "134px", height: "134px" }}
                loop
                autoplay
                key="sad"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography
                sx={{
                  textAlign: "center",
                  font: "normal normal normal 14px/18px Work Sans",
                  marginTop: "0.8rem",
                }}
              >
                You have not linked your YouTube account. Kindly linked it for
                Broadcast streaming on your YouTube channel.
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              justifyContent={"center"}
              sx={{
                marginTop: "2rem",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {/* {temporary untill api change Will be changed to a dynamic value or loop} */}
              <PlatformSignInButton
                name={PLATFORMS.YOUTUBE}
                updatedLinkedAccounts={linkedAccountsChanges}
              />
            </Grid>
          </>
        ) : (
          <Grid container justifyContent={"center"}>
            <lottie-player
              src="https://assets2.lottiefiles.com/packages/lf20_Ytkepd.json"
              background="transparent"
              speed="1"
              style={{ width: "134px", height: "134px" }}
              loop
              key="success"
              autoplay
            />
            <Grid item xs={12}>
              <Typography
                sx={{
                  font: "normal normal normal 14px/18px Work Sans",
                  textAlign: "center",
                }}
              >
                Congratulations! You have been successfully linked your YouTube
                account for broadcast streaming. kindly proceed for Creating
                your RoundTable
              </Typography>
            </Grid>
            <Grid item>
              <Button
                style={{
                  backgroundColor: "black",
                  marginTop: "1rem",
                  borderRadius: "8px",
                  font: "normal normal medium 16px/19px Work Sans",
                  color: "#FFFFFF",
                  padding: "0.8rem 3rem",
                }}
                onClick={handleClose}
              >
                Close
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Modal>
  );
}
