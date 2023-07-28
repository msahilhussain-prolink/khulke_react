import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { useDispatch, useSelector } from "react-redux";
import { REACT_APP_BASE_URL_CLOUDFRONT } from "../../constants/env";
import { getPopularData } from "../../redux/actions/popularAction/popularRt";
import PopularUI from "../PopularUI";
import "../PopularUI/style.css";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export default function PopularRT() {
  const popularRtData = useSelector((state) => state.popularRTs.popular);
  const dispatch = useDispatch();
  const [popularRT, setPopularRT] = useState(null);

  useEffect(() => {
    dispatch(getPopularData());
  }, []);

  useEffect(() => {
    if (popularRtData && popularRtData?.status === 200) {
      setPopularRT(popularRtData?.data);
    }
  }, [popularRtData]);

  const AllCarouselSlides = (popularRT) => {
    const slides = [];
    for (let i = 0; i < popularRT.length; i = i + 2) {
      const slide = [];
      for (let j = 0; j < 2; j++) {
        if (i + j >= popularRT.length) break;
        const item = popularRT[i + j];
        slide.push(
          <PopularUI
            showParticipants={false}
            key={i + j}
            cover_img={
              item?.media?.length > 0 &&
              `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${item?.owner?.user_id}/roundtable/${item?.["_id"]}/profile/${item?.["media"]?.[0]?.["metadata"]?.["tempFilename"]}`
            }
            title={item?.name}
            media_recording={
              item?.media_recording?.length > 0 ? item?.media_recording : null
            }
            live={item?.active_flag}
            past={item?.happened_flag}
            is_cancelled={item?.is_cancelled}
            timestamp={item.time}
            rt_details={item}
            rec_owner_flag={
              item?.recording?.[0]?.owner_flag === 1 ? true : false
            }
            rec_start_flag={
              item?.recording?.[0]?.start_recording === 1 ? true : false
            }
            rec_end_flag={
              item?.recording?.[0]?.soft_end_recording === 0 ? true : false
            }
            rt_type={item.r_type}
            rt_nature={item.open_to_all}
            rt_id={item?._id}
            item={item}
            moderator={item?.moderator}
            owner_details={item?.owner}
            speakers={item?.speakers}
            join_count={item?.happened_flag === true ? item?.["join_count"] : 0}
            viewer_count={
              item?.active_flag === true ? item?.["viewer_count"] : ""
            }
            invitees_count={
              item?.upcoming_flag === true
                ? item?.["invite_count"] - item?.["rejected_count"]
                : ""
            }
            user_views_count={item?.user_views_count}
            ext={
              item?.media_recording?.length > 0
                ? item?.media_recording?.[0]?.["metadata"]?.["ext"]
                : null
            }
          />
        );
      }
      slides.push(slide);
    }

    return slides;
  };

  return (
    <>
      <Typography
        style={{
          fontSize: "20px",
          color: "#11141C",
          marginLeft: "12px",
          marginBottom: "14px",
        }}
      >
        Popular RoundTables
      </Typography>
      <div
        style={{
          position: "relative",
          zIndex: 22,
        }}
      >
        <Carousel
          autoPlay={true}
          interval={10000}
          animation={"slide"}
          indicators={false}
          navButtonsAlwaysVisible={true}
          swipe={true}
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
                    opacity: "1 !important",
                  },
                }}
                ref={(el) => {
                  if (el) {
                    if (prev) {
                      el.style.setProperty("left", "0.6rem", "important");
                    }
                    if (next) {
                      el.style.setProperty("right", "0px", "important");
                    }
                  }
                }}
                variant={"contained"}
                hidden={
                  popularRT?.length === undefined || popularRT?.length > 2
                    ? false
                    : true
                }
              >
                {next && <NavigateNextIcon />}
                {prev && <NavigateBeforeIcon />}
              </Button>
            );
          }}
           >
          {AllCarouselSlides(popularRT || [])?.map((slide, index) => {
            return (
              <div className="popularRTSlide" key={slide}>
                {slide}
              </div>
            );
          })}
        </Carousel>
      </div>
    </>
  );
}
