import { Button, Grid, Typography } from "@mui/material";
import {
  BROADCAST_PAGE,
  PLATFORMS,
  fetchLinkedAccounts,
  getLinkedAccounts,
} from "../BroadCastUtils/Configs";
import SettingsHeader from "../../../../components/SettingsHeader";
import { useEffect, useState } from "react";
import IndividualPlatforms from "../BroadCastUtils/IndividualPlatform";

export default function ViewBroadCastPage({ setActivePage }) {
  const [linkedAccounts, setLinkedAccounts] = useState(getLinkedAccounts());

  //temporary due to bad response body from api
  const googleAccount = linkedAccounts?.find((item) => item.Google);

  useEffect(async () => {
    await fetchLinkedAccounts();
    setLinkedAccounts(getLinkedAccounts());
  }, []);

  return (
    <>
      <SettingsHeader alternate_title="Broadcast" />
      <Grid
        justifyContent={"space-between"}
        alignItems={"center"}
        flexWrap={"nowrap"}
        display={"flex"}
        sx={{
          maxWidth: "60rem",
        }}
      >
        <Grid>
          <Typography
            sx={{
              font: "normal normal bold 24px/28px Work Sans",
            }}
          >
            Destination
          </Typography>
          <Typography
            sx={{
              font: "normal normal normal 14px/16px Work Sans",
              color: "#63779C",
              marginTop: "0.8rem",
            }}
          >
            Connect your account to Broadcast
          </Typography>
        </Grid>
        <Grid>
          <Button
            onClick={() => {
              setActivePage(BROADCAST_PAGE.ADD);
            }}
            sx={{
              border: "1px solid #63779C",
              borderRadius: "6px",
              font: "normal normal 600 14px/16px Work Sans",
              color: "#63779C",
            }}
          >
            Add a destination
          </Button>
        </Grid>
      </Grid>
      <Grid>
        {/* {once the api response is fixed this will be need to updated} */}
        {googleAccount?.Google ? (
          <Grid>
            <Typography
              sx={{
                marginTop: "2rem",
                font: "normal normal 600 14px/16px Work Sans",
                color: "#63779C",
              }}
            >
              Name
            </Typography>
            <hr />
            <IndividualPlatforms
              name={PLATFORMS.YOUTUBE}
              details={googleAccount?.Google}
              setLinkedAccounts={setLinkedAccounts}
            />
            <hr />
          </Grid>
        ) : (
          <Typography
            sx={{
              font: "normal normal 600 14px/16px Work Sans",
              color: "#63779C",
              marginTop: "2rem",
            }}
          >
            No broadcast destination has been added
          </Typography>
        )}
      </Grid>
    </>
  );
}
