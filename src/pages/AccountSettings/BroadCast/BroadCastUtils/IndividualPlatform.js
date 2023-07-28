import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Avatar,
  Badge,
  CircularProgress,
  Grid,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { PLATFORM_DETAILS, getLinkedAccounts } from "./Configs";
import { handleSignOut } from "./SignOut";

export default function IndividualPlatforms({
  name,
  details,
  setLinkedAccounts,
}) {
  const [loading, setLoading] = useState(false);

  //menu states
  const [anchorEl, setAnchorEl] = useState();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRemoveAccount = () => {
    handleSignOut(name, setLoading);
  };

  useEffect(() => {
    setLinkedAccounts(getLinkedAccounts());
    handleClose();
  }, [loading]);

  return (
    <Grid container justifyContent={"space-between"} alignItems={"center"}>
      <Grid
        item
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Grid item>
          <Badge
            badgeContent={PLATFORM_DETAILS[name].smallIcon}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            overlap="circular"
          >
            <Avatar
              sx={{ marginRight: "0.5rem" }}
              src={details.google_profile_url}
            />
          </Badge>
        </Grid>
        <Grid item>
          <Grid
            sx={{
              font: "normal normal 600 14px/16px Work Sans",
              color: "#63779C",
            }}
          >
            {details.google_username}
          </Grid>
          <Grid
            sx={{
              font: "normal normal normal 12px/14px Work Sans",
              color: "#63779C",
              marginTop: "0.3rem",
            }}
          >
            {PLATFORM_DETAILS[name].name}
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <IconButton onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
      </Grid>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={handleRemoveAccount}
          sx={{ font: "normal normal normal 12px/14px Work Sans" }}
        >
          {loading ? <CircularProgress size={20} /> : "Remove"}
        </MenuItem>
      </Menu>
    </Grid>
  );
}
