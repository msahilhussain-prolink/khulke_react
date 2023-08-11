import { allWords } from "../../../App";
import {getPost, addPost, addLike, addDislike, addCirculate, addQuote, addReply, postDelete, postMute} from "../../../apis/postApi";
import { open_to_all, rt_id, rt_name, rt_type,} from "../../../pages/AgoraSandbox/settings";
import ToastHandler from "../../../utils/ToastHandler";
import { moengageEvent } from "../../../utils/utils";
import * as actionTypes from "../actionTypes";
// ** GET POST
export const getPostStart = () => {
  return {
    type: actionTypes.GET_POST_START,
  };
};
export const getPostSuccess = (data) => {
  return {
    type: actionTypes.GET_POST_SUCCESS,
    payload: data,
  };
};
export const getPostFail = (err) => {
  return {
    type: actionTypes.GET_POST_FAIL,
    payload: err,
  };
};
export const getPostData = (limit) => {
  return async (dispatch) => {
    dispatch(getPostStart());
    getPost(limit)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.data.old_post.length > 0) {
            dispatch(getPostSuccess(res.data));
          }
        }
      })
      .catch((err) => {
        dispatch(getPostFail(err));
      });
  };
};
// ** ADD POST
export const addPostStart = () => {
  return {
    type: actionTypes.ADD_POST_START,
  };
};
export const addPostSuccess = (data) => {
  return {
    type: actionTypes.ADD_POST_SUCCESS,
    payload: data,
  };
};
export const addPostFail = (err) => {
  return {
    type: actionTypes.ADD_POST_FAIL,
    payload: err,
  };
};
export const addPostData = (formData, comp, callback) => {
  return async (dispatch) => {
    dispatch(addPostStart());
    addPost(formData)
      .then((res) => {
        if (res.status === 200) {
          dispatch(addPostSuccess(res.data.data.post));
           callback({data: res.data.data.post});
             moengageEvent("Create", comp === "" ? "Post" : "Snip-It", {
            PostID: res?.data?.data?.post?.["_id"],
            "K Type": res?.data?.data?.post?.["type"],
            "Media type": res?.data?.data?.post?.["media_type"],
          });
        }
      })
      .catch((err) => {
        dispatch(addPostFail(err));
        callback({err});
      });
  };
};
// ** Handle Like
export const likeStart = () => {
  return {
    type: actionTypes.LIKE_START,
  };
};
export const likeSuccess = (data) => {
  return {
    type: actionTypes.LIKE_SUCCESS,
    payload: data,
  };
};

export const likeFail = (err) => {
  return {
    type: actionTypes.LIKE_FAIL,
    payload: err,
  };
};
export const updateLike = (post_id, type, data) => {
  return async (dispatch) => {
    dispatch(likeStart());
    addLike(post_id, type)
      .then((res) => {
        dispatch(likeSuccess(res.data.data));
        moengageEvent("Like", "Post", data);
      })
      .catch((err) => {
        dispatch(likeFail("ERROR"));
      });
  };
};
// ** Handle Dislike
export const dislikeStart = () => {
  return {
    type: actionTypes.DISLIKE_START,
  };
};
export const dislikeSuccess = (data) => {
  return {
    type: actionTypes.DISLIKE_SUCCESS,
    payload: data,
  };
};
export const dislikeFail = (err) => {
  return {
    type: actionTypes.DISLIKE_FAIL,
    payload: err,
  };
};
export const updateDislike = (post_id, user_id, data) => {
  return async (dispatch) => {
    dispatch(dislikeStart());
    addDislike(post_id)
      .then((res) => {
        dispatch(dislikeSuccess(res.data.data));
        moengageEvent("DisLike", "Post", data);
      })
      .catch((err) => {
        dispatch(dislikeFail("ERROR"));
      });
  };
};
// ** Quote Post
export const quoteStart = () => {
  return {
    type: actionTypes.ADD_QUOTE_START,
  };
};
export const quoteSuccess = (data) => {
  //  console.log("actionTypes.ADD_QUOTE_SUCCESS123",actionTypes.ADD_QUOTE_SUCCESS)

  return {
    type: actionTypes.ADD_QUOTE_SUCCESS,
    payload: data,
  };
};
export const quoteFail = (err) => {
  return {
    type: actionTypes.ADD_QUOTE_FAIL,
    payload: err,
  };
};
export const quotePost = (formData, username, user_id,callback) => {
  return async (dispatch) => {
    dispatch(quoteStart());
  addQuote(formData)
  .then((res) => {
    if (res.status === 200) {
      // console.log("formDataadd",res.data.data.post)
          dispatch(quoteSuccess(res.data.data));
        // dispatch(addPostSuccess(res.data.data.post));
       callback({data: res.data.data.post});

       moengageEvent("Quote", "Post", {
                PostID: res?.data?.data?.post?.[0]?.["_id"],
                "K Type": res?.data?.data?.post?.[0]?.["type"],
                "Media type": res?.data?.data?.post?.[0]?.["media_type"],
              });
    }
  })
  .catch((err) => {
   dispatch(quoteFail("ERROR"));
    callback({err});
  });

  };
};
// ** Circulate Post
export const circulateStart = () => {
  return {
    type: actionTypes.ADD_CIRCULATE_START,
  };
};
export const circulateSuccess = (data) => {
  return {
    type: actionTypes.ADD_CIRCULATE_SUCCESS,
    payload: data,
  };
};
export const circulateFail = (err) => {
  return {
    type: actionTypes.ADD_CIRCULATE_FAIL,
    payload: err,
  };
};
export const circulatePost = (post_id, param2, post_type, media_type) => {
  return async (dispatch) => {
    dispatch(circulateStart());
    addCirculate(post_id)
      .then((res) => {
        dispatch(circulateSuccess(res.data.data));
          moengageEvent("Circulate", "Post", {
          PostID: res?.data?.data?.["post_id"],
          "K Type": post_type,
          "Media type": media_type,
          Status: param2,
        });
        return res.data.data
      }
      )
      .catch((err) => {
        dispatch(circulateFail("Error"));
      });
  };
};
// ** Add Reply Post
export const addReplyStart = () => {
  return {
    type: actionTypes.ADD_REPLY_START,
  };
};
export const addReplySuccess = (data) => {
  return {
    type: actionTypes.ADD_REPLY_SUCCESS,
    payload: data,
  };
};
export const addReplyFail = (err) => {
  return {
    type: actionTypes.ADD_REPLY_FAIL,
    payload: err,
  };
};
export const addReplyPost = (formData, comp, callback) => {
  return async (dispatch) => {
    dispatch(addReplyStart());
    addReply(formData)
      .then((res) => {
        if (res.status === 200){
             dispatch(addReplySuccess(res.data.data.post));
         callback({data: res.data.data.post});
          moengageEvent("Comment", comp === "SNIPPET" ? "Snip-It" : "Post", {
           PostID: res?.data?.data?.post?.[0]?.["_id"],
           "K Type": res?.data?.data?.post?.[0]?.["type"],
           "Media type": res?.data?.data?.post?.[0]?.["media_type"],
         });
       }
      })
      .catch((err) => {
        dispatch(addReplyFail("Error"));
        callback({err});
      });
  };
};
// ** POST DELETE
export const postDeleteStart = () => {
  return {
    type: actionTypes.DELETE_START,
  };
};
export const postDeleteSuccess = (data) => {
  return {
    type: actionTypes.DELETE_SUCCESS,
    payload: data,
  };
};
export const postDeleteFail = (err) => {
  return {
    type: actionTypes.DELETE_FAIL,
    payload: err,
  };
};
export const postDeleteData = (post_id,label,is_roundtable = false,post_type,post_media_type
) => {
  return async (dispatch) => {
    dispatch(postDeleteStart());
    // console.log("1234567",post_id, is_roundtable)
    postDelete(post_id, is_roundtable)
      .then((res) => {
       if (res.status === 200) {
          ToastHandler(
            "sus",
            label === "SNIPPET"
              ? allWords.misc.deleted_snip_success
              : label === "K3"
              ? allWords.misc.deleted_khabar_success
              : label === "BKK"
              ? allWords.misc.deleted_Bol_success
              :allWords.misc.deleted_post_success
          );
          if (!is_roundtable) {
            moengageEvent("Delete", "Post", {
              PostID: post_id,
              "K Type": post_type,
              "Media type": post_media_type,
            });
          } else {
            moengageEvent("Delete", "RoundTable", {
              RoundTableID: rt_id,
              Name: rt_name,
              "K Type": rt_type,
              "K SubType": open_to_all,
              "Audience Interaction": 1,
              PostID: post_id,
              post_type: post_type,
              "Media Type": post_media_type,
            });
          }
          dispatch(postDeleteSuccess(res.data));
        }
      })
      .catch((err) => {
        dispatch(postDeleteFail(err));
      });
  };
};
// ** POST Mute
export const postMuteStart = () => {
  return {
    type: actionTypes.MUTE_START,
  };
};

export const postMuteSuccess = (data) => {
  return {
    type: actionTypes.MUTE_SUCCESS,
    payload: data,
  };
};

export const postMuteFail = (err) => {
  return {
    type: actionTypes.MUTE_FAIL,
    payload: err,
  };
};
export const postMuteData = (user_id, post_id) => {
  return async (dispatch) => {
    dispatch(postMuteStart());
    postMute(user_id, post_id)
      .then((res) => {
        if (res.status === 200) {
          dispatch(postMuteSuccess(res.data));
        }
      })
      .catch((err) => {
        dispatch(postMuteFail(err));
      });
  };
};
