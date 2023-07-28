import moment from "moment";
import ViewerChat from "../../../components/ViewerChat";
import { POST_API_BASE_URL } from "../../../constants/env";

export default function AllPosts(props) {
  const { interactionData, single_rt_data, ...others } = props;
  return (
    interactionData
      ?.filter((item) => item?.is_deleted !== 1)
      ?.filter((item) => item?.muted !== 1)
      // ?.filter(
      //   (item) =>
      //     single_rt_data?.[0]?.happened_flag === false &&
      //     item?.type !== "POLL_ROUNDTABLE"
      // )
      ?.map((item) => (
        <div key={item?.post_id}>
          {/* {item?.type !== "POLL_ROUNDTABLE" ? (
          <> */}
          {item?.media_type === "IMAGE" && (
            <>
              <ViewerChat
                {...others}
                single_rt_data={single_rt_data}
                posted_at={item?.posted_at}
                cmt_media_type={item?.media_type}
                cmt_id={item?.post_id}
                post_media={item?.media}
                title={item?.raw_text}
                key={item?.post_id}
                formatted_created_at={item?.formatted_created_at}
                complete_url={item?.urls?.other}
                youtube_url={item?.urls?.youtube}
                user_id={item?.user_id}
                username={item?.username}
                name={item?.name}
                raw_text={item?.raw_text}
                totalDislike={item?.dislike}
                totalLike={item?.like}
                imgData={item?.media}
                post_id={item?.post_id}
                like_self={item?.like_self}
                dislike_self={item?.dislike_self}
                type={item?.type}
                circulate_self={item?.circulate_self}
                circulate_user={item?.circulate_user}
                cmt_circulated_count={item?.cmt_circulated_count}
                post_quote_count={item?.post_quote}
                totalComment={item?.comment}
                comment_self={item?.comment_self}
                cmt_parent={item?.parent}
                post_type={item?.type}
                post_circulated_count={item?.circulate_count}
                muted={item?.muted}
                user_type={item?.user_type}
                mentioned_usernames={item?.mentioned_usernames}
              />
            </>
          )}

          {item?.media_type === "PDF" && (
            <>
              <ViewerChat
                {...others}
                single_rt_data={single_rt_data}
                posted_at={item?.posted_at}
                cmt_media_type={item?.media_type}
                cmt_id={item?.post_id}
                key={item?.post_id}
                title={item?.raw_text}
                post_media={item?.media}
                user_id={item?.user_id}
                username={item?.username}
                name={item?.name}
                complete_url={item?.urls?.other}
                youtube_url={item?.urls?.youtube}
                raw_text={item?.raw_text}
                totalDislike={item?.dislike}
                totalLike={item?.like}
                formatted_created_at={item?.formatted_created_at}
                post_id={item?.post_id}
                like_self={item?.like_self}
                dislike_self={item?.dislike_self}
                type={item?.type}
                pdf
                docsName={item?.media?.[0].extra?.orignalFilename}
                docsFile={item.media[0]?.name}
                circulate_self={item?.circulate_self}
                circulate_user={item?.circulate_user}
                cmt_circulated_count={item?.cmt_circulated_count}
                post_quote_count={item?.post_quote}
                totalComment={item?.comment}
                comment_self={item?.comment_self}
                cmt_parent={item?.parent}
                post_type={item?.type}
                post_circulated_count={item?.circulate_count}
                muted={item?.muted}
                thumbnail={`${POST_API_BASE_URL}/post-media/frame/${item.media[0]?.name}`}
                user_type={item?.user_type}
                mentioned_usernames={item?.mentioned_usernames}
              />
            </>
          )}

          {item?.media_type === "XLS" && (
            <>
              <ViewerChat
                {...others}
                single_rt_data={single_rt_data}
                posted_at={item?.posted_at}
                cmt_media_type={item?.media_type}
                cmt_id={item?.post_id}
                key={item?.post_id}
                user_id={item?.user_id}
                username={item?.username}
                name={item?.name}
                complete_url={item?.urls?.other}
                youtube_url={item?.urls?.youtube}
                raw_text={item?.raw_text}
                totalDislike={item?.dislike}
                totalLike={item?.like}
                formatted_created_at={item?.formatted_created_at}
                post_id={item?.post_id}
                like_self={item?.like_self}
                dislike_self={item?.dislike_self}
                type={item?.type}
                docsName={item?.media?.[0].extra?.orignalFilename}
                docsFile={item.media[0]?.name}
                post_media={item?.media}
                circulate_self={item?.circulate_self}
                circulate_user={item?.circulate_user}
                cmt_circulated_count={item?.cmt_circulated_count}
                post_quote_count={item?.post_quote}
                totalComment={item?.comment}
                comment_self={item?.comment_self}
                cmt_parent={item?.parent}
                post_type={item?.type}
                post_circulated_count={item?.circulate_count}
                excel
                muted={item?.muted}
                thumbnail={`${POST_API_BASE_URL}/post-media/frame/${item.media[0]?.name}`}
                user_type={item?.user_type}
                mentioned_usernames={item?.mentioned_usernames}
              />
            </>
          )}

          {item?.media_type === "DOC" && (
            <>
              <ViewerChat
                {...others}
                single_rt_data={single_rt_data}
                posted_at={item?.posted_at}
                cmt_media_type={item?.media_type}
                cmt_id={item?.post_id}
                key={item?.post_id}
                user_id={item?.user_id}
                username={item?.username}
                name={item?.name}
                complete_url={item?.urls?.other}
                youtube_url={item?.urls?.youtube}
                raw_text={item?.raw_text}
                totalDislike={item?.dislike}
                totalLike={item?.like}
                formatted_created_at={item?.formatted_created_at}
                post_id={item?.post_id}
                like_self={item?.like_self}
                dislike_self={item?.dislike_self}
                type={item?.type}
                doc
                docsName={item?.media?.[0].extra?.orignalFilename}
                docsFile={item.media[0]?.name}
                post_media={item?.media}
                circulate_self={item?.circulate_self}
                circulate_user={item?.circulate_user}
                cmt_circulated_count={item?.cmt_circulated_count}
                post_quote_count={item?.post_quote}
                totalComment={item?.comment}
                comment_self={item?.comment_self}
                cmt_parent={item?.parent}
                post_type={item?.type}
                post_circulated_count={item?.circulate_count}
                muted={item?.muted}
                thumbnail={`${POST_API_BASE_URL}/post-media/frame/${item.media[0]?.name}`}
                user_type={item?.user_type}
                mentioned_usernames={item?.mentioned_usernames}
              />
            </>
          )}

          {item?.media_type === "PPTX" && (
            <>
              <ViewerChat
                {...others}
                single_rt_data={single_rt_data}
                posted_at={item?.posted_at}
                cmt_media_type={item?.media_type}
                cmt_id={item?.post_id}
                key={item?.post_id}
                user_id={item?.user_id}
                username={item?.username}
                name={item?.name}
                complete_url={item?.urls?.other}
                youtube_url={item?.urls?.youtube}
                raw_text={item?.raw_text}
                totalDislike={item?.dislike}
                totalLike={item?.like}
                formatted_created_at={item?.formatted_created_at}
                post_id={item?.post_id}
                like_self={item?.like_self}
                dislike_self={item?.dislike_self}
                type={item?.type}
                ppt
                docsName={item?.media?.[0].extra?.orignalFilename}
                docsFile={item.media[0]?.name}
                post_media={item?.media}
                circulate_self={item?.circulate_self}
                circulate_user={item?.circulate_user}
                cmt_circulated_count={item?.cmt_circulated_count}
                post_quote_count={item?.post_quote}
                totalComment={item?.comment}
                comment_self={item?.comment_self}
                cmt_parent={item?.parent}
                post_type={item?.type}
                post_circulated_count={item?.circulate_count}
                muted={item?.muted}
                thumbnail={`${POST_API_BASE_URL}/post-media/frame/${item.media[0]?.name}`}
                user_type={item?.user_type}
                mentioned_usernames={item?.mentioned_usernames}
              />
            </>
          )}

          {single_rt_data?.[0]?.happened_flag === false ? (
            <>
              {item?.type !== "POLL_ROUNDTABLE" && (
                <>
                  {item?.media_type === "" && (
                    <>
                      <ViewerChat
                        {...others}
                        single_rt_data={single_rt_data}
                        posted_at={item?.posted_at}
                        cmt_media_type={item?.media_type}
                        cmt_id={item?.post_id}
                        key={item?.post_id}
                        title={item?.raw_text}
                        post_media={item?.media}
                        complete_url={item?.urls?.other}
                        youtube_url={item?.urls?.youtube}
                        user_id={item?.user_id}
                        username={item?.username}
                        name={item?.name}
                        raw_text={item?.raw_text}
                        totalDislike={item?.dislike}
                        totalLike={item?.like}
                        formatted_created_at={item?.formatted_created_at}
                        post_id={item?.post_id}
                        like_self={item?.like_self}
                        dislike_self={item?.dislike_self}
                        type={item?.type}
                        circulate_self={item?.circulate_self}
                        circulate_user={item?.circ_username}
                        cmt_circulated_count={item?.cmt_circulated_count}
                        post_quote_count={item?.post_quote}
                        totalComment={item?.comment}
                        comment_self={item?.comment_self}
                        cmt_parent={item?.parent}
                        post_type={item?.type}
                        post_circulated_count={item?.circulate_count}
                        // polling_data={item?.polling_data}
                        // pollExpireTime={new Date(item?.polling_data?.end_date)}
                        muted={item?.muted}
                        user_type={item?.user_type}
                        mentioned_usernames={item?.mentioned_usernames}
                      />
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {(moment(new Date(item?.polling_data?.["start_date"])).isBefore(
                moment(new Date(single_rt_data?.[0]?.["end"]))
              ) ||
                item?.polling_data?.duration === undefined) && (
                  <>
                    {item?.media_type === "" && (
                      <>
                        <ViewerChat
                          {...others}
                          single_rt_data={single_rt_data}
                          posted_at={item?.posted_at}
                          cmt_media_type={item?.media_type}
                          cmt_id={item?.post_id}
                          key={item?.post_id}
                          title={item?.raw_text}
                          post_media={item?.media}
                          complete_url={item?.urls?.other}
                          youtube_url={item?.urls?.youtube}
                          user_id={item?.user_id}
                          username={item?.username}
                          name={item?.name}
                          raw_text={item?.raw_text}
                          totalDislike={item?.dislike}
                          totalLike={item?.like}
                          formatted_created_at={item?.formatted_created_at}
                          post_id={item?.post_id}
                          like_self={item?.like_self}
                          dislike_self={item?.dislike_self}
                          type={item?.type}
                          circulate_self={item?.circulate_self}
                          circulate_user={item?.circ_username}
                          cmt_circulated_count={item?.cmt_circulated_count}
                          post_quote_count={item?.post_quote}
                          totalComment={item?.comment}
                          comment_self={item?.comment_self}
                          cmt_parent={item?.parent}
                          post_type={item?.type}
                          post_circulated_count={item?.circulate_count}
                          polling_data={item?.polling_data}
                          pollExpireTime={new Date(item?.polling_data?.end_date)}
                          muted={item?.muted}
                          user_type={item?.user_type}
                          mentioned_usernames={item?.mentioned_usernames}
                        />
                      </>
                    )}
                  </>
                )}
            </>
          )}
        </div>
      ))
  );
}
