import { Notification } from "../../style/Notification";
import ActionTitle from "../ActionTitle";
import GetUser from "./GetUser";

const ActionContent = ({ action, actionType, totalInteractionCount, mentionNameArr = [], text = "" }) => {

  return (<div style={Notification().quoteNComment}>
    <span style={Notification().boldFont}>
      {action?.length && <GetUser username={action[action?.length - 1].username} />}
      </span>
    <span style={Notification().normalFont}>
      <ActionTitle action={action} notificationStyle={Notification()} actionType={actionType} mentionNameArr={mentionNameArr} totalInteractionCount={totalInteractionCount} text={text} />
    </span>
  </div>)
}

export default ActionContent;