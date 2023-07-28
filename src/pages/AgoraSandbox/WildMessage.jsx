import React, { useState } from "react";
import "./video.css";
import Carousel from "react-material-ui-carousel";
import { POST_API_BASE_URL } from "../../constants/env";
// --------------------------
// assets
import ChatMenuIcon from "../../assets/icons/post_menu_white.svg";
import { styled } from "@mui/material/styles";
import {
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import pdfIcon from "../../assets/icons/pdf_icon.svg";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import DocsContainer from "../../components/ViewerChat/AddCommentDialog/DocsContainer";
import ModalImage from "react-modal-image";
import ToastHandler from "../../utils/ToastHandler";
import UserProfile from "../../components/UserProfile";
import { allWords } from "../../App";
import VIPComp from "../../components/VipComp";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { memo } from "react";
import { useDispatch } from "react-redux";
import { updateSelectedWildMsg } from "../../redux/actions/LiveRT";

const getChipStyle = (web) => {
  if(web){
    return {
      borderRadius: "5px",
      position: "absolute",
      bottom: "5px",
      left:"20px",
      fontSize:"13px",
      minWidth:"80px",
      backgroundColor: "#333333",
      height:"20px",
      color: "white",
      "& .MuiChip-labelMedium" : {
        paddingLeft:"12px",
        paddingRight:"12px",
      }
    }
  }else{
    return {
      borderRadius: "5px",
      position: "absolute",
      bottom: "5px",
      left:  "5px",
      fontSize:  "8px",
      minWidth:  "50px",
      backgroundColor: "#333333",
      height:  "15px",
      color: "white",
      "& .MuiChip-labelMedium" : {
        paddingLeft: "0px",
        paddingRight: "0px",
      }
    }
  }
}

let wildColors = [
  "linear-gradient(94deg, #4158D0 0%, #C850C0 51%, #FFCC70 100%)",
  "linear-gradient(94deg, #8EC5FC 0%, #E0C3FC 100%)",
  "linear-gradient(94deg, #3E965E 0%, #66B984 100%)",
  "linear-gradient(94deg, #FAD961 0%, #F76B1C 100%)",
  "linear-gradient(94deg, #4158D0 0%, #C850C0 100%)",
  "linear-gradient(94deg, #4158D0 0%, #66B984 100%)",
  "linear-gradient(94deg, #FBAB7E 0%, #FBAB7E 100%)",
  "linear-gradient(94deg, #FF9A8B 0%, #FF6A88 51%, #FF99AC 100%)",
];

const WildMessage = ({ wmData = [], windowWidth }) => {
  const webSize = windowWidth > 768;
  const [currentWildCardDetail, setcurrentWildCardDetail] = useState(
    wmData[0] ?? {}
  );

  let wmDataArray = wmData
    .filter((el) => el);


  return wmDataArray && wmDataArray.length > 0 ? (
    <div style={{ height: webSize ? "100px": "50px" }}>
      <>
        <div className="wild-cont-image-outer">
          <div className="user-profile-wrapper" style={{ marginTop: webSize ? "-15px": "-5px"  }}>
            <UserProfile
              username={currentWildCardDetail?.username}
              width={webSize ? "120px": "60px"}
              height={webSize ? "120px": "60px"}
              borderRadius="50%"
              className={`profile-circle wild-cont-image-inner`}
            />
            {currentWildCardDetail?.username ? (
              <Chip
                sx={{
                  ...getChipStyle(webSize)
                }}
                label={`@${currentWildCardDetail?.username}`}
              />
            ) : null}
          </div>
        </div>
        <div className="carousel-container container-background">
          <div style={{ paddingLeft: webSize ? "120px": "50px" }}>
            <WildCardCarouselComponent wmDataArray={wmDataArray} setcurrentWildCardDetail={setcurrentWildCardDetail} windowWidth={windowWidth}/>
          </div>
        </div>
      </>
    </div>
  ) : null;
};
export default memo(WildMessage);

export const WildCardCarouselComponent = ({ wmDataArray, setcurrentWildCardDetail = () => {}, windowWidth = 1440 }) => {
  const webSize = windowWidth > 768;
  const wildCardChangeHandler = (now) => {
    const currentWildData = wmDataArray[now] ?? {};
    setcurrentWildCardDetail(currentWildData);
  };

  return (
    <Carousel
      IndicatorIcon={<HorizontalRuleIcon />}
      NavButton={({ onClick, className, style, next, prev }) => {
        return (
          <Button
            onClick={onClick}
            className={className}
            style={{
              ...style,
              backgroundColor: "#494949",
              opacity: ".7",
              width: "30px",
              height: "30px",
              minWidth: "0px",
              top: "50%",
              transform: "translateY(-50%)",
              borderRadius: "50%",
            }}
            sx={{
              "&.MuiButton-root:hover": {
                backgroundColor: "#494949 !important",
                opacity: "1 !important", // Set the same background color as the default
              },
            }}
            ref={(el) => {
              if (el) {
                if (prev) {
                  el.style.setProperty("left", "0rem", "important");
                }
                if (next) {
                  el.style.setProperty("right", "0px", "important");
                }
              }
            }}
            variant={"contained"}
          >
            {next && <NavigateNextIcon />}
            {prev && <NavigateBeforeIcon />}
          </Button>
        );
      }}
      navButtonsAlwaysInvisible={wmDataArray.length === 1}
      autoPlay="false"
      onChange={(now) => {
        wildCardChangeHandler(now);
      }}
      activeIndicatorIconButtonProps={{
        style: {
          color: "white",
        },
      }}
      indicatorIconButtonProps={{
        style: { padding: "2px" },
      }}
      indicators={false}
      interval="180000"
      sx={{
        paddingLeft: "3%",
        height: webSize ? "100px" : "50px"
      }}
    >
      {wmDataArray.map((item, i) => (
          <ItemNew i={i} key={i} item={item} wmData={wmDataArray} />
      ))}
    </Carousel>
  );
};

const ItemNew = ({ item, _wmData }) => {
  const dispatch = useDispatch();
  const handleWildMsgClick = () => {
    dispatch(updateSelectedWildMsg(item));
  };

  return (
    <>
      <div className="main-container-wild-cont">
        <div className="wild-cont-outer-new" onClick={handleWildMsgClick}>
          <div
            className="left-container-message"
            style={{ width: item.media_type ? "80%" : "100%" }}
          >
            <p className="raw-wild-text">{item?.raw_text}</p>
          </div>
          {item.media_type && (
            <div className="right-container-message">
              {item.media_type === "IMAGE" && (
                <div className="userImg-wild-left">
                  <img
                    src={`${POST_API_BASE_URL}/post-media/image/${item.media[0].name}`}
                    alt="user posted media in comment"
                    width="100%"
                    height="100%"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              )}

              {item.media_type === "PDF" && (
                <div className="userImg-wild-left">
                  <img
                    src={pdfIcon}
                    alt="icon for pdf"
                    style={{
                      width: "100%",
                      height: "90%",
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

function Item({ item, wmData, modalOpen, setModalOpen, i }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCopy = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/post/${item?.post_id}`)
      .then(
        function () {
          /* clipboard successfully set */
          ToastHandler("sus", allWords.misc.succcopied);
        },
        function () {
          ToastHandler("dan", "Failed. try again!");
        }
      );
  };

  return (
    <>
      <div
        className="wild-cont-outer"
        style={{ background: `${wildColors[i % 8]}` }}
      >
        <div
          className="flexCont-in-wc"
          style={{
            background: `${wildColors[i]}`,
          }}
        >
          <div className="left-content-wm">
            {item.media_type === "IMAGE" && (
              <div className="userImg-left">
                <img
                  src={`${POST_API_BASE_URL}/post-media/image/${item.media[0].name}`}
                  alt="user posted media in comment"
                  width="100%"
                  height="100%"
                  style={{ objectFit: "contain" }}
                />
              </div>
            )}

            {item.media_type === "PDF" && (
              <div className="userImg-left">
                <img
                  src={pdfIcon}
                  alt="icon for pdf"
                  style={{
                    width: "100%",
                    height: "90%",
                  }}
                />
              </div>
            )}

            <div className="content-cont">
              <div className="name-div">
                <Link
                  to={`/profile/${item.username}/posts`}
                  style={{
                    textDecoration: "none",
                    color: "white",
                  }}
                  target="_blank"
                >
                  @{item !== undefined && item.username}
                </Link>
                <VIPComp user_type={item?.user_type} />
              </div>
              <div className="text-div">
                {item !== undefined && item.raw_text}
              </div>
            </div>
          </div>

          {/* ṛight part */}
          <div className="right-content-wm">
            {/* attach handler for three dots in below line */}
            <div
              className="threeDots"
              onClick={handleClick}
              id="basic-button"
              aria-controls="basic-menu"
              aria-haspopup="true"
              //   aria-expanded={open ? "true" : undefined}
              size="small"
            >
              <img alt="" src={ChatMenuIcon} height="24px" width="auto" />
            </div>

            <div
              className="viewDiv"
              onClick={() => {
                localStorage.setItem("p_id", item?.post_id);
                setModalOpen(true);
              }}
            >
              view
            </div>
            <CustomizedDialogs
              item={item}
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              wmData={wmData}
            />
          </div>
        </div>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            justifyContent: "left",
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.32))",
              mt: 1.5,

              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 13,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <div
            style={{
              width: 200,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <MenuItem
              style={{
                width: "100%",
                padding: "0.5rem",
                margin: "0",
              }}
              onClick={handleCopy}
            >
              {allWords.misc.livert.copy}
            </MenuItem>
          </div>
        </Menu>
        {/* <button onClick={() => getMetaData()}>something</button> */}
      </div>
    </>
  );
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle
      {...other}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontWeight: "bolder",
        fontFamily: "WorkSans-Bold",
      }}
    >
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            // position: "absolute",
            // right: 0,
            // top: 0,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

// get meta data
// const getMetaData = async (complete_url) => {
//   var data = JSON.stringify(complete_url);

//   var config = {
//     method: "post",
//     url: `${REACT_APP_BASE_URL_FOR_USER}/get_meta_data`,
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("access")}`,
//       "Content-Type": "application/json",
//     },
//     data: complete_url,
//   };
//   await axios(config)
//     .then((response) => {
//     })
// };

// function validURL(str) {
//   var pattern = new RegExp(
//     "^(https?:\\/\\/)?" + // protocol
//       "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
//       "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
//       "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
//       "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
//       "(\\#[-a-z\\d_]*)?$",
//     "i"
//   ); // fragment locator
//   return !!pattern.test(str);
// }

function CustomizedDialogs({ item, wmData, modalOpen, setModalOpen }) {
  // const [metadata, setMetadata] = useState({
  //   title: null,
  //   image_url: null,
  // });
  // const handleClickOpen = () => {
  //   setModalOpen(true);
  // };
  const handleClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div>
        <Dialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={modalOpen}
          className="Wildcard-modal-popup"
          PaperProps={{
            style: {
              minWidth: "32vw",
              height: "auto",
              minHeight: "45vh",
              borderRadius: "1rem",
              width: "50%",
            },
          }}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
            className="widthWmDiv"
          >
            {allWords.misc.livert.wm}
          </BootstrapDialogTitle>
          <DialogContent dividers className="specialName">
            {/* {localStorage.getItem("p_id") ===} */}
            {wmData
              .filter((val) => {
                if (localStorage.getItem("p_id")) {
                  if (val.post_id === localStorage.getItem("p_id")) {
                    return val;
                  }
                }
              })
              .map((item) => (
                <>
                  <div className="usercontent">
                    <div className="leftImgCont">
                      <UserProfile
                        username={item.username}
                        alt="user profile"
                        width="100%"
                        height="100%"
                      />
                    </div>

                    <div className="rightUserContent">
                      <p className="nameDiv">{item.name}</p>
                      <Link
                        to={`/profile/${item.username}/posts`}
                        target="_blank"
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        <Typography gutterBottom className="usernameDiv">
                          @{item.username}
                        </Typography>
                      </Link>
                    </div>
                  </div>
                  <div className="realContent">
                    <Typography gutterBottom className="rawText">
                      {item.raw_text}
                      {/* {validURL(item.raw_text)
                        ? getMetaData(item.raw_text)
                        : item.raw_text} */}
                    </Typography>
                  </div>
                  {item.media_type === "IMAGE" && (
                    <div className="imgContwm">
                      {/* <ModalImage
                        className="hellowmt" */}
                      {/* style={{maxHeight:"350px !important",objectFit:"contain !important"}} */}
                      <img
                        className="hellowmt"
                        src={`${POST_API_BASE_URL}/post-media/image/${item.media[0].name}`}
                      />
                      {/* large={`${POST_API_BASE_URL}/post-media/image/${item.media[0].name}`} */}
                      {/* hideDownload={true} */}
                      {/* /> */}
                    </div>
                  )}
                  {item?.media_type === "PDF" && (
                    <>
                      <DocsContainer
                        thumbnail={`${POST_API_BASE_URL}/post-media/frame/${item.media[0]?.name}`}
                        docsFilePath={`${POST_API_BASE_URL}/post-media/media/${item.media[0]?.name}`}
                        docsFile={item?.media?.[0].extra?.orignalFilename}
                      />
                    </>
                  )}

                  {item?.media_type === "PPTX" && (
                    <>
                      <DocsContainer
                        thumbnail={`${POST_API_BASE_URL}/post-media/frame/${item.media[0]?.name}`}
                        docsFilePath={`${POST_API_BASE_URL}/post-media/media/${item.media[0]?.name}`}
                        pptDoc={item?.media?.[0].extra?.orignalFilename}
                      />
                    </>
                  )}
                  {item?.media_type === "XLS" && (
                    <>
                      <DocsContainer
                        thumbnail={`${POST_API_BASE_URL}/post-media/frame/${item.media[0]?.name}`}
                        docsFilePath={`${POST_API_BASE_URL}/post-media/media/${item.media[0]?.name}`}
                        excelDoc={item?.media?.[0].extra?.orignalFilename}
                      />
                    </>
                  )}
                  {item?.media_type === "DOC" && (
                    <>
                      <DocsContainer
                        thumbnail={`${POST_API_BASE_URL}/post-media/frame/${item.media[0]?.name}`}
                        docsFilePath={`${POST_API_BASE_URL}/post-media/media/${item.media[0]?.name}`}
                        wordDoc={item?.media?.[0].extra?.orignalFilename}
                      />
                    </>
                  )}
                </>
              ))}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
