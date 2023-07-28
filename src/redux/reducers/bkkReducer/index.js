import {GET_BKK_POSTS_SUCCESS, GET_BKK_POSTS_FAILURE} from "../../actions/actionTypes";

// Initial state for the K3 posts
const initialState = {
  bkkPosts: [],
  error: null,
};

const bkkPostsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BKK_POSTS_SUCCESS:
      return {
        ...state,
        bkkPosts: action.payload,
        error: null,
      };
    case GET_BKK_POSTS_FAILURE:
      return {
        ...state,
        bkkPosts: [],
        error: action.payload,
      };
    default:
      return state;
  }
};

export default bkkPostsReducer;