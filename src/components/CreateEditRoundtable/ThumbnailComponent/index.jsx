import React from "react";
import DocPreviewComponent from "./DocPreviewComponent";
import ImagePreviewComponent from "./ImagePreviewComponent";
import VideoPreviewComponent from "./VideoPreviewComponent";

const ThumbnailComponent = ({ fileType, text, uploadType }) => {
  let renderVal = null;

  switch (fileType) {
    case "image":
      return (renderVal = (
        <ImagePreviewComponent uploadType={uploadType} text={text} />
      ));
    case "video":
      return (renderVal = (
        <VideoPreviewComponent uploadType={uploadType} text={text} />
      ));
    case "doc":
      return (renderVal = (
        <DocPreviewComponent uploadType={uploadType} text={text} />
      ));

    default:
      break;
  }

  return <>{renderVal ? renderVal : null}</>;
};

export default ThumbnailComponent;
