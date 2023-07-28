import {
  GET_BKK_POSTS_SUCCESS,GET_BKK_POSTS_FAILURE,
} from "../actionTypes";
import { getBKKPostsAPI } from "../../../apis/bkkApi";


const getBKKPostsSuccess = (BKKPosts) => ({
  type: GET_BKK_POSTS_SUCCESS,
  payload: BKKPosts,
});

const getBKKPostsFailure = (err) => ({
  type: GET_BKK_POSTS_FAILURE,
  payload: err,
});

export const getBKKPosts = (skip, postId = "", profilePath = "") => {
  return async (dispatch) => {
    try {
      const posts = await getBKKPostsAPI(skip, postId, profilePath);
      dispatch(getBKKPostsSuccess(posts.data.data));
    } catch (err) {
      dispatch(getBKKPostsFailure(err));
    }
  };
};
