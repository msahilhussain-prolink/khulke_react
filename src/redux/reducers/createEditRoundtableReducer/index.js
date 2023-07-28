import moment from "moment";
import { allWords } from "../../../App";
import { CREATE_EDIT_ROUNDTABLE_INITIALIZE } from "../../actions/actionTypes";

const initialState = {
  rtType: allWords.rt.label2.toLowerCase(),
  rtPlayType: allWords.createRT.videoBtn.toLowerCase(),
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
  arrayId: [],
  broadcastStreaming: false,
};

const createEditRoundtableReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_EDIT_ROUNDTABLE_INITIALIZE:
      if (action.payload.introduction || action.payload.introduction === "") {
        const list = state.panelists.map((el) => {
          if (el.name.label === action.payload.username) {
            const newObj = {
              ...el,
              introduction: action.payload.introduction,
            };

            return newObj;
          } else return el;
        });

        return {
          ...state,
          panelists: list,
        };
      }

      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

export default createEditRoundtableReducer;
