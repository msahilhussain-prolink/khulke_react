import { Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import IndividualUserTile from "./IndividualUserTile";
import UserMessages from "./UserMessages";
import { allWords } from "../../../../App"

export default function ModAdminRaiseChat(props) {
  //props destructuring here
  const {
    setHandRaisedParent,
    rtm_channel,
    handle_wildcard_removal,
    users,
    setUsers,
    unseenUsersMessages,
    setUnseenUserMessages,
    showMessages,
    setShowMessages,
    activeUser,
    setActiveUser,
  } = props;

  //effects here
  useEffect(() => {
    setHandRaisedParent(false);
    return () => {
      setHandRaisedParent(false);
    };
  }, [users, setHandRaisedParent]);

  useEffect(() => {
    setActiveUser();
    setShowMessages(false);
  }, []);

  return (
    <>
      <Grid
        item
        style={{
          backgroundColor: "#f5f5f5",
          borderRadius: "10px 10px 0px 0px",
        }}
      >
        <Typography
          style={{
            fontSize: "1.05rem",
            fontWeight: "bold",
            fontFamily: "'Work Sans',sans-serif",
            padding: "10px 20px",
          }}
        >{allWords.misc.livert.raisehand}

        </Typography>
      </Grid>
      <Grid
        container
        style={{
          height: "calc(60vh + 70px)",
          overflowY: "auto",
          padding: "20px",
          paddingTop: showMessages ? "0px" : "20px",
        }}
      >
        {showMessages && (
          <UserMessages
            item={activeUser}
            setOpenMessages={setShowMessages}
            setUsers={setUsers}
            rtm_channel={rtm_channel}
            handle_wildcard_removal={handle_wildcard_removal}
            setUnseenUserMessages={setUnseenUserMessages}
          />
        )}

        {!showMessages && users?.length === 0 ? (
          <Grid
            item
            xs={12}
            style={{
              height: "200px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              variant="p"
              style={{
                fontSize: "18px",
                textAlign: "center",
                width: "100%",
              }}
            >
              No users has raised hands yet
            </Typography>
          </Grid>
        ) : (
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            style={{
              height: "fit-content",
            }}
          >
            {!showMessages &&
              users?.map((item) => (
                <IndividualUserTile
                  item={item}
                  setUsers={setUsers}
                  rtm_channel={rtm_channel}
                  handle_wildcard_removal={handle_wildcard_removal}
                  setOpenMessages={setShowMessages}
                  openMessages={showMessages}
                  setActiveuser={setActiveUser}
                  unseenUsersMessage={unseenUsersMessages}
                />
              ))}
          </Grid>
        )}
      </Grid>
    </>
  );
}
