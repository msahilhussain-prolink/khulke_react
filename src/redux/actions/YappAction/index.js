import {
  getMessages,
  sendMessage,
  MessageDelete,
  DeleteAllchat,
  replyMessages,
  forwardMessage,
} from "../../../apis/yappMessageApi";
import * as actionTypes from "../actionTypes";

// ** GET POST
export const getMessgeStart = () => {
  return {
    type: actionTypes.GET_YAPP_MESSAGES_START,
  };
};

export const getMessageSuccess = (data) => {
  return {
    type: actionTypes.GET_YAPP_MESSAGES_SUCCESS,
    payload: data,
  };
};

export const getMessageFail = (err) => {
  return {
    type: actionTypes.GET_YAPP_MESSAGES_FAIL,
    payload: err,
  };
};

export const getMessageData = (username) => {
  return async (dispatch) => {
    dispatch(getMessgeStart());
    getMessages(username)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.data.length > 0) {
            dispatch(getMessageSuccess(res.data));
          }
        }
      })
      .catch((err) => {
        dispatch(getMessageFail(err));
      });
  };
};

// ** ADD messages
export const sendMessageStart = () => {
  return {
    type: actionTypes.SEND_MESSAGES_START,
  };
};

export const sendMessageSuccess = (data) => {
  return {
    type: actionTypes.SEND_MESSAGES_SUCCESS,
    payload: data,
  };
};

export const sendMessageFail = (err) => {
  return {
    type: actionTypes.SEND_MESSAGES_FAIL,
    payload: err,
  };
};

export const sendMessageData = (formData = {}) => {
  return async (dispatch) => {
    dispatch(sendMessageStart());
    sendMessage(formData)
      .then((res) => {
        if (res.status === 200) {
          dispatch(sendMessageSuccess(res.data.message));
        }
      })
      .catch((err) => {
        dispatch(sendMessageFail(err));
      });
  };
};

// ** Message DELETE
export const DeleteMessageStart = () => {
  return {
    type: actionTypes.DELETE_MESSAGES_START,
  };
};

export const DeleteMessageSuccess = (data) => {
  return {
    type: actionTypes.DELETE_MESSAGES_SUCCESS,
    payload: data,
  };
};

export const DeleteMessageFail = (err) => {
  return {
    type: actionTypes.DELETE_MESSAGES_FAIL,
    payload: err,
  };
};

export const messageDeleteData = (message_id, chat_id, otheruserid) => {
  return async (dispatch) => {
    dispatch(DeleteMessageStart());
    MessageDelete(message_id, chat_id, otheruserid)
      .then((res) => {
        if (res.status === 200) {
          dispatch(DeleteMessageSuccess(res.data));
        }
      })
      .catch((err) => {
        dispatch(DeleteMessageFail(err));
      });
  };
};

// ** ALL CHAT DELETE
export const DeleteAllChatStart = () => {
  return {
    type: actionTypes.DELETE_ALL_CHAT_START,
  };
};

export const DeleteAllChatSuccess = (data) => {
  return {
    type: actionTypes.DELETE_ALL_CHAT_SUCCESS,
    payload: data,
  };
};

export const DeleteAllChatFail = (err) => {
  return {
    type: actionTypes.DELETE_ALL_CHAT_FAIL,
    payload: err,
  };
};

export const DeleteAllChatData = (message_id, chat_id, otheruserid) => {
  return async (dispatch) => {
    dispatch(DeleteAllChatStart());
    DeleteAllchat(message_id, chat_id, otheruserid)
      .then((res) => {
        if (res.status === 200) {
          dispatch(DeleteAllChatSuccess(res.data));
        }
      })
      .catch((err) => {
        dispatch(DeleteAllChatFail(err));
      });
  };
};
// ** senD reply messages
export const sendReplyStart = () => {
  return {
    type: actionTypes.SEND_REPLY_MESSAGES_START,
  };
};

export const sendReplySuccess = (data) => {
  return {
    type: actionTypes.SEND_REPLY_MESSAGES_SUCCESS,
    payload: data,
  };
};

export const sendReplyFail = (err) => {
  return {
    type: actionTypes.SEND_REPLY_MESSAGES_FAIL,
    payload: err,
  };
};

export const sendReplyMessageData = (data = {}) => {
  return async (dispatch) => {
    dispatch(sendReplyStart());
    replyMessages(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(sendReplySuccess(res.data.replyMessage));
        }
      })
      .catch((err) => {
        dispatch(sendReplyFail(err));
      });
  };
};

// ** FORWARD messages
export const forwardMessagesStart = () => {
  return {
    type: actionTypes.FORWARD_MESSAGES_START,
  };
};

export const forwardMessagesSuccess = (data) => {
  return {
    type: actionTypes.FORWARD_MESSAGES_SUCCESS,
    payload: data,
  };
};

export const forwardMessagesFail = (err) => {
  return {
    type: actionTypes.FORWARD_MESSAGES_FAIL,
    payload: err,
  };
};

export const forwardMessageData = (data = {}) => {
  return async (dispatch) => {
    dispatch(forwardMessagesStart());
    forwardMessage(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(forwardMessagesSuccess(res.data.forwardMessage));
        }
      })
      .catch((err) => {
        dispatch(forwardMessagesFail(err));
      });
  };
};
