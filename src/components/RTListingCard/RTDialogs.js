import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { allWords } from "../../App";

// Components
import ACRDialog from "../ACRDialog";
import ActionDialog from "../ActionDialog";
import DialogList from "../DialogList";
import Dialog from "../LeftSideBar/Dialog";
import DialogSI from "@mui/material/Dialog";
import InviteBy from "../InviteBy";
import SearchInviteDialog from "../SearchInviteDialog";
import PreloginComp from "../PreLoginComp";
import ConfirmationDialog from "../ConfirmationDialog";

// Assets
import RoundTableIconActive from "../../assets/icons/RoundTable_icon_active.svg";
import { REACT_APP_BASE_URL_FOR_ROUNDTABLE } from "../../constants/env";
import axios from "axios";
import { auto_login_continue, moengageEvent } from "../../utils/utils";
import ToastHandler from "../../utils/ToastHandler";
import { ScheduleOutlined } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    height: "800px",
    borderRadius: "1rem",

    "& .MuiDialogContent-root": {
      borderTop: "Transparent",
      borderBottom: "Transparent",
    },
  },
  root: {
    "& .MuiGrid-root": {
      marginTop: "-6px",
    },
  },
}));

export default function RTDialogs(props) {
  const {
    open_acr,
    setOpenACR,
    rt_details,
    open_action,
    setOpenAction,
    inviteby,
    setInviteBy,
    scroll,
    invite_by,
    inviteBySkip,
    setInviteBySkip,
    nt_id,
    search_invite,
    setSearchInvite,
    speakers,
    moderator,
    setVisitorId,
    inviteFollower,
    setEmail,
    setPhone,
    notify_box,
    setNotifyBox,
    notification_text,
    modalOpen,
    setModalOpen,
    titleType,
    setTitleType,
    setReminderStatus,
    rt_id,
    btnFlag,
    setBtnFlag,
    btnData,
    setRequestAccess,
    title,
    r_type,
    rt_nature,
  } = props;

  const classes = useStyles();

  const handleCloseSIIB = () => {
    setInviteBy(false);
  };

  const handleCloseSI = () => {
    setSearchInvite(false);
  };

  const handleSetReminder = async (type) => {
    if (!localStorage.current_user && localStorage.anonymous_user) {
      setModalOpen(true);
      setTitleType("set_reminder");
      return;
    }

    let config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/set-reminder`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ roundtable_id: rt_id }),
    };
    await axios(config)
      .then(async (res) => {
        if (res.data.status === 200) {
          setBtnFlag(false);
          setReminderStatus(true);

          ToastHandler("info", allWords.misc.notifywhenready);

          moengageEvent("Set Reminder", "RoundTable", {
            RoundTableID: rt_id,
            Name: title,
            "K Type": r_type,
            "K SubType": rt_nature,
            "Audience Interaction": 0,
          });
        } else {
          setBtnFlag(false);
          setReminderStatus(false);
        }
      })
      .catch(async (err) => {
        const res = err.response;
        if (!res) {
          setBtnFlag(false);
          return setReminderStatus(false);
        }

        if (res.status === 401) {
          return await auto_login_continue(handleSetReminder);
        }
        setBtnFlag(false);
        setReminderStatus(false);
      });
  };

  const handleRequestAccess = async (type) => {
    const FormData = require("form-data");
    const data = new FormData();

    let requestValue = {
      roundtable_id: rt_id,
      type: "SEEK-INVITATION",
    };

    data.append("data", JSON.stringify(requestValue));

    const config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/seek-invitation/`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
      },
      data: data,
    };

    await axios(config)
      .then(async function (response) {
        if (response.status === 200 || response.status === 253) {
          setBtnFlag(false);
          setRequestAccess(true);
          moengageEvent("Request Access", "RoundTable", {
            RoundTableID: rt_id,
            Name: title,
            "K Type": r_type,
            "K SubType": rt_nature,
            "Audience Interaction": 0,
          });
        } else {
          setRequestAccess(false);
          setBtnFlag(false);
        }
      })
      .catch(async function (error) {
        const response = error.response;

        if (!response) {
          setRequestAccess(false);
          setBtnFlag(false);
          return;
        }

        if (response.status == 401) {
          return auto_login_continue(handleRequestAccess);
        }

        setRequestAccess(false);
        setBtnFlag(false);
      });
  };

  return (
    <>
      <DialogList
        title={"RoundTable"}
        open={open_acr}
        setOpen={setOpenACR}
        onCloseBtnClick={() => {
          setOpenACR(false);
        }}
      >
        <ACRDialog data={rt_details} />
      </DialogList>

      <Dialog
        title={"RoundTable"}
        open={open_action}
        setOpen={setOpenAction}
        onCloseBtnClick={() => {
          setOpenAction(false);
        }}
      >
        <ActionDialog rt_details={rt_details} handleClose={setOpenAction} />
      </Dialog>

      {/* Invite By Dialog */}
      <DialogSI
        classes={{ paper: classes.dialogPaper }}
        open={inviteby}
        onClose={handleCloseSIIB}
        maxWidth="md"
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <InviteBy
          inviteby={inviteby}
          scroll={scroll}
          setInviteBy={setInviteBy}
          invite_by={invite_by}
          inviteBySkip={inviteBySkip}
          setInviteBySkip={setInviteBySkip}
          nt_id={nt_id}
        />
      </DialogSI>

      {/* Search and Invite Dialog */}
      <DialogSI
        classes={{ paper: classes.dialogPaper }}
        open={search_invite}
        onClose={handleCloseSI}
        // maxWidth="md"
        fullWidth
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <SearchInviteDialog
          search_invite={search_invite}
          scroll={scroll}
          setSearchInvite={setSearchInvite}
          speakers={speakers}
          moderator={moderator}
          setVisitorId={setVisitorId}
          inviteFollower={inviteFollower}
          setEmail={setEmail}
          setPhone={setPhone}
        />
      </DialogSI>

      <Dialog
        id="dialog_not_button"
        title={"RoundTable"}
        open={notify_box}
        setOpen={setNotifyBox}
        onCloseBtnClick={() => {
          setNotifyBox(false);
        }}
      >
        <div className="container text-center py-5">
          <small>
            {" "}
            <strong className="text-muted">{notification_text}</strong>{" "}
          </small>
        </div>
      </Dialog>

      <ConfirmationDialog
        open={btnFlag}
        setOpen={setBtnFlag}
        msg={btnData?.msg}
        custom_yes={() => {
          if (btnData?.type === "reminder_set") {
            handleSetReminder("yes");
          }

          if (btnData?.type === "request_access") {
            handleRequestAccess("yes");
          }
        }}
        custom_no={() => {
          setBtnFlag(false);
        }}
      />

      <PreloginComp
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        icon={
          titleType === "set_reminder" ? (
            <ScheduleOutlined
              className="icon"
              style={{
                alignSelf: "center",
                color: "#f1c40f",
                fontSize: "40px",
              }}
            />
          ) : titleType === "request_access" ? (
            <img src={RoundTableIconActive} alt="" width={40} height={40} />
          ) : null
        }
        title={
          titleType === "set_reminder"
            ? "For set reminder, Login or sign up to Khul Ke"
            : titleType === "request_access"
            ? "For request access, Login or sign up to Khul Ke"
            : ""
        }
        description={""}
      />
    </>
  );
}
