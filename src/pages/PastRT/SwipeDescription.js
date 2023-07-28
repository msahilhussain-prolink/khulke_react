import React, { useState } from "react";

// Material UI
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import {
  Divider,
  Box,
  SwipeableDrawer,
  Typography,
  IconButton,
} from "@mui/material";
import { replaceURLs } from "../../utils/utils";
import "./style.css";

export default function SwipeDescription(props) {
  const { rt_data, hideFull, hideSection } = props;

  const [swipeOpen, setSwipeOpen] = useState(false);

  return (
    <>
      <div
        className="rmrlm"
        hidden={
          rt_data?.[0]?.["description"]?.length === 0
            ? true
            : hideSection || hideFull
        }
      >
        <div
          className={
            window.location.pathname.includes("recorded")
              ? "col-sm-4 col-md-2 col-lg-2"
              : ""
          }
          style={{ textAlign: "center", width: "auto" }}
        >
          <button
            className="swipeBtn"
            onClick={() => {
              setSwipeOpen(true);
            }}
          >
            <span className="ml-2">
              {window.screen.width >= 1200 ? <>&nbsp;</> : ""}
              Detail
            </span>{" "}
          </button>
        </div>

        <SwipeableDrawer
          anchor="bottom"
          open={swipeOpen}
          onClose={() => {
            setSwipeOpen(false);
          }}
          onOpen={() => {
            setSwipeOpen(true);
          }}
          swipeAreaWidth={56}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
          }}
          hidden={!swipeOpen}
          style={{ overflow: "unset" }}
          PaperProps={{
            style: { maxHeight: "63%" },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              visibility: "visible",
              right: 0,
              left: 0,
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 6,
                backgroundColor: "#E4E9F0",
                borderRadius: 3,
                position: "absolute",
                top: 8,
                left: "calc(50% - 15px)",
              }}
            />
            <div className="d-flex justify-content-between p-2">
              <Typography style={{ fontSize: "1.5rem" }}>
                Description
              </Typography>

              <IconButton
                onClick={() => {
                  setSwipeOpen(false);
                }}
                style={{ cursor: "pointer", marginTop: "-10px" }}
              >
                <CancelOutlinedIcon fontSize="medium" />
              </IconButton>
            </div>
          </Box>
          <br /> <br />
          <Divider style={{ color: "#0000000D" }} />
          <div
            style={{
              padding: 10,
              overflowY: "scroll",
              whiteSpace: "break-spaces",
            }}
          >
            {/* {rt_data?.[0]?.["description"]} */}

            {(() => {
              if (rt_data?.[0]?.["description"]?.includes("@")) {
                let str = rt_data?.[0]?.["description"].split(" ");
                let temp = "";
                str.forEach((elem) => {
                  if (elem[0] === "@") {
                    temp =
                      temp +
                      `<a href="/profile?username=${elem.split("@")[1]
                      }" target="_blank" rel="noopener noreferrer" style="color:blue; text-decoration:none">${elem}</a> `;
                  } else {
                    temp = temp + `${elem} `;
                  }
                });

                return (
                  <p
                    dangerouslySetInnerHTML={{
                      __html: replaceURLs(
                        temp.includes("\n")
                          ? temp.replace(/(?:\r\n|\r|\n)/g, " <br /> ")
                          : temp
                      ),
                    }}
                  />
                );
              }

              return (
                <p
                  dangerouslySetInnerHTML={
                    rt_data?.[0]?.["description"] !== "undefined"
                      ? { __html: replaceURLs(rt_data?.[0]?.["description"]) }
                      : { __html: "" }
                  }
                />
              );
            })()}
          </div>
        </SwipeableDrawer>
      </div>
    </>
  );
}
