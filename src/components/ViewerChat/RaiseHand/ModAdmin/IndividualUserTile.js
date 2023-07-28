import { Grid, Menu, MenuItem, Typography, Button, Badge } from "@mui/material";

import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { ToggleHandSelf } from "../ApiCalls/Audience/ControlHand";
import ConfirmatioNmodal from "../ConfirmationModal";
import { deleteAllMessage } from "../ApiCalls/Audience/ControlMessage";
import { rt_id } from "../../../../pages/AgoraSandbox/settings";
import ToastHandler from "../../../../utils/ToastHandler";
import UserProfile from "../../../UserProfile";

export default function IndividualUserTile(props) {
  //props destructuring here
  const {
    item,
    setUsers,
    setOpenMessages,
    setActiveuser,
    rtm_channel,
    unseenUsersMessage,
  } = props;

  //useStates here
  const [anchorEl, setAnchorEl] = useState();
  const [openConfirmation, setOpenConfirmation] = useState(false);

  //refs here
  const _3dotsRef = useRef();

  //3 dots menu state here
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  //functions here
  const lowerHand = async () => {
    const deleted = await deleteAllMessage({
      roundtable_id: rt_id,
      user_id: item.action_on,
    });

    if (!deleted) {
      return ToastHandler("dan", "Some unexpected error occured, try again.");
    }

    const response = await ToggleHandSelf(item.action_on);
    if (!response) return;
    setUsers((prev) =>
      prev.filter((elem) => {
        return elem.action_on !== item.action_on;
      })
    );
    rtm_channel?.sendMessage({
      text: `wildcard_req_dismiss||${item.username}`,
    });
    setOpenMessages(false);
    setOpenConfirmation(false);
    setActiveuser();
  };

  return (
    <>
      <Grid
        container
        alignItems="center"
        style={{
          marginBottom: "50px",
          cursor: "pointer",
          height: "fit-content",
        }}
        onClick={(e) => {
          if (
            e.target.id === "username" ||
            e.target.id === "_3dots" ||
            e.target.id === "dismiss_button" ||
            _3dotsRef.current.contains(e.target)
          )
            return;

          setOpenMessages(true);

          setActiveuser(item);
        }}
      >
        <Grid item>
          <Badge
            color="secondary"
            variant="dot"
            invisible={!unseenUsersMessage.includes(item?.username)}
          >
            <UserProfile
              username={item?.username}
              width="45px"
              height="45px"
              borderRadius="0.5rem"
            />
          </Badge>
        </Grid>
        <Grid
          item
          style={{
            marginLeft: "10px",
          }}
        >
          <Typography
            style={{
              textTransform: "capitalize",
              fontSize: "1rem",
              fontWeight: "bold",
              color: "black",
            }}
          >
            {item?.name}
          </Typography>
          <Typography
            style={{
              fontFamily: `"Work Sans",sans-serif`,
              padding: "0px",
              wordWrap: "break-word",
              whiteSpace: "pre-wrap",
              color: "black",
            }}
          >
            <Link
              to={`/profile/${item?.username}/posts`}
              style={{
                textDecoration: "none",
              }}
              target="_blank"
              id="username"
            >
              @{item?.username}
            </Link>
          </Typography>
        </Grid>
        <Grid
          item
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginLeft: "auto",
          }}
          id="_3dots"
          ref={_3dotsRef}
        >
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            style={{
              minWidth: "0px",
            }}
          >
            <MoreVertIcon />
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={() => {
                setOpenMessages(true);
                setActiveuser(item);
                handleClose();
              }}
            >
              View Messages
            </MenuItem>
            <MenuItem
              onClick={() => setOpenConfirmation(true)}
              id="dismiss_button"
            >
              Dismiss
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>
      <ConfirmatioNmodal
        modalState={openConfirmation}
        closeModal={() => setOpenConfirmation(false)}
        confirmed={() => {
          lowerHand();
          handleClose();
        }}
      />
    </>
  );
}
