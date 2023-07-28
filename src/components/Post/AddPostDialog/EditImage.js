import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import Button from "@mui/material/Button";
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import { ClickAwayListener, Grid, Paper } from "@mui/material";
import { Box } from "@mui/system";
import rotateIcon from "../../../assets/icons/rotate.svg";
import aspectratioIcon from "../../../assets/icons/aspect_ratio.svg";
import { allWords } from "../../../App"

export default forwardRef(function EditImage(props, ref) {
  const { imageSrc, setImgArray, fixedRatio } = props;
  const [cropper, setCropper] = useState();
  const [cropperData, setCropperData] = useState({});
  const [open, setOpen] = useState(false);
  const [activeRatio, setActiveRatio] = useState(NaN);
  const [rotationDeg, setRotationDeg] = useState(0);
  const imgref = useRef();
  const activeRatioRef = useRef();
  activeRatioRef.current = activeRatio;

  useEffect(() => {
    setCropperData(imgref.current?.cropper?.getCropBoxData());
  }, [activeRatio]);

  useImperativeHandle(ref, () => ({
    setCroppedImage() {
      if (!cropper) {
        return;
      }

      imgref.current.cropper.getCroppedCanvas().toBlob((blob) => {
        setImgArray((prevState) => {
          let temp = [...prevState];
          temp[imageSrc.index] = {
            file: blob,
            url: URL.createObjectURL(blob),
            cropped: true,
          };

          return temp;
        });
      });
    },
  }));

  const initialiseCropper = (CropData) => {
    setCropper(
      new Cropper(imgref.current, {
        responsive: true,
        movable: false,
        scalable: false,
        zoomable: false,
        rotatable: true,
        ready() {
          let parentWidth = imgref.current.parentElement.clientWidth;
          let parentHeight = imgref.current.parentElement.clientHeight;

          if (!CropData) {
            let data = {
              left: 0,
              top: 0,
              height: parentHeight,
              width: parentWidth,
            };

            setCropperData(data);
            return this.cropper.setCropBoxData(data);
          }

          let newCropperData = {
            left: CropData.left * parentWidth,
            top: CropData.top * parentHeight,
            height: CropData.height * parentHeight,
            width: CropData.width * parentWidth,
          };

          newCropperData.left =
            parentWidth - newCropperData.left - newCropperData.width;

          setCropperData(newCropperData);
          return this.cropper.setCropBoxData(newCropperData);
        },
        autoCropArea: 1,
        minContainerWidth: 0,
        minContainerHeight: 0,
        minCropBoxHeight: 1,
        minCropBoxWidth: 1,
        aspectRatio: fixedRatio || activeRatioRef.current,
        cropend() {
          setCropperData(this.cropper.getCropBoxData());
        },
      })
    );
  };

  useEffect(() => {
    initialiseCropper();
  }, [imgref.current]);

  const handleAspectRatio = (val) => {
    imgref.current.cropper.setAspectRatio(val);
    setActiveRatio(val);
    setOpen(false);
  };

  const handleAspectRatioStyle = (val) => {
    if (activeRatio === val) {
      return {
        fontWeight: "bold",
      };
    } else
      return {
        fontWeight: "normal",
      };
  };

  function drawRotated(degrees) {
    let temp = { ...cropperData };
    setCropperData({});
    if (activeRatio !== 1) {
      setActiveRatio(NaN);
      activeRatioRef.current = NaN;
    }
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    let imgwidth = imgref.current.parentElement.clientWidth;
    let imgheight = imgref.current.parentElement.clientHeight;

    if (degrees == 90 || degrees == 270) {
      canvas.width = imgref.current.height;
      canvas.height = imgref.current.width;
    } else {
      canvas.width = imgref.current.width;
      canvas.height = imgref.current.height;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (degrees == 90 || degrees == 270) {
      ctx.translate(imgref.current.height / 2, imgref.current.width / 2);
    } else {
      ctx.translate(imgref.current.width / 2, imgref.current.height / 2);
    }
    ctx.rotate((degrees * Math.PI) / 180);
    ctx.drawImage(
      imgref.current,
      -imgref.current.width / 2,
      -imgref.current.height / 2
    );

    imgref.current.src = canvas.toDataURL("image/jpeg");
    imgref.current.cropper.destroy();

    let newCropperData = {
      left: temp.top / imgheight,
      top: temp.left / imgwidth,
      width: temp.height / imgheight,
      height: temp.width / imgwidth,
    };

    initialiseCropper(newCropperData);
  }

  return (
    <>
      <div
        style={{
          width: "100%",
          backgroundColor: "black",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "fit-content",
            maxWidth: "100%",
          }}
        >
          <img
            ref={imgref}
            src={imageSrc.url}
            style={{
              maxWidth: "100%",
              maxHeight: "300px",
            }}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "50px",
          width: "100%",
        }}
      >
        <Button
          variant="text"
          style={{
            width: "fit-content",
            font: "normal normal normal 12px/14px Work Sans",
          }}
          onClick={() => {
            if (imgref.current) {
              if (rotationDeg < 360) {
                setRotationDeg(rotationDeg + 90);
              } else {
                setRotationDeg(0);
              }
              drawRotated(90);
            }
          }}
        >
          <img
            src={rotateIcon}
            style={{
              marginRight: "10px",
            }}
          />{" "}
          {allWords.misc.rotate}
        </Button>
        {!fixedRatio && (
          <>
            <span
              style={{
                position: "relative",
              }}
            >
              <ClickAwayListener
                onClickAway={() => {
                  setOpen(false);
                }}
              >
                <Box>
                  <Button
                    variant="text"
                    style={{
                      width: "fit-content",
                      font: "normal normal normal 12px/14px Work Sans",
                      fontWeight: activeRatio ? "bold" : "normal",
                    }}
                    onClick={() => setOpen(true)}
                  >
                    <img
                      src={aspectratioIcon}
                      style={{
                        marginRight: "10px",
                      }}
                    />{" "}
                    {allWords.misc.maintainar}
                  </Button>
                  {open && (
                    <Paper
                      elevation={5}
                      sx={{
                        padding: "5px",
                        position: "absolute",
                        top: "-35px",
                        width: "100%",
                      }}
                    >
                      <Grid container>
                        <Grid
                          item
                          xs={3}
                          sx={{
                            textAlign: "center",
                          }}
                        >
                          <Button
                            variant="text"
                            sx={{
                              minWidth: "100%",
                              ...handleAspectRatioStyle(16 / 9),
                            }}
                            onClick={() => {
                              handleAspectRatio(16 / 9);
                            }}
                          >
                            16:9
                          </Button>
                        </Grid>
                        <Grid
                          item
                          xs={3}
                          sx={{
                            textAlign: "center",
                          }}
                        >
                          <Button
                            variant="text"
                            sx={{
                              minWidth: "100%",
                              ...handleAspectRatioStyle(4 / 3),
                            }}
                            onClick={() => {
                              handleAspectRatio(4 / 3);
                            }}
                          >
                            4:3
                          </Button>
                        </Grid>
                        <Grid
                          item
                          xs={3}
                          sx={{
                            textAlign: "center",
                          }}
                        >
                          <Button
                            variant="text"
                            sx={{
                              minWidth: "100%",
                              ...handleAspectRatioStyle(2 / 3),
                            }}
                            onClick={() => {
                              handleAspectRatio(2 / 3);
                            }}
                          >
                            2:3
                          </Button>
                        </Grid>
                        <Grid
                          item
                          xs={3}
                          sx={{
                            textAlign: "center",
                          }}
                        >
                          <Button
                            variant="text"
                            sx={{
                              minWidth: "100%",
                              ...handleAspectRatioStyle(1 / 1),
                            }}
                            onClick={() => {
                              handleAspectRatio(1 / 1);
                            }}
                          >
                            1:1
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  )}
                </Box>
              </ClickAwayListener>
            </span>
            <Button
              variant="text"
              style={{
                width: "fit-content",
                font: "normal normal normal 12px/14px Work Sans",
                fontWeight: activeRatio ? "normal" : "bold",
              }}
              onClick={() => handleAspectRatio(NaN)}
            >
              <img
                src={aspectratioIcon}
                style={{
                  marginRight: "10px",
                }}
              />{" "}
              {allWords.misc.customar}
            </Button>
          </>
        )}
      </div>
    </>
  );
});
