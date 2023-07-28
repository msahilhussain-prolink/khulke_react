import React, { useRef } from "react";
import { IconButton } from "@mui/material";

// Assets
import DeleteSVG from "../../assets/icons/delete.svg";
import ToastHandler from "../../utils/ToastHandler";
import InfoIcon from "../InfoIcon";
import clsx from "clsx";
import { allWords } from "../../App";

export default function IntroOutro(props) {
  const {
    url_rt_id,
    ivideoUrls,
    setiVideoUrl,
    vidValidation,
    setiVidDelFlag,
    ovideoUrls,
    setOVideoUrl,
    setOVidDelFlag,
    progress_name,
    parsed_data,
    setiVid,
    setOVid,
  } = props;

  // useState

  // useRef
  const introRef = useRef("");
  const outroRef = useRef("");
  const inVideoRef = useRef(null);
  const outVideoRef = useRef(null);

  const urlParams = new URL(window.location.href);

  return (
    <>
      <div
        className="d-flex mt-4 intro-outro-video-div"
        style={{ flexWrap: "wrap" }}
      >
        <div style={{ width: "11rem" }}>
          {/* Upload Intro Video  */}
          {window.location.pathname.includes("categories") ? (
            <div>
              <small className="label_txt">
                {allWords.misc.pg3.uplintro.uplintro}{" "}
                <InfoIcon
                  infoTitle1={allWords.misc.pg3.uplintro.recomm}
                  infoTitle6={allWords.misc.pg3.uplintro.introl1}
                  infoTitle7={allWords.misc.pg3.uplintro.introl2}
                  infoTitle8={allWords.misc.pg3.uplintro.introl3}
                  infoTitle9={allWords.misc.pg3.uplintro.introl4}
                />{" "}
              </small>
            </div>
          ) : (
            <>
              <h6 className="rt-strong-labels" style={{ marginTop: "1.8rem" }}>
                {allWords.misc.pg3.uplintro.uplintro}{" "}
                <InfoIcon
                  infoTitle1={allWords.misc.pg3.uplintro.recomm}
                  infoTitle6={allWords.misc.pg3.uplintro.introl1}
                  infoTitle7={allWords.misc.pg3.uplintro.introl2}
                  infoTitle8={allWords.misc.pg3.uplintro.introl3}
                  infoTitle9={allWords.misc.pg3.uplintro.introl4}
                />
              </h6>
            </>
          )}

          <div className=" d-flex mt-2 custom">
            <div
              onClick={(e) => {
                if (e.target.id !== "delete" && ivideoUrls?.length === 0) {
                  introRef.current.click();
                }
              }}
              className={clsx(
                "d-flex flex-column justify-content-center align-items-center",
                {
                  ["vidDoc"]:
                    window.location.pathname.includes("review") ||
                    window.location.pathname.includes("categories"),
                }
              )}
            >
              {ivideoUrls?.length !== 0 ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <video
                    preload
                    id="video_id_button"
                    className="videoClass"
                    src={ivideoUrls}
                    ref={inVideoRef}
                    muted
                    controls
                    onLoadedMetadata={() => {
                      const invideo = inVideoRef.current;
                      if (!invideo) return;
                      if (invideo.videoWidth * invideo.videoHeight > 8294400) {
                        ToastHandler(
                          "warn",
                          "Max. resolution should be 4k only."
                        );
                        setiVideoUrl([]);
                        setiVid([]);
                      }

                      if (Math.round(invideo.duration) > 15) {
                        ToastHandler(
                          "warn",
                          "Max. duration should be 15sec only."
                        );
                        setiVideoUrl([]);
                        setiVid([]);
                      }
                    }}
                    controlsList="nodownload"
                  />

                  <IconButton
                    className="icon"
                    style={{
                      position: "absolute",
                      top: "0px",
                      right: "0px",
                    }}
                    hidden={urlParams.searchParams.get("id") ? true : false}
                  >
                    <img
                      src={DeleteSVG}
                      alt="delete_icon"
                      id="delete"
                      style={{ width: 38, height: 38 }}
                      onClick={() => {
                        setiVideoUrl([]);
                        setiVid([]);
                        if (url_rt_id && parsed_data?.["intro_url"]) {
                          setiVidDelFlag(true);
                        }
                      }}
                    />
                  </IconButton>
                </div>
              ) : (
                <>
                  {!window.location.pathname.includes("categories") &&
                  progress_name === "" ? (
                    <small
                      className="text-muted"
                      style={{
                        marginLeft: "1.3rem",
                        marginTop: "2rem",
                        fontSize: "16px",
                      }}
                    >
                      {allWords.misc.livert.novid}
                    </small>
                  ) : (
                    <>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "#63779C",
                          marginTop: "4rem",
                        }}
                      >
                        {allWords.misc.pg3.uplintro.uplplace}
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div style={{ width: "11rem" }}>
          {/* Upload Outro Video  */}
          {window.location.pathname.includes("categories") ? (
            <div>
              <small className="label_txt">
                {allWords.misc.pg3.uplintro.uploutro}{" "}
                <InfoIcon
                  infoTitle1={allWords.misc.pg3.uplintro.recomm}
                  infoTitle6={allWords.misc.pg3.uplintro.outro1}
                  infoTitle7={allWords.misc.pg3.uplintro.outro2}
                  infoTitle8={allWords.misc.pg3.uplintro.outro3}
                  infoTitle9={allWords.misc.pg3.uplintro.outro4}
                />{" "}
              </small>
            </div>
          ) : (
            <>
              <h6 className="rt-strong-labels" style={{ marginTop: "1.8rem" }}>
                {allWords.misc.pg3.uplintro.uploutro}{" "}
                <InfoIcon
                  infoTitle1={allWords.misc.pg3.uplintro.recomm}
                  infoTitle6={allWords.misc.pg3.uplintro.outro1}
                  infoTitle7={allWords.misc.pg3.uplintro.outro2}
                  infoTitle8={allWords.misc.pg3.uplintro.outro3}
                  infoTitle9={allWords.misc.pg3.uplintro.outro4}
                />
              </h6>
            </>
          )}

          <div className=" d-flex mt-2">
            <div
              onClick={(e) => {
                if (e.target.id !== "delete" && ovideoUrls?.length === 0) {
                  outroRef.current.click();
                }
              }}
              className={clsx(
                "d-flex flex-column justify-content-center align-items-center",
                {
                  ["vidDoc"]:
                    window.location.pathname.includes("review") ||
                    window.location.pathname.includes("categories"),
                }
              )}
            >
              {ovideoUrls?.length !== 0 ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <video
                    preload
                    id="video_id_button"
                    className="videoClass"
                    src={ovideoUrls}
                    ref={outVideoRef}
                    muted
                    controls
                    onLoadedMetadata={() => {
                      const outvideo = outVideoRef.current;
                      if (!outvideo) return;
                      if (
                        outvideo.videoWidth * outvideo.videoHeight >
                        8294400
                      ) {
                        ToastHandler(
                          "warn",
                          "Max. resolution should be 4k only."
                        );
                        setOVideoUrl([]);
                        setOVid([]);
                      }

                      if (Math.round(outvideo.duration) > 15) {
                        ToastHandler(
                          "warn",
                          "Max. duration should be 15sec only."
                        );
                        setOVideoUrl([]);
                        setOVid([]);
                      }
                    }}
                    controlsList="nodownload"
                  />

                  <IconButton
                    className="icon"
                    style={{
                      position: "absolute",
                      top: "0px",
                      right: "0px",
                    }}
                    hidden={urlParams.searchParams.get("id") ? true : false}
                  >
                    <img
                      src={DeleteSVG}
                      alt="delete_icon"
                      id="delete"
                      style={{ width: 38, height: 38 }}
                      onClick={() => {
                        setOVideoUrl([]);
                        setOVid([]);
                        if (url_rt_id && parsed_data?.["intro_url"]) {
                          setOVidDelFlag(true);
                        }
                      }}
                    />
                  </IconButton>
                </div>
              ) : (
                <>
                  {!window.location.pathname.includes("categories") &&
                  progress_name === "" ? (
                    <small
                      className="text-muted"
                      style={{
                        marginLeft: "1.3rem",
                        marginTop: "2rem",
                        fontSize: "16px",
                      }}
                    >
                      {allWords.misc.livert.novid}
                    </small>
                  ) : (
                    <>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "#63779C",
                          marginTop: "4rem",
                        }}
                      >
                        {allWords.misc.pg3.uplintro.uploutro}
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <input
        type="file"
        accept="video/*"
        style={{ visibility: "hidden", display: "none" }}
        ref={introRef}
        onChange={(e) => {
          vidValidation(e, "intro", introRef?.current?.duration);
        }}
      />

      <input
        type="file"
        accept="video/*"
        style={{ visibility: "hidden", display: "none" }}
        ref={outroRef}
        onChange={(e) => {
          vidValidation(e, "outro", outroRef?.current?.duration);
        }}
      />
    </>
  );
}
