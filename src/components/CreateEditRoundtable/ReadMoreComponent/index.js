import React, { useState } from "react";

// Component
import ReadMoreDialog from "./ReadMoreDialog";

// Constants
import { allWords } from "../../../App";

// Style
import {
  MoreLessBtn,
  MoreLessContent,
} from "../../../global_styles/global_style";
import "./style.css";

export default function ReadMoreComponent({
  children = "",
  propStyles,
  readMoreStyle,
  dialogTitle = "RoundTable description",
  textSliceVal = null,
  textSpanStyles = null,
  textLengthVal = null,
  showDotsStyle = { display: "none" },
}) {
  const text = children;
  const txtSlice = textSliceVal ?? 40;
  const txtLength = textLengthVal ?? 62;

  const [isReadMore, setIsReadMore] = useState(false);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  const txt = text.replace(/(?:\r\n|\r|\n)/g, " <br/> ");

  const formattedText = txt?.split(" ")?.map((word) => {
    if (word.startsWith("http") || word.startsWith("www")) {
      return (
        <a
          className="textColor"
          href={word}
          target="_blank"
          rel="noopener noreferrer"
        >
          {word}
        </a>
      );
    } else if (word.includes("@")) {
      return (
        <>
          <span>{word.split("@")[0]}</span>
          <a
            className="textColor textDecoration"
            href={`/profile/${word.split("@")[1]}/posts`}
            target="_blank"
            rel="noopener noreferrer"
          >
            @{word.split("@")[1]}
          </a>
          &nbsp;
        </>
      );
    } else if (word.startsWith("#")) {
      return (
        <span className="textColor textDecoration">
          #{word.slice(1)} &nbsp;;{" "}
        </span>
      );
    } else if (word.includes("<br/>")) {
      return word.replace("<br/>", "\n");
    }
    return `${word} `;
  });

  const displayText = isReadMore ? formattedText : text.slice(0, txtSlice);

  return (
    <>
      <MoreLessContent
        id="read_text"
        className={"text-muted"}
        label=""
        isReadMore={isReadMore}
        style={propStyles || null}
      >
        <span style={textSpanStyles ? textSpanStyles : null}>
          {text.slice(0, txtSlice)}
          {text?.length > txtLength && <span style={showDotsStyle}>...</span>}
        </span>
        {text?.length > txtLength ? (
          <>
            <MoreLessBtn
              style={readMoreStyle || null}
              label=""
              txtColorL="#11141c"
              txtColorM="#ed4d29"
              moreLess="more"
              onClick={toggleReadMore}
              id="read_more"
            >
              {allWords.misc.readmore}
            </MoreLessBtn>
          </>
        ) : null}
      </MoreLessContent>

      <ReadMoreDialog
        isReadMore={isReadMore}
        setIsReadMore={setIsReadMore}
        children={displayText}
        dialogTitle={dialogTitle}
      />
    </>
  );
}
