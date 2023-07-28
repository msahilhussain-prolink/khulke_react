import { Button, Grid } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import EditImage from "../../../Post/AddPostDialog/EditImage";
import ImageContainer from "../../../Post/AddPostDialog/ImageContainer";

export default function RaiseHandImageContainer(props) {
  //props destructuring here
  const { imgArray, setImgArray, setEditing } = props;

  //useStates here
  const [imgSrc, setImageSrc] = useState({});
  const [editing, setEditImage] = useState(false);

  //useRef here
  const editImageRef = useRef();

  //functions here
  const handleCrop = () => {
    editImageRef.current?.setCroppedImage();
    setEditImage(false);
  };

  //sideeffects here
  useEffect(() => {
    setEditing(editing);
  }, [editing]);

  return (
    <>
      {!editing ? (
        imgArray.map((elem, index, elements) => {
          return (
            <Grid
              item
              key={index}
              sm={12}
              style={{
                padding: "10px",
              }}
            >
              <ImageContainer
                setEditImage={setEditImage}
                imgArray={imgArray}
                setImgArray={setImgArray}
                imgSrc={elem}
                index={index}
                setImageSrc={setImageSrc}
                onCaptionChange={(e) => {
                  setImgArray((prevState) => {
                    const temp = [...elements];
                    temp[index].caption = e.target.value;
                    setImgArray(temp);
                  });
                }}
                imageCaption={elem.caption}
              />
            </Grid>
          );
        })
      ) : (
        <Grid
          container
          style={{
            marginTop: "30px",
          }}
        >
          <Grid item xs={12}>
            <EditImage
              imageSrc={imgSrc}
              setImgArray={setImgArray}
              ref={editImageRef}
            />
          </Grid>

          <Grid
            item
            xs={12}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "30px",
              padding: "10px 20px",
            }}
          >
            <Button
              onClick={() => {
                setEditImage(false);
              }}
              variant="contained"
              style={{
                backgroundColor: "black",
                color: "white",
                width: "40%",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              {allWords.misc.cancel}
            </Button>
            <Button
              variant="contained"
              style={{
                backgroundColor: "black",
                color: "white",
                width: "40%",
                padding: "10px",
                borderRadius: "10px",
              }}
              onClick={handleCrop}
            >
              {allWords.misc.save}
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
}
