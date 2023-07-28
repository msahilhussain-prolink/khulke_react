import CentralNotiContent from "./CentralNotiContent";
import { useNavigate } from "react-router-dom";
import NoNewNotification from "../../../components/NoNewNotification";
import { useSelector } from "react-redux";



const InteractionContainer = ({}) => {
 
  const navigate = useNavigate();
  const interactionNotification = useSelector((state) => state.interaction?.data?.data);

  const MergeProfile = () => {
    let elementData = [];
    elementData = interactionNotification?.length && interactionNotification?.map((ele) => ({
      id: ele?._id,
      uploadFilename: ele?.post_media?.length ? ele?.post_media[0]?.thumbnailId : "",
      name: ele?.post_media?.length ? ele?.post_media[0]?.uploadFilename : "",
      actionType: ele?.action,
      postText: ele?.text,
      comment: ele?.child_data?.length ? ele?.child_data[0]?.text : "",
      mentionNameArray: ele?.child_data[0]?.mentionedUsers,
      postTextArray: ele.mentionedUsers,
      action: ele?.user_action_array,
      postMediaType: ele.post_type,
      createdAt: ele?.created_at,
      isRead: ele?.isRead,
      totalInteractionCount: ele?.totalInteractionCount
    })
    )
    return elementData;
  }

  return <>
  {MergeProfile()?.length ? MergeProfile().map((ele) => {
    return (
      <div key={ele.created_at} onClick={() => {
        ele.isRead = true;
        navigate(`/post/${ele.id}`)
      }}>
        <CentralNotiContent
          uploadFilename={ele?.uploadFilename}
          name={ele?.name}
          actionType={ele.actionType}
          postText={ele.postText}
          comment={ele?.action?.length > 1 ? "" : ele?.comment}
          action={ele?.action}
          postMediaType={ele?.postMediaType}
          createdAt={ele?.createdAt}
          isRead={ele?.isRead}
          mentionNameArray={ele?.mentionNameArray}
          postTextArray={ele.postTextArray}
          totalInteractionCount={ele?.totalInteractionCount}
          id={ele.id}
        />
      </div>);
  }) : <NoNewNotification/>
}
  </>
}

export default InteractionContainer;