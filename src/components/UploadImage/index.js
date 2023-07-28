import React, { useRef } from "react";
import { IconButton } from "@mui/material";
import { allWords } from "../../App";
// Assets
import DeleteSVG from "../../assets/icons/delete.svg";

export default function UploadImage(props) {
  const {
    url_rt_id,
    rt_id,
    imageUrls,
    setImageUrl,
    image_name,
    imgValidation,
    onImageChange,
    onDocImageDelete,
    setImgDelFlag,
    label = "",
  } = props;

  // useState

  // useRef
  const hiddenFileInput = useRef("");

  //Targeting the file when Clicked

  return (
    <>
      <div className="d-flex mt-2">
        <div
          onClick={(e) => {
            if (e.target.id !== "delete" && !imageUrls) {
              hiddenFileInput.current.click();
            }
          }}
          className="imgdoc d-flex flex-column justify-content-center align-items-center"
        >
          {imageUrls ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                alt=""
                src={imageUrls}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  height: "inherit",
                  borderRadius: "10px",
                  color: "transparent",
                }}
                onError={() => {
                  setImageUrl(null);
                }}
              />

              <IconButton
                className="icon"
                style={{
                  position: "absolute",
                  top: "0px",
                  right: "0px",
                }}
              >
                <img
                  src={DeleteSVG}
                  alt="delete_icon"
                  id="delete"
                  style={{ width: 38, height: 38 }}
                  onClick={() => {
                    setImageUrl(null);
                    if (!url_rt_id) {
                      onDocImageDelete(rt_id, image_name, "image");
                    } else {
                      setImgDelFlag(true);
                    }
                  }}
                />
              </IconButton>
            </div>
          ) : (
            <span
              style={{
                fontSize: "0.8rem",
                color: "#63779C",
                marginTop: "4rem",
              }}
            >
              {allWords.misc.pg3.uplImg}
            </span>
          )}
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        style={{ visibility: "hidden" }}
        ref={hiddenFileInput}
        onChange={(e) => {
          imgValidation(e, "image");
          if (!url_rt_id && label === "") {
            onImageChange(rt_id, e.target.files[0]);
          } else {
            setImgDelFlag(true);
          }
        }}
      />
    </>
  );
}
