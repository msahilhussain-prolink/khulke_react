/* eslint-disable default-case */
import * as actionTypes from "../../actions/actionTypes";

const initialState = {
  data: "",
  loading: false,
  error: null,
  message: null,
  messageDeleteRes: null,
  allChatdelete: null,
  replyMessage: "",
  forwardMessage: "",
};

const YappReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_YAPP_MESSAGES_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.GET_YAPP_MESSAGES_SUCCESS:
      return {
        ...state,
        data: action.payload,
        loading: false,
      };
    case actionTypes.GET_YAPP_MESSAGES_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
        data: "",
      };
    // ** Add Messages
    case actionTypes.SEND_MESSAGES_START:
      return {
        ...state,
        loading: true,
        message: null,
      };
    case actionTypes.SEND_MESSAGES_SUCCESS:
      return {
        ...state,
        message: action.payload,
        loading: false,
      };
    case actionTypes.SEND_MESSAGES_FAIL:
      return {
        ...state,
        loading: false,
      };
    // ** Message Delete
    case actionTypes.DELETE_MESSAGES_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.DELETE_MESSAGES_SUCCESS:
      return {
        ...state,
        messageDeleteRes: action.payload,
        loading: false,
      };
    case actionTypes.DELETE_MESSAGES_FAIL:
      return {
        ...state,
        loading: false,
      };
    // ** ALL CHAT Delete
    case actionTypes.DELETE_ALL_CHAT_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.DELETE_ALL_CHAT_SUCCESS:
      return {
        ...state,
        allChatdelete: action.payload,
        loading: false,
      };
    case actionTypes.DELETE_ALL_CHAT_FAIL:
      return {
        ...state,
        loading: false,
      };
    // ** send Reply Messages
    case actionTypes.SEND_REPLY_MESSAGES_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.SEND_REPLY_MESSAGES_SUCCESS:
      return {
        ...state,
        replyMessage: action.payload,
        loading: false,
      };
    case actionTypes.SEND_REPLY_MESSAGES_FAIL:
      return {
        ...state,
        loading: false,
      };
    // ** FORWARD Messages
    case actionTypes.FORWARD_MESSAGES_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.FORWARD_MESSAGES_SUCCESS:
      return {
        ...state,
        forwardMessage: action.payload,
        loading: false,
      };
    case actionTypes.FORWARD_MESSAGES_FAIL:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

export default YappReducer;
