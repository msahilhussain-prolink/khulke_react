import { Grid } from "@material-ui/core";

const RTListSentence = ({sentence}) => (
    <Grid item xl={12} lg={12} sm={12} xs={12}>
    <p
      id="page-title"
      style={{ font: "normal normal 600 20px/24px Work Sans" }}
    >
      {sentence}
    </p>
  </Grid>
)

export default RTListSentence;