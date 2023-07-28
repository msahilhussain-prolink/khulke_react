import { Grid } from "@mui/material";
import { POST_API_BASE_URL } from "../../../constants/env";
import { PostContent, PostImgContainer, PostMultiImgContainer } from "../style";
import "../style.css";
import React from "react";
import ImgDataPost from "./ImgDataPost";

const PostImages = ({ imgSrc, PostImg, imgData, setOpenImage, setImgPreview, setImgIndex, isPost = true }) => {

  const imgContainer = (length, itemData, index) => {
    switch (length) {
      case 4: {
        return (
          <Grid sx={{ padding: "0.3rem" }} item xs={6}>
            <ImgDataPost
              itemData={itemData}
              imgData={imgData}
              index={index}
              setImgIndex={setImgIndex}
              setImgPreview={setImgPreview}
              setOpenImage={setOpenImage}
              isPost={isPost}
            />
          </Grid>
        )
      }
      case 3: {
        return (
          <Grid sx={{ padding: "0.5rem" }} item xs={4}>
            <ImgDataPost
              itemData={itemData}
              imgData={imgData}
              index={index}
              setImgIndex={setImgIndex}
              setImgPreview={setImgPreview}
              setOpenImage={setOpenImage}
              isPost={isPost}
            />
          </Grid>
        )
      }
      case 2: {
        return (
          <Grid sx={{ padding: "0.5rem" }} item xs={6}>
            <ImgDataPost
              itemData={itemData}
              imgData={imgData}
              index={index}
              setImgIndex={setImgIndex}
              setImgPreview={setImgPreview}
              setOpenImage={setOpenImage}
              isPost={isPost}
            />
          </Grid>
        )
      }
      default: {
        return (
          <Grid item spacing={1} xs={12} key={itemData?.name}>
            <ImgDataPost
              style={{ width: "max-content" }}
              itemData={itemData}
              imgData={imgData}
              index={index}
              setImgIndex={setImgIndex}
              setImgPreview={setImgPreview}
              setOpenImage={setOpenImage}
              isPost={isPost}
            >
              {isPost && itemData?.name && (
                <>
                  {itemData?.caption && (
                    <header>
                      <p style={{ top: "6px" }}>
                        {itemData?.caption}
                      </p>
                    </header>
                  )}
                </>
              )}
            </ImgDataPost>
          </Grid>
        )
      }
    }
  }


  return (
    <PostContent>
      {imgSrc ? (
        <>
          <PostImgContainer src={PostImg} />
        </>
      ) : (
        <>
          <Grid container>
            {imgData?.map((item, index) => (
              imgContainer(imgData.length, item, index)
            ))}
          </Grid>
        </>
      )}
    </PostContent>
  )
}

export default PostImages;