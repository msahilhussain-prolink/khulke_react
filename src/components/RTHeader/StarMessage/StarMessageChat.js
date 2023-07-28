import { makeStyles } from "@material-ui/core";
import { useEffect, useRef } from "react";
import AllPosts from "../../../pages/AgoraSandbox/AudienceInteraction/AllPosts";
import { rt_id } from "../../../pages/AgoraSandbox/settings";
import DialogChat from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import logger from "../../../logger";

const useStylesStar = makeStyles({
  dialog: {
    position: "absolute",
    border: "1px solid #E4E9F0",
    borderRadius: "10px",
  },
});

export default function StarMessageChat(props) {
  //props destructuring here

  const {
    openS,
    handleCloseStar,
    scroll,
    post_id_list,
    role,
    setPostIdList,
    rtm_channel,
    allPost,
    handle_wildcard_removal,
    mod_pan_list,
    wc_uids,
    style,
  } = props;

  //refs here
  const descriptionElementRefStar = useRef(null);

  //side effects here
  useEffect(() => {
    if (openS) {
      const { current: descriptionElement } = descriptionElementRefStar;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [openS]);

  //constants here
  const classesStar = useStylesStar();
  let current_user = null;
  try {
    current_user = JSON.parse(localStorage.getItem("current_user"));
  } catch (err) {
    logger.error("Not found current user in Star Message Chat", err);
  }

  return (
    <DialogChat
      open={openS}
      onClose={handleCloseStar}
      maxWidth="xs"
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      classes={{
        paper: classesStar.dialog,
      }}
      PaperProps={{
        style: style,
      }}
    >
      <h6
        style={{
          color: "#000000",
          fontSize: "16px",
          fontWeight: "bold",
          padding: "16px 25px",
        }}
      >
        Starred
      </h6>
      <DialogContent
        dividers={scroll === "paper"}
        style={{
          minWidth: 440,
          height: 471,
          padding: "0px 5px 16px 5px",
        }}
      >
        <DialogContentText
          id="scroll-dialog-description"
          ref={descriptionElementRefStar}
          tabIndex={-1}
        >
          <>
            <div
              // className="viewers_chat_container"
              style={{
                // width: 411,
                // height: 460,
                display: "flex",
                flexDirection: "column",
                padding: "0.7rem",
              }}
            >
              {post_id_list.length > 0 && (
                <AllPosts
                  current_user={current_user}
                  rtm_channel={rtm_channel}
                  rt_id={rt_id}
                  role={role}
                  wc_uids={wc_uids}
                  handle_wildcard_removal={handle_wildcard_removal}
                  before_star
                  star_viewer
                  post_id_list={post_id_list}
                  setPostIdList={setPostIdList}
                  mod_pan_list={mod_pan_list}
                  hideIconContainer
                  interactionData={[...post_id_list]
                    .reverse()
                    .map((elem) => {
                      let item = allPost.find((item) => {
                        return item.post_id === elem && item.is_deleted !== 1;
                      });

                      return item;
                    })
                    .filter((elem) => elem)}
                />
              )}
            </div>
          </>
        </DialogContentText>
      </DialogContent>
    </DialogChat>
  );
}
