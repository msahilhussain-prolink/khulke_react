import React, { useEffect } from "react";
import ReactHtmlParser from "react-html-parser";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import UserProfile from "../../UserProfile";
import ".././style.css";

export const scrollToRef = (reference) => {
  const scroll =
    reference.current.scrollHeight - reference.current.clientHeight;
  reference.current.scrollTo(0, scroll);
};

const MessageArea = ({ messageData, loading, message_area_scroller_ref }) => {
  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 50;
    if (bottom && !loading) {
      // setSkip(skip + 10);
    }
  };

  const scrollMessages = () => {
    try {
      document.querySelector(".message_area_scroller").scrollTop =
        document.querySelector(".message_area_scroller").scrollHeight +
        40000000;
    } catch (err) {}
  };

  useEffect(() => {
    scrollMessages();
  }, [messageData]);

  function getHashTags(inputText, symbol) {
    const hash_regex = /(?:^|\s)(?:#)([a-zA-Z\d]+)/gm;
    const at_regex = /(?:^|\s)(?:@)([a-zA-Z._-\d]+)/gm;
    let use_reg = null;
    if (symbol === "@") {
      use_reg = at_regex;
    } else {
      use_reg = hash_regex;
    }
    let matches = [];
    let match;
    while ((match = use_reg.exec(inputText))) {
      matches.push(match[1]);
    }

    return matches;
  }

  const hash_driver = (text) => {
    let text_temp = text;
    const tags = getHashTags(text, "@");
    tags.forEach((item) => {
      text_temp = text_temp?.replace(
        "@" + item,
        `<a style="color:blue" href="/profile?username=${item}" 
        target="_blank"
        rel="noopener noreferrer">@${item}</a>`
      );
    });
    return text_temp;
  };

  return (
    <section
      id="message_area"
      onScroll={handleScroll}
      style={{ width: "100%", height: "94.5%" }}
    >
      <div className="message_area_scroller" ref={message_area_scroller_ref}>
        {messageData.map((item) => (
          <div id="mess_id" key={item?.name}>
            {!item?.in.includes("||") &&
              item?.in !== "" &&
              item?.in !== "renewself" && (
                <div
                  style={{
                    width: "75%",
                    display: "flex",
                    marginTop: "1rem",
                    justifyContent: "flex-start",
                  }}
                  key={item?.name}
                >
                  <div className="leftDiv">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <UserProfile username={item?.name} />

                      <p style={{ marginLeft: "10px", fontWeight: "bold" }}>
                        <Link
                          to={`/profile/${item?.name}/posts`}
                          target={"__blank"}
                          style={{
                            textDecoration: "none",
                          }}
                        >
                          @{item?.name}
                        </Link>
                      </p>
                    </div>

                    <p className="message-body">
                      {" "}
                      {ReactHtmlParser(hash_driver(item?.in))}
                    </p>
                    <small
                      style={{
                        display: "block",
                        fontSize: "0.7rem",
                        position: "relative",
                        color: "#63779C",
                      }}
                    >
                      <Moment format="hh:mm A">{item?.time || 0}</Moment>
                    </small>
                  </div>
                </div>
              )}{" "}
            {item?.out !== "" && (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "1rem",
                }}
              >
                <div className="rightDiv">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <UserProfile
                      username={
                        JSON.parse(localStorage.getItem("current_user"))?.[
                          "username"
                        ]
                      }
                    />
                    <p style={{ marginLeft: "10px", fontWeight: "bold" }}>
                      <Link
                        to={`/profile/${item?.name}/posts`}
                        target={"__blank"}
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        @{item?.name}
                      </Link>
                    </p>
                  </div>
                  <p className="message-body">
                    {ReactHtmlParser(hash_driver(item?.out))}
                  </p>
                  <small
                    style={{
                      display: "block",
                      fontSize: "0.7rem",
                      position: "relative",
                      color: "#63779C",
                    }}
                  >
                    <Moment format="hh:mm A">{item?.time || 0}</Moment>
                  </small>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default MessageArea;
