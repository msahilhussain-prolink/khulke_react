import React, { useEffect, useState } from "react";
import {
  POST_API_BASE_URL,
  REACT_APP_BASE_URL_FOR_USER,
} from "../../constants/env";
import { Grid, IconButton } from "@mui/material";
import AudioContainer from "./AddPostDialog/AudioContainer";
import DocsContainer from "./AddPostDialog/DocsContainer";
import ReactPlayer from "react-player";
import { auto_login_continue, replaceURLs } from "../../utils/utils";
import PostImg1 from "../../assets/images/post_img1.png";
import Spinner from "../Spinner";
import { allWords } from "../../App";

import {
  PostDiv,
  Header,
  Body,
  PostTitle,
  PostContent,
  PostImgContainer,
  SubHeader,
  SubHeaderMain,
  UserNameContainer,
} from "./style";
import { FullName, Username } from "../../global_styles/style";
import Dialog from "../common/Dialog";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  CancelOutlined,
  FiberManualRecord,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@material-ui/icons";
import UserProfile from "../UserProfile";
import GoogleTranslate from "../GoogleTranslate";
import PostImages from "./ViewImages/PostImages";
import OpenImage from "./ViewImages/OpenImage";
import PostVideo from "./PostVideo";

const ReplyCard = ({
  post_id,
  name,
  username,
  formatted_created_at,
  title,
  pdf,
  videoFile,
  docsFile,
  audioFile,
  imgSrc,
  imgData,
  post_parent_id,
  complete_url,
  youtube_url,
  excel,
  doc,
  ppt,
  type,
  lang,
  src,
}) => {
  const navigate = useNavigate();
  const imgRef = React.useRef();
  const [postImgSrc, setPostImgSrc] = useState("");
  const [openImage, setOpenImage] = useState(false);

  const [imgPreview, setImgPreview] = React.useState([]);
  const [imgIndex, setImgIndex] = useState(0);
  const [metadataLoading, setMetadataLoading] = useState(false);

  const [metadata, setMetadata] = useState({
    title: null,
    image_url: null,
  });

  const getMetaData = async (target_url) => {
    const data = JSON.stringify({
      target_url: target_url,
    });

    const config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_USER}/${
        localStorage.anonymous_user
          ? "anonymous/get_meta_data"
          : "get_meta_data/"
      }`,
      headers: {
        Authorization: `Bearer ${
          localStorage.access || JSON.parse(localStorage.anonymous_user).token
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
        if (!response) return setMetadataLoading(false);
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
    <div id="div_inside_quotted">
      <PostDiv
        onClick={() => {
          navigate(`/post/${post_parent_id}`);
        }}
        style={{ marginTop: "-10px" }}
      >
        <Header>
          <SubHeaderMain>
            <UserProfile
              username={username}
              onClick={() => {
                navigate(`/profile/${username}/posts`);
              }}
            />
            <SubHeader>
              <FullName className="name_div">
                <Link
                  to={`/profile/${username}/posts`}
                  style={{ textDecoration: "none" }}
                >
                  {name || "Anonymous"}
                </Link>
              </FullName>
              <UserNameContainer className="username_div">
                <Username>
                  <Link
                    to={`/profile/${username}/posts`}
                    style={{ textDecoration: "none" }}
                  >
                    {username || "username"}
                  </Link>
                </Username>
                <FiberManualRecord className="dot_icon" />
                <p>{formatted_created_at || "2 min ago"}</p>
              </UserNameContainer>
            </SubHeader>
          </SubHeaderMain>
        </Header>

        <Body>
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
          {metadata.title ? (
            <div className="meta_cont_in_post">
              <a target="_blank" rel="noreferrer" href={title}>
                {metadata?.image_url && (
                  <Grid container>
                    <Grid item xs={12}>
                      <PostImgContainer src={metadata?.image_url} />
                    </Grid>
                  </Grid>
                )}
                {metadata?.title && (
                  <p className="meta_title">{metadata?.title} </p>
                )}

                {metadata?.content && (
                  <p className="meta_content">{metadata?.content}</p>
                )}
              </a>
            </div>
          ) : (
            ""
          )}

          <PostTitle>
            {title !== "undefined" && (
              <>
                {title?.includes("https") ? (
                  ""
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: replaceURLs(title),
                    }}
                  />
                )}
              </>
            )}
          </PostTitle>
          {metadataLoading && (
            <>
              <Spinner />

              <br />
            </>
          )}

          {audioFile ? (
            <>
              <AudioContainer
                audioFilePath={`${POST_API_BASE_URL}/post-media/media/${audioFile}`}
              />
            </>
          ) : (
            <></>
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
            <PostVideo src={src} post_id={post_id} />
          ) : (
            <PostImages
              PostImg={PostImg1}
              imgData={imgData}
              imgSrc={imgSrc}
              setImgIndex={setImgIndex}
              setImgPreview={setImgPreview}
              setOpenImage={setOpenImage}
              isPost={false}
            />
          )}
          {type === "POLL" && (
            <>
              <span
                onClick={() => {
                  navigate(`/post/${post_id}`);
                }}
                className="show_all_replyline_2"
              >
                {allWords.misc.showthispoll}
              </span>
            </>
          )}

          {window.location.pathname.includes("post") &&
            (lang == "en" || lang == "hi" || lang == "ta") &&
            JSON.parse(localStorage.getItem("current_user"))?.[
              "display_language"
            ] !== lang && (
              <>
                <br />
                <GoogleTranslate lang={lang} post_id={post_id} />
              </>
            )}
        </Body>
      </PostDiv>

      {/* openImage */}
      {openImage && (
        <OpenImage
          openImage={openImage}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          imgIndex={imgIndex}
          imgRef={imgRef}
          imgPreview={imgPreview}
          postImgSrc={postImgSrc}
          setOpenImage={setOpenImage}
        />
      )}
    </div>
  );
};

export default ReplyCard;
