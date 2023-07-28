import React from "react";
import { PollingContainer } from "./style";

const Poll = (props) => {
  const {
    username,
    type,
    polling_data,
    polling,
    setPollState,
    setState,
    diffDays,
    diffHours,
    diffMinutes,
  } = props;
  return (
    <>
      {type === "POLL" && (
        <>
          <h5>{polling_data?.question}</h5>

          {polling ? (
            <div style={{ position: "relative" }}>
              {polling_data?.result?.options?.map((item, index) => (
                <>
                  <PollingContainer
                    key={item}
                    onClick={() => {
                      if (
                        JSON.parse(localStorage.getItem("current_user"))[
                          "username"
                        ] !== username
                      ) {
                        setPollState(true);
                        setState(item);
                      }
                    }}
                    border
                    justifyContent="center"
                  >
                    <span>{item}</span>
                  </PollingContainer>
                  <div
                    style={{
                      marginTop: "-2rem",
                      position: "absolute",
                      right: 0,
                    }}
                  ></div>
                </>
              ))}
            </div>
          ) : (
            <>
              {/* after polling view */}
              <div style={{ position: "relative" }}>
                {polling_data?.result?.options?.map((item, index) => (
                  <>
                    <PollingContainer
                      key={item}
                      width={polling_data?.result?.percent?.[index]}
                      bgColor
                      justifyContent="space-between"
                    >
                      <span style={{ marginLeft: "0.4rem" }}>{item}</span>
                    </PollingContainer>
                    <div
                      style={{
                        marginTop: "-2rem",
                        position: "absolute",
                        right: 0,
                      }}
                    >
                      {polling_data?.result?.percent?.[index] ? (
                        <>{polling_data?.result?.percent?.[index]}%</>
                      ) : null}
                    </div>
                  </>
                ))}
              </div>
            </>
          )}

          <div style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
            <b>
              {polling_data?.total_count} Votes
              {polling_data?.is_expired ? (
                " . Final Result"
              ) : (
                <>
                  {" "}
                  . {diffDays > 0 && diffDays + " Days left "}
                  {/*  */}
                  {diffHours > 0 && !diffDays > 0
                    ? diffHours + " Hours left "
                    : ""}
                  {/*  */}
                  {diffMinutes > 0 && !diffDays > 0 && !diffHours > 0
                    ? diffMinutes + " Minutes left "
                    : ""}
                </>
              )}
            </b>
          </div>
        </>
      )}
    </>
  );
};

export default Poll;
