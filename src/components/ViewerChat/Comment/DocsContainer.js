import React from "react";
import styled from "styled-components";
import DownloadSVG from "../../../assets/icons/download.svg";
import PdfSVG from "../../../assets/images/PDF_file_icon.svg";
import ExcelSVG from "../../../assets/images/xls_doc.png";
import PptVG from "../../../assets/images/ppt_doc.png";
import WordSVG from "../../../assets/images/word_doc.png";
import { IconButton } from "@mui/material";
import ExcelBgIcon from "../../../assets/images/excel_bg_icon.png";
import PptBgIcon from "../../../assets/images/powerpoint-icon.png";
import WordBgIcon from "../../../assets/images/word_bg_icon.png";
import PDFBgIcon from "../../../assets/images/PDF_file_icon.svg";
import "../style.css";

const Container = styled.div`
  margin-top: 1rem;
  margin-bottom: 1.2rem;
  width: 100%;
  .docs_container {
    .img {
      width: 100%;
      height: 250px;
      border-radius: 5px;
    }
    .icon_container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      // margin-top: -70px;
    }
  }
`;

const DocsContainer = ({
  excelDoc,
  docsFile,
  docsFilePath,
  handle,
  pptDoc,
  wordDoc,
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
                  display: "flex",
                  justifyContent: "center",
                  borderRadius: 4,
                  paddingTop: "0.4rem",
                  paddingBottom: "0.4rem",
                }}
              >
                <img
                  className="img"
                  style={{ width: 150, height: 220 }}
                  src={ExcelBgIcon}
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
                  style={{ width: 150 }}
                  src={PDFBgIcon}
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
                  style={{ width: 150, height: "auto" }}
                  src={WordBgIcon}
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
                  style={{ width: 150, height: 210 }}
                  src={PptBgIcon}
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
                {excelDoc && <p className="doc_text_vc">{excelDoc}</p>}
                {docsFile && <p className="doc_text_vc">{docsFile}</p>}
                {wordDoc && <p className="doc_text_vc">{wordDoc}</p>}
                {pptDoc && <p className="doc_text_vc">{pptDoc}</p>}
              </div>

              <IconButton
                className="icon"
                component="a"
                href={docsFilePath}
                download
              >
                <img
                  src={DownloadSVG}
                  alt="download"
                  style={{ width: 38, height: 38 }}
                />
              </IconButton>
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
                  style={{ width: "auto", height: 220 }}
                  src={ExcelBgIcon}
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
                  style={{ width: 150 }}
                  src={PDFBgIcon}
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
                  style={{ width: "auto", height: 150 }}
                  src={WordBgIcon}
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
                  style={{ width: "auto", height: 220 }}
                  src={PptBgIcon}
                  alt=""
                />
              </div>
            )}
            <div className="icon_container">
              <div style={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  className="icon"
                  style={{
                    width: 40,
                    height: 40,
                    marginLeft: "0.5rem",
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
                      style={{
                        width: 26,
                        height: 26,
                      }}
                    />
                  )}
                </IconButton>
                {excelDoc && <p className="doc_text_vc">{excelDoc}</p>}
                {docsFile && <p className="doc_text_vc">{docsFile}</p>}
                {wordDoc && <p className="doc_text_vc">{wordDoc}</p>}
                {pptDoc && <p className="doc_text_vc">{pptDoc}</p>}
              </div>

              <IconButton
                className="icon"
                component="a"
                href={docsFilePath}
                download
              >
                <img
                  src={DownloadSVG}
                  alt="download"
                  style={{ width: 38, height: 38 }}
                />
              </IconButton>
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

export default DocsContainer;
