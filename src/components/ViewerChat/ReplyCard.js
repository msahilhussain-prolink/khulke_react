import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Grid } from "@mui/material";
import { POST_API_BASE_URL } from "../../constants/env";
import DocsContainer from "./AddCommentDialog/DocsContainer";
import ReactPlayer from "react-player";

import PostImg1 from "../../assets/images/post_img1.png";

import {
  ViewersDiv,
  Header,
  Body,
  CmtTitle,
  PostContent,
  PostImgContainer,
  SubHeader,
  SubHeaderMain,
  UserNameContainer,
  UserAvatar,
  FullNameInPanel,
} from "./style";
import { Username } from "../../global_styles/style";
import { useNavigate } from "react-router-dom";
import { REACT_APP_BASE_URL_FOR_USER } from "../../constants/env";
import axios from "axios";
import { auto_login_continue, replaceURLs } from "../../utils/utils";
import Spinner from "../Spinner";
import { IconButton } from "@mui/material";
import Dialog from "../common/Dialog";
import {
  CancelOutlined,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@material-ui/icons";
import UserProfile from "../UserProfile";

const ReplyCard = ({
  cmt_id,
  name,
  username,
  formatted_created_at,
  video,
  title,
  audio,
  pdf,
  ppt,
  doc,
  excel,
  videoFile,
  docsFile,
  audioFile,
  imgSrc,
  imgData,
  complete_url,
  youtube_url,
  cmt_parent,
  type,
}) => {
  const navigate = useNavigate();

  const [postImgSrc, setPostImgSrc] = useState("");
  const [openImage, setOpenImage] = useState(false);

  const imgRef = useRef();

  const [imgPreview, setImgPreview] = useState([]);
  const [imgIndex, setImgIndex] = useState(0);
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [metadata, setMetadata] = useState({
    title: null,
    image_url: null,
  });

  const getMetaData = async (target_url) => {
    var data = JSON.stringify({
      target_url: target_url,
    });

    var config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/${localStorage.anonymous_user
        ? "anonymous/get_meta_data"
        : "get_meta_data/"
        }`,
      headers: {
        Authorization: `Bearer ${localStorage.access || JSON.parse(localStorage.anonymous_user).token
          }`,
        "Content-Type": "application/json",
      },
      data: data,
    };
    setMetadataLoading(true);
    await axios(config)
      .then(async function (response) {
        setMetadataLoading(false);
        setMetadata(response.data);
      })
      .catch(async function (error) {
        const response = error.response;
        if (!response) return;
        if (response.status === 401) {
          return await auto_login_continue(() => getMetaData(target_url));
        }
        setMetadataLoading(false);
      });
  };

  useEffect(() => {
    if (complete_url) {
      getMetaData(complete_url[0]?.complete_url);
    }

    if (!imgPreview[imgIndex]) {
      setOpenImage(false);
    }
  }, [title, imgIndex]);

  const handleNext = () => {
    if (imgPreview[imgIndex]) {
      setImgIndex(imgIndex + 1);
    }
  };

  const handlePrevious = () => {
    setImgIndex(imgIndex - 1);
  };

  return (
    <>
      <ViewersDiv style={{ marginBottom: "10px" }}>
        <Header>
          <SubHeaderMain>
            <UserProfile
              username={username}
              onClick={() =>
                window.open(
                  `${window.location.origin}/profile/${username}/posts`,
                  "_blank"
                )
              }
            />
            <SubHeader>
              <FullNameInPanel>{name || "Deleted User"}</FullNameInPanel>
              <UserNameContainer>
                <Username>
                  <Link
                    to={`/profile/${username}/posts`}
                    style={{ textDecoration: "none" }}
                    target="_blank"
                  >
                    @{username || "username"}
                  </Link>
                </Username>
                {/* <VscDebugStackframeDot className="dot_icon" />
                <p>{formatted_created_at || "2 min ago"}</p> */}
              </UserNameContainer>
            </SubHeader>
          </SubHeaderMain>
        </Header>

        <Body className="mb-3">
          {youtube_url && (
            <>
              <ReactPlayer
                className="react-player"
                width="100%"
                height="300px"
                controls={true}
                url={youtube_url[0]?.complete_url}
              />
            </>
          )}
          {metadata ? (
            <>
              {metadata?.title && (
                <a href={title} target="_blank" rel="noreferrer">
                  {metadata?.title}
                </a>
              )}
              {metadata?.image_url && (
                <Grid container>
                  <Grid item xs={12}>
                    <PostImgContainer
                      src={metadata?.image_url}
                      onClick={() => {
                        setPostImgSrc(`${metadata?.image_url}`);
                        setOpenImage(true);
                      }}
                    />
                  </Grid>
                </Grid>
              )}
              {metadata?.content && <CmtTitle>{metadata?.content}</CmtTitle>}
            </>
          ) : (
            <CmtTitle
              dangerouslySetInnerHTML={{
                __html: replaceURLs(title),
              }}
            ></CmtTitle>
          )}
          {title && (
            <CmtTitle>
              {title !== "undefined" && (
                <>
                  {title?.includes("https") ? (
                    ""
                  ) : (
                    <div
                      dangerouslySetInnerHTML={
                        title !== "undefined"
                          ? { __html: replaceURLs(title) }
                          : { __html: "" }
                      }
                    />
                  )}
                </>
              )}
            </CmtTitle>
          )}
          {metadataLoading && (
            <>
              <Spinner />

              <br />
            </>
          )}
          {/* pdf */}
          {pdf && (
            <>
              <DocsContainer
                docsFilePath={`${POST_API_BASE_URL}/post-media/media/${docsFile}`}
                docsFile={docsFile}
              />
            </>
          )}

          {ppt && (
            <>
              <DocsContainer
                docsFilePath={`${POST_API_BASE_URL}/post-media/media/${docsFile}`}
                pptDoc={docsFile}
              />
            </>
          )}
          {excel && (
            <>
              <DocsContainer
                docsFilePath={`${POST_API_BASE_URL}/post-media/media/${docsFile}`}
                excelDoc={docsFile}
              />
            </>
          )}
          {doc && (
            <>
              <DocsContainer
                docsFilePath={`${POST_API_BASE_URL}/post-media/media/${docsFile}`}
                wordDoc={docsFile}
              />
            </>
          )}

          {videoFile ? (
            <video
              width="100%"
              controls
              src={`${POST_API_BASE_URL}/post-media/media/${videoFile}`}
              style={{ borderRadius: "0.5rem", maxHeight: 350 }}
            />
          ) : (
            <PostContent>
              {imgSrc ? (
                <>
                  <PostImgContainer src={PostImg1} />
                </>
              ) : (
                <>
                  <Grid container spacing={2}>
                    {imgData?.map((item, index) => (
                      <>
                        {imgData?.length === 1 && (
                          <Grid item xs={12} key={index}>
                            <PostImgContainer
                              src={`${POST_API_BASE_URL}/post-media/image/${item?.name}`}
                              onClick={() => {
                                setPostImgSrc(
                                  `${POST_API_BASE_URL}/post-media/image/${item?.name}`
                                );
                                setOpenImage(true);
                              }}
                            />
                          </Grid>
                        )}
                        {imgData?.length === 2 && (
                          <Grid style={{ paddingTop: "8px" }} item xs={6}>
                            <PostImgContainer
                              src={`${POST_API_BASE_URL}/post-media/image/${item?.name}`}
                              onClick={() => {
                                setPostImgSrc(
                                  `${POST_API_BASE_URL}/post-media/image/${item?.name}`
                                );
                                setOpenImage(true);
                              }}
                            />
                          </Grid>
                        )}
                        {imgData?.length === 3 && (
                          <Grid style={{ paddingTop: "8px" }} item xs={6}>
                            <PostImgContainer
                              src={`${POST_API_BASE_URL}/post-media/image/${item?.name}`}
                              onClick={() => {
                                setPostImgSrc(
                                  `${POST_API_BASE_URL}/post-media/image/${item?.name}`
                                );
                                setOpenImage(true);
                              }}
                            />
                          </Grid>
                        )}
                        {imgData?.length === 4 && (
                          <Grid style={{ paddingTop: "8px" }} item xs={6}>
                            <PostImgContainer
                              src={`${POST_API_BASE_URL}/post-media/image/${item?.name}`}
                              onClick={() => {
                                setPostImgSrc(
                                  `${POST_API_BASE_URL}/post-media/image/${item?.name}`
                                );
                                setOpenImage(true);
                              }}
                            />
                          </Grid>
                        )}
                      </>
                    ))}
                  </Grid>
                </>
              )}
            </PostContent>
          )}

          {type === "POLL_ROUNDTABLE" && (
            <>
              <span
                onClick={() => {
                  navigate(`/post/${cmt_id}`);
                }}
                className="show_all_replyline_2"
              >
                {allWords.misc.showthispoll}
              </span>
            </>
          )}
        </Body>
      </ViewersDiv>

      {/* openImage */}
      {openImage && (
        <Dialog
          hiddenHeader
          title={""}
          open={openImage}
          setOpen={setOpenImage}
          style={{ padding: 0 }}
        >
          <div
            style={{
              width: 705,
              position: "absolute",
              zIndex: 99999,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            <IconButton
              style={{}}
              onClick={() => {
                setOpenImage(false);
              }}
            >
              <CancelOutlined color="white" />
            </IconButton>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {imgPreview[imgIndex] && imgPreview.length > 1 && (
              <>
                <IconButton
                  style={{ marginRight: "1rem" }}
                  onClick={() => {
                    handlePrevious(imgPreview);
                  }}
                >
                  <KeyboardArrowLeft />
                </IconButton>
              </>
            )}
            {postImgSrc ? (
              <img
                ref={imgRef}
                src={postImgSrc}
                alt="images"
                style={{
                  width: 700,
                  height: 600,
                  borderRadius: 8,
                }}
              />
            ) : (
              <>
                {imgPreview[imgIndex]?.name ? (
                  <img
                    ref={imgRef}
                    src={`${POST_API_BASE_URL}/post-media/image/${imgPreview[imgIndex]?.name}`}
                    alt="images"
                    style={{
                      width: 700,
                      height: 600,
                      borderRadius: 8,
                    }}
                  />
                ) : (
                  ""
                )}
              </>
            )}
            {imgPreview[imgIndex] && imgPreview.length > 1 && (
              <>
                <IconButton
                  style={{ marginLeft: "1rem" }}
                  onClick={() => handleNext(imgPreview)}
                >
                  <KeyboardArrowRight />
                </IconButton>
              </>
            )}
          </div>
        </Dialog>
      )}
    </>
  );
};

export default ReplyCard;
