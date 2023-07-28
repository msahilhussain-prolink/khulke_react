import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { useDispatch, useSelector } from "react-redux";
import { REACT_APP_BASE_URL_CLOUDFRONT } from "../../constants/env";
import { getPopularShowData } from "../../redux/actions/popularAction/popularShows";
// Assets
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import "../PopularUI/style.css";
// Comps
import { allWords } from "../../App";
import PopularUI from "../PopularUI";
import UserProfile from "../UserProfile";
import VipComp from "../VipComp";

export default function PopularShows() {
  const popularRtData = useSelector((state) => state.popularShows.popular);
  const dispatch = useDispatch();
  const [popularRT, setPopularRT] = useState(null);

  useEffect(() => {
    dispatch(getPopularShowData());
  }, []);

  useEffect(() => {
    if (popularRtData && popularRtData?.status === 200) {
      setPopularRT(popularRtData?.data);
    }
  }, [popularRtData]);

  return (
    <div
      style={{
        border: "1px solid #e4e9f0",
        padding: "12px",
        borderRadius: "10px",
        marginTop: "20px",
      }}
      className="custom_popular"
    >
      <Typography
        style={{
          fontSize: "20px",
          color: "#11141C",
          marginLeft: "12px",
          marginBottom: "14px",
          fontWeight: "600px",
        }}
      >
        {allWords.th.popularHeading}
      </Typography>
      <div className="popularShow">
        {popularRT?.map((item) => (
          <div key={item?.username}>
            <div className="d-flex">
              <UserProfile
                username={item?.username}
                className="avatar"
                width="2rem"
                height="2rem"
              />
              &emsp;
              <div>
                <div
                  className="d-flex"
                  style={{
                    display: "block",
                    width: "100%",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    window.open(
                      `${window.location.origin}/profile/${item?.username}/posts`
                    );
                  }}
                >
                  <h6
                    style={{
                      fontWeight: "600",
                      fontSize: "0.75rem",
                      color: "var(--secondary-heading-color)",
                      cursor: "pointer",
                      marginTop: "1px",
                    }}
                  >
                    {item?.name}
                  </h6>
                  <VipComp
                    user_type={item?.user_type}
                    overrideVipStyle={{
                      width: "18px",
                      height: "18px",
                      marginTop: "-10px",
                      marginLeft: "3px",
                    }}
                  />
                </div>
                <h6
                  style={{
                    fontSize: "0.625rem",
                    cursor: "pointer",
                    marginTop: "-4px",
                  }}
                  className="text-muted"
                  onClick={() => {
                    window.open(
                      `${window.location.origin}/profile/${item?.username}/posts`
                    );
                  }}
                >
                  @{item?.username}
                </h6>
              </div>
            </div>
            <div
              style={{
                position: "relative",
                zIndex: 4,
              }}
              onMouseEnter={(e) => {
                e.target.scrollIntoView({
                  behavior: "smooth",
                  inline: "center",
                  block: "nearest",
                });
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
                      hidden={
                        item?.popular_rts?.length === undefined ||
                        item?.popular_rts?.length > 1
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
                {item?.popular_rts?.map((item) => (
                  <div key={item?._id}>
                    <PopularUI
                      showParticipants={false}
                      cover_img={
                        item?.media?.length > 0 &&
                        `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${item?.owner?.user_id}/roundtable/${item?.["_id"]}/profile/${item?.["media"]?.[0]?.["metadata"]?.["tempFilename"]}`
                      }
                      title={item?.name}
                      media_recording={
                        item?.media_recording?.length > 0
                          ? item?.media_recording
                          : null
                      }
                      live={item?.active_flag}
                      past={item?.happened_flag}
                      is_cancelled={item?.is_cancelled}
                      timestamp={item.time}
                      rec_owner_flag={
                        item?.recording?.[0]?.owner_flag === 1 ? true : false
                      }
                      rec_start_flag={
                        item?.recording?.[0]?.start_recording === 1
                          ? true
                          : false
                      }
                      rec_end_flag={
                        item?.recording?.[0]?.soft_end_recording === 0
                          ? true
                          : false
                      }
                      owner_details={item?.owner}
                      rt_type={item.r_type}
                      rt_nature={item.open_to_all}
                      rt_id={item?._id}
                      item={item}
                      moderator={item?.moderator}
                      speakers={item?.speakers}
                      join_count={
                        item?.happened_flag === true ? item?.["join_count"] : 0
                      }
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
                      rt_details={item}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
            <hr style={{ color: "#6c757d", height: "3px" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
