import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

// API
import { onImageDocChange } from "../../../apis/roundatbleAPI";

// Constants
import { allWords } from "../../../App";

// Redux
import { createEditRoundtableInitialize } from "../../../redux/actions/createEditRoundtable";
import { createRecRtData } from "../../../redux/actions/roundtableAction/createRecRT";
import { createEditData } from "../../../redux/actions/roundtableAction/create_edit_rt";
import { delImgDocData } from "../../../redux/actions/roundtableAction/imgDocDel";
import { invitePanelistData } from "../../../redux/actions/roundtableAction/invitePanelist";
import { logoVideoData } from "../../../redux/actions/roundtableAction/logoVideo";
import { delLogoVideoData } from "../../../redux/actions/roundtableAction/logoVideosDel";
4;

// Utils
import ToastHandler from "../../../utils/ToastHandler";
import { moengageEvent } from "../../../utils/utils";

// Components
import StaticButtonComponent from "../StaticButtonComponent";
import ActionDialog from "./ActionDialog";

// Style
import {
  CancelForEdit,
  CancelPreview,
  CreateStyle,
  CreateStyleForEdit,
} from "../styles";
import "./style.css";
import ConfirmationDialog from "../../ConfirmationDialog";
import { clickHandler } from "../functions";
import BroadCastErrorModal from "../BroadcastErrorModal";
import {
  PLATFORMS,
  PLATFORM_DETAILS,
  fetchLinkedAccounts,
  getLinkedAccounts,
} from "../../../pages/AccountSettings/BroadCast/BroadCastUtils/Configs";
import { Grid, Typography } from "@mui/material";

export default function ActionButtonComponent({ type }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selector = useSelector((state) => state.createEditRoundtable);

  const {
    rtTopic,
    recording,
    schedule,
    dateValue,
    timeValue,
    totalDur,
    rtDescription,
    moderator,
    moderatorIntroduction,
    panelists,
    rtImage,
    durationHr,
    durationMin,
    created_at,
    anonymous,
    rtPlayType,
    rtNature,
    wipRtId,
    urlRtId,
    m_type,
    logo1,
    logo2,
    logo3,
    intro,
    outro,
    logo1Del,
    logo2Del,
    logo3Del,
    introDel,
    outroDel,
    rtType,
    rtImgDel,
    rtDocDel,
    rtDoc,
  } = selector;

  const createRecData = useSelector((state) => state?.createRec?.data?.data);
  const create_edit_rt_data = useSelector((state) => state.create_edit_rt.data);
  const invite_panelist_data = useSelector(
    (state) => state.inviteePanelist.data
  );
  const delLogoVidRed = useSelector((state) => state.delLogoVidRed.data);
  const delete_rt = useSelector((state) => state.delete_rt.data);

  const [confirm_proceed, setConfirmProceed] = useState(false);
  const [confirm_rec, setConfirmRec] = useState(false);
  const [proceed, setProceed] = useState(false);
  const [show_discard, setShowDiscard] = useState(false);
  const [dialogFlag, setDialogFlag] = useState(false);
  const [openBroadCastOptionErrorMenu, setOpenBroadCastOptionErrorMenu] =
    useState(false);
  const [broadcastOptions, setBroadCastOptions] = useState([]);

  let date_obj = new Date();

  const createRecRT = async () => {
    if (rtTopic.length === 0)
      return ToastHandler("warn", allWords.misc.livert.enterValidTitle);

    if (recording === "")
      return ToastHandler("warn", allWords.misc.livert.enterRecordedRT);

    if (broadcastOptions.length > 0) {
      const linkedAccounts = getLinkedAccounts();

      //temporary untill api changes

      const filteredLinkedAccounts = linkedAccounts.find((item) => item.Google);

      if (!filteredLinkedAccounts?.Google.google_username)
        return setOpenBroadCastOptionErrorMenu(true);
    }

    let customDate = null;
    let customTime = null;
    let data1 = null;
    let data2 = null;

    if (schedule !== false) {
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
      .add(totalDur, "seconds")
      .add(5, "seconds")
      .format("yyyy-MM-DDTHH:mm:ss+00:00");

    data1 = {
      name: rtTopic,
      description: rtDescription,
      start_time: start_time,
      end_time: end_time,
      recording_type: recording?.type?.split("/")[0],
      broadcast_destination: broadcastOptions,
    };

    data2 = {
      speakers: [],
      host: moderator?.["value"],
      bio: moderatorIntroduction,
    };

    if (panelists?.length !== 0) {
      data1["external_speakers"] =
        "@" +
        panelists?.[0]?.name?.["label"] +
        " \n " +
        panelists?.[0]?.["introduction"];
    }

    dispatch(
      createRecRtData({
        data1: data1,
        recVid: recording,
        img: rtImage,
        data2: data2,
      })
    );

    dispatch(
      createEditRoundtableInitialize({
        backdropFlag: true,
      })
    );

    setConfirmRec(true);
  };

  const confirmRT = async () => {
    let url = null;
    let data = null;
    let date = moment(new Date()).format("MM/DD/YYYY hh:mm A");
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

    if (
      moment(new Date(customDateTime)).isBefore(new Date(created_at), "hours")
    ) {
      ToastHandler("warn", "Start time can not be in the past.");
      return;
    } else if (
      moment(new Date(customDateTime)).isBefore(new Date(created_at), "minutes")
    ) {
      ToastHandler("warn", "Start time can not be in the past.");
      return;
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
      ToastHandler("warn", "Duration cannot be more than 24 Hours.");
      return;
    }

    if (schedule === true) {
      if (customDateTime === date) {
        endTime = moment
          .utc(new Date(endTime))
          .add(1, "minute")
          .format("yyyy-MM-DDTHH:mm:ss+00:00");
      } else {
        endTime = moment
          .utc(new Date(endTime))
          .format("yyyy-MM-DDTHH:mm:ss+00:00");
      }
    } else {
      endTime = moment
        .utc(new Date(customDateTime))
        .add(parseInt(durationHr?.["value"]), "hours")
        .add(parseInt(durationMin?.["value"]), "minutes")
        .format("yyyy-MM-DDTHH:mm:ss+00:00");
    }

    data = {
      anonymous: anonymous,
      name: rtTopic,
      r_type: rtPlayType + "_streaming",
      visibility:
        rtNature === `${allWords.createRT.optConfi}` ? "secret" : rtNature,
      start_time: moment
        .utc(new Date(customDateTime))
        .format("yyyy-MM-DDTHH:mm:ss+00:00"),
      end_time: endTime,
      description: rtDescription,
      start_recording: 1,
      roundtable_id: wipRtId ?? urlRtId,
      m_type: m_type !== false ? 1 : 0,
      category: [],
      tags: [],
    };

    if (wipRtId) {
      url = "confirm-roundtable";
    } else {
      url = "edit-roundtable";
    }

    dispatch(
      createEditData({
        url: url,
        data: data,
        rt_id: urlRtId,
        org_logo: logo1,
        brand_logo: logo2,
        sub_brand_logo: logo3,
        intro: intro,
        outro: outro,
      })
    );

    setConfirmProceed(true);
  };

  const invitePanel = (rtId = null) => {
    let id = wipRtId ?? urlRtId;
    let data = null;
    let speakers = [];
    panelists?.map((item, index) => {
      let structure = {
        speaker_fullname: item?.name?.value,
        speaker_name: item?.name?.label,
        index: index,
        bio: item?.introduction,
        speaker_id: item?.name?._id,
      };
      speakers.push(structure);
    });
    data = {
      speakers: speakers,
      host: moderator?.label,
      host_name: moderator?.value,
      bio: moderatorIntroduction,
      roundtable_id: id ?? rtId,
    };

    dispatch(invitePanelistData({ data: data }));
    setConfirmProceed(true);
  };

  const delLogoVid = () => {
    dispatch(
      delLogoVideoData({
        logoDelFlag1: logo1Del,
        logoDelFlag2: logo2Del,
        logoDelFlag3: logo3Del,
        ividDelFlag: introDel,
        ovidDelFlag: outroDel,
        rt_id: urlRtId,
      })
    );
    setConfirmProceed(true);
  };

  const createRT = async () => {
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
        rtNature === `${allWords.createRT.optConfi}` ? "secret" : rtNature,
      r_type: rtPlayType + "_streaming",
    };

    setDialogFlag(!dialogFlag);
    dispatch(
      createEditRoundtableInitialize({
        backdropFlag: true,
      })
    );

    dispatch(
      createEditData({
        url: "create-rt",
        data: data,
      })
    );
    setProceed(true);
  };

  const createUpdate = () => {
    if (urlRtId || wipRtId)
      dispatch(
        createEditRoundtableInitialize({
          backdropFlag: true,
        })
      );

    if (rtType === `${allWords.rt.opt3.toLowerCase()}`) createRecRT();
    else {
      if (urlRtId) {
        if (logo1Del || logo2Del || logo3Del || introDel || outroDel)
          delLogoVid();
        else invitePanel();
      } else {
        if (wipRtId) invitePanel();
        else setDialogFlag(true);
      }
    }
  };

  const cancelRT = () => {
    setShowDiscard(true);
  };

  useEffect(() => {
    fetchLinkedAccounts();
  }, []);

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

        invitePanel(create_edit_rt_data?.data?.data?.[0]?.["_id"]);
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

  useEffect(() => {
    if (confirm_proceed === true) {
      if (delete_rt && delete_rt?.status === 200) {
        navigate("/roundtable/all", { replace: true });
        ToastHandler("sus", allWords.misc.deleted_rountable_success);
        moengageEvent("Delete", "RoundTable", {
          RoundTableID: wipRtId,
          Name: rtTopic,
          "K Type": rtPlayType,
          "K SubType": rtNature,
          "Audience Interaction": 0,
        });
      }
    }
  }, [delete_rt]);

  useEffect(() => {
    if (confirm_proceed === true) {
      if (delLogoVidRed && delLogoVidRed?.status === 200) {
        invitePanel();
        dispatch(
          createEditRoundtableInitialize({
            backdropFlag: false,
          })
        );
      }
    }
  }, [delLogoVidRed]);

  useEffect(() => {
    if (confirm_proceed === true)
      if (invite_panelist_data && invite_panelist_data?.status === 200) {
        confirmRT();
      }
  }, [invite_panelist_data]);

  useEffect(() => {
    if (confirm_proceed === true) {
      if (create_edit_rt_data && create_edit_rt_data?.status === 200) {
        if (urlRtId) {
          if (rtImgDel)
            dispatch(
              delImgDocData({
                rt_id: urlRtId,
                fileName: rtImage?.split("/")[8],
              })
            );

          if (rtDocDel)
            dispatch(
              delImgDocData({
                rt_id: urlRtId,
                fileName: rtDoc?.split("/")[8],
              })
            );
        }

        if (rtImage) {
          onImageDocChange({
            rt_id: wipRtId ?? urlRtId,
            imgFile: rtImage,
            file: "image",
          });
        }
        if (rtDoc) {
          onImageDocChange({
            rt_id: wipRtId ?? urlRtId,
            imgFile: rtDoc,
            file: "doc",
          });
        }

        if (!urlRtId) {
          if (logo1 || logo2 || logo3 || intro || outro)
            dispatch(
              logoVideoData({
                logo1: logo1,
                logo2: logo2,
                logo3: logo3,
                ivid: intro,
                ovid: outro,
                rt_id: wipRtId,
              })
            );
        }

        dispatch(
          createEditRoundtableInitialize({
            backdropFlag: false,
          })
        );

        navigate(
          urlRtId
            ? `/roundtable/edit/success/${urlRtId}`
            : "/roundtable/create/success"
        );

        moengageEvent(wipRtId ? "Confirm" : "Edit", "RoundTable", {
          RoundTableID: create_edit_rt_data?.data?.data?.[0]?.["_id"],
          Name: create_edit_rt_data?.data?.data?.[0]?.["name"],
          "K Type": create_edit_rt_data?.data?.data?.[0]?.["r_type"],
          "K SubType": create_edit_rt_data?.data?.data?.[0]?.["open_to_all"],
          "Audience Interaction": 0,
        });
      }
    }
  }, [create_edit_rt_data]);

  useEffect(() => {
    if (confirm_rec === true) {
      if (createRecData && createRecData?.status === 200) {
        dispatch(
          createEditRoundtableInitialize({
            wipRtId: createRecData?.data?.[0]?._id,
            backdropFlag: false,
          })
        );
        moengageEvent("Confirm", "RoundTable", {
          RoundTableID: wipRtId,
          Name: rtTopic,
          "K Type": rtType,
          "K SubType": "Public",
          "Audience Interaction": 0,
        });
        navigate("/roundtable/create/success");
      }
    }
  }, [createRecData]);

  return (
    <>
      {/*Broadcast destination selection for recorded roundtables */}

      {rtType === allWords.rt.opt3.toLowerCase() ? (
        <Grid>
          <Typography
            sx={{
              font: "normal normal bold 14px/16px Work Sans",

              color: "#63779C",
            }}
          >
            Broadcast Destination
          </Typography>

          {Object.keys(PLATFORMS).map((item) => {
            return (
              <div
                className="mt-2"
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="checkbox"
                  style={{
                    padding: "5.5rem",
                    border: "1px solid lightgray",
                    cursor: "pointer",
                  }}
                  checked={broadcastOptions.find(
                    (elem) => elem === PLATFORMS[item]
                  )}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setBroadCastOptions((prev) => {
                        return [...prev, PLATFORMS[item]];
                      });
                    } else {
                      return setBroadCastOptions((prev) =>
                        prev.filter((elem) => elem !== PLATFORMS[item])
                      );
                    }
                  }}
                  onClick={(e) =>
                    dispatch(
                      createEditRoundtableInitialize({
                        broadcastStreaming: e.target.checked,
                      })
                    )
                  }
                />

                <div
                  style={{
                    cursor: "pointer",
                    userSelect: "none",
                    display: "inline",
                    marginLeft: "0.5rem",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {PLATFORM_DETAILS[PLATFORMS[item]].icon}{" "}
                  {PLATFORM_DETAILS[PLATFORMS[item]].shortDisplayName}
                </div>
              </div>
            );
          })}
        </Grid>
      ) : null}
      <div
        className={
          type === "create" ? "row mx-0 mt-3" : "row mx-0 action-comp-div"
        }
      >
        <div className="col-5 col-sm-4 d-none d-xl-block col-xl-4 p-0">
          <StaticButtonComponent
            title={allWords.misc.cancel}
            styles={
              window.location.href.includes("edit")
                ? CancelForEdit
                : CancelPreview
            }
            onClick={cancelRT}
          />
        </div>
        <div className="col-5 col-sm-4 d-block d-xl-none col-xl-4 p-0">
          <Link to={"/preview-rt"} style={{ textDecoration: "none" }}>
            <StaticButtonComponent
              title={allWords.misc.preview}
              styles={CancelPreview}
            />
          </Link>
        </div>
        <div className="col-5 col-sm-3 col-md-4 p-0">
          <StaticButtonComponent
            disabled={
              rtTopic === "" ||
              moderator === "" ||
              moderator === null ||
              (rtPlayType === "" && rtType === "live")
                ? true
                : false
            }
            title={!urlRtId ? allWords.misc.create : allWords.misc.update}
            styles={
              window.location.href.includes("edit")
                ? CreateStyleForEdit
                : CreateStyle
            }
            onClick={createUpdate}
          />
        </div>
      </div>

      <ActionDialog
        show_discard={show_discard}
        setShowDiscard={setShowDiscard}
      />

      <ConfirmationDialog
        open={dialogFlag}
        setOpen={setDialogFlag}
        msg={allWords.misc.you_have_not_uploaded_image}
        label="create_dialog"
        labelYes={allWords.misc.pg3.uplImg}
        labelNo={allWords.misc.continue_to_create}
        custom_yes={() => {
          clickHandler();
          setDialogFlag(!dialogFlag);
          setProceed(true);
        }}
        custom_no={createRT}
      />

      {openBroadCastOptionErrorMenu && (
        <BroadCastErrorModal
          open={openBroadCastOptionErrorMenu}
          setOpen={setOpenBroadCastOptionErrorMenu}
        />
      )}
    </>
  );
}
