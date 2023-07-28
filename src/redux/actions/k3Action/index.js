import {
  GET_K3_POSTS_SUCCESS,GET_K3_POSTS_FAILURE,
} from "../actionTypes";
import { getK3PostsAPI } from "../../../apis/k3APi";


const getK3PostsSuccess = (K3Posts) => ({
  type: GET_K3_POSTS_SUCCESS,
  payload: K3Posts,
});

const getK3PostsFailure = (err) => ({
  type: GET_K3_POSTS_FAILURE,
  payload: err,
});

export const getK3Posts = (skip, postId = "", profilePath = "") => {
  return async (dispatch) => {
    try {
      const posts = await getK3PostsAPI(skip, postId, profilePath);
      dispatch(getK3PostsSuccess(posts.data.data));
    } catch (err) {
      dispatch(getK3PostsFailure(err));
    }
  };
};
