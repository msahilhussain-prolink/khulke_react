import React from "react";
import styled from "styled-components";
import DownloadSVG from "../../assets/icons/download.svg";
import PdfSVG from "../../assets/images/PDF_file_icon.svg";
import ExcelSVG from "../../assets/images/xls_doc.png";
import PptVG from "../../assets/images/ppt_doc.png";
import WordSVG from "../../assets/images/word_doc.png";
import { IconButton } from "@mui/material";
import ExcelBgIcon from "../../assets/images/excel_bg_icon.png";
import PptBgIcon from "../../assets/images/powerpoint-icon.png";
import WordBgIcon from "../../assets/images/word_bg_icon.png";
import PDFBgIcon from "../../assets/images/PDF_file_icon.svg";
import "./style.css";

const Container = styled.div`
  //   margin-top: 1rem;
  //   margin-bottom: 1.2rem;
  width: 100%;
  .docs_container {
    max-height: 21vh;
    max-width: 100%;
    .img {
      width: 100%;
      // min-height: 200px;
      border-radius: 10px;
    }
    .icon_container {
      position: absolute;
      bottom: 26px;
      left: 75px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: -70px;
    }
  }
`;

const PastDoc = ({
  excelDoc,
  docsFile,
  docsFilePath,
  handle,
  pptDoc,
  wordDoc,
  thumbnail,
}) => {
  return (
    <>
      <Container>
        {handle ? (
          <div className="docs_container">
            {excelDoc && (
              <div
                style={{
                  width: "100%",
                  minWidth: "550px",
                  display: "flex",
                  justifyContent: "center",
                  borderRadius: 4,
                  paddingBottom: "0.4rem",
                  maxHeight: "21vh",
                  position: "relative",
                }}
              >
                <img
                  className="img"
                  style={
                    thumbnail ? { width: "100%" } : { width: 150, height: 220 }
                  }
                  src={thumbnail || ExcelBgIcon}
                  alt=""
                />
              </div>
            )}
            {docsFile && (
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
                <img
                  className="img"
                  style={thumbnail ? { width: "100%" } : { width: 150 }}
                  src={thumbnail || PDFBgIcon}
                  alt=""
                />
              </div>
            )}
            {wordDoc && (
              <div
                style={{
                  width: "100%",
                  minWidth: "550px",
                  display: "flex",
                  justifyContent: "center",
                  borderRadius: 4,
                  paddingTop: "0.4rem",
                  paddingBottom: "0.4rem",
                }}
              >
                <img
                  className="img"
                  style={
                    thumbnail ? { width: "100%" } : { width: 150, height: 150 }
                  }
                  src={thumbnail || WordBgIcon}
                  alt=""
                />
              </div>
            )}
            {pptDoc && (
              <div
                style={{
                  width: "100%",
                  minWidth: "550px",
                  display: "flex",
                  justifyContent: "center",
                  borderRadius: 4,
                  paddingTop: "0.4rem",
                  paddingBottom: "0.4rem",
                }}
              >
                <img
                  className="img"
                  style={
                    thumbnail ? { width: "100%" } : { width: 150, height: 210 }
                  }
                  src={thumbnail || PptBgIcon}
                  alt=""
                />
              </div>
            )}

            <div className="icon_container">
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
                    // backgroundColor: `${docsFile ? "" : "black"}`,
                    padding: "1rem",
                    marginRight: "2rem",
                  }}
                >
                  {pptDoc && (
                    <img src={PptVG} alt="" style={{ width: 38, height: 38 }} />
                  )}
                  {wordDoc && (
                    <img
                      src={WordSVG}
                      alt=""
                      style={{ width: 38, height: 38 }}
                    />
                  )}
                  {excelDoc && (
                    <img
                      src={ExcelSVG}
                      alt=""
                      style={{ width: 38, height: 38 }}
                    />
                  )}
                  {docsFile && (
                    <img
                      src={PdfSVG}
                      alt=""
                      style={{ width: 26, height: 26 }}
                    />
                  )}
                </IconButton>
              </div>
            </div>
          </div>
        ) : (
          <div className="docs_container">
            {excelDoc && (
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
                <img
                  className="img"
                  style={
                    thumbnail
                      ? { width: "100%", maxHeight: "21vh" }
                      : { width: "auto", height: 197 }
                  }
                  src={thumbnail || ExcelBgIcon}
                  alt=""
                />
              </div>
            )}
            {docsFile && (
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
                <img
                  className="img"
                  style={
                    thumbnail
                      ? { width: "100%", maxHeight: "21vh" }
                      : { width: 150 }
                  }
                  src={thumbnail || PDFBgIcon}
                  alt=""
                />
              </div>
            )}
            {wordDoc && (
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
                <img
                  className="img"
                  style={
                    thumbnail
                      ? { width: "100%", maxHeight: "21vh" }
                      : { width: 150 }
                  }
                  src={thumbnail || WordBgIcon}
                  alt=""
                />
              </div>
            )}
            {pptDoc && (
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
                <img
                  className="img"
                  style={
                    thumbnail
                      ? { width: "100%", maxHeight: "21vh" }
                      : { width: "auto", height: 197 }
                  }
                  src={thumbnail || PptBgIcon}
                  alt=""
                />
              </div>
            )}
          </div>
        )}
      </Container>
    </>
  );
};

export default PastDoc;
