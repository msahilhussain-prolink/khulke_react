import React from "react";
import styled from "styled-components";
import { IconButton } from "@mui/material";
import DeleteSVG from "../../../assets/icons/delete.svg";
import CropTrimSVG from "../../../assets/icons/image crop.svg";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  .add_post_container {
    position: relative;
    text-align: center;
    .img {
      max-width: 100%;
      height: 100%;
      border-radius: 0.5rem;
      object-fit: cover;
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
  setEditImage,
  imgArray,
  setImgArray,
  imgSrc,
  index,
  setImageSrc,
}) => {
  return (
    <Container>
      <div className="mt-3 add_post_container">
        <img
          className="img"
          src={imgSrc.url}
          alt="images"
          style={{ maxHeight: 250 }}
        />
        {imgSrc && (
          <div className="icon_container">
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
                setImgArray([...imgArray]);
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
    </Container>
  );
};

export default ImageContainer;
