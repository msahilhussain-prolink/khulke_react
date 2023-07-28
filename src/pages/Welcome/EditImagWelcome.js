import { Button, Grid, Modal, Paper } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import EditImage from "../../components/Post/AddPostDialog/EditImage";
import { allWords } from "../../App"

export default function EditImageWelcome({
  setEditImage,
  tempImage,
  setTempImage,
  setOpenEditor,
  openEditor,
  setAvatar,
}) {
  const imageEditorRef = useRef();

  useEffect(() => {
    if (!tempImage[0]?.file || !tempImage[0]?.cropped) {
      return;
    }
    setEditImage(tempImage[0].file);
    setAvatar(tempImage[0].url);
    setTempImage([]);
    setOpenEditor(false);
  }, [tempImage]);

  return (
    <Modal
      onClose={() => {
        setEditImage();
        setOpenEditor(false);
      }}
      open={openEditor}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={4}
        style={{
          backgroundColor: "white",
          padding: "20px",
          minWidth: "600px",
          maxWidth: "1000px",
        }}
      >
        <EditImage
          imageSrc={{
            index: 0,
            file: tempImage[0]?.file,
            url: tempImage[0]?.url,
          }}
          setImgArray={setTempImage}
          imgArray={tempImage}
          ref={imageEditorRef}
          fixedRatio={1 / 1}
        />
        <Grid container justifyContent="space-between">
          <Grid item>
            <Button
              onClick={() => {
                setEditImage();
                setTempImage([]);
                setOpenEditor(false);
              }}
              variant="contained"
              style={{
                padding: "10px 30px",
                backgroundColor: "red",
                color: "white",
                borderRadius: "10px",
                marginTop: "20px",
              }}
            >
              {allWords.misc.livert.dis}
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => {
                imageEditorRef.current.setCroppedImage();
              }}
              variant="contained"
              style={{
                padding: "10px 30px",
                backgroundColor: "#54B798",
                color: "white",
                borderRadius: "10px",
                marginTop: "20px",
              }}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
}
