import { IconButton } from "@mui/material";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import imgIcon from "../../../../assets/icons/imgthumbnail.svg";
import { createEditRoundtableInitialize } from "../../../../redux/actions/createEditRoundtable";
import ToastHandler from "../../../../utils/ToastHandler";
import { validDocType } from "../../../../utils/utils";
import "../style.css";

import EditIcon from "../../../../assets/icons/edit_rt_imgs_icon.svg";
import ExcelIcon from "../../../../assets/images/excel_bg_icon.png";
import PptIcon from "../../../../assets/images/powerpoint-icon.png";
import DocIcon from "../../../../assets/images/word_bg_icon.png";
import { allowed_extensions } from "../../../../data";
import { allWords } from "../../../../App";

// THE NAMES BELOW ARE SAME KEY PAIRS USED IN THE REDUCER. IF ANY CHANGE IS MADE, MAKE SURE SAME NAME IS USED IN THE REDUCER TOO

// uploadType = rtDoc => for doc of rt

const DocPreviewComponent = ({ text = "Please enter text", uploadType }) => {
  const dispatch = useDispatch();

  const docSel = useSelector((state) => state.createEditRoundtable.rtDoc);
  const docPreview = useSelector(
    (state) => state.createEditRoundtable.docPreview
  );
  const isDocPdf = useSelector((state) => state.createEditRoundtable.isDocPdf);

  const docRef = useRef(null);

  const clickHandler = () => {
    docRef.current.click();
  };

  const changeHandler = (e) => {
    const docFile = e.target.files[0];

    let filePath = docFile?.name;

    if (!docFile) {
      ToastHandler("warn", allWords.misc.review.nodoc);
      return false;
    }

    // Allowing file type
    var allowedExtensions = /(\.pdf|\.xls|\.xlsx|\.doc|\.docx|\.ppt|\.pptx)$/i;
    if (!allowedExtensions.exec(filePath)) {
      ToastHandler(
        "warn",
        "Invalid file format. Please upload pdf, doc, ppt, xlx files."
      );
      e.target.value = null;
      return false;
    }
    if (docFile) {
      let size = docFile.size;
      if (Math.round(size / 1024) > 1024 * 15) {
        ToastHandler("warn", allWords.misc.toastMsg.less_than_15mb_file);
        e.target.value = null;
        return false;
      }
    }

    const is_valid_document = validDocType(docFile.name, allowed_extensions);

    if (!is_valid_document || ![...e.target.files]) {
      ToastHandler("warn", "Please select valid documents.");
      return dispatch(
        createEditRoundtableInitialize({
          docPreview: null,
          isDocPdf: false,
          [uploadType]: null,
        })
      );
    }

    if (
      docFile.type === "application/msword" ||
      docFile.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      dispatch(
        createEditRoundtableInitialize({
          docPreview: DocIcon,
          isDocPdf: false,
          [uploadType]: docFile,
        })
      );
    } else if (
      docFile.type === "application/vnd.ms-powerpoint" ||
      docFile.type ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      dispatch(
        createEditRoundtableInitialize({
          docPreview: PptIcon,
          isDocPdf: false,
          [uploadType]: docFile,
        })
      );
    } else if (
      docFile.type === "application/vnd.ms-excel" ||
      docFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      dispatch(
        createEditRoundtableInitialize({
          docPreview: ExcelIcon,
          isDocPdf: false,
          [uploadType]: docFile,
        })
      );
    } else {
      dispatch(
        createEditRoundtableInitialize({
          docPreview: null,
          isDocPdf: true,
          [uploadType]: docFile,
        })
      );
    }
  };

  const removeHandler = () => {
    dispatch(
      createEditRoundtableInitialize({
        [uploadType + "Del"]: "",
        docPreview: null,
        [uploadType]: null,
        isDocPdf: false,
      })
    );
  };

  return (
    <>
      {docPreview || (isDocPdf && docSel) ? (
        <div className="rt-doc-preview-parent">
          {docSel?.type === "application/pdf" ? (
            <div className="docEmbed">
              <embed
                src={(() => {
                  try {
                    return URL.createObjectURL(docSel) + "#toolbar=0&page=1";
                  } catch (err) {
                    return docUrls + "#toolbar=0&page=1";
                  }
                })()}
                style={{
                  width: "100%",
                  maxHeight: "7rem",
                }}
              />
            </div>
          ) : (
            <img
              alt=""
              src={docPreview}
              className="imgEmbed"
              style={{ width: "100%" }}
            />
          )}

          <IconButton
            className={clsx("icon", {
              ["appPDF"]: docSel?.type === "application/pdf",
              ["noAppPDF"]: docSel?.type !== "application/pdf",
            })}
            style={{
              position: "relative",
              bottom: isDocPdf ? "9rem" : "7rem",
              left: "6rem",
            }}
            onClick={removeHandler}
          >
            <img
              src={EditIcon}
              alt="delete_icon"
              id="delete"
              className="delete-icon-for-thumbnail"
            />
          </IconButton>
        </div>
      ) : (
        <>
          <div
            className="thumbnail-parent"
            style={{
              backgroundImage: `url(/assets/icons/thumbnail_doc.svg)`,
            }}
            onClick={clickHandler}
          >
            <span className="thumbnail-text">{text}</span>
          </div>
          <input
            type="file"
            accept=".doc,.docx,.pdf,.xlsx,.xls,.ppt,.pptx"
            style={{ visibility: "hidden" }}
            ref={docRef}
            onChange={(e) => changeHandler(e)}
          />
        </>
      )}
    </>
  );
};

export default DocPreviewComponent;
