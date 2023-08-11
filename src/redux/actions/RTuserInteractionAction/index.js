import {
  addLike,
  addDislike,
  addQuote,
  addReply,
  addCirculate,
} from "../../../apis/rtUserInteractionApi";
import {
  open_to_all,
  rt_id,
  rt_name,
  rt_type,
} from "../../../pages/AgoraSandbox/settings";
import { moengageEvent } from "../../../utils/utils";
import * as actionTypes from "../actionTypes";

// ** Handle Like
export const likeStart = () => {
  return {
    type: actionTypes.POST_LIKE_START,
  };
};

export const likeSuccess = (data) => {
  return {
    type: actionTypes.POST_LIKE_SUCCESS,
    payload: data,
  };
};

export const likeFail = (err) => {
  return {
    type: actionTypes.POST_LIKE_FAIL,
    payload: err,
  };
};

export const updateLike = (post_id) => {
  return async (dispatch) => {
    dispatch(likeStart());
    addLike(post_id)
      .then((res) => {
        dispatch(likeSuccess(res.data.data));
      })
      .catch((err) => {
        dispatch(likeFail("ERROR"));
      });
  };
};

// ** User Interaction Handle Dislike
export const dislikeStart = () => {
  return {
    type: actionTypes.POST_DISLIKE_START,
  };
};

export const dislikeSuccess = (data) => {
  return {
    type: actionTypes.POST_DISLIKE_SUCCESS,
    payload: data,
  };
};

export const dislikeFail = (err) => {
  return {
    type: actionTypes.POST_DISLIKE_FAIL,
    payload: err,
  };
};

export const updateDislike = (post_id) => {
  return async (dispatch) => {
    dispatch(dislikeStart());
    addDislike(post_id)
      .then((res) => {
        dispatch(dislikeSuccess(res.data.data));
      })
      .catch((err) => {
        dispatch(dislikeFail("ERROR"));
      });
  };
};

// ** User Interaction Handle Add Post Reply

export const addReplyStart = () => {
  return {
    type: actionTypes.ADD_RT_POST_REPLY_START,
  };
};

export const addReplySuccess = (data) => {
  return {
    type: actionTypes.ADD_RT_POST_REPLY_SUCCESS,
    payload: data,
  };
};

export const addReplyFail = (err) => {
  return {
    type: actionTypes.ADD_RT_POST_REPLY_FAIL,
    payload: err,
  };
};

export const addReplyPost = (formData) => {
  return async (dispatch) => {
    dispatch(addReplyStart());
    addReply(formData)
      .then((res) => {
        moengageEvent("Comment", "RoundTable", {
          RoundTableID: rt_id,
          Name: rt_name,
          "K Type": rt_type,
          "K SubType": open_to_all,
          "Audience Interaction": 1,
          PostID: res?.data?.data?.post?.[0]?.["_id"],
          post_type: res?.data?.data?.post?.[0]?.["type"],
          "Media type": res?.data?.data?.post?.[0]?.["media_type"],
        });

        dispatch(addReplySuccess(res.data));
      })
      .catch((err) => {
        dispatch(addReplyFail("Error"));
      });
  };
};

// ** User Interaction Handle Add Post  Quote
export const quoteStart = () => {
  return {
    type: actionTypes.ADD_RT_POST_QUOTE_START,
  };
};

export const quoteSuccess = (data) => {
  return {
    type: actionTypes.ADD_RT_POST_QUOTE_SUCCESS,
    payload: data,
  };
};

export const quoteFail = (err) => {
  return {
    type: actionTypes.ADD_RT_POST_QUOTE_FAIL,
    payload: err,
  };
};

export const quotePost = (formData, callback) => {
  return async (dispatch) => {
    dispatch(quoteStart());
    addQuote(formData)
      .then((res) => {
        dispatch((res.data.data));
        callback();
        moengageEvent("Quote", "Post", {
          RoundTableID: rt_id,
          Name: rt_name,
          "K Type": rt_type,
          "K SubType": open_to_all,
          "Audience Interaction": 1,
          PostID: res?.data?.data?.post?.[0]?.["_id"],
          post_type: res?.data?.data?.post?.[0]?.["type"],
          "Media type": res?.data?.data?.post?.[0]?.["media_type"],
        });
      })
      .catch((err) => {
        dispatch(quoteFail("ERROR"));
        callback(err);
      });
  };
};

// **  RT Post  Circulate
export const circulateStart = () => {
  return {
    type: actionTypes.ADD_RT_POST_CIRCULATE_START,
  };
};

export const circulateSuccess = (data) => {
  return {
    type: actionTypes.ADD_RT_POST_CIRCULATE_SUCCESS,
    payload: data,
  };
};

export const circulateFail = (err) => {
  return {
    type: actionTypes.ADD_RT_POST_CIRCULATE_FAIL,
    payload: err,
  };
};

export const circulatePost = (post_id, username, user_id) => {
  return async (dispatch) => {
    dispatch(circulateStart());
    addCirculate(post_id)
      .then((res) => {
        moengageEvent("Circulate", "RoundTable", {
          RoundTableID: rt_id,
          Name: rt_name,
          "K Type": rt_type,
          "K SubType": open_to_all,
          "Audience Interaction": 1,
          PostID: res?.data?.data?.post?.[0]?.["_id"],
          post_type: res?.data?.data?.post?.[0]?.["type"],
          "Media type": res?.data?.data?.post?.[0]?.["media_type"],
        });

        dispatch(circulateSuccess(res.data.data));
      })
      .catch((err) => {
        dispatch(circulateFail("Error"));
      });
  };
};
