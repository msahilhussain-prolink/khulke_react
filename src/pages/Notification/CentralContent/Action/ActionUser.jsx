import { Grid } from "@material-ui/core";
import ActionTypeIcon from "./ActionTypeIcon";
import UserDefault from "../../../../assets/images/default_user.png";


const ActionUser = ({ isRead, notificationStyle, profilepic1, profilepic2, actionType, length }) => {
  return (
    <Grid container style={notificationStyle.userContainer} >
      <Grid item lg={2} sm={2} xs={2} style={notificationStyle.isReadGrid}>{!isRead && <div style={notificationStyle.isRead}>
      </div>}</Grid>
      <Grid lg={10} sm={10} xs={10} style={length === 1 ? {display: "flex", flexDirection: "column", justifyContent: "center"}: {display: "block"}}>
      {length > 1 ?
          <div >
            <div style={notificationStyle.cabProfilePic.container}>
              <img src={profilepic1 || UserDefault} style={notificationStyle.cabProfilePic.img1} />
              <img src={profilepic2 || UserDefault} style={notificationStyle.cabProfilePic.img2} />
              <span style={notificationStyle.cabProfilePic.img3}>
                <ActionTypeIcon actionType={actionType} />
              </span>
            </div>
          </div>:
          <div style={notificationStyle.profilePic} >
            <span style={notificationStyle.actionIcon}>
              <ActionTypeIcon actionType={actionType} />
            </span>
          </div>
      }
              </Grid>
    </Grid>
  )
}

export default ActionUser;