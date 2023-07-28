import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Material UI
import RefreshIcon from "@mui/icons-material/Refresh";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";

// Constants
import {
  REACT_APP_BASE_URL_CLOUDFRONT,
  REACT_APP_BASE_URL_FOR_ROUNDTABLE,
} from "../../constants/env";

// Style
import "./style.css";
import { IconButton } from "@mui/material";

export default function RTScroll(props) {
  const { recommendData, hideRt, rt_id, ext, videoElem } = props;
  const navigate = useNavigate();

  const [backFlag, setBackFlag] = useState(true);

  const exitRecording = () => {
    var data = JSON.stringify({
      rt_id: rt_id,
      last_video_time: 0,
      total_time_spend: 0,
    });

    var config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/${
        localStorage.anonymous_user ? "anonymous/" : ""
      }exit_recording/`,
      headers: {
        Authorization: `Bearer ${
          localStorage.access || JSON.parse(localStorage.anonymous_user).token
        }`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config).then().catch();
  };

  return (
    <>
      <div
        className="video_btn"
        hidden={hideRt}
        style={{
          bottom: ext?.includes("application/x-mpegURL")
            ? "45% !important"
            : "50%",
        }}
      >
        <IconButton
          className="iconClass skipNextClass backclass"
          disabled={backFlag}
          onClick={() => {
            navigate(-1);
          }}
        >
          <SkipPreviousIcon fontSize="large" />
        </IconButton>
        <IconButton
          // hidden={ext?.includes("application/x-mpegURL") ? true : false}
          className="iconClass refreshClass"
          onClick={() => {
            videoElem?.current?.play();
          }}
        >
          <RefreshIcon fontSize="large" />
        </IconButton>
        <IconButton
          className="iconClass skipNextClass"
          onClick={() => {
            navigate(`/roundtable/recorded/${recommendData?.[0]?._id}`);
            setBackFlag(false);
            exitRecording();
          }}
        >
          <SkipNextIcon fontSize="large" />
        </IconButton>
      </div>

      <div className="rtScroll_div" hidden={hideRt}>
        {recommendData &&
          recommendData?.length > 0 &&
          recommendData?.map((item, index) => (
            <div
              className="col-3 rtScroll_img"
              key={index}
              onClick={() => {
                navigate(`/roundtable/recorded/${item?._id}`);
                exitRecording();
              }}
            >
              {item?.media?.length > 0 ? (
                <img
                  className="rt_scroll_img"
                  alt=""
                  src={`${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${item?.owner?.user_id}/roundtable/${item?.["_id"]}/profile/${item?.["media"]?.[0]?.["metadata"]?.["tempFilename"]}`}
                  // style={{ width: "inherit" }}
                />
              ) : (
                <p className="scroll_title">{item?.name}</p>
              )}
            </div>
          ))}
      </div>
    </>
  );
}
