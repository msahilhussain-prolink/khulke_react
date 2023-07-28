import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { allWords } from "../../../App";
import { createEditRoundtableInitialize } from "../../../redux/actions/createEditRoundtable";
import "./style.css";

const ButtonComponent = ({ title, icon, reduxKeyName, disabled = false }) => {
  // reduxKeyName => key name you want to store value in redux

  const selector = useSelector(
    (state) => state.createEditRoundtable[reduxKeyName]
  );

  const dispatch = useDispatch();

  const btnHandler = (e) => {
    const { value } = e.target;

    if (reduxKeyName === "rtType") {
      dispatch(
        createEditRoundtableInitialize({
          [reduxKeyName]: value,
          rtPlayType: allWords.rt.opt1.toLowerCase(),
          rtNature: allWords.createRT.optPub.toLowerCase(),
          rtTopic: "",
          rtDescription: "",
          dateValue: moment(new Date()).add(30, "minutes"),
          timeValue: moment(new Date()).add(30, "minutes"),
          urlRtId: null,
          wipRtId: null,
          durationHr: {
            label: `0 ${allWords.misc.livert.h}`,
            value: "0",
          },
          durationMin: {
            label: `30 ${allWords.misc.livert.m}`,
            value: "30",
          },
          durationSec: {
            label: `0 ${allWords.misc.livert.m}`,
            value: "0",
          },
          totalDur: "",
          schedule: true,
          rtImage: "",
          rtImageUrl: "",
          rtImgDel: false,
          logo1: "",
          logo2: "",
          logo3: "",
          intro: "",
          outro: "",
          logo1Del: false,
          logo2Del: false,
          logo3Del: false,
          introDel: false,
          outroDel: false,
          recording: "",
          owner: "",
          moderator: "",
          moderatorIntroduction: "",
          panelists: [],
          rtDoc: "",
          invitesList: {},
          user_data: [],
          phoneList: [],
          emailList: [],
          created_at: "",
          m_type: false,
          backdropFlag: false,
          inviteFollower: false,
          inviteFollowing: false,
          user_id: [],
          past_rtid: [],
          emails: [],
          phones: [],
          anonymous: false,
          rtThumbnailPreview: null,
          logo1Preview: null,
          logo2Preview: null,
          logo3Preview: null,
          introPreview: null,
          outroPreview: null,
          recordingPreview: null,
          docPreview: null,
          isDocPdf: false,
        })
      );
    } else if (reduxKeyName === "rtNature") {
      dispatch(
        createEditRoundtableInitialize({
          [reduxKeyName]: value,
          rtPlayType: "",
          rtTopic: "",
          rtDescription: "",
          dateValue: moment(new Date()).add(30, "minutes"),
          timeValue: moment(new Date()).add(30, "minutes"),
          urlRtId: null,
          wipRtId: null,
          durationHr: {
            label: `0 ${allWords.misc.livert.h}`,
            value: "0",
          },
          durationMin: {
            label: `30 ${allWords.misc.livert.m}`,
            value: "30",
          },
          durationSec: {
            label: `0 ${allWords.misc.livert.m}`,
            value: "0",
          },
          totalDur: "",
          schedule: true,
          rtImage: "",
          rtImageUrl: "",
          rtImgDel: false,
          logo1: "",
          logo2: "",
          logo3: "",
          intro: "",
          outro: "",
          logo1Del: false,
          logo2Del: false,
          logo3Del: false,
          introDel: false,
          outroDel: false,
          recording: "",
          owner: "",
          moderator: "",
          moderatorIntroduction: "",
          panelists: [],
          rtDoc: "",
          invitesList: {},
          user_data: [],
          phoneList: [],
          emailList: [],
          created_at: "",
          m_type: false,
          backdropFlag: false,
          inviteFollower: false,
          inviteFollowing: false,
          user_id: [],
          past_rtid: [],
          emails: [],
          phones: [],
          anonymous: false,
          rtThumbnailPreview: null,
          logo1Preview: null,
          logo2Preview: null,
          logo3Preview: null,
          introPreview: null,
          outroPreview: null,
          recordingPreview: null,
          docPreview: null,
          isDocPdf: false,
        })
      );
    } else {
      dispatch(
        createEditRoundtableInitialize({
          [reduxKeyName]: value,
          rtThumbnailPreview: null,
          rtImageUrl: "",
          rtImage: null,
        })
      );
    }
  };

  return (
    <button
      disabled={disabled}
      type="button"
      className={
        disabled ? "create-edit-btn disabled-button" : "create-edit-btn"
      }
      value={title.toLowerCase()}
      onClick={btnHandler}
      style={
        selector === title.toLowerCase()
          ? { backgroundColor: "var(--success-color)", color: "var(--white)" }
          : null
      }
    >
      {icon ? (
        <img
          src={icon}
          alt="title"
          className="create-edit-icon"
          style={title.toLowerCase() ? { color: "var(--white)" } : null}
        />
      ) : null}
      {title}
    </button>
  );
};

export default ButtonComponent;
