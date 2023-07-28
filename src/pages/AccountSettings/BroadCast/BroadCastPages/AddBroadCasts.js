import { Grid, Typography } from "@mui/material";
import { BROADCAST_PAGE, PLATFORMS } from "../BroadCastUtils/Configs";
import PlatformSignInButton from "../BroadCastUtils/PlatformSignInButton";
import Back from "../../../../assets/icons/back.svg";

export default function AddBroadCastPage({ setActivePage }) {
  return (
    <Grid container>
      <Grid xs={12}>
        <div style={{ display: "flex" }}>
          <img
            style={{ cursor: "pointer" }}
            src={Back}
            alt="back button"
            onClick={() => {
              setActivePage(BROADCAST_PAGE.VIEW);
            }}
          />
          <h3
            style={{
              marginTop: "0.8rem",
              marginLeft: "0.8rem",
              fontSize: "1.5rem",
            }}
          >
            Back
          </h3>
        </div>
        <br />
      </Grid>
      <Grid xs={12}>
        <Typography
          sx={{
            font: "normal normal 600 26px/30px Work Sans",
          }}
        >
          Add destination for Live Stream
        </Typography>
        <Typography
          sx={{
            font: "normal normal normal 14px/16px Work Sans",
            color: "#63779C",
            marginTop: "0.8rem",
          }}
        >
          Connect your account to MeetUp.
        </Typography>
      </Grid>
      <Grid
        xs={12}
        sx={{
          marginTop: "2rem",
        }}
      >
        {Object.keys(PLATFORMS).map((item) => {
          return <PlatformSignInButton name={PLATFORMS[item]} />;
        })}
      </Grid>
    </Grid>
  );
}
