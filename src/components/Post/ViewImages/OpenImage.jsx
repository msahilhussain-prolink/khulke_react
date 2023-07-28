import { IconButton } from "@material-ui/core";
import FullScreenDialog from "../../common/FullSizeDialobox";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";
import { POST_API_BASE_URL } from "../../../constants/env";
import { imageStyle } from "./imageStyle";
import { useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

const OpenImage = ({ openImage, setOpenImage, handlePrevious, imgPreview, imgIndex, handleNext, imgRef, postImgSrc }) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  const onContextMenuHandler = (e) => {
    e.preventDefault();
  }
  return (

    <FullScreenDialog
      title={""}
      open={openImage}
      setOpen={setOpenImage}
    >
      <div
        style={imageStyle().container}
        onContextMenu={onContextMenuHandler}
      >
        {imgPreview[imgIndex] && imgPreview?.length > 1 && (
          <>
            <IconButton
              style={imageStyle(imgIndex).iconPreview}
              onClick={() => {
                handlePrevious(imgPreview);
              }}
              disabled={imgIndex === 0}
            >
              <KeyboardArrowLeft />
            </IconButton>
          </>
        )}
        {postImgSrc ? (
          <TransformWrapper initialScale={1}>
            <TransformComponent>
              <img
                ref={imgRef}
                src={postImgSrc}
                alt="images"
                style={imageStyle().image}
              />
            </TransformComponent>
          </TransformWrapper>
        ) :
          <div >
            {imgPreview[imgIndex]?.name ? (
              <TransformWrapper initialScale={1}>
                <TransformComponent>
                  <img
                    ref={imgRef}
                    src={`${POST_API_BASE_URL}/post-media/image/${imgPreview[imgIndex]?.name}`}
                    alt="images"
                    style={imageStyle().image}
                    id={imgIndex}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  />
                </TransformComponent>
              </TransformWrapper>
            ) : (
              <></>
            )}
          </div>
        }
        {imgPreview[imgIndex] && imgPreview?.length > 1 && (
          <>
            <IconButton
              style={imageStyle(imgIndex, imgPreview.length).iconNext}
              onClick={() => handleNext(imgPreview)}
              disabled={imgIndex === (imgPreview.length - 1)}
            >
              <KeyboardArrowRight />
            </IconButton>
          </>
        )}
      </div>
    </FullScreenDialog>
  )

}

export default OpenImage