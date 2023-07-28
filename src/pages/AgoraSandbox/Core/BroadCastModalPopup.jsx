import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Dialog,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLiveRTSelectedWildMsg } from "../../../redux/reducers/liveRTReducer";
import { useState } from "react";
import UserProfile from "../../../components/UserProfile";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { updateSelectedWildMsg } from "../../../redux/actions/LiveRT";
import { POST_API_BASE_URL } from "../../../constants/env";
import { AspectRatio } from "@mui/joy";
import { allWords } from "../../../App";
import ToastHandler from "../../../utils/ToastHandler";

const BroadCastModalPopup = () => {
  const dispatch = useDispatch();
  const selectedWildMsg = useSelector(getLiveRTSelectedWildMsg);

  const handleModalClose = () => {
    dispatch(updateSelectedWildMsg(null));
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/post/${selectedWildMsg?.post_id}`)
      .then(
        function () {
          /* clipboard successfully set */
          ToastHandler("sus", allWords.misc.succcopied);
        },
        function () {
          ToastHandler("dan", "Failed. try again!");
        }
      );
  };


  const IconProps = {
    color: "white",
    cursor: "pointer",
  };
  return (
    <Dialog
      sx={{
        position: "absolute",
        zIndex: 97,
        background: 'transparent',
        "& .MuiPaper-elevation":{
          backgroundColor: "transparent",
        }
      }}
      disablePortal
      hideBackdrop={true}
      open={selectedWildMsg}
      onClose={() => {}}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Card>
        <Box
          sx={{
            height: "60px",
            padding: "10px 10px",
            display: "flex",
            background: "#11141CBF",
            opacity: "1",
            alignItems: "center",
            borderBottom: "1px solid #FFFFFF26",
            justifyContent: "space-between",
          }}
        >
          <Box display={"flex"} alignItems={"center"}>
            <UserProfile
              username={selectedWildMsg?.username}
              width="30px"
              height="30px"
              borderRadius="50%"
              className={`profile-circle`}
            />
            <Box sx={{ color: "white", paddingLeft: "5px" }}>
              <Typography variant="body2">{selectedWildMsg?.name}</Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: "12px !important",
                  fontWeight: "400 !important",
                }}
              >
                @{selectedWildMsg?.username}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ alignSelf: "end" }}>
            <Stack direction={"row"} spacing={2}>
              <Box onClick={handleCopy}>
                <ShareOutlinedIcon sx={IconProps} />
              </Box>
              <Box>
                <MoreVertOutlinedIcon sx={IconProps} />
              </Box>
              <Box onClick={handleModalClose}>
                <CloseOutlinedIcon sx={IconProps} />
              </Box>
            </Stack>
          </Box>
        </Box>
        <Box>
          <CardContent
            sx={{
              minWidth: 600,
              minHeight: "auto",
              background: "#11141CBF",
              // opacity: "0.5",
            }}
          >
            <Box>
              <Box sx={{marginBottom: "10px"}}>
                <Typography variant="h6" sx={{ color: "#F4F4F4" }}>
                  {selectedWildMsg?.raw_text}
                </Typography>
              </Box>
              <Stack direction={"row"} spacing={2} sx={{overflowY: "auto"}}>
                {selectedWildMsg?.media?.map((med) => (
                  <AspectRatio sx={{ minWidth: 320, borderRadius: "7px"}}>
                    <img
                      src={`${POST_API_BASE_URL}/post-media/image/${med.name}`}
                      alt="user posted media in comment"
                      width="400"
                      height="100%"
                      style={{ objectFit: "cover" }}
                    />
                  </AspectRatio>
                ))}
              </Stack>
            </Box>
          </CardContent>
        </Box>
      </Card>
    </Dialog>
  );
};

export default BroadCastModalPopup;
