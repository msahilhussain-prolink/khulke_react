import React, { useEffect, useRef, useState } from "react";
import ReactHtmlParser from "react-html-parser";
import Carousel from "react-material-ui-carousel";

// Components
import {
  CmtImgContainer,
  CmtTitle,
  UserAvatar,
} from "../../components/ViewerChat/style";
import Dialog from "../../components/common/Dialog";
import PastDoc from "./PastDoc";

// Utils
import { replaceURLs } from "../../utils/utils";

// Style
import { POST_API_BASE_URL } from "../../constants/env";

// Material UI
import { Button, IconButton } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import moment from "moment";
import UserProfile from "../../components/UserProfile";
import { allWords } from "../../App";

export default function PastPost(props) {
  const { interactionData } = props;

  const [data, setData] = useState([]);
  const [openImage, setOpenImage] = useState(false);
  const [day, setDay] = useState(0);
  const [total, setTotal] = useState("");

  //   Local Ref
  const timerRef = useRef();

  useEffect(() => {
    if (interactionData) {
      if (interactionData?.length > 0) {
        if (interactionData?.[0]?.["is_deleted"] !== 1) {
          if (interactionData?.[0]?.["muted"] !== 1) {
            setData(interactionData?.[0]);
          }
        }
      }
    }
  }, [interactionData]);

  function getHashTags(inputText, symbol) {
    var hash_regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
    var at_regex = /(?:^|\s)(?:@)([a-zA-Z._-\d]+)/gm;
    var use_reg = null;
    if (symbol === "@") {
      use_reg = at_regex;
    } else {
      use_reg = hash_regex;
    }
    var matches = [];
    var match;
    while ((match = use_reg.exec(inputText))) {
      matches.push(match[1]);
    }

    return matches;
  }

  const hash_driver = (text) => {
    let text_temp = text;
    const hashes = getHashTags(text, "#");
    hashes.forEach((item) => {
      //hash
      text_temp = text_temp?.replace(
        "#" + item,
        `<a style="color: blue" href="#">#${item}</a>`
      );
    });
    const tags = getHashTags(text, "@");
    tags.forEach((item) => {
      //hash
      // if (mentioned_usernames) {
      //   if (!mentioned_usernames.includes(item)) return;
      // }

      text_temp = text_temp?.replace(
        "@" + item,
        `<a style="color: blue" href="/profile?username=${item}" 
        target="_blank"
        rel="noopener noreferrer">@${item}</a>`
      );
    });
    return text_temp;
  };

  function getTimeRemaining(end_time) {
    var timeout = new Date(end_time).getTime();
    var now = new Date().getTime();
    const total = timeout - now;
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return {
      total,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  const startTimer = () => {
    let { total, days, hours, minutes, seconds } = getTimeRemaining(
      new Date(data?.polling_data?.end_date)
    );

    if (total) {
      // setTotal(total > 0 ? "left" : "");
      if (days > 0) {
        setDay(days === 1 ? days + " Day " : days + " Days ");
      }
      if (days === 0 && hours > 0) {
        setDay(hours === 1 ? hours + " hour " : hours + " hours ");
      }

      if (days === 0 && hours === 0 && minutes > 0) {
        setDay(minutes === 1 ? minutes + " min " : minutes + " mins ");
      }

      if (days === 0 && hours === 0 && minutes === 0 && seconds) {
        setDay(seconds === 1 ? seconds + " sec " : seconds + " secs ");
      }

      if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
        setDay(". Final Result");
      }
    }
  };

  const clearTimer = (e) => {
    let { total, days, hours, minutes, seconds } = getTimeRemaining(
      new Date(data?.polling_data?.end_date)
    );
    if (total) {
      setTotal(total > 0 ? "left" : "");
      if (days > 0) {
        setDay(days === 1 ? days + " Day " : days + " Days ");
      }
      if (days === 0 && hours > 0) {
        setDay(hours === 1 ? hours + " hour " : hours + " hours ");
      }

      if (days === 0 && hours === 0 && minutes > 0) {
        setDay(minutes === 1 ? minutes + " min " : minutes + " mins ");
      }

      if (days === 0 && hours === 0 && minutes === 0 && seconds) {
        setDay(seconds === 1 ? seconds + " sec " : seconds + " secs ");
      }
    }

    if (timerRef.current) clearInterval(timerRef.current);
    const id = setInterval(() => {
      startTimer(new Date(data?.polling_data?.end_date));
    }, 1000);
    timerRef.current = id;
  };

  const getDeadTime = () => {
    return moment(new Date(data?.polling_data?.end_date))
      .local()
      .format("hh:mm:ss");
  };

  useEffect(() => {
    clearTimer(getDeadTime());
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [new Date(data?.polling_data?.end_date)]);

  return (
    <div
      className="d-flex"
      style={{ width: "100%", alignItems: "center", padding: "10px" }}
    >
      <div>
        <UserProfile username={interactionData?.[0]?.username} />
      </div>{" "}
      &emsp;
      <div
        className="d-flex"
        style={{
          width: "100%",
          height: "auto",
          maxHeight: "21vh",
          maxWidth: "70vw",
          justifyContent: data?.media_type !== "" ? "space-between" : "left",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
          }}
        >
          {(() => {
            if (data?.["raw_text"]?.includes("@")) {
              let str = data?.["raw_text"].split(" ");
              let temp = "";
              str.forEach((elem) => {
                if (elem[0] === "@") {
                  temp =
                    temp +
                    `<a href="/profile?username=${elem.split("@")[1]}" 
                          target="_blank"
                          rel="noopener noreferrer" style="color:blue; text-decoration:none">${elem}</a> `;
                } else {
                  temp = temp + `${elem} `;
                }
              });

              return (
                <CmtTitle
                  dangerouslySetInnerHTML={{ __html: replaceURLs(temp) }}
                />
              );
            }

            return (
              <CmtTitle
                dangerouslySetInnerHTML={
                  data?.["raw_text"] !== "undefined"
                    ? {
                        __html: replaceURLs(
                          data?.["raw_text"]?.length > 200
                            ? data?.["raw_text"]?.slice(0, 99) + "..."
                            : data?.["raw_text"]
                        ),
                      }
                    : { __html: "" }
                }
              />
            );
          })()}
        </div>

        <div style={{ width: "100%" }}>
          {data?.media_type === "PDF" && (
            <>
              <PastDoc
                thumbnail={`${POST_API_BASE_URL}/post-media/frame/${data?.media[0]?.name}`}
                docsFilePath={`${POST_API_BASE_URL}/post-media/media/${data?.media[0]?.name}`}
                docsFile={
                  data?.media?.[0].extra?.orignalFilename ||
                  data?.media[0]?.name
                }
              />
            </>
          )}
          {data?.media_type === "PPTX" && (
            <>
              <PastDoc
                thumbnail={`${POST_API_BASE_URL}/post-media/frame/${data?.media[0]?.name}`}
                docsFilePath={`${POST_API_BASE_URL}/post-media/media/${data?.media[0]?.name}`}
                pptDoc={
                  data?.media?.[0].extra?.orignalFilename ||
                  data?.media[0]?.name
                }
              />
            </>
          )}
          {data?.media_type === "XLS" && (
            <>
              <PastDoc
                thumbnail={`${POST_API_BASE_URL}/post-media/frame/${data?.media[0]?.name}`}
                docsFilePath={`${POST_API_BASE_URL}/post-media/media/${data?.media[0]?.name}`}
                excelDoc={
                  data?.media?.[0].extra?.orignalFilename ||
                  data?.media[0]?.name
                }
              />
            </>
          )}
          {data?.media_type === "DOC" && (
            <>
              <PastDoc
                thumbnail={`${POST_API_BASE_URL}/post-media/frame/${data?.media[0]?.name}`}
                docsFilePath={`${POST_API_BASE_URL}/post-media/media/${data?.media[0]?.name}`}
                wordDoc={
                  data?.media?.[0].extra?.orignalFilename ||
                  data?.media[0]?.name
                }
              />
            </>
          )}
          {data?.media_type === "IMAGE" && (
            <>
              <CmtImgContainer
                src={`${POST_API_BASE_URL}/post-media/image/${data?.media[0]?.name}`}
                onClick={() => {
                  setOpenImage(true);
                }}
              />
            </>
          )}
          {data?.type === "POLL_ROUNDTABLE" && (
            <>
              <span>
                {ReactHtmlParser(
                  data?.polling_data?.question?.includes("https")
                    ? ""
                    : hash_driver(data?.polling_data?.question)
                )}
              </span>

              <div
                style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
                ref={timerRef}
              >
                <span
                  style={{ fontSize: "14px", color: "#000", opacity: "0.7" }}
                >
                  {data?.polling_data?.total_count}{" "}
                  {data?.polling_data?.total_count > 1 > 1
                    ? "Votes"
                    : allWords.misc.livert.vote}
                  &nbsp;
                  <FiberManualRecordIcon
                    style={{
                      color: "#000",
                      width: "8px",
                      height: "8px",
                      alignSelf: "center",
                    }}
                  />
                  &nbsp;
                  {moment(new Date(data?.polling_data?.end_date)).valueOf() <
                  Date.now() ? (
                    "Final Result"
                  ) : (
                    <>
                      {day}
                      {day !== "" ? " left" : ""}
                    </>
                  )}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
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
              // width: 700,
              position: "absolute",
              zIndex: 99999,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
            onContextMenu={(e) => {
              e.preventDefault();
            }}
          >
            <IconButton
              onClick={() => {
                setOpenImage(false);
              }}
            >
              <CancelOutlinedIcon />
            </IconButton>
          </div>
          <Carousel
            height={800}
            autoPlay={true}
            interval={10000}
            // animation={"slide"}
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
                >
                  {next && <NavigateNextIcon />}
                  {prev && <NavigateBeforeIcon />}
                </Button>
              );
            }}
          >
            {data?.media?.map((item, index) => (
              <>
                <img
                  key={index}
                  src={`${POST_API_BASE_URL}/post-media/image/${item?.name}`}
                  alt="images"
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    height: "99.5%",
                  }}
                />{" "}
                &nbsp;
              </>
            ))}
          </Carousel>
        </Dialog>
      )}
    </div>
  );
}
