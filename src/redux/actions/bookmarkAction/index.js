import { postBookmark } from "../../../apis/bookmarkApi";
import * as actionTypes from "../actionTypes";

// ** POST Bookmar
export const postBookmarStart = () => {
  return {
    type: actionTypes.BOOKMARK_START,
  };
};

export const postBookmarSuccess = (data) => {
  return {
    type: actionTypes.BOOKMARK_SUCCESS,
    payload: data,
  };
};

export const postBookmarFail = (err) => {
  return {
    type: actionTypes.BOOKMARK_FAIL,
    payload: err,
  };
};

export const postBookmarkData = (post_id) => {
  return async (dispatch) => {
    dispatch(postBookmarStart());
    postBookmark(post_id)
      .then((res) => {
        if (res.status === 200) {
          dispatch(postBookmarSuccess(res.data));
        }
      })
      .catch((err) => {
        dispatch(postBookmarFail(err));
      });
  };
};
