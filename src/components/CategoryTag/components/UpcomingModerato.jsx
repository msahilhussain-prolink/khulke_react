import { Moderator, Status } from "../../../utils/Constant/moderator";

const UpcomingModerator = (
  { categoryOrTag,
    parsed_data,
    current_user,
    ownerName,
    wip_rt_id,
    status,
    progress_name,
    Pencil,
    setCategoryOrTag,
    title 
  }
) => {

  const moderatorType = ((parsed_data?.moderator.m_type === Moderator.COOWNER &&
    parsed_data?.moderator?.user_id === current_user?.["_id"]) ||
    parsed_data?.["owner"]?.["username"] ===
    current_user?.["username"] ||
    ownerName === current_user?.["username"] ||
    wip_rt_id);

  return (
    <div className="d-flex">
      <span className="rt-strong-labels">{title}</span>
      {status === Status.UPCOMING &&
        categoryOrTag === false &&
        progress_name !== "" &&
        moderatorType && (
          <>
            &emsp; &emsp; &nbsp;
            <img
              src={Pencil}
              alt=""
              onClick={() => {
                setCategoryOrTag(!categoryOrTag);
              }}
            />
          </>
        )}
    </div>
  )

}

export default UpcomingModerator;