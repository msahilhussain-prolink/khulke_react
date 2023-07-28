import React from "react";
import ReplyCard from "../ReplyCard";

const QuotedCard = ({
  cmt_id,
  cmt_type,
  cmt_media_type,
  cmt_parent,
  formatted_created_at,
  polling_data,
}) => {
  return (
    <>
      {cmt_type === "REQUOTE" && cmt_media_type === "" && (
        <>
          {cmt_parent[0]?.media_type === "XLS" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              excel
              docsFile={cmt_parent[0]?.media[0]?.extra?.orignalFilename}
              title={cmt_parent[0]?.raw_text}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {cmt_parent[0]?.media_type === "DOC" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              title={cmt_parent[0]?.raw_text}
              doc
              docsFile={cmt_parent[0]?.media[0]?.extra?.orignalFilename}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {cmt_parent[0]?.media_type === "PDF" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              pdf
              docsFile={cmt_parent[0]?.media[0]?.extra?.orignalFilename}
              title={cmt_parent[0]?.raw_text}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {cmt_parent[0]?.media_type === "PPTX" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              ppt
              docsFile={cmt_parent[0]?.media[0]?.extra?.orignalFilename}
              title={cmt_parent[0]?.raw_text}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {cmt_parent[0]?.media_type === "IMAGE" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
              imgData={cmt_parent[0]?.media}
              title={cmt_parent[0]?.raw_text}
            />
          )}
          {cmt_parent[0]?.media_type === "" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
              title={cmt_parent[0]?.raw_text}
            />
          )}
        </>
      )}
      {cmt_type === "REQUOTE" && cmt_media_type === "IMAGE" && (
        <>
          {cmt_parent[0]?.media_type === "XLS" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              excel
              docsFile={cmt_parent[0]?.media[0]?.extra?.orignalFilename}
              title={cmt_parent[0]?.raw_text}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {cmt_parent[0]?.media_type === "DOC" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              title={cmt_parent[0]?.raw_text}
              doc
              docsFile={cmt_parent[0]?.media[0]?.extra?.orignalFilename}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {cmt_parent[0]?.media_type === "PDF" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              pdf
              docsFile={cmt_parent[0]?.media?.[0].extra?.orignalFilename}
              title={cmt_parent[0]?.raw_text}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {cmt_parent[0]?.media_type === "PPTX" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              ppt
              docsFile={cmt_parent[0]?.media[0]?.extra?.orignalFilename}
              title={cmt_parent[0]?.raw_text}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {cmt_parent[0]?.media_type === "IMAGE" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
              imgData={cmt_parent[0]?.media}
              title={cmt_parent[0]?.raw_text}
            />
          )}
          {cmt_parent[0]?.media_type === "" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
              title={cmt_parent[0]?.raw_text}
            />
          )}
        </>
      )}
      {cmt_type === "REQUOTE" && cmt_media_type === "XLS" && (
        <>
          {cmt_parent[0]?.media_type === "XLS" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              excel
              docsFile={cmt_parent[0]?.media[0]?.extra?.orignalFilename}
              title={cmt_parent[0]?.raw_text}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {cmt_parent[0]?.media_type === "DOC" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              title={cmt_parent[0]?.raw_text}
              doc
              docsFile={cmt_parent[0]?.media[0]?.extra?.orignalFilename}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {cmt_parent[0]?.media_type === "PDF" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              pdf
              docsFile={cmt_parent[0]?.media[0]?.extra?.orignalFilename}
              title={cmt_parent[0]?.raw_text}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {cmt_parent[0]?.media_type === "PPTX" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              ppt
              docsFile={cmt_parent[0]?.media[0]?.extra?.orignalFilename}
              title={cmt_parent[0]?.raw_text}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {cmt_parent[0]?.media_type === "IMAGE" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
              imgData={cmt_parent[0]?.media}
              title={cmt_parent[0]?.raw_text}
            />
          )}
          {cmt_parent[0]?.media_type === "" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
              title={cmt_parent[0]?.raw_text}
            />
          )}
        </>
      )}
      {cmt_type === "REQUOTE" && cmt_media_type === "DOC" && (
        <>
          {cmt_parent[0]?.media_type === "XLS" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              excel
              docsFile={cmt_parent[0]?.media[0]?.extra?.orignalFilename}
              title={cmt_parent[0]?.raw_text}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {cmt_parent[0]?.media_type === "DOC" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              title={cmt_parent[0]?.raw_text}
              doc
              docsFile={cmt_parent[0]?.media[0]?.extra?.orignalFilename}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {cmt_parent[0]?.media_type === "PDF" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              pdf
              docsFile={cmt_parent[0]?.media[0]?.extra?.orignalFilename}
              title={cmt_parent[0]?.raw_text}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {cmt_parent[0]?.media_type === "PPTX" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              ppt
              docsFile={cmt_parent[0]?.media[0]?.extra?.orignalFilename}
              title={cmt_parent[0]?.raw_text}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {cmt_parent[0]?.media_type === "IMAGE" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
              imgData={cmt_parent[0]?.media}
              title={cmt_parent[0]?.raw_text}
            />
          )}
          {cmt_parent[0]?.media_type === "" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
              title={cmt_parent[0]?.raw_text}
            />
          )}
        </>
      )}
      {cmt_type === "REQUOTE" && cmt_media_type === "PDF" && (
        <>
          {cmt_parent[0]?.media_type === "XLS" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              excel
              docsFile={cmt_parent[0]?.media[0]?.extra?.orignalFilename}
              title={cmt_parent[0]?.raw_text}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {cmt_parent[0]?.media_type === "DOC" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              title={cmt_parent[0]?.raw_text}
              doc
              docsFile={cmt_parent[0]?.media[0]?.extra?.orignalFilename}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {cmt_parent[0]?.media_type === "PDF" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              pdf
              docsFile={cmt_parent[0]?.media[0]?.extra?.originalFilename}
              title={cmt_parent[0]?.raw_text}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {cmt_parent[0]?.media_type === "PPTX" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              ppt
              docsFile={cmt_parent[0]?.media[0]?.extra?.orignalFilename}
              title={cmt_parent[0]?.raw_text}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {cmt_parent[0]?.media_type === "IMAGE" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
              imgData={cmt_parent[0]?.media}
              title={cmt_parent[0]?.raw_text}
            />
          )}
          {cmt_parent[0]?.media_type === "" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
              title={cmt_parent[0]?.raw_text}
            />
          )}
        </>
      )}
      {cmt_type === "REQUOTE" && cmt_media_type === "PPTX" && (
        <>
          {cmt_parent[0]?.media_type === "XLS" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              excel
              docsFile={cmt_parent[0]?.media[0]?.extra?.orignalFilename}
              title={cmt_parent[0]?.raw_text}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {cmt_parent[0]?.media_type === "DOC" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              title={cmt_parent[0]?.raw_text}
              doc
              docsFile={cmt_parent[0]?.media[0]?.extra?.orignalFilename}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {cmt_parent[0]?.media_type === "PDF" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              pdf
              docsFile={cmt_parent[0]?.media[0]?.extra?.originalFilename}
              title={cmt_parent[0]?.raw_text}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {cmt_parent[0]?.media_type === "PPTX" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              ppt
              docsFile={cmt_parent[0]?.media[0]?.extra?.orignalFilename}
              title={cmt_parent[0]?.raw_text}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {cmt_parent[0]?.media_type === "IMAGE" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
              imgData={cmt_parent[0]?.media}
              title={cmt_parent[0]?.raw_text}
            />
          )}
          {cmt_parent[0]?.media_type === "" && (
            <ReplyCard
              cmt_parent={cmt_parent}
              complete_url={cmt_parent[0].urls.other}
              youtube_url={cmt_parent[0].urls.youtube}
              cmt_id={cmt_id}
              cmt_type={cmt_type}
              name={cmt_parent[0]?.name || ""}
              username={cmt_parent[0]?.username || ""}
              formatted_created_at={formatted_created_at}
              type={cmt_parent?.[0]?.type}
              polling_data={polling_data}
              title={cmt_parent[0]?.raw_text}
            />
          )}
        </>
      )}
    </>
  );
};

export default QuotedCard;
