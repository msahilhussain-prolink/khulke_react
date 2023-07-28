import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

// Material UI
import { Divider, Menu as CustomMenu, MenuItem } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

// Constants
import { POST_API_BASE_URL } from "../../constants/env";

// Utils
import { moengageEvent } from "../../utils/utils";
import { allWords } from "../../App";

// Redux
import { getPostData } from "../../redux/actions/postAction";

// Components
import PreloginComp from "../PreLoginComp";

// Styles
import "./style.css";

import { ShareOutlined } from "@material-ui/icons";
import ToastHandler from "../../utils/ToastHandler";
import { rtActionData } from "../../redux/actions/roundtableAction/rtAction";

export default function ShareComponent(props) {
  const {
    rt_id,
    rt_nature,
    start,
    anchorEl,
    setAnchorEl,
    open,
    title,
    rt_type,
  } = props;

  const dispatch = useDispatch();

  const rtAction = useSelector((state) => state.rtActionRed.data);

  // Local State
  const [loadingState, setLoadingState] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (loadingState) {
      if (rtAction && rtAction?.data?.status == 200) {
        setLoadingState(false);
        navigator.clipboard
          .writeText(rtAction?.data?.data?.[0]?.url)
          .then(function () {
            ToastHandler("sus", allWords.misc.succcopied);
          })
          .catch(function () {
            ToastHandler("dan", "Failed. try again!");
          });
      }
    }
  }, [rtAction]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);

    moengageEvent("Share", "RoundTable", {
      RoundTableID: rt_id,
      Name: title,
      "K Type": rt_type,
      "K SubType": rt_nature,
      "Audience Interaction": 0,
    });
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopy = () => {
    dispatch(rtActionData({ rt_id: rt_id, action: "SHARE" }));
    setLoadingState(true);
  };

  const handleShare = () => {
    if (!localStorage.current_user && localStorage.anonymous_user) {
      return setModalOpen(true);
    }
    let data = new FormData();
    data.append(
      "message",
      `{"type":"TEXT","text":"${window.location.origin}/roundtable?id=${rt_id}"}`
    );

    const config = {
      method: "post",
      url: `${POST_API_BASE_URL}/post-media`,
      headers: {
        "device-type": "android",
        "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        ToastHandler("sus", "Successfully Posted!");
        dispatch(getPostData());
        setAnchorEl(false);
        handleClose();
      })
      .catch(() => {
        handleClose();
      });
  };

  return (
    <>
      {rt_nature !== "secret" && (
        <small className="rt_share_btn" id="share_button" onClick={handleClick}>
          <ShareOutlined
            id="share_icon_button"
            className="icon"
            style={{ width: "25px", height: "25px" }}
          />{" "}
          {allWords.snip.share}
        </small>
      )}

      <CustomMenu
        className="share_comp"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.32))",
            mt: -3.5,
            ml: -1.3,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div
          style={{
            width: 180,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <MenuItem
            id="copy_button"
            style={{ width: "100%", padding: "0.2rem", margin: "0" }}
            onClick={handleCopy}
          >
            {loadingState ? <CircularProgress /> : null} {allWords.misc.copy}
          </MenuItem>

          <Divider />
          <MenuItem
            id="post_it_button"
            style={{ width: "100%", padding: "0.2rem", margin: "0" }}
            onClick={handleShare}
          >
            {/* Share on Townhall */}
            {allWords.misc.postit}
          </MenuItem>
          {/* TODO: UNCOMMENT WHEN YAPP IS ACTIVATED */}
        </div>
      </CustomMenu>

      <PreloginComp
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        icon={
          <ShareOutlined
            id="share_icon_button"
            className="icon"
            style={{ width: "40px", height: "40px", color: "#f1c40f" }}
          />
        }
        title={"For sharing RoundTable, Login or sign up to Khul Ke"}
        description={""}
      />
    </>
  );
}
