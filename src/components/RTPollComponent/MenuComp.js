import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch } from "react-redux";
import { MenuItem, Menu as CustomMenu } from "@mui/material";
import RoundTableIconActive from "../../assets/icons/RoundTable_icon_active.svg";
import { getPostData, postDeleteData } from "../../redux/actions/postAction";
import PreloginComp from "../PreLoginComp";
import { allWords } from "../../App"
export default function MenuComp(props) {
  const { username, post_id, setPollFlag } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/post/${post_id}`)
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

  return (
    <>
      {username ===
        JSON.parse(localStorage.current_user || localStorage.anonymous_user)[
        "username"
        ] ||
        username ===
        JSON.parse(localStorage.current_user || localStorage.anonymous_user)[
        "username"
        ] ? (
        <MoreVertIcon
          aria-controls="basic-menu"
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          style={{
            color: "#fff",
            marginLeft: "3.5rem",
            ...props.customStyle,
          }}
        />
      ) : null}

      <CustomMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          justifyContent: "left",
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.32))",
            mt: 1.5,

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
              right: 13,
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
            width: 200,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {JSON.parse(localStorage.current_user || localStorage.anonymous_user)[
            "username"
          ] === username && (
              <>
                <MenuItem
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    margin: "0",
                  }}
                  onClick={() => {
                    handleClose();
                    setPollFlag(false);
                    dispatch(postDeleteData(post_id, "post", true));
                    dispatch(getPostData(20));
                  }}
                >
                  {allWords.misc.livert.del}
                </MenuItem>
              </>
            )}
        </div>
      </CustomMenu>

      <PreloginComp
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        icon={<img src={RoundTableIconActive} alt="" width={40} height={40} />}
        title={"To Copy a Link, Login or sign up to Khul Ke"}
        description=""
      />
    </>
  );
}
