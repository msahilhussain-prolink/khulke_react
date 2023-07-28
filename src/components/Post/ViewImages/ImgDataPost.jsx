import { PostMultiImgContainer } from "../style";
import "../style.css";
import { POST_API_BASE_URL } from "../../../constants/env";
import { imageStyle } from "./imageStyle";

const ImgDataPost = ({ itemData, imgData, index, style, setOpenImage, setImgPreview, setImgIndex, children, isPost = true }) => {
  return <div className="post_img" style={style}>
    <PostMultiImgContainer
      src={`${POST_API_BASE_URL}/post-media/image/${itemData?.name}`}
      onClick={() => {
        setOpenImage(true);
        setImgPreview(imgData);
        setImgIndex(index);
      }}
    />
    {children}
    {!isPost && itemData?.caption && (
      <p
        style={imageStyle().caption}
      >
        {itemData?.caption}
      </p>
    )}
  </div>
}

export default ImgDataPost;