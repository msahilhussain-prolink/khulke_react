import React, { useEffect, useRef } from "react";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";

// Constants
import { REACT_APP_BASE_URL_CLOUDFRONT } from "../../constants/env";

// Assets
import DownloadSVG from "../../assets/icons/download.svg";
import PdfSVG from "../../assets/images/PDF_file_icon.svg";
import ExcelSVG from "../../assets/images/xls_doc.png";
import PptVG from "../../assets/images/ppt_doc.png";
import WordSVG from "../../assets/images/word_doc.png";
import ExcelBgIcon from "../../assets/images/excel_bg_icon.png";
import PptBgIcon from "../../assets/images/powerpoint-icon.png";
import WordBgIcon from "../../assets/images/word_bg_icon.png";
import UploadIcon from "../../assets/icons/upload_icon.svg";

import "./style.css";
import { MetaDataType } from "../../utils/Constant/metaDataType";
import { allWords } from "../../App"

export default function DocumentAttachment(props) {
  const {
    parsed_data,
    current_user,
    status,
    doc_name,
    setDocName,
    doc_link,
    setDocLink,
    mod_doc_link,
    setModDocLink,
    pdf,
    setPdf,
    progress_name,
    docDelFlag,
    setDocDelFlag,
    docValidation,
    docImg,
    setDocImg,
    DocSvg,
    setDocSvg,
    docs,
  } = props;

  // useRef
  const doc_btn = useRef("");

  //   useEffect
  useEffect(() => {
    if (docDelFlag === false) {
      if (parsed_data?.["doc_media"]?.length > 0) {
        setDocName(
          parsed_data?.["doc_media"]?.[0]?.metadata?.orignalFilename
        );
        setPdf(false);
        setDocLink(
          `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${parsed_data?.["owner"]?.["user_id"]}/roundtable/${parsed_data?.["_id"]}/document/${parsed_data?.["doc_media"]?.[0]?.["metadata"]?.["tempFilename"]}`
        );
        setMetaData();
      } else {
        if (docDelFlag === false) {
          setDocImg(null);
        }
      }
    }
  }, [parsed_data]);

  const setMetaData = () => {
    switch (parsed_data?.["doc_media"]?.[0]?.metadata?.mimeType) {
      case MetaDataType.PDF: {
        setDocSvg(PdfSVG);
        setPdf(true);
      }
        break;
      case MetaDataType.MSWORD:
      case MetaDataType.MSWORDXML: {
        setDocImg(WordBgIcon);
        setDocSvg(WordSVG);
      }
        break;
      case MetaDataType.POWERPOINT:
      case MetaDataType.POWERPOINTXML: {
        setDocImg(PptBgIcon);
        setDocSvg(PptVG);
      }
        break;
      case MetaDataType.EXCEL:
      case MetaDataType.EXCELXML: {
        setDocImg(ExcelBgIcon);
        setDocSvg(ExcelSVG);
      }
        break;
      default:
    }
  }

  return (
    <>
      <input
        accept=".doc,.docx,.pdf,.xlsx,.xls,.ppt,.pptx"
        type="file"
        ref={doc_btn}
        style={{ display: "none" }}
        onChange={(e) => {
          docValidation(e);
          setDocDelFlag(true);
        }}
      />

      <h6 className="rt-strong-labels" style={{ marginTop: "1.8rem" }}>
        {allWords.misc.review.Attach}
      </h6>
      {docImg ? (
        <div
          className="docs_container"
          style={{
            height: pdf ? "750px" : "auto",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              borderRadius: 4,
              paddingTop: "0.4rem",
              paddingBottom: "0.4rem",
            }}
          >
            {pdf ? (
              <div
                style={{
                  width: "100%",
                  height: "inherit",
                  borderRadius: "10px",
                  overflowY: "auto",
                }}
              >
                <embed
                  src={(() => {
                    try {
                      return URL.createObjectURL(docs[0]) + "#toolbar=0&page=1";
                    } catch (err) {
                      return doc_link + "#toolbar=0&page=1";
                    }
                  })()}
                  style={{
                    width: "100%",
                    height: "700px",
                  }}
                  onError={() => {
                    setDocLink(false);
                    setModDocLink(false);
                  }}
                />
              </div>
            ) : (
              <img className="img" style={{ width: 150 }} src={docImg} alt="" />
            )}
          </div>

          <div
            className="icon_container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "-20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconButton
                className="icon"
                style={{
                  width: 40,
                  height: 40,
                  marginLeft: "0.5rem",
                  // backgroundColor: "black",
                  padding: "1rem",
                  marginRight: "2rem",
                }}
              >
                <img src={DocSvg} alt="" style={{ width: 38, height: 38 }} />
              </IconButton>
              <p className="doc_texts">{doc_name}</p>
            </div>
            <div className={progress_name !== "" ? "d-flex" : ""}>
              <IconButton
                className="icon"
                component="a"
                href={mod_doc_link === "" ? doc_link : mod_doc_link}
                download={`${doc_name}`}
              >
                <img
                  src={DownloadSVG}
                  alt="download"
                  style={{ width: 38, height: 38 }}
                />
              </IconButton>
              {progress_name !== "" && (
                <IconButton className="icon" style={{ marginRight: "0px" }}>
                  <img
                    src={UploadIcon}
                    alt="Upload"
                    style={{ width: 20, height: 20 }}
                    onClick={() => {
                      doc_btn.current.click();
                    }}
                  />
                </IconButton>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="container-fluid my-2 text-center">
          <small className="text-muted">{allWords.misc.review.nodoc}</small>
          {status === "upcoming" && progress_name !== "" && (
            <>
              {(parsed_data?.moderator?.m_type === "co-owner" &&
                parsed_data?.moderator?.user_id === current_user?.["_id"]) ||
                parsed_data?.["owner"]?.["user_id"] === current_user?.["_id"] ? (
                <>
                  <small className="mt-1 mb-4" style={{ display: "block" }}>
                    <Link
                      to="#"
                      onClick={() => {
                        doc_btn.current.click();
                      }}
                    >
                      {allWords.misc.upload}
                    </Link>
                  </small>
                </>
              ) : null}
            </>
          )}
        </div>
      )}
    </>
  );
}
