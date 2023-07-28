import { Button, Grid, Modal, Paper, Typography } from "@mui/material";

export default function ConfirmatioNmodal(props) {
  const { closeModal, confirmed, modalState } = props;

  return (
    <>
      <Modal
        onClose={closeModal}
        open={modalState}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={5}
          style={{
            borderRadius: "10px",
            backgroundColor: "white",
            padding: "10px",
            maxWidth: "500px",
          }}
        >
          <Grid container>
            <Grid
              item
              xs={12}
              style={{
                textAlign: "center",
              }}
            >
              <Typography variant="p">
                Are you sure you want to remove this user from raise Hand list?
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "50px",
                padding: "0px 20px",
              }}
            >
              <Button
                variant="contained"
                style={{
                  backgroundColor: "black",
                  width: "40%",
                }}
                onClick={closeModal}
              >
                Discard
              </Button>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "black",
                  width: "40%",
                }}
                onClick={confirmed}
              >
                Confirm
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    </>
  );
}
