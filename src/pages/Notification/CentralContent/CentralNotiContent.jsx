import { Grid, Typography } from "@mui/material";
import React from "react";
import MoreHorizSharpIcon from "@mui/icons-material/MoreHorizSharp";
import PostMediaType from "./PostMediaType";
import { Notification } from "./style/Notification.js";
import { Action } from "../../../utils/Constant/action";
import UserDefault from "../../../assets/images/default_user.png";
import { IconButton } from "@material-ui/core";
import ActionContent from "./Action/ActionComponent/ActionContent";
import { useState } from "react";
import CustomMenu from "./CustomMenu/CustomMenu";
import HandleCopy from "./CustomMenu/HandleCopy";
import ActionUser from "./Action/ActionUser";
import ConvertDateInIST from "./ConvertDateInIST";
import { PostMedia } from "../../../utils/Constant/postMetia";
import { MentionName } from "../../../utils/MentionName";


const CentralNotiContent = (
  { action,
    uploadFilename,
    postText,
    actionType,
    comment,
    postMediaType,
    createdAt,
    isRead,
    mentionNameArray,
    totalInteractionCount,
    id,
    postTextArray
  }) => {
  const notificationStyle = Notification(action?.length === 1 ? action[0]?.profilepic : UserDefault, isRead);
  const [anchorEl, setAnchorEl] = useState(false);
  const open = Boolean(anchorEl);
  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  return (
    <>
      {action?.length &&
        <Grid container sx={notificationStyle.mainContainer}>
          <Grid item lg={2} sm={2} xs={2} style={{ display: "flex" }}>
            <ActionUser profilepic1={action[0]?.profilepic} profilepic2={action[1]?.profilepic} isRead={isRead} notificationStyle={notificationStyle} length={action.length} actionType={actionType} />
          </Grid>

          {uploadFilename || postMediaType === PostMedia.POLL ?
            (<>
              <Grid item lg={7} sm={7} xs={7} style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
              {postText ?
              <>
                <ActionContent actionType={actionType} text={actionType === Action.MENTIONED ? postText : comment} action={action} totalInteractionCount={totalInteractionCount}
                  mentionNameArr={mentionNameArray} />
                  <Typography paragraph sx={notificationStyle.postText}><span dangerouslySetInnerHTML={{ __html: MentionName(postTextArray, postText, true ) }}></span></Typography>
                  </> : 
                  <ActionContent actionType={actionType} text={actionType === Action.MENTIONED ? postText : comment} action={action} totalInteractionCount={totalInteractionCount}
                  mentionNameArr={mentionNameArray} />
                  }
              </Grid>
              <Grid item lg={2} sm={2} xs={2}>
                <PostMediaType postMediaType={postMediaType} uploadFilename={uploadFilename} />
              </Grid>
            </>) : (
              <Grid item lg={9} sm={9} xs={9} style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
                <ActionContent actionType={actionType} text={actionType === Action.MENTIONED ? postText : comment} action={action} totalInteractionCount={totalInteractionCount} mentionNameArr={mentionNameArray} />
                {postText &&
                  <Typography paragraph sx={notificationStyle.postText}><span dangerouslySetInnerHTML={{ __html: MentionName(postTextArray, postText, true) }}></span></Typography>
                }
              </Grid>
            )
          }
          <Grid item lg={1} sm={1} xs={1} sx={notificationStyle.dateGrid}>
            <IconButton onClick={(e) => {
              e.stopPropagation();
              handleClick(e)
            }}>
              <MoreHorizSharpIcon style={notificationStyle.threeDot} />
            </IconButton>
            {anchorEl &&
              <CustomMenu open={open} handleClose={handleClose} handleCopy={() => HandleCopy(id)} anchorEl={anchorEl} />
            }
            <div trim style={notificationStyle.smallFont}>
              {ConvertDateInIST(createdAt)}
            </div>
          </Grid>
        </Grid>
      }
    </>
  );
};

export default CentralNotiContent;
