import { allWords } from "../../../../App";
import { Action } from "../../../../utils/Constant/action";
import { MentionName } from "../../../../utils/MentionName";
import GetUser from "./ActionComponent/GetUser";


const ActionTitle = ({ actionType, text = "", action, mentionNameArr = [], totalInteractionCount }) => {
  let countOfOther = (totalInteractionCount > 2) ? `& ${totalInteractionCount - 2} ${allWords.profile.other}` : "";
  switch (actionType) {
    case Action.LIKE:
      return action?.length > 1 ? <>, <GetUser username={action[action.length - 2].username} /> {countOfOther} {`${allWords.misc.liked_post}`}</> : <>&nbsp;{`${allWords.misc.liked_post}`}</>;
    case Action.DISLIKE:
      return action?.length > 1 ? <>, <GetUser username={action[action.length - 2].username} /> {countOfOther} {` ${allWords.misc.disliked_post}`}</> : <>&nbsp;{`${allWords.misc.disliked_post}`}</>;
    case Action.CIRCULATED:
      return action?.length > 1 ? <>, <GetUser username={action[action.length - 2].username} /> {countOfOther} {` ${allWords.misc.circulated_post}`}</> :<>&nbsp;{`${allWords.misc.circulated_post}`}</>;
    case Action.QUOTED:
      return action?.length > 1 ? <>, <GetUser username={action[action.length - 2].username} /> {countOfOther} {`${allWords.misc.quoted_post}`}</> : <>&nbsp;{`${allWords.misc.quoted_post}: `} <span  className="mention" dangerouslySetInnerHTML={{ __html: MentionName(mentionNameArr, text) }}></span></>;
    case Action.REPLIED:
    case Action.COMMENT:
      return action?.length > 1 ? <>, <GetUser username={action[action.length - 2].username} /> {countOfOther} {` ${allWords.misc.commented_post}`}</> : <>&nbsp;{`${allWords.misc.commented_post}: `}  <span className="mention" dangerouslySetInnerHTML={{ __html: MentionName(mentionNameArr, text) }}></span></>;
    case Action.MENTIONED:
      return action?.length > 1 ? <>, <GetUser username={action[action.length - 2].username} /> {countOfOther} {`${allWords.misc.mention_post}`}</> :
        <>&nbsp;{`${allWords.misc.mention_post} `} </>;
    default:
      return <></>;
  }
};

export default ActionTitle;