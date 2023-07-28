import React, { useEffect, useState } from "react";
import "../style.css";

import DeleteSVG from "../../../../assets/icons/edit_rt_imgs_icon.svg";
import { useRef } from "react";
import ToastHandler from "../../../../utils/ToastHandler";
import { useDispatch, useSelector } from "react-redux";
import { createEditRoundtableInitialize } from "../../../../redux/actions/createEditRoundtable";
import { IconButton } from "@mui/material";
import { allWords } from "../../../../App";
import moment from "moment";
import { moengageEvent } from "../../../../utils/utils";
import { createEditData } from "../../../../redux/actions/roundtableAction/create_edit_rt";
import { clickHandler } from "../../functions";

// THE NAMES BELOW ARE SAME KEY PAIRS USED IN THE REDUCER. IF ANY CHANGE IS MADE, MAKE SURE SAME NAME IS USED IN THE REDUCER TOO

// uploadType = rtImage => for image of rt
// uploadType = logo1 => for logo1 of rt
// uploadType = logo2 => for logo2 of rt
// uploadType = logo3 => for logo3 of rt

const ImagePreviewComponent = ({ text, uploadType }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.createEditRoundtable);
  const rtThumbnailPreview = useSelector(
    (state) => state.createEditRoundtable.rtThumbnailPreview
  );
  const imgPreview = useSelector(
    (state) => state.createEditRoundtable[`${uploadType}Preview`]
  );
  const create_edit_rt_data = useSelector((state) => state.create_edit_rt.data);

  const {
    urlRtId,
    wipRtId,
    rtTopic,
    rtNature,
    rtPlayType,
    schedule,
    dateValue,
    timeValue,
    durationHr,
    durationMin,
    anonymous,
  } = selector;

  const imgRef = useRef(null);

  useEffect(() => {
    console.log({ imgRefs: imgRef });
  }, [imgRef]);
  const [proceed, setProceed] = useState(false);

  let date_obj = new Date();

  const createRT = async () => {
    if (rtTopic === "") {
      return ToastHandler("warn", allWords.misc.livert.enterValidTitle);
    }
    let date = moment(date_obj).format("MM/DD/YYYY hh:mm A");

    // Validation for time
    let customDate = null;
    let customTime = null;
    if (schedule !== false) {
      customDate = moment(new Date(dateValue)).format("MM/DD/YYYY");
      customTime = moment(new Date(timeValue)).format("hh:mm A");
    } else {
      customDate = moment(new Date()).format("MM/DD/YYYY");
      customTime = moment(new Date()).add(1, "minute").format("hh:mm A");
    }
    let customDateTime = customDate.concat(" ").concat(customTime);

    // Validation for Duration
    let endTime = null;
    endTime = moment(new Date(customDateTime))
      .add(parseInt(durationHr?.["value"]), "hours")
      .add(parseInt(durationMin?.["value"]), "minutes")
      .format("MM/DD/YYYY hh:mm A");

    if (!urlRtId && !wipRtId) {
      if (moment(customDateTime).isBefore(date_obj, "hours")) {
        ToastHandler("warn", "Start time can not be in the past.");
        return;
      } else if (moment(customDateTime).isBefore(date_obj, "minutes")) {
        ToastHandler("warn", "Start time can not be in the past.");
        return;
      }
    }

    if (
      Math.abs(
        moment(new Date(endTime)).diff(new Date(customDateTime), "minutes")
      ) < 29
    ) {
      ToastHandler("warn", "Duration cannot be less than 30 Minutes.");
      return;
    }

    if (
      Math.abs(
        moment(new Date(endTime)).diff(
          new Date(customDateTime),
          "hours",
          "minutes"
        )
      ) > 24
    ) {
      ToastHandler("Duration cannot be more than 24 Hours.");
      return;
    }

    if (customDateTime === date) {
      if (schedule === true) {
        ToastHandler("warn", "Start time can not be same as current time.");
        return;
      }
    }

    let data = {
      name: rtTopic,
      start_time: moment
        .utc(new Date(customDateTime))
        .format("yyyy-MM-DDTHH:mm:ss+00:00"),
      end_time:
        customDateTime === date
          ? moment
              .utc(new Date(endTime))
              .add(1, "minute")
              .format("yyyy-MM-DDTHH:mm:ss+00:00")
          : moment.utc(new Date(endTime)).format("yyyy-MM-DDTHH:mm:ss+00:00"),
      anonymous: anonymous,
      visibility:
        rtNature === `${allWords.createRT.optConfi.toLowerCase()}`
          ? "secret"
          : rtNature,
      r_type: rtPlayType + "_streaming",
    };

    dispatch(
      createEditData({
        url: "create-rt",
        data: data,
      })
    );
    setProceed(true);
  };

  const logoHandler = (ref) => {
    ref.current.click();
  };

  const changeHandler = (e, type) => {
    const imgFile = e.target.files[0];

    if (imgFile) {
      if (type === "rtImage") {
        if (Math.round(imgFile?.size / 1024) > 1024 * 15) {
          ToastHandler("warn", allWords.misc.toastMsg.less_than_15mb_file);
          e.target.value = null;
          return false;
        }
      } else {
        if (Math.round(imgFile?.size / 1024) > 1024 * 1) {
          ToastHandler("warn", "Upload an image less than 1 MB.");
          e.target.value = null;
          return false;
        }
      }
    }
    if (!imgFile?.name.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG)$/)) {
      ToastHandler("warn", allWords.misc.toastMsg.invalidImgFormat);
      return false;
    }

    if (uploadType === "rtImage") {
      if (!urlRtId && !wipRtId) createRT();

      if (rtTopic !== "")
        return dispatch(
          createEditRoundtableInitialize({
            rtThumbnailPreview: URL.createObjectURL(imgFile),
            rtImageUrl: URL.createObjectURL(imgFile),
            rtImage: imgFile,
          })
        );
    }

    let val = {
      [uploadType]: imgFile,
      [`${uploadType}Preview`]: URL.createObjectURL(imgFile),
    };

    dispatch(createEditRoundtableInitialize(val));
  };

  const removeHandler = () => {
    if (uploadType === "rtImage") {
      return dispatch(
        createEditRoundtableInitialize({
          rtImageUrl: "",
          rtImgDel: true,
          rtThumbnailPreview: null,
          rtImage: null,
        })
      );
    }
    dispatch(
      createEditRoundtableInitialize({
        [uploadType]: "",
        [uploadType + "Del"]: true,
        [uploadType + "Preview"]: null,
      })
    );
  };

  useEffect(() => {
    if (create_edit_rt_data && proceed) {
      if (create_edit_rt_data.status === 200) {
        dispatch(
          createEditRoundtableInitialize({
            wipRtId: create_edit_rt_data?.data?.data?.[0]?.["_id"],
            owner: create_edit_rt_data?.data?.data?.[0]?.["owner"],
            rtPlayType: rtPlayType,
            created_at: create_edit_rt_data?.data?.data?.[0]?.["created_at"],
          })
        );

        moengageEvent("Create", "RoundTable", {
          RoundTableID: create_edit_rt_data?.data?.data?.[0]?.["_id"],
          Name: create_edit_rt_data?.data?.data?.[0]?.["name"],
          "K Type": create_edit_rt_data?.data?.data?.[0]?.["r_type"],
          "K SubType": create_edit_rt_data?.data?.data?.[0]?.["open_to_all"],
          "Audience Interaction": 0,
        });
      } else {
        if (create_edit_rt_data?.status === 253) {
          if (
            create_edit_rt_data?.data?.message !==
            "Start time of the roundtable has to be at least 30 minutes from now."
          ) {
            try {
              ToastHandler("warn", create_edit_rt_data?.data?.message?.message);
            } catch (err) {
              ToastHandler("warn", "Duration can not be less than 30 minutes");
            }
          }
        }
        if (create_edit_rt_data?.status === 252) {
          ToastHandler("warn", create_edit_rt_data?.data?.message);
        }
      }
    }
  }, [create_edit_rt_data]);

  return (
    <>
      {uploadType === "rtImage" ? (
        rtThumbnailPreview ? (
          <div
            style={{
              width: "9.5rem",
              height: "9rem",
              position: "relative",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              alt=""
              src={rtThumbnailPreview}
              style={{
                width: "100%",
                height: "100%",
                maxWidth: "9.5rem",
                maxHeight: "7rem",
                borderRadius: "10px",
                color: "transparent",
                objectFit: "cover",
              }}
              onError={() => {
                dispatch(
                  createEditRoundtableInitialize({
                    rtImageUrl: "",
                    rtImgDel: true,
                    rtThumbnailPreview: null,
                  })
                );
              }}
            />

            <IconButton className="icon icon-btn-position">
              <img
                src={DeleteSVG}
                alt="delete_icon"
                id="delete"
                className="delete-icon-for-thumbnail"
                onClick={removeHandler}
              />
            </IconButton>
          </div>
        ) : (
          <>
            <div
              className="thumbnail-parent"
              style={{
                backgroundImage:
                  uploadType === "rtImage"
                    ? `url(/assets/icons/thumbnail_img.svg)`
                    : `url(/assets/icons/thumbnail_logo.svg)`,
              }}
              onClick={() => clickHandler(imgRef)}
            >
              <span className="thumbnail-text">{text}</span>
            </div>
            <input
              id="thumbnail-parent-id"
              type="file"
              accept={"image/*"}
              style={{ visibility: "hidden" }}
              ref={imgRef}
              onChange={(e) => changeHandler(e, uploadType)}
            />
          </>
        )
      ) : imgPreview ? (
        <div
          style={{
            width: "9.5rem",
            height: "9rem",
            position: "relative",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            alt=""
            src={imgPreview}
            style={{
              width: "100%",
              height: "100%",
              maxWidth: "9.5rem",
              maxHeight: "7rem",
              borderRadius: "10px",
              color: "transparent",
              objectFit: "cover",
            }}
            onError={() => {
              if (uploadType === "rtImage") {
                dispatch(
                  createEditRoundtableInitialize({
                    [uploadType]: "",
                    [uploadType + "Del"]: true,
                    [uploadType + "Preview"]: null,
                  })
                );
              }
            }}
          />

          <IconButton className="icon icon-btn-position">
            <img
              src={DeleteSVG}
              alt="delete_icon"
              id="delete"
              className="delete-icon-for-thumbnail"
              onClick={removeHandler}
            />
          </IconButton>
        </div>
      ) : (
        <>
          <div
            className="thumbnail-parent"
            style={{
              backgroundImage:
                uploadType === "rtImage"
                  ? `url(/assets/icons/thumbnail_img.svg)`
                  : `url(/assets/icons/thumbnail_logo.svg)`,
            }}
            onClick={() => logoHandler(imgRef)}
          >
            <span className="thumbnail-text">{text}</span>
          </div>
          <input
            type="file"
            accept={"image/*"}
            style={{ visibility: "hidden" }}
            ref={imgRef}
            onChange={(e) => changeHandler(e, uploadType)}
          />
        </>
      )}
    </>
  );
};

export default ImagePreviewComponent;
