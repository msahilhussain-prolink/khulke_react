import React, { useEffect, useState, useCallback } from "react";

import styled from "styled-components";

import Cropper from "react-easy-crop";

import { getCroppedImg } from "./cropImage";
import { allWords } from "../../../App";

const Container = styled.div`
  width: 100%;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  margin-left: 1rem;
  .App {
    position: absolute;

    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .crop-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 60px;
  }

  .controls {
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 60px;
    display: flex;
    align-items: center;
  }
`;

const Button = styled.button`
  width: 200px;
  height: 50px;
  outline: none;
  border-radius: 5px;
  color: ${(props) => (props.primary ? props.theme.color.primary : "white")};
  background-color: ${(props) =>
    props.bgColor ? props.theme.color.secondary : "white"};
  border: 2px solid
    ${(props) =>
      props.primary ? props.theme.color.primary : props.theme.color.secondary};
`;

const EditImage = ({ imgArray, setEditImage, setDialogTitle, imageSrc }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // ** crop
  const onCrop = async () => {
    const file = imageSrc.url;
    const croppedImage = await getCroppedImg(file, croppedAreaPixels);
    const url = URL.createObjectURL(croppedImage);

    const index = imageSrc.index;
    imgArray[index].url = url;
    imgArray[index].file = croppedImage;
    setEditImage(false);
  };

  useEffect(() => {
    setDialogTitle("Crop");
  }, []);

  return (
    <>
      <Container>
        <div className="App">
          <div className="crop-container">
            <Cropper
              image={imageSrc.url}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="controls">
            <Button primary onClick={() => setEditImage(false)}>
              {allWords.misc.cancel}
            </Button>
            <Button bgColor onClick={onCrop}>
              {allWords.misc.save}
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
};

export default EditImage;
