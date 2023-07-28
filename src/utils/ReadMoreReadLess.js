import React, { useState } from "react";
import { MoreLessBtn, MoreLessContent } from "../global_styles/global_style";
import { allWords } from "../App";

export default function ReadMoreReadLess(props) {
  const {
    children = "",
    txtSlice = 170,
    txtLength = 62,
    txtColorM = "#ed4d29",
    txtColorL = "#11141c",
    label = "",
    propStyles,
    readMoreStyle,
  } = props;
  const text = children;
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  const txt = text.replace(/(?:\r\n|\r|\n)/g, " <br/> ");

  const formattedText = txt?.split(" ")?.map((word) => {
    if (word.startsWith("http") || word.startsWith("www")) {
      return (
        <a
          href={word}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#009AD3" }}
        >
          {word}
        </a>
      );
    } else if (word.includes("@")) {
      return (
        <>
          <span>{word.split("@")[0]}</span>
          <a
            href={`/profile/${word.split("@")[1]}/posts`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#009AD3", textDecoration: "none" }}
          >
            @{word.split("@")[1]}
          </a>
          &nbsp;
        </>
      );
    } else if (word.startsWith("#")) {
      return <span>#{word.slice(1)}</span>;
    } else if (word.includes("<br/>")) {
      return word.replace("<br/>", "\n");
    }
    return `${word} `;
  });

  const displayText = !isReadMore ? formattedText : text.slice(0, txtSlice);

  return (
    <MoreLessContent
      id="read_text"
      className={label === "" ? "text-muted" : ""}
      label={label}
      isReadMore={isReadMore}
      style={propStyles || null}
    >
      {displayText} {text.length > txtSlice && isReadMore && "..."} &nbsp;
      {label === "" && <br />}
      {text?.length > txtLength ? (
        <>
          {isReadMore ? (
            <MoreLessBtn
              style={readMoreStyle || null}
              label={label}
              txtColorL={txtColorL}
              txtColorM={txtColorM}
              moreLess="more"
              onClick={toggleReadMore}
              id="read_more"
            >
              {allWords.misc.readmore}
            </MoreLessBtn>
          ) : (
            <MoreLessBtn
              style={readMoreStyle || null}
              label={label}
              txtColorL={txtColorL}
              txtColorM={txtColorM}
              onClick={toggleReadMore}
              moreLess="less"
              id="read_less"
            >
              {allWords.misc.readless}
            </MoreLessBtn>
          )}
        </>
      ) : (
        ""
      )}
      {label === "rt" && <br />}
    </MoreLessContent>
  );
}
