import React, { useRef } from "react";

// Assets
import rt_default_image from "../../assets/images/rt_default_hires.png";
import Camera from "../../assets/icons/camera_icon.svg";

// Styles
import "./style.css";

export default function ReviewImg(props) {
  const {
    progress_name,
    imageUrls,
    setImageUrl,
    imgValidation,
    setImgUpFlag,
    setImgDelFlag,
  } = props;

  // useRef
  const hiddenFileInput = useRef("");

  return (
    <>
      <input
        type="file"
        accept="image/*"
        style={{ visibility: "hidden" }}
        ref={hiddenFileInput}
        onChange={(e) => {
          imgValidation(e, "image");
        }}
      />
      <div className="review_img_div">
        <picture>
          <img
            alt=""
            src={imageUrls === null ? rt_default_image : imageUrls}
            className="img-fluid review_img"
            onLoadStart={() => {
              setImageUrl(null);
            }}
            onError={() => {
              setImageUrl(null);
            }}
          />
        </picture>
        {progress_name !== "" && (
          <span className="review_camera">
            <img
              src={Camera}
              alt=""
              onClick={() => {
                hiddenFileInput.current.click();
                setImgUpFlag(true);
                setImgDelFlag(true);
              }}
            />
          </span>
        )}
      </div>
    </>
  );
}
