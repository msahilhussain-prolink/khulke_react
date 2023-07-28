import axios from "axios";
import { motion } from "framer-motion";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allWords } from "../../App";

// Material UI
import {
  Backdrop,
  CircularProgress,
  DialogContent,
  DialogContentText,
  IconButton,
  Typography,
} from "@mui/material";
import ErrorDialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

// Component
import Dialog from "../../components/LeftSideBar/Dialog";

// Style
import "../../pages/RoundTable/Confirm/style.css";
import { CancelBtn } from "./style";

// Redux
import { createEditData } from "../../redux/actions/roundtableAction/create_edit_rt";
import { deleteRtData } from "../../redux/actions/roundtableAction/deleteRT";
import { invitePanelistData } from "../../redux/actions/roundtableAction/invitePanelist";
import { inviteVisitorData } from "../../redux/actions/roundtableAction/inviteVisitor";
import ToastHandler from "../../utils/ToastHandler";

import { CancelOutlined } from "@material-ui/icons";
import {
  REACT_APP_BASE_URL_FOR_ROUNDTABLE,
  REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1,
} from "../../constants/env";
import { getRTSingleData } from "../../redux/actions/roundtableAction/single_roundtable";
import { moengageEvent } from "../../utils/utils";

export default function RoundTableAction(props) {
  const {
    status,
    progress_name,
    parsed_data,
    current_user,
    url_rt_id,
    setHasError,
    rt_id,
    sendData,
    invitation_code,
    wip_rt_id,
    setLoading,
    setFinalMessage,
    setParsedData,
    startError,
    setStartError,
    timeValue,
    setTimeValue,
    transferRightFlag,
    categories,
    tags,
    dateValue,
    durationHr,
    durationMin,
    onImageChange,
    imgDelFlag,
    onDocChange,
    onDocImageDelete,
    docDelFlag,
    doc_target_files,
    img,
    navigate,
    logo1,
    logo2,
    logo3,
    ivid,
    ovid,
    logoDelFlag1,
    logoDelFlag2,
    logoDelFlag3,
    ividDelFlag,
    ovidDelFlag,
    disableRecord,
    recVid,
    setSendData,
    recVidRef,
  } = props;

  const dispatch = useDispatch();

  // Global State
  const delete_rt = useSelector((state) => state.delete_rt.data);
  const create_edit_rt_data = useSelector((state) => state.create_edit_rt.data);
  const create_edit_rt_error = useSelector(
    (state) => state.create_edit_rt.error
  );
  const create_edit_rt_load = useSelector(
    (state) => state.create_edit_rt.loading
  );

  const invite_panelist_data = useSelector(
    (state) => state.inviteePanelist.data
  );
  const invite_visitor_data = useSelector((state) => state.inviteVisitor.data);

  const [show_delete, setShowDelete] = useState(false);
  const [show_discard, setShowDiscard] = useState(false);
  const [confirm_proceed, setConfirmProceed] = useState(false);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [backdropOpen, setBackdropOpen] = useState(false);

  const inviteVisitor = () => {
    let data = null;
    try {
      data = JSON.stringify({
        data: [
          {
            following: sendData["following"],
            roundtable_id: rt_id,
            followers: sendData["followers"],
            user_id: sendData["user_id"],
            past_rtid: sendData["past_rtid"],
            emails: sendData["email_list"],
            phones: sendData["phone_list"],
          },
        ],
      });

      dispatch(inviteVisitorData({ data: data }));
    } catch (error) {
      return;
    }
    setLoading(false);
  };

  const invitePanel = () => {
    let data = null;
    data = {
      speakers: sendData["speakers"],
      host: sendData["host"],
      bio: sendData["bio"],
      roundtable_id: url_rt_id,
    };

    dispatch(invitePanelistData({ data: data }));
  };

  useEffect(() => {
    if (invite_panelist_data) {
      if (invite_panelist_data?.status === 200) {
        setFinalMessage("");
      } else {
        setFinalMessage(invite_panelist_data?.data?.message);
      }
    }

    if (invite_visitor_data) {
      if (invite_visitor_data?.status === 200) {
        setFinalMessage("");
      } else {
        setFinalMessage(invite_visitor_data?.data?.message);
      }
    }
  }, [invite_panelist_data, invite_visitor_data]);

  const logoVideos = () => {
    const data = new FormData();
    if (logo1?.length !== 0) {
      data.append("org_logo", logo1);
      data.append("org_logo_position", "bottom left");
    }
    if (logo2?.length !== 0) {
      data.append("brand_logo", logo2);
      data.append("brand_logo_position", "top right");
    }
    if (logo3?.length !== 0) {
      data.append("sub_brand_logo", logo3);
      data.append("sub_brand_logo_position", "top left");
    }
    if (ivid?.length !== 0) {
      data.append("intro", ivid);
    }
    if (ovid?.length !== 0) {
      data.append("outro", ovid);
    }
    data.append("roundtable_id", rt_id);
    const config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/upload/media`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
        "Content-Type": "multipart/form-data",
      },
      data: data,
    };

    setUploadingFiles(true);
    setBackdropOpen(true);
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          navigate("/roundtable/create/success");
          setUploadingFiles(false);
          setBackdropOpen(false);
        }
      })
      .catch();
  };

  const deleteLogoVideos = () => {
    const formData = new FormData();

    if (logoDelFlag1 === true) {
      formData.append("org_logo_delete", logoDelFlag1);
    }
    if (logoDelFlag2 === true) {
      formData.append("brand_logo_delete", logoDelFlag2);
    }
    if (logoDelFlag3 === true) {
      formData.append("sub_brand_logo_delete", logoDelFlag3);
    }
    if (ividDelFlag === true) {
      formData.append("intro_delete", ividDelFlag);
    }
    if (ovidDelFlag === true) {
      formData.append("outro_delete", ovidDelFlag);
    }

    const config = {
      method: "delete",
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE}/media-delete/${rt_id}`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
      },
      data: formData,
    };
    setUploadingFiles(true);
    setBackdropOpen(true);
    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          setUploadingFiles(false);
          setBackdropOpen(false);
          ConfirmRT();
        }
      })
      .catch();
  };

  const ConfirmRT = () => {
    let url = "";
    let data = null;
    let date = moment(new Date()).format("MM/DD/YYYY hh:mm A");
    let customDate = null;
    let customTime = null;
    if (sendData?.["schedule"] !== false) {
      customDate = moment(new Date(dateValue)).format("MM/DD/YYYY");
      customTime = moment(new Date(timeValue)).format("hh:mm A");
    } else {
      customDate = moment(new Date()).format("MM/DD/YYYY");
      customTime = moment(new Date()).add(1, "minute").format("hh:mm A");
    }
    let customDateTime = customDate.concat(" ").concat(customTime);

    if (sendData?.["schedule"] === true) {
      if (startError === false) {
        if (moment(new Date(customDateTime)).isBefore(new Date())) {
          setStartError(true);
          setErrorOpen(true);
          setTimeValue(customDateTime);
        }
      }
    }

    let dhr = [];
    let dmin = [];

    if (sendData?.["durationHr"] === undefined) {
      let timeout = new Date(parsed_data?.["end"]?.split("+")?.[0]).getTime();
      let now = new Date(parsed_data?.["start"]?.split("+")?.[0]).getTime();
      const total = timeout - now;
      const minutes = Math.floor((total / 1000 / 60) % 60);
      const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
      dhr = hours;
      dmin = minutes;
    } else {
      dhr = parseInt(durationHr?.["hr_value"]?.["label"]);
      dmin = parseInt(durationMin?.["min_value"]?.["label"]);
    }

    let endTime = null;
    endTime = moment(new Date(customDateTime))
      .add(parseInt(durationHr?.["hr_value"]?.["label"]), "hours")
      .add(parseInt(durationMin?.["min_value"]?.["label"]), "minutes")
      .format("MM/DD/YYYY hh:mm A");

    data = {
      anonymous:
        sendData?.["anonymous"] !== undefined ? sendData?.["anonymous"] : false,
      name: sendData?.["name"],
      date:
        sendData?.["schedule"] !== false
          ? moment(dateValue).format("MM/DD/YYYY")
          : moment(new Date()).format("MM/DD/YYYY"),
      r_type: sendData?.["r_type"],
      visibility:
        sendData?.["open_to_all"] !== undefined
          ? sendData?.["open_to_all"]
          : parsed_data?.["open_to_all"],
      open_to_all:
        sendData?.["open_to_all"] !== undefined
          ? sendData?.["open_to_all"]
          : parsed_data?.["open_to_all"],
      // Reference for UTC
      start_time: moment
        .utc(new Date(customDateTime))
        .format("yyyy-MM-DDTHH:mm:ss+00:00"),
      end_time:
        sendData?.["schedule"] === false
          ? moment
              .utc(new Date(customDateTime))
              .add(parseInt(durationHr?.["hr_value"]?.["label"]), "hours")
              .add(parseInt(durationMin?.["min_value"]?.["label"]), "minutes")
              .format("yyyy-MM-DDTHH:mm:ss+00:00")
          : customDateTime === date
          ? moment
              .utc(new Date(endTime))
              .add(1, "minute")
              .format("yyyy-MM-DDTHH:mm:ss+00:00")
          : moment.utc(new Date(endTime)).format("yyyy-MM-DDTHH:mm:ss+00:00"),

      durationHr: durationHr?.["hr_value"]?.["label"],
      durationMin: durationMin?.["min_value"]?.["label"],
      category: categories,
      tags: tags,
      description: sendData?.["description"],
      followers: sendData?.["followers"],
      following: sendData?.["following"],
      past_rtid: sendData?.["past_rtid"],
      email_list: sendData?.["email_list"],
      phone_list: sendData?.["phone_list"],
      speakers: sendData?.["speakers"],
      host: sendData?.["host"],
      host_name: sendData?.["host_name"],
      bio: sendData?.["bio"],
      roundtable_id: rt_id,
      roundtable_code: invitation_code,
      start_recording: sendData?.["start_recording"],
      m_type: transferRightFlag !== false ? 1 : 0,
    };

    if (wip_rt_id) {
      url = "confirm-roundtable";
    } else {
      url = "edit-roundtable";
    }

    dispatch(
      createEditData({
        url: url,
        data: data,
        rt_id: rt_id,
        org_logo: logo1,
        brand_logo: logo2,
        sub_brand_logo: logo3,
        intro: ivid,
        outro: ovid,
        date: sendData?.["date"],
        start_time: sendData?.["start_time"],
      })
    );
    setBackdropOpen(true);
    setConfirmProceed(true);
  };

  useEffect(() => {
    if (confirm_proceed === true) {
      if (create_edit_rt_data) {
        if (create_edit_rt_data.status === 200) {
          dispatch(
            getRTSingleData({
              rt_id: rt_id,
              token:
                localStorage.access ||
                JSON.parse(localStorage.anonymous_user).token,
            })
          );
          setFinalMessage("");
          inviteVisitor();
          setParsedData(create_edit_rt_data?.data?.data?.[0]);
          // setProgress("step6")
          setUploadingFiles(false);
          setBackdropOpen(false);
          if (!url_rt_id) {
            setFinalMessage("");
            setHasError(false);
            logoVideos();
          } else {
            if (wip_rt_id) {
              logoVideos();
            }
            invitePanel();
          }

          moengageEvent(wip_rt_id ? "Confirm" : "Edit", "RoundTable", {
            RoundTableID: create_edit_rt_data?.data?.data?.[0]?.["_id"],
            Name: create_edit_rt_data?.data?.data?.[0]?.["name"],
            "K Type": create_edit_rt_data?.data?.data?.[0]?.["r_type"],
            "K SubType": create_edit_rt_data?.data?.data?.[0]?.["open_to_all"],
            "Audience Interaction": 0,
          });

          if (!url_rt_id) {
            if (
              logo1?.length === 0 &&
              logo2?.length === 0 &&
              logo3?.length === 0 &&
              ivid?.length === 0 &&
              ovid?.length === 0
            ) {
              navigate("/roundtable/create/success");
            }
          } else {
            if (wip_rt_id) {
              if (
                logo1?.length === 0 &&
                logo2?.length === 0 &&
                logo3?.length === 0 &&
                ivid?.length === 0 &&
                ovid?.length === 0
              ) {
                navigate("/roundtable/create/success");
              }
            } else {
              navigate(`/roundtable/edit/success/${url_rt_id}`);
            }
          }
          if (imgDelFlag === true) {
            onImageChange(rt_id, img);
            if (parsed_data?.["media"]?.length > 0) {
              onDocImageDelete(
                rt_id,
                parsed_data?.["media"]?.[0]?.["metadata"]?.["tempFilename"],
                "image"
              );
            }
          }
          if (docDelFlag === true) {
            onDocChange(doc_target_files, rt_id);
            if (parsed_data?.["doc_media"]?.length > 0) {
              onDocImageDelete(
                rt_id,
                parsed_data?.["doc_media"]?.[0]?.["metadata"]?.["tempFilename"],
                "doc"
              );
            }
          }
        } else {
          setFinalMessage(create_edit_rt_data.data.message);
        }

        if (create_edit_rt_load) {
          setUploadingFiles(true);
        }
      }
    }
  }, [create_edit_rt_data]);

  useEffect(() => {
    if (deleteFlag === true) {
      if (delete_rt) {
        if (delete_rt.status === 200 || delete_rt.status === 253) {
          setHasError(false);
          if (progress_name === "") {
            setShowDelete(false);
          } else {
            setShowDiscard(false);
          }
          navigate("/roundtable/all", { replace: true });
          ToastHandler("sus", allWords.misc.deleted_rountable_success);
          moengageEvent("Delete", "RoundTable", {
            RoundTableID: sendData?.["_id"] || parsed_data?.["_id"],
            Name: sendData?.["name"] || parsed_data?.["name"],
            "K Type": sendData?.["r_type"]?.includes("Audio")
              ? "audio"
              : sendData?.["r_type"]?.includes("Video")
              ? "video"
              : "",
            "K SubType": sendData?.["open_to_all"],
            "Audience Interaction": 0,
          });
        } else {
          setHasError(true);
        }
      }
    }
  }, [delete_rt]);

  const handleClose = () => {
    setErrorOpen(false);
  };

  function confirmRecRt() {
    const formData = new FormData();
    let customDate = null;
    let customTime = null;
    let data1 = null;
    let data2 = null;

    if (sendData?.["schedule"] !== false) {
      customDate = moment(new Date(dateValue)).format("MM/DD/YYYY");
      customTime = moment(new Date(timeValue)).format("hh:mm A");
    } else {
      customDate = moment(new Date()).format("MM/DD/YYYY");
      customTime = moment(new Date()).add(1, "minute").format("hh:mm A");
    }
    let customDateTime = customDate.concat(" ").concat(customTime);
    let start_time = moment
      .utc(new Date(customDateTime))
      .format("yyyy-MM-DDTHH:mm:ss+00:00");
    let end_time = moment
      .utc(new Date(customDateTime))
      .add(recVidRef?.current?.duration, "seconds")
      .add(5, "seconds")
      .format("yyyy-MM-DDTHH:mm:ss+00:00");

    data1 = {
      name: parsed_data?.["name"],
      description: parsed_data?.["description"],
      // Temporary committed for 02 Jan release
      start_time: start_time,
      end_time: end_time,
      // start_time: sendData?.["start_time"],
      // end_time: sendData?.["end_time"],
      recording_type:
        parsed_data?.["r_type"] === "VIDEO_STREAMING" ? "video" : "audio",
    };
    data2 = {
      speakers: [],
      host: sendData?.["moderator"]?.["username"],
      bio: sendData?.["moderator"]?.["bio"],
    };

    if (sendData?.["speakers"]?.length !== 0) {
      data1["external_speakers"] =
        "@" +
        sendData?.["speakers"]?.[0]?.["speaker_fullname"] +
        " \n " +
        sendData?.["speakers"]?.[0]?.["bio"];
    }

    formData.append("data", JSON.stringify(data1));
    formData.append("audio/video", recVid);
    if (img?.length !== 0) {
      formData.append("image", img);
    }
    formData.append("panelist_data", JSON.stringify(data2));
    const config = {
      method: "post",
      url: `${REACT_APP_BASE_URL_FOR_ROUNDTABLE_V1}/create_rt_media/`,
      headers: {
        Authorization: `Bearer ${localStorage.access}`,
      },
      data: formData,
    };

    setBackdropOpen(true);
    axios(config)
      .then(function (response) {
        setBackdropOpen(false);
        if (response?.status === 200) {
          navigate("/roundtable/create/success", {
            state: { recorded_rt: true },
          });
          let data3 = {
            roundtable_id: response?.data?.data?.[0]?._id,
          };
          moengageEvent("Confirm", "RoundTable", {
            RoundTableID: response?.data?.data?.[0]?._id,
            Name: parsed_data?.["name"],
            "K Type": parsed_data?.["r_type"],
            "K SubType": "Public",
            "Audience Interaction": 0,
          });
          dispatch(
            getRTSingleData({
              rt_id: response?.data?.data?.[0]?.["_id"],
              token:
                localStorage.access ||
                JSON.parse(localStorage.anonymous_user).token,
            })
          );
          setSendData({ ...data1, ...data2, ...data3 });
        } else {
          ToastHandler("warn", response?.data?.message);
        }
      })
      .catch(function (error) {});
  }

  return (
    <>
      {status === "upcoming" && (
        <>
          {progress_name === "confirm" ? (
            <>
              {(parsed_data?.moderator.m_type === "co-owner" &&
                parsed_data?.moderator?.user_id === current_user?.["_id"]) ||
              parsed_data?.["owner"]?.["user_id"] === current_user?.["_id"] ||
              wip_rt_id ? (
                <>
                  <br />
                  <div className="rt-actions-div">
                    <CancelBtn
                      style={{ marginTop: "1rem" }}
                      onClick={() => {
                        setShowDiscard(true);
                      }}
                    >
                      {allWords.misc.livert.dis}
                    </CancelBtn>{" "}
                    &nbsp;&nbsp;
                    <button
                      className="proceed_btn"
                      onClick={() => {
                        if (disableRecord === false) {
                          if (wip_rt_id) {
                            ConfirmRT();
                          } else {
                            if (
                              logoDelFlag1 === false &&
                              logoDelFlag2 === false &&
                              logoDelFlag3 === false &&
                              ividDelFlag === false &&
                              ovidDelFlag === false
                            ) {
                              ConfirmRT();
                            } else {
                              deleteLogoVideos();
                            }
                          }
                        } else {
                          confirmRecRt();
                        }
                      }}
                    >
                      {allWords.misc.livert.pro}
                      {uploadingFiles && <CircularProgress size={20} />}
                    </button>
                  </div>
                </>
              ) : null}
            </>
          ) : null}
        </>
      )}

      {(status === "upcoming" || status === "past") &&
        progress_name === "" &&
        parsed_data?.["owner"]?.["user_id"] === current_user["_id"] && (
          <>
            <br />
            <div style={{}}>
              <CancelBtn
                style={{ marginTop: "1rem" }}
                onClick={() => {
                  setShowDelete(true);
                }}
              >
                {allWords.misc.livert.del?.toUpperCase()}
              </CancelBtn>{" "}
            </div>
          </>
        )}

      {/* Delete RT */}
      <Dialog
        title={allWords.misc.confDel}
        open={show_delete}
        setOpen={setShowDelete}
        onCloseBtnClick={() => {
          setShowDelete(false);
        }}
      >
        <div className="text-center container-fluid">
          <h6>
            <strong>{allWords.misc.conf}</strong>
            <div className="d-flex justify-content-between py-5">
              <CancelBtn
                style={{ marginTop: "1rem" }}
                // className="leave-btn"
                onClick={() => {
                  dispatch(deleteRtData({ rt_id: rt_id }));
                  setDeleteFlag(true);
                }}
              >
                {allWords.th.disbtnOption1.split(",")[0]}
                <span className="i_sure">
                  , {allWords.th.disbtnOption1.split(",")[1]}
                </span>
              </CancelBtn>
              <button
                style={{ marginTop: "1rem" }}
                className="alt-blk-btn"
                onClick={() => {
                  setShowDelete(false);
                }}
              >
                {allWords.th.disbtnOption2.split(",")[0]}
                <span className="i_sure">
                  , {allWords.th.disbtnOption2.split(",")[1]}
                </span>
              </button>
            </div>
          </h6>
        </div>
      </Dialog>

      {/* Discard RT */}
      <Dialog
        title={"Discard RoundTable"}
        open={show_discard}
        setOpen={setShowDiscard}
        onCloseBtnClick={() => {
          setShowDiscard(false);
        }}
      >
        <div className="text-center container-fluid">
          <h6>
            <strong>{allWords.misc.confdiscard}</strong>
            <div className="d-flex justify-content-between py-5">
              <CancelBtn
                style={{ marginTop: "1rem" }}
                onClick={() => {
                  setShowDiscard(false);
                  if (disableRecord == false) {
                    if (!url_rt_id) {
                      dispatch(deleteRtData({ rt_id: rt_id }));
                      setDeleteFlag(true);
                    } else {
                      navigate("/roundtable/all", { replace: true });
                    }
                  } else {
                    navigate("/roundtable/all", { replace: true });
                  }
                }}
              >
                {allWords.th.disbtnOption1.split(",")[0]}
                <span className="i_sure">
                  , {allWords.th.disbtnOption1.split(",")[1]}
                </span>
              </CancelBtn>
              <button
                style={{ marginTop: "1rem" }}
                className="alt-blk-btn"
                onClick={() => {
                  setShowDiscard(false);
                }}
              >
                {allWords.th.disbtnOption2.split(",")[0]}
                <span className="i_sure">
                  , {allWords.th.disbtnOption2.split(",")[1]}
                </span>
              </button>
            </div>
          </h6>
        </div>
      </Dialog>

      {/* Start Time Error */}
      <ErrorDialog
        maxWidth="550px"
        open={errorOpen}
        onClose={handleClose}
        PaperProps={{
          style: { borderRadius: 16, width: "436px" },
        }}
      >
        <DialogTitle style={{ textAlign: "end" }}>
          <div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.1, opacity: 0.8 }}
            >
              <IconButton
                id="close_button"
                onClick={() => setErrorOpen(false)}
                style={{ width: 50, height: 50 }}
              >
                <CancelOutlined />
              </IconButton>
            </motion.div>
          </div>
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            <Typography
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                color: "#161F3A",
                marginLeft: "2rem",
              }}
            >
              {allWords.misc.stover}
            </Typography>
            <Typography
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                color: "#161F3A",
                marginLeft: "2rem",
              }}
            >
              {allWords.misc.kindlywait}
            </Typography>
            <br />
          </DialogContentText>
        </DialogContent>
      </ErrorDialog>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdropOpen}
        // onClick={handleClose}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress color="inherit" />
          <Typography style={{ fontWeight: "bold" }}>
            {disableRecord === true
              ? "Please do not close your browser while we are uploading file."
              : "Confirming your RoundTable"}
          </Typography>
        </div>
      </Backdrop>
    </>
  );
}
