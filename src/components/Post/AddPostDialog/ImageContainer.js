import React from "react";
import CaptionInput from "./CaptionInput";
import styled from "styled-components";
import { IconButton } from "@mui/material";
import DeleteSVG from "../../../assets/icons/delete.svg";
import CropTrimSVG from "../../../assets/icons/image crop.svg";
import { allWords } from "../../../App";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  .add_post_container {
    position: relative;
    .img {
      width: 100% !important;
      border-radius: 0.5rem;
      height: 230px !important;
      /* object-fit: cover; */
    }
    .imgSingle {
      width: 100% !important;
      border-radius: 0.5rem;
      height: 230px !important;
      object-fit: contain !important;
    }

    .icon_container {
      position: absolute;
      right: 0;
      margin-top: -60px;

      .icon {
        width: 45px;
        height: 45px;
        margin-right: 0.5rem;
      }
    }
  }
`;

const ImageContainer = ({
  editImage,
  setEditImage,
  imgArray,
  setImgArray,
  imgSrc,
  index,
  setImageSrc,
  imageSrc,
  setCaption,
  setState,
  onCaptionChange,
  captionLength,
  imageCaption,
  onDeleteCaption,
}) => {
  return (
    <Container>
      <div
        className="add_post_container"
        style={{
          position: "relative",
        }}
      >
        <img
          className={imgArray.length > 1 ? "img" : "imgSingle"}
          src={imgSrc.url}
          alt="images"
        />
        {imgSrc && (
          <div
            className="icon_container"
            style={{
              top: "1rem",
              right: "0",
              marginTop: "0",
            }}
          >
            <IconButton
              className="icon"
              onClick={() => {
                setEditImage(true);
                setImageSrc({
                  index: index,
                  url: imgSrc.url,
                  file: imgSrc.file,
                });
              }}
              style={{ backgroundColor: "white", width: 40, height: 40 }}
            >
              <img
                src={CropTrimSVG}
                alt="delete_icon"
                style={{ width: 26, height: 26 }}
              />
            </IconButton>
            <IconButton
              className="icon"
              onClick={() => {
                imgArray.splice(index, 1);
                onDeleteCaption(index);
                setImgArray([...imgArray]);
                if (setState) {
                  if (imgArray?.length === 0) {
                    setState(false);
                  }
                }
              }}
            >
              <img
                src={DeleteSVG}
                alt="delete_icon"
                style={{ width: 38, height: 38 }}
              />
            </IconButton>
          </div>
        )}
      </div>

      {imgSrc && window.location.pathname !== "/roundtable/join" && (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <CaptionInput
              fullWidth
              placeholder={allWords.th.imgplcHolder}
              onChangeCaption={onCaptionChange}
              maxLength={50}
              imageCaption={imageCaption}
            />
          </div>
          {/* <CaptionInput
            fullWidth
            placeholder="Add tags"
            onChange={(e) => {
              // setCaption(e.target.value);
            }}
          /> */}
        </>
      )}
    </Container>
  );
};

export default ImageContainer;
