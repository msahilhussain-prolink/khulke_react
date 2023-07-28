import { CircularProgress, Icon, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import handleSignIn from "./SignIn";
import { PLATFORM_DETAILS, getLinkedAccounts } from "./Configs";
import { handleSignOut } from "./SignOut";

export default function PlatformSignInButton({ name, updatedLinkedAccounts }) {
  const [loading, setLoading] = useState(false);
  const [linkedAccounts, setLinkedAccounts] = useState(getLinkedAccounts());

  //temporarily untill api fixes there response
  const googleAccount = linkedAccounts.find((item) => item.Google);

  const handlePlatformSignIn = () => {
    handleSignIn(name, setLoading);
  };

  const handlePlatformSignOut = () => {
    handleSignOut(name, setLoading);
  };

  useEffect(() => {
    const newLinkedAccounts = getLinkedAccounts();

    if (updatedLinkedAccounts) {
      updatedLinkedAccounts(newLinkedAccounts);
    }

    setLinkedAccounts(newLinkedAccounts);
  }, [loading]);

  return (
    <IconButton
      disableFocusRipple={true}
      style={{
        border: "1px solid #464646",
        borderRadius: "41px",
        fontSize: "15px",
        fontWeight: "bold",
        color: "black",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        flexWrap: "nowrap",
        width: "fit-content",
        minWidth: "100px",
      }}
      disabled={loading}
      onClick={
        googleAccount?.Google ? handlePlatformSignOut : handlePlatformSignIn
      }
    >
      {!loading ? (
        <>
          <Icon
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {PLATFORM_DETAILS[name].icon}
          </Icon>
        </>
      ) : (
        <CircularProgress size={20} />
      )}
      <span
        style={{
          marginLeft: "10px",
          font: "normal normal 600 18px/21px Work Sans",
        }}
      >
        {googleAccount?.Google ? "Remove " : "Add "}
        {updatedLinkedAccounts
          ? PLATFORM_DETAILS[name].longDisplayName
          : PLATFORM_DETAILS[name].shortDisplayName}
      </span>
    </IconButton>
  );
}
