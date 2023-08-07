import React from "react";
import { REACT_APP_BASE_URL_CLOUDFRONT } from "../../../constants/env";
import ReplyCard from "../ReplyCard";
import ConvertDateInIST from "../../../pages/Notification/CentralContent/ConvertDateInIST";

const QuotedCard = ({
  post_id,
  post_type,
  post_media_type,
  post_parent,
  polling_data,
}) => {
  
  // short date conversion
  if(post_parent?.[0]?.formatted_created_at !== undefined){
    if(post_parent?.[0]?.formatted_created_at !==""){
      let shortForm = ConvertDateInIST(post_parent?.[0]?.created_at)
      let copy = [...post_parent]
      copy[0].formatted_created_at = shortForm
      post_parent = copy
    } 
  }
  
  return (
    <>
      {post_type === "REQUOTE" && post_media_type === "" && (
        <>
          {post_parent?.[0]?.media_type === "AUDIO" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              title={post_parent?.[0]?.text}
              audio
              audioFile={post_parent?.[0]?.media[0]?.name}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "VIDEO" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              title={post_parent?.[0]?.text}
              video
              videoFile={post_parent?.[0]?.media[0]?.name}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
              src={`${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${
                post_parent?.[0]?.user_id
              }/post/${post_parent?.[0]?._id}/${
                post_parent?.[0]?.is_converted == 1
                  ? post_parent?.[0]?.media[0]?.extra?.convertedFilename ??
                    post_parent?.[0]?.media[0]?.metadata?.convertedFilename
                  : post_parent?.[0]?.media[0]?.extra?.filename
              }`}
            />
          )}
          {post_parent?.[0]?.media_type === "PDF" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              pdf
              docsFile={post_parent?.[0]?.media[0]?.extra?.orignalFilename}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "XLS" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              excel
              docsFile={post_parent?.[0]?.media[0]?.extra?.orignalFilename}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "DOC" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              doc
              docsFile={post_parent?.[0]?.media[0]?.extra?.orignalFilename}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "IMAGE" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
              imgData={post_parent?.[0]?.media}
              title={post_parent?.[0]?.text}
            />
          )}
          {post_parent?.[0]?.media_type === "" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
              title={post_parent?.[0]?.text}
            />
          )}
        </>
      )}
      {post_type === "REQUOTE" && post_media_type === "IMAGE" && (
        <>
          {post_parent?.[0]?.media_type === "AUDIO" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              audio
              audioFile={post_parent?.[0]?.media[0]?.name}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "VIDEO" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              title={post_parent?.[0]?.text}
              video
              videoFile={post_parent?.[0]?.media[0]?.name}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
              src={`${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${
                post_parent?.[0]?.user_id
              }/post/${post_parent?.[0]?._id}/${
                post_parent?.[0]?.is_converted == 1
                  ? post_parent?.[0]?.media[0]?.extra?.convertedFilename ??
                    post_parent?.[0]?.media[0]?.metadata?.convertedFilename
                  : post_parent?.[0]?.media[0]?.extra?.filename
              }`}
            />
          )}
          {post_parent?.[0]?.media_type === "PDF" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              pdf
              docsFile={post_parent?.[0]?.media[0]?.extra?.orignalFilename}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "XLS" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              excel
              docsFile={post_parent?.[0]?.media[0]?.extra?.orignalFilename}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "DOC" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              doc
              docsFile={post_parent?.[0]?.media[0]?.extra?.orignalFilename}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "IMAGE" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
              imgData={post_parent?.[0]?.media}
              title={post_parent?.[0]?.text}
            />
          )}
          {post_parent?.[0]?.media_type === "" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
              title={post_parent?.[0]?.text}
            />
          )}
        </>
      )}
      {post_type === "REQUOTE" && post_media_type === "AUDIO" && (
        <>
          {post_parent?.[0]?.media_type === "AUDIO" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_type={post_type}
              post_id={post_id}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              audio
              audioFile={post_parent?.[0]?.media[0]?.name}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "VIDEO" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              title={post_parent?.[0]?.text}
              video
              videoFile={post_parent?.[0]?.media[0]?.name}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
              src={`${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${
                post_parent?.[0]?.user_id
              }/post/${post_parent?.[0]?._id}/${
                post_parent?.[0]?.is_converted == 1
                  ? post_parent?.[0]?.media[0]?.extra?.convertedFilename ??
                    post_parent?.[0]?.media[0]?.metadata?.convertedFilename
                  : post_parent?.[0]?.media[0]?.extra?.filename
              }`}
            />
          )}
          {post_parent?.[0]?.media_type === "PDF" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              pdf
              docsFile={post_parent?.[0]?.media[0]?.extra?.orignalFilename}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "DOC" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              doc
              docsFile={post_parent?.[0]?.media[0]?.extra?.orignalFilename}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "XLS" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              excel
              docsFile={post_parent?.[0]?.media[0]?.extra?.orignalFilename}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "IMAGE" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
              imgData={post_parent?.[0]?.media}
              title={post_parent?.[0]?.text}
            />
          )}
          {post_parent?.[0]?.media_type === "" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
              title={post_parent?.[0]?.text}
            />
          )}
        </>
      )}
      {post_type === "REQUOTE" && post_media_type === "VIDEO" && (
        <>
          {post_parent?.[0]?.media_type === "AUDIO" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              audio
              audioFile={post_parent?.[0]?.media[0]?.name}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "VIDEO" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              title={post_parent?.[0]?.text}
              video
              videoFile={post_parent?.[0]?.media[0]?.name}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
              src={`${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${
                post_parent?.[0]?.user_id
              }/post/${post_parent?.[0]?._id}/${
                post_parent?.[0]?.is_converted == 1
                  ? post_parent?.[0]?.media[0]?.extra?.convertedFilename ??
                    post_parent?.[0]?.media[0]?.metadata?.convertedFilename
                  : post_parent?.[0]?.media[0]?.extra?.filename
              }`}
            />
          )}
          {post_parent?.[0]?.media_type === "PDF" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              pdf
              docsFile={post_parent?.[0]?.media[0]?.extra?.orignalFilename}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}

          {post_parent?.[0]?.media_type === "XLS" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              excel
              docsFile={post_parent?.[0]?.media[0]?.extra?.orignalFilename}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "DOC" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              doc
              docsFile={post_parent?.[0]?.media[0]?.extra?.orignalFilename}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "IMAGE" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
              imgData={post_parent?.[0]?.media}
              title={post_parent?.[0]?.text}
            />
          )}
          {post_parent?.[0]?.media_type === "" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
              title={post_parent?.[0]?.text}
            />
          )}
        </>
      )}
      {post_type === "REQUOTE" && post_media_type === "PDF" && (
        <>
          {post_parent?.[0]?.media_type === "AUDIO" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              audio
              audioFile={post_parent?.[0]?.media[0]?.name}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "VIDEO" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              title={post_parent?.[0]?.text}
              video
              videoFile={post_parent?.[0]?.media[0]?.name}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
              src={`${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${
                post_parent?.[0]?.user_id
              }/post/${post_parent?.[0]?._id}/${
                post_parent?.[0]?.is_converted == 1
                  ? post_parent?.[0]?.media[0]?.extra?.convertedFilename ??
                    post_parent?.[0]?.media[0]?.metadata?.convertedFilename
                  : post_parent?.[0]?.media[0]?.extra?.filename
              }`}
            />
          )}
          {post_parent?.[0]?.media_type === "PDF" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              pdf
              docsFile={post_parent?.[0]?.media[0]?.extra?.orignalFilename}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "XLS" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              excel
              docsFile={post_parent?.[0]?.media[0]?.extra?.orignalFilename}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "DOC" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              doc
              docsFile={post_parent?.[0]?.media[0]?.extra?.orignalFilename}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "IMAGE" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
              imgData={post_parent?.[0]?.media}
              title={post_parent?.[0]?.text}
            />
          )}
          {post_parent?.[0]?.media_type === "" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
              title={post_parent?.[0]?.text}
            />
          )}
        </>
      )}
      {post_type === "REQUOTE" && post_media_type === "XLS" && (
        <>
          {post_parent?.[0]?.media_type === "AUDIO" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              audio
              audioFile={post_parent?.[0]?.media[0]?.name}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "VIDEO" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              title={post_parent?.[0]?.text}
              video
              videoFile={post_parent?.[0]?.media[0]?.name}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
              src={`${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${
                post_parent?.[0]?.user_id
              }/post/${post_parent?.[0]?._id}/${
                post_parent?.[0]?.is_converted == 1
                  ? post_parent?.[0]?.media[0]?.extra?.convertedFilename ??
                    post_parent?.[0]?.media[0]?.metadata?.convertedFilename
                  : post_parent?.[0]?.media[0]?.extra?.filename
              }`}
            />
          )}
          {post_parent?.[0]?.media_type === "PDF" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              pdf
              docsFile={post_parent?.[0]?.media[0]?.extra?.orignalFilename}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "XLS" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              excel
              docsFile={post_parent?.[0]?.media[0]?.extra?.orignalFilename}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "DOC" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              doc
              docsFile={post_parent?.[0]?.media[0]?.extra?.orignalFilename}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "IMAGE" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
              imgData={post_parent?.[0]?.media}
              title={post_parent?.[0]?.text}
            />
          )}
          {post_parent?.[0]?.media_type === "" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
              title={post_parent?.[0]?.text}
            />
          )}
        </>
      )}
      {post_type === "REQUOTE" && post_media_type === "DOC" && (
        <>
          {post_parent?.[0]?.media_type === "AUDIO" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              audio
              audioFile={post_parent?.[0]?.media[0]?.name}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "VIDEO" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              title={post_parent?.[0]?.text}
              video
              videoFile={post_parent?.[0]?.media[0]?.name}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
              src={`${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${
                post_parent?.[0]?.user_id
              }/post/${post_parent?.[0]?._id}/${
                post_parent?.[0]?.is_converted == 1
                  ? post_parent?.[0]?.media[0]?.extra?.convertedFilename ??
                    post_parent?.[0]?.media[0]?.metadata?.convertedFilename
                  : post_parent?.[0]?.media[0]?.extra?.filename
              }`}
            />
          )}
          {post_parent?.[0]?.media_type === "PDF" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              pdf
              docsFile={post_parent?.[0]?.media[0]?.extra?.orignalFilename}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "XLS" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              excel
              docsFile={post_parent?.[0]?.media[0]?.extra?.orignalFilename}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "DOC" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              doc
              docsFile={post_parent?.[0]?.media[0]?.extra?.orignalFilename}
              title={post_parent?.[0]?.text}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
            />
          )}
          {post_parent?.[0]?.media_type === "IMAGE" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
              imgData={post_parent?.[0]?.media}
              title={post_parent?.[0]?.text}
            />
          )}
          {post_parent?.[0]?.media_type === "" && (
            <ReplyCard
              lang={post_parent?.[0]?.lang}
              complete_url={post_parent?.[0].urls.other}
              youtube_url={post_parent?.[0].urls.youtube}
              post_parent_id={post_parent?.[0]?.post_id}
              post_id={post_id}
              post_type={post_type}
              name={post_parent?.[0]?.name || ""}
              username={post_parent?.[0]?.username || ""}
              formatted_created_at={post_parent?.[0]?.formatted_created_at}
              type={post_parent?.[0]?.type}
              polling_data={polling_data}
              title={post_parent?.[0]?.text}
            />
          )}
        </>
      )}
    </>
  );
};

export default QuotedCard;
