import { useLayoutEffect, useState } from "react";
import { REACT_APP_BASE_URL_CLOUDFRONT } from "../../../../constants/env";
import { rt_id } from "../../../../pages/AgoraSandbox/settings";
import DocsContainer from "../../../Post/AddPostDialog/DocsContainer";

export default function ShowMedia(props) {
  //props here
  const { item } = props;

  //states here
  const [file, setFile] = useState({
    type: "",
    url: "",
    fileName: "",
    metadata: "",
    mimeType: "",
  });

  //file type checker
  const checkFileType = (val) => {
    if (item.doc_media) {
      return item.doc_media[0].metadata.mimeType.includes(val);
    } else if (item.media) {
      return item.media[0].metadata.mimeType.includes(val);
    } else if (item.file_type) {
      return item.metadata.mimeType.includes(val);
    }
  };

  useLayoutEffect(() => {
    var file_type = "";

    if (item.doc_media) {
      if (checkFileType("application")) file_type = "doc";

      if (checkFileType("video")) file_type = "video";

      if (checkFileType("audio")) file_type = "audio";

      if (checkFileType("image")) file_type = "image";

      setFile({
        type: file_type,
        url: `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${item.user_id}/roundtable/${rt_id}/wildcardmsg_upload/${item.doc_media[0].metadata.tempFilename}`,
        fileName: item.doc_media[0].metadata.orignalFilename,
        metadata: item.doc_media[0].metadata,
        mimeType: item.doc_media[0].metadata.mimeType,
      });
    }

    if (item.media) {
      setFile({
        type: "image",
        url: `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${item.user_id}/roundtable/${rt_id}/wildcardmsg_upload/${item.media[0].metadata.tempFilename}`,
        fileName: item.media[0].metadata.orignalFilename,
        metadata: item.media[0].metadata,
        mimeType: item.media[0].metadata.mimeType,
      });
    }

    if (item.file_type) {
      if (item.file_type === "doc") {
        if (checkFileType("application")) file_type = "doc";

        if (checkFileType("video")) file_type = "video";

        if (checkFileType("audio")) file_type = "audio";

        setFile({
          type: file_type,
          url: `${REACT_APP_BASE_URL_CLOUDFRONT}/${item.url_path}`,
          fileName: item.metadata.orignalFilename,
          metadata: item.metadata,
          mimeType: item.metadata.mimeType,
        });
        return;
      } else {
        file_type = "image";
        setFile({
          type: file_type,
          url: `${REACT_APP_BASE_URL_CLOUDFRONT}/${item.url_path}`,
          fileName: item.metadata.orignalFilename,
          metadata: item.metadata,
          mimeType: item.metadata.mimeType,
        });
      }
    }
  }, [item]);

  return (
    <>
      {file.type === "image" && (
        <img
          src={file.url}
          style={{
            margin: "auto",
            maxWidth: "100%",
          }}
          alt="raise_hand_img"
        />
      )}
      {file.type === "video" && (
        <video
          src={file.url}
          style={{
            width: "100%",
            borderRadius: "12px",
          }}
          controls
        ></video>
      )}
      {file.type === "audio" && (
        <audio
          src={file.url}
          style={{
            width: "100%",
          }}
          controls
        ></audio>
      )}
      {file.type === "doc" && (
        <DocsContainer
          excelDoc={
            (file.mimeType === "application/vnd.ms-excel" ||
              file.mimeType ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
              file.mimeType === "application/xls") &&
            file.fileName
          }
          docsFile={file.mimeType === "application/pdf" && file.fileName}
          docsFilePath={file.url}
          handle={true}
          pptDoc={
            (file.mimeType === "application/vnd.ms-powerpoint" ||
              file.mimeType ===
                "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
              file.mimeType === "application/pptx") &&
            file.fileName
          }
          wordDoc={
            (file.mimeType === "application/msword" ||
              file.mimeType ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
              file.mimeType === "application/octet-stream" ||
              file.mimeType === "application/doc") &&
            file.fileName
          }
        />
      )}
    </>
  );
}
