import React, { useRef } from "react";
import clsx from "clsx";
// Assets
import DeleteSVG from "../../assets/icons/delete.svg";
import { IconButton } from "@mui/material";
import { allWords } from "../../App";

export default function MultipleLogo(props) {
  const {
    url_rt_id,
    imgValidation,
    logoUrls1,
    setLogoUrl1,
    logoUrls2,
    setLogoUrl2,
    logoUrls3,
    setLogoUrl3,
    setLogoDelFlag1,
    setLogoDelFlag2,
    setLogoDelFlag3,
    progress_name,
    parsed_data,
    setLogo1,
    setLogo2,
    setLogo3,
  } = props;

  // useState

  // useRef
  const logoRef1 = useRef("");
  const logoRef2 = useRef("");
  const logoRef3 = useRef("");

  const urlParams = new URL(window.location.href);

  return (
    <>
      <div className="d-flex multiple-logo-div">
        {/* Logo1 */}
        <div className=" d-flex mt-2">
          <div
            onClick={(e) => {
              if (e.target.id !== "delete" && !logoUrls1) {
                logoRef1.current.click();
              }
            }}
            className={clsx(
              "d-flex flex-column justify-content-center align-items-center",
              {
                ["imgdoc"]:
                  logoUrls1 ||
                  window.location.pathname.includes("categories") ||
                  window.location.pathname.includes("review"),
              }
            )}
          >
            {logoUrls1 ? (
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
                <img
                  alt=""
                  src={logoUrls1}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    height: "inherit",
                    borderRadius: "10px",
                    color: "transparent",
                  }}
                  onError={() => {
                    setLogoUrl1(null);
                  }}
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
                      setLogoUrl1(null);
                      setLogo1([]);
                      if (url_rt_id && parsed_data?.["org_logo_url"]) {
                        setLogoDelFlag1(true);
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
                      marginLeft: "2rem",
                      marginTop: "2rem",
                      fontSize: "16px",
                    }}
                  >
                    {allWords.misc.livert.nolog}
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
                      {allWords.misc.uploadl}
                    </span>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Logo2 */}
        <div className=" d-flex mt-2 logoDiv customOnemargin">
          <div
            onClick={(e) => {
              if (e.target.id !== "delete" && !logoUrls2) {
                logoRef2.current.click();
              }
            }}
            className={clsx(
              "d-flex flex-column justify-content-center align-items-center",
              {
                ["imgdoc"]:
                  logoUrls2 ||
                  window.location.pathname.includes("categories") ||
                  window.location.pathname.includes("review"),
              }
            )}
          >
            {logoUrls2 ? (
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
                <img
                  alt=""
                  src={logoUrls2}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    height: "inherit",
                    borderRadius: "10px",
                    color: "transparent",
                  }}
                  onError={() => {
                    setLogoUrl2(null);
                  }}
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
                      setLogoUrl2(null);
                      setLogo2([]);
                      if (url_rt_id && parsed_data?.["brand_logo_url"]) {
                        setLogoDelFlag2(true);
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
                      marginLeft: "3rem",
                      marginTop: "2rem",
                      fontSize: "16px",
                    }}
                  >
                    {allWords.misc.livert.nolog}
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
                      {allWords.misc.uploadl}
                    </span>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Logo3 */}
        <div className=" d-flex mt-2 logoDiv">
          <div
            onClick={(e) => {
              if (e.target.id !== "delete" && !logoUrls3) {
                logoRef3.current.click();
              }
            }}
            className={clsx(
              "d-flex flex-column justify-content-center align-items-center",
              {
                ["imgdoc"]:
                  logoUrls3 ||
                  window.location.pathname.includes("categories") ||
                  window.location.pathname.includes("review"),
              }
            )}
          >
            {logoUrls3 ? (
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
                <img
                  alt=""
                  src={logoUrls3}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    height: "inherit",
                    borderRadius: "10px",
                    color: "transparent",
                  }}
                  onError={() => {
                    setLogoUrl3(null);
                  }}
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
                      setLogoUrl3(null);
                      setLogo3([]);
                      if (url_rt_id && parsed_data?.["sub_brand_logo_url"]) {
                        setLogoDelFlag3(true);
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
                      marginLeft: "2rem",
                      marginTop: "2rem",
                      fontSize: "16px",
                    }}
                  >
                    {allWords.misc.livert.nolog}
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
                      {allWords.misc.uploadl}
                    </span>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        style={{ visibility: "hidden", display: "none" }}
        ref={logoRef1}
        onChange={(e) => {
          imgValidation(e, "logo1");
        }}
      />

      <input
        type="file"
        accept="image/*"
        style={{ visibility: "hidden", display: "none" }}
        ref={logoRef2}
        onChange={(e) => {
          imgValidation(e, "logo2");
        }}
      />

      <input
        type="file"
        accept="image/*"
        style={{ visibility: "hidden", display: "none" }}
        ref={logoRef3}
        onChange={(e) => {
          imgValidation(e, "logo3");
        }}
      />
    </>
  );
}
