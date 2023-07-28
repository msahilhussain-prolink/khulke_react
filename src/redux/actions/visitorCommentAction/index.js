import { addVisitorComment } from "../../../apis/visitorCommentApi";
import {
  open_to_all,
  rt_id,
  rt_name,
  rt_type,
} from "../../../pages/AgoraSandbox/settings";
import { moengageEvent } from "../../../utils/utils";
import * as actionTypes from "../actionTypes";

// **Add Visitor Comment

export const addCommentStart = () => {
  return {
    type: actionTypes.ADD_VISITOR_COMMENT_START,
  };
};

export const addCommentSuccess = (data) => {
  return {
    type: actionTypes.ADD_VISITOR_COMMENT_SUCCESS,
    payload: data,
  };
};

export const addCommentFail = (err) => {
  return {
    type: actionTypes.ADD_VISITOR_COMMENT_FAIL,
    payload: err,
  };
};

export const addVisitorCommentData = (formData) => {
  return async (dispatch) => {
    dispatch(addCommentStart());
    addVisitorComment(formData)
      .then((res) => {
        if (res.status === 200) {
          moengageEvent("Create", "RoundTable", {
            RoundTableID: rt_id,
            Name: rt_name,
            "K Type": rt_type,
            "K SubType": open_to_all,
            "Audience Interaction": 1,
            PostID: res?.data?.data?.post?.[0]?.["_id"],
            post_type: res?.data?.data?.post?.[0]?.["type"],
            "Media type": res?.data?.data?.post?.[0]?.["media_type"],
          });
          dispatch(addCommentSuccess(res.data));
        }
      })
      .catch((err) => {
        dispatch(addCommentFail(err));
      });
  };
};
