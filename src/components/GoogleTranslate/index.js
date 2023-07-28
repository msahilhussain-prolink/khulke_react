import React, { useEffect, useMemo, useState } from "react";

// MUI
import { Box, Typography } from "@mui/material";

// Assets
import Google from "../../assets/icons/google.svg";

// Styles
import "./style.css";
import { POST_API_BASE_URL } from "../../constants/env";
import axios from "axios";
import ReadMoreReadLess from "../../utils/ReadMoreReadLess";
import logger from "../../logger";

export default function GoogleTranslate({ lang, post_id }) {
  const [translatePost, setTranslatePost] = useState(false);
  const [fromLang, setFromLang] = useState("");
  const [data, setData] = useState(null);

  let current_user_lang = localStorage.current_user
    ? JSON.parse(localStorage.current_user)?.["display_language"]
    : null;

  useEffect(() => {
    switch (lang) {
      case "en":
        setFromLang("English");
        break;
      case "hi":
        setFromLang("Hindi");
        break;
      case "ta":
        setFromLang("Tamil");
        break;
      default:
        setFromLang("English");
        break;
    }
  }, []);

  async function translatedPost() {
    const response = await axios.get(
      `${POST_API_BASE_URL}/translate/${post_id}/${current_user_lang}`,
      {
        headers: {
          "device-type": "android",
          "user-id": JSON.parse(localStorage.getItem("current_user"))?.["_id"],
        },
      }
    );
    setData(response?.data?.data?.text);
  }

  const memoizedData = useMemo(() => data, [data]);

  return (
    <Box className="ml-1">
      <Box
        component="div"
        className="d-flex"
        onClick={() => {
          if (!translatePost) translatedPost();
          setTranslatePost(!translatePost);
        }}
      >
        <Typography className="translate_post" variant="subtitle1" gutterBottom>
          {!translatePost
            ? "Translate Post"
            : `Translated from ${fromLang} by `}
        </Typography>
        {translatePost && (
          <>
            &nbsp; <img src={Google} alt="Google" />
          </>
        )}
      </Box>

      {translatePost && memoizedData !== null && (
        <Typography className="memoized_data_p" variant="body1" gutterBottom>
          {memoizedData.includes("<br />")
            ? memoizedData.replace("<br />", "\n")
            : memoizedData}
        </Typography>
      )}
    </Box>
  );
}
