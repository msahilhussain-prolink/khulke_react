import React from "react";
import clsx from "clsx";

// Components
import MemoAudioBased from "../IconsComponents/AudioBased";
import MemoVideoBased from "../IconsComponents/VideoBased";
import MemoPrivacyIcon from "../IconsComponents/PrivateBased";

// Assets
import Chat from "../../assets/icons/Group 19541.svg";
import ConfidentialRT from "../../assets/icons/conRT.svg";

// Style
import "./style.css";
import LiveRtTimer from "./LiveRtTimer";
import { allWords } from "../../App";

export default function BottomLeftComponent(props) {
  const {
    rt_id,
    rt_nature,
    rt_type,
    upcoming,
    live,
    rec_owner_flag,
    rec_end_flag,
    rec_start_flag,
    timestamp,
    past,
    popular,
    time,
    muteFlag,
    ext,
  } = props;

  return (
    <>
      <div
        className={clsx("bottom_left", {
          ["populars"]: popular,
          ["past_bottom_left"]: past,
        })}
        style={muteFlag ? { width: "auto" } : null}
      >
        <LiveRtTimer
          start_time={timestamp?.["start"]}
          end_time={timestamp?.["end"]}
          live={live}
          past={past}
          time={time}
          muteFlag={muteFlag}
          rt_type={rt_type}
          rt_id={rt_id}
        />
        {(!muteFlag && !upcoming) || (live && rt_type !== "RECORDING_BASED") ? (
          <>
            {rt_nature === "private" && (
              <>
                <MemoPrivacyIcon width="18" height="18" color="#ED4D29" />
                &nbsp;
                <p
                  style={{
                    fontSize: "12px",
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  {allWords.createRT.optPriv}
                </p>
              </>
            )}
            {(rt_nature === "confidential" || rt_nature === "secret") && (
              <>
                <img
                  id="confidential_img"
                  src={ConfidentialRT}
                  alt=""
                  width={18}
                  height={18}
                  style={{ marginTop: "1px" }}
                />
                &nbsp;
                <p
                  style={{
                    fontSize: "12px",
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  {allWords.createRT.optConfi}
                </p>
              </>
            )}
            {rt_type === "TEXT_BASED" && (
              <>
                <img
                  alt=""
                  width="15px"
                  height="15px"
                  fontSize="0.4rem"
                  color="#ED4D29"
                  src={Chat}
                />{" "}
                &nbsp;
              </>
            )}
            {rt_type === "AUDIO_STREAMING" && (
              <span
                className={clsx("spanImg", {
                  ["pastDot"]: past,
                })}
              >
                &nbsp;
                <MemoAudioBased
                  width="14px"
                  height="14px"
                  fontSize="0.4rem"
                  color="#ED4D29"
                  marginTop="2px"
                />{" "}
                &nbsp;
              </span>
            )}
            {rt_type === "RECORDING_BASED" && (
              <>
                {ext?.toLowerCase() === "mp3" ? (
                  <span
                    className={clsx("spanImg", {
                      ["pastDot"]: past,
                    })}
                  >
                    &nbsp;
                    <MemoAudioBased
                      width="14px"
                      height="14px"
                      fontSize="0.4rem"
                      color="#ED4D29"
                      marginTop="2px"
                    />{" "}
                    &nbsp;
                  </span>
                ) : (
                  <span
                    className={clsx("spanImg", {
                      ["pastDot"]: past,
                    })}
                  >
                    &nbsp;
                    <MemoVideoBased
                      width="14px"
                      height="14px"
                      fontSize="0.4rem"
                      color="#ED4D29"
                      marginTop="1px"
                    />
                    &nbsp;
                  </span>
                )}
              </>
            )}
            {rt_type === "VIDEO_STREAMING" && (
              <span
                className={clsx("spanImg", {
                  ["pastDot"]: past,
                })}
              >
                &nbsp;
                <MemoVideoBased
                  width="14px"
                  height="14px"
                  fontSize="0.4rem"
                  color="#ED4D29"
                  marginTop="1px"
                />
                &nbsp;
              </span>
            )}
            &nbsp;
            {upcoming && (
              <>
                {rec_owner_flag === true ? (
                  <>
                    <span className="white_dot"></span>
                    &nbsp;
                    <lottie-player
                      src="https://assets4.lottiefiles.com/packages/lf20_pldkyyxt.json"
                      background="transparent"
                      speed="0"
                      style={{
                        width: "40px",
                        height: "40px",
                        marginTop: "-11px",
                      }}
                    />
                  </>
                ) : null}
              </>
            )}
            {live && (
              <>
                {rec_end_flag === true && (
                  <>
                    {rec_owner_flag === true ? (
                      <>
                        <span className="white_dot"></span>
                        &nbsp;
                        <lottie-player
                          src="https://assets4.lottiefiles.com/packages/lf20_pldkyyxt.json"
                          background="transparent"
                          speed="1"
                          style={{
                            width: "40px",
                            height: "40px",
                            marginTop: "-11px",
                          }}
                          loop
                          autoplay
                        />
                      </>
                    ) : (
                      <>
                        {rec_start_flag === true ? (
                          <>
                            <span className="white_dot"></span>
                            &nbsp;
                            <lottie-player
                              src="https://assets4.lottiefiles.com/packages/lf20_pldkyyxt.json"
                              background="transparent"
                              speed="1"
                              style={{
                                width: "40px",
                                height: "40px",
                                marginTop: "-11px",
                              }}
                              loop
                              autoplay
                            />
                          </>
                        ) : null}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </>
        ) : null}

        {upcoming ? (
          <>
            {rt_nature === "private" && (
              <>
                <MemoPrivacyIcon width="18" height="18" color="#ED4D29" />
                &nbsp;
                <p
                  style={{
                    fontSize: "12px",
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  {allWords.createRT.optPriv}
                </p>
              </>
            )}
            {(rt_nature === "confidential" || rt_nature === "secret") && (
              <>
                <img
                  id="confidential_img"
                  src={ConfidentialRT}
                  alt=""
                  width={18}
                  height={18}
                  style={{ marginTop: "1px" }}
                />
                &nbsp;
                <p
                  style={{
                    fontSize: "12px",
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  {allWords.createRT.optConfi}
                </p>
              </>
            )}
            {rt_type === "TEXT_BASED" && (
              <>
                <img
                  alt=""
                  width="15px"
                  height="15px"
                  fontSize="0.4rem"
                  color="#ED4D29"
                  src={Chat}
                />{" "}
                &nbsp;
              </>
            )}
            {rt_type === "AUDIO_STREAMING" && (
              <span
                className={clsx("spanImg", {
                  ["pastDot"]: past,
                })}
              >
                &nbsp;
                <MemoAudioBased
                  width="14px"
                  height="14px"
                  fontSize="0.4rem"
                  color="#ED4D29"
                  marginTop="2px"
                />{" "}
                &nbsp;
              </span>
            )}
            {rt_type === "RECORDING_BASED" && (
              <>
                {ext?.toLowerCase() === "mp3" ? (
                  <span
                    className={clsx("spanImg", {
                      ["pastDot"]: past,
                    })}
                  >
                    &nbsp;
                    <MemoAudioBased
                      width="14px"
                      height="14px"
                      fontSize="0.4rem"
                      color="#ED4D29"
                      marginTop="2px"
                    />{" "}
                    &nbsp;
                  </span>
                ) : (
                  <span
                    className={clsx("spanImg", {
                      ["pastDot"]: past,
                    })}
                  >
                    &nbsp;
                    <MemoVideoBased
                      width="14px"
                      height="14px"
                      fontSize="0.4rem"
                      color="#ED4D29"
                      marginTop="1px"
                    />
                    &nbsp;
                  </span>
                )}
              </>
            )}
            {rt_type === "VIDEO_STREAMING" && (
              <span
                className={clsx("spanImg", {
                  ["pastDot"]: past,
                })}
              >
                &nbsp;
                <MemoVideoBased
                  width="14px"
                  height="14px"
                  fontSize="0.4rem"
                  color="#ED4D29"
                  marginTop="1px"
                />
                &nbsp;
              </span>
            )}
            &nbsp;
            {upcoming && (
              <>
                {rec_owner_flag === true ? (
                  <>
                    <span className="white_dot"></span>
                    &nbsp;
                    <lottie-player
                      src="https://assets4.lottiefiles.com/packages/lf20_pldkyyxt.json"
                      background="transparent"
                      speed="0"
                      style={{
                        width: "40px",
                        height: "40px",
                        marginTop: "-11px",
                      }}
                    />
                  </>
                ) : null}
              </>
            )}
            {live && (
              <>
                {rec_end_flag === true && (
                  <>
                    {rec_owner_flag === true ? (
                      <>
                        <span className="white_dot"></span>
                        &nbsp;
                        <lottie-player
                          src="https://assets4.lottiefiles.com/packages/lf20_pldkyyxt.json"
                          background="transparent"
                          speed="1"
                          style={{
                            width: "40px",
                            height: "40px",
                            marginTop: "-11px",
                          }}
                          loop
                          autoplay
                        />
                      </>
                    ) : (
                      <>
                        {rec_start_flag === true ? (
                          <>
                            <span className="white_dot"></span>
                            &nbsp;
                            <lottie-player
                              src="https://assets4.lottiefiles.com/packages/lf20_pldkyyxt.json"
                              background="transparent"
                              speed="1"
                              style={{
                                width: "40px",
                                height: "40px",
                                marginTop: "-11px",
                              }}
                              loop
                              autoplay
                            />
                          </>
                        ) : null}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </>
        ) : null}
      </div>
    </>
  );
}
