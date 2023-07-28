import axios from "axios";
export const getMessages = async(username) => {
  return await axios
    .get(
      `https://gutrgoo.com:10001/messaging/paginate?other_user=${username}&skip=0&limit=10`,
      {
        headers: {
          "device-type": "android",
          "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
        },
      }
    )
    .then()
    .catch();
};

// ** Add message
export const sendMessage = async(formData = {}) => {
  const config = {
    method: "post",
    url: "https://gutrgoo.com:10001/messaging",
    headers: {
      "device-type": "android",
      "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
    },
    data: formData,
  };
  return await axios(config).then().catch();
};

// ** Massage Delete
export const MessageDelete = async(message_id, chat_id, otheruserid) => {
  const data = new FormData();
  data.append("delete_type", "me");
  data.append("message_id", message_id);
  data.append("chat_id", chat_id);
  data.append("otheruserid", otheruserid);
  return await axios({
    method: "post",
    url: "https://gutrgoo.com:10001/messaging/delete-message",
    headers: {
      "device-type": "android",
      "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
    },
    data: data,
  })
    .then()
    .catch();
};

// ALL CHAT DELETE
export const DeleteAllchat = async(message_id, chat_id, otheruserid) => {
  const data = new FormData();
  data.append("delete_type", "channel");
  data.append("message_id", message_id);
  data.append("chat_id", chat_id);
  data.append("otheruserid", otheruserid);
  return await axios({
    method: "post",
    url: "https://gutrgoo.com:10001/messaging/delete-message",
    headers: {
      "device-type": "android",
      "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
    },

    data: data,
  })
    .then()
    .catch();
};

// reply Message
export const replyMessages = async(data = {}) => {
  return await axios({
    method: "post",
    url: "http://gutrgoo.com:10000/messaging",
    headers: {
      "device-type": "android",
      "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
    },
    data: data,
  })
    .then()
    .catch();
};

// forward Messages
export const forwardMessage = async(data = {}) => {
  const axios = require("axios");
  return await axios({
    method: "post",
    url: "https://gutrgoo.com:10001/messaging/message-action",
    headers: {
      "device-type": "android",
      "user-id": JSON.parse(localStorage.getItem("current_user"))["_id"],
    },
    data: data,
  })
    .then()
    .catch();
};
