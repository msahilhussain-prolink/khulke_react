import React, { useRef, useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import clsx from "clsx";

// Assets
import DeleteSVG from "../../assets/icons/delete.svg";
import PdfSVG from "../../assets/images/PDF_file_icon.svg";
import ExcelSVG from "../../assets/images/xls_doc.png";
import PptVG from "../../assets/images/ppt_doc.png";
import WordSVG from "../../assets/images/word_doc.png";
import DocsDefaultPng from "../../assets/images/docs_default.png";
import ExcelIcon from "../../assets/images/excel_bg_icon.png";
import PptIcon from "../../assets/images/powerpoint-icon.png";
import DocIcon from "../../assets/images/word_bg_icon.png";
import { allWords } from '../../App'
// Constants
import { REACT_APP_BASE_URL_CLOUDFRONT } from "../../constants/env";

// Styles
import "./style.css";

export default function UploadDocument(props) {
  const {
    url_rt_id,
    rt_id,
    docName,
    setDocName,
    docs,
    setDocs,
    setLoading,
    setPreviousDocument,
    parsed_data,
    docDelFlag,
    setDocDelFlag,
    docValidation,
    onDocChange,
    onDocImageDelete,
    docImg,
    setDocImg,
    DocSvg,
    setDocSvg,
    document_name,
  } = props;

  // useState
  const [docUrls, setDocUrl] = useState([]);

  // useRef
  const hiddenFileInputDoc = useRef("");

  useEffect(() => {
    setDocUrl(null);
    if (docDelFlag === false) {
      setDocImg(null);
    }
  }, []);

  useEffect(() => {
    if (url_rt_id) {
      if (docDelFlag === false) {
        if (parsed_data) {
          try {
            setLoading(false);
            if (parsed_data?.["doc_media"]?.length === 0) {
              setDocName("");
              setPreviousDocument("");
              setDocUrl("");
              setDocs([]);
            }

            if (
              parsed_data?.["doc_media"]?.[0]?.["metadata"]?.["orignalFilename"]
            ) {
              if (
                parsed_data?.doc_media?.[0]?.metadata?.mimeType ===
                "application/pdf"
              ) {
                setDocImg(DocsDefaultPng);
                setDocs([{ type: "application/pdf" }]);
                setDocSvg(PdfSVG);
              } else if (
                parsed_data?.doc_media?.[0]?.metadata?.mimeType ===
                "application/msword" ||
                parsed_data?.doc_media?.[0]?.metadata?.mimeType ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              ) {
                setDocImg(DocIcon);
                setDocSvg(WordSVG);
              } else if (
                parsed_data?.doc_media?.[0]?.metadata?.mimeType ===
                "application/vnd.ms-powerpoint" ||
                parsed_data?.doc_media?.[0]?.metadata?.mimeType ===
                "application/vnd.openxmlformats-officedocument.presentationml.presentation"
              ) {
                setDocImg(PptIcon);
                setDocSvg(PptVG);
              } else if (
                parsed_data?.doc_media?.[0]?.metadata?.mimeType ===
                "application/vnd.ms-excel" ||
                parsed_data?.doc_media?.[0]?.metadata?.mimeType ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              ) {
                setDocImg(ExcelIcon);
                setDocSvg(ExcelSVG);
              }
              setDocName(
                parsed_data?.["doc_media"]?.[0]?.["metadata"]?.[
                "orignalFilename"
                ]
              );
              setDocUrl(
                `${REACT_APP_BASE_URL_CLOUDFRONT}/uploads/${parsed_data?.["owner"]?.["user_id"]}/roundtable/${parsed_data?.["_id"]}/document/${parsed_data?.["doc_media"]?.[0]?.["metadata"]?.["tempFilename"]}`
              );
            }
          } catch (err) {
            return;
          }
        }
      }
      // }
    }
  }, []);

  return (
    <>
      <div className="mt-2">
        <div
          onClick={(e) => {
            if (e.target.id !== "delete" && !docImg) {
              hiddenFileInputDoc.current.click();
            }
          }}
          style={{
            padding: "20px",
            height: docs[0]?.type === "application/pdf" ? "800px" : "12rem",
            position: "relative",
          }}
          className="atcdoc d-flex flex-column justify-content-center align-items-center"
        >
          {docImg ? (
            <>
              {docs[0]?.type === "application/pdf" ? (
                <div className="docEmbed">
                  <embed
                    src={(() => {
                      try {
                        return (
                          URL.createObjectURL(docs[0]) + "#toolbar=0&page=1"
                        );
                      } catch (err) {
                        return docUrls + "#toolbar=0&page=1";
                      }
                    })()}
                    style={{
                      width: "100%",
                      height: "700px",
                    }}
                  />
                </div>
              ) : (
                <img alt="" src={docImg} className="imgEmbed" />
              )}

              <div className="docNameIcon">
                <IconButton
                  className="icon"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={
                    docs[0]?.type === "application/pdf"
                      ? {
                        width: 40,
                        height: 40,
                        position: "absolute",
                        bottom: "20px",
                        left: "20px",
                        marginTop: "15px",
                      }
                      : {
                        width: 40,
                        height: 40,
                        marginTop: "15px",
                      }
                  }
                >
                  <img src={DocSvg} alt="" style={{ width: 26, height: 26 }} />
                </IconButton>
                <p
                  className="doc_text"
                  style={
                    docs[0]?.type === "application/pdf"
                      ? {
                        fontWeight: "bold",
                        bottom: "30px",
                        left: "65px",
                        position: "absolute",
                      }
                      : {
                        fontWeight: "bold",
                      }
                  }
                >
                  {" "}
                  {docName}{" "}
                </p>
              </div>
              <IconButton
                className={clsx("icon", {
                  ["appPDF"]: docs[0]?.type === "application/pdf",
                  ["noAppPDF"]: docs[0]?.type !== "application/pdf",
                })}
                onClick={() => {
                  setDocImg(null);
                  if (!url_rt_id) {
                    onDocImageDelete(rt_id, document_name, "doc");
                  } else {
                    setDocDelFlag(true);
                  }
                  setDocs([]);
                  setDocSvg();
                  setDocName("");
                  setPreviousDocument(
                    parsed_data?.["doc_media"]?.[0]?.["metadata"]?.[
                    "tempFilename"
                    ]
                  );
                }}
              >
                <img
                  src={DeleteSVG}
                  alt="delete_icon"
                  id="delete"
                  style={{ width: 38, height: 38 }}
                />
              </IconButton>
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "#63779C",
                  marginTop: "4.5rem",
                  visibility: "hidden",
                }}
              >
                {allWords.misc.pg3.docplaceholder}
              </span>
            </>
          ) : (
            <>
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "#63779C",
                  marginTop: "4rem",
                }}
              >
                {allWords.misc.pg3.docplaceholder}
              </span>
            </>
          )}
        </div>
      </div>

      <input
        type="file"
        accept=".doc,.docx,.pdf,.xlsx,.xls,.ppt,.pptx"
        style={{ visibility: "hidden" }}
        ref={hiddenFileInputDoc}
        onChange={(e) => {
          docValidation(e);
          setDocDelFlag(true);
          if (!url_rt_id) {
            onDocChange(e.target.files[0], rt_id);
          }
        }}
      />
    </>
  );
}
