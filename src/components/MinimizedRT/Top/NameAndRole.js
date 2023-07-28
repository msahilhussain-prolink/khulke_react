import { Grid, Typography } from "@mui/material";

export default function NameAndRole({ role, name, style }) {
  return (
    <Grid
      container
      style={{
        position: "absolute",
        bottom: "10px",
        left: "10px",
        ...style,
      }}
    >
      <Typography
        style={{
          padding: "5px",
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0)",
          backdropFilter: "saturate(180%) blur(10px)",
          borderRadius: "5px",
        }}
        variant="span"
      >
        @{name} [{role}]
      </Typography>
    </Grid>
  );
}
